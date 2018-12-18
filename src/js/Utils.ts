/**
 * Contains some key static functions for working with query strings.
 */
class Query {


	/**
	 * Gets a parameter `name` from the current query string.
	 * @param name - The name of the parameter to get.
	 *
	 * @return The requested element
	 */
	static get(name:string):string;

	/**
	 * Gets a parameter `name` from the query string of `url`.
	 * @param name - The name of the parameter to get.
	 * @param url - The url from which to get the parameter.
	 *
	 * @return The requested element
	 */
	static get(name:string, url:string):string;

	static get(name: string, url: string=window.location.href):string {

		//https://stackoverflow.com/a/901144/5511561
		name = name.replace(/[\[\]]/g, '\\$&');
		let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}

	/**
	 * Get the query string from the current URL.
	 */
	static getString():string;

	/**
	 * Gets the query string (including `?`, up to but not including the hash if included).
	 * @param url - The url from which to get the string.
	 */
	static getString(url:string):string;

	static getString(url:string=window.location.href):string {
		if (url.indexOf("?") < 0) return "";
		return url.substring(url.indexOf("?"), (url.indexOf("#") > -1 ? url.indexOf("#") : undefined))
	}

	/**
	 * Returns all the query parameters from the current URL as an object.
	 */
	static getAll():string;

	/**
	 * Returns all the query parameters from `url` as an object
	 */
	static getAll(url:string):string;

	// getAll Implementation
	static getAll(url?:string):string {
		var search = Query.getString(url).substring(1);
		return JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
	}

	/**
	 * Returns a string containing the current query string with the name set to value. If name already exists, it is overwritten.
	 * @param name - The name of the parameter to set.
	 * @param value - The value to set the parameter to. Passing `false` removes the parameter.
	 *
	 * @return The modified query string.
	 */
	static set(name:string, value:string):string;

	/**
	 * Returns a string containing the provided query string with the name set to value. If name already exists, it is overwritten.
	 * @param name - The name of the parameter to set.
	 * @param value - The value to set the parameter to. Passing `false` removes the parameter.
	 * @param queryString - The query string to modify.
	 *
	 * @return The modified query string.
	 */
	static set(name:string, value:string, queryString:string):string;

	static set(name:string, value:string, queryString:string=window.location.search):string {
		//https://stackoverflow.com/a/10997390/5511561

		if (value !== null && value !== undefined ) value = "" + value; //we want falsey values to be used literally, as a string (e.g. 0 -> "0", false -> "false).
		let regex = new RegExp("([?;&])" + name + "[^&;]*[;&]?");
		let query = queryString.replace(regex, "$1").replace(/&$/, '');

		return (query.length > 2 ? query + "&" : "?") + (value ? name + "=" + value : '');
	}


}

/**
 * Wrapper for window.location
 */
class URL {

	/**
	 * Clears the hash in the address bar, including the hash tag, without reloading or changing scroll location.
	 * When a browser does not support changing without updating page state (reloading), it changes the hash
	 * with a method that may cause scrolling. To prevent fallbacks use the `setHash(hash, fallback)` signature
	 * with hash set to an empty string (`""`).
	 *
	 * @returns `true` only if the hash was changed _without_ using the fallback. This means that if the fallback is used, or the hash is not
	 * changed at all because the fallback was not enabled, `false` will be returned.
	 */
	static setHash():boolean;

	/**
	 * Set the hash in the address bar without reloading or changing scroll location -- this will not scroll the page to an anchor.
	 * @param hash - the new hash, including `#`.
	 * @param fallback{default=false} - Set to true to fallback to a conventional method that may cause scrolling if the browser does not support
	 * methods that do not cause scrolling.
	 *
	 * @returns `true` only if the hash was changed _without_ using the fallback. This means that if the fallback is used, or the hash is not
	 * changed at all because the fallback was not enabled, `false` will be returned.
	 */
	static setHash(hash:string, fallback:boolean):boolean;

	static setHash(hash:string="", fallback:boolean=false):boolean {
		if (history.pushState) {
			history.pushState("", document.title, window.location.pathname
				+ window.location.search + hash);
			return true;
		} else if (fallback) {
			window.location.href = hash;
		}
		return false;
	}

	/**
	 * Changes the query string in the address bar without reloading the page to a string.
	 *
	 * @param queryString - The full query string, including `?`.
	 * @param fallback - Pass true to use a fallback that reloads the page when
	 * a browser does not support changing the query string without reloading.
	 */
	static setQueryString(queryString:string, fallback:boolean=false):boolean {
		//https://stackoverflow.com/a/19279428/5511561

		let newURL = window.location.protocol + "//" + window.location.host + window.location.pathname + queryString + window.location.hash;
		if (history.pushState) {
			window.history.pushState({path:newURL},'',newURL);
			return true;
		} else if (fallback) {
			window.location.href = newURL;
		}
		return false;

	}
}
export {Query, URL};