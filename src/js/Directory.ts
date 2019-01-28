import {Spreadsheet, SpreadsheetKeys} from "./Spreadsheet";
import {isNumber} from "util";
import Scout  from "./contact/Scout";

/**
 * Loads a directory from a given spreadsheet URL.
 */
interface DirectoryKeys extends SpreadsheetKeys {

	sheets:string[],
	range:string
}


class Directory extends Spreadsheet {
	protected keys: DirectoryKeys;
	protected keymap: string[][];
	protected rawData: object;
	public scouts: Scout[];

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

		return this.getSheets(this.keys.sheets, this.keys.range).then((data) => {
			this.rawData = data;

		});

	}







}
export default Directory;
export {Directory, DirectoryKeys};