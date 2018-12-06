//var Logger = (function() {


	"use strict";
	//handles logging and the feedback button


	var Logger = {};
	Logger.getDebugLog = function() {
		return ["Debug log created", "Debug log sent"];
	}
	//Logger.initFeedback = function() {

		$(document).ready(function() {
			$(window).on("hashchange", function () {
				if (window.location.hash == "#feedback") {
					$("#feedback-modal").modal("show");
				}
			}).trigger("hashchange");
		})


		$("#feedback-btn").click(function () {
			window.location.hash = "#feedback";
			$("#feedback-modal").modal("show");
		});

		$("#feedback-modal").on("hidden.bs.modal", function() {
			//console.log(window.location.hash)
			if (window.location.hash == "#feedback") {
				removeHash();
			}
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
				if (!!window.chrome && !!window.chrome.webstore) return "Google Chrome";

				// Firefox 1.0+
				if (typeof InstallTrigger !== 'undefined') return "Mozilla Firefox";

				// Safari 3.0+ "[object HTMLElementConstructor]"
				if (/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })
				(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification))) return "Safari";

				// Opera 8.0+
				if ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) return "Opera";


				// Internet Explorer 6-11
				if (/*@cc_on!@*/false || !!document.documentMode) return "Internet Explorer";

				// Edge 20+
				if (!isIE && !!window.StyleMedia) return "Edge";


				// Blink engine detection
				if ((isChrome || isOpera) && !!window.CSS) return "Blink";

				return "Unknown";
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
				// let _navigator = {};
				// for (let i in navigator) _navigator[i] = navigator[i];
				//
				// delete _navigator.plugins;
				// delete _navigator.mimeTypes;
				// return _navigator;
				return {
					appCodeName:navigator.appCodeName,
					appName:navigator.appName,
					appVersion:navigator.appVersion,
					doNotTrack:navigator.doNotTrack,
					language:navigator.language,
					languages:navigator.languages,
					platform:navigator.platform,
					online:navigator.onLine,
					product:navigator.product,
					userAgent:navigator.userAgent,
					vendor:navigator.vendor
				}
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
			validation: /^(.|\n){10,150}$/,
			maxLength: 150,
			minLength: 10
		}, {
			name: "description",
			validation: /^(.|\n){0,5000}$/,
			maxLength: 5000,
			minLength: 0
		}, {
			name: "affected-pages",
			validation: /^(.|\n){0,500}$/,
			maxLength: 500,
			minLength: 0
		},
			{
				name: "name",
				validation: /^(.|\n){3,100}$/,
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


				if (bugFields[i].maxLength !== undefined && bugFields[i].minLength !== undefined) {
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

		let roundTo = function(n, digits) {
			if (digits === undefined) {
				digits = 0;
			}

			let multiplicator = Math.pow(10, digits);
			n = parseFloat((n * multiplicator).toFixed(11));
			return Math.round(n) / multiplicator;
		}

		let setProgress = function(progress) {
			progress = roundTo(progress, 2);
			$("#feedback-progressbar").css("width", progress + "%");
			$("#feedback-progressbar").html(progress + "%");
			$("#feedback-progressbar").attr("aria-valuenow", progress + "%");
		}

		let upload = function(file, type, callback) {
			//console.log("Size", file.size);

			// File or Blob named mountains.jpg
			//var file = ...
			if (file == null) {
				callback({
					url:"",
					name:"",
					size:"",
					type:"not uploaded",
					storageRef:""
				}, firebase.database().ref("/feedback/" + type + "/").push())
				return;
			}
			// Create the file metadata
			var metadata = {

				contentType: file.type
			};

			var storageRef = firebase.storage().ref();

			var push = firebase.database().ref("/feedback/" + type + "/").push();
			// Upload file and metadata
			var uploadTask = storageRef.child("/feedback/" + type + "/files/" + push.key).put(file, metadata);

			$("#upload-control, #feedback-progress").removeClass("hidden");

			$("#upload-control-pause").click(function() {
				uploadTask.pause();
				$("#upload-control-pause").addClass("hidden");
				$("#upload-control-resume").removeClass("hidden");
			});
			$("#upload-control-resume").click(function() {
				uploadTask.resume();
				$("#upload-control-resume").addClass("hidden");
				$("#upload-control-pause").removeClass("hidden");
			});
			$("#upload-control-cancel").click(function() {
				uploadTask.cancel();
				$(".uploading-show, #feedback-loading").addClass("hidden");
				$(".uploading-hide, #feedback-main").removeClass("hidden");

			});
			// Listen for state changes, errors, and completion of the upload.
			uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
				function(snapshot) {
					// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
					var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

					progress = (Math.round(progress * 100) / 100) * 0.85;//max is 85%

					setProgress(progress);

					switch (snapshot.state) {
						case firebase.storage.TaskState.PAUSED: // or 'paused'
							$("#upload-control-play").addClass("hidden");
							$("#upload-control-resume").removeClass("hidden");

							//console.log('Upload is paused');
							break;
						case firebase.storage.TaskState.RUNNING: // or 'running'
							$("#upload-control-resume").addClass("hidden");
							$("#upload-control-play").removeClass("hidden");

							//console.log('Upload is running');
							break;
					}
				}, function(error) {

					// A full list of error codes is available at
					// https://firebase.google.com/docs/storage/web/handle-errors
					switch (error.code) {

						case 'storage/canceled':
							// User canceled the upload
							//$("#feedback-modal .modal-body").addClass("hidden");
							//$("#feedback-cancelled").removeClass("hidden");
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
						//console.log('File available at', downloadURL);
						callback({
							url:downloadURL,
							name:file.name,
							size:file.size,
							type:file.type,
							storageRef:"/feedback/" + type + "/files/" + push.key
						}, push)

					});

				});
		}
		$("#feedback-submit").click(function () {
			let sendBug = function (afterValidation) {
				//validate
				let invalid = false;
				for (let i = 0; i < bugFields.length; i ++) {
					let text = bugFields[i].general === true ? $("#" + bugFields[i].name).val() : $("#bug-" + bugFields[i].name).val();
					//console.log(bugFields[i].general, bugFields[i].name, text);

					if (!(bugFields[i].validation.test(text))) {
						invalid = true;
						$((bugFields[i].general ? "#" : "#bug-") + bugFields[i].name).addClass("is-invalid");

					}

				}
				//file
				var file = $("#bug-file")[0].files[0];

				const MEGABYTE = 1048576; // binary
				if (file && file.size > MEGABYTE * 101) {//small buffer
					$("#bug-file").addClass("is-invalid");
					$("#bug-file-group invalid-feedback").removeClass("");
					invalid = true;
				}

				if (invalid) {
					return;
				}

				afterValidation();

				//show
				$("#feedback-main").addClass("hidden");
				$("#feedback-loading").removeClass("hidden");

				//set percentage
				$("#feedback-progressbar").css("width", "0%");
				$("#feedback-progressbar").html("0%");
				$("#feedback-progressbar").attr("aria-valuenow", "0%");

				upload(file, "bug", function(data, push) {
					addIssueOnGithub({
						name:$("#name").val(),
						os:getInfo().detectedOS,
						browser:getInfo().browserByDuckTyping,
						pages:$("#" + type + "-affected-pages").val(),
						body:$("#" + type + "-description").val(),
						title:$("#" + type + "-title").val(),
						type:type,
						fileUrl:data.url,
						fileType:data.type
					}, function(issueURL) {
						setProgress(95);
						let user = firebase.auth().currentUser;
						let userData = {};
						userData.loggedIn = user !== null;
						if (userData.loggedIn) {
							userData = {
								//loggedIn:loggedIn,
								id:user.uid || "Not Logged In",
								email:user.email,
								displayName:user.displayName
							}
						}
						return console.log("/feedback/reports/" + type + "/" + push.key);
						firebase.database().ref("/feedback/reports/" + type + "/" + push.key).push({
							title:$("#" + type + "-title").val(),
							filedata:data,
							timestamp:{
								utc:new Date().getTime(),
								string:new Date()
							},
							type:type,
							personalInfo:{
								name:$("#name").val(),
								email:$("#email").val(),
								user:userData
							},
							requestData:{
								title:$("#" + type + "-title").val(),
								description:$("#" + type + "-description").val(),
								pages:$("#" + type + "-affected-pages").val(),
								github:{
									issueurl:issueURL
								}
							},
							diagnosticData:getInfo(),
							log:Logger.getDebugLog()
						}).then(function() {
							setProgress(100);

							$("#feedback-modal .modal-body").addClass("hidden");
							$("#feedback-done").removeClass("hidden");
							$('#feedback-modal').modal({backdrop: true, keyboard: true})

						});

					});


				});


			}
			let addIssueOnGithub = function(data, callback) {
				firebase.database().ref("/feedback/keys/").once("value").then(function(snapshot) {
					setProgress(90);
					var ghToken = snapshot.val().github;
					var slackUrl = snapshot.val().slack.webhookurl;
					let fileText = "";

					if (data.fileType.split("/")[0] == "image") {
						fileText = `![User uploaded image: ${data.fileUrl}](${data.fileUrl}) "\\\\n\\\\n ------- \\\\n"`;
					} else if (data.fileUrl != null) {
						fileText = "User Uploaded File URL: " + data.fileUrl + "\\n\\n ------- \\n";
					}
					let affectedPages  = "";
					if (data.pages) {
						affectedPages = "**Affected pages**:\\n```" + data.pages + "\\n```\\n"
					}

					let bodyText = data.body != null ? data.body + "\\n ------- \\n": "";
					var type = data.type == "bug" ? "bug report" : "feedback";

					var body = "Data from " + type + " modal submitted by **" + data.name + "**:" +
						"\\n\\n| Timestamp | Device | Browser | Type |" +
						"\\n|---|---|---|---|\\n" +
						"| "+ new Date() +" | "+ data.os +" | "+ data.browser +" | "+ data.type +" | \\n\\n"
						+ affectedPages + fileText +
						bodyText + "This report automatically created from the [t485.org](https://t485.org) feedback form.";

					var payload = `{"title": "${data.title}", "body": "${body}", "labels":["${type == "feedback" ? "enhancement" : type}"] }`;


					$.ajax({
						accepts:{
							json: "application/vnd.github.v3+json",
							"*": "application/vnd.github.v3+json"
						},
						url: "https://api.github.com/repos/t485/t485/issues?access_token=" + ghToken,
						data: payload,
						type: "POST"
					}).always(function( ghdata ) {
						$.ajax({
							url:slackUrl,
							data:'payload=' + JSON.stringify({
								text: `New ${type} filed: ` + ghdata.url
							}),
							type:"POST"
						}).always(function(slackresponse) {

							callback(ghdata.url);
						})

					});
				})


			}
			let sendFeature = function () {
				//validate
				afterValidation();
				//submit
			}
			let afterValidation = function() {
				$(".uploading-hide").addClass("hidden");
				$(".uploading-show").removeClass("hidden");
				$("#feedback-modal").modal({backdrop: "static", keyboard: false})

			}
			let type = $("#issueType").val();
			switch (type) {
				case "bug":
					sendBug(afterValidation);
					break;
				case "feature":
					sendFeature(afterValidation);
					break;
				default:
					break;
			}


		});

		$(".custom-file-input").on('change', function () {

			//get the file name
			var fileName = $(this).val();
			fileName = fileName.substring(fileName.lastIndexOf("\\") + 1);

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
	//}

	Logger.log = function() {

	}
// 	return Logger;
// })();