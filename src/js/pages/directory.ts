import Database from '../server/Database';
import Authenticator from '../server/Authenticator';
import { Directory, DirectoryKeys } from '../Directory';
import Scout from '../contact/Scout';
import PhoneNumber from '../contact/PhoneNumber';
import $ from 'jQuery';
import List from 'list.js';

const directoryKeymap = [
    ['scout', 'firstName'], ['scout', 'lastName'], ['scout', 'email'], ['scout', 'homePhone'], ['scout', 'slack'],
    ['scout', 'jobA'], ['scout', 'jobB'], ['scout', 'joinDate'], ['scout', 'active'], ['scout', 'WFATrained'],
    ['scout', 'school'], ['scout', 'fixedGrade'], ['scout', 'currentGrade'], ['scout', 'cellPhone'],
    ['father', 'firstName'], ['father', 'lastName'], ['father', 'cellPhone'], ['father', 'email'], ['father', 'slack'],
    ['mother', 'firstName'], ['mother', 'lastName'], ['mother', 'cellPhone'], ['mother', 'email'], ['mother', 'slack'],
];
const columnKeymap = [
    ['Scout\'s First Name', 'Scout\'s Last Name', 'Patrol', 'Scout\'s E-mail', 'Scout\'s Home Phone', 'Slack Username',
        'Troop Jobs', 'Date Joined Troop 485', 'Active (Y)es/ (R)arely/ (N)o', 'Wilderness First Aid Trained',
        'School Attending', 'Scout\'s Current Grade', 'Scout\'s Cell Phone'],
    ['Father\'s First Name', 'Father\'s Last Name', 'Father\'s Cell Phone', 'Father\'s E-mail', 'Father\'s Slack Username or None'],
    ['Mother\'s First Name', 'Mother\'s Last Name', 'Mother\'s Cell Phone', 'Mother\'s E-mail', 'Mother\'s Slack Username or None'],
];
const unknownText = `<i>Unknown</i>`;
const noneText = `<i>None</i>`;

let db = new Database();
let start = new Date().getTime();
let list;

function init() {
    loadHeaders();
    loadData();

}


function loadHeaders() {
    let colNum = 0;

    for (let i = 0; i < columnKeymap.length; i++) {
        for (let j = 0; j < columnKeymap[i].length; j++, colNum++) {
            console.log(columnKeymap[i][j]);
            $('#dir-head-inner').append(`
				<th scope="col" class="col-${colNum} header">${columnKeymap[i][j]}</th>
			`);
        }
    }
}

function toString(obj: any) {
    // Alternative to if/else
    switch (true) {
            // We treat "" as undefined
        case obj === '':
        case typeof obj === 'undefined':
            return unknownText;
            break;
        case obj === null:
            return noneText;
            break;
        case typeof obj === 'string':
            return obj;
            break;
        case typeof obj === 'number':
        case obj instanceof PhoneNumber: // Explicitly type it out for clarity and in the method changes.
            return obj.toString();
            break;
        default:
            try {
                return obj.toString();
            } catch (e) {
                return unknownText;
            }
    }
}

function loadData() {
    db.ref('/directory/keys').once('value').then(function(snapshot) {
        let data = snapshot.val();
        let keys: DirectoryKeys;
        keys = {
            id: data.id,
            api: data.api,
            sheets: data.sheets,
            range: 'A2:X',

        };

        let url = `https://docs.google.com/spreadsheets/d/${keys.id}/edit`;
        $('.link-google-sheet-dir').attr('href', url);

        let directory = new Directory(keys, directoryKeymap);
        directory.update(function(scout: Scout) {
            let row = [];
            // We use one less then the length because at the end, we will have modified the index by -1 + 2, which means at the end
            // The index will be one more than what it should be at.
            for (let i = 0; i < directoryKeymap.length - 1; i++) {
                let index = i;
                let value = '';
                if (i > 2) {
                    // We add the patrol, but it's not in the keymap
                    index--;
                }
                if (i > 5) {
                    // In the slot that would contain jobA, we list both jobs, so we skip the jobB.
                    index++;
                }
                if (i > 10) {
                    // We don't display the fixedGrade.
                    index++;
                }
                console.log(directoryKeymap[index][0], directoryKeymap[index][1], index, i, scout);

                if (i == 2) {

                    value = ['Dragons', 'Serpents', 'Blobfish', 'Hawks', 'Wildcats', 'Cacti'][scout.patrol];
                } else if (directoryKeymap[index][1] === 'jobA') {
                    value = scout['jobs'].join(', ');
                } else if (directoryKeymap[index][0] == 'scout') {
                    value = toString(scout[directoryKeymap[index][1]]);
                } else {
                    // If the property is of the scout, and not the parents, or the property is of a non-null parent
                    // of the scout, then we convert it to a string.
                    value = (directoryKeymap[index][0] == 'scout' || scout[directoryKeymap[index][0]])
                            ? toString(directoryKeymap[index][0] == 'scout'
                                    ? scout[directoryKeymap[index][1]]
                                    : scout[directoryKeymap[index][0]][directoryKeymap[index][1]])
                            : unknownText;
                }

                row.push(`<td class="col-${index}">${value}</td>`);

            }

            $('#dir-body').append(`<tr>${row.join('')}</tr>`);
        }).then(function() {
            $('#loading-text').addClass('hidden');
            loadDoubleScrollbar();
            let valueNames = [];
            let count = 0;
            for (let i = 0; i < columnKeymap.length; i++) {
                for (let j = 0; j < columnKeymap[i].length; j++, count++) {
                    valueNames.push('col-' + count);
                }

            }
            console.log(valueNames);
            const options = {
                valueNames: valueNames,
            };
            list = new List('directory-list', options);
            console.log('LIST', List, list);

            let end = new Date().getTime();
            $('.directoryScoutSize').text(directory.getScouts().length + '');
            $('.directoryLoadTime').text((end - start) + 'ms');
            $('.directoryLoaded-show').removeClass('hidden');
            console.log('Done in ' + (end - start) + 'ms');
            console.log(directory);

        });
    });
}

function loadDoubleScrollbar() {
    $('#table-doublescrollbar').width($('#dir-body').innerWidth() || "");

    // TODO: Link scrollbars
    $('#table').on('resize', function(e) {
        $('#table').on('scroll', function(e) {
            $('#table-doublescrollbar').scrollLeft($('#table').scrollLeft() || 0);
        });
        $('#table-doublescrollbar').on('scroll', function(e) {
            $('#table').scrollLeft($('#table-doublescrollbar').scrollLeft() || 0);
        });
    }).trigger('scroll');

}

init();

