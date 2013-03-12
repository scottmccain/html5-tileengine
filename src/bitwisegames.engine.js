bitwisegames.engine = function(canvas, tileWidth, tileHeight, viewportWidth, viewportHeight) {
	
	this.canvas = canvas;
	
	var engine = this;
	
	this.output = function(message) {
	};
	
	this.getImageData = function(id) {
		if( this.images.hasOwnProperty(id) ) {
			return this.images[id];
		} else {
			return false;
		}
	};
	
	
	this.setCurrentMap = function(id) {
		this.currentMap = id;
	};	
	
	this.allImagesLoaded = function() {
		
		for (var key in engine.images) {
			var img = engine.images[key];
	      if(img.loaded === false) {
	         return false;
	      }
	   }  

	   return true;
	};	
	
    this.createRectangleForCell = function(cell) {
    	return createRectangle(cell.elements[0] * this.getTileWidth(),
            	cell.elements[1] * this.getTileHeight(),
            	this.getTileWidth(),
            	this.getTileHeight());
    };
    
	this.convertPositionToCell = function(position) {
		
		var cellX = parseInt(position.elements[0] / this.getTileWidth());
		var cellY = parseInt(position.elements[1] / this.getTileHeight());
		
		return Vector.create([cellX, cellY]);
	};
	
	this.checkForUnwalkableTile = function(sprite) {
		
        var spriteCell = this.convertPositionToCell(sprite.getCenter());

        var up = null,
            left = null, 
            right = null,
            down = null;

        if (spriteCell.elements[1] > 0)
            up = Vector.create([spriteCell.elements[0], spriteCell.elements[1] - 1]);

        if (spriteCell.elements[1] < this.getMapHeight() )
            down = Vector.create([spriteCell.elements[0], spriteCell.elements[1] + 1]);

        if (spriteCell.elements[0] > 0)
            left = Vector.create([spriteCell.elements[0] - 1, spriteCell.elements[1]]);

        if (spriteCell.elements[0] < this.getMapWidth() - 1)
            right = Vector.create([spriteCell.elements[0] + 1, spriteCell.elements[1]]);

        if (spriteCell.elements[0] > 0 && spriteCell.elements[1] > 0)
            upLeft = Vector.create([spriteCell.elements[0] - 1, spriteCell.elements[1] - 1]);

        if (spriteCell.elements[0] < this.getMapWidth() - 1 && spriteCell.elements[1] > 0)
            upRight = Vector.create([spriteCell.elements[0] + 1, spriteCell.elements[1] - 1]);

        if (spriteCell.elements[0] > 0 && spriteCell.elements[1] < this.getMapHeight() - 1)
            downLeft = Vector.create([spriteCell.elements[0] - 1, spriteCell.elements[1] + 1]);

        if (spriteCell.elements[0] < this.getMapWidth() - 1 &&
            spriteCell.elements[1] < this.getMapHeight() - 1)
            downRight = Vector.create([spriteCell.elements[0] + 1, spriteCell.elements[1] + 1]);

        if (up != null &&  this.getCollideValue(up) == 1) {
        	
            var cellRect = this.createRectangleForCell(up);
            var spriteRect = sprite.getBounds();
            
            if (rectanglesIntersect(spriteRect, cellRect)) {
                sprite.setY( spriteCell.elements[1] * this.getTileHeight() );    
            }
        }

        if (left != null && this.getCollideValue(left) == 1) {
            var cellRect = this.createRectangleForCell(left);
            var spriteRect = sprite.getBounds();
            
            if (cellRect.intersects(spriteRect)) {
                sprite.position.elements[0] = spriteCell.elements[0] * this.getTileWidth();
            }

        }

        if (right != null && this.getCollideValue(right) == 1) {
            var cellRect = this.createRectangleForCell(right);
            var spriteRect = sprite.getBounds();

            if (cellRect.intersects(spriteRect)) {
                sprite.position.elements[0] = right.elements[0] * this.getTileWidth() - sprite.getBounds().width;
            }

        }

        if (down != null && this.getCollideValue(down) == 1) {
            var cellRect = this.createRectangleForCell(down);
            var spriteRect = sprite.getBounds();

            if (cellRect.intersects(spriteRect)) {
                sprite.position.elements[1] = down.elements[1] * this.getTileHeight() - sprite.getBounds().height;
            }
        }
    };
	
	this.checkCollision = function(collidableA, collidableB) {
			if (collidableA.isColliding(collidableB)) {
				return true;
				//collidableA.handleCollision(collidableB);
			}
			
			return false;
		//}
	};
	
	this.getTileWidth = function() {
		if (this.maps.hasOwnProperty(this.currentMap)) {
			return this.maps[this.currentMap].tilesize.width;
		}
	};
	
	this.getTileHeight = function() {
		if (this.maps.hasOwnProperty(this.currentMap)) {
			return this.maps[this.currentMap].tilesize.height;
		}
	};
	
//	this.getTileImage = function() {
//		if (this.maps.hasOwnProperty(this.currentMap)) {
//			return this.maps[this.currentMap].tileimage.image;
//		}
//	};
	
	this.updatePlayerState = function() {
		
		var zeroVector = Vector.create([0, 0]);
	  	
	  	var tileMapWidth = this.getMapWidth() * engine.getTileWidth();
	  	var tileMapHeight = this.getMapHeight() * engine.getTileHeight();
	  		
	  	var motion = Vector.create([0, 0]);
	  	if (inputHelper.isKeyDown('up')) {
	  		motion.elements[1] ++;
	  	} 
	  	
	  	if (inputHelper.isKeyDown('down')) {
			motion.elements[1] --;
	  	}
	  	if (inputHelper.isKeyDown('left')) {
	  		motion.elements[0] ++;
	  	}

	  	if (inputHelper.isKeyDown('right')) {
	  		motion.elements[0] --;
	  	}
	  	
	  	if (inputHelper.isKeyDown('fire')) {
	  	}

		var PiOver4 = Math.PI / 4.0;
		
		if( !motion.eql(zeroVector)) {
			motion = motion.toUnitVector();
			this.player.setIsAnimating(true);
			this.player.position = this.player.position.add(motion.x(this.player.speed * -1));
			motion = motion.x(-1);
			
			var motionAngle = parseFloat(Math.atan2(motion.elements[1], motion.elements[0]));
			
			if (motionAngle >= -(PiOver4) && motionAngle <= PiOver4) {
				this.player.setCurrentAnimationName('right');
			} else if (motionAngle >= PiOver4 && motionAngle <= 3.0 * PiOver4) {
				this.player.setCurrentAnimationName('down');
			} else if (motionAngle <= PiOver4 && motionAngle >= -3.0 * PiOver4) {
				this.player.setCurrentAnimationName('up');
			} else {
				this.player.setCurrentAnimationName('left');
			}
			
			this.lastmotion = motion;
			
		} else {
			
			if( typeof(this.lastmotion) !== 'undefined') {
				
				var motionAngle = parseFloat(Math.atan2(this.lastmotion.elements[1], this.lastmotion.elements[0]));
				
				if (motionAngle >= -(PiOver4) && motionAngle <= PiOver4) {
					this.player.setCurrentAnimationName('right-standing');
				} else if (motionAngle >= PiOver4 && motionAngle <= 3.0 * PiOver4) {
					this.player.setCurrentAnimationName('down-standing');
				} else if (motionAngle <= PiOver4 && motionAngle >= -3.0 * PiOver4) {
					this.player.setCurrentAnimationName('up-standing');
				} else {
					this.player.setCurrentAnimationName('left-standing');
				}
				
			}
			
			this.player.setIsAnimating(false);	
		}
	  		
		if( this.player.getX() < 0 ) {
			this.player.setX( 0 );
		}

		if( this.player.getY() < 0 ) {
			this.player.setY( 0 );
		}      		

		if( this.player.getX() > tileMapWidth - this.player.getCurrentAnimation().getCurrentRect().width) {
			this.player.setX( tileMapWidth - this.player.getCurrentAnimation().getCurrentRect().width );
		}

		if( this.player.getY() > tileMapHeight - this.player.getCurrentAnimation().getCurrentRect().height) {
			this.player.setY( tileMapHeight - this.player.getCurrentAnimation().getCurrentRect().height );
		}

	};
	
	this.checkTrigger = function(a, b) {
		
	};
	
	this.handle = this.canvas.getContext("2d");
	
	this.currentMap = '';

	this.maps = {};
	this.images = {};
	
	this.screen = {};
	this.screen.width  = this.canvas.width;
	this.screen.height = this.canvas.height;

	this.gameTime = new bitwisegames.gameTime();
	this.keyboard = new bitwisegames.keyboard();
	this.camera = new bitwisegames.camera();
	
	this.player = null;

	this.conversations = {};
	this.sprites = [];
	this.npcs = [];
	this.collidables = [];
	this.triggers = [];
	
	// max 10 layers - can add more later - this is for optimization
	this.drawobjects = [ [], [], [], [], [], [], [], [], [], []];
	
	// only one dialog is available at a time
	this.dialog = new bitwisegames.dialog(this);
	//this.addDrawable(dialog, 10);
};


