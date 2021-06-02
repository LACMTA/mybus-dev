const QUERYSTRING = window.location.search;
const URLPARAMS = new URLSearchParams(QUERYSTRING);
const INTERNAL = URLPARAMS.get('internal');
const LINE = URLPARAMS.get('line');
const STOP1_IDS = URLPARAMS.get('stop1');
const STOP2_IDS = URLPARAMS.get('stop2');
let STOP1_ID_ARR = [];
let STOP2_ID_ARR = [];
const STOP1_NAME = URLPARAMS.get('stop1name');
const STOP2_NAME = URLPARAMS.get('stop2name');

const DATA_LINE_CHANGES = 'data/line-changes.json';
const DATA_STOP_CHANGES = 'data/stop-changes/' + LINE + '-changes.json';

const STOP_CHANGE_CATEGORY_LABELS = {
    'service_canceled': 'Service Canceled',
    'service_changed': 'Service Changed', 
    'service_replaced': 'Service Replaced',
    'stop_canceled': 'Stop Canceled',
    'stop_relocated': 'Stop Relocated',
    'route_changed': 'Route Changed',
    'owl_service_canceled': 'Owl Service Canceled'
};

let STOP1_CHANGES = {
    'service_canceled': false,
    'service_changed': false, 
    'service_replaced': false,
    'stop_canceled': false,
    'stop_relocated': false,
    'route_changed': false,
    'owl_service_canceled': false
};
let STOP2_CHANGES = {
    'service_canceled': false,
    'service_changed': false,
    'service_replaced': false,
    'stop_canceled': false,
    'stop_relocated': false,
    'route_changed': false,
    'owl_service_canceled': false
};



let THIS_LINE = {};
let THIS_STOP1 = {};
let THIS_STOP2 = {};

/* Only try to show line change data if LINE param is provided */
if (LINE != null && !isNaN(LINE)) {
    document.querySelector('#lineNumber').textContent = LINE;
    document.querySelector('title').textContent = document.querySelector('title').textContent + LINE;
    $.getJSON(DATA_LINE_CHANGES, showLineData);
} else {
    document.querySelector('#results-timetable-image-container').classList.add('d-none');
    document.querySelector('#results-timetable-container').classList.add('d-none');
    document.querySelector('#lineNumber').textContent = 'See All Updates';
}

/* Only try to load stop changes data if STOP1 and STOP2 params are provided and valid*/
if (isValidStopParam(STOP1_IDS) && isValidStopParam(STOP2_IDS)) {
    STOP1_ID_ARR = STOP1_IDS.split('|');
    STOP2_ID_ARR = STOP2_IDS.split('|');
    
    document.querySelector('#stopSelection').classList.remove('d-none');

    let header = document.querySelector('#headerStops');
    let stopPath = document.querySelector('#stopPath');

    let stop1Heading = document.createElement('div');
    stop1Heading.classList.add('stop1-name');
    stop1Heading.textContent = STOP1_NAME;
    stop1Heading.style.fontWeight = 700;
    stop1Heading.style.color = '#FFF';

    let stop2Heading = document.createElement('div');
    stop2Heading.classList.add('stop2-name');
    stop2Heading.textContent = STOP2_NAME;
    stop2Heading.style.fontWeight = 700;
    stop2Heading.style.color = '#FFF';

    let content = document.createElement('div');
    content.classList.add('card-text');
    content.appendChild(stop1Heading);
    content.appendChild(stop2Heading);

    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardBody.classList.add('d-flex');
    cardBody.classList.add('flex-row');
    cardBody.classList.add('align-items-center');
    
    stopPath.remove();
    cardBody.appendChild(stopPath);
    cardBody.appendChild(content);
    
    let newCard = document.createElement('div');
    newCard.classList.add('card');
    newCard.classList.add('mb-3');
    newCard.classList.add('card-blue');
    newCard.appendChild(cardBody);

    header.appendChild(newCard);
    
    $.getJSON(DATA_STOP_CHANGES)
        .done(showStopData)
        .fail(noStopData);
} else {
    /* No stops provided - Give Line-only view */
    let changeSection = document.querySelector('#changes');
    changeSection.classList.remove('col-lg-7');
    changeSection.classList.add('offset-lg-1');
    changeSection.classList.add('col-lg-10');
}

