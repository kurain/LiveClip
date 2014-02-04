chrome.browserAction.onClicked.addListener(function(tab){
    chrome.tabs.executeScript({
	    file: 'clip.js'
	});
})

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    chrome.runtime.sendMessage('npkbmlmjopccapmpipfjcbccbdnhhnpj', message);
});