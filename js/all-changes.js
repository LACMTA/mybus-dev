const QUERYSTRING = window.location.search;
const URLPARAMS = new URLSearchParams(QUERYSTRING);
const LANG = URLPARAMS.get('lang');
const DATA_PATH = 'data/takeones/';

if (LANG == null || LANG == 'undefined' || LANG == '' || LANG == 'en') {
    $.getJSON(DATA_PATH + 'takeone-en.json', loadContent);

} else {
    $.getJSON(DATA_PATH + 'takeone-' + LANG + '.json', loadContent);
}

const SCHEDULE_LINK_TRANLSATED = {
    'en': 'Download new schedule for Line ' ,
    'es': '',
    'zh-TW': '',
    'ko': '',
    'vi': '',
    'ja': '',
    'ru': '',
    'hy': ''
};

const TRANSLATED_FILES = [['English', 'files/NextGen_Changes_English.pdf'],
    ['Español (Spanish)', 'files/NextGen_Changes_Spanish.pdf'],
    ['中文 (Chinese Traditional)', 'files/NextGen_Changes_Chinese.pdf'],
    ['한국어 (Korean)', 'files/NextGen_Changes_Korean.pdf'],
    ['Tiếng Việt (Vietnamese)', 'files/NextGen_Changes_Vietnamese.pdf'],
    ['日本語 (Japanese)', 'files/NextGen_Changes_Japanese.pdf'],
    ['русский (Russian)', 'files/NextGen_Changes_Russian.pdf'],
    ['Армянский (Armenian)', 'files/NextGen_Changes_Armenian.pdf']];

