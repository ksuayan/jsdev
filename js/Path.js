goog.provide('gb.model.Path');

gb.model.Path = function() {
	this.path = [];
};

gb.model.Path.prototype.add = function(obj) {
	var len = this.path.length;
	this.path[len] = obj;
};

gb.model.Path.prototype.toString = function() {
	var str ="Path[";
	var len = this.path.length;
	
	for (var i=0; i < len; i++) {
		str = str + this.path[i].toString();
	}
	str += "]";
	
	return str;
}
