Engine.module('amt.screens.TitleScreen',
	[
		'input.Input',
		'graphics.Scene',
		'graphics.sprite.SpriteRepository',
		'graphics.sprite.TextSprite',
		'amt.screens.CharacterSelectionScreen',
		'amt.game.Sprites'
	],
	function (Input, Scene, SpriteRepository, TextSprite, CharacterSelectionScreen) {
		'use strict';

		var titleScreenSprite = SpriteRepository.retrieve('title');
		var fontSprite = SpriteRepository.retrieve('font/fz');

		function TitleScreen() {
			this.startOnNextTick = false;
			this.text = new TextSprite(fontSprite, ['Press the SPACE BAR to start.']);
		}

		TitleScreen.prototype = Object.create(Scene.prototype);

		TitleScreen.prototype.update = function (input) {
			if (this.startOnNextTick) {
				Engine.setScene(new CharacterSelectionScreen());
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

		return TitleScreen;
	});
