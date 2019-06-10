import Database from "../server/Database";
// import Authenticator from "../server/Authenticator";
import { Directory, DirectoryKeys } from "../Directory";
import Scout from "../contact/Scout";
import PhoneNumber from "../contact/PhoneNumber";
import $ from "jquery";
import List from "list.js";
import PageState from "../utils/PageState";
import Query from "../utils/Query";
import URL from "../utils/URL";
import Authenticator from "../server/Authenticator";
import HTML from "../utils/HTML";
import "bootstrap";
import "bootstrap-select";


PageState.init();

const directoryKeymap = [
    ["scout", "firstName"], ["scout", "lastName"], ["scout", "email"], ["scout", "homePhone"], ["scout", "slack"],
    ["scout", "jobA"], ["scout", "jobB"], ["scout", "joinDate"], ["scout", "active"], ["scout", "WFATrained"],
    ["scout", "cellPhone"],
    ["father", "firstName"], ["father", "lastName"], ["father", "cellPhone"], ["father", "email"], ["father", "slack"],
    ["mother", "firstName"], ["mother", "lastName"], ["mother", "cellPhone"], ["mother", "email"], ["mother", "slack"],
];
/**
 * First string in each element is the full name, the last (which can also be the first) string is the short version.
 */
const columnKeymap = [
    [["Scout\'s First Name"], ["Scout\'s Last Name"], ["Patrol"], ["Scout\'s E-mail"], ["Scout\'s Home Phone"], ["Slack Username"],
        ["Troop Jobs"], ["Date Joined Troop 485", "Join Date"], ["Active (Y)es/ (R)arely/ (A)ged Out/ (N)o", "Active"], ["Wilderness First Aid Trained", "WFA Trained"],
        ["Scout\'s Cell Phone"]],
    [["Father\'s First Name"], ["Father\'s Last Name"], ["Father\'s Cell Phone"], ["Father\'s E-mail"], ["Father\'s Slack Username or None"]],
    [["Mother\'s First Name"], ["Mother\'s Last Name"], ["Mother\'s Cell Phone"], ["Mother\'s E-mail"], ["Mother\'s Slack Username or None"]],
];

const readablePatrolMap = {
    DRAGON: "Dragons",
    WILDCAT: "Wildcats",
    SERPENT: "Serpents",
    CACTI: "Cacti",
    BLOBFISH: "Blobfish",
    HAWK: "Hawks",
};
const defaultShown = [[0, 1, 2, 3, 4, 10], [], []];
const unknownText = `<i>Unknown</i>`;
const noneText = `<i>N/A</i>`;

let db = new Database();
let start = new Date().getTime();
let list;

let auth = new Authenticator();
auth.onAuthStateChanged(function(user) {
    if (user) {
        init();
    } else {
        $("#loading").addClass("hidden");
        $("#auth").removeClass("hidden");
    }
});

function init() {
    $("#loading").addClass("hidden");
    $("#directory").removeClass("hidden");
    loadHeaders();
    loadData(function(list: List) {
        loadFilterSelects(list);
    });


}


function loadHeaders() {
    let colNum = 0;

    for (let i = 0; i < columnKeymap.length; i++) {
        for (let j = 0; j < columnKeymap[i].length; j++, colNum++) {
            $("#dir-head-inner").append(`
				<th scope="col" class="col-${colNum} header">${columnKeymap[i][j][columnKeymap[i][j].length - 1]}</th>
			`);
        }
    }
}

function toString(obj: any, italciseUnknown: boolean = true) {
    // Alternative to if/else
    switch (true) {
            // We treat "" as undefined
        case obj === "":
        case typeof obj === "undefined":

            return italciseUnknown ? unknownText : "Unknown";
            break;
        case obj === null:
            return italciseUnknown ? noneText : "None";
            break;
        case typeof obj === "string":
            return obj;
            break;
        case typeof obj === "number":
        case obj instanceof PhoneNumber: // Explicitly type it out for clarity and in the method changes.
            return obj.toString();
            break;
        default:
            try {
                return obj.toString();
            } catch (e) {
                return unknownText;
            }
    }
}

