goog.provide('gb.ui.Draggable');
goog.require('gb.config.Default');
goog.require('gb.model.Point');


gb.ui.DragConstraint = {
	NONE: 0,
	VERTICAL: 1,
	HORIZONTAL: 2
};


gb.ui.Draggable = function(x,y, element) {
	gb.model.Point.call(this,x,y);
	this.element = element;
};

goog.inherits(gb.ui.Draggable, gb.model.Point);


gb.ui.Draggable.prototype.setConstraint = function(constraint){
	this.constraint = constraint;
};

gb.ui.Draggable.prototype.setOnDragComplete = function(onDragComplete) {
	this.onDragComplete = onDragComplete;	
};

gb.ui.Draggable.prototype.setOnDragStart = function(onDragStart) {
	this.onDragStart = onDragStart;	
};

gb.ui.Draggable.prototype.activate = function() {
	
	var thisObj = this;
	var el = this.element;

	el.drag(
		
		// onDrag
		function(dx,dy) {
			var trans_x = trans_y = 0;
			
			switch (thisObj.constraint) {
				case gb.ui.DragConstraint.HORIZONTAL: 
					trans_x = dx - el.ox;	
					el.translate(trans_x, trans_y);
		    		el.ox = dx;
					break;

				case gb.ui.DragConstraint.VERTICAL: 
					trans_y = dy - el.oy;
					el.translate(trans_x, trans_y);
					el.oy = dy;
					break;
					
				default:
					trans_x = dx - el.ox;
					trans_y = dy - el.oy;
					el.translate(trans_x, trans_y);
					el.ox = dx;
					el.oy = dy;
			}

		},
		
		// onDragStart
		function() {
			if (typeof thisObj.onDragStart === 'function') {
				thisObj.onDragStart();
			}
			el.ox = 0;
			el.oy = 0;
		},
		
		// onDragEnd
		function() {
			switch (thisObj.constraint) {
				case gb.ui.DragConstraint.HORIZONTAL:
					thisObj.x = thisObj.x + el.ox;
					break;
				case gb.ui.DragConstraint.VERTICAL: 
					thisObj.y = thisObj.y + el.oy;
					break;
				default:
					thisObj.x = thisObj.x + el.ox;
					thisObj.y = thisObj.y + el.oy;

			}
			
			if (typeof thisObj.onDragComplete === 'function') {
				thisObj.onDragComplete();
			}
		}					
					
	);
					
};


