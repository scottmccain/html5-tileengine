bitwisegames.layer = function(tiletexture, layerdata, tilesize, width, height, viewport) {
	
	this.data = layerdata;
	this.height = height;
	this.width = width;
	this.tilesize = tilesize;
	this.tiletexture = tiletexture;
	this.viewport = viewport;
	
	this.convertPositionToCell = function(position) {
		
		var cellX = parseInt(position.elements[0] / this.tilesize.width);
		var cellY = parseInt(position.elements[1] / this.tilesize.height);
		
		return Vector.create([cellX, cellY]);
	};
	
	this.drawTile = function(canvas, x, y, tileindex) {
		var width = this.tilesize.width;
		var height = this.tilesize.height;
		
		if( this.tiletexture ) {
			canvas.drawImage(this.tiletexture.image, tileindex * width, 0, width, height, x, y, width, height);
		}		
	};	
	
	this.getX = function() {
		return 0;
	};
	
	this.getY = function() {
		return -1;
	};
	
	this.update = function(gametime) {
		// nothing to do
	};
	
	this.draw = function(canvas, camera, gametime) {
		
		var view = Vector.create([parseInt(this.viewport.width + this.tilesize.width), parseInt(this.viewport.height + this.tilesize.height)]);
		
		var maxpos = camera.position.add(view);
		
		var minPoint = this.convertPositionToCell(camera.position);
		var maxPoint = this.convertPositionToCell(maxpos);
		
		minPoint.elements[0] = parseInt(Math.max(minPoint.elements[0], 0));
		minPoint.elements[1] = parseInt(Math.max(minPoint.elements[1], 0));
		
		maxPoint.elements[0] = parseInt(Math.min(maxPoint.elements[0], this.viewport.width));
		maxPoint.elements[1] = parseInt(Math.min(maxPoint.elements[1], this.viewport.height));

		for(var mapY=minPoint.elements[1]; mapY<maxPoint.elements[1]; mapY++) {
			for(var mapX=minPoint.elements[0]; mapX<maxPoint.elements[0]; mapX++) {
				
				var tile = -1;
				
				if(this.data[mapY] &&
					this.data[mapY][mapX]) {
					
					tile = this.data[mapY][mapX];
				} 
				
				if( tile != -1) {
					this.drawTile(
							canvas,
							mapX * this.tilesize.width - parseInt(camera.getX()), 
							mapY * this.tilesize.height - parseInt(camera.getY()), 
							tile);
				}
			}
		}
	};
	
	this.setCellKey = function(key, point) {
		this.data[point.y][point.x] = key;
	};
	
	this.setCellKey = function(key, x, y) {
		this.data[y][x] = key;
	};
	
	this.getCellKey = function(point) {
		return this.data[y][x];
	};
	
	this.getCellKey = function(x, y) {
		return this.data[y][x];
	};	
};

