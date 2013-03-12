bitwisegames.collisionLayer = function(layerdata, tilesize, width, height) {
	
	this.data = layerdata;
	this.width = width;
	this.height = height;
	this.tilesize = tilesize;
	
	this.setCellKey = function(key, point) {
		this.data[point.y][point.x] = key;
	};
	
	this.setCellKey = function(key, x, y) {
		this.data[y][x] = key;
	};
	
	this.getCellKey = function(point) {
		return this.data[point.elements[1]][point.elements[0]];
	};
	
	this.getCellKey = function(x, y) {
		return this.data[y][x];
	};		
};

