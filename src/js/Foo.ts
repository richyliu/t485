import * as $ from "jQuery";
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

/**
 * Provides some extra methods that help you deal with URLs in the address bar.
 */
class URL {

	/**
	 * Clears the hash in the address bar, including the hash tag, without reloading or changing scroll location.
	 * When a browser does not support changing without updating page state (reloading), it changes the hash
	 * with a method that may cause scrolling. To prevent fallbacks use the `setHash(hash, fallback)` signature
	 * with hash set to an empty string (`""`).
	 *
	 * @return - Returns `true` only if the hash was changed _without_ using the fallback. This means that if the fallback is used, or the hash is not
	 * changed at all because the fallback was not enabled, `false` will be returned.
	 *
	 * @example
	 * ```javascript
	 * // Current URL is https://example.com/page#foo, modern browser
	 * URL.setHash("#bar"); // true
	 * // URL is now https://example.com/page#bar, but if a #bar anchor exists, the page did not scroll to the anchor.
	 * URL.setHash(); // true
	 * // URL is now https://example.com/page
	 * ```
	 * ```javascript
	 * // Current URL is https://example.com/page#foo, not a modern browser (no history.pushState support)
	 * URL.setHash("#bar"); // false
	 * // URL is now https://example.com/page#bar, but if a #bar anchor exists, the page scrolled to the anchor.
	 * URL.setHash(); // false
	 * // URL is now https://example.com/#
	 * ```
	 */
	static setHash():boolean;

	/**
	 * Set the hash in the address bar without reloading or changing scroll location -- this will not scroll the page to an anchor.
	 * @param hash - the new hash, including `#`.
	 * @param fallback{default=false} - Set to true to fallback to a conventional method that may cause scrolling if the browser does not support
	 * methods that do not cause scrolling.
	 *
	 * @return - Returns `true` only if the hash was changed _without_ using the fallback. This means that if the fallback is used, or the hash is not
	 * changed at all because the fallback was not enabled, `false` will be returned.
	 *
	 * @example
	 * ```javascript
	 * // Current URL is https://example.com/page#foo, modern browser
	 * URL.setHash("#bar", false); // true
	 * // URL is now https://example.com/page#bar, but if a #bar anchor exists, the page did not scroll to the anchor.
	 * ```
	 * ```javascript
	 * // Current URL is https://example.com/page#foo, not a modern browser (no history.pushState support)
	 * URL.setHash("#bar", false); // false
	 * // URL does not change
	 * ```
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
	 *
	 * @example
	 * ```javascript
	 * // Current URL is https://example.com/page?foo=bar&bar=baz#anchor, modern browser
	 * URL.setQueryString("?bar=foo"); // true
	 * // URL is now https://example.com/page?bar=foo#anchor, page did not reload
	 * URL.setQueryString(); // true
	 * // URL is now https://example.com/page#anchor, page did not reload
	 * ```
	 * ```javascript
	 * // Current URL is https://example.com/page?foo=bar&bar=baz#anchor, not a modern browser (no history.pushState support)
	 * URL.setQueryString("?bar=foo"); // false
	 * // URL is now https://example.com/page?bar=foo#anchor, but the page reloaded.
	 * URL.setQueryString(); // false
	 * // URL is now https://example.com/#anchor, but the page reloaded
	 * ```
	 */
	static setQueryString(queryString:string):boolean;

	/**
	 * Changes the query string in the address bar without reloading the page to a string.
	 *
	 * @param queryString - The full query string, including `?`.
	 * @param fallback - Pass true to use a fallback that reloads the page when
	 * a browser does not support changing the query string without reloading.
	 *
	 * @example
	 * ```javascript
	 * // Current URL is https://example.com/page?foo=bar, modern browser
	 * URL.setHash("?bar=baz", false); // true
	 * // URL is now https://example.com/page?bar=baz, page did not reload
	 * ```
	 * ```javascript
	 * // Current URL is https://example.com/page?foo=bar, not a modern browser (no history.pushState support)
	 * URL.setHash("?bar=baz", false); // false
	 * // URL does not change, page does not reload
	 * ```
	 */
	static setQueryString(queryString:string, fallback:boolean):boolean;

	static setQueryString(queryString:string="", fallback:boolean=false):boolean {
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

class LinkState {

	/**
	 * For each element with the `.preserve-page` class, the element's href's continue URL parameter is changed to the current URL.
	 *
	 * @example
	 * ```html
	 * <!-- Current URL is https://example.com/?continue=page2 -->
	 * <a href="page?continue=foo">Link</a>
	 * ```
	 * After `LinkState.preservePage()`:
	 * ```html
	 * <a href="page?continue=https%3A%2F%2Fexample.com%2F%3Fcontinue%3Dpage2">Link</a>
	 * ```
	 */
	static preservePage() {
		$(".preserve-page").each(function() {

			var href = $(this).attr("href");
			var base = href.substring(0,(href.indexOf("?") > -1 ? href.indexOf("?") : undefined));
			var query = Query.set("continue", encodeURIComponent(window.location.href), Query.getString(href));
			var hash = (href.indexOf("#") > -1 ? href.substring(href.indexOf("#")) : "");
			$(this).attr("href", base + query + hash);
		});
	}

	/**
	 * For each element with the `.preserve-state` class, the element's href's continue URL parameter is changed to the current continue URL parameter.
	 * Essentially, the continue URL parameter is passed along, but not modified.
	 *
	 * @example
	 * ```html
	 * <!-- Current URL is https://example.com/?continue=page2 -->
	 * <a href="page?continue=foo">Link</a>
	 * ```
	 * After `LinkState.preserveState()`:
	 * ```html
	 * <a href="page?continue=page2">Link</a>
	 * ```
	 */
	static preserveState() {


		if (Query.get("continue") !== "" && Query.get("continue") != null) {

			$(".preserve-state").each(function() {


				var href = $(this).attr("href");
				var base = href.substring(0,(href.indexOf("?") > -1 ? href.indexOf("?") : undefined));
				var query = Query.set("continue", encodeURIComponent(Query.get("continue")), encodeURIComponent(Query.getString(href)));
				var hash = (href.indexOf("#") > -1 ? href.substring(href.indexOf("#")) : "");

				$(this).attr("href", base + query + hash);
			});
		}


	}

}

export {Query, URL, LinkState};