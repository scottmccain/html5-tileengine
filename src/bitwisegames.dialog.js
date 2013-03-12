var DEBUG = false;

function drawBubble(ctx, x, y, w, h, radius)
{
  var r = x + w;
  var b = y + h;
  ctx.beginPath();
  ctx.strokeStyle="black";
  ctx.fillStyle="white";
  ctx.lineWidth="2";
  ctx.moveTo(x+radius, y);
  //ctx.lineTo(x+radius/2, y-10);
  //ctx.lineTo(x+radius * 2, y);
  ctx.lineTo(r-radius, y);
  ctx.quadraticCurveTo(r, y, r, y+radius);
  ctx.lineTo(r, y+h-radius);
  ctx.quadraticCurveTo(r, b, r-radius, b);
  ctx.lineTo(x+radius, b);
  ctx.quadraticCurveTo(x, b, x, b-radius);
  ctx.lineTo(x, y+radius);
  ctx.quadraticCurveTo(x, y, x+radius, y);
  ctx.stroke();
  ctx.fill();
}

var multiFillText = function(ctx, text, x, y, lineHeight, fitWidth) {
    var draw = x !== null && y !== null;

    text = text.replace(/(\r\n|\n\r|\r|\n)/g, "\n");
    sections = text.split("\n");

    var i, str, wordWidth, words, currentLine = 0,
        maxHeight = 0,
        maxWidth = 0;

    var printNextLine = function(str) {
        if (draw) {
            ctx.fillText(str, x, y + (lineHeight * currentLine));
        }

        currentLine++;
        wordWidth = ctx.measureText(str).width;
        if (wordWidth > maxWidth) {
            maxWidth = wordWidth;
        }
    };

    for (i = 0; i < sections.length; i++) {
        words = sections[i].split(' ');
        index = 1;

        while (words.length > 0 && index <= words.length) {

            str = words.slice(0, index).join(' ');
            wordWidth = ctx.measureText(str).width;

            if (wordWidth > fitWidth) {
                if (index === 1) {
                    // Falls to this case if the first word in words[] is bigger than fitWidth
                    // so we print this word on its own line; index = 2 because slice is
                    str = words.slice(0, 1).join(' ');
                    words = words.splice(1);
                } else {
                    str = words.slice(0, index - 1).join(' ');
                    words = words.splice(index - 1);
                }

                printNextLine(str);

                index = 1;
            } else {
                index++;
            }
        }

        // The left over words on the last line
        if (index > 0) {
            printNextLine(words.join(' '));
        }


    }

    maxHeight = lineHeight * (currentLine);

    if (DEBUG) {
        ctx.strokeRect(x, y, maxWidth, maxHeight);
    }

    if (!draw) {
        return {
            height: maxHeight,
            width: maxWidth
        };
    }
};

var multiMeasureText = function(ctx, text, lineHeight, fitWidth) {
    return multiFillText(ctx, text, null,null, lineHeight, fitWidth);
};



bitwisegames.dialog = function(engine) {
	
	this.keyboard = engine.keyboard;
	
	this.backgroundTexture = null;
	this.area = {x:0, y:0, width:300, height:200};
	
	this.visible = true;
	this.npc = null;
	this.conversation = null;
	this.currentHandler = 0;
	this.lastKeyState = null;
	this.initialize = true;
	this.screen = {width:engine.screen.width, height:engine.screen.height};
};

// IDrawable


bitwisegames.dialog.prototype.getX = function() {
	return this.screen.width / 2;
};


// HACK: return maximum y so always drawn on top
bitwisegames.dialog.prototype.getY = function() {
	return Math.pow(2, 53);
};

bitwisegames.dialog.prototype.draw = function(canvas, camera, gameTime) {
	
	if (!this.visible) return;
	
	var dest = {x:this.screen.width / 2 - this.area.width / 2, y:this.screen.height / 2 - this.area.height / 2, width:this.area.width, height:this.area.height};

	canvas.save();
	
	drawBubble(canvas, dest.x, dest.y, dest.width, dest.height, 3.0);
	
	if (this.conversation !== null) {
		canvas.fillStyle = 'black';
		canvas.font = '15px Courier New';
		canvas.textBaseline = "top"; 
		
		var lineHeight = 15;
		var leftMargin = 10;
		var rightMargin = 10;
		var topMargin = 10;
		
		var startingHeight = lineHeight + multiMeasureText(canvas, this.conversation.text, lineHeight, dest.width).height;
		
		multiFillText(canvas, this.conversation.text, dest.x + leftMargin, dest.y + topMargin, lineHeight, dest.width - (leftMargin + rightMargin));
		
		canvas.font = 'bold 15px Courier New';
		for(var i=0; i<this.conversation.handlers.length; i++) {
			var caption = this.conversation.handlers[i].caption;
			
			var color = i == this.currentHandler ? "steelblue" : "black";
			canvas.fillStyle = color;
			
			canvas.fillText(caption, dest.x + leftMargin, dest.y + startingHeight + (i * lineHeight) + topMargin);
		}

	}
	
	canvas.restore();
};


bitwisegames.dialog.prototype.show = function() {
	this.visible = true;
};

bitwisegames.dialog.prototype.hide = function() {
	this.visible = false;
};

bitwisegames.dialog.prototype.update = function(gameTime) {
	
	if (!this.initialize) {
		var newKeyState = this.keyboard.getLastKeyState();
		
		this.lastKeyState = newKeyState;
		
		if (this.conversation !== null && this.npc !== null) {
		
			//if (newKeyState.isKeyDown('up') && this.lastKeyState.key_states['up'] == KEY_UP) {
			if (inputHelper.isNewKeyPress('up')) {
				this.currentHandler--;
				if (this.currentHandler < 0)
					this.currentHandler = this.conversation.handlers.length - 1;
			}
		
			//if (newKeyState.isKeyDown('down') && this.lastKeyState.key_states['down'] == KEY_UP) {
			if (inputHelper.isNewKeyPress('down')) {
				this.currentHandler++;
				if (this.currentHandler > this.conversation.handlers.length - 1)
					this.currentHandler = 0;
			}
		
			//if (newKeyState.isKeyDown('space') && this.lastKeyState.key_states['space'] == KEY_UP) {
			if (inputHelper.isNewKeyPress('fire')) {
				this.conversation.handlers[this.currentHandler].invoke(this.npc);
			}
		}
	} else {
		
		// initialize dialog
		this.currentHandler = 0;
		this.initialize = false;
	}
};