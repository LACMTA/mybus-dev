/***** START GOOGLE TRANSLATE *****/

window.onload = function () {
    // Loads 2nd?
    let googleFrame = document.querySelector('.goog-te-menu-frame');
    let navTranslate = document.querySelector('.nav-translate');
    styleGT();

    // Keep checking that the language selector menu exists
    setInterval(function () {
        // let googleFrame = document.querySelector('.goog-te-menu-frame');
        // let navTranslate = document.querySelector('.nav-translate');

        if (googleFrame != null && navTranslate != null) {
            // Loads 4th? 6th
            if (googleFrame.offsetWidth != 0 && googleFrame.offsetHeight != 0)  {
                navTranslate.classList.add('nav-translate--is-open');
            } else {
                navTranslate.classList.remove('nav-translate--is-open');
            }
        } else {
            googleFrame = document.querySelector('.goog-te-menu-frame');
            navTranslate = document.querySelector('.nav-translate');
        }
    }, 1);

    if (googleFrame != null && navTranslate != null) {
        // Loads 3rd?
        navTranslate.addEventListener('click', (e) => {
            if (googleFrame.offsetWidth != 0 && googleFrame.offsetHeight != 0) {
                googleFrame.style.display = 'none';
                if (!navTranslate.classList.contains('nav-translate--is-open')) {
                    googleFrame.style.display = '';
                }
            }
            e.stopImmediatePropagation();
        });

        window.addEventListener('click', (e) => {
            googleFrame.style.display = 'none';
        });
    }

    function hideIframeOnClick() {
        setTimeout(function () {
            googleFrame.style.display = 'none';
        }, 100);
    }

    setInterval(function () {
        updateLanguageNames();

        if (googleFrame != null && googleFrame.contentDocument.querySelector('.goog-te-menu2-item-selected') != null) {
            const selected = googleFrame.contentDocument.querySelector('.goog-te-menu2-item-selected');
            const allItems = googleFrame.contentDocument.querySelectorAll('.goog-te-menu2-item');

            selected.removeEventListener('click', hideIframeOnClick);
            selected.removeEventListener('touch', hideIframeOnClick);
            selected.addEventListener('click', hideIframeOnClick);
            selected.addEventListener('touch', hideIframeOnClick);

            for (var i = 0; i < allItems.length; i++) {
                allItems[i].removeEventListener('click', hideIframeOnClick);
                allItems[i].removeEventListener('touch', hideIframeOnClick);
                allItems[i].addEventListener('click', hideIframeOnClick);
                allItems[i].addEventListener('touch', hideIframeOnClick);
            }
        }
    }, 1000);
};

// Google Translate Widget callback function
// Loads 1st?
function googleTranslateElementInit() {
    window.tis = new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,es,zh-TW,ko,vi,ja,ru,hy',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
        gaTrack: true,
        gaId: 'UA-10002990-14',
    }, isMobile() ? 'google_translate_element_mobile' : 'google_translate_element_desktop');
}

// Injects styling into Google Translate Widget iframe:
function styleGT() {
    let gframe = setInterval(function() {
        const googleFrame = document.querySelector('.goog-te-menu-frame');

        if (googleFrame != null) {
            // Loads 5th?
            googleFrame.contentDocument.querySelector('head').insertAdjacentHTML('beforeend', `
                <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400&display=swap" rel="stylesheet">
                <style type="text/css">
                .goog-te-menu2 {
                    background-color: #212529;
                    border: none;
                    overflow: auto;
                    padding:0;
                }
                table,tbody,tr,td{
                    display: block;
                }
                a.goog-te-menu2-item {
                    font-family: 'Open Sans', helvetica, arial, sans-serif !important;
                }
                .goog-te-menu2-item div,
                .goog-te-menu2-item:link div,
                .goog-te-menu2-item:visited div,
                .goog-te-menu2-item:active div,
                .goog-te-menu2-item-selected div,
                .goog-te-menu2-item-selected:link div,
                .goog-te-menu2-item-selected:visited div,
                .goog-te-menu2-item-selected:active div{
                    background: transparent;
                    font-size: 16px;
                    letter-spacing: .35px;
                    line-height: 1.75;
                    color: #DCDCDC;
                    padding: 16px;
                    border-bottom: 1px solid #545454;
                }
                .goog-te-menu2-item:hover div{
                    color: #ECECEC;
                    background: #555;
                }
                </style>`
            );
        
            if (isMobile()) {
                googleFrame.contentDocument.querySelector('head').insertAdjacentHTML('beforeend', `
                    <style type="text/css">
                    .goog-te-menu2 {
                        width: 100% !important;
                    }
                    </style>`);
            } else {
                googleFrame.contentDocument.querySelector('head').insertAdjacentHTML('beforeend', `
                <style type="text/css">
                .goog-te-menu2 {
                    width: 225px !important;
                }
                </style>`);
            }

            clearInterval(gframe);
        }
    }, 1000);
}

