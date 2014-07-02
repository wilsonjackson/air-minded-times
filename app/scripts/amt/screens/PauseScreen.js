Engine.module('amt.screens.PauseScreen',
	[
		'input.Input',
		'graphics.Scene',
		'graphics.sprite.SpriteRepository',
		'graphics.sprite.TextSprite',
		'amt.game.Sprites'
	],
	function (Input, Scene, SpriteRepository, TextSprite) {
		'use strict';

		var fontSprite = SpriteRepository.retrieve('font/fz');

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

		return PauseScreen;
	});
