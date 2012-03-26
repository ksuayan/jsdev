goog.provide('gb.ui.MapEditor');

goog.require('gb.config.Default');
goog.require('gb.model.Point');

goog.require('gb.ui.ControlPoint');
goog.require('gb.ui.Path');
goog.require('gb.ui.Button');


gb.ui.MapEditor = function(container, width,height) {

	this.container = container;
	this.width = width;
	this.height = height;
	
	this.mapObj = Raphael(this.container, this.width, this.height);
	this.mainText = this.mapObj.text(50,20, "").attr({"font":"10pt 'Arial'"});
	this.coordsText = this.mapObj.text(50,40, "").attr({"font":"10pt 'Arial'"});
};

gb.ui.MapEditor.prototype.grid = function(horizontal,vertical) {
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


gb.ui.MapEditor.prototype.initDrawArea = function(xOffset,yOffset, width, height) {
	
	this.xOffset = xOffset;
	this.yOffset = yOffset;
	this.drawArea = this.mapObj.rect(xOffset,yOffset, width, height)
		.attr(gb.config.Default.drawArea);
};


gb.ui.MapEditor.prototype.drawButtons = function() {
		
	this.resetButton = new gb.ui.Button(this.mapObj, 25, 20, "Clear", 
		function(){
			map.pathElements.reset();
		});

};

gb.ui.MapEditor.prototype.printCoords = function(msg) {
	this.coordsText.attr({text:msg});	
};

gb.ui.MapEditor.prototype.drawLine = function() {

	var thisObj = this;
	
	this.pathElements = new gb.ui.Path(this.mapObj);
	
	this.drawArea.mousedown(function(e){
		var point = new gb.ui.ControlPoint(e.offsetX, e.offsetY);
		point.setOnDragComplete(function(){thisObj.pathElements.draw();});
		thisObj.pathElements.add(point);
		thisObj.pathElements.draw();
	});
};


function initPage() {
	map = new gb.ui.MapEditor("svg-content",1002,802);
	
	map.grid(20,20);
	map.drawButtons();	
	map.initDrawArea(1,60,1000,740);
	map.drawLine();
}

var map = null;
