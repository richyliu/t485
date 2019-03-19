import { Spreadsheet, SpreadsheetKeys } from './Spreadsheet';
import Person from './contact/Person';
import PhoneNumber from './contact/PhoneNumber';
import { Scout, Patrol, patrolMap } from './contact/Scout';

/**
 * Loads a directory from a given spreadsheet URL.
 */

/**
 * The Directory Keys are an interface to pass the sheets for each patrol and the range that the directory is in.
 */
interface DirectoryKeys extends SpreadsheetKeys {

    /**
     * An array of sheet names. Each name should be a string that exactly matches a sheet name within the Google Spreadsheet.
     */
    sheets: string[];

    /**
     * The range from which to consider data within each sheet. The range must be a string without a sheet.
     */
    range: string;
}

/**
 * Raw Data returned by the google sheets API
 */
interface DirectoryData {
    spreadsheetId: string,
    valueRanges: DirectorySheet[]
}

/**
 * Raw data for a single sheet from the google sheets API.
 */
interface DirectorySheet {
    majorDimension: string,
    range: string,
    values: string[]
}

class Directory extends Spreadsheet {
    protected keys: DirectoryKeys;
    protected keymap: string[][] = [
        ['scout', 'firstName'], ['scout', 'lastName'], ['scout', 'email'], ['scout', 'homePhone'], ['scout', 'slack'],
        ['scout', 'jobA'], ['scout', 'jobB'], ['scout', 'joinDate'], ['scout', 'active'], ['scout', 'WFATrained'],
        ['scout', 'school'], ['scout', 'fixedGrade'], ['scout', 'currentGrade'], ['scout', 'cellPhone'],
        ['father', 'firstName'], ['father', 'lastName'], ['father', 'cellPhone'], ['father', 'email'], ['father', 'slack'],
        ['mother', 'firstName'], ['mother', 'lastName'], ['mother', 'cellPhone'], ['mother', 'email'], ['mother', 'slack'],
    ];
    public rawData: DirectoryData;
    protected scouts: Scout[];

    /**
     * Create a new instance of the directory viewer.
     * @param keys
     * @param keymap
     */
    constructor(keys: DirectoryKeys, keymap?: string[][]) {
        super(keys);

        this.keymap = keymap || this.keymap;
        this.update();
    }

    /**
     * Update the local data with the latest data from the spreadsheet.
     * @param forEach - An optional callback that is called once for each scout. This function may optionally return a boolean, which if false will prevent the Scout from being added to the local data.
     * @return Returns a promise.
     */
    public update(forEach?: ((scout: Scout) => void | boolean)) {

        return this.getSheets(this.keys.sheets, this.keys.range).then((data: DirectoryData) => {
            this.rawData = data;
            this.scouts = this.processRawData(data, forEach);
            //return data;
        });

    }

    /**
     * Processes an object containing raw data from the google sheets api with multiple sheets and transforms it into an array of scouts.
     * @param data - The raw data to process.
     * @param forEach - An optional callback that is called once for each scout. This function may optionally return a boolean, which if false will prevent the Scout from being added to the array.
     */
    protected processRawData(data: DirectoryData, forEach?: ((scout: Scout) => void | boolean)): Scout[] {
        let createPhoneNumber = (phoneNumber: string): PhoneNumber | null => {
            if (phoneNumber === '') {
                return null;
            } else if (phoneNumber.replace(/\D/g, '') === '') {
                return null;
            } else {
                return new PhoneNumber(phoneNumber);
            }
        };

        let result = [];

        // For each patrol
        for (let i = 0; i < data.valueRanges.length; i++) {
            // For each scout
            for (let j = 0; j < data.valueRanges[i].values.length; j++) {
                // For each property of a scout
                let currentScout = data.valueRanges[i].values[j];
                let currentScoutData: any = {};
                for (let k = 0; k < this.keymap.length; k++) {
                    // Map each trait to an object.
                    // Initialize the object.
                    if (!currentScoutData[this.keymap[k][0]]) {
                        currentScoutData[this.keymap[k][0]] = {};
                    }
                    // Set the value
                    currentScoutData[this.keymap[k][0]][this.keymap[k][1]] = currentScout[k] || '';
                }
                if (!currentScoutData.scout.firstName && !currentScoutData.scout.lastName) {
                    continue;
                }
                // Change the object into a new Scout().
                let parents = ['mother', 'father'];
                let transformedParents: Person[] = [];
                for (let k = 0; k < parents.length; k++) {
                    if (!currentScoutData[parents[k]].firstName && !currentScoutData[parents[k]].lastName) {
                        transformedParents.push(null);
                    }
                    transformedParents.push(new Person(
                            currentScoutData[parents[k]].firstName, currentScoutData[parents[k]].lastName,
                            createPhoneNumber(currentScoutData[parents[k]].cellPhone),
                            currentScoutData[parents[k]].email, currentScoutData[parents[k]].slack));

                }
                let scout = new Scout(currentScoutData['scout'].firstName, currentScoutData['scout'].lastName,
                        Patrol[patrolMap[i]],
                        createPhoneNumber(currentScoutData['scout'].cellPhone),
                        currentScoutData['scout'].email, currentScoutData['scout'].slack,
                        createPhoneNumber(currentScoutData['scout'].homePhone),
                        transformedParents[0], transformedParents[1]);
                console.log(currentScoutData.scout.jobA);
                scout.jobs = [currentScoutData.scout.jobA, currentScoutData.scout.jobB];
                scout.WFATrained = currentScoutData.scout.WFATrained;
                if (forEach && forEach(scout) !== false) {
                    result.push(scout);
                }

            }
        }


        return result;
    }

    /**
     * Get a list of all scouts in the directory that have not been excluded during processing (see update).
     */
    public getScouts(): Scout[] {
        return this.scouts;
    }


}

export default Directory;
export { Directory, DirectoryKeys};