function loadContent(data) {
    let summaryContentCombined = '';
    
    $.each(data, 
        function(key, val) {
            let elem = '';
            let newElem = '';

            let section = val.section;
            let order = val.order;
            
            
            // TODO: fix this in the data
            // if (section == 'summary' && order == 6) {
            //     section = 'details';
            //     order = 0;
            // }

            switch(section) {
                /*
                 * 8/20/21 - Nina
                 * 
                 * Data contains a second line in the header section stating "New schedules start XXXXX."
                 * I believe this was taken out for the June site because it's redundant with the page copy.
                 * 
                 * TODO: Less hard coding of data based on row numbers
                */
                case 'header':
                    elem = document.querySelector('#all-header .row');
                    if (order == 1) {
                        newElem = document.createElement('h1');
                        newElem.classList.add('my-5');
                        newElem.classList.add('notranslate');
                        newElem.innerHTML = val.content;
                        elem.appendChild(newElem);
                    }
                    break;
                case 'summary':
                    elem = document.querySelector('#all-summary .row');
                    
                    if (order < 1) {
                        summaryContentCombined += val.content + ' ';

                        if (order == 0) {
                            elem.appendChild(contentHelper(summaryContentCombined, 'label'));

                            // Insert the links to the PDFs
                            let linkElem = document.createElement('div');
                            linkElem.classList.add('mt-4');
                            linkElem.classList.add('px-5');
                            linkElem.appendChild(document.createTextNode('Download a PDF version of this page in '));
                            
                            for (let i=0; i<TRANSLATED_FILES.length; i++) {
                                let downloadLink = document.createElement('a');
                                downloadLink.textContent = TRANSLATED_FILES[i][0];
                                downloadLink.href = TRANSLATED_FILES[i][1];
                                linkElem.appendChild(downloadLink);

                                if (i != TRANSLATED_FILES.length - 1) {
                                    linkElem.appendChild(document.createTextNode(', '));
                                } else {
                                    linkElem.appendChild(document.createTextNode('.'));
                                }
                            }
                            elem.appendChild(linkElem);
                            // Added the new system map link here
                            var systemMapLink = '<a href="https://www.dropbox.com/s/fy4auwjppt1rugp/22-0986_blt_system_map_47x47.5_DCR.pdf?dl=0">Bus and Rail System Detail Map</a>'
                            var systemMapCopy = 'View the new '+systemMapLink+' (effective Sunday, December 19, 2021).'
                            elem.appendChild(addNewDivContent(systemMapCopy));
                        }
                    } else {
                        // TODO: refactor the hard-coded numbers
                        if (order == 8 ) {
                            let linkWrapper = document.createElement('div');
                            linkWrapper.classList.add('mt-4');
                            linkWrapper.classList.add('px-5');
                            linkWrapper.classList.add('translate');

                            let scheduleLinkP = document.createElement('p');
                            let scheduleLink = document.createElement('a');
                            scheduleLink.classList.add('scheduleLink');
                            // Albert 11/11/21:
                            // be sure to change this to the correct schedule link
                            scheduleLink.href = 'files/schedules/802_TT_09-12-21.pdf';
                            scheduleLink.textContent = 'Download new schedule for A Line (Blue), C Line (Green), E Line (Expo), L Line (Gold)';
                            // no schedule pdf for the lines yet, so commenting out for now
                            // scheduleLinkP.appendChild(scheduleLink);

                            elem.appendChild(contentHelper(val.content + ' ', 'label'));
                            linkWrapper.appendChild(scheduleLinkP);
                            elem.appendChild(linkWrapper);
                        } else {
                            /*
                                11/23/21 - Nina - Take One translation doc modified to ensure the lists of line numbers
                                in the summary section start with a digit and are on their own table rows.
                            */
                            if (val.content.match(/^\d+/g) != null) {
                                elem.appendChild(contentHelper(val.content, 'lines'));
                            } else {
                                elem.appendChild(contentHelper(val.content, 'label'));
                            }
                        }
                    }
                    break;
                case 'details':
                    elem = document.querySelector('#all-details .row');
                    if (order == 0) { // Details section header
                        newElem = document.createElement('h2');
                        newElem.classList.add('my-4');
                        newElem.classList.add('notranslate');
                        newElem.innerHTML = val.content;
                        elem.prepend(newElem);
                    } else { // All the lines
                        newElem = document.createElement('div');
                        newElem.classList.add('py-4');

                        /*
                         * 8/20/21 - Nina
                         *
                         * When the MyBus site launches we don't have all the new schedule PDFs yet.
                         * They are released in batches.  Each line can be in one of the following states
                         * as it relates to its schedule PDF.:
                         * 
                         *   - we don't know if there will be a new schedule PDF for this line
                         *     - result: show no link
                         *   - no new schedule PDF will be released for this line
                         *     - result: link to current schedule for this line 
                         *   - a new schedule PDF exists and we can link to it
                         *   - line is discontinued so there is no new schedule PDF at all
                         * 
                         * NOTE: For lines that are not changing in the shakeup, they may or may not have an updated schedule PDF.
                         */
                        
                        if (val['new-schedule'] != '' && val['new-schedule'] != null ) { 
                            // If new schedule exists, link to it.
                            let scheduleLink = document.createElement('a');
                            scheduleLink.classList.add('scheduleLink');
                            scheduleLink.classList.add('translate');
                            scheduleLink.href = val['new-schedule'];

                            switch (val.line) {
                                case 801:
                                    scheduleLink.textContent = 'Download new schedule for A Line (Blue).';
                                    break;
                                case 803:
                                    scheduleLink.textContent = 'Download new schedule for C Line (Green).';
                                    break;
                                case 804:
                                    scheduleLink.textContent = 'Download new schedule for L Line (Gold).';
                                    break;
                                case 806:
                                    scheduleLink.textContent = 'Download new schedule for E Line (Expo).';
                                    break;
                                case 901:
                                    scheduleLink.textContent = 'Download new schedule for 901 / G Line (Orange).';
                                    break;
                                case 910:
                                case 950:
                                    scheduleLink.textContent = 'Download new schedule for  ' + val.line + ' / J Line (Silver).';
                                    break;
                                default:
                                    scheduleLink.textContent = 'Download new schedule for Line ' + val.line + '.';
                            }

                            if (val.content != '' && val.content != null) {
                                if (val.line != 55) {
                                    newElem.classList.add('notranslate');
                                }
                                newElem.innerHTML = val.content + ' ';
                            } else {
                                switch(LANG) {
                                    case 'es':
                                        newElem.textContent = lineLetterHelper(val.line) + ': ';
                                        break;
                                    case 'hy':
                                        newElem.textContent = lineLetterHelper(val.line) + ' – ';
                                        break;
                                    default:
                                        newElem.textContent = lineLetterHelper(val.line) + ' – ';
                                }                                
                            }
                            newElem.appendChild(scheduleLink);
                            elem.appendChild(newElem);
                        } else if (val['current-schedule'] != '' && val['current-schedule'] != null) { 
                            // Else, if current schedule exists, link to it.
                            let scheduleLink = document.createElement('a');
                            scheduleLink.classList.add('scheduleLink');
                            scheduleLink.href = val['current-schedule'];
                            scheduleLink.textContent = 'Download current schedule for Line ' + val.line + '.';
                            
                            newElem.classList.add('translate');

                            if (val.content != null) {
                                if (parseInt(val.content[0]) == NaN) {
                                    switch(LANG) {
                                        case 'es':
                                            newElem.textContent += lineLetterHelper(val.line) + ': ';
                                            break;
                                        case 'hy':
                                            newElem.textContent += `${val.line} – `;
                                            break;
                                        default:
                                            newElem.textContent = `${val.line} – `;
                                    }
                                    newElem.textContent += `${val.content} No changes that affect schedule. `;
                                } else {
                                    newElem.textContent += `${val.content} No changes that affect schedule. `;
                                }
                            } else {
                                switch(LANG) {
                                    case 'es':
                                        newElem.textContent += lineLetterHelper(val.line) + ': ';
                                        break;
                                    case 'hy':
                                        newElem.textContent += `${val.line} – `;
                                        break;
                                    default:
                                        newElem.textContent = `${val.line} – `;
                                }
                                newElem.textContent += ` No changes that affect schedule. `;
                            }
                            

                            newElem.appendChild(scheduleLink);
                            elem.appendChild(newElem);
                        } else {
                            // Else, no schedule link exists and this should be a discontinued line
                            // 8/20/21 - Before we have all the new schedules, any line not listed in the Take One
                            // will also fall into this bucket. Thus, don't show the row if the content is null.

                            if (val.content != null) {
                                // discontinued lines (no schedule)
                                newElem.classList.add('notranslate');
                                newElem.innerHTML = val.content;
                                elem.appendChild(newElem);
                            }
                        }
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

function addNewDivContent(the_new_content){
    let newElem = document.createElement('div');
    newElem.classList.add('mt-4');
    newElem.classList.add('px-5');                            
    newElem.innerHTML = the_new_content
    return newElem; 
}

function lineLetterHelper(number) {
    switch (number) {
        case 801:
            return 'A Line (Blue)';
        case 803:
            return 'C Line (Green)';
        case 804:
                return 'L Line (Gold)';
        case 806:
            return 'E Line (Expo)';
        case 901:
            return number + ' / G Line (Orange)';
        case 910:
        case 950:
            return number + ' / J Line (Silver)';
        default:
            return number;
    }
}

function contentHelper(content, type) {
    let elem = document.createElement('div');
    elem.classList.add('mt-4');
    elem.classList.add('notranslate');
    elem.innerHTML = content + ' ';

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
