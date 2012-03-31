goog.provide('gb.ui.DragDemo');
goog.require('gb.config.Default');
goog.require('gb.model.Point');

gb.ui.DragDemo = function(container, width,height) {

	this.container = container;
	this.width = width;
	this.height = height;
	this.mapObj = Raphael(this.container, this.width, this.height);
};

gb.ui.DragDemo.prototype.grid = function(horizontal,vertical) {
	// draw horizontal rules
	for (var i=1; i < this.height; i+=vertical) {
		var path = "M0 "+i+ " H"+this.width;
		this.mapObj.path(path).attr(gb.config.Default.gridLine);
	}	
	
	// draw vertical rules
	for (var i=1; i < this.width; i+=horizontal) {
		var path = "M"+i+ " 0 V"+this.height;
		this.mapObj.path(path).attr(gb.config.Default.gridLine);
	}
};


gb.ui.DragDemo.prototype.initDrawArea = function(xOffset,yOffset, width, height) {
	this.xOffset = xOffset;
	this.yOffset = yOffset;
	this.drawArea = this.mapObj.rect(xOffset,yOffset, width, height)
		.attr(gb.config.Default.drawArea);
};


gb.ui.DragDemo.prototype.demo = function() {
	var rect = this.mapObj.rect(100,200, 40,18,5).attr(gb.config.Default.rectangle);
	var dragItem = new gb.ui.Draggable(rect.x, rect.y, rect);
	dragItem.setConstraint(gb.ui.DragConstraint.VERTICAL);
	dragItem.activate();
	console.debug(dragItem);
};



function initPage() {
	map = new gb.ui.DragDemo("svg-content",1002,802);
	map.grid(20,20);
	map.initDrawArea(1,60,1000,740);
	map.demo();
}

var map = null;
