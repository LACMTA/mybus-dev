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

const DATA_ROUTE_CHANGES_MAPS = 'data/route-change-maps.json';
const DATA_LINE_CHANGES = 'data/line-changes.json';
const DATA_STOP_CHANGES = 'data/stop-changes/' + LINE + '-changes.json';




const STOP_CHANGE_CATEGORY_LABELS = {
    'service_canceled': 'Service canceled',
    'service_changed': 'Service changed', 
    'service_replaced': 'Service replaced',
    'stop_canceled': 'Stop canceled',
    'stop_relocated': 'Stop relocated across the intersection',
    'route_changed': 'Route changed',
    'owl_service_canceled': 'Owl service canceled',
    'replaced_by_micro': 'Service replaced by Metro Micro',
    'service_restored': 'Service to this stop restored'
};

let STOP1_CHANGES = {
    'directions': [],
    'northbound': {
        'service_canceled': false,
        'service_changed': false,
        'service_replaced': false,
        'stop_canceled': false,
        'stop_relocated': false,
        'route_changed': false,
        'owl_service_canceled': false,
        'replaced_by_micro': false,
        'service_restored': false
    },
    'southbound': {
        'service_canceled': false,
        'service_changed': false,
        'service_replaced': false,
        'stop_canceled': false,
        'stop_relocated': false,
        'route_changed': false,
        'owl_service_canceled': false,
        'replaced_by_micro': false,
        'service_restored': false
    },
    'eastbound' : {
        'service_canceled': false,
        'service_changed': false,
        'service_replaced': false,
        'stop_canceled': false,
        'stop_relocated': false,
        'route_changed': false,
        'owl_service_canceled': false,
        'replaced_by_micro': false,
        'service_restored': false
    },
    'westbound' : {
        'service_canceled': false,
        'service_changed': false,
        'service_replaced': false,
        'stop_canceled': false,
        'stop_relocated': false,
        'route_changed': false,
        'owl_service_canceled': false,
        'replaced_by_micro': false,
        'service_restored': false
    }
};
let STOP2_CHANGES = {
    'directions': [],
    'northbound': {
        'service_canceled': false,
        'service_changed': false,
        'service_replaced': false,
        'stop_canceled': false,
        'stop_relocated': false,
        'route_changed': false,
        'owl_service_canceled': false,
        'replaced_by_micro': false,
        'service_restored': false
    },
    'southbound': {
        'service_canceled': false,
        'service_changed': false,
        'service_replaced': false,
        'stop_canceled': false,
        'stop_relocated': false,
        'route_changed': false,
        'owl_service_canceled': false,
        'replaced_by_micro': false,
        'service_restored': false
    },
    'eastbound' : {
        'service_canceled': false,
        'service_changed': false,
        'service_replaced': false,
        'stop_canceled': false,
        'stop_relocated': false,
        'route_changed': false,
        'owl_service_canceled': false,
        'replaced_by_micro': false,
        'service_restored': false
    },
    'westbound' : {
        'service_canceled': false,
        'service_changed': false,
        'service_replaced': false,
        'stop_canceled': false,
        'stop_relocated': false,
        'route_changed': false,
        'owl_service_canceled': false,
        'replaced_by_micro': false,
        'service_restored': false
    }
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
        stop = stop.replaceAll('|', '');
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

            for (let i=0; i<STOP1_ID_ARR.length; i++) {
                if (val.stop_id.toString() == STOP1_ID_ARR[i]) {
                    let dir = val.direction.toLowerCase();
                    if (!STOP1_CHANGES.directions.includes(dir)) {
                        STOP1_CHANGES.directions.push(dir);
                    }

                    for (let category in STOP1_CHANGES[dir]) {
                        STOP1_CHANGES[dir][category] = STOP1_CHANGES[dir][category] || val[category];
                    }
                    stop1Found = true;
                }
            }

            for (let i=0; i<STOP2_ID_ARR.length; i++) {
                if (val.stop_id.toString() == STOP2_ID_ARR[i]) {
                    let dir = val.direction.toLowerCase();
                    STOP2_CHANGES.directions.push(dir);
                    if (!STOP2_CHANGES.directions.includes(dir)) {
                        STOP2_CHANGES.directions.push(dir);
                    }

                    for (let category in STOP2_CHANGES[dir]) {
                        STOP2_CHANGES[dir][category] = STOP2_CHANGES[dir][category] || val[category];
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
    

    for (let i = 0; i<stopChanges.directions.length; i++) {
        let direction = stopChanges.directions[i];
        let label = document.createElement('p');

        label.textContent = 'The ' + direction + ' ' + stopName + ' stop has the following updates:';
        resultNode.appendChild(label);

        let list = document.createElement('ul');

        for (let category in stopChanges[direction]) {
            if (stopChanges[direction][category]) {
                let listItem = document.createElement('li');
                listItem.textContent = STOP_CHANGE_CATEGORY_LABELS[category];
                list.appendChild(listItem);
            }
        }

        resultNode.appendChild(list);
    }

    return resultNode;
}

function noStopData(jqxhr, textStatus, error) {
    console.log('Request failed: ' + error); 
}



function loadTheMap(url){
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        // only add the map if this line exists in the route maps data
        if (typeof data[LINE] !== 'undefined') {

            // get the image url for the map
            let imageUrl = data[LINE][0];

            // the bounds of the map
            let topLeftCorner = [-33.8650, 150.2094];
            let bottomRightCorner = [-35.8650, 154.2094];
            
            // create the map
            let map = L.map('map');
           
            imageBounds = [topLeftCorner, bottomRightCorner];
            
            // add the image layer
            L.imageOverlay(imageUrl, imageBounds).addTo(map);
            L.imageOverlay(imageUrl, imageBounds).bringToFront()

            // add the bounds of the map
            let markerBoundsLayer = L.featureGroup();
            L.marker([-33.8650, 150.2094]).addTo(markerBoundsLayer);
            L.marker(bottomRightCorner).addTo(markerBoundsLayer);
            markerBoundsLayer.addTo(map);
            map.fitBounds(markerBoundsLayer.getBounds());
            map.setMaxBounds(markerBoundsLayer.getBounds());
            // set the minimum zoom level to the current zoom of the map after the bounds has been set
            // this is for the responsive map
            map.options.minZoom = map.getZoom();
            map.options.maxZoom = 10;
            map.removeLayer(markerBoundsLayer)
        }
        else{
            // if the line does not exist in the route maps data, remove the map container
            var element = document.getElementById('mapContainer');
            element.parentNode.removeChild(element);
        };
    })
    .catch(error => console.log(error));
}

function showLineData(data) {
    for (let i = 0; i < data.length; i++) {
        // find matching line
        if (data[i]["line-number"].toString().includes(LINE)) {
            // Workaround to show label for Silver & Orange lines in the header.
            document.querySelector('#lineNumber').textContent = data[i]["line-label"];

            THIS_LINE = data[i];

            document.querySelector('#lineDescription').textContent = THIS_LINE['line-description'];

            let lineSection = document.querySelector('#results-line');
            let title = document.createElement('h3');
            let content = document.createElement('p');

            // September Shakeup Update - only show one card
            if (THIS_LINE.details == '' && THIS_LINE['schedule-url'] != '') {
                title.textContent = 'Details';
                content.innerHTML = 'No major changes to this line.  See new schedule linked below.';
                lineSection.appendChild(cardHelper(title, content));
            } else if (THIS_LINE.details == '' && THIS_LINE['schedule-url'] == '' && THIS_LINE['current-schedule-url'] == '') {
                title.textContent = 'Details';
                content.innerHTML = 'No major changes to this line.  Schedule coming soon.';
                lineSection.appendChild(cardHelper(title, content));
            // } else if (THIS_LINE.details != '') {  // Uncomment this section if the 3 cards (below) are not being used.
            //     title.textContent = 'Details';
            //     content.innerHTML = THIS_LINE.details;
            //     lineSection.appendChild(cardHelper(title, content));
            } else if (THIS_LINE.details == '') {
                title.textContent = 'Details';
                content.innerHTML = 'No major changes to this line.';
                lineSection.appendChild(cardHelper(title, content));
            }

            // Show 3 cards for Service, Route, and Schedule changes
            // These three should be the same info as the Details column from the Google Sheet
            // plus the info from the More Trips columns
            if (THIS_LINE['card-1'] != '') {
                title.textContent = 'Service';
                content.innerHTML = THIS_LINE['card-1'];
                lineSection.appendChild(cardHelper(title, content));
            }

            title = document.createElement('h3');
            content = document.createElement('p');
            
            if (THIS_LINE['card-2'] != '') {
                title.textContent = 'Route';
                content.innerHTML = THIS_LINE['card-2'];
                lineSection.appendChild(cardHelper(title, content));
            }

            title = document.createElement('h3');
            content = document.createElement('p');
            
            if (THIS_LINE['card-3'] != '') {
                title.textContent = 'Schedule';
                content.innerHTML = THIS_LINE['card-3'];
                lineSection.appendChild(cardHelper(title, content));
            }

            // link to schedule
            let scheduleSection = document.querySelector('#timetable-content');
            if (THIS_LINE['schedule-url'] != '') {                
                let scheduleExists1 = document.createElement('p');
                scheduleExists1.textContent = 'Download the current schedule and map for this bus line. New timetables for the Feb 20 service changes will be available soon.';
                
                let buttonDiv = document.createElement('div');
                let button = document.createElement('button');
                button.classList.add('btn');
                button.classList.add('btn-dark');
                button.classList.add('col-12');
                button.classList.add('my-4');
                button.id = 'getSchedule';
                button.type = 'button';
                button.textContent = 'Download Current Schedule PDF';
                button.ariaLabel = 'Download current schedule PDF';

                button.classList.add('offset-lg-3');
                button.classList.add('col-lg-6');
                button.addEventListener('click', (e) => {
                    window.location = THIS_LINE['schedule-url'];
                });
                buttonDiv.appendChild(button);
                
                scheduleSection.appendChild(scheduleExists1);
                scheduleSection.appendChild(buttonDiv);
            } else {
                /* No new schedule for this line
                 * Cases:
                 * - line discontinued
                 * - line has changes but schedule PDF hasn't changed
                 * - line has no changes and schedule PDF hasn't changed
                 */
                let noNewSchedule = document.createElement('p');

                if (THIS_LINE['line-discontinued']) {
                    // line discontinued
                    noNewSchedule.textContent = 'This line has been discontinued.';
                    scheduleSection.appendChild(noNewSchedule);

                } else if (THIS_LINE['current-schedule-url'] == '' && THIS_LINE.details == '') {
                    noNewSchedule.textContent = 'Schedule coming soon.';
                    scheduleSection.appendChild(noNewSchedule);

                } else if (THIS_LINE['current-schedule-url'] != '') {
                    // noNewSchedule.textContent = 'Minor service changes to your line, but no changes to the schedule.';
                    noNewSchedule.textContent = 'No changes to your line\'s schedule.';

                    // if (THIS_LINE['card-2'] == 'No route changes.') {
                    //     noNewSchedule.textContent = 'No changes to your line.';
                    // } else {
                    //     noNewSchedule.textContent = 'Minor service changes to your line, but no changes to the schedule.';
                    // }

                    let buttonDiv = document.createElement('div');
                    let button = document.createElement('button');
                    button.classList.add('btn');
                    button.classList.add('btn-dark');
                    button.classList.add('col-12');
                    button.classList.add('my-4');
                    button.id = 'getSchedule';
                    button.type = 'button';
                    button.textContent = 'Download Current Schedule PDF';
                    button.ariaLabel = 'Download current schedule PDF';
    
                    button.classList.add('offset-lg-3');
                    button.classList.add('col-lg-6');
                    button.addEventListener('click', (e) => {
                        window.location = THIS_LINE['current-schedule-url'];
                    });
                    buttonDiv.appendChild(button);
                    
                    scheduleSection.appendChild(noNewSchedule);
                    scheduleSection.appendChild(buttonDiv);

                }
            }

            break;
        }
    }
}

/* provide title & content as nodes */
function cardHelper(title, content) {
    content.classList.add('card-text');
    title.classList.add('card-title');

    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardBody.appendChild(title);

    // Find links and fill in the destination
    links = content.querySelectorAll('.link-line');
    for (let i=0; i<links.length; i++) {
        let link = links[i];
        let line = link.textContent.match(/\d+/g);
        link.href = 'bus.html?line=' + line[0];
    }

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
        }
    }

    if (INTERNAL) {
        window.location = 'all-changes.html?internal=true&lang=' + lang;
    } else {
        window.location = 'all-changes.html?lang=' + lang;
    }
});

// Maps!

loadTheMap('./data/route-change-maps.json')

// console.log(imageUrl);