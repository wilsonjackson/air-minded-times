Engine.module('amt.screens.CharacterSelectionScreen',
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
		var boxSprite = SpriteRepository.retrieve('interface/box');

		function CharacterSelectionScreen() {
			this.heading = new TextSprite(fontSprite, ['Select your plane!']);
			this.greenWonderful = new Engine.amt.objects.planes.GREEN_WONDERFUL();
			this.theExtendedFarewell = new Engine.amt.objects.planes.THE_EXTENDED_FAREWELL();
			this.selection = this.greenWonderful;
			this.selected = false;
			this.startCountdown = 50;
			this.hideBox = false;
		}

		CharacterSelectionScreen.prototype = Object.create(Scene.prototype);

		CharacterSelectionScreen.prototype.update = function (input) {
			if (input.isPressed(Input.ACTION)) {
				this.selected = true;
			}
			if (this.selected) {
				if (--this.startCountdown === 0) {
					Engine.amt.game.Game.start(this.selection.constructor)
						.startNextLevel();
				}
				if (this.startCountdown % 10 === 0) {
					this.hideBox = !this.hideBox;
				}
			}
			else if (input.isPressed(Input.LEFT) || input.isPressed(Input.RIGHT)) {
				this.selection = this.selection === this.greenWonderful ? this.theExtendedFarewell : this.greenWonderful;
			}
			this.greenWonderful.sprite.update();
			this.theExtendedFarewell.sprite.update();
		};

		CharacterSelectionScreen.prototype.render = function (viewport) {
			var center = viewport.getCenter();
			var graphics = viewport.getGraphics();
			var selectionOffset = this.selection === this.greenWonderful ? -125 : 125;
			var selectionVertCenter = center.y - 80;
			var boxSize = 180;
			var fillSize = boxSize - 6;

			graphics.drawSprite(this.heading, center.x, 100);

			if (!this.hideBox) {
				viewport.context.fillStyle = '#fff';
				viewport.context.fillRect(
						center.x + selectionOffset - fillSize / 2,
						selectionVertCenter - fillSize / 2,
					fillSize, fillSize);

				boxSprite.setWidth(boxSize);
				boxSprite.setHeight(boxSize);
				graphics.drawSprite(boxSprite, center.x + selectionOffset, selectionVertCenter);
			}

			graphics.drawSprite(this.greenWonderful.sprite, center.x - 125, selectionVertCenter);
			graphics.drawSprite(this.theExtendedFarewell.sprite, center.x + 125, selectionVertCenter);

			graphics.drawSprite(new TextSprite(fontSprite, [this.selection.name]), center.x, selectionVertCenter + boxSize / 2 + 60);
			var description = new TextSprite(fontSprite, this.selection.description);
			description.width(600);
			description.height(300);
			graphics.drawSprite(description, center.x, selectionVertCenter + boxSize / 2 + 270);
		};

		return {
			CharacterSelectionScreen: CharacterSelectionScreen
		};
	});
