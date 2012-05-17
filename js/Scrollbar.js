goog.provide('gb.ui.Scrollbar');
goog.require('gb.config.Default');
goog.require('gb.ui.Draggable');
goog.require('gb.ui.Control');


gb.ui.ScrollType = {
	VERTICAL: 1,
	HORIZONTAL: 2
};


gb.ui.Scrollbar = function(paper, x,y, length, scrollType) {
	gb.model.Point.call(this,x,y);
	this.length = length;
	this.paper = paper;
	this.scrollType = scrollType;
	
	this.thumb = null;
	this.track = null;
	
	this.rectRadius = 4;
	this.thumbSpace = 2;
	
	switch (this.scrollType) {
		case gb.ui.ScrollType.VERTICAL:
			this.trackHeight = this.length;
			this.trackWidth = 20;
			this.thumbWidth = 20 - (this.thumbSpace * 2);
			this.thumbHeight = 100;
			break;
			
		case gb.ui.ScrollType.HORIZONTAL:
			this.trackHeight = 20;
			this.trackWidth = this.length;
			this.thumbWidth = 100;
			this.thumbHeight = 20 - (this.thumbSpace * 2);
			break;
		default:	
	}
	
};

goog.inherits(gb.ui.Scrollbar, gb.ui.Control);

gb.ui.Scrollbar.prototype.activate = function() {
		
	var trackRect = this.paper.rect(
		this.x, 
		this.y, 
		this.trackWidth,
		this.trackHeight)
		.attr(gb.config.Default.trackStyle);
		
	var thumbRect = this.paper.rect(
		this.x + this.thumbSpace, 
		this.y + this.thumbSpace, 
		this.thumbWidth,
		this.thumbHeight,
		this.rectRadius)
		.attr(gb.config.Default.thumbStyle);
		
	this.thumb = new gb.ui.Draggable(
		this.x + this.thumbSpace, 
		this.y + this.thumbSpace, 
		thumbRect);
	this.thumb.setConstraint(this.scrollType);
	this.thumb.activate();
};


gb.ui.Scrollbar.prototype.setOnDragComplete = function(onDragComplete) {
	this.thumb.onDragComplete = onDragComplete;	
};

gb.ui.Scrollbar.prototype.getX = function() {
	return this.thumb.x - this.x - this.thumbSpace;
}

gb.ui.Scrollbar.prototype.getY = function() {
	return this.thumb.y - this.y - this.thumbSpace;
}