bitwisegames.engine.prototype.addConversation = function(name, conversation) {
	this.conversations[name] = conversation;
};

bitwisegames.engine.prototype.getCollideValue = function(cell) {

	if (this.maps.hasOwnProperty(this.currentMap)) {
		return this.maps[this.currentMap].getCollideValue(cell); //collision_layer.getCellKey(cell.elements[0], cell.elements[1]);
	}
	
};

bitwisegames.engine.prototype.addTrigger = function(trigger) {
	this.triggers.push(trigger);
};

bitwisegames.engine.prototype.getMapWidth = function() {
	
	if (this.maps.hasOwnProperty(this.currentMap)) {
		return this.maps[this.currentMap].width;
	}
};

bitwisegames.engine.prototype.getMapHeight = function() {
	
	if (this.maps.hasOwnProperty(this.currentMap)) {
		return this.maps[this.currentMap].height;
	}
};

bitwisegames.engine.prototype.registerImage = function(id, src) {
	
	var rec = {id:id, image:new Image(), loaded:false};
	rec.image.src = src;
	rec.image.onload = function() {
		rec.loaded = true;
	};
	
	this.images[id] = rec;
};

bitwisegames.engine.prototype.getImage = function(id) {
	return this.getImageData(id);
};

bitwisegames.engine.prototype.initialize = function(mapid, viewportX, viewportY, callback) {
   
	this.output('starting...');

	this.camera.setX(viewportX);
	this.camera.setY(viewportY);
	
	this.setCurrentMap(mapid);
	
	this.output('done');
};

