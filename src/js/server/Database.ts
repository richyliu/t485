import { ServerConnection } from "./ServerConnection";
import "firebase/database";
/**
 * A interface for connecting to the Database.
 */

class Database extends ServerConnection {

	/**
	 * Create a new Database connection.
	 */
	constructor() {
		super();

	}

	/**
	 * Get the database reference at `path`.
	 * @param path
	 */
	ref(path:string) {
		return this.server.database().ref(path);
	}



}
export default Database;
export {Database};