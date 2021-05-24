const QUERYSTRING = window.location.search;
const URLPARAMS = new URLSearchParams(QUERYSTRING);
const LINEID = URLPARAMS.get('lineID');
const LINE = URLPARAMS.get('line');
const STOP1 = URLPARAMS.get('stop1');
const STOP2 = URLPARAMS.get('stop2');

const DATA_LINES = 'data/';
const DATA_STOPS = 'data/';


