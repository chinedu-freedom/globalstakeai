// translator.js - Universal Multi-Language Translation System
const googleLangMap = {
  // ShortCodes
  'EN': 'en', 'ES': 'es', 'FR': 'fr', 'DE': 'de', 'IT': 'it', 'PT': 'pt',
  'CN': 'zh-CN', 'JP': 'ja', 'KR': 'ko', 'RU': 'ru', 'AR': 'ar', 'SA': 'ar',
  'IN': 'hi', 'HI': 'hi', 'TR': 'tr', 'NL': 'nl', 'ID': 'id', 'VN': 'vi',
  'VI': 'vi', 'TH': 'th', 'GR': 'el', 'EL': 'el', 'SE': 'sv', 'SV': 'sv',
  'PL': 'pl', 'PH': 'tl', 'TL': 'tl', 'RO': 'ro', 'BD': 'bn', 'BN': 'bn',
  'UA': 'uk', 'UK': 'uk', 'IR': 'fa', 'FA': 'fa', 'MY': 'ms', 'MS': 'ms',
  'CZ': 'cs', 'CS': 'cs', 'HU': 'hu', 'KE': 'sw', 'SW': 'sw', 'IL': 'he', 'HE': 'he',

  // Full names & Native names
  'English': 'en',
  'Español': 'es',
  'Français': 'fr',
  'Deutsch': 'de',
  'Italiano': 'it',
  'Português': 'pt',
  '中文': 'zh-CN',
  '中文 (简体)': 'zh-CN',
  '日本語': 'ja',
  '한국어': 'ko',
  'Русский': 'ru',
  'العربية': 'ar',
  'हिन्दी': 'hi',
  'Türkçe': 'tr',
  'Nederlands': 'nl',
  'Bahasa Indonesia': 'id',
  'Tiếng Việt': 'vi',
  'ไทย': 'th',
  'Ελληνικά': 'el',
  'Svenska': 'sv',
  'Polski': 'pl',
  'Filipino': 'tl',
  'Română': 'ro',
  'বাংলা': 'bn',
  'Українська': 'uk',
  'فارسی': 'fa',
  'Bahasa Melayu': 'ms',
  'Čeština': 'cs',
  'Magyar': 'hu',
  'Kiswahili': 'sw',
  'עברית': 'he',

  // Direct language codes (fallback)
  'en': 'en', 'es': 'es', 'fr': 'fr', 'de': 'de', 'it': 'it', 'pt': 'pt',
  'zh-CN': 'zh-CN', 'ja': 'ja', 'ko': 'ko', 'ru': 'ru', 'ar': 'ar', 'hi': 'hi',
  'tr': 'tr', 'nl': 'nl', 'id': 'id', 'vi': 'vi', 'th': 'th', 'el': 'el',
  'sv': 'sv', 'pl': 'pl', 'tl': 'tl', 'ro': 'ro', 'bn': 'bn', 'uk': 'uk',
  'fa': 'fa', 'ms': 'ms', 'cs': 'cs', 'hu': 'hu', 'sw': 'sw', 'he': 'he'
};

const reverseMapShort = {
  'en': 'EN', 'es': 'ES', 'fr': 'FR', 'de': 'DE', 'it': 'IT', 'pt': 'PT',
  'zh-CN': 'CN', 'ja': 'JP', 'ko': 'KR', 'ru': 'RU', 'ar': 'AR', 'hi': 'IN',
  'tr': 'TR', 'nl': 'NL', 'id': 'ID', 'vi': 'VN', 'th': 'TH', 'el': 'GR',
  'sv': 'SE', 'pl': 'PL', 'tl': 'PH', 'ro': 'RO', 'bn': 'BD', 'uk': 'UA',
  'fa': 'IR', 'ms': 'MY', 'cs': 'CZ', 'hu': 'HU', 'sw': 'KE', 'he': 'IL'
};

