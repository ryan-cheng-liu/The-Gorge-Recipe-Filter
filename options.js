var runningOnChrome = typeof chrome != 'undefined' && typeof browser == 'undefined';
var runningOnFirefox = typeof chrome != 'undefined' && typeof browser != 'undefined';
//
var browser = browser || null;
if (runningOnChrome) browser = chrome;

//////////////////////////////////////////////////////////////////////////////

// Options
browser.storage.sync.get(['dishDisplayMode'], data => {
  let dishDisplayMode = data.dishDisplayMode || "dish-display-mode-opacity";
  if (dishDisplayMode == "dish-display-mode-opacity")
    document.querySelector('#dish-display-mode-opacity').checked = true;
  else document.querySelector('#dish-display-mode-visible').checked = true;
  //
  main({ dishDisplayMode });
});

function main(options) {
  let language = options.language;
  let dishDisplayMode = options.dishDisplayMode;
  // translate
  let translateToUserLanguage = text => browser.i18n.getMessage(text);
  let t = translateToUserLanguage;
  for (let e of document.querySelectorAll('[data-translate]')) {
    e.innerHTML = t(e.dataset.translate);
    e.classList.remove('need-translate');
  }
  // dishDisplayMode
  let dishDisplayModeOptions =
    document.querySelectorAll('input[name=dish-display-mode]');
  for (let element of dishDisplayModeOptions) {
    element.addEventListener('change', e => {
      browser.storage.sync.set({ dishDisplayMode: e.target.id });
    });
  }
}