function isValidStopParam(stop) {
    if (stop == null || stop == 'undefined' || stop == '') {
        return false;
    } else {
        stop = stop.replace('\|', '');
        if (isNaN(stop)) {
            return false;
        }
        return true;
    }
}

function showStopData(data) {
    var stop1Found = false;
    var stop2Found = false;

    $.each(data, 
        function(key, val) {
            // Aggregate all stop change categories for all stop IDs for each stop.

            for (let i=1; i<STOP1_ID_ARR.length; i++) {
                if (val.stop_id.toString() == STOP1_ID_ARR[i]) {
                    for (let category in STOP1_CHANGES) {
                        STOP1_CHANGES[category] = STOP1_CHANGES[category] || val[category];
                    }
                    stop1Found = true;
                }
            }

            for (let i=1; i<STOP2_ID_ARR.length; i++) {
                if (val.stop_id.toString() == STOP2_ID_ARR[i])  {
                    for (let category in STOP2_CHANGES) {
                        STOP2_CHANGES[category] = STOP2_CHANGES[category] || val[category];
                    }
                    stop2Found = true;
                }
            }
        }
    );

    let stopSection = {};
    let title = {};
    let content = {};

    if (stop1Found || stop2Found) {
        stopSection = document.querySelector('#results-stops');
        title = document.createElement('h3');
        title.textContent = 'Stops';
        content = document.createElement('div');

        if (stop1Found) {
            content.appendChild(stopChangesHelper(STOP1_NAME, STOP1_CHANGES));
        }
        if (stop2Found) {
            content.appendChild(stopChangesHelper(STOP2_NAME, STOP2_CHANGES));
        }

        stopSection.appendChild(cardHelper(title, content));
    }
}

/* Return a node */
function stopChangesHelper(stopName, stopChanges) {
    let resultNode = document.createElement('div');
    let label = document.createElement('p');

    label.textContent = 'The ' + stopName + ' stop has the following updates:';
    resultNode.appendChild(label);

    let list = document.createElement('ul');

    for (let category in stopChanges) {
        if (stopChanges[category]) {
            let listItem = document.createElement('li');
            listItem.textContent = STOP_CHANGE_CATEGORY_LABELS[category];
            list.appendChild(listItem);
        }
    }
    resultNode.appendChild(list);

    return resultNode;
}

function noStopData(jqxhr, textStatus, error) {
    console.log('Request failed: ' + error); 
}

