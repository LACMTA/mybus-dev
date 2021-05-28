const QUERYSTRING = window.location.search;
const URLPARAMS = new URLSearchParams(QUERYSTRING);
const LINEID = URLPARAMS.get('lineID');
const LINE = URLPARAMS.get('line');
const STOP1 = URLPARAMS.get('stop1');
const STOP2 = URLPARAMS.get('stop2');
const STOP1_NAME = URLPARAMS.get('stop1name');
const STOP2_NAME = URLPARAMS.get('stop2name');

const DATA_LINE_CHANGES = 'data/line-changes.json';
const DATA_STOP_CHANGES = 'data/stop-changes/' + LINEID + '-changes.json';

const STOP_CHANGE_CATEGORY_LABELS = {
    'service_canceled': 'Service Canceled',
    'service_changed': 'Service Changed', 
    'service_replaced': 'Service Replaced',
    'stop_canceled': 'Stop Canceled',
    'stop_relocated': 'Stop Relocated',
    'route_changed': 'Route Changed',
    'owl_service_canceled': 'Owl Service Canceled'
}

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

document.querySelector('#lineNumber').textContent = LINE;

let stop1Heading = document.createElement('h2');
stop1Heading.textContent = STOP1_NAME;
let stop2Heading = document.createElement('h2');
stop2Heading.textContent = STOP2_NAME;

let stopsSection = document.querySelector('#results-stops .col');
stopsSection.appendChild(stop1Heading);
stopsSection.appendChild(stop2Heading);

let THIS_LINE = {};
let THIS_STOP1 = {};
let THIS_STOP2 = {};

/* Only try to line line change data if LINE param is provided */
if (LINE != null && STOP1 != 'undefined' && STOP1 != '') {
    $.getJSON(DATA_LINE_CHANGES, showLineData);
}

/* Only try to load stop changes data if STOP1 and STOP2 params are provided */
if (STOP1 != null && STOP1 != 'undefined' && STOP1 != '' ||
    STOP2 != null && STOP2 != 'undefined' && STOP2 != '') {
    $.getJSON(DATA_STOP_CHANGES)
        .done(showStopData)
        .fail(noStopData);
}

function showStopData(data) {
    var stop1Found = false;
    var stop2Found = false;

    $.each(data, 
        function(key, val) {
            // Aggregate all stop change categories for the stops.
            if (val.stop_id.toString() == STOP1) {
                for (let category in STOP1_CHANGES) {
                    STOP1_CHANGES[category] = STOP1_CHANGES[category] || val[category];
                }

                stop1Found = true;
            } else if (val.stop_id.toString() == STOP2) {
                for (let category in STOP2_CHANGES) {
                    STOP2_CHANGES[category] = STOP2_CHANGES[category] || val[category];
                }
                stop2Found = true;
            }
        }
    );

    let stopSection = {};
    let title = {};
    let content = {};

    if (stop1Found || stop2Found) {
        stopSection = document.querySelector('#results-stops .col');
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

    label.textContent = stopName + ' has the following updates:';
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

            let lineSection = document.querySelector('#results-line .col');
            let title = document.createElement('h3');
            let content = document.createElement('p');

            // show card 1
            if (THIS_LINE['lines-merged']) {
                title.textContent = 'Line Merged';
                content.textContent = THIS_LINE['card-1'];

                lineSection.appendChild(cardHelper(title, content));
            } else if (THIS_LINE['line-discontinued']) {
                title.textContent = 'Line Discontinued';
                content.textContent = THIS_LINE['card-1'];

                lineSection.appendChild(cardHelper(title, content));
            } else if (THIS_LINE['service-restored']) {
                title.textContent = 'Service Restored';
                content.textContent = THIS_LINE['card-1'];

                lineSection.appendChild(cardHelper(title, content));
            }

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
                scheduleExists1.textContent = 'Download PDF for specific schedule and route information.';
                let scheduleExists2 = document.createElement('p');
                scheduleExists2.textContent = 'Call 323.GO.METRO for additional inquiries.';
                
                let buttonDiv = document.createElement('div');
                let button = document.createElement('button');
                button.classList.add('btn');
                button.classList.add('btn-dark');
                button.classList.add('col-12');
                button.classList.add('mb-4');
                button.id = 'btnDownloadSchedule';
                button.type = 'button';
                button.textContent = 'Download Schedule PDF';
                button.addEventListener('click', (e) => {
                    window.location = THIS_LINE['schedule-url'];
                });
                buttonDiv.appendChild(button);
                
                scheduleSection.appendChild(scheduleExists1);
                scheduleSection.appendChild(scheduleExists2);
                scheduleSection.appendChild(buttonDiv);
            } else {
                let schedulesDontExist = document.createElement('p');
                schedulesDontExist.textContent = 'Thanks for your patience as we work to add the new schedule. Check back soon. ';
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
    newCard.classList.add('bg-light');
    newCard.classList.add('mb-3');
    newCard.appendChild(cardBody);
    
    return newCard;
}

// var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
// var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
//   return new bootstrap.Popover(popoverTriggerEl);
// });

// var popover = new bootstrap.Popover(document.querySelector('.popover-dismiss'), {
//     trigger: 'focus'
//   });