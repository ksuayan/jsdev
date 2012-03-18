goog.provide('gb.ui.MapEditor');


gb.ui.Default = {
	
	testButtonStyle: {
		"font":"10pt 'Arial'",
		"cursor":"pointer"
	},
	
	buttonStyle: {
		"fill":"#999999", 
		"cursor": "pointer",
		"stroke-width":1
	},
	
	buttonPadding: 5,
	
	lineStyle: {
		
		sidewalk: {
			'stroke':'#fff',
		    'stroke-width':'20'
		},
	
		road: {
			'stroke':'#666',
			'stroke-width':'12'
		},

		dashed: {
			'stroke':'#fff',
	    	'stroke-width':'1',
	   		'stroke-dasharray': "- "
		}		
	}
};

gb.ui.Point = function(x,y) {
	this.x = x;
	this.y = y;
};

gb.ui.Point.prototype.toString = function() {
	return "x,y: ["+this.x+", "+this.y+"]";
};


gb.ui.Button = function(paper, x,y, message, onClick) {
	this.x = x;
	this.y = y;
	this.paper = paper;
	
	this.textObj = this.paper.text(x,y,message)
		.attr(gb.ui.Default.testButtonStyle);
		
	// this.textObj.style.cursor = 'pointer';
		
	this.boundingBox = this.textObj.getBBox();
	
	this.buttonRect = this.paper.rect(
		this.boundingBox.x - gb.ui.Default.buttonPadding, 
		this.boundingBox.y - gb.ui.Default.buttonPadding,
		this.boundingBox.width + (2 * gb.ui.Default.buttonPadding),
		this.boundingBox.height + (2 * gb.ui.Default.buttonPadding))
		.attr(gb.ui.Default.buttonStyle);
			
	if (typeof onClick ==='function') {
		this.textObj.click(onClick);
		this.buttonRect.click(onClick);
	}
	this.textObj.toFront();
};



gb.ui.MapEditor = function(x,y,width,height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	
	this.mapObj = Raphael(this.x, this.y, this.width, this.height);
	this.mainText = this.mapObj.text(50,20, "").attr({"font":"10pt 'Arial'"});
	this.coordsText = this.mapObj.text(50,40, "").attr({"font":"10pt 'Arial'"});
	
	this.clickBuffer = [];
	this.clickBufferPath = this.mapObj.set();
	this.clickBufferIndex = 0;
	
	this.renderButton = new gb.ui.Button(this.mapObj, 150, 20, "Render", 
		function(){
			map.renderClickBuffer();
		});
		
	this.resetButton = new gb.ui.Button(this.mapObj, 250, 20, "Clear", 
		function(){
			map.resetClickBuffer();
		});
};


gb.ui.MapEditor.prototype.init = function() {
	this.drawArea = this.mapObj
		.rect(60,60,800,600)
		.attr({
			"fill":"#999",
			"fill-opacity": 0.3,
			"stroke":"#333"
		});
};

gb.ui.MapEditor.prototype.grid = function(horizontal,vertical) {
	// draw horizontal rules
	for (var i=1; i < this.height; i+=vertical) {
		var path = "M0 "+i+ " H"+this.width;
		this.mapObj.path(path).attr({"stroke-width": 0.1});
	}	
	
	// draw vertical rules
	for (var i=1; i < this.width; i+=horizontal) {
		var path = "M"+i+ " 0 V"+this.height;
		this.mapObj.path(path).attr({"stroke-width": 0.1});
	}
};


gb.ui.MapEditor.prototype.printCoords = function(msg) {
	this.coordsText.attr({text:msg});	
};



gb.ui.MapEditor.prototype.renderClickBuffer = function(e) {
	
	var buffer = this.clickBufferStr();
	
	
	if (buffer) {
		
		console.debug("renderClickBuffer "+ buffer);
		this.clickBufferPath.push(this.mapObj.path(buffer).attr(gb.ui.Default.lineStyle.sidewalk));
		this.clickBufferPath.push(this.mapObj.path(buffer).attr(gb.ui.Default.lineStyle.road));
		this.clickBufferPath.push(this.mapObj.path(buffer).attr(gb.ui.Default.lineStyle.dashed));
		console.debug(this.clickBufferPath);
	} else {
		console.debug("clickBufferStr is empty.");
	}
	
};

