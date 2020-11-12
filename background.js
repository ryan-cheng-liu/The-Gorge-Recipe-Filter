// browser compatibility
var runningOnChrome = typeof chrome != 'undefined' && typeof browser == 'undefined';
var runningOnFirefox = typeof chrome != 'undefined' && typeof browser != 'undefined';
// 
var browser;
if (runningOnChrome) browser = chrome;

// background code
browser.browserAction.onClicked.addListener(tab => {
	browser.tabs.executeScript(null, { file: "jquery-2.2.4.min.js" }, () => {
		browser.tabs.executeScript(null, { file: "inject.js" });
	});
});

browser.runtime.onInstalled.addListener(details => {
  browser.runtime.openOptionsPage();
});