import * as firebase from 'firebase/app';
import { firebaseConfig } from "./config";

/**
 * The wrapper for a server, currently firebase. This wrapper exists to ease migration.
 */

class Server {
	/**
	 * The firebase instance.
	 */
	protected server:any;

	/**
	 * Create a new server.
	 */
	constructor() {
		if (firebase.apps.length == 0) {
			firebase.initializeApp(firebaseConfig);
			this.server = firebase;
			console.log(typeof this.server);
		}
	}


}

export { Server };