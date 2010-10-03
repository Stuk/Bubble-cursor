// Stolen from jQuery
var getElemOffset = function(elem) {
	var box = elem.getBoundingClientRect(), doc = elem.ownerDocument, body = doc.body, docElem = doc.documentElement,
		clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
		top  = box.top  + (docElem.scrollTop  || body.scrollTop ) - clientTop,
		left = box.left + (docElem.scrollLeft || body.scrollLeft) - clientLeft;

	return { top: top, left: left };
};

var pointRectDist = function(x, y, box) {
    var hori = (x >= box.left && x <= box.right);
    var vert = (y >= box.top && y <= box.bottom);

    // inside
    if (hori && vert) return 0;

    // edges are closest
    if (hori)
    {
        if (y < box.top) return box.top - y;
        else return y - box.bottom;
    }
    if (vert)
    {
        if (x < box.left) return box.left - x;
        else return x - box.right
    }

    // corners
         if (y < box.top && x < box.left) //top left
        return pointPointDist(box.left, box.top, x, y)
    else if (y < box.top && x > box.right) // top right
        return pointPointDist(box.right, box.top, x, y)
    else if (y > box.bottom && x > box.right) // bottom right
        return pointPointDist(box.right, box.bottom, x, y)
    else if (y > box.bottom && x < box.left) // bottom left
        return pointPointDist(box.left, box.bottom, x, y)

    return "ERROR";
};

var pointPointDist = function(x1, y1, x2, y2) {
    var x = x1 - x2;
    var y = y1 - y2;
    return Math.sqrt(x*x + y*y);
};

// Setup
var circ = document.createElement('div');
var props =  {position: 'absolute', borderRadius: '999px',
    MozBorderRadius: '999px', WebkitBorderRadius: '999px',
    backgroundColor: 'rgba(128,128,128,0.4)', display: 'none'}
for (var prop in props)
{
    circ.style[prop] = props[prop];
}

document.body.appendChild(circ);
var showCirc = false;

// [{top:0, left:0, right:0, bottom:0, a:<anchor>}, ...]
var links = [];

var as = document.getElementsByTagName('a');
for (var i = 0; i < as.length; i++)
{
    var a = as[i];
    var offset = getElemOffset(a);

    var link = {
        a: a,
        left: offset.left,
        top: offset.top,
        right: offset.left+a.offsetWidth,
        bottom: offset.top+a.offsetHeight
    };

    links.push(link);
};

var prevClosest = links[0];

document.addEventListener('mousemove', function(e){
    var closest;
    var closeDist = 9999;

    for (var i=0; i < links.length; i++)
    {
        var l = links[i];
        var dist = pointRectDist(e.pageX, e.pageY, l);
        if (dist < closeDist)
        {
            closest = links[i];
            closeDist = dist;
        }
    }
    if (closest !== prevClosest)
    {
        prevClosest.a.style.outline = '';
        closest.a.style.outline = '3px solid #529DFF';
        prevClosest = closest;
    }
    if (showCirc)
    {
        circ.style.width = closeDist*2+"px";
        circ.style.height = closeDist*2+"px";
        circ.style.top = e.pageY-closeDist+"px";
        circ.style.left = e.pageX-closeDist+"px";
    }
}, false);

var clicked = false;
document.addEventListener('click', function(e){
    if (!clicked)
    {
        //clicked = true;
        location.href = prevClosest.a.href;
    }
}, false);

document.addEventListener('keypress', function(e){
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 66 || code == 98)
    {
        showCirc = !showCirc;
        if (!showCirc) circ.style.display = 'none';
        else circ.style.display = 'block';
    }
}, false);
