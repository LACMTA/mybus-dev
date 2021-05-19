const DATA_PATH = 'data/';
const LINE_NUMBERS_FILENAME = 'lines.json';

let line_numbers = [];
let stop_names = [];

$.getJSON(DATA_PATH + LINE_NUMBERS_FILENAME, populateLines);

function populateLines(data) {
    $.each(data, 
        function(key, val) {
            line_numbers.push(val);
        }
    );

    let lines_dropdown = document.querySelector('#dropdownLines ul');
    let lines_dropdown_item = '';

    line_numbers.forEach(line => {
        lines_dropdown_item = document.createElement('button');
        lines_dropdown_item.classList.add('dropdown-item');
        lines_dropdown_item.type = "button";
        lines_dropdown_item.value = line.route_id;
        lines_dropdown_item.textContent = line.route_short_name;
        lines_dropdown_item.addEventListener('click', clickLineDropdown);

        let lines_dropdown_item_li = document.createElement('li');
        lines_dropdown_item_li.appendChild(lines_dropdown_item);

        lines_dropdown.appendChild(lines_dropdown_item_li);
    });
}

function populateStops(data) {
    $.each(data, 
        function(key, val) {
            stop_names.push(val);
        }
    );

    let stops1_dropdown = document.querySelector('#dropdownStops1 ul');
    let stops2_dropdown = document.querySelector('#dropdownStops2 ul');
    let stops1_item = '';
    let stops2_item = '';

    stop_names.forEach(stop => {
        stops1_item = document.createElement('button');
        stops1_item.classList.add('dropdown-item');
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
    $.getJSON(DATA_PATH + e.target.value + '.json', populateStops);
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

}