gb.ui.MapEditor.prototype.resetClickBuffer = function(e) {
	this.clickBuffer = [];
	this.clickBufferIndex = 0;
	this.clearSet(this.clickBufferPath);
	this.clickBufferPath = this.mapObj.set();

};

gb.ui.MapEditor.prototype.clearSet = function(objectSet) {
	if (objectSet) {
		objectSet.forEach(function(element){
			element.remove();
		});
	}
};


gb.ui.MapEditor.prototype.temp = function() {

	// import a set		
	this.vectorSet = this.mapObj.set();
	this.mapObj.importSVG('<svg><path d="M104.645,5.696c-51.707,0-93.624,41.917-93.624,93.624s41.917,93.624,93.624,93.624s93.624-41.917,93.624-93.624 S156.352,5.696,104.645,5.696z M159.205,173.349l-54.136-38.78l-53.61,39.503l20.153-63.47L17.476,71.822l66.591-0.447l20.152-63.47l21.003,63.194l66.591-0.447l-53.611,39.503L159.205,173.349z"/></svg>', 
	this.vectorSet);

	var fly_path = "M28.589,10.903l-5.828,1.612c-0.534-1.419-1.338-2.649-2.311-3.628l3.082-5.44c0.271-0.48,0.104-1.092-0.38-1.365c-0.479-0.271-1.09-0.102-1.36,0.377l-2.924,5.162c-0.604-0.383-1.24-0.689-1.9-0.896c-0.416-1.437-1.652-2.411-3.058-2.562c-0.001-0.004-0.002-0.008-0.003-0.012c-0.061-0.242-0.093-0.46-0.098-0.65c-0.005-0.189,0.012-0.351,0.046-0.479c0.037-0.13,0.079-0.235,0.125-0.317c0.146-0.26,0.34-0.43,0.577-0.509c0.023,0.281,0.142,0.482,0.352,0.601c0.155,0.088,0.336,0.115,0.546,0.086c0.211-0.031,0.376-0.152,0.496-0.363c0.105-0.186,0.127-0.389,0.064-0.607c-0.064-0.219-0.203-0.388-0.414-0.507c-0.154-0.087-0.314-0.131-0.482-0.129c-0.167,0.001-0.327,0.034-0.481,0.097c-0.153,0.063-0.296,0.16-0.429,0.289c-0.132,0.129-0.241,0.271-0.33,0.426c-0.132,0.234-0.216,0.496-0.25,0.783c-0.033,0.286-0.037,0.565-0.009,0.84c0.017,0.16,0.061,0.301,0.094,0.449c-0.375-0.021-0.758,0.002-1.14,0.108c-0.482,0.133-0.913,0.36-1.28,0.653c-0.052-0.172-0.098-0.344-0.18-0.518c-0.116-0.249-0.263-0.486-0.438-0.716c-0.178-0.229-0.384-0.41-0.618-0.543C9.904,3.059,9.737,2.994,9.557,2.951c-0.18-0.043-0.352-0.052-0.516-0.027s-0.318,0.08-0.463,0.164C8.432,3.172,8.318,3.293,8.23,3.445C8.111,3.656,8.08,3.873,8.136,4.092c0.058,0.221,0.181,0.384,0.367,0.49c0.21,0.119,0.415,0.138,0.611,0.056C9.31,4.556,9.451,4.439,9.539,4.283c0.119-0.21,0.118-0.443-0.007-0.695c0.244-0.055,0.497-0.008,0.757,0.141c0.081,0.045,0.171,0.115,0.27,0.208c0.097,0.092,0.193,0.222,0.286,0.388c0.094,0.166,0.179,0.368,0.251,0.608c0.013,0.044,0.023,0.098,0.035,0.146c-0.911,0.828-1.357,2.088-1.098,3.357c-0.582,0.584-1.072,1.27-1.457,2.035l-5.16-2.926c-0.48-0.271-1.092-0.102-1.364,0.377C1.781,8.404,1.95,9.016,2.43,9.289l5.441,3.082c-0.331,1.34-0.387,2.807-0.117,4.297l-5.828,1.613c-0.534,0.147-0.846,0.699-0.698,1.231c0.147,0.53,0.697,0.843,1.231,0.694l5.879-1.627c0.503,1.057,1.363,2.28,2.371,3.443l-3.194,5.639c-0.272,0.481-0.104,1.092,0.378,1.363c0.239,0.137,0.512,0.162,0.758,0.094c0.248-0.068,0.469-0.229,0.604-0.471l2.895-5.109c2.7,2.594,5.684,4.123,5.778,1.053c1.598,2.56,3.451-0.338,4.502-3.976l5.203,2.947c0.24,0.138,0.514,0.162,0.762,0.094c0.246-0.067,0.467-0.229,0.603-0.471c0.272-0.479,0.104-1.091-0.377-1.362l-5.701-3.229c0.291-1.505,0.422-2.983,0.319-4.138l5.886-1.627c0.53-0.147,0.847-0.697,0.696-1.229C29.673,11.068,29.121,10.756,28.589,10.903z";

	this.fly = this.mapObj.path(fly_path);
	this.fly.translate(100,100);
	this.fly.attr({
		'stroke-width': 0,
		'fill': '#cccccc',
		'fill-opacity': 1.0
	});
	
	this.fly.drag(
		function(dx,dy) {
			console.debug("move drag "+dx+","+dy);
			var trans_x = dx - thisObj.fly.ox;
		    var trans_y = dy - thisObj.fly.oy;
   			thisObj.fly.translate(trans_x,trans_y);
    		thisObj.fly.ox = dx;
    		thisObj.fly.oy = dy;
		},
		
		function() {
			thisObj.fly.ox = 0;
			thisObj.fly.oy = 0;
			console.debug("start drag ");
		},
		
		function() {
			console.debug("end drag ");
			console.debug(thisObj);
		}
	);
	
	// x1,y1 (cp1), x2,y2 (cp2), x,y
	var curve1 = Raphael.format("M{0},{1}C{2},{3},{4},{5},{6},{7}", 100,100, 100,350, 400,0, 100,500);
	this.mapObj.path(curve1).attr(sidewalk);
	this.mapObj.path(curve1).attr(road);
	this.mapObj.path(curve1).attr(dashed);
	
	var curve2 = Raphael.format("M{0},{1}S{2},{3},{4},{5}", 600,200, 200,250, 300,100);
	this.mapObj.path(curve2).attr(sidewalk);
	this.mapObj.path(curve2).attr(road);
	this.mapObj.path(curve2).attr(dashed);
};




