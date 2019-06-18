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

/**
 * A spreadsheet cache contains a copy of spreadsheet data that will be used if the spreadsheet has not been modified since the cache date.
 */
interface SpreadsheetCache {
    timestamp: number;
    data: object;
}

class Spreadsheet {
    protected keys: SpreadsheetKeys;
    protected cache: SpreadsheetCache;
    protected cacheUsed: boolean;

    /**
     * Create a new SpreadSheet instance
     * @param keys - The keys for the spreadsheet.
     * @param cache - A optional spreadsheet cache can be specified, which will be used if the spreadsheet has been determined to not have been modified
     * since the cache date.
     */
    constructor(keys: SpreadsheetKeys, cache?: SpreadsheetCache) {
        this.keys = keys;
        if (cache) {
            this.cache = cache;
        }
    }

    /**
     * Get the data from multiple sheets within a spreadsheet.
     * @param sheets - A list of the names of the sheets
     * @param range - The range from which to get data within each sheet
     * @param callback - A function to call when the data has been retrieved asynchronously.
     */
    getSheets(sheets: string[], range: string) {
        let getData = function(rangeString, timestamp, resolve, reject) {
            $.ajax({
                url: `https://sheets.googleapis.com/v4/spreadsheets/${keys.id}/values:batchGet/?${rangeString}majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&key=${keys.api}`,
                method: "GET",
                dataType: "json",
            }).done(function(data: object) {
                resolve({ ...data, timestamp: timestamp });
            }).fail(function(jqxhr: JQuery.jqXHR) {
                reject({
                    type: "ajax",
                    jqxhr: jqxhr,
                });
            });
        };
        let keys = this.keys;
        let _this = this;
        return new Promise(function(resolve, reject) {
            let rangeString = ``;
            for (let i = 0; i < sheets.length; i++) {
                rangeString += `ranges=${sheets[i]}!${range}&`;
            }
            _this.cacheUsed = false;
            $.ajax({
                url: `https://www.googleapis.com/drive/v3/files/${keys.id}?fields=modifiedTime&key=${keys.api}`,
                method: "GET",
                dataType: "json",
            }).done(function(data: { modifiedTime: string; }) {

                if (!_this.cache || new Date(data.modifiedTime).getTime() != _this.cache.timestamp) {
                    getData(rangeString, new Date(data.modifiedTime).getTime(), resolve, reject);
                } else {
                    _this.cacheUsed = true;
                    resolve(_this.cache);
                }
            }).fail(function(jqxhr: JQuery.jqXHR) {
                reject({
                    type: "cacheCheckAjax",
                    jqxhr: jqxhr,
                });
            });

        });
    }


}

export default Spreadsheet;
export { Spreadsheet, SpreadsheetKeys, SpreadsheetCache };