function showLineData(data) {
    for (let i = 0; i < data.length; i++) {
        // find matching line
        if (data[i]["line-number"] == LINE) {
            THIS_LINE = data[i];

            document.querySelector('#lineDescription').textContent = THIS_LINE['line-description'];

            let lineSection = document.querySelector('#results-line');
            let title = document.createElement('h3');
            let content = document.createElement('p');

            // show card 1 - just do as generic "Service" without filtering for merged, discontinued, restored?
            if (THIS_LINE['card-1'] != '') {
                title.textContent = 'Service';
                content.textContent = THIS_LINE['card-1'];
                lineSection.appendChild(cardHelper(title, content));
            }

            // if (THIS_LINE['lines-merged']) {
            //     title.textContent = 'Line Merged';
            //     content.textContent = THIS_LINE['card-1'];

            //     lineSection.appendChild(cardHelper(title, content));
            // } else if (THIS_LINE['line-discontinued']) {
            //     title.textContent = 'Line Discontinued';
            //     content.textContent = THIS_LINE['card-1'];

            //     lineSection.appendChild(cardHelper(title, content));
            // } else if (THIS_LINE['service-restored']) {
            //     title.textContent = 'Service Restored';
            //     content.textContent = THIS_LINE['card-1'];

            //     lineSection.appendChild(cardHelper(title, content));
            // }

            title = document.createElement('h3');
            content = document.createElement('p');
            // show card 2
            if (THIS_LINE['card-2'] != '') {
                title.textContent = 'Route';
                content.textContent = THIS_LINE['card-2'];
                lineSection.appendChild(cardHelper(title, content));
            }

            title = document.createElement('h3');
            content = document.createElement('p');
            // show card 3
            if (THIS_LINE['card-3'] != '') {
                title.textContent = 'Schedule';
                content.textContent = THIS_LINE['card-3'];
                lineSection.appendChild(cardHelper(title, content));
            }

            // link to schedule
            let scheduleSection = document.querySelector('#timetable-content');
            if (THIS_LINE['schedule-url'] != '') {                
                let scheduleExists1 = document.createElement('p');
                scheduleExists1.textContent = 'Download the new schedule and map for this bus line.';
                
                let buttonDiv = document.createElement('div');
                let button = document.createElement('button');
                button.classList.add('btn');
                button.classList.add('btn-dark');
                button.classList.add('col-12');
                button.classList.add('my-4');
                button.id = 'getSchedule';
                button.type = 'button';
                button.textContent = 'Download PDF';
                button.ariaLabel = 'Download Schedule PDF';

                button.classList.add('offset-lg-3');
                button.classList.add('col-lg-6');
                button.addEventListener('click', (e) => {
                    window.location = THIS_LINE['schedule-url'];
                });
                buttonDiv.appendChild(button);
                
                scheduleSection.appendChild(scheduleExists1);
                scheduleSection.appendChild(buttonDiv);
            } else {
                let schedulesDontExist = document.createElement('p');
                schedulesDontExist.textContent = 'Thanks for your patience as we work to add the new schedule. Check back soon.';
                scheduleSection.appendChild(schedulesDontExist);
            }

            break;
        }
    }
}

/* provide title & content as nodes */
function cardHelper(title, content) {
    // let cardContent = document.createElement('p');
    // cardContent.classList.add('card-text');
    // cardContent.textContent = content;

    // let cardTitle = document.createElement('h3');
    // cardTitle.classList.add('card-title');
    // cardTitle.textContent = title;
    
    content.classList.add('card-text');
    title.classList.add('card-title');

    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardBody.appendChild(title);
    cardBody.appendChild(content);

    let newCard = document.createElement('div');
    newCard.classList.add('card');
    newCard.classList.add('text-dark');
    newCard.classList.add('mb-3');
    newCard.appendChild(cardBody);
    
    return newCard;
}

document.querySelector('#btnAllChanges').addEventListener('click', function() {
    let googleFrame = document.querySelector('.goog-te-menu-frame');
    let selectedLanguage = '';
    let lang = 'en';
    
    if (googleFrame != null) {
        selectedLanguage = googleFrame.contentDocument.querySelector('.goog-te-menu2-item-selected');
        if (selectedLanguage != null) {
            lang = selectedLanguage.value;

            // switch(selectedLanguage.value) {
            //     case 'en':
            //         lang = 'en';
            //         break;
            //     case 'es':
            //         lang = 'es';
            //         break;
            //     case 'zh-TW':
            //         lang = 'zh-TW';
            //         break;
            //     case 'ko':
            //         lang = 'ko';
            //         break;
            //     case 'Tiếng Việt (Vietnamese)':
            //         lang = 'vi';
            //         break;
            //     case '日本語 (Japanese)':
            //         lang = 'ja';
            //         break;
            //     case 'русский (Russian)':
            //         lang = 'ru';
            //         break;
            //     case 'Армянский (Armenian)':
            //         lang = 'hy';
            //         break;
            //     default:
            //         lang = 'en';
            // }
        }
    }

    if (INTERNAL) {
        window.location = 'all-changes.html?internal=true&lang=' + lang;
    } else {
        window.location = 'all-changes.html?lang=' + lang;
    }
});
