import $ from "jquery";
import { Database } from "../../../server/database";

let db = new Database();
let dbRef = db.ref("plcvoting");
let campaignName = "march2019";
function render(data:any) {
    $("#results").html("");
    $("#voters").html("");
    let campaign = data.val();
    for (let key in campaign.categories) {
        if (campaign.categories.hasOwnProperty(key)) {
            let most = 0;
            let mostIds = [];
            for (let i = 0; i < campaign.categories[key].options.length; i ++) {
                if (campaign.categories[key].options[i].votes > most) {
                    most = campaign.categories[key].options[i].votes;
                    mostIds = [i]
                } else if (campaign.categories[key].options[i].votes == most) {
                    mostIds.push(i);
                }
            }
            console.log(mostIds);
            let secondMostIds = [];
            if (mostIds.length < 2) {
                most = 0;
                for (let i = 0; i < campaign.categories[key].options.length; i ++) {
                    if (mostIds.indexOf(i) > -1) {
                        continue;
                    }
                    if (campaign.categories[key].options[i].votes > most) {
                        most = campaign.categories[key].options[i].votes;
                        secondMostIds = [i];
                    } else if (campaign.categories[key].options[i].votes == most) {
                        secondMostIds.push(i);
                    }
                }
            }
            mostIds = mostIds.concat(secondMostIds);
            console.log(mostIds);
            $("#results").append(`<h3>${campaign.categories[key].name}</h3>`);
            for (let i = 0; i < campaign.categories[key].options.length; i ++) {
                let type = mostIds.indexOf(i) > -1 ? "b" : "span";
                $("#results").append(`<${type}>${campaign.categories[key].options[i].name}: ${campaign.categories[key].options[i].votes || 0}</${type}><br>`)
            }
        }
    }
    let voters = "";
    for (let key in campaign.submissions) {
        voters += campaign.submissions[key] + ", "
    }
    $("#voters").text(voters);
}
dbRef.child("campaigns").child(campaignName).on("value", render)