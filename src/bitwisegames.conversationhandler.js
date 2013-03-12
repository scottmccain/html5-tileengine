bitwisegames.conversationHandler = function(caption, action, parameters) {
	
	this.caption = caption;
	this.action = action;
	this.parameters = parameters || [];
	
	
	this.getCaption = function() {
		return this.caption;
	};
};

bitwisegames.conversationHandler.prototype.invoke = function(target) {
	
	if (typeof(target[this.action]) === 'function') {
		
		var func = target[this.action];
		func.apply(target, this.parameters);
	} 
};