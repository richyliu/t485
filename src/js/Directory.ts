import {Spreadsheet, SpreadsheetKeys} from "./Spreadsheet";
// import {isNumber} from "util";
import Person  from "./contact/Person";
import PhoneNumber  from "./contact/PhoneNumber";
import Scout  from "./contact/Scout";

/**
 * Loads a directory from a given spreadsheet URL.
 */

/**
 * The Directory Keys are an interface to pass the sheets for each patrol and the range that the directory is in.
 */
interface DirectoryKeys extends SpreadsheetKeys {

	sheets:string[],
	range:string
}

/**
 * Raw Data returned b the google sheets API
 */
interface DirectoryData {
	spreadsheetId:string,
	valueRanges:DirectorySheet[]
}

/**
 * Raw data for a single sheet from the google sheets API.
 */
interface DirectorySheet{
	majorDimension:string,
	range:string,
	values:string[]
}

class Directory extends Spreadsheet {
	protected keys: DirectoryKeys;
	protected keymap: string[][];
	public rawData: DirectoryData;
	public scouts: Scout[];

	/**
	 * Create a new instance of the directory viewer.
	 * @param keys
	 * @param keymap
	 */
	constructor(keys:DirectoryKeys, keymap:string[][]) {
		super(keys);

		this.keys = keys;
		this.keymap = keymap;
		this.update();
	}

	/**
	 * Update the local data with the latest data from the spreadsheet.
	 * @return Returns a promise.
	 */
	public update() {

		return this.getSheets(this.keys.sheets, this.keys.range).then((data:DirectoryData) => {
			this.rawData = data;
			this.scouts = this.processRawData(data);
			return data;
		});

	}

	protected processRawData(data:DirectoryData) {

		// For each patrol
		for (let i = 0; i < data.valueRanges.length; i ++) {
			// For each scout
			for (let j = 0; j < data.valueRanges[i].values.length; j ++) {
				// For each property of a scout
				let currentScout = data.valueRanges[i].values[j];
				let currentScoutData = {};
				for (let k = 0; k < this.keymap.length; k ++) {
					// Map each trait to an object.
					// Initialize the object.
					if (!currentScoutData[this.keymap[k][0]]) {
						currentScoutData[k][0] = {};
					}
					// Set the value
					currentScoutData[this.keymap[k][0]][this.keymap[k][1]] = currentScout[k];
				}

				// Change the object into a new Scout().
				let parents = ["mother", "father"];
				let transformedParents :Person[];
				for (let k = 0; k < parents.length; k ++) {
					transformedParents[k] = new Person(currentScoutData[parents[k]].firstName, currentScoutData[parents[k]].lastName, new PhoneNumber(currentScoutData[parents[k]].cellPhone), currentScoutData[parents[k]].email, currentScoutData[parents[k]].slack);

				}

				this.scouts.push(
					new Scout(currentScoutData["scout"].firstName, currentScoutData["scout"].lastName, new PhoneNumber(currentScoutData["scout"].cellPhone), currentScoutData["scout"].email, currentScoutData["scout"].slack, new PhoneNumber(currentScoutData["scout"].homePhone), transformedParents[0], transformedParents[1])
				)
			}
		}


		return [][""];
	}








}
export default Directory;
export {Directory, DirectoryKeys};