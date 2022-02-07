const QUERYSTRING = window.location.search;
const URLPARAMS = new URLSearchParams(QUERYSTRING);
const LANG = URLPARAMS.get('lang');
const DATA_PATH = 'data/takeones/';
const FREQ_TABLE_PATH = 'data/frequency-table.json';
const SCHEDULES_LIST_PATH = 'data/schedules-list.json';
const FREQ_PERIODS = {
    "weekdays": ["weekdays-peak", "weekdays-midday", "weekdays-evening"],
    "saturdays": ["saturdays-daytime", "saturdays-evening"],
    "sundays": ["sundays-daytime", "sundays-evening"]
};
const ALL_LINES = [2,4,10,14,16,18,20,28,30,33,35,37,38,40,45,48,51,53,55,60,62,66,70,76,78,81,90,92,94,96,102,105,106,108,110,111,115,117,120,125,127,128,130,150,152,154,155,158,161,162,164,165,166,167,169,177,179,180,182,202,204,205,206,207,209,210,211,215,212,217,218,222,224,230,232,233,234,235,236,237,240,242,243,244,246,251,256,258,260,265,266,267,268,287,294,344,460,487,489,501,534,550,577,601,602,603,605,611,617,660,662,665,686,690,720,754,761,854,801,802,803,805,806,804,901,910,950];
const METRO_NET_SCHEDULE_LINKS = {
    18: "https://media.metro.net/documents/ca3c7637-a7f0-4e53-a582-73e114ef91b6.pdf",
    30: "https://cdn.beta.metro.net/wp-content/uploads/2021/09/12010758/030_TT_09-12-21.pdf",
    33: "https://media.metro.net/documents/bdca96d4-90d6-4697-b365-ecda54e9e7b2.pdf",
    35: "https://cdn.beta.metro.net/wp-content/uploads/2021/09/28182814/035-038_TT_09-12-21.pdf",
    38: "https://cdn.beta.metro.net/wp-content/uploads/2021/09/28182814/035-038_TT_09-12-21.pdf",
    40: "https://media.metro.net/documents/c0a74a19-b51c-4057-a516-47eb56b506e7.pdf",
    45: "https://media.metro.net/documents/83dff5b5-a9da-4894-baa4-c7043c370b24.pdf",
    62: "https://cdn.beta.metro.net/wp-content/uploads/2021/09/27234049/062_TT_06-27-21.pdf",
    76: "https://media.metro.net/documents/3eeb3713-24b6-4f2c-a0f9-534e38c6c260.pdf",
    81: "https://media.metro.net/documents/a6923d75-3774-4228-9422-ef46dca2f648.pdf",
    96: "https://media.metro.net/documents/a70bcd86-539c-4ff8-ba22-c32cdd6ad952.pdf",
    102: "https://media.metro.net/documents/75cf3c13-53d6-4c50-aaff-bf280155a2d4.pdf",
    105: "https://media.metro.net/documents/1e1822f1-9571-4f2b-8495-4fcc3dd87814.pdf",
    106: "https://cdn.beta.metro.net/wp-content/uploads/2021/09/28183058/106_TT_09-12-21.pdf",
    117: "https://media.metro.net/documents/766f200e-2380-42c2-beb9-495cef8833f7.pdf",
    120: "https://media.metro.net/documents/abfaa535-3899-45d5-a5f1-b8aa62a0355b.pdf",
    127: "https://media.metro.net/documents/51de6992-4c00-4bd7-bfcf-c1d49b514905.pdf",
    155: "https://media.metro.net/documents/06f556a5-a841-42b7-9593-af0195963c6e.pdf",
    158: "https://media.metro.net/documents/db963f01-82c2-43bd-a72f-49cd4cc8ab1b.pdf",
    161: "https://media.metro.net/documents/5e893070-dfc1-4b01-b318-064e46f70785.pdf",
    162: "https://media.metro.net/documents/661102fc-ff85-4b1d-81f6-0812b3b4b9c5.pdf",
    180: "https://media.metro.net/documents/71b9077d-ec5c-4f92-b1a2-128c273fb681.pdf",
    182: "https://media.metro.net/documents/line-schedules/line-182_1624778567.pdf",
    204: "https://media.metro.net/documents/8297f55e-d1ba-48cf-8c22-85bc762dd133.pdf",
    205: "https://cdn.beta.metro.net/wp-content/uploads/2021/09/27234123/205_TT_06-27-21.pdf",
    210: "https://media.metro.net/documents/8c5902ce-2400-4854-965e-0bce8ad0923a.pdf",
    211: "https://cdn.beta.metro.net/wp-content/uploads/2021/09/12081501/211-215_TT_09-12-21.pdf",
    215: "https://cdn.beta.metro.net/wp-content/uploads/2021/09/12081501/211-215_TT_09-12-21.pdf",
    218: "https://media.metro.net/documents/40b632e0-32c3-4ce9-bfd3-b0942199b71d.pdf",
    224: "https://cdn.beta.metro.net/wp-content/uploads/2021/11/30110939/224_TT_09-12-21.pdf",
    232: "https://media.metro.net/documents/b5694cb1-ae3f-4b46-8440-d29fb03577b7.pdf",
    235: "https://cdn.beta.metro.net/wp-content/uploads/2021/09/12083328/235-236_TT_09-12-21.pdf",
    236: "https://cdn.beta.metro.net/wp-content/uploads/2021/09/12083328/235-236_TT_09-12-21.pdf",
    240: "https://media.metro.net/documents/line-schedules/line-240_1624820005.pdf",
    246: "https://media.metro.net/documents/1a3aa921-bca1-4288-9c56-bff80231e0b5.pdf",
    258: "https://cdn.beta.metro.net/wp-content/uploads/2021/09/27233848/258_TT_09-12-21.pdf",
    265: "https://media.metro.net/documents/05101cf0-69ad-418b-a1dc-91b55f35a1ab.pdf",
    266: "https://media.metro.net/documents/20f9f54a-faa8-4d48-8324-1a61f66f8600.pdf",
    268: "https://media.metro.net/documents/line-schedules/line-268_1530813306.pdf", 
    287: "https://media.metro.net/documents/line-schedules/line-el-monte-station-arcadia-station-via-santa-anita-av_1624051467.pdf",
    344: "https://media.metro.net/documents/244f3ff6-d991-4238-b892-fdb03e161523.pdf",
    460: "https://cdn.beta.metro.net/wp-content/uploads/2021/09/27234213/460_TT_06-27-21.pdf",
    487: "https://cdn.beta.metro.net/wp-content/uploads/2021/09/12084341/487-489_TT_09-12-21.pdf",
    489: "https://cdn.beta.metro.net/wp-content/uploads/2021/09/12084341/487-489_TT_09-12-21.pdf",
    534: "https://media.metro.net/documents/5948bbb4-34ac-4e8d-8a37-455502df5e2d.pdf",
    577: "https://media.metro.net/documents/b15314d4-0937-4635-874b-0b5ce4adb493.pdf",
    605: "https://media.metro.net/documents/b7b84aeb-1bdf-401e-83e0-6f626840d732.pdf",
    611: "https://cdn.beta.metro.net/wp-content/uploads/2021/09/27234312/611_TT_12_13_20.pdf",
    662: "https://media.metro.net/documents/line-schedules/line-662_1624051798.pdf",
    665: "https://media.metro.net/documents/d09b0dcb-03a7-4ad8-9053-2aea0dd7f121.pdf",
    686: "https://media.metro.net/documents/e65ea2e0-9c12-4b14-8c89-afbf6c6f9974.pdf",
    754: "https://media.metro.net/documents/f6a4e949-55e9-46a6-a4e1-b85707ab4cc2.pdf",
    802: "https://media.metro.net/documents/b4f1f223-c6b4-4b6e-bd18-648dbca1e7e9.pdf", 
    805: "https://media.metro.net/documents/b4f1f223-c6b4-4b6e-bd18-648dbca1e7e9.pdf"
}

