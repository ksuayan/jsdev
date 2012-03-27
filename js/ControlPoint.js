goog.provide('gb.ui.ControlPoint');
goog.require('gb.config.Default');
goog.require('gb.model.Point');

gb.ui.ControlPoint = function(x,y) {
	gb.model.Point.call(this,x,y);
	this.style = gb.config.Default.endPoint;
	this.radius = gb.config.Default.controlPointRadius;
};

goog.inherits(gb.ui.ControlPoint, gb.model.Point);


gb.ui.ControlPoint.prototype.setOnDragComplete = function(onDragComplete) {
	this.onDragComplete = onDragComplete;	
};

gb.ui.ControlPoint.prototype.setStyle = function(style) {
	this.style = style;	
};


gb.ui.ControlPoint.prototype.show = function(paper) {
	
	var thisObj = this;
	var circle = paper.circle(this.x,this.y,this.radius).attr(this.style);

	circle.drag(
		
		function(dx,dy) {
			var trans_x = dx - circle.ox;
		    var trans_y = dy - circle.oy;
   			circle.translate(trans_x,trans_y);
    		circle.ox = dx;
    		circle.oy = dy;
		},
		
		function() {
			circle.ox = 0;
			circle.oy = 0;
		},
		
		function() {
			thisObj.x = thisObj.x + circle.ox;
			thisObj.y = thisObj.y + circle.oy;
			if (typeof thisObj.onDragComplete === 'function') {
				thisObj.onDragComplete();
			}
		}					
	);
					
};

