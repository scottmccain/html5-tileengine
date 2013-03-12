bitwisegames.conversation = function(name, text, handlers) {
	
	this.name = name;
	this.text = text;
	this.handlers = handlers;
};


bitwisegames.conversation.prototype.getName = function() {
	return this.name;
};

bitwisegames.conversation.prototype.getText = function() {
	return this.text;
};