const QUERYSTRING = window.location.search;
const URLPARAMS = new URLSearchParams(QUERYSTRING);
const LANG = URLPARAMS.get('lang');
const DATA_PATH = 'data/takeones/';

if (LANG == null || LANG == 'undefined' || LANG == '') {
    $.getJSON(DATA_PATH + 'takeone-en.json', loadContent);

} else {
    $.getJSON(DATA_PATH + 'takeone-' + LANG + '.json', loadContent);
}

function loadContent(data) {
    $.each(data, 
        function(key, val) {
            let elem = '';
            let new_elem = '';

            switch(val.section) {
                case 'header':
                    elem = document.querySelector('#all-header .row');
                    if (val.order == 1) {
                        new_elem = document.createElement('h1');
                        new_elem.classList.add('my-5');
                        new_elem.textContent = val.content;
                        elem.appendChild(new_elem);
                    }
                    break;
                case 'summary':
                    elem = document.querySelector('#all-summary .row');
                    if (val.order == 1 || (val.order % 2 == 0)) {
                        elem.appendChild(contentHelper(val.content, 'label'));
                    } else {
                        elem.appendChild(contentHelper(val.content, 'lines'));
                    }
                    break;
                case 'details':
                    elem = document.querySelector('#all-details .row');
                    if (val.order == 1) {
                        new_elem = document.createElement('h2');
                        new_elem.classList.add('my-4');
                        new_elem.textContent = val.content;
                        elem.appendChild(new_elem);
                    } else {
                        new_elem = document.createElement('div');
                        new_elem.classList.add('py-4');
                        new_elem.classList.add('notranslate');
                        new_elem.textContent = val.content;
                        elem.appendChild(new_elem);
                    }
                    break;
                case 'end':
                    elem = document.querySelector('#all-end .row');
                    elem.insertBefore(contentHelper(val.content, 'label'), elem.firstChild);
                    break;
                default:
            }
        }
    );
}

function contentHelper(content, type) {
    let elem = document.createElement('div');
    elem.classList.add('mt-4');
    elem.textContent= content;

    switch(type) {
        case 'label':
            elem.classList.add('fw-bold');
            break;
        case 'lines':
            elem.classList.add('px-5');
            break;
    }

    return elem;
}
