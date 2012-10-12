Raphael.fn.zeroToTenArc = function(x, y, r, value) {
    var set = this.set();
    var pi = Math.PI;
    var cos = Math.cos;
    var sin = Math.sin;
    var maxValue = 10;
    var t = (pi / 2) * 3;
    //translate
    var rad = (pi * 2 * (maxValue - value)) / maxValue + t;
    var colors = ["#F79518", "#FCE6BF", "#FFF"];

    set.push(this.circle(x, y, r).attr({
        fill : colors[+!value],
        stroke : 0
    }));

    var p = [
        "M", x, y,
        "l", r * cos(t), r * sin(t),
        "A", r, r, 0, +(rad > pi + t), 1, x + r * cos(rad), y + r * sin(rad), 
        "z"
    ];

    set.push(this.path(p).attr({
        fill : colors[1],
        stroke : 0
    }));

    set.push(this.circle(x, y, r * 0.7).attr({
        fill : colors[2],
        stroke : 0
    }));

    return set;
};

function initPage() {
    var paper = Raphael(0, 0, 800, 600);
    // var arc = paper.zeroToTenArc(150, 150, 30, 4.2);
    
    paper.path("M 50,50 a ")
    
    // console.debug(paper);
};
