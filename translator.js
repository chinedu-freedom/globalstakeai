// translator.js
const googleLangMap = {
  // ShortCodes from index.html
  'EN': 'en', 'ES': 'es', 'FR': 'fr', 'DE': 'de', 'IT': 'it', 'PT': 'pt',
  'CN': 'zh-CN', 'JP': 'ja', 'KR': 'ko', 'RU': 'ru', 'IN': 'hi', 'SA': 'ar',
  'TR': 'tr', 'NL': 'nl', 'ID': 'id', 'VN': 'vi', 'TH': 'th', 'GR': 'el',
  'SE': 'sv', 'PL': 'pl',
  // Full names from Settings.html
  'English': 'en', 'Español': 'es', 'Français': 'fr', 'Deutsch': 'de', 'Italiano': 'it', 'Português': 'pt',
  '中文': 'zh-CN', '日本語': 'ja', '한국어': 'ko', 'Русский': 'ru', 'हिन्दी': 'hi', 'العربية': 'ar',
  'Türkçe': 'tr', 'Nederlands': 'nl', 'Bahasa Indonesia': 'id', 'Tiếng Việt': 'vi', 'ไทย': 'th', 'Ελληνικά': 'el',
  'Svenska': 'sv', 'Polski': 'pl'
};

const reverseMapShort = {
  'en':'EN', 'es':'ES', 'fr':'FR', 'de':'DE', 'it':'IT', 'pt':'PT',
  'zh-CN':'CN', 'ja':'JP', 'ko':'KR', 'ru':'RU', 'hi':'IN', 'ar':'SA',
  'tr':'TR', 'nl':'NL', 'id':'ID', 'vi':'VN', 'th':'TH', 'el':'GR',
  'sv':'SE', 'pl':'PL'
};

const reverseMapFull = {
  'en':'English', 'es':'Español', 'fr':'Français', 'de':'Deutsch',
  'it':'Italiano', 'pt':'Português', 'zh-CN':'中文', 'ja':'日本語',
  'ko':'한국어', 'ru':'Русский', 'hi':'हिन्दी', 'ar':'العربية',
  'tr':'Türkçe', 'nl':'Nederlands', 'id':'Bahasa Indonesia',
  'vi':'Tiếng Việt', 'th':'ไทย', 'el':'Ελληνικά', 'sv':'Svenska', 'pl':'Polski'
};

function doGTranslate() {
    // Hide the google translate toolbar
    const style = document.createElement('style');
    style.innerHTML = `
        .goog-te-banner-frame.skiptranslate { display: none !important; }
        body { top: 0px !important; }
        #google_translate_element { display: none !important; }
        .goog-tooltip { display: none !important; }
        .goog-tooltip:hover { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
    `;
    document.head.appendChild(style);

    const div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.display = 'none';
    document.body.appendChild(div);

    window.googleTranslateElementInit = function() {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            autoDisplay: false
        }, 'google_translate_element');
    };

    const script = document.createElement('script');
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.head.appendChild(script);
}

// Function to handle language changes across the site
window.setSiteLanguage = function(identifier, flagUrl) {
    const gCode = googleLangMap[identifier] || 'en';
    
    // Save the generalized gCode plus the latest flag UI specifically
    localStorage.setItem('siteLangGCode', gCode);
    localStorage.setItem('siteLangFlag', flagUrl);

    // Set google translate cookie (translates to gCode)
    document.cookie = "googtrans=/en/" + gCode + "; path=/";
    document.cookie = "googtrans=/en/" + gCode + "; domain=" + window.location.hostname + "; path=/";
    
    // Refresh the page immediately
    window.location.reload();
};

document.addEventListener("DOMContentLoaded", () => {
    // Apply previously saved custom language UI if elements exist
    const gCode = localStorage.getItem('siteLangGCode');
    const savedFlag = localStorage.getItem('siteLangFlag');
    
    if (gCode && savedFlag) {
        // Find custom elements (if on index page)
        const navLangText = document.getElementById('navLangText');
        const navFlag = document.getElementById('navFlag');
        if (navLangText && navFlag) {
            navLangText.innerText = reverseMapShort[gCode] || 'EN';
            navFlag.src = savedFlag;
        }

        // Find custom elements (if on settings page)
        const activeLangText = document.getElementById('activeLangText');
        const activeLangFlag = document.getElementById('activeLangFlag');
        if (activeLangText && activeLangFlag) {
            activeLangText.innerText = reverseMapFull[gCode] || 'English';
            activeLangFlag.src = savedFlag;
        }
    }

    // Initialize google translate logic
    doGTranslate();
});

// inject DarkReader
const drScript = document.createElement('script');
drScript.src = "https://cdn.jsdelivr.net/npm/darkreader@4.9.58/darkreader.min.js";
drScript.onload = () => {
    if (localStorage.getItem('darkMode') === 'enabled') {
        DarkReader.enable({
            brightness: 100,
            contrast: 90,
            sepia: 10
        });
    }
};
document.head.appendChild(drScript);

window.toggleDarkMode = function(enable) {
    if (typeof DarkReader === 'undefined') return;
    if (enable) {
        DarkReader.enable({ brightness: 100, contrast: 90, sepia: 10 });
        localStorage.setItem('darkMode', 'enabled');
    } else {
        DarkReader.disable();
        localStorage.setItem('darkMode', 'disabled');
    }
};
