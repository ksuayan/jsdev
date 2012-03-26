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
	
	this.clickBuffer = [];
	this.clickBufferPath = this.mapObj.set();
	this.clickBufferIndex = 0;
	
	
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
	
	this.drawArea = this.mapObj
		.rect(xOffset,yOffset, width, height)
		.attr(gb.config.Default.drawArea);
	
};




gb.ui.MapEditor.prototype.drawButtons = function() {
	
	this.renderButton = new gb.ui.Button(this.mapObj, 150, 20, "Render", 
		function(){
			map.renderClickBuffer();
		});
		
	this.resetButton = new gb.ui.Button(this.mapObj, 250, 20, "Clear", 
		function(){
			map.resetClickBuffer();
		});
		
	this.zoomInButton = new gb.ui.Button(this.mapObj, 400, 20, "Zoom In", 
		function(){
			map.mapObj.setViewBox(60,60,400,300,true);
		});
};





gb.ui.MapEditor.prototype.printCoords = function(msg) {
	this.coordsText.attr({text:msg});	
};


gb.ui.MapEditor.prototype.renderClickBuffer = function(e) {
	
	var buffer = this.clickBufferStr();
	
	if (buffer) {
		console.debug("renderClickBuffer "+ buffer);
		this.clickBufferPath.push(this.mapObj.path(buffer).attr(gb.config.Default.lineStyle.sidewalk));
		this.clickBufferPath.push(this.mapObj.path(buffer).attr(gb.config.Default.lineStyle.road));
		this.clickBufferPath.push(this.mapObj.path(buffer).attr(gb.config.Default.lineStyle.dashed));
		console.debug(this.clickBufferPath);
	} else {
		console.debug("clickBufferStr is empty.");
	}
	
};

gb.ui.MapEditor.prototype.resetClickBuffer = function(e) {
	this.clickBuffer = [];
	this.clickBufferIndex = 0;
	this.clickBufferPath = this.mapObj.set();
	
	this.pathElements.clear();

};




gb.ui.MapEditor.prototype.draw = function() {

	var thisObj = this;
	this.clickBufferIndex = 0;
	
	this.drawArea.mousedown(function(e){
		
		thisObj.clickBuffer[thisObj.clickBufferIndex] = new gb.model.Point(e.offsetX, e.offsetY);
		thisObj.printCoords(thisObj.clickBuffer[thisObj.clickBufferIndex]);
		
			var circle = thisObj.mapObj
				.circle(e.offsetX, e.offsetY, 20)
				.attr({'fill':'#ff4900','stroke-width':"0"})
				.data("index", thisObj.clickBufferIndex);
				
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
						console.debug("start drag ");
					},
		
					function() {
						var index = circle.data("index");
						thisObj.clickBuffer[index].x = thisObj.clickBuffer[index].x + circle.ox;
    					thisObj.clickBuffer[index].y = thisObj.clickBuffer[index].y + circle.oy;
						console.debug("end drag "+ thisObj.clickBuffer[index].x 
							+ ", " + thisObj.clickBuffer[index].y);
						thisObj.renderClickBuffer();
					}					
				);
				
		thisObj.clickBufferPath.push(circle);
		thisObj.clickBufferIndex++;
		console.debug("clickBuffer: " + thisObj.clickBufferStr());		

	});
	

};


gb.ui.MapEditor.prototype.drawLine = function() {

	var thisObj = this;
	
	this.pathElements = new gb.ui.Path(this.mapObj);
	
	this.drawArea.mousedown(function(e){
		var point = new gb.ui.ControlPoint(e.offsetX, e.offsetY);
		thisObj.pathElements.add(point);
		thisObj.pathElements.draw();
		console.debug("pathElements", thisObj.pathElements);
	});
};


function initPage() {
	map = new gb.ui.MapEditor("svg-content",1002,802);
	
	map.grid(20,20);
	map.drawButtons();	
	map.initDrawArea(60,60,880,700);
	map.drawLine();
}

var map = null;
