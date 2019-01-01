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

export default URL;
export {URL};