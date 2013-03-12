bitwisegames.circularTriggerRegion = function(pos, radius) {
    this._position = pos;
    this._radius = radius;

    this.IsTouching = function(pos, radius) {
    	
    	return this.position.distanceFrom(pos) < (radius + this._radius );
    };
	
};