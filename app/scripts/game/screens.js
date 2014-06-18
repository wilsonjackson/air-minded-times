/* global Input, Ui, SpriteRepository, TextSprite, CoverScreen, CharacterSelectionScreen */

(function () {
	'use strict';

	var titleScreenSprite = SpriteRepository.retrieve('title');
	var fontSprite = SpriteRepository.retrieve('font/fz');

	function TitleScreen() {
		this.startOnNextTick = false;
		this.text = new TextSprite(fontSprite, ['Press the SPACE BAR to start.']);
	}

	TitleScreen.prototype = new CoverScreen();

	TitleScreen.prototype.update = function (input) {
		if (this.startOnNextTick) {
			Ui.activateScreen(new CharacterSelectionScreen());
		}
		if (input.isPressed(Input.ACTION)) {
			this.startOnNextTick = true;
		}
	};

	TitleScreen.prototype.render = function (graphics) {
		var screenWidth = graphics.viewport.width;
		var screenHeight = graphics.viewport.height;

		graphics.drawSprite(titleScreenSprite, screenWidth / 2, screenHeight / 2);
		graphics.drawSprite(this.text, graphics.getCenter().x, 435);
	};

	function PauseScreen() {
		this.firstTick = true;
		this.text = new TextSprite(fontSprite, ['Paused']);
	}

	PauseScreen.prototype = new CoverScreen();

	PauseScreen.prototype.update = function (input) {
		if (input.isPressed(Input.PAUSE) && !this.firstTick) {
			Ui.deactivateScreen();
		}
		this.firstTick = false;
	};

	PauseScreen.prototype.render = function (graphics) {
		var center = graphics.getCenter();
		graphics.drawSprite(this.text, center.x, center.y);
	};

	window.TitleScreen = TitleScreen;
	window.PauseScreen = PauseScreen;
})();
