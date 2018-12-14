var Logger=function(){"use strict";let e=function(e){return e.replace(/\n/g,"\\n").replace(/\'/g,"\\'").replace(/\"/g,'\\"')};var a={_log:[],getDebugLog:function(){return a._log},log:function(e,n){var t={message:e};n&&(t.data=n.data),a._log.push(t),console.log(t)}};return a.initFeedback=function(){$(document).ready(function(){$(window).on("hashchange",function(){"#feedback"==window.location.hash&&$("#feedback-modal").modal("show")}).trigger("hashchange")}),$("#feedback-btn").click(function(){window.location.hash="#feedback",$("#feedback-modal").modal("show")}),$("#feedback-modal").on("hidden.bs.modal",function(){"#feedback"==window.location.hash&&removeHash()}),$("#bug-affected-pages").val(window.location.href),$("#issueType").change(function(){let e=$(this).val();$(".feedback-section:not(.feedback-"+e+")").collapse("hide"),$(".feedback-"+e).collapse("show"),$(".feedback-hide.feedback-"+e+"-hide").addClass("hidden"),$(".feedback-hide:not(.feedback-"+e+"-hide)").removeClass("hidden")});let n=function(){a.log("Getting All Info");return a.log("Returned all info"),{userAgent:window.navigator.userAgent,browserByDuckTyping:(a.log("Getting browser by duck typing"),window.chrome?"Google Chrome":"undefined"!=typeof InstallTrigger?"Mozilla Firefox":/constructor/i.test(window.HTMLElement)||"[object SafariRemoteNotification]"===(!window.safari||"undefined"!=typeof safari&&safari.pushNotification).toString()?"Safari":window.opr&&opr.addons||window.opera||navigator.userAgent.indexOf(" OPR/")>=0?"Opera":document.documentMode?"Internet Explorer":!isIE&&window.StyleMedia?"Edge":(isChrome||isOpera)&&window.CSS?"Blink":"Unknown"),platform:window.navigator.platform,detectedOS:function(){a.log("Getting OS");var e=window.navigator.userAgent,n=window.navigator.platform,t=null;return-1!==["Macintosh","MacIntel","MacPPC","Mac68K"].indexOf(n)?t="Mac OS":-1!==["iPhone","iPad","iPod"].indexOf(n)?t="iOS":-1!==["Win32","Win64","Windows","WinCE"].indexOf(n)?t="Windows":/Android/.test(e)?t="Android":!t&&/Linux/.test(n)&&(t="Linux"),t}(),navigator:(a.log("Getting Navigator"),{appCodeName:navigator.appCodeName,appName:navigator.appName,appVersion:navigator.appVersion,doNotTrack:navigator.doNotTrack,language:navigator.language,languages:navigator.languages,platform:navigator.platform,online:navigator.onLine,product:navigator.product,userAgent:navigator.userAgent,vendor:navigator.vendor})}},t=[{name:"title",validation:/^(.|\n){10,150}$/,maxLength:150,minLength:10},{name:"description",validation:/^(.|\n){0,5000}$/,maxLength:5e3,minLength:0},{name:"affected-pages",validation:/^(.|\n){0,500}$/,maxLength:500,minLength:0},{name:"fb-name",validation:/^(.|\n){3,100}$/,general:!0},{name:"fb-email",validation:/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,general:!0}],i=[{name:"title",validation:/^(.|\n){10,150}$/,maxLength:150,minLength:10},{name:"description",validation:/^(.|\n){0,5000}$/,maxLength:5e3,minLength:0},{name:"fb-name",validation:/^(.|\n){3,100}$/,general:!0},{name:"fb-email",validation:/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,general:!0}];for(let e=0;e<t.length;e++){let a=function(){let a=$("#"+(t[e].general?"":"bug-")+t[e].name).val(),n=a.length;if(void 0!==t[e].maxLength&&void 0!==t[e].minLength){let a=n>=t[e].minLength;$("#"+(t[e].general?"":"bug-")+t[e].name+"-unit").text(a?" / "+t[e].maxLength:" characters to go"),$("#"+(t[e].general?"":"bug-")+t[e].name+"-length").text(a?n:t[e].minLength-n)}let i=t[e].validation.test(a);i&&!0!==t[e].wasValid?t[e].wasValid=!0:i||!0!==t[e].wasValid?$("#"+(t[e].general?"":"bug-")+t[e].name).hasClass("is-invalid")&&$("#"+(t[e].general?"":"bug-")+t[e].name).removeClass("is-invalid"):$("#"+(t[e].general?"":"bug-")+t[e].name).addClass("is-invalid")};$("#"+(t[e].general?"":"bug-")+t[e].name).on("change paste keyup",a),a()}for(let e=0;e<i.length;e++){let a=function(){let a=$("#"+(i[e].general?"":"feat-")+i[e].name).val(),n=a.length;if(void 0!==i[e].maxLength&&void 0!==i[e].minLength){let a=n>=i[e].minLength;$("#"+(i[e].general?"":"feat-")+i[e].name+"-unit").text(a?" / "+i[e].maxLength:" characters to go"),$("#"+(i[e].general?"":"feat-")+i[e].name+"-length").text(a?n:i[e].minLength-n)}let t=i[e].validation.test(a);t&&!0!==i[e].wasValid?i[e].wasValid=!0:t||!0!==i[e].wasValid?$("#"+(i[e].general?"":"feat-")+i[e].name).hasClass("is-invalid")&&$("#"+(i[e].general?"":"feat-")+i[e].name).removeClass("is-invalid"):$("#"+(i[e].general?"":"feat-")+i[e].name).addClass("is-invalid")};$("#"+(i[e].general?"":"feat-")+i[e].name).on("change paste keyup",a),a()}let l=function(e){e=function(e,a){void 0===a&&(a=0);let n=Math.pow(10,a);return e=parseFloat((e*n).toFixed(11)),Math.round(e)/n}(e,2),$("#feedback-progressbar").css("width",e+"%"),$("#feedback-progressbar").html(e+"%"),$("#feedback-progressbar").attr("aria-valuenow",e+"%")};$("#feedback-submit").click(function(){let o=function(e){let i=!1;for(let e=0;e<t.length;e++){let a=!0===t[e].general?$("#"+t[e].name).val():$("#bug-"+t[e].name).val();t[e].validation.test(a)||(i=!0,$((t[e].general?"#":"#bug-")+t[e].name).addClass("is-invalid"))}var o=$("#bug-file")[0].files[0];console.log(o);o&&o.size>105906176&&($("#bug-file").addClass("is-invalid"),$("#bug-file-group invalid-feedback").removeClass(""),i=!0),i||(e(),$("#feedback-main").addClass("hidden"),$("#feedback-loading").removeClass("hidden"),$("#feedback-progressbar").css("width","0%"),$("#feedback-progressbar").html("0%"),$("#feedback-progressbar").attr("aria-valuenow","0%"),function(e,a,n){if(null!=e){var t={contentType:e.type},i=firebase.storage().ref(),o=firebase.database().ref("/feedback/"+a+"/").push(),d=i.child("/feedback/"+a+"/files/"+o.key).put(e,t);$("#upload-control, #feedback-progress").removeClass("hidden"),$("#upload-control-pause").click(function(){d.pause(),$("#upload-control-pause").addClass("hidden"),$("#upload-control-resume").removeClass("hidden")}),$("#upload-control-resume").click(function(){d.resume(),$("#upload-control-resume").addClass("hidden"),$("#upload-control-pause").removeClass("hidden")}),$("#upload-control-cancel").click(function(){d.cancel(),$(".uploading-show, #feedback-loading").addClass("hidden"),$(".uploading-hide, #feedback-main").removeClass("hidden")}),d.on(firebase.storage.TaskEvent.STATE_CHANGED,function(e){var a=e.bytesTransferred/e.totalBytes*100;switch(a=Math.round(100*a)/100*.85,l(a),e.state){case firebase.storage.TaskState.PAUSED:$("#upload-control-play").addClass("hidden"),$("#upload-control-resume").removeClass("hidden");break;case firebase.storage.TaskState.RUNNING:$("#upload-control-resume").addClass("hidden"),$("#upload-control-play").removeClass("hidden")}},function(e){switch(e.code){case"storage/canceled":break;case"storage/cannot-slice-blob":$("#feedback-modal .modal-body").addClass("hidden"),$("#feedback-filechangederror").removeClass("hidden");break;default:$("#feedback-error-data").html(btoa(JSON.stringify(e)))}},function(){d.snapshot.ref.getDownloadURL().then(function(t){n({url:t,name:e.name,size:e.size,type:e.type,storageRef:"/feedback/"+a+"/files/"+o.key},o)})})}else n({url:"",name:"",size:"",type:"not uploaded",storageRef:""},firebase.database().ref("/feedback/"+a+"/").push())}(o,"bug",function(e,t){d({name:$("#fb-name").val(),os:n().detectedOS,browser:n().browserByDuckTyping,pages:$("#"+r+"-affected-pages").val(),body:$("#"+r+"-description").val(),title:$("#"+r+"-title").val(),type:r,fileUrl:e.url,fileType:e.type},function(i){l(95);let o=firebase.auth().currentUser,d={};d.loggedIn=null!==o,d.loggedIn&&(d={id:o.uid||"Not Logged In",email:o.email,displayName:o.displayName}),firebase.database().ref("/feedback/reports/"+r+"/"+t.key).set({title:$("#"+r+"-title").val(),filedata:e,timestamp:{utc:(new Date).getTime(),string:new Date},type:r,personalInfo:{name:$("#fb-name").val(),email:$("#fb-email").val(),user:d},requestData:{title:$("#"+r+"-title").val(),description:$("#"+r+"-description").val(),pages:$("#"+r+"-affected-pages").val(),github:{issueurl:i}},diagnosticData:n(),log:a.getDebugLog()}).then(function(){l(100),$("#feedback-modal .modal-body").addClass("hidden"),$("#feedback-done").removeClass("hidden")})})}))},d=function(n,t){firebase.database().ref("/feedback/keys/").once("value").then(function(i){l(90);var o=i.val().github,d=i.val().slack.webhookurl;let s="";n.fileType&&"image"==n.fileType.split("/")[0]?s=`![User uploaded image: ${n.fileUrl}](${n.fileUrl}) \n\n ------- \n`:n.fileUrl&&null!=n.fileUrl&&(s="User Uploaded File URL: "+n.fileUrl+"\n\n ------- \n");let r="";n.pages&&(r="**Affected pages**:\n```"+n.pages+"\n```\n");let c=null!=n.body?n.body+"\n\n ------- \n":"";var f="bug"==n.type?"Bug Report":"Feedback",g="Data from "+f+" modal submitted by **"+n.name+"**:\n\n| Timestamp | Device | Browser | Type |\n|---|---|---|---|\n| "+new Date+" | "+n.os+" | "+n.browser+" | "+n.type+" | \n\n"+r+s+c+"This report automatically created from the [t485.org](https://t485.org) feedback form.";a.log(g),console.log(e(g));var u=`{"title": "${e(n.title)}", "body": "${e(g)}", "labels":["${"Feedback"==f?"enhancement":f}"] }`;$.ajax({accepts:{json:"application/vnd.github.v3+json","*":"application/vnd.github.v3+json"},url:"https://api.github.com/repos/t485/t485/issues?access_token="+o,data:u,type:"POST"}).always(function(e){a.log("Github API Complete:"+{data:e}),$.ajax({url:d,data:"payload="+JSON.stringify({text:`New ${f} Filed: ${n.title} - `+e.html_url}),type:"POST"}).always(function(n){a.log("Slack API push complete (ajax.always):",{data:n}),t(e.html_url)})})})},s=function(){$(".uploading-hide").addClass("hidden"),$(".uploading-show").removeClass("hidden"),$("#feedback-modal").modal({backdrop:"static",keyboard:!1})},r=$("#issueType").val();switch(r){case"bug":o(s);break;case"feature":!function(){const e="feat";let t=!1;for(let e=0;e<i.length;e++){let a=!0===i[e].general?$("#"+i[e].name).val():$("#feat-"+i[e].name).val();i[e].validation.test(a)||(t=!0,$((i[e].general?"#":"#feat-")+i[e].name).addClass("is-invalid"))}if(!t){s();var l=firebase.database().ref("/feedback/feat/").push();$("#feedback-main").addClass("hidden"),$("#feedback-loading").removeClass("hidden"),d({name:$("#fb-name").val(),os:n().detectedOS,browser:n().browserByDuckTyping,pages:null,body:$("#feat-description").val(),title:$("#feat-title").val(),type:e,fileUrl:null,fileType:null},function(t){let i=firebase.auth().currentUser,o={};o.loggedIn=null!==i,o.loggedIn&&(o={id:i.uid||"Not Logged In",email:i.email,displayName:i.displayName}),firebase.database().ref("/feedback/reports/feat/"+l.key).set({title:$("#feat-title").val(),timestamp:{utc:(new Date).getTime(),string:new Date},type:e,personalInfo:{name:$("#fb-name").val(),email:$("#fb-email").val(),user:o},requestData:{title:$("#feat-title").val(),description:$("#feat-description").val(),github:{issueurl:t}},diagnosticData:n(),log:a.getDebugLog()}).then(function(){$("#feedback-modal .modal-body").addClass("hidden"),$("#feedback-done").removeClass("hidden")})}),s()}}()}}),$(".custom-file-input").on("change",function(){var e=$(this).val();e=e.substring(e.lastIndexOf("\\")+1),$("#bug-file").hasClass("is-invalid")&&$("#bug-file").removeClass("is-invalid"),$(this).next(".custom-file-label").css("white-space: nowrap;overflow:hidden;"),$(this).next(".custom-file-label").html(e)}),$("#bug-file-clear").click(function(){$("#bug-file").val(null),$("#bug-file").next(".custom-file-label").html("Choose File")})},a}();Logger.initFeedback();