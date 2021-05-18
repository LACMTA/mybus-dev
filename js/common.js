/***** START GOOGLE TRANSLATE *****/

function googleTranslateElementInit() {
    window.tis = new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,es,zh-CN,zh-TW,ko,vi,ja,ru,hy',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
        gaTrack: true,
        gaId: 'UA-10002990-14',
    }, isMobile() ? 'google_translate_element_mobile' : 'google_translate_element_desktop');
}

function styleGT() {
    const googleFrame = document.querySelector('.goog-te-menu-frame');

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
}

function updateLanguageNames() {
    const googleFrame = document.querySelector('.goog-te-menu-frame');

    let langItems = googleFrame.contentDocument.querySelectorAll('.goog-te-menu2-item,.goog-te-menu2-item-selected');
    let langItemsNew = [];

    for (var i = 0; i < langItems.length; i++) {
        let langItem_text = langItems[i].querySelector('.text');
        switch (langItem_text.textContent) {
            case 'Spanish':
                langItem_text.textContent = 'Español (Spanish)';
                langItemsNew[1] = langItems[i];
                break;
            case 'Chinese (Simplified)':
                langItem_text.textContent = '中文 (Chinese Simplified)';
                langItemsNew[3] = langItems[i];
                break;
            case 'Chinese (Traditional)':
                langItem_text.textContent = '中文 (Chinese Traditional)';
                langItemsNew[2] = langItems[i];
                break;
            case 'Korean':
                langItem_text.textContent = '한국어 (Korean)';
                langItemsNew[4] = langItems[i];
                break;
            case 'Vietnamese':
                langItem_text.textContent = 'Tiếng Việt (Vietnamese)';
                langItemsNew[5] = langItems[i];
                break;
            case 'Japanese':
                langItem_text.textContent = '日本語 (Japanese)';
                langItemsNew[6] = langItems[i];
                break;
            case 'Russian':
                langItem_text.textContent = 'русский (Russian)';
                langItemsNew[7] = langItems[i];
                break;
            case 'Armenian':
                langItem_text.textContent = 'Армянский (Armenian)';
                langItemsNew[8] = langItems[i];
                break;
            case 'Select Language':
                langItem_text.textContent = 'English';
                langItemsNew[0] = langItems[i];
                break;
        }
    }

    for (var i = 0; i < langItems.length; i++) {
        langItems[i] = langItemsNew[i];
    }
}

function isMobile() {
    return window.innerWidth < 767; // Media breakpoint is at 768px wide.
}

window.onload = function () {
    const googleFrame = document.querySelector('.goog-te-menu-frame');
    const navTranslate = document.querySelector('.nav-translate');
    styleGT();

    setInterval(function () {
        if (googleFrame.offsetWidth != 0 && googleFrame.offsetHeight != 0)  {
            navTranslate.classList.add('nav-translate--is-open');
        } else {
            navTranslate.classList.remove('nav-translate--is-open');
        }
    }, 1);

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

    function hideIframeOnClick() {
        setTimeout(function () {
            googleFrame.style.display = 'none';
        }, 100);
    }

    setInterval(function () {
        updateLanguageNames();

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