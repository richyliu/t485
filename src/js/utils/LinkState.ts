import $ from "jQuery";
import Query from "../utils/Query";

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

export default LinkState;
export { LinkState };