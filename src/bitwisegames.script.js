bitwisegames.script = function(name, conversations) {
	
	this.name = name;
	this.conversations = conversations;
	
};

bitwisegames.script.prototype.get = function(name) {
	
	return this.conversations[name];
};