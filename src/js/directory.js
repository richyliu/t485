var list = false;//false means uninitiated
var scoutArrayKeymap = [["scout", "firstName"], ["scout", "lastName"], ["scout", "email"], ["scout", "homePhone"], ["scout", "slack"], ["scout", "joinDate"], ["scout", "active"], ["scout", "WFATrained"], ["scout", "school"], ["scout", "cellPhone"],
	["father", "firstName"], ["father", "lastName"], ["father", "cellPhone"], ["father", "email"], ["father", "slack"],
	["mother", "firstName"], ["mother", "lastName"], ["mother", "cellPhone"], ["mother", "email"], ["mother", "slack"]];

firebase.database().ref("/directory/keys/").once("value").then(function(snapshot){
	var keys = snapshot.val();
	$(".link-google-sheet-dir").attr("href", `https://docs.google.com/spreadsheets/d/${keys.id}/edit`);

	rangeString = ``;
	for (i = 0; i < keys.sheets.length; i ++) {
		rangeString += `ranges=${keys.sheets[i]}!A2:U&`
	}
	$.ajax({
		url:`https://sheets.googleapis.com/v4/spreadsheets/${keys.id}/values:batchGet/?${rangeString}majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&key=${keys.api}`,
		method:"GET",
		dataType:"json"
	}).done(function(data){
		$("#loading-text").addClass("hidden");
		var ranges = data.valueRanges;
		var scoutArrayKeymap = [["scout", "firstName"], ["scout", "lastName"], ["scout", "email"], ["scout", "homePhone"], ["scout", "slack"], ["scout", "job"], ["scout", "joinDate"], ["scout", "active"], ["scout", "WFATrained"], ["scout", "school"], ["scout", "cellPhone"],
			["father", "firstName"], ["father", "lastName"], ["father", "cellPhone"], ["father", "email"], ["father", "slack"],
			["mother", "firstName"], ["mother", "lastName"], ["mother", "cellPhone"], ["mother", "email"], ["mother", "slack"]];
		var scouts = [];
		var row = 0;
		for (i = 0; i < ranges.length; i ++) {
			var values = ranges[i].values;
			var patrol = keys.sheets[i];
			//loop through each cell of each row and populate it with the data
			for (j = 0; j < values.length; j ++) {
				var line = "<tr class='table-row'>";

				//also populate the scouts object
				scouts[row] = {
					scout:{},
					father:{},
					mother:{}
				};
				var cell = 0;
				for (k = 0; k < values[j].length + 1; k ++) {//+1 for patrol

					if (k == 2) {//before the third iteration
						if (getColVisibility(k)) {
							hidden = "";
						} else {
							hidden = "hidden";
						}
						line += "<td class='col" + k + " " + hidden + "' data-col='" + k + "' data-row='" + row + "'>" + patrol + "</td>";
						scouts[row][scoutArrayKeymap[cell][0]][scoutArrayKeymap[cell][1]] = patrol;

						continue;
					}
					if (getColVisibility(k)) {
						hidden = "";
					} else {
						hidden = "hidden";
					}

					line += "<td class='col" + k + " " + hidden + "' data-col='" + k + "' data-row='" + row + "'>" + values[j][cell] + "</td>";

					scouts[row][scoutArrayKeymap[cell][0]][scoutArrayKeymap[cell][1]] = values[j][cell];
					cell ++;

				}
				line += "</tr>";
				row ++;
				$("#dir-body").append(line);
			}
		}
		$("#table").on("click", ".table-row", function (e) {
			var id = $(e.target).attr("data-row");
			window.location.hash = id;
		});

		$(window).on("hashchange", function() {
			onhashchange(scouts, keys);
		});
		$(document).ready(function() {
			onhashchange(scouts, keys);
		});
		//init list.js
		var valueNames = [];
		for (i = 0; i < values[0].length + 1; i ++) {//+1 for the patrol row
			valueNames.push("col" + i);
		}
		var options = {
			valueNames: valueNames
		};

		list = new List('directory-list', options);
		//when search data is stored in a query string it is loaded before the list, therefore
		//we must manually call search and sort again to only show the results of the search.
		list.search($("#search").val());
		list.sort("col" + $("#sortby-select").val(), { order: $("#sortorder-select").val() });
		$("#sortby-select, #sortorder-select").change(function() {
			list.sort("col" + $("#sortby-select").val(), { order: $("#sortorder-select").val() });
			setURLQuery(setQuery("sortby", $("#sortby-select").val()));
			setURLQuery(setQuery("sortorder", $("#sortorder-select").val()));
		});
	});

});

