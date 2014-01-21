var startPoint = null;
var endPoint   = null;
var mouseDown  = false;

function collectInformation() {
    var windowInfo = {
        top    : window.screenTop,
        left   : window.screenLeft,
        width  : window.innerWidth,
        height : window.innerHeight,
        href   : window.location.href,
        innerWidth  : window.innerWidth,
        innerHeight : window.innerHeight,
        outerWidth  : window.outerWidth,
        outerHeight : window.outerHeight,
        scrollTop : document.body.scrollTop,
        scrollLeft: document.body.scrollLeft
    };

    var rect = document.getElementById('clipRect');
    var rectInfo = {
        top    : parseInt(rect.style.top),
        left   : parseInt(rect.style.left),
        width  : parseInt(rect.style.width),
        height : parseInt(rect.style.height)
    };
    return {window: windowInfo, rect: rectInfo};
}

function getPoint(e) {
    Point = {};
    Point.x = e.pageX;
    Point.y = e.pageY;
    return Point;
}

function mouseDownHandler(e) {
    mouseDown = true;
    document.getElementById('clipRect').style.display = 'none';
    startPoint = getPoint(e);
}

function mouseUpHandler(e) {
    mouseDown = false;
    endPoint = getPoint(e);
    var rect = drawRect(startPoint, endPoint);
    if (rect.width > 0) {
        var info = collectInformation();
        chrome.runtime.sendMessage(info);
        clearRect();
    }
}

function mouseMoveHandler(e) {
    if (mouseDown) {
        endPoint = getPoint(e);
        drawRect(startPoint, endPoint);
    }
}

function clearRect() {
    document.getElementById('clipRect').style.display = 'none';
    document.getElementById('backboard').style.display = 'none';
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
    var div = document.getElementById('clipRect');
    div.style.display = 'block';
    div.style.left = rect.left + 'px';
    div.style.top  = rect.top + 'px';
    div.style.width  = rect.width + 'px';
    div.style.height = rect.height + 'px';

    return rect;
}

function init() {
    var rect = document.getElementById('clipRect');
    if (!rect) {
        rect = document.createElement('div');
        document.body.appendChild(rect);
        rect.id = 'clipRect';
    }
    rect.style.position = 'absolute';
    rect.style.display = 'none';
    rect.style.backgroundColor = 'lightblue';
    rect.style.opacity = 0.7;
    rect.style.zIndex  =  9999;

    var backboard = document.getElementById('backboard');
    if (!backboard) {
        backboard = document.createElement('div');
        backboard.id = 'backboard';
        document.body.appendChild(backboard);
    }
    backboard.style.width   = document.body.clientWidth + 'px';
    backboard.style.height  = document.body.clientHeight  + 'px';
    backboard.style.backgroundColor = 'white';
    backboard.style.position = 'absolute';
    backboard.style.top      = '0px';
    backboard.style.legt     = '0px';
    backboard.style.zIndex   = 9998;
    backboard.style.opacity = 0.7;
    backboard.style.display  = 'block';
}

window.onmousedown = mouseDownHandler;
window.onmouseup   = mouseUpHandler;
window.onmousemove = mouseMoveHandler;
init();