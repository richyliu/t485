import $ from "jQuery";
import Element from "./Element";

/**
 * AlertBox provides a way to push Alerts to a div.
 */
class AlertBox{

	/**
	 * The selector of the div to push alerts to.
	 */
	public selector:string;

	/**
	 * Create an AlertBox at the div with the `selector`.
	 * @param selector - The selector of the div to append alerts to.
	 */
	constructor(selector:string) {
		this.selector = selector;
	}

	/**
	 * Push an alert to the AlertBox.
	 * @param alert - The alert to push.
	 */
	push(alert:Alert) {
		if (alert.group !== null && alert.group.length > 0) {
			$(this.selector + " [data-alertGroup='" + alert.group + "']").remove();
		}
		$(this.selector).append(alert.getHTML());
	}

	/**
	 * Clear the AlertBox of all alerts. If the AlertBox div contains elements other than Alerts, those are cleared as well.
	 */
	clear() {
		$(this.selector).html("");
	}


}

/**
 * An Alert element.
 */
class Alert extends Element {

	/**
	 * A contextual class for the alert. Should be a string: primary, secondary, success, danger, warning, info, or dark.
	 */
	public context:string;

	/**
	 * The text inside the alert. HTML will be displayed as HTML.
	 */
	public text:string;

	/**
	 * Strong Text for the alert.
	 */
	public strongText:string;

	/**
	 * The group/type of alert. An alert of the same group will overwrite all previous alerts with the same group. Alerts with "" or null as their group are never overwritten.
	 */
	public group:string;

	/**
	 * Whether the alert should be dismissible by the user.
	 */
	public dismissible:boolean;

	/**
	 *
	 * @param group - The group/type of alert. An alert of the same group will overwrite all previous alerts of that group. Alerts with "" or null as a group are never overwritten.
	 * @param context - The context of the alert.
	 * @param strongText - Strong Text for the alert.
	 * @param text - Text for the alert. This can contain HTML, which will be rendered.
	 * @param dismissible - Whether the alert should be dismissible.
	 */
	constructor(text:string, group:string, context:string, strongText:string, dismissible:boolean=true) {
		super();
		this.group = group;
		this.context = context;
		this.strongText = strongText;
		this.text = text;
		this.dismissible = dismissible;
	}

	/**
	 * @return Returns DOM-ready HTML of the alert.
	 */
	getHTML() {
		let dismissButton = "";

		if (this.dismissible) {
			dismissButton = `
			<button type="button" class="close" data-dismiss="alert" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>`
		}

		return `
			<div class="alert alert-${this.context} ${this.dismissible ? "alert-dismissible fade show" : ""}" role="alert" data-alertGroup="${this.group}">
			  <strong>${this.strongText}</strong> ${this.text}
			  ${dismissButton}
			</div>`;
	}
}

/**
 * Contextual alert for errors.
 */
class ErrorAlert extends Alert {

	/**
	 *
	 * @param text - The text of the alert. HTML in this field will be rendered.
	 */
	constructor(text: string);

	/**
	 *
	 * @param text - The text of the alert. HTML in this field will be rendered.
	 * @param dismissible - Whether the alert should be dismissible.
	 */
	constructor(text:string, dismissible:boolean);

	/**
	 *
	 * @param text - The text of the alert. HTML in this field will be rendered.
	 * @param group - The group/type of alert. An alert of the same group will overwrite all previous alerts of that group. Alerts with "" or null as a group are never overwritten.
	 */
	constructor(text:string, group:string)

	/**
	 *
	 * @param text - The text of the alert. HTML in this field will be rendered.
	 * @param group - The group/type of alert. An alert of the same group will overwrite all previous alerts of that group. Alerts with "" or null as a group are never overwritten.
	 * @param dismissible - Whether the alert should be dismissible.
	 */
	constructor(text:string, group:string, dismissible:boolean);

	constructor(text:string, group:boolean|string="error", dismissible:boolean=true) {

		if (typeof group == "boolean") {
			dismissible = group;
			group = "error";
		}
		super(text, group, "danger", "Error!", dismissible);
	}


}

/**
 * Contextual alert for warnings.
 */
class WarningAlert extends Alert {

	/**
	 *
	 * @param text - The text of the alert. HTML in this field will be rendered.
	 */
	constructor(text: string);

	/**
	 *
	 * @param text - The text of the alert. HTML in this field will be rendered.
	 * @param dismissible - Whether the alert should be dismissible.
	 */
	constructor(text:string, dismissible:boolean);

	/**
	 *
	 * @param text - The text of the alert. HTML in this field will be rendered.
	 * @param group - The group/type of alert. An alert of the same group will overwrite all previous alerts of that group. Alerts with "" or null as a group are never overwritten.
	 */
	constructor(text:string, group:string)

	/**
	 *
	 * @param text - The text of the alert. HTML in this field will be rendered.
	 * @param group - The group/type of alert. An alert of the same group will overwrite all previous alerts of that group. Alerts with "" or null as a group are never overwritten.
	 * @param dismissible - Whether the alert should be dismissible.
	 */
	constructor(text:string, group:string, dismissible:boolean);

	constructor(text:string, group:boolean|string="warning", dismissible:boolean=true) {

		if (typeof group == "boolean") {
			dismissible = group;
			group = "error";
		}

		super(text, group, "warning", "Warning!", dismissible)
	}
}

/**
 * Contextual alert for success.
 */
class SuccessAlert extends Alert {

	/**
	 *
	 * @param text - The text of the alert. HTML in this field will be rendered.
	 */
	constructor(text: string);

	/**
	 *
	 * @param text - The text of the alert. HTML in this field will be rendered.
	 * @param dismissible - Whether the alert should be dismissible.
	 */
	constructor(text:string, dismissible:boolean);

	/**
	 *
	 * @param text - The text of the alert. HTML in this field will be rendered.
	 * @param group - The group/type of alert. An alert of the same group will overwrite all previous alerts of that group. Alerts with "" or null as a group are never overwritten.
	 */
	constructor(text:string, group:string)

	/**
	 *
	 * @param text - The text of the alert. HTML in this field will be rendered.
	 * @param group - The group/type of alert. An alert of the same group will overwrite all previous alerts of that group. Alerts with "" or null as a group are never overwritten.
	 * @param dismissible - Whether the alert should be dismissible.
	 */
	constructor(text:string, group:string, dismissible:boolean);

	constructor(text:string, group:boolean|string="success", dismissible:boolean=true) {

		if (typeof group == "boolean") {
			dismissible = group;
			group = "error";
		}

		super(text, group, "success", "Success!", dismissible)
	}
}



export default AlertBox;
export {AlertBox, Alert, ErrorAlert, WarningAlert, SuccessAlert};