//var Logger = (function() {


	"use strict";
	//handles logging and the feedback button

	$("#feedback-btn").click(function () {
		$("#feedback-modal").modal("show")
	});

	$("#bug-affected-pages").val(window.location.href);
	$("#issueType").change(function () {
		let val = $(this).val();

		$(".feedback-section:not(.feedback-" + val + ")").collapse("hide");
		$(".feedback-" + val).collapse("show");
		$(".feedback-hide.feedback-" + val + "-hide").addClass("hidden");
		$(".feedback-hide:not(.feedback-" + val + "-hide)").removeClass("hidden");


	});

	let getInfo = function() {
		let getBrowser = function() {
			// UA can be easily spoofed, this is a secondary method

			// Chrome 1+
			if (!!window.chrome && !!window.chrome.webstore) return "chrome";

			// Firefox 1.0+
			if (typeof InstallTrigger !== 'undefined') return "firefox";

			// Safari 3.0+ "[object HTMLElementConstructor]"
			if (/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })
			(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification))) return "safari";

			// Opera 8.0+
			if ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) return "opera";


			// Internet Explorer 6-11
			if (/*@cc_on!@*/false || !!document.documentMode) return "ie";

			// Edge 20+
			if (!isIE && !!window.StyleMedia) return "edge";


			// Blink engine detection
			if ((isChrome || isOpera) && !!window.CSS) return "blink";

			return "unknown";
		}
		let getOS = function() {
			var userAgent = window.navigator.userAgent,
				platform = window.navigator.platform,
				macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
				windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
				iosPlatforms = ['iPhone', 'iPad', 'iPod'],
				os = null;

			if (macosPlatforms.indexOf(platform) !== -1) {
				os = 'Mac OS';
			} else if (iosPlatforms.indexOf(platform) !== -1) {
				os = 'iOS';
			} else if (windowsPlatforms.indexOf(platform) !== -1) {
				os = 'Windows';
			} else if (/Android/.test(userAgent)) {
				os = 'Android';
			} else if (!os && /Linux/.test(platform)) {
				os = 'Linux';
			}

			return os;
		};
		let getNavigator = function() {
			let _navigator = {};
			for (let i in navigator) _navigator[i] = navigator[i];

			delete _navigator.plugins;
			delete _navigator.mimeTypes;
			return _navigator;
		}

		return {
			userAgent:window.navigator.userAgent,
			browserByDuckTyping: getBrowser(),
			platform:window.navigator.platform,
			detectedOS:getOS(),
			navigator:getNavigator()
		}
	}

	let bugFields = [{
		name: "title",
		validation: /^.{10,150}$/,
		maxLength: 150,
		minLength: 10
	}, {
		name: "description",
		validation: /^.{0,5000}$/,
		maxLength: 5000,
		minLength: 0
	}, {
		name: "affected-pages",
		validation: /^.{0,500}$/,
		maxLength: 500,
		minLength: 0
	},
	{
		name: "name",
		validation: /^.{3,100}$/,
		general:true
	},
	{
		name: "email",
		validation: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
		general:true
	}];

	for (let i = 0; i < bugFields.length; i ++) {

		let onChange = function() {
			let text = $("#" + (bugFields[i].general ? "" : "bug-") + bugFields[i].name).val();
			let length = text.length;


			if (bugFields[i].maxLength && bugFields[i].minLength) {
				let valid = length >= bugFields[i].minLength;
				$("#" + (bugFields[i].general ? "" : "bug-") + bugFields[i].name + "-unit").text(valid ? " / " + bugFields[i].maxLength : " characters to go");
				$("#" + (bugFields[i].general ? "" : "bug-") + bugFields[i].name + "-length").text(valid ? length : bugFields[i].minLength - length);
			}

			let regexValid = bugFields[i].validation.test(text);
			if (regexValid && bugFields[i].wasValid !== true) {
				//we don't want to say a field is invalid while the user is still completing the field, so
				bugFields[i].wasValid = true;
			} else if (!regexValid && bugFields[i].wasValid === true) {
				$("#" + (bugFields[i].general ? "" : "bug-") + bugFields[i].name).addClass("is-invalid");
			} else if ($("#" + (bugFields[i].general ? "" : "bug-") + bugFields[i].name).hasClass("is-invalid")) {
				$("#" + (bugFields[i].general ? "" : "bug-")  + bugFields[i].name).removeClass("is-invalid");
			}

		}


		$("#" + (bugFields[i].general ? "" : "bug-") + bugFields[i].name).on("change paste keyup", onChange);
		onChange();

	}

	$("#feedback-submit").click(function () {
		let sendBug = function () {
			//validate
			let invalid = false;
			for (let i = 0; i < bugFields.length; i ++) {
				let text = bugFields[i].general === true ? $("#" + bugFields[i].name).val() : $("#bug-" + bugFields[i].name).val();
				console.log(bugFields[i].general, bugFields[i].name, text)

				if (!(bugFields[i].validation.test(text))) {
					invalid = true;
					$((bugFields[i].general ? "#" : "#bug-") + bugFields[i].name).addClass("is-invalid");

				}

			}
			if (invalid) {
				return;
			}
			//show
			$("#feedback-main").addClass("hidden");
			$("#feedback-loading").removeClass("hidden");

			//set percentage
			$("#feedback-progressbar").css("width", "0%");
			$("#feedback-progressbar").html("0%");
			$("#feedback-progressbar").attr("aria-valuenow", "0%");
		}
		let sendFeature = function () {

		}

		let type = $("#issueType").val();
		switch (type) {
			case "bug":
				sendBug();
				break;
			case "feature":
				sendFeature();
				break;
			default:
				break;
		}

	});

	$(".custom-file-input").on('change', function () {

		//get the file name
		var fileName = $(this).val();
		fileName = fileName.substring(fileName.lastIndexOf("\\") + 1);
		console.log(fileName)
		//replace the "Choose a file" label
		$(this).next('.custom-file-label').css("white-space: nowrap;overflow:hidden;");
		$(this).next('.custom-file-label').html(fileName);
	});
	$("#bug-file-clear").click(function() {
		$("#bug-file").val(null);
		$("#bug-file").next('.custom-file-label').html("Choose File");

	});

	var Logger = {};
// 	return Logger;
// })();