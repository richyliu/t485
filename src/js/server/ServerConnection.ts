import * as firebase from "firebase/app";
import { FirebaseError } from "firebase";

import { firebaseConfig } from "./config";

/**
 * The wrapper for a server, currently Firebase. This wrapper exists to ease migration.
 */
interface ServerError extends FirebaseError {

}
class ServerConnection {
	/**
	 * The firebase instance.
	 */
	protected server:firebase.app.App;
g
	/**
	 * Create a new server connection.
	 */
	constructor() {
		if (firebase.apps.length == 0) {
			firebase.initializeApp(firebaseConfig);
		}
		this.server = firebase.app();
	}


}

export default ServerConnection;
export { ServerConnection, ServerError };