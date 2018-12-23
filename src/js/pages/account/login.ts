import Authenticator  from "../../Authenticator";
import { AlertBox, ErrorAlert } from "../../AlertBox";
import * as $ from "jQuery";

let authenticator = new Authenticator();
let alertBox = new AlertBox("#alerts");

function init() {
	initHandlers();

}
function initHandlers() {
	$("#main-box input").on("keyup", function(event) {
		// Cancel the default action, if needed
		//event.preventDefault();
		// Number 13 is the "Enter" key on the keyboard
		if (event.keyCode === 13) {
			// Trigger the button element with a click
			$("#login").click();
		}
	});

	$("#login").click(function() {
		var email = $("#email").val();
		var password = $("#password").val();
		$("#error").html("");
		authenticator.emailLogin(email, password).catch(function(error) {
			if (!error) {
				alertBox.push(new ErrorAlert(`An unknown error occurred. Code account/login.emailLogin.firebaseErrorUndefined`));
			}
			alertBox.push(new ErrorAlert(`Email/Password Incorrect. <a class="alert-link" href="/account/forgot">Forgot Password</a>?`));

		});

	});

}

authenticator.onAuthStateChanged(function(user) {
	if (user) {
		// console.log(user)
		// if (!user.emailVerified) {
		// 	console.log(1)
		// 	$("#main-box").addClass("hidden");
		// 	$("#verify-box").removeClass("hidden");
		// } else {
		// 	$("#error").html("");
		// 	console.log(2)
		// 	firebase.database().ref("/users/" + user.uid + "/data/lastUpdated/").once("value").then(function(snapshot) {
		// 		console.log(snapshot.exists())
		// 		if (snapshot.exists()) {
		// 			if (getQuery("continue") == "" || getQuery("continue") == null) {
		// 				window.location.href = "/account/";
		// 			} else {
		// 				window.location.href = getQuery("continue");
		// 			}
		// 		} else {
		//
		// 			$("#main-box").addClass("hidden");
		// 			$("#setup-box").removeClass("hidden");
		// 		}
		// 	})
		//
		// }
		console.log("success");
	}
});

init();
