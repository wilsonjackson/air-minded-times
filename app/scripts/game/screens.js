/* global Engine, AirMindedTimes */

(function (Engine, AirMindedTimes) {
	'use strict';

	var Input = Engine.input.Input;
	var Scene = Engine.graphics.Scene;
	var SpriteRepository = Engine.graphics.SpriteRepository;
	var TextSprite = Engine.graphics.TextSprite;
	var titleScreenSprite = SpriteRepository.retrieve('title');
	var fontSprite = SpriteRepository.retrieve('font/fz');

	function TitleScreen() {
		this.startOnNextTick = false;
		this.text = new TextSprite(fontSprite, ['Press the SPACE BAR to start.']);
	}

	TitleScreen.prototype = Object.create(Scene.prototype);

	TitleScreen.prototype.update = function (input) {
		if (this.startOnNextTick) {
			Engine.setScene(new AirMindedTimes.characters.CharacterSelectionScreen());
		}
		if (input.isPressed(Input.ACTION)) {
			this.startOnNextTick = true;
		}
	};

	TitleScreen.prototype.render = function (viewport) {
		var screenWidth = viewport.width;
		var screenHeight = viewport.height;

		var graphics = viewport.getGraphics();
		graphics.drawSprite(titleScreenSprite, screenWidth / 2, screenHeight / 2);
		graphics.drawSprite(this.text, viewport.getCenter().x, 625);
	};

	function PauseScreen() {
		this.firstTick = true;
		this.text = new TextSprite(fontSprite, ['Paused']);
	}

	PauseScreen.prototype = Object.create(Scene.prototype);

	PauseScreen.prototype.update = function (input) {
		if (input.isPressed(Input.PAUSE) && !this.firstTick) {
			Engine.popScene();
		}
		this.firstTick = false;
	};

	PauseScreen.prototype.render = function (viewport) {
		var center = viewport.getCenter();
		viewport.getGraphics().drawSprite(this.text, center.x, center.y);
	};

	AirMindedTimes.screens = {
		TitleScreen: TitleScreen,
		PauseScreen: PauseScreen
	};
})(Engine, AirMindedTimes);
