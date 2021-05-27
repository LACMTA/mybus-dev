const QUERYSTRING = window.location.search;
const URLPARAMS = new URLSearchParams(QUERYSTRING);
const LINEID = URLPARAMS.get('lineID');
const LINE = URLPARAMS.get('line');
const STOP1 = URLPARAMS.get('stop1');
const STOP2 = URLPARAMS.get('stop2');

const DATA_LINES = 'data/line_changes.json';
const DATA_STOPS = 'data/stop_changes.json';

let THIS_LINE = {};
let THIS_STOP1 = {};
let THIS_STOP2 = {};

$.getJSON(DATA_LINES, showLineData);
$.getJSON(DATA_STOPS, showstopData);


function showstopData(data) {
    $.each(data, 
        function(key, val) {
            
        }
    );
}

function showLineData(data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i]["Line Number"] == LINE) {
            THIS_LINE = data[i];

            document.querySelector('#lineNumber').textContent = THIS_LINE['Line Number'];
            document.querySelector('#lineDescription').textContent = THIS_LINE['Line Description'];
            break;
        }
    }
}


var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl);
});

var popover = new bootstrap.Popover(document.querySelector('.popover-dismiss'), {
    trigger: 'focus'
  });