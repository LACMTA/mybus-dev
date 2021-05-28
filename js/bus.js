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

let STOP1_CHANGES = {
    'service_canceled': '',
    'service_changed': '', 
    'service_replaced': '', 
    'stop_canceled': '', 
    'stop_relocated': '', 
    'route_changed': '', 
    'owl_service_canceled': ''
};
let STOP2_CHANGES = {
    'service_canceled': '',
    'service_changed': '', 
    'service_replaced': '', 
    'stop_canceled': '', 
    'stop_relocated': '', 
    'route_changed': '', 
    'owl_service_canceled': ''
};


{/* <h2 id="stop-1">3rd / Hudson</h2>
<h2 id="stop-2" class='mt-4'>3rd / Norton</h2> */}
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


$.getJSON(DATA_LINE_CHANGES, showLineData);

$.getJSON(DATA_STOP_CHANGES)
    .done(showStopData)
    .fail(noStopData);

function showStopData(data) {
    $.each(data, 
        function(key, val) {
            if (val.stop_id == STOP1) {
                STOP1_CHANGES.service_canceled = val.service_canceled;
            } else if (val.stop_id == STOP2) {

            }
        }
    );
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
            
            // show card 1
            if (THIS_LINE['lines-merged']) {
                lineSection.appendChild(cardHelper('Line Merged', THIS_LINE['card-1']));
            } else if (THIS_LINE['line-discontinued']) {
                lineSection.appendChild(cardHelper('Line Discontinued', THIS_LINE['card-1']));
            } else if (THIS_LINE['service-restored']) {
                lineSection.appendChild(cardHelper('Service Restored', THIS_LINE['card-1']));
            }

            // show card 2
            if (THIS_LINE['card-2'] != '') {
                lineSection.appendChild(cardHelper('Route', THIS_LINE['card-2']));
            }

            // show card 3
            if (THIS_LINE['card-3'] != '') {
                lineSection.appendChild(cardHelper('Schedule', THIS_LINE['card-3']));
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


function cardHelper(title, content) {
    let cardContent = document.createElement('p');
    cardContent.classList.add('card-text');
    cardContent.textContent = content;

    let cardTitle = document.createElement('h3');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = title;

    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardContent);

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