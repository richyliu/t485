import Database from "../server/Database";
import Authenticator from "../server/Authenticator";
import { Directory, DirectoryKeys } from "../Directory";
import Scout from "../contact/Scout";
import * as $ from "jQuery";

const directoryKeymap = [
	["scout", "firstName"], ["scout", "lastName"], ["scout", "email"], ["scout", "homePhone"], ["scout", "slack"],
	["scout", "jobA"], ["scout", "jobB"], ["scout", "joinDate"], ["scout", "active"], ["scout", "WFATrained"],
	["scout", "school"], ["scout", "fixedGrade"], ["scout", "currentGrade"], ["scout", "cellPhone"],
	["father", "firstName"], ["father", "lastName"], ["father", "cellPhone"], ["father", "email"], ["father", "slack"],
	["mother", "firstName"], ["mother", "lastName"], ["mother", "cellPhone"], ["mother", "email"], ["mother", "slack"]
];

let db = new Database();
let start = new Date().getTime();
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

	let directory = new Directory(keys, directoryKeymap);
	directory.update(function(scout:Scout) {
		console.log(scout);

	}).then(function() {
		let end = new Date().getTime();
		$(".directoryScoutSize").text(directory.getScouts().length + "");
		$(".directoryLoadTime").text((end - start) + "ms");
		$(".directoryLoaded-show").removeClass("hidden");
		console.log("Done in " + (end - start) + "ms");
		console.log(directory);
	});
});