const reverseMapFull = {
  'en': 'English', 'es': 'Español', 'fr': 'Français', 'de': 'Deutsch',
  'it': 'Italiano', 'pt': 'Português', 'zh-CN': '中文', 'ja': '日本語',
  'ko': '한국어', 'ru': 'Русский', 'ar': 'العربية', 'hi': 'हिन्दी',
  'tr': 'Türkçe', 'nl': 'Nederlands', 'id': 'Bahasa Indonesia',
  'vi': 'Tiếng Việt', 'th': 'ไทย', 'el': 'Ελληνικά', 'sv': 'Svenska',
  'pl': 'Polski', 'tl': 'Filipino', 'ro': 'Română', 'bn': 'বাংলা',
  'uk': 'Українська', 'fa': 'فارسی', 'ms': 'Bahasa Melayu',
  'cs': 'Čeština', 'hu': 'Magyar', 'sw': 'Kiswahili', 'he': 'עברית'
};

const defaultFlagMap = {
  'en': 'https://flagcdn.com/w20/us.png',
  'es': 'https://flagcdn.com/w20/es.png',
  'fr': 'https://flagcdn.com/w20/fr.png',
  'de': 'https://flagcdn.com/w20/de.png',
  'it': 'https://flagcdn.com/w20/it.png',
  'pt': 'https://flagcdn.com/w20/pt.png',
  'zh-CN': 'https://flagcdn.com/w20/cn.png',
  'ja': 'https://flagcdn.com/w20/jp.png',
  'ko': 'https://flagcdn.com/w20/kr.png',
  'ru': 'https://flagcdn.com/w20/ru.png',
  'ar': 'https://flagcdn.com/w20/sa.png',
  'hi': 'https://flagcdn.com/w20/in.png',
  'tr': 'https://flagcdn.com/w20/tr.png',
  'nl': 'https://flagcdn.com/w20/nl.png',
  'id': 'https://flagcdn.com/w20/id.png',
  'vi': 'https://flagcdn.com/w20/vn.png',
  'th': 'https://flagcdn.com/w20/th.png',
  'el': 'https://flagcdn.com/w20/gr.png',
  'sv': 'https://flagcdn.com/w20/se.png',
  'pl': 'https://flagcdn.com/w20/pl.png',
  'tl': 'https://flagcdn.com/w20/ph.png',
  'ro': 'https://flagcdn.com/w20/ro.png',
  'bn': 'https://flagcdn.com/w20/bd.png',
  'uk': 'https://flagcdn.com/w20/ua.png',
  'fa': 'https://flagcdn.com/w20/ir.png',
  'ms': 'https://flagcdn.com/w20/my.png',
  'cs': 'https://flagcdn.com/w20/cz.png',
  'hu': 'https://flagcdn.com/w20/hu.png',
  'sw': 'https://flagcdn.com/w20/ke.png',
  'he': 'https://flagcdn.com/w20/il.png'
};