function loadData(callback: (list: List) => void) {
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
        let load = (cache) => {
            $(".link-google-sheet-dir").attr("href", `https://docs.google.com/spreadsheets/d/${editId}/edit`);

            let directory = new Directory(keys, directoryKeymap, cache);
            directory.update(function(scout: Scout, id: number) {
                let row = [];
                for (let i = 0; i < directoryKeymap.length; i++) {
                    let index = i;
                    let value = "";
                    if (i > 2) {
                        // We add the patrol, but it's not in the keymap
                        index--;
                    }
                    if (i > 6) {
                        // In the slot that would contain jobA, we list both jobs, so we skip the jobB.
                        index++;
                    }
                    if (i == 2) {

                        value = ["Dragons", "Serpents", "Blobfish", "Hawks", "Wildcats", "Cacti"]
                                [["DRAGON", "SERPENT", "BLOBFISH", "HAWK", "WILDCAT", "CACTI"].indexOf(scout.patrol)];
                    } else if (directoryKeymap[index][1] === "jobA") {
                        if (!(scout.jobs) || scout.jobs[0] == "") {
                            value = unknownText;
                        } else if (scout.jobs[0] == "N/A") {
                            value = "N/A";
                        } else if (scout.jobs.length > 1 && (scout.jobs[1] == "N/A" || scout.jobs[1] == "")) {
                            value = scout.jobs[0];
                        } else {
                            value = scout["jobs"].join(", ");
                        }
                    } else if (directoryKeymap[index][0] == "scout") {
                        value = toString(scout[directoryKeymap[index][1]]);
                    } else {
                        // If the property is of the scout, and not the parents, or the property is of a non-null parent
                        // of the scout, then we convert it to a string.
                        value = (directoryKeymap[index][0] == "scout" || scout[directoryKeymap[index][0]])
                                ? toString(directoryKeymap[index][0] == "scout"
                                        ? scout[directoryKeymap[index][1]]
                                        : scout[directoryKeymap[index][0]][directoryKeymap[index][1]])
                                : unknownText;
                    }

                    row.push(`<td class="col-${i} nowrap">${value}</td>`);

                }


                $("#dir-body").append(`<tr data-id="${id}">${row.join("")}</tr>`);
            }).then(function(data) {
                console.log(data);
                $("#loading-text").addClass("hidden");
                let valueNames = [];
                let count = 0;
                for (let i = 0; i < columnKeymap.length; i++) {
                    for (let j = 0; j < columnKeymap[i].length; j++, count++) {
                        valueNames.push("col-" + count);
                    }

                }
                const options = {
                    valueNames: valueNames,
                };

                let list = new List("directory-list", options);


                let end = new Date().getTime();
                $(".directoryScoutSize").text(directory.getScouts().length + "");
                $(".directoryLoadTime").text((end - start) + "ms");
                $(".directoryLoaded-show").removeClass("hidden");
                console.log("Done in " + (end - start) + "ms");

                db.ref("/directory/cache/").set(data);
                localStorage.setItem("directoryCache", btoa(JSON.stringify(data)));

                console.log(directory);
                $("tr").click(function() {
                    let id = $(this).attr("data-id");
                    let scout = directory.getScouts()[id];
                    console.log(scout);
                    let val: string;
                    console.log(id);
                    for (let i = 0; i < directoryKeymap.length; i++) {
                        if (directoryKeymap[i][0] === "scout") {
                            val = HTML.escape(toString(scout[directoryKeymap[i][1]], false));
                            if (scout[directoryKeymap[i][1]] == undefined) {
                                val = "N/A";
                            }

                        } else if (scout[directoryKeymap[i][0]] == undefined || scout[directoryKeymap[i][0]][directoryKeymap[i][1]] == undefined) {
                            val = "<i>N/A</i>";
                        } else {
                            val = HTML.escape(toString(scout[directoryKeymap[i][0]][directoryKeymap[i][1]], false));
                        }
                        if (directoryKeymap[i][1] === "email") {
                            val = `<a href="mailto:${val}">${val}</a>`;

                        } else if (directoryKeymap[i][1] === "cellPhone" || directoryKeymap[i][1] === "homePhone") {
                            val = `<a href="tel:${val}">${val}</a>`;

                        }
                        $(".infoModal-" + directoryKeymap[i][0] + directoryKeymap[i][1].charAt(0).toUpperCase()
                        + directoryKeymap[i][1].substring(1)).html(val);

                    }

                    $(".infoModal-scoutPatrol").text(readablePatrolMap[scout.patrol]);
                    $(".infoModal-scoutFullName").text(scout.firstName + " " + scout.lastName);
                    $(".infoModal-mother").addClass("hidden");
                    $(".infoModal-father").addClass("hidden");
                    if (scout.mother) {
                        $(".infoModal-motherFullName").text(scout.mother.firstName + " " + scout.mother.lastName);
                        $(".infoModal-motherDownload").click(function() {
                            download(scout.mother.firstName + scout.mother.lastName + ".vcf", scout.mother.export());
                        });
                        $(".infoModal-mother").removeClass("hidden");
                    }
                    if (scout.father) {
                        $(".infoModal-fatherFullName").text(scout.father.firstName + " " + scout.father.lastName);
                        $(".infoModal-fatherDownload").click(function() {
                            download(scout.father.firstName + scout.father.lastName + ".vcf", scout.father.export());
                        });
                        $(".infoModal-father").removeClass("hidden");
                    }
                    $(".infoModal-scoutDownload").click(function() {
                        download(scout.firstName + scout.lastName + ".vcf", scout.export());
                    });
                    $("#infoModal").modal("show");

                    URL.setQueryString(Query.set("id", id));
                });
                $("#infoModal").on("hide.bs.modal", function() {
                    URL.setQueryString(Query.remove("id"));
                });
                callback(list);

            });
        };


        let cache = localStorage.getItem("directoryCache");
        if (cache != null) {
            cache = JSON.parse(atob(cache));
            load(cache);
        } else {
            db.ref("/directory/cache/").once("value").then(function(snapshot) {
                data = snapshot.val();
                load(data);
            });
        }
    });

}


