var startPoint = null;
var endPoint   = null;
var mouseDown  = false;
var guestWindow = null;
var currentURL  = null;

function getPoint(e) {
    Point = {};
    Point.x = e.pageX;
    Point.y = e.pageY;
    return Point;
}

function getWindowPos(url, rect) {
    var $webView = $('webView');
    $webView.get(0).executeScript({
        code:"var b = document.body; [b.clientWidth, b.clientHeight, b.scrollTop, b.scrollLeft]"
    },function(r){
        console.log(r[0]);
        var windowInfo = {
            href  : $('webView').attr('src'),
            width : r[0][0],
            height:  r[0][1],
            innerWidth : r[0][0],
            innerHeight:  r[0][1],
            outerWidth : r[0][0],
            outerHeight:  r[0][1],
            scrollTop: r[0][2],
            scrollLeft: r[0][3]
        };
        rect.top = rect.top - $('webView').offset().top;
        var info =  {'window': windowInfo, 'rect': rect};
        chrome.runtime.sendMessage(info);
    });
}

function mouseDownHandler(e) {
    mouseDown = true;
    $('#clipRect').hide();
    startPoint = getPoint(e);
}

function mouseUpHandler(e) {
    mouseDown = false;
    endPoint = getPoint(e);
    var rect = drawRect(startPoint, endPoint);
    if (rect.width > 0) {
        getWindowPos(currentURL, rect);
        $('#clipRect').hide();
    }
}

function mouseMoveHandler(e) {
    if (mouseDown) {
        endPoint = getPoint(e);
        drawRect(startPoint, endPoint);
    }
}

function drawRect(as, ae){
    var s = {
        x :  as.x < ae.x ? as.x : ae.x,
        y :  as.y < ae.y ? as.y : ae.y
    };
    var e = {
        x :  as.x > ae.x ? as.x : ae.x,
        y :  as.y > ae.y ? as.y : ae.y
    };
    var width  = e.x - s.x;
    var height = e.y - s.y;
    var rect = {
        left: s.x,
        top: s.y,
        width: width,
        height: height
    };
    $('#clipRect').css(rect).show();
    return rect;
}

function setURL(e) {
    if (e.isTopLevel) {
        currentURL = e.url;
        $('#text-url').val(currentURL);
    }
}

window.onmousedown = mouseDownHandler;
window.onmouseup   = mouseUpHandler;
window.onmousemove = mouseMoveHandler;

$(function(){
    $('webView').get(0).onloadcommit = setURL;

    $('webView').get(0).addEventListener('permissionrequest', function(e) {
        if (e.permission === 'loadplugin') {
            e.request.allow();
        }
    });

    $('#text-url').on('keydown', function ( event ){
        var url = $('#text-url').val();
	    if( url && url.length > 0 && event.which === 13 ){
            $('webView').attr({src : url});
	    }
    });
});
