goog.provide('gb.model.Point');

gb.model.Point = function(x,y) {
	this.x = x;
	this.y = y;
};

gb.model.Point.prototype.toString = function() {
	return "Point("+this.x+","+this.y+")";
};


gb.model.Point.prototype.distance = function(point) {
	var xDistance = point.x - this.x;
	var yDistance = point.y - this.y;
	return Math.sqrt((xDistance*xDistance)+(yDistance*yDistance));
};

gb.model.Point.prototype.theta = function(point) {
	var rise = point.y - this.y;
	var run = point.x - this.x;
	return Math.atan2(rise, run);
};


