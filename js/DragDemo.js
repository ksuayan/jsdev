goog.provide('gb.ui.DragDemo');
goog.require('gb.config.Default');
goog.require('gb.ui.Control');

gb.ui.DragDemo = function(container, width, height) {
	this.container = container;
	this.width = width;
	this.height = height;
	this.paper = Raphael(this.container, this.width, this.height);
};

gb.ui.DragDemo.prototype.grid = function(horizontal,vertical) {
	// draw horizontal rules
	for (var i=1; i < this.height; i+=vertical) {
		var path = "M0 "+i+ " H"+this.width;
		this.paper.path(path).attr(gb.config.Default.gridLine);
	}	
	
	// draw vertical rules
	for (var i=1; i < this.width; i+=horizontal) {
		var path = "M"+i+ " 0 V"+this.height;
		this.paper.path(path).attr(gb.config.Default.gridLine);
	}
};


gb.ui.DragDemo.prototype.initDrawArea = function(xOffset,yOffset, width, height) {
	this.xOffset = xOffset;
	this.yOffset = yOffset;
	this.drawArea = this.paper.rect(xOffset,yOffset, width, height)
		.attr(gb.config.Default.drawArea);
		
	this.mainText = this.paper.text(50,20, "Test").attr(gb.config.Default.text);
};


gb.ui.DragDemo.prototype.demo = function() {
	
	var thisObj = this;
	
	var vScrollBar = new gb.ui.Scrollbar(this.paper, 979, 60, 740, gb.ui.ScrollType.VERTICAL);
	vScrollBar.activate();
	
	console.debug("start", thisObj.mainText, vScrollBar); 
	vScrollBar.setOnDragComplete(
		function(){
			var textAttr = thisObj.mainText.attrs;
			textAttr.text = vScrollBar.getY();
			thisObj.mainText.attr(textAttr);
			console.debug(thisObj.mainText, vScrollBar); 
		}
	);

};



function initPage() {
	map = new gb.ui.DragDemo("svg-content",1002,802);
	map.grid(20,20);
	map.initDrawArea(1,60,1000,740);
	map.demo();
}

var map = null;
