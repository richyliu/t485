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

	let getExtensionFromFilename = function(filename) {
		return filename.slice((Math.max(0, filename.lastIndexOf(".")) || Infinity) + 1);

	}
	let upload = function(file) {
		console.log("Size", file.size);

		// File or Blob named mountains.jpg
		//var file = ...

		// Create the file metadata
		var metadata = {
			contentType: file.type
		};

		var storageRef = firebase.storage().ref();

		// Upload file and metadata
		var uploadTask = storageRef.child("/feedback/bug/files/" + file.name).put(file, metadata);

		$("#upload-control").removeClass("hidden");

		// Listen for state changes, errors, and completion of the upload.
		uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
			function(snapshot) {
				// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
				var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

				progress = Math.round(progress * 100) / 100;

				$("#feedback-progressbar").css("width", progress + "%");
				$("#feedback-progressbar").html(progress + "%");
				$("#feedback-progressbar").attr("aria-valuenow", progress + "%");

				switch (snapshot.state) {
					case firebase.storage.TaskState.PAUSED: // or 'paused'
						$("#upload-control-play").addClass("hidden");
						$("#upload-control-resume").removeClass("hidden");

						console.log('Upload is paused');
						break;
					case firebase.storage.TaskState.RUNNING: // or 'running'
						$("#upload-control-resume").addClass("hidden");
						$("#upload-control-play").removeClass("hidden");

						console.log('Upload is running');
						break;
				}
			}, function(error) {

				// A full list of error codes is available at
				// https://firebase.google.com/docs/storage/web/handle-errors
				switch (error.code) {

					case 'storage/canceled':
						// User canceled the upload
						$("#feedback-modal .modal-body").addClass("hidden");
						$("#feedback-cancelled").removeClass("hidden");
						break;

					case "storage/cannot-slice-blob":
						$("#feedback-modal .modal-body").addClass("hidden");
						$("#feedback-filechangederror").removeClass("hidden");
						break;

					default:
						// Unknown error occurred, inspect error.serverResponse
						$("#feedback-error-data").html(btoa(JSON.stringify(error)));

						break;
				}
			}, function() {
				// Upload completed successfully, now we can get the download URL
				uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
					console.log('File available at', downloadURL);
				});
				$("#feedback-modal .modal-body").addClass("hidden");
				$("#feedback-done").removeClass("hidden");
			});
	}
	$("#feedback-submit").click(function () {
		let sendBug = function () {
			//validate
			let invalid = false;
			for (let i = 0; i < bugFields.length; i ++) {
				let text = bugFields[i].general === true ? $("#" + bugFields[i].name).val() : $("#bug-" + bugFields[i].name).val();
				console.log(bugFields[i].general, bugFields[i].name, text);

				if (!(bugFields[i].validation.test(text))) {
					invalid = true;
					$((bugFields[i].general ? "#" : "#bug-") + bugFields[i].name).addClass("is-invalid");

				}

			}

			//file
			var file = $("#bug-file")[0].files[0];

			const MEGABYTE = 1048576; // binary
			if (file.size > MEGABYTE * 101) {//small buffer
				$("#bug-file").addClass("is-invalid");
				$("#bug-file-group invalid-feedback").removeClass("")
				invalid = true;
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

			upload(file);


		}
		let sendFeature = function () {

		}
		$(".uploading-hide").addClass("hidden");
		$(".uploading-show").removeClass("hidden");
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
		console.log(fileName);

		if ($("#bug-file").hasClass("is-invalid"))
			$("#bug-file").removeClass("is-invalid");
		//replace the "Choose a file" label
		$(this).next('.custom-file-label').css("white-space: nowrap;overflow:hidden;");
		$(this).next('.custom-file-label').html(fileName);
	});
	$("#bug-file-clear").click(function() {
		$("#bug-file").val(null);
		$("#bug-file").next('.custom-file-label').html("Choose File");

	});

	var Logger = {};
	Logger.log = function() {

	}
// 	return Logger;
// })();