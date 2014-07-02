Engine.module('amt.screens.PauseScreen',
	[
		'input.Input',
		'graphics.Scene',
		'graphics.sprite.SpriteRepository',
		'graphics.sprite.TextSprite',
		'amt.game.Sprites'
	],
	function () {
		'use strict';

		var Input = Engine.input.Input;
		var Scene = Engine.graphics.Scene;
		var SpriteRepository = Engine.graphics.sprite.SpriteRepository;
		var TextSprite = Engine.graphics.sprite.TextSprite;
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

		return {
			PauseScreen: PauseScreen
		};
	});
