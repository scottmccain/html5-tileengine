bitwisegames.trigger = function() {
    
//    this._checkTrigger = function(pos, radius) {
//        if (this.regionOfInfluence !== null) {
//            return this.regionOfInfluence.getIsTouching(pos, radius);
//        }
//        
//        return false;
//    };
    
//    this.regionOfInfluence = null;
};

bitwisegames.trigger.prototype.getRemoveFromGame = function() {
    return this.removeFromGame;
};

bitwisegames.trigger.prototype.setRemoveFromGame = function(value) {
    this.removeFromGame = value;
};

//bitwisegames.trigger.prototype.addTriggerRegion = function(region) {
//    this.regionOfInfluence = region;
//};


// override functions
bitwisegames.trigger.prototype.Check = function(entity) {
};

bitwisegames.trigger.prototype.Update = function(gameTime) {
};
 

bitwisegames.dialogTrigger = function(owner, conversationName, position, originOffset, speakingRadius) {

	this.inSpeakingRange = function(collidable) {
		
		var origin = this.position.add(this.originOffset);
		var collidableOrigin = collidable.getOrigin();
		
		var dsquared = (origin.elements[0]-collidableOrigin.elements[0])*(origin.elements[0]-collidableOrigin.elements[0]) + (origin.elements[1]-collidableOrigin.elements[1])*(origin.elements[1]-collidableOrigin.elements[1]);
		return dsquared < this.speakingRadius*this.speakingRadius;
		
	};	

	this.originOffset = originOffset;
	this.position = position;
    this.triggered = false;
    this.conversationName = conversationName;
    this.owner = owner;
    this.speakingRadius = speakingRadius;
};

bitwisegames.dialogTrigger.prototype = new bitwisegames.trigger();
bitwisegames.dialogTrigger.prototype.constructor=bitwisegames.dialogTrigger;

bitwisegames.dialogTrigger.prototype.Check = function(entity) {

	if (this.inSpeakingRange(entity)) {
        // only trigger if this is the first time npc entered region
        if (!this.triggered) {
            this.triggered = true;
            this.owner.setIsAnimating(false);      
            entity.setIsAnimating(false);
            
            this.owner.beginConversation(this.conversationName);
        }
	} else {
        this.triggered = false;
    }
};