// Update Language Names and Reorder them in the selection menu
function updateLanguageNames() {
    const googleFrame = document.querySelector('.goog-te-menu-frame');
    if (googleFrame != null && googleFrame.contentDocument.querySelector('td') != null) {
        // let langItemsParent = googleFrame.contentDocument.querySelector('td');
        // let newLangItemsParent = document.createElement('td');
        // let languages = [
        //     ['Select Language', 'English'],
        //     ['Spanish', 'Español (Spanish)'], 
        //     ['Chinese (Traditional)', '中文 (Chinese Traditional)'], 
        //     ['Korean', '한국어 (Korean)'],
        //     ['Vietnamese', 'Tiếng Việt (Vietnamese)'],
        //     ['Japanese', '日本語 (Japanese)'],
        //     ['Russian', 'русский (Russian)'],
        //     ['Armenian', 'Армянский (Armenian)']
        // ];

        // // let langItems = googleFrame.contentDocument.querySelectorAll('.goog-te-menu2-item,.goog-te-menu2-item-selected');
        // //var langItemsNew = [];

        // if (langItemsParent.childNodes[1].querySelector('.text').textContent.includes(languages[1][1])) {
        //     return;
        // }

        // languages.forEach(lang => {
        //     langItemsParent.childNodes.forEach(node => {
        //         let langItemText = node.querySelector('.text');    
        //         if (langItemText.textContent.includes(lang[0]) || langItemText.textContent.includes(lang[1])) {
        //             langItemText.textContent = lang[1];
        //             newLangItemsParent.appendChild(node.cloneNode(true));
        //         }
        //     });
        // });

        // langItemsParent.replaceWith(newLangItemsParent);

        let originalList = googleFrame.contentDocument.querySelector('td');
        let newList = [{}, {}, {}, {}, {}, {}, {}, {}];
        let languages = [
            ['Select Language', 'English'],
            ['Spanish', 'Español (Spanish)'], 
            ['Chinese (Traditional)', '中文 (Chinese Traditional)'], 
            ['Korean', '한국어 (Korean)'],
            ['Vietnamese', 'Tiếng Việt (Vietnamese)'],
            ['Japanese', '日本語 (Japanese)'],
            ['Russian', 'русский (Russian)'],
            ['Armenian', 'Армянский (Armenian)']
        ];

        for (let i=0; i<originalList.childNodes.length; i++) {
            loop_inner:
            for (let j=0; j<languages.length; j++) {
                if (originalList.childNodes[i].querySelector('.text').textContent == 'English') {
                    originalList.childNodes[i].querySelector('div').addEventListener('click', saveLanguageOnClick);
                    break loop_inner;
                } else if (originalList.childNodes[i].querySelector('.text').textContent.includes(languages[j][0])) {
                    originalList.childNodes[i].querySelector('.text').textContent = languages[j][1];
                    originalList.childNodes[i].querySelector('div').addEventListener('click', saveLanguageOnClick);
                    break loop_inner;
                }
            }
        }
        // if (originalList.childNodes[1].querySelector('.text').textContent.includes(languages[1][1])) {
        //     return;
        // }

        // while (languagesNotInOrder(languages, Array.from(originalList.childNodes))) {
        //     for (let i=0; i<languages.length; i++) {
        //         for (let j=0; j<originalList.length; j++) {
        //             let itemText = originalList[j].querySelector('.text').textContent;
        //             if (itemText.includes(languages[i][0]) || itemText.includes(languages[i][1])) {
        //                 originalList[j].querySelector('.text').textContent = languages[i][1];
        //                 originalList.appendChild(originalList[j]);
        //             }
        //         }
        //     }
        // }
    }
}

function saveLanguageOnClick(event) {
    let lang = this.parentNode.value;
    if (window.location.href.indexOf('all-changes.html') > 0) {
        window.location = 'all-changes.html?lang=' + lang;
    }
}

function languagesNotInOrder(target, originalList) {
    let node = originalList[0];
    let nodeText = node.querySelector('.text').textContent;

    if (target.length == 1) {
        return !nodeText.includes(target[0][0]) && !nodeText.includes(target[0][1]);
    } else if (!nodeText.includes(target[0][0]) && !nodeText.includes(target[0][1])) {
        return true;
    } else {
        return languagesNotInOrder(target.slice(1), originalList.slice(1));
    }
}

function isMobile() {
    return window.innerWidth < 767; // Media breakpoint is at 768px wide.
}

/***** END GOOGLE TRANSLATE *****/


/****** START FOOTER ******/
document.querySelector('a.l-footer--top').addEventListener("click", (e) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.querySelectorAll('h4.js-footer-linkset-toggle').forEach((section) => {
    section.addEventListener("click", (e) => {
        if (e.currentTarget.nextElementSibling.style.display == 'none') {
            e.currentTarget.nextElementSibling.style.display = 'block';
        } else {
            e.currentTarget.nextElementSibling.style.display = 'none';
        }
    });
});
/****** END FOOTER ******/