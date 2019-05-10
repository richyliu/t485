import $ from "jquery";
import { Database } from "../../../server/Database";

let db = new Database();
let dbRef = db.ref("plcvoting");
let campaignName = "march2019";
$("#name").on("keyup", function(e) {
    if (e.which === 13) {
        $("#add-submit").click();
    }
});
$("#add-submit").click(function() {
    let teaching = {
        name: $("#name").val(),
    };
    $("#name").val("");
    console.log(`plcvoting/campaigns/${campaignName}/categories/${$("#category").val()}/options/`);
    db.ref(`/plcvoting/campaigns/${campaignName}/categories/${$("#category").val()}/options/`).once("value").then(function(data) {
        db.ref(`/plcvoting/campaigns/${campaignName}/categories/${$("#category").val()}/options/`).set((data.val() || []).concat(teaching));
    });

});
