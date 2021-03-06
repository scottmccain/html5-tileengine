bitwisegames.animatedSprite = function(texture, position, collisionRadius, originOffset) {

	this.animations = {};
	this.currentAnimation = '';
	
	this.animating = true;
	this.speed = 2.0;

	this.texture = typeof(texture) == 'undefined' ? {} : texture;
	this.position = typeof(position) == 'undefined' ? Vector.create([0, 0]) : Vector.create([position.x, position.y]);
	this.collisionRadius = typeof(collisionRadius) == 'undefined' ? 16.0 : collisionRadius;
	this.originOffset = typeof(originOffset) == 'undefined' ? Vector.create([16, 32]) : Vector.create([originOffset.x, originOffset.y]);
};


bitwisegames.animatedSprite.prototype.getOrigin = function() {
	return this.position.add(this.originOffset); 
};

// TODO: this should be part of the ICollidable interface
// and the engine will have a collidables collection
bitwisegames.animatedSprite.prototype.isColliding = function(sprite) {

	var origin = this.getOrigin();
	var spriteOrigin = sprite.getOrigin();
	var radius = this.collisionRadius + sprite.collisionRadius;
	
	var dsquared = (origin.elements[0]-spriteOrigin.elements[0])*(origin.elements[0]-spriteOrigin.elements[0]) + (origin.elements[1]-spriteOrigin.elements[1])*(origin.elements[1]-spriteOrigin.elements[1]);
	return dsquared < radius*radius;
};


bitwisegames.animatedSprite.prototype.getCenter = function() {
	return this.position.add(Vector.create([this.getCurrentAnimation().getCurrentRect().width / 2, this.getCurrentAnimation().getCurrentRect().height / 2]));
};

bitwisegames.animatedSprite.prototype.getBounds = function() {
	return createRectangle( parseInt(this.getX()), parseInt(this.getY()), this.getCurrentAnimation().getCurrentRect().width, this.getCurrentAnimation().getCurrentRect().height);
};


bitwisegames.animatedSprite.prototype.getIsAnimating = function() {
	return this.animating;
};

bitwisegames.animatedSprite.prototype.setIsAnimating = function(value) {
	this.animating = value;
};

bitwisegames.animatedSprite.prototype.getCurrentAnimation = function() {
	if( this.currentAnimation != '' ) {
		return this.animations[this.currentAnimation];
	} else {
		for(var prop in this.animations) {
	        if(this.animations.hasOwnProperty(prop)) {
	        	this.currentAnimation = prop;
	        	return this.animations[this.currentAnimation];
	        }
		}
		
		return null;
	}
};

bitwisegames.animatedSprite.prototype.setCurrentAnimationName = function(value) {
	if (this.animations.hasOwnProperty(value)) {
		this.currentAnimation = value;
	}
};

bitwisegames.animatedSprite.prototype.getCurrentAnimationName = function() {
	return this.currentAnimation;
};

bitwisegames.animatedSprite.prototype.update = function(gameTime) {
	
	if (!this.getIsAnimating())
		return;
	
	var animation = this.getCurrentAnimation();
	if( animation === null)
		return;
	
	animation.update(gameTime);
};

bitwisegames.animatedSprite.prototype.draw = function(canvas, camera, gameTime) {

	var animation = this.getCurrentAnimation();
	if (animation === null)
		return;
	
	var rect = animation.getCurrentRect();
	canvas.drawImage(this.texture, rect.x, rect.y, rect.width, rect.height, this.position.elements[0] - parseInt(camera.getX()), this.position.elements[1] - parseInt(camera.getY()), rect.width, rect.height);
};

bitwisegames.animatedSprite.prototype.setSpeed = function(speed) {
	this.speed = Math.max(speed, .1);
};

bitwisegames.animatedSprite.prototype.getSpeed = function() {
	return this.speed;
};

bitwisegames.animatedSprite.prototype.getX = function() {
	return this.position.elements[0];
};

bitwisegames.animatedSprite.prototype.getY = function() {
	return this.position.elements[1];
};

bitwisegames.animatedSprite.prototype.setX = function(val) {
	this.position.elements[0] = val;
};

bitwisegames.animatedSprite.prototype.setY = function(val) {
	this.position.elements[1] = val;
};

