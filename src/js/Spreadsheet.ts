import $ from "jquery";

/**
 * Provides a way to query the Google Sheet API to get data from a spreadsheet.
 */

/**
 * Keys to access the google sheet API.
 */
interface SpreadsheetKeys {

    /**
     * The ID of the spreadsheet to get. This is present in the URL.
     */
    id: string,

    /**
     * A google API key able to access the requested spreadsheet.
     */
    api: string
}

class Spreadsheet {
    protected keys: SpreadsheetKeys;

    /**
     * Create a new SpreadSheet instance
     * @param keys - The keys for the spreadsheet.
     */
    constructor(keys: SpreadsheetKeys) {
        this.keys = keys;
    }

    /**
     * Get the data from multiple sheets within a spreadsheet.
     * @param sheets - A list of the names of the sheets
     * @param range - The range from which to get data within each sheet
     * @param callback - A function to call when the data has been retrieved asynchronously.
     */
    getSheets(sheets: string[], range: string) {
        let keys = this.keys;
        return new Promise(function(resolve, reject) {
            let rangeString = ``;
            for (let i = 0; i < sheets.length; i++) {
                rangeString += `ranges=${sheets[i]}!${range}&`;
            }
            $.ajax({
                url: `https://sheets.googleapis.com/v4/spreadsheets/${keys.id}/values:batchGet/?${rangeString}majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&key=${keys.api}`,
                method: "GET",
                dataType: "json",
            }).done(function(data: object) {
                resolve(data);
            }).fail(function(jqxhr: JQuery.jqXHR) {
                reject({
                    type: "ajax",
                    jqxhr: jqxhr,
                });
            });
        });
    }


}

export default Spreadsheet;
export { Spreadsheet, SpreadsheetKeys };