function getSlackLink(username, slackToken, callback, passthroughData) {
	firebase.database().ref("/directory/slackUID/").once("value").then(function(snapshot){
		var data = snapshot.val();
		var encodedUsername = encodeUsername(username);

		if (data != null && data[encodedUsername] != null && data[encodedUsername] != undefined) {
			//third parameter(boolean) is for debugging, it states whether the slack api was used.
			callback(data[encodedUsername], username, false, passthroughData);
			return;
		} else {
			$.ajax({
				url:`https://slack.com/api/users.list?token=${slackToken}`,
				method:"GET",
				dataType:"json"
			}).done(function(userlistdata){
				var userlist = userlistdata.members;
				var updates = {};

				for (i = 0; i < userlist.length; i ++) {
					if (userlist[i].deleted) {
						continue;
					}
					if (userlist[i].profile.display_name != "" && userlist[i].profile.display_name != undefined) {
						displayName = userlist[i].profile.display_name;
					} else {
						displayName = userlist[i].profile.real_name;
					}

					updates[encodeUsername(displayName)] = userlist[i].id;
					if (displayName == username) {
						callback(userlist[i].id, username, truea, passthroughData);
					}
				}
				firebase.database().ref("/directory/slackUID/").update(updates);
			});
		}
	});
}
function encodeUsername(username) {
	//modified encodeURIComponent
	var result = encodeURIComponent(username);//start by encoding URI chars
	//then encode .
	return result.replaceAll(".", "%2E");//%2E is UTF-8 for .(period)
}
function decodeUsername(encodedusername) {
	//decodeURIComponent decodes ALL UTF-8, not just the stuff encodeURIComponent encodes, so it
	//also decodes %2E, or .(period).
	//This function exists just for clarity.
	return decodeURIComponent(encodedusername);

}
function onhashchange(scouts, keys) {
	if (window.location.hash == "") {
		return;
	}
	var id = parseInt(window.location.hash.substring(1), 10);
	if (Number.isNaN(id) || id < 0 || id >= scouts.length) {
		return;
	}

	// get the slack usernames for the scout and their parents
	var relationshipKeymap = ["scout", "father", "mother"];
	for (i = 0; i < 3; i ++) {

		if (scouts[id][relationshipKeymap[i]].slack == "" || scouts[id][relationshipKeymap[i]].slack == undefined) {
			$(".infoModal-" + relationshipKeymap[i] + "SlackDMLink").attr("href", null);
			$(".infoModal-" + relationshipKeymap[i] + "SlackUsername").html("<i>Not listed in spreadsheet</i>");
			$(".infoModal-" + relationshipKeymap[i] + "SlackDMLoadingText").text("");
		} else if (scouts[id][relationshipKeymap[i]].slack.toLowerCase() == "none") {
			$(".infoModal-" + relationshipKeymap[i] + "SlackDMLink").attr("href", null);
			$(".infoModal-" + relationshipKeymap[i] + "SlackUsername").html("<i>None</i>");
			$(".infoModal-" + relationshipKeymap[i] + "SlackDMLoadingText").text("");
		} else {
			$(".infoModal-" + relationshipKeymap[i] + "SlackUsername").text("@" + scouts[id][relationshipKeymap[i]].slack);
			$(".infoModal-" + relationshipKeymap[i] + "SlackDMLoadingText").text("(profile loading...)");
			getSlackLink(scouts[id][relationshipKeymap[i]].slack, keys.slackToken, function(id, username, slackApiCalled, i) {
				//NOTE: the /message/ in the slack link could be replaced with anything and still work. without /messages/message, it would open in the app.
				$(".infoModal-" + relationshipKeymap[i] + "SlackDMLink").attr("href", "https://t485.slack.com/messages/message/team/" + id);
				$(".infoModal-" + relationshipKeymap[i] + "SlackDMLoadingText").text("");
			}, i);

		}
	}
	var traitText;
	var notListedText = "Not listed in spreadsheet.";

	for (var trait = 0; trait < scoutArrayKeymap.length; trait ++) {

		console.log(scoutArrayKeymap[trait][1]);
		$(".infoModal-" + scoutArrayKeymap[trait][0] +
			scoutArrayKeymap[trait][1].substring(0,1).toUpperCase() + scoutArrayKeymap[trait][1].substring(1) + "Link")
			.attr("href", null);//clear the link first
		//for some traits, we add additional attributes(such as changing emails into email links) or change Y to Yes and N to No
		if (traitText == undefined || traitText == "") {
			traitText = notListedText;
		} else if (scoutArrayKeymap[trait][1] == "active" || scoutArrayKeymap[trait][1] == "WFATrained") {
			traitText = traitText == "Y" || traitText == "y" ? "Yes" : traitText == "N" || traitText == "n" ? "No" : traitText == "R" || traitText == "r" ? "Rarely" : traitText
		} else if (scoutArrayKeymap[trait][1] == "email" || scoutArrayKeymap[trait][1] == "Email") {
			$(".infoModal-" + scoutArrayKeymap[trait][0] +
				scoutArrayKeymap[trait][1].substring(0,1).toUpperCase() + scoutArrayKeymap[trait][1].substring(1) + "Link")
				.attr("href", "mailto:" + traitText);
		} else if (scoutArrayKeymap[trait][1] == "cellPhone" || scoutArrayKeymap[trait][1] == "CellPhone" ||
			scoutArrayKeymap[trait][1] == "homePhone" || scoutArrayKeymap[trait][1] == "HomePhone") {
			$(".infoModal-" + scoutArrayKeymap[trait][0] +
				scoutArrayKeymap[trait][1].substring(0,1).toUpperCase() + scoutArrayKeymap[trait][1].substring(1) + "Link")
				.attr("href", (traitText.replace(/\D/g,"") == "" ? null : "tel:" + traitText.replace(/\D/g,"")));
			//remove all non-digit characters
			//if it's not a phone number (e.g. "N/A" or "None"), don't link it or remove the characters.
		}
		//str for testing
		var str = scoutArrayKeymap[trait][1];
		$(".infoModal-" + scoutArrayKeymap[trait][0] +
			scoutArrayKeymap[trait][1].substring(0,1).toUpperCase() + scoutArrayKeymap[trait][1].substring(1))
			.text(traitText);
	}
	for (i = 0; i < relationshipKeymap.length; i ++) {
		if (scouts[id][relationshipKeymap[i]].firstName == undefined || scouts[id][relationshipKeymap[i]].firstName == "" || scouts[id][relationshipKeymap[i]].lastName == undefined || scouts[id][relationshipKeymap[i]].lastName == "") {
			$(".infoModal-" + relationshipKeymap[i] + "FullNameElement").addClass("hidden");
			$(".infoModal-" + relationshipKeymap[i] + "FirstNameElement").removeClass("hidden");
			$(".infoModal-" + relationshipKeymap[i] + "LastNameElement").removeClass("hidden");
		} else {
			$(".infoModal-" + relationshipKeymap[i] + "FullName").text(scouts[id][relationshipKeymap[i]].firstName + " " + scouts[id][relationshipKeymap[i]].lastName);
		}
	}
	$("#infoModal").modal("show");

}
function getColVisibility(col) {

	var selected = $("#filter-select").val().map(str => parseInt(str, 10));

	return selected.indexOf(col) > -1;
}
function filterselectchange(){
	var selected = $("#filter-select").val().map(str => parseInt(str, 10));
	var show = [];
	for (i = 0; i < 21; i ++) {
		if (selected.indexOf(i) > -1) {
			$(".col" + i).removeClass("hidden");
			show.push(i);

		} else {
			$(".col" + i).addClass("hidden");
		}

	}
	var preset = [0, 1, 2, 3, 4, 10];
	var usingPreset = false;

	if (selected.length == preset.length) {
		for (i = 0; i < preset.length; i ++) {
			if (!(preset.indexOf(selected[i]) > -1)) {

				break;
			} else if (i == preset.length - 1) {

				usingPreset = true;
			} else {


			}
		}
	}

	if (!usingPreset) {
		setURLQuery(setQuery("filter", show.join(",")));
	} else {

		setURLQuery(setQuery("filter", null));
	}

}
$(document).ready(function() {
	processURLOptions();
	$("#infoModal").on("hide.bs.modal", function() {
		//remove hash
		history.pushState("", document.title, window.location.pathname + window.location.search);

	});
})
$("#filter-select").change(filterselectchange);

