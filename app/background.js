chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('browser.html', {
        'bounds': {
            'width': 1024,
            'height': 800
        }
    });
});

function createWindow(url, clipRect, windowInfo) {
    console.log(['create',url, clipRect, windowInfo]);
    var windowLeft = windowInfo.left + clipRect.left;
    var windowTop  = windowInfo.top +
        (windowInfo.outerHeight - windowInfo.innerHeight) + clipRect.top;
    console.log([windowLeft,windowTop]);
    chrome.app.window.create(
        'clipView.html',
        {
            frame: "none",
            'bounds': {
                'top':   windowTop,
                'left':  windowLeft,
                'width': clipRect.width,
                'height': clipRect.height
            },
            // resizable: false,
            alwaysOnTop : true
        },
        function(appWindow) {
            appWindow.contentWindow.toBeLoad = url;
            appWindow.contentWindow.webViewInfo = windowInfo;
            appWindow.contentWindow.clipRect = clipRect;
        }
    );
}


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    console.log(message);
    createWindow(message.window.href, message.rect, message.window);
});

chrome.runtime.onMessageExternal.addListener(function(message, sender, sendResponse){
    console.log(message);
    console.log(sender);
    if (sender.id == "ilbmdbiepgjdmhcejflpjgmifoidfmak") {
        createWindow(message.window.href, message.rect, message.window);
    }
});

// chrome.app.window.onBoundsChanged.addListener(function(){
//     var current = chrome.app.window.current();
//     var originalRect = current.contentWindow.clipRect;
//     var bounds  = current.getBounds();
//     console.log([bounds.width,bounds.height,bounds.width/originalRect.width,bounds.height/originalRect.height]);
// });

