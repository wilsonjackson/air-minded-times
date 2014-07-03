Engine.module('amt.screens.CharacterSelectionScreen',
	[
		'input.Input',
		'graphics.Scene',
		'graphics.sprite.SpriteRepository',
		'graphics.sprite.TextSprite',
		'amt.game.Game',
		'amt.objects.planes.GreenWonderful',
		'amt.objects.planes.TheExtendedFarewell',
		'amt.game.Sprites'
	],
	function (Input, Scene, SpriteRepository, TextSprite, Game, GreenWonderful, TheExtendedFarewell) {
		'use strict';

		var fontSprite = SpriteRepository.retrieve('font/fz');
		var boxSprite = SpriteRepository.retrieve('interface/box');

		function CharacterSelectionScreen() {
			this.heading = new TextSprite(fontSprite, ['Select your plane!']).fullWidth();
			this.greenWonderful = new GreenWonderful();
			this.theExtendedFarewell = new TheExtendedFarewell();
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
					Game.start(this.selection.constructor).startNextLevel();
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
			var boxSize = 180;
			var columnCenterOffset = 125;
			var selectionOffset = (this.selection === this.greenWonderful ? -columnCenterOffset : columnCenterOffset);
			var selectionBottom = center.y + 10;
			var fillMargin = 6;
			var fillSize = boxSize - fillMargin;

			graphics.drawSprite(this.heading, 0, 115);

			if (!this.hideBox) {
				graphics.drawRect(
						center.x + selectionOffset - fillSize / 2,
						selectionBottom - fillMargin / 2,
						fillSize, fillSize,
					{fill: '#fff'});

				boxSprite.setWidth(boxSize);
				boxSprite.setHeight(boxSize);
				graphics.drawSprite(boxSprite, center.x + selectionOffset - boxSize / 2, selectionBottom);
			}

			graphics.drawSprite(
				this.greenWonderful.sprite,
				center.x - columnCenterOffset - Math.round(this.greenWonderful.sprite.getHitboxWidth() / 2),
				selectionBottom - Math.round((boxSize - this.greenWonderful.sprite.getHitboxHeight()) / 2));
			graphics.drawSprite(
				this.theExtendedFarewell.sprite,
				center.x + columnCenterOffset - Math.round(this.theExtendedFarewell.sprite.getHitboxWidth() / 2),
				selectionBottom - Math.round((boxSize - this.theExtendedFarewell.sprite.getHitboxHeight()) / 2));

			graphics.drawSprite(new TextSprite(fontSprite, [this.selection.name]).fullWidth(), 0, selectionBottom + 70);
			var description = new TextSprite(fontSprite, this.selection.description)
				.width(600)
				.height(250)
				.left();
			graphics.drawSprite(description, (viewport.width - 600) / 2, selectionBottom + 370);
		};

		return CharacterSelectionScreen;
	});
