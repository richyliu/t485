import * as $ from "jQuery";

/**
 * A simple alert class for use with AlertBox.
 */
class Alert {
	public context:string;
	public text:string;
	public strongText:string;
	public group:string;
	public dismissible:boolean;

	/**
	 *
	 * @param group - The group/type of alert. An alert of the same group will overwrite all previous alerts of that group. Alerts with "" or null as a group are never overwritten.
	 * @param context
	 * @param strongText
	 * @param text
	 * @param dismissible
	 */
	constructor(text:string, group:string, context:string, strongText:string, dismissible:boolean=true) {
		this.group = group;
		this.context = context;
		this.strongText = strongText;
		this.text = text;
		this.dismissible = dismissible;
	}

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

class ErrorAlert extends Alert {
	constructor(text:string, group:string="error", dismissible:boolean=true) {
		super(text, group, "danger", "Error!", dismissible)
	}
}

class WarningAlert extends Alert {
	constructor(text:string, group:string="warning", dismissible:boolean=true) {
		super(text, group, "warning", "Warning!", dismissible)
	}
}

class SuccessAlert extends Alert {
	constructor(text:string, group:string="success", dismissible:boolean=true) {
		super(text, group, "success", "Success!", dismissible)
	}
}


class AlertBox{
	public selector:string;


	constructor(selector:string) {
		this.selector = selector;
	}

	push(alert:Alert) {
		if (alert.group !== null && alert.group.length > 0) {
			$(this.selector + " [data-alertGroup='" + alert.group + "']").destroy();
		}
		$(this.selector).append(alert.getHTML());
	}

}
export default AlertBox;
export {AlertBox, Alert, ErrorAlert, WarningAlert, SuccessAlert};