function onLoadHandler() {
    var url  = window.toBeLoad;
    var rect = window.clipRect;
    var webViewInfo = window.webViewInfo;
    var cookie = window.originalCookie;
    $('#title').text(url);
    $('#webView').css({
        width: webViewInfo.width,
        height: webViewInfo.height,
        left: -1 * (rect.left - webViewInfo.scrollLeft),
        top: -1 * (rect.top - webViewInfo.scrollTop)
        // width: (webViewInfo.width + webViewInfo.scrollLeft),
        // height: (webViewInfo.height + webViewInfo.scrollTop),
        // left: -1 * (rect.left + webViewInfo.scrollLeft),
        // top: -1 * (rect.top + webViewInfo.scrollTop)
    }).attr({ src: url });
    $('#webView').get(0).onloadcommit = function(e){
        if (e.isTopLevel) {
            this.executeScript({
                code: "var b = document.body;" +
                    "b.scrollTop = " + webViewInfo.scrollTop + "; " +
                    "b.scrollLeft = " + webViewInfo.scrollLeft + "; " +
                    "window.onscroll = function(){return false};"
            });
        }
    };
}

var timer = false;
$(window).on('resize', function(event) {
    if (timer !== false)  clearTimeout(timer);
    timer = setTimeout(function() {
        var $window = $(window);
        var width   = $window.width();
        var height  = $window.height();
        console.log(['resized', width, height, width/clipRect.width, height/clipRect.height]);
        $('webview').get(0).insertCSS({
            code: "body {-webkit-transform-origin: " + clipRect.left + "px " + clipRect.top + "px;" +
                "-webkit-transform: scale(" + width/clipRect.width + "," + height/clipRect.height + ") }"
        });
    }, 200);
}).on('load', onLoadHandler);