/* global Game, Input, Ui, SpriteRepository, CoverScreen */

(function () {
	'use strict';

	function TitleScreen() {
		this.startOnNextTick = false;
	}

	TitleScreen.prototype = new CoverScreen();

	TitleScreen.prototype.update = function (input) {
		if (this.startOnNextTick) {
			Ui.deactivateScreen();
			Game.world.loadMap(Map.LEVEL2);
		}
		if (input.isPressed(Input.ACTION)) {
			this.startOnNextTick = true;
		}
	};

	TitleScreen.prototype.render = function (graphics) {
		var screenWidth = graphics.viewport.width;
		var screenHeight = graphics.viewport.height;
		var context = graphics.viewport.context;
		context.fillStyle = '#000';
		context.fillRect(0, 0, screenWidth, screenHeight);

		graphics.drawSprite(SpriteRepository.retrieve('title'), screenWidth / 2, screenHeight / 2);

		var fontSprite = SpriteRepository.retrieve('font/fz');
		var text = 'Press the SPACE BAR to start.';
		fontSprite.text(text);
		graphics.drawSprite(fontSprite, 330, 435);
	};


	function PauseScreen() {
		this.firstTick = true;
	}

	PauseScreen.prototype = new CoverScreen();

	PauseScreen.prototype.update = function (input) {
		if (input.isPressed(Input.PAUSE) && !this.firstTick) {
			Ui.deactivateScreen();
		}
		this.firstTick = false;
	};

	PauseScreen.prototype.render = function (graphics) {
		var screenWidth = graphics.viewport.width;
		var screenHeight = graphics.viewport.height;
		var context = graphics.viewport.context;
		context.fillStyle = '#000';
		context.fillRect(0, 0, screenWidth, screenHeight);

		var fontSprite = SpriteRepository.retrieve('font/fz');
		fontSprite.text('PAUSED');
		graphics.drawSprite(fontSprite,
			Math.round((screenWidth - 'PAUSED'.length * fontSprite.getWidth()) / 2),
			Math.round((screenHeight - fontSprite.getHeight()) / 2));
	};

	window.TitleScreen = TitleScreen;
	window.PauseScreen = PauseScreen;
})();
