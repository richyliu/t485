import { Authenticator, AuthError, User }  from "../../server/Authenticator";
import { Database } from "../../server/Database";
import { AlertBox, ErrorAlert } from "../../AlertBox";
import Query from "../../utils/Query";
import $ from "jquery";
import PageState from "../../utils/PageState";

PageState.init();

let authenticator = new Authenticator();
let database = new Database();

let alertBox = new AlertBox("#alerts");

function init() {

	$("#main-box input").on("keyup", function(event) {
		// Cancel the default action, if needed
		//event.preventDefault();
		// Number 13 is the "Enter" key on the keyboard
		if (event.which === 13) {
			// Trigger the button element with a click
			$("#login").click();
		}
	});

	$("#login").click(function() {
		let email = $("#email").val() + "";
		let password = $("#password").val() + "";
		$("#error").html("");
		authenticator.emailLogin(email, password).catch(function(error:AuthError) {
			const normalErrors = ["auth/invalid-email", "auth/user-disabled", "auth/user-not-found", "auth/wrong-password"];

			if (!error || normalErrors.indexOf(error.code) === -1) {
				alertBox.push(new ErrorAlert(`An unknown error occurred. Code account/login.foreignLoginError(${error.code})`));

			} else {
				alertBox.push(new ErrorAlert(`Email/Password Incorrect. <a class="alert-link" href="/account/forgot">Forgot Password</a>?`));
			}
			$("#password").val("");
		});
	});

	authenticator.onAuthStateChanged(function(user: User) {

		if (user) {
			console.log(user);
			if (!user.emailVerified) {

				$("#main-box").addClass("hidden");
				$("#verify-box").removeClass("hidden");
			} else {

				$("#error").html("");

				database.ref("/users/" + user.uid + "/data/lastUpdated/").once("value").then(function(snapshot) {
					console.log(snapshot.exists());
					if (snapshot.exists()) {
						if (Query.get("continue") == "" || Query.get("continue") == null) {
							window.location.href = "/account/";
						} else {
							window.location.href = Query.get("continue");
						}
					} else {

						$("#main-box").addClass("hidden");
						$("#setup-box").removeClass("hidden");
					}
				}).catch(function(e) {
					console.log(e);
					alertBox.push(new ErrorAlert(`An unknown error occurred. Code account/login.foreignStateError(${e.code})`));

				});

			}

		}
	});

}



init();
