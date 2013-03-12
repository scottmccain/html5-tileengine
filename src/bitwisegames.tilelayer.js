bitwisegames.tilelayer = function(texture, width, height) {
	
	this.texture = texture;
	this.width = width;
	this.height = height;
	
	this.tileMap = [];
	for(var i=0; i<height; i++) {
		this.tileMap[i] = [];
		for(var j=0;j<width;j++)
			this.tileMap[i][j] = '';
	}
	
	this.setCellKey = function(key, point) {
		this.tileMap[point.y][point.x] = key;
	};
	
	this.setCellKey = function(key, x, y) {
		this.tileMap[y][x] = key;
	};
	
	this.getCellKey = function(point) {
		return this.tileMap[point.y][point.x];
	};
	
	this.getCellKey = function(x, y) {
		return this.tileMap[y][x];
	};
};
