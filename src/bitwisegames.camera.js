bitwisegames.camera = function() {
	this.position = Vector.create([0, 0]);
	this.following = null;
};

bitwisegames.camera.prototype.getX = function() {
	return this.position.elements[0];
};

bitwisegames.camera.prototype.getY = function() {
	return this.position.elements[1];
};

bitwisegames.camera.prototype.setX = function(val) {
	this.position.elements[0] = val;
};

bitwisegames.camera.prototype.setY = function(val) {
	this.position.elements[1] = val;
};

bitwisegames.camera.prototype.update = function(engine) {

	if (this.following != null) {
		
		var sprite = this.following;
		var position = this.position;
		
		position.elements[0] = sprite.position.elements[0] +
			(sprite.getCurrentAnimation().getCurrentRect().width / 2) - 
			(engine.screen.width / 2);

		position.elements[1] = sprite.position.elements[1] +
			(sprite.getCurrentAnimation().getCurrentRect().height / 2) - 
			(engine.screen.height / 2);
	}
	
	var tileMapWidth = engine.getMapWidth() * engine.getTileWidth();
	var tileMapHeight = engine.getMapHeight() * engine.getTileHeight();
	
	var maxX = engine.screen.width;
	if (tileMapWidth > engine.screen.width) {
		maxX = tileMapWidth - engine.screen.width;
	}
	
	var maxY = engine.screen.height;
	if (tileMapHeight > engine.screen.height) {
		maxY = tileMapHeight - engine.screen.height;
	}
	
	this.clamp(0, 0, maxX, maxY);
};

bitwisegames.camera.prototype.clamp = function(x, y, width, height) {

	if( this.getX() < x ) {
		this.setX(x);
	}

	if( this.getY() < y ) {
		this.setY(y);
	}

	if( this.getX() > width ) {
		this.setX(width);
	}

	if( this.getY() > height) {
		this.setY(height);
	}
};

