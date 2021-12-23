const QUERYSTRING = window.location.search;
const URLPARAMS = new URLSearchParams(QUERYSTRING);
const LANG = URLPARAMS.get('lang');
const TAKEONE_PATH = 'data/takeones/';
const LINE_CHANGES_PATH = 'data/line-changes.json';

$.getJSON(LINE_CHANGES_PATH, loadChangeCategories);

const SCHEDULE_LINK_TRANLSATED = {
    'en': 'Download new schedule for Line ',
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

let line_change_categories = {
    "route": {
        "copy": "Route Changes",
        "lines": []
    },
    "schedule": {
        "copy": "Schedule Changes",
        "lines": []
    },
    "stop": {
        "copy": "Stop Cancellations",
        "lines": []
    },
    "other": {
        "copy": "Other Changes",
        "lines": []
    },
    "none": {
        "copy": "No Changes",
        "lines": []
    }
};

let takeoneContent = {
    'header': [],
    'summary': [],
    'details': [],
    'end': []
};

function loadChangeCategories(data) {
    $.each(data, function (key, val) {
        switch (val['change-category']) {
            case 'route':
                line_change_categories.route.lines.push(val['line-number']);
                break;
            case 'other':
                line_change_categories.other.lines.push(val['line-number']);
                break;
            case 'schedule':
                line_change_categories.schedule.lines.push(val['line-number']);
                break;
            case 'stop':
                line_change_categories.stop.lines.push(val['line-number']);
                break;
            case 'none':
                line_change_categories.none.lines.push(val['line-number']);
                break;
        }
    });

    if (LANG == null || LANG == 'undefined' || LANG == '' || LANG == 'en') {
        $.getJSON(TAKEONE_PATH + 'takeone-en.json', loadPageContent);

    } else {
        $.getJSON(TAKEONE_PATH + 'takeone-' + LANG + '.json', loadPageContent);
    }
}

function loadPageContent(data) {
    parseTakeoneContent(data);
    loadHeader(takeoneContent.header);
    loadSummary(takeoneContent.summary);
    loadDetails(takeoneContent.details);
}

function parseTakeoneContent(data) {
    $.each(data, function (key, val) {
        switch (val.section) {
            case 'header':
                takeoneContent.header.push(val);
                break;
            case 'summary':
                takeoneContent.summary.push(val);
                break;
            case 'details':
                takeoneContent.details.push(val);
                break;
            case 'end':
                takeoneContent.end.push(val);
                break;
        }
    });
}

function loadHeader(data) {
    for (let row of data) {
        let elem = document.querySelector('#all-header .row');
        let newElem = '';

        if (row.order == 1) {
            newElem = document.createElement('h1');
            newElem.classList.add('my-5');
            newElem.classList.add('notranslate');
            newElem.innerHTML = row.content;
            elem.appendChild(newElem);
        }
    }
}

function loadSummary(data) {
    let summaryContentCombined = '';

    for (let row of data) {
        let elem = document.querySelector('#all-summary .row');

        if (row.order < 1) {
            summaryContentCombined += row.content + ' ';

            if (row.order == 0) {
                elem.appendChild(contentHelper(summaryContentCombined, 'label'));

                // Insert the links to the PDFs
                let linkElem = document.createElement('div');
                linkElem.classList.add('mt-4');
                linkElem.classList.add('px-5');
                linkElem.appendChild(document.createTextNode('Download a PDF version of this page in '));

                for (let i = 0; i < TRANSLATED_FILES.length; i++) {
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
                var systemMapLink = '<a href="https://www.dropbox.com/s/fy4auwjppt1rugp/22-0986_blt_system_map_47x47.5_DCR.pdf?dl=0">Bus and Rail System Detail Map</a>';
                var systemMapCopy = 'View the new ' + systemMapLink + ' (effective Sunday, December 19, 2021).';
                elem.appendChild(addNewDivContent(systemMapCopy));
            }
        } else {
            // TODO: refactor the hard-coded numbers
            if (row.order == 8) {
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

                elem.appendChild(contentHelper(row.content + ' ', 'label'));
                linkWrapper.appendChild(scheduleLinkP);
                elem.appendChild(linkWrapper);
            } else {
                /*
                    11/23/21 - Nina - Take One translation doc modified to ensure the lists of line numbers
                    in the summary section start with a digit and are on their own table rows.
                */
                if (row.content.match(/^\d+/g) != null) {
                    elem.appendChild(contentHelper(row.content, 'lines'));
                } else {
                    elem.appendChild(contentHelper(row.content, 'label'));
                }
            }
        }
    }
}

function loadDetails(data) {
    let routeSection = [];
    let scheduleSection = [];
    let otherSection = [];
    let stopSection = [];
    let noneSection = [];

    for (let row of data) {
        if (line_change_categories.route.lines.includes(row.line)) {
            routeSection.push(row);
        } else if (line_change_categories.schedule.lines.includes(row.line)) {
            scheduleSection.push(row);
        } else if (line_change_categories.stop.lines.includes(row.line)) {
            stopSection.push(row);
        } else if (line_change_categories.other.lines.includes(row.line)) {
            otherSection.push(row);
        } else if (line_change_categories.none.lines.includes(row.line)) {
            noneSection.push(row);
        }
    }

    if (routeSection.length > 0) {
        loadSection(routeSection, line_change_categories.route.copy);
    }

    if (scheduleSection.length > 0) {
        loadSection(scheduleSection, line_change_categories.schedule.copy);
    }

    if (stopSection.length > 0) {
        loadSection(stopSection, line_change_categories.stop.copy);
    }

    if (otherSection.length > 0) {
        loadSection(otherSection, line_change_categories.other.copy);
    }

    if (noneSection.length > 0) {
        loadSection(noneSection, line_change_categories.none.copy);
    }

    let elem = document.querySelector('#all-details .row');
        let newElem = '';
        // if (row.order == 0) { // Details section header
        //     newElem = document.createElement('h2');
        //     newElem.classList.add('my-4');
        //     newElem.classList.add('notranslate');
        //     newElem.innerHTML = row.content;
        //     elem.prepend(newElem);
        // } else { // All the lines
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

        // }
    // }
}

function loadSection(data, category) {
    let elem = document.querySelector('#all-details .row');

    let newHeader = document.createElement('h2');
    newHeader.classList.add('my-4');
    newHeader.innerHTML = category;

    let newAccordion = document.createElement('div');
    newAccordion.classList.add('accordion', 'mb-4');

    elem.appendChild(newHeader);
    
    for (let row of data) {
        newAccordion.appendChild(lineAccordionHelper(row));
    }

    elem.appendChild(newAccordion);
}

function lineAccordionHelper(data) {
    // // If new schedule exists, link to it.
    // if (data['new-schedule'] != '' && data['new-schedule'] != null) {
    //     let scheduleLink = document.createElement('a');
    //     scheduleLink.classList.add('scheduleLink', 'translate');
    //     scheduleLink.href = data['new-schedule'];

    //     switch (data.line) {
    //         case 801:
    //             scheduleLink.textContent = 'Download new schedule for A Line (Blue).';
    //             break;
    //         case 803:
    //             scheduleLink.textContent = 'Download new schedule for C Line (Green).';
    //             break;
    //         case 804:
    //             scheduleLink.textContent = 'Download new schedule for L Line (Gold).';
    //             break;
    //         case 806:
    //             scheduleLink.textContent = 'Download new schedule for E Line (Expo).';
    //             break;
    //         case 901:
    //             scheduleLink.textContent = 'Download new schedule for 901 / G Line (Orange).';
    //             break;
    //         case 910:
    //         case 950:
    //             scheduleLink.textContent = 'Download new schedule for  ' + data.line + ' / J Line (Silver).';
    //             break;
    //         default:
    //             scheduleLink.textContent = 'Download new schedule for Line ' + data.line + '.';
    //     }

    //     if (data.content != '' && data.content != null) {
    //         if (data.line != 55) {
    //             newElem.classList.add('notranslate');
    //         }
    //         newElem.innerHTML = data.content + ' ';
    //     } else {
    //         switch (LANG) {
    //             case 'es':
    //                 newElem.textContent = lineLetterHelper(data.line) + ': ';
    //                 break;
    //             case 'hy':
    //                 newElem.textContent = lineLetterHelper(data.line) + ' – ';
    //                 break;
    //             default:
    //                 newElem.textContent = lineLetterHelper(data.line) + ' – ';
    //         }
    //     }
    //     newElem.appendChild(scheduleLink);
    //     elem.appendChild(newElem);
    // } else if (data['current-schedule'] != '' && data['current-schedule'] != null) {
    //     // Else, if current schedule exists, link to it.
    //     let scheduleLink = document.createElement('a');
    //     scheduleLink.classList.add('scheduleLink');
    //     scheduleLink.href = data['current-schedule'];
    //     scheduleLink.textContent = 'Download current schedule for Line ' + data.line + '.';

    //     newElem.classList.add('translate');

    //     if (data.content != null) {
    //         if (parseInt(data.content[0]) == NaN) {
    //             switch (LANG) {
    //                 case 'es':
    //                     newElem.textContent += lineLetterHelper(data.line) + ': ';
    //                     break;
    //                 case 'hy':
    //                     newElem.textContent += `${data.line} – `;
    //                     break;
    //                 default:
    //                     newElem.textContent = `${data.line} – `;
    //             }
    //             newElem.textContent += `${data.content} No changes that affect schedule. `;
    //         } else {
    //             newElem.textContent += `${data.content} No changes that affect schedule. `;
    //         }
    //     } else {
    //         switch (LANG) {
    //             case 'es':
    //                 newElem.textContent += lineLetterHelper(data.line) + ': ';
    //                 break;
    //             case 'hy':
    //                 newElem.textContent += `${data.line} – `;
    //                 break;
    //             default:
    //                 newElem.textContent = `${data.line} – `;
    //         }
    //         newElem.textContent += ` No changes that affect schedule. `;
    //     }


    //     newElem.appendChild(scheduleLink);
    //     elem.appendChild(newElem);
    // } else {
    //     // Else, no schedule link exists and this should be a discontinued line
    //     // 8/20/21 - Before we have all the new schedules, any line not listed in the Take One
    //     // will also fall into this bucket. Thus, don't show the data if the content is null.

    //     if (data.content != null) {
    //         // discontinued lines (no schedule)
    //         newElem.classList.add('notranslate');
    //         newElem.innerHTML = data.content;
    //         elem.appendChild(newElem);
    //     }
    // }


    let accordionItem = document.createElement('div');
    accordionItem.classList.add('accordion-item');
    accordionItem.innerHTML = 
        '<h2 class="accordion-header" id="accordion-header-' + data.line + '">' +
        '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-panel-' + data.line + '" ' + 'aria-expanded="false" aria-controls=accordion-panel-' + data.line + '">' +
        '<span class="line-number">' + data.line + '</span>' +
        '</button>' +
        '</h2>' +
        '<div id="accordion-panel-' + data.line + '" class="accordion-collapse collapse" aria-labelledby="accordion-header-' + data.line + '">' +
        '<div class="accordion-body">' +
        data.content +
        '</div>' +
        '</div>';
    
    return accordionItem;
}


function loadEnd(data) {
    for (let row of data) {
        let elem = document.querySelector('#all-end .row');
        elem.insertBefore(contentHelper(val.content, 'label'), elem.firstChild);
    }
}

function loadContent(data) {
    let summaryContentCombined = '';

    $.each(data,
        function (key, val) {
            let elem = '';
            let newElem = '';

            let section = val.section;
            let order = val.order;


            // TODO: fix this in the data
            // if (section == 'summary' && order == 6) {
            //     section = 'details';
            //     order = 0;
            // }

            switch (section) {
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

                            for (let i = 0; i < TRANSLATED_FILES.length; i++) {
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
                            var systemMapLink = '<a href="https://www.dropbox.com/s/fy4auwjppt1rugp/22-0986_blt_system_map_47x47.5_DCR.pdf?dl=0">Bus and Rail System Detail Map</a>';
                            var systemMapCopy = 'View the new ' + systemMapLink + ' (effective Sunday, December 19, 2021).';
                            elem.appendChild(addNewDivContent(systemMapCopy));
                        }
                    } else {
                        // TODO: refactor the hard-coded numbers
                        if (order == 8) {
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

                        if (val['new-schedule'] != '' && val['new-schedule'] != null) {
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
                                switch (LANG) {
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
                                    switch (LANG) {
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
                                switch (LANG) {
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

function addNewDivContent(the_new_content) {
    let newElem = document.createElement('div');
    newElem.classList.add('mt-4');
    newElem.classList.add('px-5');
    newElem.innerHTML = the_new_content;
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

    switch (type) {
        case 'label':
            elem.classList.add('fw-bold');
            break;
        case 'lines':
            elem.classList.add('px-5');
            break;
    }

    return elem;
}
