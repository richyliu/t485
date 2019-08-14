import pageState from "../utils/PageState";
import { Alert, AlertBox } from "../AlertBox";
import $ from "jquery";
import "bootstrap";
import flatpickr from "flatpickr";
import tinymce from "tinymce/tinymce";
import "tinymce/themes/silver";
import "tinymce/plugins/code";
import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/charmap";
import "tinymce/plugins/print";
import "tinymce/plugins/preview";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/paste";
import "tinymce/plugins/imagetools";
import Database from "../server/Database";
import moment from "moment";

pageState.init();


let database = new Database().ref("/events/beta/");
database.child("content").once("value").then(function(snapshot) {
    init(snapshot.val());
});

function init(data) {
    console.log(data);

    let internalFiles = initContent(data);

    initEditors();

    let alertbox = new AlertBox("#alertBox");
    initToolbox(alertbox, database, internalFiles);

    $("[data-toggle='tooltip']").tooltip();

    flatpickr("#editModal-date", {
        dateFormat: "m/d/y",
        mode: "range",
    });

    $("#loader").addClass("hidden");
    $("#main").removeClass("hidden");
}

/**
 * Loads the base content of the page
 * @param data - Firebase event data
 * @returns An array containing a representation of the files displayed.
 */
function initContent(data) {
    let internalFiles = [];
    $("#title").text(data.title);
    $("#date").text(moment(data.startDate).format("M/D/YYYY") + " to " + moment(data.startDate).format("M/D/YYYY"));
    $("#location").html(data.location);
    $("#content").html(data.description);
    for (let i = 0; i < data.files.length; i++) {
        if (data.files[i].type == "link") {
            internalFiles.push({ ...data.files[i], pendingDeletion: false });
            $(`<li data-link-id="${i}"><a href=${data.files[i].link}>${data.files[i].name}</a> (<a class="link linkControl-moveUp">Move up</a> | <a class="link linkControl-moveDown">Move Down</a> | <a class="link linkControl-delete">Delete</a>)</li>`).insertBefore("#files-addThisEl");
        }
    }
    return internalFiles;
}

/**
 * Initializes the toolbox and all the handlers.
 * @param alertBox - The AlertBox instance to use.
 */
function initToolbox(alertBox: AlertBox, database, internalFiles) {
    alertBox.push(new Alert(`<a id="toolbar-publish" class="alert-link link">Publish all changes</a> | <a id="toolbar-discard" class="alert-link link">Discard all changes</a> | <a id="toolbar-editTitleDate" class="alert-link link">Edit title and date</a> | <a id="toolbar-help" class="alert-link link">Help</a>`, "controls", "info", "Currently editing this page: ", false));

    $("body").on("click", "#toolbar-editTitleDate", function() {

        $("#editModal").modal("show");
        $("#editModal").on("hide.bs.modal", function() {
            $("#title").text($("#editModal-title").val() + "");
            $("#date").text($("#editModal-date").val() + "");
        });
    });
    $("#addFileModal-addBtn").click(function() {
        let name = $("#addFileModal-fileName").val();
        let link = $("#addFileModal-fileLink").val();
        internalFiles.push({
            name: name,
            link: link,
            type: "link",
        });
        $(`<li data-link-id="${internalFiles.length - 1}"><a href=${link}>${name}</a> (<a class="link linkControl-moveUp">Move up</a> | <a class="link linkControl-moveDown">Move Down</a> | <a class="link linkControl-delete">Delete</a>)</li>`).insertBefore("#files-addThisEl");


    });

    function renderFiles() {
        $("#files").html(`
                <li id="files-addThisEl"><a href="#addFileModal" data-toggle="modal" id="files-addFile">Add File</a></li>
        `);
        for (let i = 0; i < internalFiles.length; i++) {
            if (internalFiles[i].type == "link") {
                if (internalFiles[i].pendingDeletion) {
                    $(`<li data-link-id="${i}"><a href=${internalFiles[i].link} class="strikethrough">${internalFiles[i].name}</a> (Will be deleted when published. <a class="link linkControl-undoDelete">Undo</a>)</li>`).insertBefore("#files-addThisEl");
                } else {
                    $(`<li data-link-id="${i}"><a href=${internalFiles[i].link}>${internalFiles[i].name}</a> (<a class="link linkControl-moveUp">Move up</a> | <a class="link linkControl-moveDown">Move Down</a> | <a class="link linkControl-delete">Delete</a>)</li>`).insertBefore("#files-addThisEl");
                }
            }
        }
    }

    $("#files").on("click", ".linkControl-delete", function() {
        let i = parseInt($(this).parent().attr("data-link-id"));
        internalFiles[i].pendingDeletion = true;
        renderFiles();
    });
    $("#files").on("click", ".linkControl-undoDelete",function() {
        let i = parseInt($(this).parent().attr("data-link-id"));
        internalFiles[i].pendingDeletion = false;
        renderFiles();
    });
    $("#toolbar-publish").click(function() {
        let startDate: string, endDate: string, length: number;
        let date = $("#date").html().split(" to ");
        startDate = moment(date[0], "MM/DD/YYYY").format("YYYY-MM-DD");
        endDate = moment(date[1], "MM/DD/YYYY").format("YYYY-MM-DD");
        length = moment(endDate).diff(moment(startDate), "days") + 1;
        let files = [];
        for (let i = 0; i < internalFiles.length; i++) {
            if (internalFiles[i].pendingDeletion) {
                continue;
            }
            delete internalFiles[i].pendingDeletion;
            files.push(internalFiles[i]);
        }
        console.log(files);
        let data = {
            timestamp: moment().toISOString(),
            title: $("#title").html(),
            length: length,
            startDate: startDate.split("T")[0],
            endDate: startDate.split("T")[0],
            location: $("#location").html(),
            description: $("#content").html(),
            files: files,
        };
        database.child("content").set(data);
        database.child("history").push(data);
    });
}

/**
 * Initializes the tinymce editor instances.
 */
function initEditors() {
    tinymce.init({
        selector: "#content",
        inline: true,
        browser_spellcheck: true,
        theme: "silver",
        skin_url: "/css/ui/oxide",
        plugins: ["code advlist autolink lists link image charmap print preview", "searchreplace visualblocks fullscreen", "insertdatetime media table paste imagetools"],
        toolbar: "insertfile undo redo | styleselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
    });
    tinymce.init({
        selector: "#location",
        inline: true,
        browser_spellcheck: true,
        theme: "silver",
        skin_url: "/css/ui/oxide",
        plugins: [],
        menubar: "file edit",
        toolbar: "undo redo | bold italic | link | insertBullet",

    });
}