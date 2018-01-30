// load directory information
Tabletop.init({
    key: '15Z9AgrqGNprz2K8c032ZhJ7Wm5bTV-2fJfublK7L1L8',
    callback: data => {
        window.globalData = [];
        // scouts and parents, and their corresponding email
        let people = [];
        
        // for each patrol
        for (let key of Object.keys(data)) {
            // for each scout
            for (let person of data[key].elements) {
                person.patrol = key;
                person['Scout\'s Full Name (last name first):'] = normalizeName(person['Scout\'s Full Name (last name first):'].trim());
                window.globalData.push(person);
                
                let scoutEmail = person['Scout\'s E-mail:'];
                let fatherName = normalizeName(person[`父親全名 Father's Full Name (last name first)`]);
                let fatherEmail = person[`Father's E-mail`];
                let motherName = normalizeName(person[`母親全名 Mother's Full Name (last name first)`]);
                let motherEmail = person[`Mother's E-mail`];
                
                if (scoutEmail.length > 5)
                    people.push({name: person['Scout\'s Full Name (last name first):'], email: scoutEmail});
                if (fatherName.length > 5 && fatherEmail.length > 5)
                    people.push({name: fatherName, email: fatherEmail});
                if (motherName.length > 5 && motherEmail.length > 5)
                    people.push({name: motherName, email: motherEmail});
                
            }
        }
        
        // alphabetize for id consistency
        window.globalData.sort((a, b) => {
            if (a['Scout\'s Full Name (last name first):'] < b['Scout\'s Full Name (last name first):']) return -1;
            if (a['Scout\'s Full Name (last name first):'] > b['Scout\'s Full Name (last name first):']) return 1;
            return 0;
        });
        
        console.log(people);
        checkLogin(people);
    },
    simpleSheet: false
});


/**
 * Checks if the user is logged in. If not, show the login div
 * @param  {Object[]} people Object of scouts and parents' names and emails
 */
function checkLogin(people) {
    // loading finished (since called from Tabletop callback)
    $('#loading-login').hide();
    
    for (let person of people) {
        if (hash(person.name, person.email) == localStorage.getItem('userHash')) {
            loggedIn();
            return;
        }
    }
    // user needs to log in
    $("#login").show();
    
    $('#login-btn').click(() => {
        let name = $('#name').val().toLowerCase();
        let email = $('#email').val();
        
        for (let person of people) {
            if (name.toLowerCase().trim() == person.name.trim() && email.trim() == person.email.trim()) {
                // log in user
                localStorage.setItem('userHash', hash(name, email));
                loggedIn();
                return;
            }
        }
        alert('Incorrect name or email!');
    });
}

/**
 * Hashes a string
 * @param  {String} name  Name
 * @param  {String} email Email
 * @return {Number}       Hashed result
 */
function hash(name, email) {
    let str = name + email;
    let s = 0;
    for (let i = 0; i < str.length; i++) s += str.charCodeAt(i);

    let m_w  = 987654321 + s;
    let m_z  = 987654321 - s;
    let mask = 0xffffffff;

    m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;

    let result = ((m_z << 16) + m_w);// & mask
    result /= 4294967296;

    return result + 0.5;
}

/**
 * Converts name from Last, First form to First Last in all lowercase
 * @param  {String} name Input
 * @return {String}      Normalized name
 */
function normalizeName(name) {
    if (name.length < 1) return name;
    
    if (name.search(', ') > 0) {
        let parts = name.split(', ');
        
        return (parts[1] + ' ' + parts[0]).toLowerCase();
    } else {
        console.error(`Unable to split name ${name} into first and last name`);
        return name;
    }
}


/**
 * Called once we know the user is logged in
 */
