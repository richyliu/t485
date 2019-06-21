import Database from "../../server/Database";
import { Authenticator, User } from "../../server/Authenticator";
import { Directory, DirectoryKeys } from "../../Directory";
import Scout from "../../contact/Scout";
import $ from "jquery";
import PageState from "../../utils/PageState";
import "bootstrap";
import "bootstrap-select";

PageState.init();

let db = new Database();
let auth = new Authenticator();

const readablePatrolMap = {
    DRAGON: "Dragons",
    WILDCAT: "Wildcats",
    SERPENT: "Serpents",
    CACTI: "Cacti",
    BLOBFISH: "Blobfish",
    HAWK: "Hawks",
};

auth.onAuthStateChanged(function(user) {
    if (user) {
        if (!user.emailVerified) {

            $("#main-box").addClass("hidden");
            $("#verify-box").removeClass("hidden");
        } else {
            init(user);
        }
    } else {
        $("#loading").addClass("hidden");
        $("#auth").removeClass("hidden");
    }
});

function init(user: User) {
    db.ref("/directory/keys").once("value").then(function(snapshot) {
        let data = snapshot.val();
        let editId = data.editId;
        let keys: DirectoryKeys;

        keys = {
            id: data.id,
            api: data.api,
            sheets: data.sheets,
            range: "A2:X",

        };

        let directory = new Directory(keys);
        let inDirectory = false;
        directory.update(function(scout: Scout, id: number) {
            let type = [scout.email, scout.father ? scout.father.email : null, scout.mother ? scout.mother.email : null].indexOf(user.email);
            let userData = scout;
            //console.log(scout, type, user.email);
            if (type === -1) {
                return;
            }
            inDirectory = true;
            if (type === 0) {
                $(".if-scout-show").removeClass("hidden");
                for (let i = 0; i < userData.jobs.length; i++) {
                    $(".setup-user-job").append(`<span>${userData.jobs[i]}</span>${i !== userData.jobs.length - 1 ? "<br>" : ""}`);
                }
            } else {
                userData = scout[["father", "mother"][type - 1]];
            }
            $(".setup-user-firstName").text(userData.firstName);
            $(".setup-user-lastName").text(userData.lastName);
            $(".setup-user-patrol").text(readablePatrolMap[userData.patrol]);
            $(".setup-user-email").text(userData.email);
            $(".setup-user-accountType").text(type === 0 ? "Scout" : "Parent");
            $(".link-google-sheet-dir").attr("href", `https://docs.google.com/spreadsheets/d/${editId}/edit`);
            $("#loading-box").addClass("hidden");
            $("#dataReview-box").removeClass("hidden");

            $("#confirm").click(function() {
                $("#dataReview-box").addClass("hidden");
                $("#saving-box").removeClass("hidden");
                if (type === 0) {
                    db.ref("/users/" + user.uid + "/data/").set({
                        lastUpdated: {
                            utc: new Date().getTime(),
                            string: Date() + "",
                        },
                        setupComplete:true,
                        name: {
                            first: userData.firstName,
                            last: userData.lastName,
                        },
                        email: userData.email,
                        jobs: userData.jobs,
                        type: type === 0 ? "Scout" : "Parent",
                    }).then(function() {
                        user.updateProfile({
                            displayName: userData.firstName + " " + userData.lastName,
                        }).then(function() {
                            // Update successful.
                            $("#saving-box").addClass("hidden");
                            $("#success-box").removeClass("hidden");
                        });
                    });
                }
            });

        }).then(function() {
            if (!inDirectory) {
                $("#loading").addClass("hidden");
                $("#notfound-box").removeClass("hidden");
            }
        });
    });
}