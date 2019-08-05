import pageState from "../utils/PageState";
import { Alert, AlertBox } from "../AlertBox";
import $ from "jquery";
import "bootstrap";
import flatpickr from "flatpickr";
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/silver';
import 'tinymce/plugins/code';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/print';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/imagetools';
import Database from "../server/Database";
import moment from "moment";

new Database().ref("/events/beta/").once("value").then(function (snapshot) {
    init( snapshot.val());
});

function init(data) {
    console.log(data);
    $("#title").text(data.title);
    $("#date").text(moment(data.startDate).format("M/D/YYYY") + " to " + moment(data.startDate).format("M/D/YYYY"));
    $("#location").html(data.location);
    $("#content").html(data.description);

    tinymce.init({
        selector: "#content",
        inline: true,
        browser_spellcheck: true,
        theme: "silver",
        skin_url: '/css/ui/oxide',
        plugins: ["code advlist autolink lists link image charmap print preview", "searchreplace visualblocks fullscreen", "insertdatetime media table paste imagetools"],
        toolbar: "insertfile undo redo | styleselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
    });
    tinymce.init({
        selector: "#location",
        inline: true,
        browser_spellcheck: true,
        theme: "silver",
        skin_url: '/css/ui/oxide',
        plugins: [],
        menubar:"file edit",
        toolbar: "undo redo | bold italic | link | insertBullet",

    });

    let alertbox = new AlertBox("#alertBox");
    alertbox.push(new Alert(`<a id="toolbar-publish" class="alert-link link">Publish all changes</a> | <a id="toolbar-discard" class="alert-link link">Discard all changes</a> | <a id="toolbar-editTitleDate" class="alert-link link">Edit title and date</a> | <a id="toolbar-help" class="alert-link link">Help</a>`, "controls", "info", "Currently editing this page: ", false));

    $("body").on("click", "#toolbar-editTitleDate", function() {

        $("#editModal").modal("show");
        $("#editModal").on("hide.bs.modal", function() {
            $("#title").text($("#editModal-title").val() + "");
            $("#date").text($("#editModal-date").val() + "");
        });
    });
    pageState.init();
    $("[data-toggle='tooltip']").tooltip();

    flatpickr("#editModal-date", {
        dateFormat: "m/d/y",
        mode: "range",
    });

    $("#loader").addClass("hidden");
    $("#main").removeClass("hidden");
}