function processURLOptions() {
	var preset = {//defaults
		sortby:1,
		sortorder:"asc",
		filter:[0, 1, 2, 3, 4, 10]
	};

	var options = {
		filter:getQuery("filter") && getQuery("filter").length > 0 ? getQuery("filter").split(",").map( str => parseInt(str, 10)) : undefined,
		sortby:parseInt(getQuery("sortby"), 10),
		sortorder:getQuery("sortorder")
	}
	checkDefaultOptions();
	setOptions(merge(preset, options));
}
function checkDefaultOptions() {
	var preset = {//defaults
		sortby:1,
		sortorder:"asc",
		filter:[0, 1, 2, 3, 4, 10]
	};
	var options = {
		filter:getQuery("filter") && getQuery("filter").length > 0 ? getQuery("filter").split(",").map( str => parseInt(str, 10)) : undefined,
		sortby:Number.isInteger(parseInt(getQuery("sortby"), 10))? parseInt(getQuery("sortby"), 10) : getQuery("sortby"),
		sortorder:getQuery("sortorder")
	}
	var match = {//easier to do logic here in ternary operator than in one if statement
		filter:options.filter == preset.filter || options.filter == "" || options.filter == null,
		sortby:options.sortby == preset.sortby || options.sortby == "" || options.sortby == null,
		sortorder:options.sortorder == preset.sortorder || options.sortorder == "" || options.sortorder == null,
		search: $("#search").val() == "" || $("#search").val() == null
	}
	if (match.filter && match.sortby && match.sortorder && match.search) {
		//remove search
		history.pushState("", document.title, window.location.pathname + window.location.hash);

		$("#modified-settings").addClass("hidden");

	} else {
		$("#modified-settings").removeClass("hidden");
	}
}
function merge(old, newobj) {
	for (var key in newobj) {
		if (newobj.hasOwnProperty(key) && newobj[key] !== null && newobj[key] !== undefined && newobj[key] != "") old[key] = newobj[key];
	}
	return old;
}
$("#search").keyup(function() {
	setURLQuery(setQuery("query", encodeURIComponent($("#search").val())));
});
function setOptions(options) {
	for (i = 0; i <= 20; i ++) {

		$("#filter-select option[value=" + i + "]").attr("selected", (options.filter.indexOf(i) > -1 ? "" : null));
	}
	$("#filter-select").selectpicker("refresh");
	filterselectchange();

	for (i = 0; i <= 20; i ++) {

		$("#sortby-select option[value=" + i + "]").attr("selected", (options.sortby == i ? "" : null));
	}
	$("#sortby-select").selectpicker("refresh");
	$("#sortby-select").trigger("change");

	$("#sortorder-select option[value=" + options.sortorder + "]").attr("selected", "");
	$("#sortorder-select option[value=" + (options.sortorder == "asc" ? "desc" : "asc") + "]").attr("selected", null);
	$("#sortorder-select").selectpicker("refresh");
	$("#sortorder-select").trigger("change");

	if (list) {
		//by default list is false and therefore this code will not run
		//on the off chance that the list object is initiated before this code runs
		//we must re-triggger the search to show only search results.
		list.search($("#search").val());
		list.sort("col" + $("#sortby-select").val(), { order: $("#sortorder-select").val() });
	}
	$("#search").val(getQuery("query"));
	$("#search").trigger("keyup");

}

//If on moible, tell seectpicker to default to system default select.
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
	$('.selectpicker').selectpicker('mobile');
}