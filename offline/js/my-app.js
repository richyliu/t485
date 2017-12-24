// TODO: fix localStorage on Safari private

let myApp = new Framework7();
let $$ = Dom7;
let online = navigator.onLine;
// let online = false;


// Add view
let mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});




/*
##     ## ########  ########     ###    ######## ########     ######     ###     ######  ##     ## ########
##     ## ##     ## ##     ##   ## ##      ##    ##          ##    ##   ## ##   ##    ## ##     ## ##
##     ## ##     ## ##     ##  ##   ##     ##    ##          ##        ##   ##  ##       ##     ## ##
##     ## ########  ##     ## ##     ##    ##    ######      ##       ##     ## ##       ######### ######
##     ## ##        ##     ## #########    ##    ##          ##       ######### ##       ##     ## ##
##     ## ##        ##     ## ##     ##    ##    ##          ##    ## ##     ## ##    ## ##     ## ##
 #######  ##        ########  ##     ##    ##    ########     ######  ##     ##  ######  ##     ## ########
*/
if (online) {
    // Initialize Firebase
    firebase.initializeApp({
        apiKey: "AIzaSyAvhRMDTAxHRqIM0-RpHxPjZtMn7S_H7K4",
        authDomain: "t485.firebaseapp.com",
        databaseURL: "https://t485.firebaseio.com",
        storageBucket: "project-2556333409340273878.appspot.com"
    });
    
    // refresh on app startup
    updateCache();
    $$('.pull-to-refresh-content').on('refresh', function() {
        updateCache();
        setTimeout(() => myApp.pullToRefreshDone(), 2000);
    });
}


function updateCache() {
    /*
        Directory
    */
    Tabletop.init({
        key: '15Z9AgrqGNprz2K8c032ZhJ7Wm5bTV-2fJfublK7L1L8',
        callback: data => {
            let directoryData = [];
            
            // for each sheet
            for (let key of Object.keys(data)) {
                // for each person
                for (let person of data[key].elements) {
                    person.patrol = key;
                    
                    directoryData.push(person);
                }
            }
            
            localStorage.setItem('directory-info', JSON.stringify(directoryData));
        },
        simpleSheet: false
    });
    
    
    /*
        Events
    */
    firebase.database().ref('events').once('value', function(snapshot) {
        let data = snapshot.val();
        
        for (let key of Object.keys(data)) {
            console.log(data[key]);
            if (data[key].archived || data[key].hidden) {
                delete data[key];
            }
        }
        
        localStorage.setItem('event-info', JSON.stringify(data));
    });
    
    
    /*
        Calendar
    */
    firebase.database().ref('calendar').once('value').then(function (snapshot) {
        localStorage.setItem('calendar-info', JSON.stringify(snapshot.val()));
    });
}




/*
########  #### ########  ########  ######  ########  #######  ########  ##    ##
##     ##  ##  ##     ## ##       ##    ##    ##    ##     ## ##     ##  ##  ##
##     ##  ##  ##     ## ##       ##          ##    ##     ## ##     ##   ####
##     ##  ##  ########  ######   ##          ##    ##     ## ########     ##
##     ##  ##  ##   ##   ##       ##          ##    ##     ## ##   ##      ##
##     ##  ##  ##    ##  ##       ##    ##    ##    ##     ## ##    ##     ##
########  #### ##     ## ########  ######     ##     #######  ##     ##    ##
*/
let data = [];
myApp.onPageInit('directory', function() {
    data = JSON.parse(localStorage.getItem('directory-info'));
    data.forEach(curData => {
        let currentName = curData['Scout\'s Full Name (last name first):'];
        
        // if name is in format: last, first --> turn into --> first last
        if (currentName.indexOf(',') > -1) {
            if (currentName.indexOf(' ') > -1) {
                currentName = currentName.split(', ')[1] + ' ' + currentName.split(', ')[0];
            } else {
                currentName = currentName.split(',')[1] + ' ' + currentName.split(',')[0];
            }
        }
        curData['Scout\'s Full Name (last name first):'] = currentName;
    });
    
    // sort data according to name
    data = data.sort(function(a, b) {
        let key = 'Scout\'s Full Name (last name first):';
        return a[key] < b[key] ? -1 : 1;
    });
    
    
    data.forEach(curData => {
        let currentName = curData['Scout\'s Full Name (last name first):'];
        
        $$('#search-content > ul').append(`
            <li>
                <a href="#" class="item-link" onclick="showfullinfo(\`${encodeURIComponent(JSON.stringify(curData))}\`)">
                    <div class="item-content">
                        <div class="item-inner">
                            <div class="item-title">${currentName}</div>
                            <div class="item-after">${curData.patrol}</div>
                        </div>
                    </div>
                </a>
            </li>
        `);
    });
});


