
bitwisegames.npc = function(texture, position, collisionRadius, originOffset) {

	this.beginConversation = function(name) {
		
		if (this.script === null || this.dialog === null)
			return;
		
		this.dialog.conversation = this.script.get(name);
		this.dialog.npc = this;

		// tell dialog to initialize on next update
		this.dialog.initialize = true;
		this.dialog.show();
	};

	this.endConversation = function() {
		if (this.dialog === null)
			return;
		
		this.dialog.hide();
	};
	
	this.animations = {};
	this.currentAnimation = '';
	
	this.animating = true;
	this.speed = 2.0;

	this.speakingRadius = 25.0;
	
	this.script = null;
	this.dialog = null;

	this.texture = typeof(texture) == 'undefined' ? {} : texture;
	this.position = typeof(position) == 'undefined' ? Vector.create([0, 0]) : Vector.create([position.x, position.y]);
	this.collisionRadius = typeof(collisionRadius) == 'undefined' ? 12.0 : collisionRadius;
	this.originOffset = typeof(originOffset) == 'undefined' ? Vector.create([16, 32]) : Vector.create([originOffset.x, originOffset.y]);
	
};

bitwisegames.npc.prototype = new bitwisegames.animatedSprite();
bitwisegames.npc.prototype.constructor=bitwisegames.npc;

bitwisegames.npc.prototype.getSpeakingRadius = function() {
	return this.speakingRadius;
};

bitwisegames.npc.prototype.setSpeakingRadius = function(val) {
	this.speakingRadius = Math.max(this.collisionRadius, val);
};

bitwisegames.npc.prototype.handleCollision = function(collidable) {
};

bitwisegames.npc.prototype.inSpeakingRange = function(sprite) {
	
	var origin = this.position.add(this.originOffset);
	var spriteOrigin = sprite.getOrigin();
	
	var dsquared = (origin.elements[0]-spriteOrigin.elements[0])*(origin.elements[0]-spriteOrigin.elements[0]) + (origin.elements[1]-spriteOrigin.elements[1])*(origin.elements[1]-spriteOrigin.elements[1]);
	return dsquared < this.speakingRadius*this.speakingRadius;
	
};




