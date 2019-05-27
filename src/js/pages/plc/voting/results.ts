import $ from "jquery";
import { Database } from "../../../server/Database";

let db = new Database();
let dbRef = db.ref("plcvoting");
dbRef.child("currentCampaign").once("value").then(function(data) {

    let campaignName = data.val().name;

    function render(data: any) {
        $("#results").html("");
        $("#voters").html("");
        let campaign = data.val();
        for (let key in campaign.categories) {
            if (campaign.categories.hasOwnProperty(key)) {
                let numWinners = campaign.categories[key].maxVotes;
                let options = campaign.categories[key].options.slice().sort(function (a, b) {
                   return b.votes - a.votes;
                });



                $("#results").append(`<h3>${campaign.categories[key].name}</h3>`);
                for (let i = 0; i < options.length; i++) {
                    let type = i < numWinners ? "b" : "span";
                    $("#results").append(`<${type}>${options[i].name}: ${options[i].votes || 0}</${type}><br>`);
                }
            }
        }
        let voters = [];
        for (let key in campaign.submissions) {
            voters.push(campaign.submissions[key]);
        }
        $("#voters").text(voters.join(", "));
        $("#length").text(voters.length);
    }

    dbRef.child("campaigns").child(campaignName).on("value", render);
});