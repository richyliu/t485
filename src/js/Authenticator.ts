import { Server } from "./server";
import "firebase/auth";
/**
 * Authentication Server
 */
class Authenticator extends Server {

	constructor() {
		super();

	}

	/**
	 * Executes a callback when the authentication state changes (the user logs in or logs out)
	 * See firebase's firebase.auth().onAuthStateChanged()
	 *
	 * @param callback - A function which accepts a single parameter, user. User contains a firebase user object when the user is logged in, and null when logged out.
	 */
	public onAuthStateChanged(callback:((user:string) => void)) {
		return this.server.auth().onAuthStateChanged(callback);
	}

	/**
	 * Logs in a user using email and password.
	 *
	 * See firebase's firebase.auth().signInWithEmailAndPassword()
	 *
	 * @param email - the email
	 * @param password - the password
	 */
	public emailLogin(email:string, password:string) {
		return this.server.auth().signInWithEmailAndPassword(email, password);
	}

}
export default Authenticator;