goog.provide('gb.ui.Button');

gb.ui.Button = function(paper, x,y, message, onClick) {
	this.x = x;
	this.y = y;
	this.paper = paper;
	
	this.textObj = this.paper.text(x,y,message).attr(gb.config.Default.testButtonStyle);
		
	// this.textObj.style.cursor = 'pointer';
		
	this.boundingBox = this.textObj.getBBox();
	
	this.buttonRect = this.paper.rect(
		this.boundingBox.x - gb.config.Default.buttonPadding, 
		this.boundingBox.y - gb.config.Default.buttonPadding,
		this.boundingBox.width + (2 * gb.config.Default.buttonPadding),
		this.boundingBox.height + (2 * gb.config.Default.buttonPadding))
		.attr(gb.config.Default.buttonStyle);
			
	if (typeof onClick ==='function') {
		this.textObj.click(onClick);
		this.buttonRect.click(onClick);
	}
	
	this.textObj.toFront();
};

gb.ui.Button.prototype.getWidth = function() {
	console.debug(this.buttonRect.attrs);
	return this.buttonRect.attrs.width;
};

gb.ui.Button.prototype.getHeight = function() {
	return this.buttonRect.attrs.height;
};
