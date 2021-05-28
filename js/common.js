/***** START GOOGLE TRANSLATE *****/

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

function styleGT() {
    let gframe = setInterval(function() {
        const googleFrame = document.querySelector('.goog-te-menu-frame');

        if (googleFrame != null) {
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

function updateLanguageNames() {
    const googleFrame = document.querySelector('.goog-te-menu-frame');
    if (googleFrame != null) {
        let langItemsParent = googleFrame.contentDocument.querySelector('td');
        let newLangItemsParent = document.createElement('td');
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

        // let langItems = googleFrame.contentDocument.querySelectorAll('.goog-te-menu2-item,.goog-te-menu2-item-selected');
        var langItemsNew = [];

        if (langItemsParent.childNodes[1].querySelector('.text').textContent == languages[1][1]) {
            return;
        }

        languages.forEach(lang => {
            langItemsParent.childNodes.forEach(node => {
                let langItemText = node.querySelector('.text');    
                if (langItemText.textContent == lang[0]) {
                    langItemText.textContent = lang[1];
                    newLangItemsParent.appendChild(node);
                }
            });
        });

        langItemsParent.replaceWith(newLangItemsParent);
    }
}

function isMobile() {
    return window.innerWidth < 767; // Media breakpoint is at 768px wide.
}

window.onload = function () {
    let googleFrame = document.querySelector('.goog-te-menu-frame');
    let navTranslate = document.querySelector('.nav-translate');
    styleGT();

    setInterval(function () {
        if (googleFrame != null && navTranslate != null) {
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

        if (googleFrame != null) {
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