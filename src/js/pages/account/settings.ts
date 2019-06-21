import { PageState } from "../../utils/PageState";
import { Authenticator } from "../../server/Authenticator";
import $ from "jquery";
import "bootstrap";

PageState.init();
let auth = new Authenticator();
$("#passwordUpdate-formTrigger").click(function() {
    console.log("h")
    $("#passwordUpdate-success").addClass("hidden");
});
auth.onAuthStateChanged(function(user) {
    if (user) {
        $("#loading").addClass("hidden");
        $("#main").removeClass("hidden");

        $("#passwordUpdate-submit").click(function() {
            $(".has-validation").removeClass("is-invalid");
            let newPassword = $("#passwordUpdate-newPassword").val() + "";
            if (newPassword !== $("#passwordUpdate-confirmNewPassword").val()) {
                $(".passwordInput").val("");
                $("#passwordUpdate-confirmNewPassword").addClass("is-invalid");
                return;
            }
            console.log(auth);
            let credential = auth.getEmailCredential(
                    user.email,
                    $("#passwordUpdate-currentPassword").val() + ""
            );
            user.reauthenticateWithCredential(credential).then(function() {
                user.updatePassword(newPassword).then(function() {
                    // Update successful.
                    $("#passwordUpdateForm").collapse("hide");
                    $("#passwordUpdate-success").removeClass("hidden");
                }).catch(function(error) {
                    // An error happened.
                    $(".passwordInput").val("");
                    $("#passwordUpdate-newPassword").addClass("is-invalid");
                });
            }).catch(function(error) {
                $(".passwordInput").val("");
                $("#passwordUpdate-currentPassword").addClass("is-invalid");
            });

        });
    } else {
        $("#loading").addClass("hidden");
        $("#auth").removeClass("hidden");
    }
});
