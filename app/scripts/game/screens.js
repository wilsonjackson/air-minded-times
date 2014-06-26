/* global Game, AirMindedTimes */

(function (Game, AirMindedTimes) {
	'use strict';

	var Input = Game.input.Input;
	var Ui = Game.ui.Ui;
	var CoverScreen = Game.ui.CoverScreen;
	var SpriteRepository = Game.graphics.SpriteRepository;
	var TextSprite = Game.graphics.TextSprite;
	var titleScreenSprite = SpriteRepository.retrieve('title');
	var fontSprite = SpriteRepository.retrieve('font/fz');

	function TitleScreen() {
		this.startOnNextTick = false;
		this.text = new TextSprite(fontSprite, ['Press the SPACE BAR to start.']);
	}

	TitleScreen.prototype = Object.create(CoverScreen.prototype);

	TitleScreen.prototype.update = function (world, input) {
		if (this.startOnNextTick) {
			Ui.activateScreen(new AirMindedTimes.characters.CharacterSelectionScreen());
		}
		if (input.isPressed(Input.ACTION)) {
			this.startOnNextTick = true;
		}
	};

	TitleScreen.prototype.render = function (graphics) {
		var screenWidth = graphics.viewport.width;
		var screenHeight = graphics.viewport.height;

		graphics.drawSprite(titleScreenSprite, screenWidth / 2, screenHeight / 2);
		graphics.drawSprite(this.text, graphics.getCenter().x, 625);
	};

	function PauseScreen() {
		this.firstTick = true;
		this.text = new TextSprite(fontSprite, ['Paused']);
	}

	PauseScreen.prototype = Object.create(CoverScreen.prototype);

	PauseScreen.prototype.update = function (world, input) {
		if (input.isPressed(Input.PAUSE) && !this.firstTick) {
			Ui.deactivateScreen();
		}
		this.firstTick = false;
	};

	PauseScreen.prototype.render = function (graphics) {
		var center = graphics.getCenter();
		graphics.drawSprite(this.text, center.x, center.y);
	};

	AirMindedTimes.screens = {
		TitleScreen: TitleScreen,
		PauseScreen: PauseScreen
	};
})(Game, AirMindedTimes);
