goog.provide('gb.model.Point');

gb.model.Point = function(x,y) {
	this.x = x;
	this.y = y;
};

gb.model.Point.prototype.toString = function() {
	return "Point("+this.x+","+this.y+")";
};
