goog.provide('gb.ui.Path');

gb.ui.Path = function(paper) {
	this.elements = [];
	this.paper = paper;

};

gb.ui.Path.prototype.add = function(obj) {
	var len = this.elements.length;
	this.elements[len] = obj;
};

gb.ui.Path.prototype.toString = function() {
	var str ="Path[";
	var len = this.elements.length;
	for (var i=0; i < len; i++) {
		str = str + this.elements[i].toString();
	}
	str += "]";
	return str;
};


gb.ui.Path.prototype.draw = function() {
	this.clear();
	this.paper.setStart();
	this.showControls();
	this.paper.path(this.getSVGString());
	this.objectSet = this.paper.setFinish();
};


gb.ui.Path.prototype.showControls = function() {
	if (this.elements.length > 0) {
		for (var i=0; i < this.elements.length; i++) {
			this.elements[i].show(this.paper);
		}
	}
};


gb.ui.Path.prototype.getSVGString = function() {
	var str = "";
	if (this.elements.length > 0) {
		str = "M" + this.elements[0].x + ","+ this.elements[0].y + " L";
		for (var i=1; i < this.elements.length; i++) {
			str = str + this.elements[i].x + "," 
				+ this.elements[i].y + " ";
		}
	}
	return str;
};


gb.ui.Path.prototype.clear = function() {
	this.clearSet(this.objectSet);
};


gb.ui.Path.prototype.clearSet = function(objectSet) {
	if (objectSet && objectSet.length > 0) {
		objectSet.forEach(function(element){
			element.remove();
		});
		objectSet.clear();
	}
};

