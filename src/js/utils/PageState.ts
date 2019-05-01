import $ from "jquery";

import Query from "./Query";
import Authenticator from "../server/Authenticator";
class PageState {

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

			let href = $(this).attr("href");
			let base = href.substring(0,(href.indexOf("?") > -1 ? href.indexOf("?") : undefined));
			let query = Query.set("continue", encodeURIComponent(window.location.href), Query.getString(href));
			let hash = (href.indexOf("#") > -1 ? href.substring(href.indexOf("#")) : "");
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


				let href = $(this).attr("href");
				let base = href.substring(0,(href.indexOf("?") > -1 ? href.indexOf("?") : undefined));
				let query = Query.set("continue", encodeURIComponent(Query.get("continue")), encodeURIComponent(Query.getString(href)));
				let hash = (href.indexOf("#") > -1 ? href.substring(href.indexOf("#")) : "");

				$(this).attr("href", base + query + hash);
			});
		}


	}

	/**
	 * Manages the state-specific html classes.
	 *
	 * *Auth State Classes*
	 * .li-show: Elements with this class are shown with a user is logged in, and hidden when a user is not.
	 * .lo-show: Elements with this class are shown when no user is logged in, and hidden when a user is logged in.
	 *
	 * *User Details Classes*
	 * .user-email: The content of elements with this class will be changed to the full email address of the user.
	 * .user-displayName: The content of elements with this class will be changed to the display name of the user.
	 * 		If no display name exists, then it is changed to the email.
	 *
	 */
	static preserveAuthState() {
		let authenticator = new Authenticator();
		authenticator.onAuthStateChanged( function (user) {
			if (user) {
				let email = user.email;
				let displayName = user.displayName;
				$(".user-email").text(email || "An Error Occurred. Code account/emailNotSet");
				$(".user-displayName").text(displayName || "An Error Occurred. Code account/displayNameNotSet");

				$(".lo-show").addClass("hidden");
				$(".li-show").removeClass("hidden");
			} else {
				$(".li-show").addClass("hidden");
				$(".lo-show").removeClass("hidden");
			}
		});
	}

    /**
     * Runs the google analytics script and logs a page view.
     */
	static initAnalytics() {
		//google analytics
		(function(i, s, o, g, r, a, m) {
			i['GoogleAnalyticsObject'] = r;
			i[r] = i[r] || function() {
				(i[r].q = i[r].q || []).push(arguments)
			// @ts-ignore
			}, i[r].l = 1 * new Date();
			a = s.createElement(o),
					m = s.getElementsByTagName(o)[0];
			a.async = 1;
			a.src = g;
			m.parentNode.insertBefore(a, m)
		})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

		ga('create', 'UA-102375833-1', 'auto');
		ga('send', 'pageview');
	}

    /**
     * Runs all three vital state preservation functions.
     * @param preserveState - If true or omitted, preservePage will be run (see docs for options), if false, preserveState is run.
     */
	static init(preservePage: boolean=true) {
		if (preservePage) {
			PageState.preservePage();
		} else {
			PageState.preserveState();
		}
		PageState.preserveAuthState();
		PageState.initAnalytics();
	}


}

export default PageState;
export { PageState };