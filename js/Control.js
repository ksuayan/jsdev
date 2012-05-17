goog.provide('gb.ui.Control');
goog.require('gb.config.Default');
goog.require('gb.model.Point');

gb.ui.Control = function(x,y) {
	gb.model.Point.call(this,x,y);
};

goog.inherits(gb.ui.Control, gb.model.Point);

