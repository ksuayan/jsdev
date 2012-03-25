goog.provide('gb.ui.ControlPoint');

gb.ui.ControlPoint = function(x,y,paper) {
	
	this.x = x;
	this.y = y;
	this.paper = paper;
}


goog.inherits(gb.ui.ControlPoint, gb.model.Point);
