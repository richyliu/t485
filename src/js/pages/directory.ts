import Database from "../server/Database";
import Authenticator from "../server/Authenticator";
import { Directory, DirectoryKeys } from "../Directory";
import Scout from "../contact/Scout";
import * as $ from "jQuery";
import List from "list.js";

const directoryKeymap = [
	["scout", "firstName"], ["scout", "lastName"], ["scout", "email"], ["scout", "homePhone"], ["scout", "slack"],
	["scout", "jobA"], ["scout", "jobB"], ["scout", "joinDate"], ["scout", "active"], ["scout", "WFATrained"],
	["scout", "school"], ["scout", "fixedGrade"], ["scout", "currentGrade"], ["scout", "cellPhone"],
	["father", "firstName"], ["father", "lastName"], ["father", "cellPhone"], ["father", "email"], ["father", "slack"],
	["mother", "firstName"], ["mother", "lastName"], ["mother", "cellPhone"], ["mother", "email"], ["mother", "slack"]
];
const columnKeymap = [
	["Scout's First Name", "Scout's Last Name", "Patrol", "Scout's E-mail", "Scout's Home Phone", "Slack Username",
	"Troop Jobs", "Date Joined Troop 485", "Active (Y)es/ (R)arely/ (N)o", "Wilderness First Aid Trained",
	"School Attending", "Scout's Current Grade",  "Scout's Cell Phone"],
	["Father's First Name", "Father's Last Name", "Father's Cell Phone", "Father's E-mail", "Father's Slack Username or None"],
	["Mother's First Name", "Mother's Last Name", "Mother's Cell Phone", "Mother's E-mail", "Mother's Slack Username or None"]
];

let db = new Database();
let start = new Date().getTime();
let list;
console.log(list);
function init() {
	loadHeaders();
	loadData();
}

function loadHeaders() {
	let colNum = 0;

	for (let i = 0; i < columnKeymap.length; i ++) {
		for (let j = 0; j < columnKeymap[i].length; j ++, colNum ++) {
			console.log(columnKeymap[i][j]);
			$("#dir-head-inner").append(`
				<th scope="col" class="col-${colNum} header">${columnKeymap[i][j]}</th>
			`)
		}
	}
}

function loadData() {
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
			let row = [];
			for (let i = 0; i < directoryKeymap.length + 1; i ++) {
				let index = i;
				let value = "";
				if (i > 2) {
					index --;
				}
				if (i == 2) {
					value = ["Dragons", "Serpents", "Blobfish", "Hawks", "Wildcats", "Cacti"][scout.patrol];
				} else if (directoryKeymap[index][0] == "scout") {
					console.log(directoryKeymap[index], index);
					value = scout[directoryKeymap[index][1]];
				} else {
					console.log(directoryKeymap[index], index);
					value = scout[directoryKeymap[index][0]][directoryKeymap[index][1]];
				}


				row.push(`<td class="col-${index}">${value}</td>`);

			}



			$("#dir-body").append(`<tr>${row.join("")}</tr>`);
		}).then(function() {
			list = new List("#directory-list");

			let end = new Date().getTime();
			$(".directoryScoutSize").text(directory.getScouts().length + "");
			$(".directoryLoadTime").text((end - start) + "ms");
			$(".directoryLoaded-show").removeClass("hidden");
			console.log("Done in " + (end - start) + "ms");
			console.log(directory);

		});
	});
}
init();