gb.ui.MapEditor.prototype.draw = function() {

	var thisObj = this;
	this.clickBufferIndex = 0;
	
	this.drawArea.mousedown(function(e){
		thisObj.clickBuffer[thisObj.clickBufferIndex] = new gb.ui.Point(e.offsetX, e.offsetY);
		thisObj.printCoords(thisObj.clickBuffer[thisObj.clickBufferIndex]);
		thisObj.clickBufferIndex++;
		
		thisObj.clickBufferPath.push(
			thisObj.mapObj
				.circle(e.offsetX, e.offsetY, 20)
				.attr({'fill':'#ff4900','stroke-width':"0"})
		);
		
		console.debug("clickBuffer: " + thisObj.clickBufferStr());
	});
	

};


gb.ui.MapEditor.prototype.clickBufferStr = function() {
	
	var str = "";
	if (this.clickBuffer.length > 0) {
		str = "M" + this.clickBuffer[0].x + "," 
			+ this.clickBuffer[0].y + " L";
		for (var i=1; i < this.clickBuffer.length; i++) {
			str = str + this.clickBuffer[i].x + "," 
				+ this.clickBuffer[i].y + " ";
		}
	}
	return str;
};

function initPage() {
	map = new gb.ui.MapEditor(20,20,1002,802);
	map.init();
	map.grid(20,20);
	map.draw();
}

var map = null;
