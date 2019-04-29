import $ from "jquery";
import PageState from "../utils/PageState";

PageState.init();

$(".pathname").text(window.location.pathname);