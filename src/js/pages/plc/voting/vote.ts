import $ from "jquery";
import { Database } from "../../../server/Database";let db = new Database();
let dbRef = db.ref("plcvoting");

function init() {
    dbRef.child("currentCampaign").once("value").then(function(data) {
        console.log(data.val());
        let campaign = data.val();
        if (campaign != null && campaign !== "CLOSED") {
            console.log($("#name").val())
            loadData(campaign, function() {

                $(".campaign-hide").addClass("hidden");
                $(".campaign-show").removeClass("hidden");
                $(".loading").addClass("hidden");
                $("#name").on("keyup", function(e) {
                    if (e.which === 13) {
                        $("#portal-name-submit").click();
                    }
                })
                $("#portal-name-submit").click(function() {
                    if (validateName($("#name").val() + "")) {
                        $("#portal-name").addClass("hidden");
                        $("#portal-vote").removeClass("hidden");
                    } else {
                        $("#name").addClass("is-invalid")
                    }
                });
            });
        } else {
            $(".campaign-show").addClass("hidden");
            $(".campaign-hide").removeClass("hidden");
            $(".loading").addClass("hidden");

        }
    });
}

function validateName(name:string):boolean {
    return name.replace(/\s/g, "").length > 0;
}

function loadData(campaignName: string, onReady: () => void) {
    dbRef.child("campaigns").child(campaignName).once("value").then(function(data) {
        console.log(data.val());
        let campaign = data.val();
        $(".max-votes").text(campaign.data.maxVotes !== null ? campaign.data.maxVotes : 2);
        $(".max-votes-plurality").text(campaign.data.maxVotes === 1 ? "" : "s");

        for (let key in campaign.categories) {
            if (campaign.categories.hasOwnProperty(key)) {
                let checkboxText = "";
                for (let i = 0; i < campaign.categories[key].options.length; i ++) {
                    console.log(key, i);
                    checkboxText += getCheckboxHTML(campaign.categories[key].options[i].name, key, i);
                }

                $("#options").append(`
                    <div id="vote-option-${key}">
                    <h3>${campaign.categories[key].name}</h3>
                    <p>Vote up to <b>${campaign.categories[key].maxVotes}</b> times.</p>
                        ${checkboxText}
                        <hr>
                    </div>
                `);


            }
        }
        $("#portal-vote-submit").click(function() {
            if (validateVotes(campaign, campaign.data.maxVotes)) {
                for (let key in campaign.categories) {
                    if (campaign.categories.hasOwnProperty(key)) {
                        for (let i = 0; i < campaign.categories[key].options.length; i ++) {
                            let vote = $(`#vote-checkbox-${key}-${i}`).prop("checked");
                            if (vote) {
                                db.ref(`plcvoting/campaigns/${campaignName}/categories/${key}/options/${i}/votes`).transaction(function(count) {
                                    return count == null ? 1 : count + 1;
                                });
                            }
                        }
                    }
                }
                db.ref(`plcvoting/campaigns/${campaignName}/submissions`).push( $("#name").val());
                $("#portal-vote").addClass("hidden");
                $("#portal-done").removeClass("hidden");
            } else {
                $("#error-text").text("You voted more than the max times in each category.")
            }
        });

        onReady();
    });
}
function validateVotes(campaign:any, maxCount:number):boolean {
    for (let key in campaign.categories) {
        if (campaign.categories.hasOwnProperty(key)) {
            maxCount = campaign.categories[key].maxVotes;
            let count = 0;
            for (let i = 0; i < campaign.categories[key].options.length; i ++) {
                count += $(`#vote-checkbox-${key}-${i}`).prop("checked") ? 1 : 0;
                console.log(count, maxCount);
            }
            if (count > maxCount) {
                return false;
            }
        }
    }

    return true;
}

function getCheckboxHTML(label:string, optionName:string, id:number) {
    return `<div class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input" id="vote-checkbox-${optionName}-${id}">
              <label class="custom-control-label" for="vote-checkbox-${optionName}-${id}">${label}</label>
            </div>`;
}

init();