bitwisegames.engine.prototype.update = function() {
	
	this.gameTime.update();

	inputHelper.update(this.keyboard);
	this.camera.update(this);

	if(!this.dialog.visible) {
		this.updatePlayerState();
		this.checkForUnwalkableTile(this.player);
	}
	
	// TODO: add dialog triggers
	// check if element has a dialog trigger
	// and check for it being trigger
	// then invoke the dialog
//	for(var i=0; i<this.sprites.length; i++) {
//		this.sprites[i].update(this.gameTime);
//		this._checkCollision(this.sprites[i]);
//		
//		if (this.sprites[i] instanceof bitwisegames.npc) {
//			if (this.sprites[i].inSpeakingRange(this.player) 
//					&& !this.dialog.visible 
//					&& inputHelper.isNewKeyPress('space')) {
//				
//				// stop any animation the player may be doing
//				this.player.setIsAnimating(false);	
//				this.sprites[i].beginConversation('greeting');
//			}
//		}
//	}
	
	for(var i=0; i<this.triggers.length; i++) {
		this.triggers[i].Update(this.gameTime);
		this.triggers[i].Check(this.player);
	}
	
	for(var i=0; i<this.collidables.length;i++) {
		if (this.checkCollision(this.player, this.collidables[i])) {
			this.player.handleCollision(this.collidables[i]);
		}
	}
	
	for(var i=0; i<this.drawobjects.length;i++) {
		for(var j=0; j<this.drawobjects[i].length;j++) {
			this.drawobjects[i][j].update(this.gameTime);
		}
	}
	
	this.dialog.update(this.gameTime);
	
};

bitwisegames.engine.prototype.draw = function() {

	// if we don't have a current map, 
	// or the current map is invalid then return
	if(!this.maps.hasOwnProperty(this.currentMap))
		return;
	
	var self = this;
	
	// wait for the images to load
	if(!this.allImagesLoaded()) {
		var canvas = this.handle;
		var msg = "Loading Images ...";

		canvas.save();
		
		this.handle.fillStyle = 'rgb(154,206,255)';
		this.handle.fillRect(0, 0, this.screen.width, this.screen.height);
		
		//canvas.font = '15px Courier New';
		canvas.textBaseline = "top"; 
		canvas.shadowColor = "rgb(32,64,128)";
		canvas.shadowOffsetX = 3;
		canvas.shadowOffsetY = 3;
		canvas.shadowBlur = 8;
		
		canvas.fillStyle = 'rgb(244,244,244)';
		canvas.font = '28pt Unkempt';
		var width = canvas.measureText(msg).width;
		
		var x = (self.screen.width - width)/ 2;
		var y = self.screen.height / 2;
		
		canvas.fillText(msg, x, y);
		
		canvas.restore();

	} else {
		
		var canvas = this.handle;
		
		canvas.save();
		canvas.fillStyle = this.maps[this.currentMap].background;
		canvas.fillRect(0, 0, this.screen.width, this.screen.height);
		canvas.restore();
		
		for (var i=0; i<this.drawobjects.length;i++) {
			this.drawobjects[i].sort(function(a, b) {
				return a.getY() > b.getY() ? 1 : a.getY() <  b.getY() ? -1 : 0;
			});
			
			for(var j=0; j<this.drawobjects[i].length; j++) {
				this.drawobjects[i][j].draw(canvas, this.camera, this.gameTime);
			}			
		}
		
		this.dialog.draw(canvas, this.camera, this.gameTime);
	}
	
};

bitwisegames.engine.prototype.addCollidable = function(collidable) {
	this.collidables.push(collidable);
};

// set the current element being controlled by the controls
// this can be changed to other elements to simulate controlling
// other creatures or entities in the game among other effects
bitwisegames.engine.prototype.setControlled = function(controlled) {
	
	this.player = controlled;
};

// set the element that is currently being followed by the camera
bitwisegames.engine.prototype.setCameraFollowing = function(followed) {
	this.camera.following = followed;
};


bitwisegames.engine.prototype.addDrawable = function(drawable, level) {
	
	if (level > this.drawobjects.length) {
		// add empty levels
		while(this.drawobjects.length < level) {
			this.drawobjects.push([]);
		}
	}
	
	this.drawobjects[level - 1].push(drawable);
	
//	this.drawobjects.push({level:level, drawable:drawable});
//	
//	this.max_drawable = Math.max(this.max_drawable, level);
};

