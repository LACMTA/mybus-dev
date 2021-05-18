const LINE_NUMBERS_URL = 'data/line-numbers.json';
let AJAX = [];
let line_numbers = [];

function getData(url) {
    return $.getJSON(url);
}

AJAX.push(getData(LINE_NUMBERS_URL));

$(function() {
    $.when.apply($, AJAX).done(function() {
        line_numbers = arguments[0];
        populateLines();
    });
});


function populateLines() {
    let dropdown = document.querySelector('#dropdownLines ul');
    let dropdown_item = '';

    line_numbers.forEach(line => {
        dropdown_item = document.createElement('button');
        dropdown_item.classList.add('dropdown-item');
        dropdown_item.value = line.route_id;
        dropdown_item.textContent = line.route_short_name;
        dropdown_item.type = "button";
        dropdown_item.addEventListener('click', function(e) {
            let selected_value = e.target.parentNode.parentNode.parentNode.querySelector('button');
            selected_value.value = e.target.value;
            selected_value.textContent = e.target.textContent;
        });

        dropdown_item_li = document.createElement('li');
        dropdown_item_li.appendChild(dropdown_item);

        dropdown.appendChild(dropdown_item_li);
    });
}