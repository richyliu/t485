//https://stackoverflow.com/a/901144/5511561
function getQuery(name, url) {
    url = url || window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getQueryString(url) {
    url = url || window.location.href;
    if (url.indexOf("?") < 0) return "";
    return url.substring(url.indexOf("?"), (url.indexOf("#") > -1 ? url.indexOf("#") : undefined));
}

//https://stackoverflow.com/a/10997390/5511561
function setQuery(name, value, search) {
    if (value !== null && value !== undefined) value = "" + value;//we want falsey values to be used literally, as a string (e.g. 0 -> "0", false -> "false).
    search = search || window.location.search;
    let regex = new RegExp("([?;&])" + name + "[^&;]*[;&]?");
    let query = search.replace(regex, "$1").replace(/&$/, "");

    return (query.length > 2 ? query + "&" : "?") + (value ? name + "=" + value : "");
}

//edits the query from a given url
function modifyQueryFromURL(name, value, url) {
    var base = url.substring(0, (url.indexOf("?") > -1 ? url.indexOf("?") : undefined));
    var query = setQuery(name, value, getQueryString(url));
    var hash = (url.indexOf("#") > -1 ? url.substring(url.indexOf("#")) : "");
    return base + query + hash;
}

//https://stackoverflow.com/a/19279428/5511561
function setQueryString(fullQueryString) {

    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + fullQueryString + window.location.hash;
    if (history.pushState) {
        window.history.pushState({ path: newurl }, "", newurl);
    } else {
        //window.location.href = newurl;
    }
    //checkDefaultOptions();
}

function removeHash() {
    history.pushState("", document.title, window.location.pathname
            + window.location.search);
}


//http://stackoverflow.com/a/17606289/5511561s
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(escapeRegExp(search), "g"), replacement);
};

//http://stackoverflow.com/a/17606289/5511561s (footnote),

function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}