function loggedIn() {
    // user is logged in
    $("#content").show();
    $('#login').hide();
    $('#search-query').focus();

    $('#spreadsheet-confirm-btn').click(() => {
        $('#spreadsheet-confirm').hide();
        $('#spreadsheet-content').html(`
            <a href="https://docs.google.com/spreadsheets/d/15Z9AgrqGNprz2K8c032ZhJ7Wm5bTV-2fJfublK7L1L8/edit?usp=drive_web" target="_blank">Edit Spreadsheet</a>
            <iframe src="https://docs.google.com/spreadsheets/d/15Z9AgrqGNprz2K8c032ZhJ7Wm5bTV-2fJfublK7L1L8/pubhtml?widget=true&amp;headers=false"></iframe>
        `);
        $('#spreadsheet').show();
    });
}



window.globalData = [];
$(document).ready(() => {
    $('#password').focus();
});



$('#search-query').keypress((e) => {
    if (e.keyCode === 13) {
        $('#search-btn').click();
    }
});


$('#search-btn').click(() => {
    window.userquery = $("#search-query").val();

    updateURLQuery("?type=list&query=" + encodeURIComponent(window.userquery));
    showSearchResults(window.userquery);

});

if (getQuery("type") === "list" && getQuery("query") !== null && getQuery("query") !== "") {
    $(".loading").show();
    setTimeout(() => {
        $("#search-query").val(getQuery("query"));
        showSearchResults(getQuery("query"));
        $(".loading").hide();
    }, 1500);

}
else if (getQuery("type") === "profile" && getQuery("id") !== null && getQuery("id") !== "") {
    $(".loading").show();
    setTimeout(() => {
        showfullinfo(parseInt(getQuery("id"), 10), false);
        $(".loading").hide();
    }, 1500);
}

function updateURLQuery(query) {
    if (history.pushState) {
        let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + query;
        window.history.pushState({
            path: newurl
        }, '', newurl);
    }
    else {
        window.location.href = window.location.protocol + "//" + window.location.host + window.location.pathname + query;

    }
}

function showSearchResults(userquery) {
    if (userquery === '') return;


    userquery = userquery.toLowerCase();
    //console.log(userquery);
    let query = [];

    if (userquery.search(' ') > 0) {
        query = userquery.split(' ');
    }
    else {
        query[0] = userquery;
        query[1] = null;
        // If more than one space use only first 2
        if (query[2] !== undefined) query = query.splice(0, 2);
    }
    if (query[1] === '') query[1] = null;

    console.log(window.globalData);
    console.log(query);

    // Split the names into first and last names
    let patrolnames = [];
    for (let curGlobalData of window.globalData) {
        let fullname = curGlobalData['Scout\'s Full Name (last name first):'].trim();
        let name = [];
        if ((fullname.match(/\s/g) || []).length === 2) {
            // has middle name
            let temp = fullname.split(' ');
            name[0] = temp[2];
            name[1] = temp[0].slice(0, -1);
        }
        else if (fullname.search(', ') > 0) {
            name = fullname.split(', ');
            let temp = name[0];
            name[0] = name[1];
            name[1] = temp;
        }
        else if ((fullname.match(/\s/g) || []).length === 1) {
            name = fullname.split(' ');
        }
        else if (fullname.search(',') > 0) {
            name = fullname.split(',');
            let temp = name[0];
            name[0] = name[1];
            name[1] = temp;
        }
        else {
            name = 'ERROR';
            console.error('Unable to split given full name into first and last name');
        }
        name[0] = name[0].toLowerCase();
        name[1] = name[1].toLowerCase();
        patrolnames.push(name);
    }
    //console.log(patrolnames);

    // Search for patrolnames for query
    let results = [];
    // score lower is better
    let score = [];
    for (let i = 0; i < patrolnames.length; i++) {
        // Only first/last name
        if (query[1] === null) {
            if (patrolnames[i][0] === query[0] || patrolnames[i][1] === query[0]) {
                score.push({
                    id: i,
                    score: 0
                });
            }
            else {
                let diff = compare(query[0], patrolnames[i][0]) < compare(query[0], patrolnames[i][1]) ?
                    compare(query[0], patrolnames[i][0]) : compare(query[0], patrolnames[i][1]);
                if (diff < query[0].length / 2) {
                    score.push({
                        id: i,
                        score: diff + 1
                    });
                }
            }
            // If direct match set score to 0
        }
        else if (patrolnames[i][0] === query[0] && patrolnames[i][1] === query[1]) {
            score.push({
                id: i,
                score: 0
            });
            break;
            // First and last name
        }
        else {
            let diff = compare(query[0], patrolnames[i][0]) + compare(query[1], patrolnames[i][1]);
            if (diff < (query[0].length + query[1].length) / 2) {
                score.push({
                    id: i,
                    score: diff + 1
                });
            }
        }
    }
    score.sort((a, b) => {
        return parseFloat(a.score) - parseFloat(b.score);
    });

    // Make sure scores list has items
    if (score[0]) {
        let firstScore = score[0].score;
        for (let i = 0; i < score.length; i++) {
            // If direct match of query
            if (score[i].score === firstScore) {
                results.push(score[i].id);
            }
            else if (score[i].score !== firstScore) {
                break;
                // Otherwise display up to 3 names
            }
            else if (i < 3) {
                results.push(score[i].id);
            }
        }
    }

    //console.log(window.globalData);


    // Display search results
    $('#detail').hide();

    $('#results').hide();
    if (results.length === 0) {
        $('#no-result').html('Your search - <b>' + userquery + '</b> - did not match any names.');
        $('#no-result').show();
    }
    else {
        $('#no-result').hide();
        $('#results > tbody').html('');
        for (let result of results) {
            let name = window.globalData[result]['Scout\'s Full Name (last name first):'];
            $('#results > tbody').append(`
                <tr>
                    <td><a onclick="showfullinfo(${result})">${name}</a></td>
                    <td>${window.globalData[result]['Scout\'s Cell Phone']}</td>
                </tr>
            `);
        }
        $('#results').show();
    }
}

