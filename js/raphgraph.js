goog.provide('gb.ui.Chart');

Array.prototype.randomList = function(size, scale) {
	var r = new Array(size);
	for (var i = 0; i < size; i++) {
		r[i] = Math.floor(Math.random() * (scale+1));
	}
	return r;
};

Array.max = function(array){
    return Math.max.apply(Math, array);
};

Array.min = function(array){
    return Math.min.apply(Math, array);
};



gb.ui.Chart = function(x,y,width,height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	
	
	this.chartLeft = 60; // leftmost area of chart
	this.chartTop = 60;
	this.chartRight = this.width - 60;
	this.chartBottom = this.height - 100;
	this.chartWidth = this.chartRight - this.chartLeft;
	this.chartHeight = this.chartBottom - this.chartTop;
	this.barCeiling = this.chartHeight - 40; // space from tallest bar to top of chart
	this.topInterval = 0;

	
	this.chart = Raphael(this.x, this.y, this.width, this.height);
	
	this.tickXPos = 30;
	this.tickMarks = null;
	
	this.textBox = this.chart.text(50,20, "").attr({"font":"14pt 'Arial'"});
	this.minText = this.chart.text(200,20, "min:").attr({"font":"14pt 'Arial'"});
	this.maxText = this.chart.text(200,40, "max:").attr({"font":"14pt 'Arial'"});
	this.topIntervalText = this.chart.text(400,40, "top:").attr({"font":"14pt 'Arial'"});
		
	
	this.chartArea = this.chart.rect(
		this.chartLeft, 
		this.chartTop, 
		this.chartWidth, 
		this.chartHeight)
		.attr({fill:"#efefef", "stroke-width": 1, "stroke":"#666"});
		
	// console.debug(this.chartArea);
	
	this.numberOfBars = 15;
	this.barWidth = 40;
	this.barSpacing = 20; // spacing
	

	
	this.bars = [];
	this.data = [];
	
	this.tickCount = 5;
	this.roundUpTo = 100;
	
	// randomizer
	this.generatorIndex = 1;
	
};

gb.ui.Chart.prototype.init = function() {
	var tmpArray = [];
	this.data = tmpArray.randomList(this.numberOfBars, this.generatorIndex * 100);
};

gb.ui.Chart.prototype.grid = function(horizontal,vertical) {
	// draw horizontal rules
	for (var i=1; i < this.height; i+=vertical) {
		var path = "M0 "+i+ " H"+this.width;
		this.chart.path(path).attr({"stroke-width": 0.1});
	}	
	// draw vertical rules
	for (var i=1; i < this.width; i+=horizontal) {
		var path = "M"+i+ " 0 V"+this.height;
		this.chart.path(path).attr({"stroke-width": 0.1});
	}
};


gb.ui.Chart.prototype.draw = function() {
	if (this.data.length){
		for (var i = 0; i < this.data.length; i++) {
			if (this.bars[i]) this.bars[i].remove();
			this.bars[i] = this.drawBar(i, this.data[i]);
		}
	}
};

gb.ui.Chart.prototype.drawBar = function(i, value){
	var xPos = this.chartLeft + (i * (this.barWidth + this.barSpacing));
	var yPos = this.chartBottom - value;
	var thisObj = this;
	
	var objSet = this.chart.set();
	objSet.push(
		this.chart.rect(xPos, yPos, this.barWidth, value)
		.attr({fill:"#fff", "stroke-width": 0})
		.click(function(){
			var text = "selected: " + i;  
			thisObj.textBox.attr("text", text);
		})
	);
	
	var xPosText = xPos + this.barWidth/2;
	var yPosText = yPos - 10;
	objSet.push(
		this.chart.text(xPosText, yPosText, value).attr({"font":"10pt 'Arial'",fill:"#666"})
	);
	
	return 	objSet;
};


gb.ui.Chart.prototype.drawTickMarks = function() {
	
	var tickIntervalValue = this.topInterval / this.tickCount;

	
	if (this.tickMarks) {
		this.tickMarks.remove();
	} 	
	
	var tickSet = this.chart.set();
	for (var i=1; i <= this.tickCount; i++) {
		
		var tickLabel  = tickIntervalValue * i;
		var yPos = this.chartBottom - this.scaledValue(tickIntervalValue * i);
		
		// console.debug("tickPositions: "+this.tickXPos+" "+yPos+" value: "+tickLabel)
		tickSet.push(
			this.chart.text(this.tickXPos, yPos, tickLabel ).attr({"font":"10pt 'Arial'"})
		);

	}
	
	this.tickMarks = tickSet;
	
}


gb.ui.Chart.prototype.animate = function(){
	
	var newData = [];
	
	newData = newData.randomList(this.numberOfBars, this.generatorIndex * this.roundUpTo);
	if (this.generatorIndex>12) {
		this.generatorIndex = 1;
	} else {
		this.generatorIndex++;
	}

	var min = Array.min(newData);
	var max = Array.max(newData);
	this.topInterval = this.calculateTopInterval(max,this.roundUpTo);
	
	this.minText.attr({text: "min: " + min});
	this.maxText.attr({text: "max: " + max});
	this.topIntervalText.attr({text: "top:" + this.topInterval});
		
	if (this.data.length){
		for (var i = 0; i < this.data.length; i++) {
			this.data[i] = newData[i]; // sync model
			var newHeight = this.scaledValue(newData[i]);
			var newYPos = this.chartBottom - newHeight;
			var fillColor = this.colorCode(newData[i]);
			
			var barAnimation = Raphael.animation({height: newHeight, y: newYPos, fill: fillColor, "stroke-width":0 }, 500, "easeInOut");
			var textAnimation = Raphael.animation({height: newHeight, y: newYPos -10}, 500, "easeInOut");
			
			var barObj = this.bars[i];
			barObj[0].animate(barAnimation);
			barObj[1].attr({text:newData[i]}).animate(textAnimation);
						
			// this.bars[i].animate(animation);
		}
	}
	this.drawTickMarks();
};

/**
 * Calculate the actual pixel height:
 * barHeight = (value * barCeiling)/ topInterval;
 * 
 * 
 */
gb.ui.Chart.prototype.scaledValue = function(value) {
	return ((this.topInterval!=0) ?
		(value * this.barCeiling)/this.topInterval : 0);
};

/**
 * Calculate the nearest top interval:
 *    topInterval(150,100) -> 200
 * 
 */
gb.ui.Chart.prototype.calculateTopInterval = function(value, interval){
	return ((value%interval) > 0)?value-(value%interval) + interval:value;
}

gb.ui.Chart.prototype.colorCode = function(value) {
	var colorMap = {
		treshold: [550, 500, 400, 300, 200],
		color:    ["#ff0033","#ff6633","#ffcc33","#8FD600", "#3399CC"],
		def: "#003366"
	};
		
	for (var i=0; i < colorMap.treshold.length; i++) {
		if (value > colorMap.treshold[i]) {
			return colorMap.color[i];
		}
	}
	
	return colorMap.def;
};


function initPage() {
	chart = new gb.ui.Chart(20,20,1002,802);
	chart.init();
	chart.grid(20,20);
	chart.draw();
	chart.animate();
	var interval = setInterval(refresh, 3000);
}

function refresh() {
	this.chart.animate();
}

var chart = null;



