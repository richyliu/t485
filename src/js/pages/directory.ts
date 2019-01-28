import Database from "../server/Database";
import Authenticator from "../server/Authenticator";
import ServerConnection from "../server/ServerConnection";
import { Directory, DirectoryKeys } from "../Directory";
import * as $ from "jQuery";

let db = new Database();
db.ref("/directory/keys").once("value").then(function(snapshot) {
	let data = snapshot.val();
	let keys: DirectoryKeys;
	keys = {
		id:data.id,
		api:data.api,
		sheets:data.sheets,
		range:"A2:X"

	};

	let url = `https://docs.google.com/spreadsheets/d/${keys.id}/edit`;
	$(".link-google-sheet-dir").attr("href", url);

	let directory = new Directory(keys, []);
	directory.update().then(function() {
		console.log(directory.rawData);
	});
});