$.getJSON(FREQ_TABLE_PATH, loadFrequencyTable);
$.getJSON(SCHEDULES_LIST_PATH, loadSchedulesList);

function loadSchedulesList(data) {
    let schedules_table_bus = document.querySelector('#schedulesAccordionBus tbody');
    let schedules_table_rail = document.querySelector('#schedulesAccordionRail tbody');
    let current_schedules = data.current_schedules;
    let new_schedules = data.new_schedules;

    for (let i in ALL_LINES) {
        let line = ALL_LINES[i];
        let row = document.createElement('tr');
        let line_cell = document.createElement('th');
        line_cell.innerHTML = lineLetterHelper(line);
        line_cell.setAttribute('scope', 'row');
        line_cell.classList.add('line-' + line);
        row.appendChild(line_cell);

        let current_cell = document.createElement('td');
        let current_cell_link = document.createElement('a');
        current_cell_link.innerText = 'Current Schedule for the ' + lineLetterHelper(line);

        if (line in current_schedules) {
            current_cell_link.setAttribute('href', current_schedules[line]);
        } else {
            current_cell_link.setAttribute('href', METRO_NET_SCHEDULE_LINKS[line]);
        }
        current_cell.appendChild(current_cell_link);
        row.appendChild(current_cell);

        let new_cell = document.createElement('td');
        if (line in new_schedules) {
            let new_cell_link = document.createElement('a');
            new_cell_link.setAttribute('href', new_schedules[line]);
            new_cell_link.innerText = 'New Schedule for the ' + lineLetterHelper(line);
            new_cell.appendChild(new_cell_link);
        }
        row.appendChild(new_cell);

        if (line > 800 && line < 900) {
            schedules_table_rail.appendChild(row);
        } else {
            schedules_table_bus.appendChild(row);
        }
    }
}