function clearGoogTransCookie() {
  const domains = ['', '.' + window.location.hostname, window.location.hostname];
  domains.forEach(d => {
    const domainStr = d ? `; domain=${d}` : '';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${domainStr}`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  });
}

function setGoogTransCookie(gCode) {
  document.cookie = `googtrans=/en/${gCode}; path=/;`;
  document.cookie = `googtrans=/auto/${gCode}; path=/;`;
  if (window.location.hostname && !window.location.hostname.includes('localhost') && !/^[0-9.]+$/.test(window.location.hostname)) {
    document.cookie = `googtrans=/en/${gCode}; domain=${window.location.hostname}; path=/;`;
    document.cookie = `googtrans=/en/${gCode}; domain=.${window.location.hostname}; path=/;`;
    document.cookie = `googtrans=/auto/${gCode}; domain=${window.location.hostname}; path=/;`;
    document.cookie = `googtrans=/auto/${gCode}; domain=.${window.location.hostname}; path=/;`;
  }
}

function doGTranslate() {
  // Inject styles to hide Google's default translation banner and popups
  if (!document.getElementById('goog-gt-custom-styles')) {
    const style = document.createElement('style');
    style.id = 'goog-gt-custom-styles';
    style.innerHTML = `
      .goog-te-banner-frame.skiptranslate,
      .goog-te-banner-frame { display: none !important; }
      body { top: 0px !important; position: static !important; }
      #google_translate_element { display: none !important; }
      .goog-tooltip { display: none !important; }
      .goog-tooltip:hover { display: none !important; }
      .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
      #goog-gt-tt { display: none !important; visibility: hidden !important; }
      .skiptranslate:not(#langDropdown):not(#langDropdown *) { display: none !important; }
    `;
    document.head.appendChild(style);
  }

  let div = document.getElementById('google_translate_element');
  if (!div) {
    div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.display = 'none';
    document.body.appendChild(div);
  }

  window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      autoDisplay: false
    }, 'google_translate_element');

    // Ensure active language is applied if already selected
    const savedCode = localStorage.getItem('siteLangGCode');
    if (savedCode && savedCode !== 'en') {
      let attempts = 0;
      const pollCombo = setInterval(() => {
        attempts++;
        const select = document.querySelector('.goog-te-combo');
        if (select) {
          clearInterval(pollCombo);
          if (select.value !== savedCode) {
            select.value = savedCode;
            select.dispatchEvent(new Event('change'));
          }
        }
        if (attempts > 30) clearInterval(pollCombo);
      }, 150);
    }
  };

  if (!document.getElementById('google-translate-script')) {
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.head.appendChild(script);
  }
}

// Function to handle language changes across the site
window.setSiteLanguage = function(identifier, flagUrl) {
  const gCode = googleLangMap[identifier] || 'en';
  const flag = flagUrl || defaultFlagMap[gCode] || defaultFlagMap['en'];

  // Save selection
  localStorage.setItem('siteLangGCode', gCode);
  localStorage.setItem('siteLangFlag', flag);

  // Set or clear cookies
  if (gCode === 'en') {
    clearGoogTransCookie();
  } else {
    setGoogTransCookie(gCode);
  }

  // Trigger combo live if available
  const select = document.querySelector('.goog-te-combo');
  if (select) {
    select.value = gCode;
    select.dispatchEvent(new Event('change'));
  }

  // Reload page to re-render all dynamic content cleanly
  setTimeout(() => {
    window.location.reload();
  }, 120);
};

document.addEventListener("DOMContentLoaded", () => {
  const gCode = localStorage.getItem('siteLangGCode') || 'en';
  const savedFlag = localStorage.getItem('siteLangFlag') || defaultFlagMap[gCode] || defaultFlagMap['en'];

  // Update navbar language display (e.g. index.html)
  const navLangText = document.getElementById('navLangText');
  const navFlag = document.getElementById('navFlag');
  if (navLangText) {
    navLangText.innerText = reverseMapShort[gCode] || 'EN';
  }
  if (navFlag) {
    navFlag.src = savedFlag;
  }

  // Update settings page active language display (e.g. settings.html)
  const activeLangText = document.getElementById('activeLangText');
  const activeLangFlag = document.getElementById('activeLangFlag');
  if (activeLangText) {
    activeLangText.innerText = reverseMapFull[gCode] || 'English';
  }
  if (activeLangFlag) {
    activeLangFlag.src = savedFlag;
  }

  // Update checkmarks in modal if present
  const activeFullName = reverseMapFull[gCode] || 'English';
  const checkEl = document.getElementById('check-' + activeFullName);
  if (checkEl) {
    document.querySelectorAll('[id^="check-"]').forEach(el => el.classList.add('hidden'));
    checkEl.classList.remove('hidden');
  }

  // Initialize Google Translate
  doGTranslate();
});
