/**
 * Contains some key static functions for working with query strings.
 */
class Query {

	static x() {
		return 0;
	}

	/**
	 * Gets a parameter `name` from the current query string.
	 * @param name - The name of the parameter to get.
	 *
	 * @return The requested element from the query URL, URL component decoded.
	 *
	 * @example
	 * ```javascript
	 * // query string: ?foo=Hello%20World&bar=&baz
	 * let foo = Query.get('foo'); // "Hello World" (URL Component decoded)
	 * let bar = Query.get('bar'); // "" (present with empty value)
	 * let baz = Query.get('baz'); // "" (present with no value)
	 * let qux = Query.get('qux'); // null (absent)
	 * ```
	 */
	static get(name:string):string;

	/**
	 * Gets a parameter `name` from the query string of `url`.
	 * @param name - The name of the parameter to get.
	 * @param url - The url from which to get the parameter.
	 *
	 * @return The requested element
	 *
	 * @example
	 * ```javascript
	 * let url = "https://example.com/example?foo=Hello%20World&bar=&baz";
	 * let foo = Query.get('foo', url); // "Hello World" (URL Component decoded)
	 * let bar = Query.get('bar', url); // "" (present with empty value)
	 * let baz = Query.get('baz', url); // "" (present with no value)
	 * let qux = Query.get('qux', url); // null (absent)
	 * ```
	 */
	static get(name:string, url:string):string;

	static get(name: string, url: string=window.location.href):string {
		//https://stackoverflow.com/a/901144/5511561
		name = name.replace(/[\[\]]/g, '\\$&');
		let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return "";
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}

	/**
	 * Get the query string from the current URL.
	 *
	 * @example
	 * ```javascript
	 * // URL is https://example.com/example?foo=Hello%20World&bar=baz#anchor
	 * let queryString = getString(); // "?foo=Hello%20World&bar=baz"
	 * ```
	 */
	static getString():string;

	/**
	 * Gets the query string (including `?`, up to but not including the hash if included).
	 * @param url - The url from which to get the string.
	 *
	 * @example
	 * ```javascript
	 * let url = "https://example.com/example?foo=Hello%20World&bar=baz#anchor";
	 * let queryString = getString(url); // "?foo=Hello%20World&bar=baz"
	 * ```
	 */
	static getString(url:string):string;

	static getString(url:string=window.location.href):string {
		if (url.indexOf("?") < 0) return "";
		return url.substring(url.indexOf("?"), (url.indexOf("#") > -1 ? url.indexOf("#") : undefined))
	}

	/**
	 * Returns all the query parameters from the current URL as an object.
	 *
	 * @example
	 * ```javascript
	 * // Current URL is https://example.com/example?foo=Hello%20World&bar=&baz
	 * let params = Query.getAll();
	 * // params == {
	 * //     foo:"Hello World",
	 * //     bar:"",
	 * //     baz:"",
	 * // }
	 * ```
	 */
	static getAll():string;

	/**
	 * Returns all the query parameters from `url` as an object
	 *
	 * @example
	 * ```javascript
	 * let url = "https://example.com/example?foo=Hello%20World&bar=&baz";
	 * let params = Query.getAll(url);
	 * // params == {
	 * //     foo:"Hello World",
	 * //     bar:"",
	 * //     baz:"",
	 * // }
	 * ```
	 */
	static getAll(url:string):string;

	static getAll(url?:string):string {
		var search = Query.getString(url).substring(1);
		return JSON.parse('{"' + decodeURI(search)
			.replace(/"/g, '\\"')
			.replace(/&/g, '","')
			.replace(/=/g,'":"') + '"}');
	}

	/**
	 * Returns a string containing the current query string with the name set to value. If name already exists, it is overwritten.
	 * @param name - The name of the parameter to set.
	 * @param value - The value to set the parameter to. Passing `null` removes the parameter.
	 *
	 * @return The modified query string.
	 *
	 * @example
	 * ```javascript
	 * // Current URL is https://example.com/example?continue=foo&hello=world
	 * let str1 = Query.set("continue", "bar"); // "?continue=bar&hello=world"
	 * let str2 = Query.set("quo", "baz"); // "?continue=foo&hello=world&quo=baz"
	 * let str3 = Query.set("continue", null); // "?hello=world"
	 * ```
	 */
	static set(name:string, value:string):string;

	/**
	 * Returns a string containing the provided query string with the name set to value. If name already exists, it is overwritten.
	 * @param name - The name of the parameter to set.
	 * @param value - The value to set the parameter to. Passing `null` removes the parameter.
	 * @param queryString - The query string to modify.
	 *
	 * @return The modified query string.
	 *
	 * @example
	 * ```javascript
	 * let queryString = "?continue=foo&hello=world";
	 * let str1 = Query.set("continue", "bar", queryString); // "?continue=bar&hello=world"
	 * let str2 = Query.set("quo", "baz", queryString); // "?continue=foo&hello=world&quo=baz"
	 * let str3 = Query.set("continue", null, queryString); // "?hello=world"
	 * ```
	 */
	static set(name:string, value:string, queryString:string):string;

	static set(name:string, value:string, queryString:string=window.location.search):string {
		// https://stackoverflow.com/a/19472410/5511561

		//we want falsey values to be used literally, as a string (e.g. 0 -> "0", false -> "false"):
		if (value !== null && value !== undefined) value = "" + value;

		let regex = new RegExp("([?;&])" + name + "[^&;]*[;&]?");
		let query = queryString.replace(regex, "$1").replace(/&$/, '');
		return (query.length > 2 ? query + "&" : "?") + (value ? name + "=" + value : '');
	}


}
export default Query;
export {Query};