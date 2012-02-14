goog.require('goog.events');
goog.require('goog.fx');
goog.require('goog.fx.dom');

goog.provide('gb.ui.Animator');



gb.ui.Animator = function(id, duration) {
	this.id = id;
	this.duration = duration;
	this.el = document.getElementById(this.id);
};

gb.ui.Animator.prototype.slide = function(a,b) {
	var x = this.el.offsetLeft;
	var y = this.el.offsetTop;
	var anim = new goog.fx.dom.Slide(this.el, [x, y], [a, b], this.duration, goog.fx.easing.easeOut);
	anim.play();	
}