function showfullinfo(id, updateQuery) {
    if (updateQuery !== false) {
        updateURLQuery("?type=profile&id=" + encodeURIComponent(id));
    }
    $('#results').hide();
    $('#detail').show().html('').append(`
        <br>
        Name:                               ${window.globalData[id]['Scout\'s Full Name (last name first):']}<br>
        Email: <a href="mailto:             ${window.globalData[id]['Scout\'s E-mail:']}">     ${window.globalData[id]['Scout\'s E-mail:']}</a><br>
        Cell Phone: <a href="tel:           ${window.globalData[id]['Scout\'s Cell Phone']}">  ${window.globalData[id]['Scout\'s Cell Phone']}</a><br>
        Home Phone: <a href="tel:           ${window.globalData[id]['Scout\'s Home Phone']}">  ${window.globalData[id]['Scout\'s Home Phone']}</a><br>
        Patrol:                             ${window.globalData[id].patrol}<br><br>
        Father\'s Cell Phone: <a href="tel: ${window.globalData[id]['Father\'s Cell Phone']}"> ${window.globalData[id]['Father\'s Cell Phone']}</a><br>
        Father\'s E-mail: <a href="mailto:  ${window.globalData[id]['Father\'s E-mail']}">     ${window.globalData[id]['Father\'s E-mail']}</a><br>
        Mother\'s Cell Phone: <a href="tel: ${window.globalData[id]['Mother\'s Cell Phone']}"> ${window.globalData[id]['Mother\'s Cell Phone']}</a><br>
        Mother\'s E-mail: <a href="mailto:  ${window.globalData[id]['Mother\'s E-mail']}">     ${window.globalData[id]['Mother\'s E-mail']}</a><br>
    `);
}


// submit login form on enter key
$('#email').keypress(e => {
    if (e && e.keyCode == 13)
        $('#login-btn').click();
});