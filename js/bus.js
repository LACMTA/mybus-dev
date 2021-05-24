const QUERYSTRING = window.location.search;
const URLPARAMS = new URLSearchParams(QUERYSTRING);
const LINEID = URLPARAMS.get('lineID');
const LINE = URLPARAMS.get('line');
const STOP1 = URLPARAMS.get('stop1');
const STOP2 = URLPARAMS.get('stop2');

const DATA_LINES = 'data/line_changes.json';
const DATA_STOPS = 'data/stop_changes.json';

$.getJSON(DATA_LINES, showLineChanges);
$.getJSON(DATA_STOPS, showStopChanges);


function showStopChanges(data) {
    $.each(data, 
        function(key, val) {
            
        }
    );
}

function showLineChanges(data) {
    $.each(data, 
        function(key, val) {
            
        }
    );
}


var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl);
});

var popover = new bootstrap.Popover(document.querySelector('.popover-dismiss'), {
    trigger: 'focus'
  });