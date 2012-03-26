goog.provide('gb.ui.ControlPoint');
goog.require('gb.config.Default');
goog.require('gb.model.Point');

gb.ui.ControlPoint = function(x,y) {
	gb.model.Point.call(this,x,y);
};

goog.inherits(gb.ui.ControlPoint, gb.model.Point);

gb.ui.ControlPoint.prototype.show = function(paper) {
	paper.circle(this.x,this.y, 
		gb.config.Default.controlPointRadius)
		.attr(gb.config.Default.controlPoint);
};
