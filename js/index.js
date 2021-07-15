const QUERYSTRING = window.location.search;
const URLPARAMS = new URLSearchParams(QUERYSTRING);
const INTERNAL = URLPARAMS.get('internal');

const DATA_PATH = 'data/';
const LINE_NUMBERS_FILENAME = 'lines.json';
const RESULTS_PAGE = 'bus.html';
const TAKEONE_PAGE = 'all-changes.html';

let line_numbers = [];

$.getJSON(DATA_PATH + LINE_NUMBERS_FILENAME, populateLines);

function populateLines(data) {
    $.each(data, 
        function(key, val) {
            line_numbers.push(val);
        }
    );

    let lines_dropdown = document.querySelector('#dropdownLines ul');
    let lines_dropdown_item = '';
    let lines_dropdown_item_li = '';

    lines_dropdown_item = document.createElement('button');
    lines_dropdown_item.classList.add('dropdown-item');
    lines_dropdown_item.classList.add('notranslate');
    lines_dropdown_item.type = "button";
    lines_dropdown_item.value = "all";
    lines_dropdown_item.textContent = "View All Lines";
    lines_dropdown_item.addEventListener('click', clickLineDropdown);

    lines_dropdown_item_li = document.createElement('li');
    lines_dropdown_item_li.appendChild(lines_dropdown_item);
    lines_dropdown.appendChild(lines_dropdown_item_li);

    line_numbers.forEach(line => {
        lines_dropdown_item = document.createElement('button');
        lines_dropdown_item.classList.add('dropdown-item');
        lines_dropdown_item.classList.add('notranslate');
        lines_dropdown_item.type = "button";
        lines_dropdown_item.value = line.route_short_name;

        switch(line.route_short_name) {
            case 901:
                lines_dropdown_item.textContent = "901 / G Line (Orange)";
                break;
            case 910:
                lines_dropdown_item.textContent = "910 / J Line (Silver)";
                break;
            case 950:
                lines_dropdown_item.textContent = "950 / J Line (Silver)";
                break;
            default:
                lines_dropdown_item.textContent = line.route_short_name;
        }
        
        lines_dropdown_item.addEventListener('click', clickLineDropdown);

        lines_dropdown_item_li = document.createElement('li');
        lines_dropdown_item_li.appendChild(lines_dropdown_item);
        lines_dropdown.appendChild(lines_dropdown_item_li);
    });
}

function populateStops(data) {
    let stops1 = document.querySelector('#dropdownStops1');
    let stops2 = document.querySelector('#dropdownStops2');
    let stops1_dropdown = stops1.querySelector('ul');
    let stops2_dropdown = stops2.querySelector('ul');
    let stops1_button = stops1.querySelector('button');
    let stops2_button = stops2.querySelector('button');
    let stops1_item = '';
    let stops2_item = '';
    let stop_names = [];

    // Reset Dropdowns
    stops1_button.value = '';
    stops1_button.innerText = 'Select your stop A';
    
    stops2_button.value = '';
    stops2_button.innerText = 'Select your stop B';
    
    stops2_button.classList.add('disabled');

    while (stops1_dropdown.childNodes.length > 0) {
        stops1_dropdown.removeChild(stops1_dropdown.firstChild);
    }

    while (stops2_dropdown.childNodes.length > 0) {
        stops2_dropdown.removeChild(stops2_dropdown.firstChild);
    }

    $.each(data, 
        function(key, val) {
            stop_names.push(val);
        }
    );

    stop_names.forEach(stop => {
        stops1_item = document.createElement('button');
        stops1_item.classList.add('dropdown-item');
        stops1_item.classList.add('notranslate');
        stops1_item.type = "button";
        stops1_item.value = stop.stop_id;
        stops1_item.textContent = stop.stop_name;

        stops2_item = stops1_item.cloneNode(true);
        stops2_item.addEventListener('click', clickStop2Dropdown);

        stops1_item.addEventListener('click', clickStop1Dropdown);

        let stops1_dropdown_item_li = document.createElement('li');
        stops1_dropdown_item_li.appendChild(stops1_item);
        stops1_dropdown.appendChild(stops1_dropdown_item_li);

        let stops2_dropdown_item_li = document.createElement('li');
        stops2_dropdown_item_li.appendChild(stops2_item);
        stops2_dropdown.appendChild(stops2_dropdown_item_li);
    });

    document.querySelector('#dropdownStopsButton1').classList.remove('disabled');
}

