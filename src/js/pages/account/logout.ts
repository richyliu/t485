import { Authenticator, AuthError } from "../../server/Authenticator";
import { AlertBox, ErrorAlert, SuccessAlert } from "../../AlertBox";
import { PageState } from "../../utils/PageState"

PageState.init();

let authenticator = new Authenticator();
let alertBox = new AlertBox("#alerts");
function init() {
	authenticator.logout().then(function() {

		alertBox.push(new SuccessAlert(`You have been successfully logged out. <a href="/account/login" class="alert-link preserve-state">Login again</a>`, false));
	}).catch(function(error:AuthError) {
		console.log(error);
		alertBox.push(new ErrorAlert(`An unknown error occurred. Code auth/logout.foreignLoginError(${error.code})`, false));
	});
}
init();