function showfullinfo(data) {
    data = JSON.parse(decodeURIComponent(data));
    $$('#directory-more-name').html(data[`Scout's Full Name (last name first):`]);
    $$('#directory-more-info').css('font-size', '18px').html(`
        Name: ${data['Scout\'s Full Name (last name first):']}<br>
        Email: <a href="mailto:${data['Scout\'s E-mail:']}" class="external">${data['Scout\'s E-mail:']}</a><br>
        Cell Phone: <a href="tel:${data['Scout\'s Cell Phone']}" class="external">${data['Scout\'s Cell Phone']}</a><br>
        Home Phone: <a href="tel:${data['Scout\'s Home Phone']}" class="external">${data['Scout\'s Home Phone']}</a><br>
        Patrol: ${data.patrol}<br><br>
        Father's Cell Phone: <a href="tel:${data['Father\'s Cell Phone']}" class="external">${data['Father\'s Cell Phone']}</a><br>
        Father's E-mail: <a href="mailto:${data['Father\'s E-mail']}" class="external">${data['Father\'s E-mail']}</a><br>
        Mother's Cell Phone: <a href="tel:${data['Mother\'s Cell Phone']}" class="external">${data['Mother\'s Cell Phone']}</a><br>
        Mother's E-mail: <a href="mailto:${data['Mother\'s E-mail']}" class="external">${data['Mother\'s E-mail']}</a><br>
    `);
    mainView.router.loadContent($$('#directory-more-template').html());
}




/*
######## ##     ## ######## ##    ## ########  ######
##       ##     ## ##       ###   ##    ##    ##    ##
##       ##     ## ##       ####  ##    ##    ##
######   ##     ## ######   ## ## ##    ##     ######
##        ##   ##  ##       ##  ####    ##          ##
##         ## ##   ##       ##   ###    ##    ##    ##
########    ###    ######## ##    ##    ##     ######
*/
myApp.onPageInit('events', function() {
    let events = JSON.parse(localStorage.getItem('event-info'));
    
    for (let event in events){
        if (!events.hasOwnProperty(event)) continue;
        
        // get event from key
        event = events[event];
        $$('#event-list').append(`
            <li>
                <a href="#" class="item-link item-content" onclick="showEventInfo(\`${encodeURIComponent(event.title)}\`,\`${encodeURIComponent(event.description)}\`)">
                    <div class="item-inner">
                        <div class="item-title">${event.title}</div>
                    </div>
                </a>
            </li>
        `);
    }
    
});


function showEventInfo(name, description) {
    $$('#event-more-name').html(decodeURIComponent(name));
    $$('#event-more-info').html(decodeURIComponent(description));
    $$('#event-more-info a').addClass('external');
    mainView.router.loadContent($$('#event-more-template').html());
}




/*
 ######     ###    ##       ######## ##    ## ########     ###    ########
##    ##   ## ##   ##       ##       ###   ## ##     ##   ## ##   ##     ##
##        ##   ##  ##       ##       ####  ## ##     ##  ##   ##  ##     ##
##       ##     ## ##       ######   ## ## ## ##     ## ##     ## ########
##       ######### ##       ##       ##  #### ##     ## ######### ##   ##
##    ## ##     ## ##       ##       ##   ### ##     ## ##     ## ##    ##
 ######  ##     ## ######## ######## ##    ## ########  ##     ## ##     ##
*/
myApp.onPageInit('calendar', function() {
    let data = JSON.parse(localStorage.getItem('calendar-info'));
    console.log(data);
    
    data.forEach(curData => {
        curData.start = new Date(curData.start.dateTime || curData.start.date);
        curData.end = new Date(curData.end.dateTime || curData.end.date);
        curData.description = curData.description || '';
        curData.location = curData.location || '';
        
        $$('#cal-list').append(`
            <li>
                <a href="#" class="item-link item-content" onclick='showCalendarInfo(${JSON.stringify(curData)})'>
                    <div class="item-inner">
                        <div class="item-title-row">
                            <div class="item-title">${curData.summary}</div>
                            <div class="item-after">${moment(curData.start).format('M/D')}</div>
                        </div>
                        <div class="item-subtitle">${moment(curData.start).format('h:mm')} - ${moment(curData.end).format('h:mm a')}</div>
                        <div class="item-text">${curData.description}</div>
                    </div>
                </a>
            </li>
        `);
    });
});


function showCalendarInfo(data) {
    data.start = new Date(data.start);
    data.end = new Date(data.end);
    
    $$('#event-more-name').html(data.summary);
    $$('#event-more-info').html(`
        <p>${moment(data.start).format('dddd, MMM D h:mm-') + moment(data.end).format('h:mm a')}</p>
        <p>${data.location}</p>
        <p>${data.description}</p>
    `);
    $$('#event-more-info a').addClass('external');
    mainView.router.loadContent($$('#event-more-template').html());
}
