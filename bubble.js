$(document).ready(function(){

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
/*
[{x:0, y:0, a:<anchor>}]
*/
var circ = $('<div>').css({position: 'absolute', borderRadius: '999px',
    MozBorderRadius: '999px', WebkitBorderRadius: '999px',
    backgroundColor: 'rgba(128,128,128,0.4)', display: 'none'}).appendTo('body');
var showCirc = false;
var links = [];

var a = $('a').each(function(){
    var $this = $(this);
    var offset = $this.offset();

    var link = {
        a: $this,
        left: offset.left,
        top: offset.top,
        right: offset.left+$this.width(),
        bottom: offset.top+$this.height()
    };

    links.push(link);
});

var prevClosest = links[0];

$(document).mousemove(function(e){
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
        prevClosest.a.css('outline', '');
        closest.a.css('outline', '3px solid #529DFF');
        prevClosest = closest;
    }
    if (showCirc) circ.css({width: closeDist*2+"px", height: closeDist*2+"px",
        top: e.pageY-closeDist, left: e.pageX-closeDist});
});

var clicked = false;
$(document).click(function(e){
    console.log("click");
    if (!clicked)
    {
        //clicked = true;
        location.href = prevClosest.a.attr('href');
    }
});

$(document).keypress(function(e){
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 66 || code == 98)
    {
        showCirc = !showCirc;
        if (!showCirc) circ.css('display', 'none');
        else circ.css('display', 'block')
    }
});

});
