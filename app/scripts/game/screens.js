/* global CoverScreen, Maps */

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

		var fontSprite = SpriteRepository.retrieve('font/fz');
		fontSprite.text('AIR MINDED TIMES!');
		graphics.drawSprite(fontSprite,
			Math.round((screenWidth - 'AIR MINDED TIMES!'.length * fontSprite.getWidth()) / 2),
			Math.round((screenHeight - fontSprite.getHeight() * 3) / 2));
		fontSprite.text('Press the SPACE BAR to start.');
		graphics.drawSprite(fontSprite,
			Math.round((screenWidth - 'Press the SPACE BAR to start.'.length * fontSprite.getWidth()) / 2),
			Math.round(((screenHeight - fontSprite.getHeight() * 3) + fontSprite.getHeight() * 3) / 2));
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
