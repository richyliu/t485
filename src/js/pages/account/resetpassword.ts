import { Authenticator } from "../../server/Authenticator";
import Query from "../../utils/Query";
import $ from "jquery";
import PageState from "../../utils/PageState";
import "bootstrap";

PageState.init();
let auth = new Authenticator();

if (Query.get("email")) {
    $("#email").val(Query.get("email"));
}
$("#send").click(function() {
    $("#error").text("");
    let email = $("#email").val() + "";
    $("#reset-email").text(email);
    let actionCodeSettings = {
        url: Query.get("continue")
    };
    auth.sendPasswordResetEmail(email, actionCodeSettings).then(function() {
        // Email sent.
        $("#reset-box").addClass("hidden");
        $("#success-box").removeClass("hidden");

    }).catch(function(error) {

        // Silently ignore errors because we don't tell the user whether or not an account exists with a certain email address.
        $("#reset-box").addClass("hidden");
        $("#success-box").removeClass("hidden");


    });

});
$("#resend").click(function() {
    $("#success-box").addClass("hidden");
    $("#error-box").addClass("hidden");
    $("#reset-box").removeClass("hidden");
});