function loadFilterSelects(list: List) {


    let index = 0;
    for (let i = 0; i < columnKeymap.length; i++) {
        let sortOpts = "";
        let filterOpts = "";

        for (let j = 0; j < columnKeymap[i].length; j++) {
            sortOpts += `<option value="${index}">${columnKeymap[i][j][columnKeymap[i][j].length - 1]}</option>`;
            filterOpts += `<option value="${index}" ${defaultShown[i].indexOf(j) > -1 ? "selected" : ""}>${columnKeymap[i][j][columnKeymap[i][j].length - 1]}</option>`;
            index++;
        }

        $("#sortby-select").append(`<optgroup label="${["Scout", "Father", "Mother"][i]}">
            ${sortOpts}
        </optgroup>`);

        $("#filter-select").append(`<optgroup label="${["Scout", "Father", "Mother"][i]}">
            ${filterOpts}
        </optgroup>`);


    }
    $(".select-loading").remove();
    $("#filter-select, #sortby-select, #sortorder-select").removeAttr("disabled");
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        $("#filter-select, #sortby-select, #sortorder-select").selectpicker("mobile");
    }
    $("#filter-select, #sortby-select, #sortorder-select").selectpicker("refresh");

    console.log(list);
    $("#sortby-select, #sortorder-select").change(function() {
        URL.setQueryString(Query.set("sortBy", "" + $("#sortby-select").val(), Query.set("sortOrder", "" + $("#sortorder-select").val())));

        list.sort("col-" + $("#sortby-select").val(), { order: $("#sortorder-select").val() + "" });
    });
    $("#filter-select").change(function() {
        // @ts-ignore -- #filter-select will always be an array
        let selected: string[] = $("#filter-select").val();
        let selectedIndex = 0;
        for (let i = 0; i < directoryKeymap.length; i++) {
            if (selected[selectedIndex] === (i + "")) {
                selectedIndex++;
                $(".col-" + i).removeClass("hidden");
            } else {
                $(".col-" + i).addClass("hidden");
            }

        }
        URL.setQueryString(Query.set("filterBy", JSON.stringify(selected.map(x => parseInt(x, 10))).slice(1, -1).replace(/,/g, "_")));

    }).trigger("change");

    //initalize options
    console.log("col-" + (Query.get("sortBy") || 2), { order: (Query.get("sortOrder") || "asc") + "" });

    list.sort("col-" + (Query.get("sortBy") || 2), { order: (Query.get("sortOrder") || "asc") + "" });
    let selected: string[] = Query.get("filterBy").split("_");
    let selectedIndex = 0;
    for (let i = 0; i < directoryKeymap.length; i++) {
        if (selected[selectedIndex] === (i + "")) {
            selectedIndex++;
            $(".col-" + i).removeClass("hidden");
        } else {
            $(".col-" + i).addClass("hidden");
        }

    }


}

function download(filename: string, text: any) {
    var element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
