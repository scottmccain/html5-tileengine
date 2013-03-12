bitwisegames.map = function(engine, data) {	

	this.background = data.background;

	engine.registerImage(data.bottom_layer.texture.key, data.bottom_layer.texture.source);
	engine.registerImage(data.object_layer.texture.key, data.bottom_layer.texture.source);
	engine.registerImage(data.fringe_layer.texture.key, data.bottom_layer.texture.source);

	var viewport = {width:parseInt(engine.screen.width), height:parseInt(engine.screen.height)};
	
	console.log(viewport);
	console.log(data.tilesize);
	
	this.bottom_layer = new bitwisegames.layer(engine.getImage(data.bottom_layer.texture.key), data.bottom_layer.tiledata, data.tilesize, data.width, data.height, viewport);
	this.object_layer = new bitwisegames.layer(engine.getImage(data.object_layer.texture.key), data.object_layer.tiledata, data.tilesize, data.width, data.height, viewport);
	this.fringe_layer = new bitwisegames.layer(engine.getImage(data.fringe_layer.texture.key), data.fringe_layer.tiledata, data.tilesize, data.width, data.height, viewport);
	this.collision_layer = new bitwisegames.collisionLayer(data.collision_data, data.tilesize, data.width, data.height);
	
	engine.addDrawable(this.bottom_layer, 1);
	engine.addDrawable(this.object_layer, 2);
	
	// TODO: make enums for the different layers?
	// or kludge the getY() to always return -1 
	// for z sorting purposes?  so sprites on same
	// layer are draw on top of layer?
	engine.addDrawable(this.fringe_layer, 3);
	
	this.width = data.width;
	this.height = data.height;
	this.tilesize = data.tilesize;
};

bitwisegames.map.prototype.getCollideValue = function(cell) {

	return this.collision_layer.getCellKey(cell.elements[0], cell.elements[1]);
	
};