function loadFrequencyTable(data) {
    let named_lines = {
        801: 'A Line (Blue)',
        802: 'B Line (Red)',
        803: 'C Line (Green)',
        804: 'L Line (Gold)',
        805: 'D Line (Purple)',
        806: 'E Line (Expo)',
        854: 'L Line (Gold) Shuttle',
        901: 'G Line (Orange)',
        910: '910 / J Line (Silver)',
        950: '950 / J Line (Silver)',
    };
    let day_of_week = {
        'weekday': '#weekdays',
        'saturday': '#saturdays',
        'sunday': '#sundays'
    };    
    let line_type = {
        'bus': '.busLinesPanel',
        'rail': '.railLinesPanel'
    };
    let table_selector = 'table tbody';

    let weekdays_tab = document.querySelector(day_of_week.weekday);
    let saturdays_tab = document.querySelector(day_of_week.saturday);
    let sundays_tab = document.querySelector(day_of_week.sunday);

    for (let i = 0; i < data.length; i++) {
        let weekday_row = document.createElement('tr');
        
        let line_number = document.createElement('th');
        if (data[i].line in named_lines) {
            line_number.innerHTML = named_lines[data[i].line];
        } else {
            line_number.innerHTML = data[i].line;
        }
        line_number.setAttribute('scope', 'row');
        weekday_row.appendChild(line_number);

        let saturday_row = weekday_row.cloneNode(true);
        let sunday_row = weekday_row.cloneNode(true);

        let weekday_peak = document.createElement('td');
        weekday_peak.innerHTML = data[i]["weekday-peak"];
        let weekday_mid = document.createElement('td');
        weekday_mid.innerHTML = data[i]["weekday-midday"];
        let weekday_evening = document.createElement('td');
        weekday_evening.innerHTML = data[i]["weekday-evening"];

        weekday_row.appendChild(weekday_peak);
        weekday_row.appendChild(weekday_mid);
        weekday_row.appendChild(weekday_peak.cloneNode(true));
        weekday_row.appendChild(weekday_evening);

        let saturdays_daytime = document.createElement('td');
        saturdays_daytime.innerHTML = data[i]["saturday-daytime"];
        let saturdays_evening = document.createElement('td');
        saturdays_evening.innerHTML = data[i]["saturday-evening"];
        let sundays_daytime = document.createElement('td');
        sundays_daytime.innerHTML = data[i]["sunday-daytime"];
        let sundays_evening = document.createElement('td');
        sundays_evening.innerHTML = data[i]["sunday-evening"];

        saturday_row.appendChild(saturdays_daytime);
        saturday_row.appendChild(saturdays_evening);
        sunday_row.appendChild(sundays_daytime);
        sunday_row.appendChild(sundays_evening);    

        // Find appropriate table to append to
        if (data[i].line > 800 && data[i].line < 900) {
            weekdays_tab.querySelector(line_type.rail + ' '  + table_selector).appendChild(weekday_row);
            saturdays_tab.querySelector(line_type.rail + ' '  + table_selector).appendChild(saturday_row);
            sundays_tab.querySelector(line_type.rail + ' '  + table_selector).appendChild(sunday_row);
        } else {
            weekdays_tab.querySelector(line_type.bus + ' '  + table_selector).appendChild(weekday_row);
            saturdays_tab.querySelector(line_type.bus + ' '  + table_selector).appendChild(saturday_row);
            sundays_tab.querySelector(line_type.bus + ' '  + table_selector).appendChild(sunday_row);
        }
    }
}



if (LANG == null || LANG == 'undefined' || LANG == '' || LANG == 'en') {
    // $.getJSON(DATA_PATH + 'takeone-en.json', loadContent);

} else {
    // $.getJSON(DATA_PATH + 'takeone-' + LANG + '.json', loadContent);
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
        case 802:
            return 'B Line (Red)';
        case 803:
            return 'C Line (Green)';
        case 804:
            return 'L Line (Gold)';
        case 805:
            return 'D Line (Purple)';
        case 806:
            return 'E Line (Expo)';
        case 854:
            return 'L Line (Gold) Shuttle'
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