function clickLineDropdown(e) {
    let selected_value = e.target.parentNode.parentNode.parentNode.querySelector('button');
    selected_value.value = e.target.value;
    selected_value.textContent = e.target.textContent;

    if (e.target.value == 'all') {
        document.querySelector('#dropdownStops1').classList.add('d-none');
        document.querySelector('#dropdownStops2').classList.add('d-none');

        document.querySelector('#requestLineStops').addEventListener('click', clickRequestLineStop);
        document.querySelector('#requestLineStops').addEventListener('touch', clickRequestLineStop);
        document.querySelector('#requestLineStops').classList.remove('disabled');
    // } else if (e.target.value == '177') {
    //     document.querySelector('#dropdownStops1').classList.add('d-none');
    //     document.querySelector('#dropdownStops2').classList.add('d-none');
    //     document.querySelector('#requestLineStops').addEventListener('click', clickRequestLineStop);
    //     document.querySelector('#requestLineStops').addEventListener('touch', clickRequestLineStop);
    //     document.querySelector('#requestLineStops').classList.remove('disabled');
    } else {
        document.querySelector('#dropdownStops1').classList.remove('d-none');
        document.querySelector('#dropdownStops2').classList.remove('d-none');

        document.querySelector('#requestLineStops').classList.add('disabled');

        // Get file with list of stops for each line.
        // Filename is route_short_name (which populated the value of the line selection button).
        $.getJSON(DATA_PATH + 'line-stops/' + e.target.value + '.json', populateStops);
    }
}

function clickStop1Dropdown(e) {
    let selected_value = e.target.parentNode.parentNode.parentNode.querySelector('button');
    selected_value.value = e.target.value;
    selected_value.textContent = e.target.textContent;

    document.querySelector('#dropdownStopsButton2').classList.remove('disabled');
}

function clickStop2Dropdown(e) {
    let selected_value = e.target.parentNode.parentNode.parentNode.querySelector('button');
    selected_value.value = e.target.value;
    selected_value.textContent = e.target.textContent;

    document.querySelector('#requestLineStops').addEventListener('click', clickRequestLineStop);
    document.querySelector('#requestLineStops').classList.remove('disabled');
}

function clickRequestLineStop(e) {
    let lineSelectedValue = document.querySelector('#dropdownLinesButton').value;
    let googleFrame = document.querySelector('.goog-te-menu-frame');
    let selectedLanguage = '';
    let lang = 'en';
    
    if (googleFrame != null) {
        selectedLanguage = googleFrame.contentDocument.querySelector('.goog-te-menu2-item-selected');

        if (selectedLanguage != null) {
            lang = selectedLanguage.value;
        }
    }
    
    if (lineSelectedValue == 'all') {
        if (INTERNAL) {
            window.location = TAKEONE_PAGE + '?internal=true&lang=' + lang;
        } else {
            window.location = TAKEONE_PAGE + '?lang=' + lang;
        }
    // } else if (lineSelectedValue == '177') {
    //     if (INTERNAL) {
    //         window.location = RESULTS_PAGE + '?line=177&internal=true&lang=' + lang;
    //     } else {
    //         window.location = RESULTS_PAGE + '?line=177&lang=' + lang;
    //     }
    } else {
        let stop1 = document.querySelector('#dropdownStopsButton1');
        let stop2 = document.querySelector('#dropdownStopsButton2');
        
        let resultsURL = RESULTS_PAGE + '?';

        if (INTERNAL) {
            resultsURL += 'internal=true&';
        }
        
        window.location = resultsURL +
            'line=' + lineSelectedValue + 
            '&stop1=' + stop1.value + 
            '&stop1name=' + stop1.innerText + 
            '&stop2=' + stop2.value + 
            '&stop2name=' + stop2.innerText; 
        
    }
}

document.querySelector('#requestNextgenInfo').addEventListener('click', clickRequestNextgenInfo);
document.querySelector('#requestTransitPreviewMobile').addEventListener('click', clickRequestTransitPreview);
document.querySelector('#requestTransitPreviewDesktop').addEventListener('click', clickRequestTransitPreview);

function clickRequestNextgenInfo() {
    window.location = "https://www.metro.net/projects/nextgen/";
}

function clickRequestTransitPreview() {
    window.location = "transit.html";
}