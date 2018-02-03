//========================================================= DANGER ZONE BELOW ===========================================
let mode = "redirect"; // normal", "mirror", "redirect"
let data = "https://mirror1.t485.org"; //specific to above mode, see below 
/* Modes:
normal:
    normal, site should be loaded from github.com/t485/t485
    data variable is ignored and should be null
mirror:
    this is a mirror site, and should be loaded from the approiate mirror repo on github(if more than one exist)
    data should contain the mirror number(as a integer data type)
    the mirror number will be displayed in an alert
    
redirect:
    only use if this is the website loaded from the normal repository, and is LOADED, but does not work(not live, etc.)
    data should contain a string with an url to redirect to. INCLUDE PROTOCOL, CURRENT PATH AUTOMATICALLY APPENDED, SO DO NOT INCLUDE TRAILING SLASH
*/

    if (mode === "redirect" && (getQuery("mirror-no-redirect") !== "true"&& localStorage.getItem("mirror-no-redirect") !== "true") {
        $(document).ready(function() {
            $("#alertBox").html('<div class="alert alert-warning">' +
                '  <strong>Warning!</strong> You are being redirected to a mirror of t485.org because the main site is undergoing mantiance. If you are not automatically redirected in a few seconds, go to this URL: <a href="' + data + '">' + data + '</a>' +
                '</div>');
        });
        window.location.href = data + window.location.pathname;
    }
    else if (mode === "mirror") {
        $(document).ready(function() {
            //console.log(2);
            $("#alertBox").html('<div class="alert alert-warning">' +
                '  <strong>Warning!</strong> You are currently viewing mirror ' + data + ' of the t485.org website. If you got redirected here by typing in https://t485.org, then the t485.org main site may be undergoing mantiance or is not working at this moment. This mirror is a fully functional version of the main site, but it may be slightly outdated.' +
                '</div>');
        });
        //console.log(3);
    }
    else {
        //assume mode is normal, don't do anything, this is here just as a reminder.
    }

// ====================================================== END DANGER ZONE - DANGER ZONE ABOVE ===========================


(() => {
    // remove leading slash
    let page = window.location.pathname.substr(1);

    Array.from(document.getElementsByTagName('a')).forEach(element => {
        if (page === element.getAttribute('href')) {
            element.parentElement.classList.add('active');
        }
        else {
            element.parentElement.classList.remove('active');
        }
    });

    document.getElementById('bs-example-navbar-collapse-1').classList.remove('in');
})


/* Initializers */

// Back to top button animation
$(window).scroll(function() {
    if ($(this).scrollTop() > 0) {
        $('.toTop').fadeIn(3000);
    }
    else {
        $('.toTop').fadeOut();
    }
});

//Trying to fix things but its hard
$('.toTop').click(function(){
		$('html, body').animate({scrollTop : 0},800);
		return false;
	});

//email bot obfuscator sort of...
$(".at").text("@");

// Set LESS async to true to prevent warning on Chrome
less = {
    async: true
};



// Fix dropdown menu bug on iOS
$('.dropdown a').click(function() {
    if ($(this).parent().hasClass('open')) {
        $(this).parent().removeClass('open');
    }
    else {
        $('.dropdown').removeClass('open');
        $(this).parent().addClass('open');
    }
});




/* Helpers */

// Checks if the user is logged in using tabletop
function auth(onAuthed, onUnauthed) {
    
}



// Source: http://www.w3schools.com/js/js_cookies.asp
function setCookie(name, value, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}


function getCookie(name) {
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name + "=") == 0) {
            return c.substring((name + "=").length, c.length);
        }
    }
    return "";
}

function getVarsFromUrl() {
    let vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    return vars;
}

// Fisher-Yates shuffle
function generateRandomNums(r) {
    for (let a = [], n = 0; r > n; n++) a[n] = n;
    for (let o, e, t = r; t;) e = ~~(Math.random() * t), t -= 1, o = a[t], a[t] = a[e], a[e] = o;
    return a
}


// http://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer
function countdown(n, t, e) {
    function o() {
        a = n - ((Date.now() - c) / 1e3 | 0), u = a / 60 | 0, w = a % 60 | 0, u = 10 > u ? '0' + u : u, w = 10 > w ? '0' + w : w, t.textContent = u + ':' + w, 0 >= a && ('reset' === e || null === e ? c = Date.now() + 1e3 : e())
    }
    let a, u, w, c = Date.now();
    o(), setInterval(o, 1e3)
}


// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getQuery(e) {
    e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    let c = new RegExp("[\\?&]" + e + "=([^&#]*)"),
        n = c.exec(location.search);
    return null === n ? "" : decodeURIComponent(n[1].replace(/\+/g, " "))
}


// Code from https://gist.github.com/andrei-m/982927#file-levenshtein-js
function compare(t, n) {
    if (0 == t.length) return n.length;
    if (0 == n.length) return t.length;
    let r, e = [];
    for (r = 0; r <= n.length; r++) e[r] = [r];
    let h;
    for (h = 0; h <= t.length; h++) e[0][h] = h;
    for (r = 1; r <= n.length; r++)
        for (h = 1; h <= t.length; h++) n.charAt(r - 1) == t.charAt(h - 1) ? e[r][h] = e[r - 1][h - 1] : e[r][h] = Math.min(e[r - 1][h - 1] + 1, Math.min(e[r][h - 1] + 1, e[r - 1][h] + 1));
    return e[n.length][t.length];
}




//google anylatics

(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-102375833-1', 'auto');
ga('send', 'pageview');
