/**
 * Contains some key static functions for working with query strings.
 */
class Query {

	/**
	 * Gets a parameter `name` from the query string of `url`.
	 * @param name - The name of the parameter to get.
	 * @param url - The url from which to get the parameter.
	 *
	 * @return The requested element
	 */
	static get(name: string, url: string=window.location.href) {

		//https://stackoverflow.com/a/901144/5511561
		name = name.replace(/[\[\]]/g, '\\$&');
		let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}

	/**
	 * Gets the query string (including `?`, up to but not including the hash if included).
	 * @param url - The url from which to get the string.
	 */
	static getString(url:string=window.location.href) {
		if (url.indexOf("?") < 0) return "";
		return url.substring(url.indexOf("?"), (url.indexOf("#") > -1 ? url.indexOf("#") : undefined))
	}

	/**
	 * Returns all the query parameters from the current URL as an object.
	 */
	static getAll();

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
	 * Returns a query string with the name set to value. If name already exists, it is overwritten.
	 * @param name - The name of the parameter to set.
	 * @param value - The value to set the parameter to. Passing `false` removes the parameter.
	 * @param queryString - The query string to modify.
	 */
	static set(name:string, value:string="", queryString:string=window.location.search) {
		//https://stackoverflow.com/a/10997390/5511561

		if (value !== null && value !== undefined ) value = "" + value; //we want falsey values to be used literally, as a string (e.g. 0 -> "0", false -> "false).
		let regex = new RegExp("([?;&])" + name + "[^&;]*[;&]?");
		let query = queryString.replace(regex, "$1").replace(/&$/, '');

		return (query.length > 2 ? query + "&" : "?") + (value ? name + "=" + value : '');
	}


}


export {Query};
// function removeHash () {
// 	history.pushState("", document.title, window.location.pathname
// 		+ window.location.search);
// }
//
//
// //http://stackoverflow.com/a/17606289/5511561s
// String.prototype.replaceAll = function(search, replacement) {
// 	var target = this;
// 	return target.replace(new RegExp(escapeRegExp(search), 'g'), replacement);
// };
//
// //http://stackoverflow.com/a/17606289/5511561s (footnote),
//
// function escapeRegExp(str) {
// 	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
//}