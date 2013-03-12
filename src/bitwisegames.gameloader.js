bitwisegames.gameloader = function(/*canvas, output, */ engine, desiredFPS) {

	this.fps = desiredFPS;
	this.engine = engine;
	
	// create the engine
	//this.engine = new bitwisegames.engine($(canvas).get(0), $(output), 32, 32);

	// this is the main update loop
	// called every game tick
	//this.animate = function() {
	//	this.engine.update();
	//	this.engine.draw();
	//};

	this.loadPlayer = function(data) {
		this.engine.registerImage(data.player.texture.key, data.player.texture.src);
		
		var player = new bitwisegames.animatedSprite(
				this.engine.getImage(data.player.texture.key).image,
				data.player.position,
				data.player.collisionRadius,
				data.player.originOffset);
		
		for(var j=0; j<data.player.animations.length; j++) {
			
			var ani = data.player.animations[j];
			var animation = new bitwisegames.frameAnimation(ani.frames, ani.width, ani.height, ani.offset.x, ani.offset.y, ani.fps);
			player.animations[ani.name] = animation;
		}		
		
		// TODO: move player into a class
		player.handleCollision = function(collidable) {
			var diff = collidable.getOrigin().subtract(this.getOrigin()).toUnitVector();
			this.position =
				collidable.position.subtract((diff.x(this.collisionRadius+collidable.collisionRadius)));
			
		};
		
		this.engine.addDrawable(player, 2);
		
		this.engine.setControlled(player);
		this.engine.setCameraFollowing(player);
	};
	
	this.loadSprites = function(data) {
		for(var i=0; i<data.sprites.length; i++) {

			this.engine.registerImage(data.sprites[i].texture.key, data.sprites[i].texture.src);
			
			var sprite = new bitwisegames.animatedSprite(
					this.engine.getImage(data.sprites[i].texture.key).image,
					data.sprites[i].position,
					data.sprites[i].collisionRadius,
					data.sprites[i].originOffset);
			
			for(var j=0; j<data.sprites[i].animations.length; j++) {
				
				var ani = data.sprites[i].animations[j];
				var animation = new bitwisegames.frameAnimation(ani.frames, ani.width, ani.height, ani.offset.x, ani.offset.y, ani.fps);
				sprite.animations[ani.name] = animation;
			}
			
			sprite.setIsAnimating(data.sprites[i].isAnimating);
			
			this.engine.addCollidable(sprite);
			this.engine.addDrawable(sprite, 2);
		}
		
	};
	
	this.loadScripts = function(data) {

		var scripts = {}, conversations = {}, handlers = [];
		for(var i=0; i<data.scripts.length; i++) {
			
			conversations = {};
			
			for(var j=0; j<data.scripts[i].conversations.length;j++) {
			
				handlers = [];
				
				for(var k=0; k<data.scripts[i].conversations[j].handlers.length;k++) {
					
					var handlerData = data.scripts[i].conversations[j].handlers[k];
					
					
					var parts = handlerData.action.split(':');
					
					// let's get action and parameters
					var action = parts[0];
					var parameters = [];
					if (parts.length > 1) {
						
						var parameterParts = parts[1].split(",");
						for(var p=0;p<parameterParts.length;p++) {
							parameters.push(parameterParts[p]);
						}
					}
					
					handlers.push(new bitwisegames.conversationHandler(handlerData.caption, action, parameters));
				}
				
				var conversationData = data.scripts[i].conversations[j];
				
				conversations[conversationData.name] = new bitwisegames.conversation(conversationData.name, conversationData.text, handlers);
			}
			
			var scriptData = data.scripts[i];
			scripts[scriptData.name] = new bitwisegames.script(scriptData.name, conversations);
		}
		
		return scripts;
	};
	
	this.initializeData = function(data) {
		
		// create a new map
		this.engine.maps[data.mapID] = new bitwisegames.map(this.engine, data.map);
		
		//this.loadSprites(data);
		this.loadPlayer(data);
		var scripts = this.loadScripts(data);
		
		// TODO: Replace with scripting or data somehow
		// for now it's hardcoded though
		this.engine.registerImage('npc-2', 'images/npc-2.png');
		var npc = new bitwisegames.npc(
				this.engine.getImage('npc-2').image,
				{x:190, y:70},
				12.0,
				{x:16, y:32});	
		
		var animation = new bitwisegames.frameAnimation(2, 32, 32, 32, 0, 2.0);
		npc.animations['default'] = animation;
		npc.animating = false;

		var dialog = this.engine.dialog;

		// turn dialog off 
		dialog.visible = false;
		
		npc.script = scripts['npc-1'];
		npc.dialog = dialog;
		
		// create a dialog trigger
		// for our npc, set it at the 
		// same spot our npc is standing at
		var trigger = new bitwisegames.dialogTrigger(npc, 'greeting', npc.position, npc.originOffset, npc.speakingRadius); 
		this.engine.addTrigger(trigger);
		
		// this npc is collidable, add it to the collidable collection
		this.engine.addCollidable(npc);
		
		// it's also drawable
		this.engine.addDrawable(npc, 2);
	};
	
	this.loadData = function(dataPath, mapName, callback) {
	  

		var self = this;
		
		$.ajax({
		
			url: dataPath,
			dataType: 'json',
			success: function(data) {
				  
				// populate structures from data
				self.initializeData(data);
			  		
				// and finally start the whole shebang running
				self.engine.initialize(mapName, 0, 0);
				  
				if (typeof(callback) === "function") {
					callback();
				}
			  }
		});
	};
};
