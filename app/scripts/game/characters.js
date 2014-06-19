/* global Game, AirMindedTimes */

(function (Game, AirMindedTimes) {
	'use strict';

	var Ui = Game.ui.Ui;
	var CoverScreen = Game.ui.CoverScreen;
	var Input = Game.input.Input;
	var SpriteRepository = Game.graphics.SpriteRepository;
	var TextSprite = Game.graphics.TextSprite;

	var fontSprite = SpriteRepository.retrieve('font/fz');
	var boxSprite = SpriteRepository.retrieve('interface/box');

	function CharacterSelectionScreen() {
		this.heading = new TextSprite(fontSprite, ['Select your plane!']);
		this.greenWonderful = new AirMindedTimes.planes.GREEN_WONDERFUL();
		this.theExtendedFarewell = new AirMindedTimes.planes.THE_EXTENDED_FAREWELL();
		this.selection = this.greenWonderful;
		this.selected = false;
		this.startCountdown = 50;
		this.hideBox = false;
	}

	CharacterSelectionScreen.prototype = new CoverScreen();

	CharacterSelectionScreen.prototype.update = function (world, input) {
		if (input.isPressed(Input.ACTION)) {
			this.selected = true;
		}
		if (this.selected) {
			if (--this.startCountdown === 0) {
				AirMindedTimes.player.PlaneSelection.plane = this.selection;
				Ui.deactivateScreen();
				world.loadMap(AirMindedTimes.maps.LEVEL2);
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

	CharacterSelectionScreen.prototype.render = function (graphics) {
		var center = graphics.getCenter();
		var selectionOffset = this.selection === this.greenWonderful ? -125 : 125;
		var selectionVertCenter = center.y - 80;
		var boxSize = 180;
		var fillSize = boxSize - 6;

		graphics.drawSprite(this.heading, center.x, 100);

		if (!this.hideBox) {
			graphics.viewport.context.fillStyle = '#fff';
			graphics.viewport.context.fillRect(
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

	AirMindedTimes.characters = {
		CharacterSelectionScreen: CharacterSelectionScreen
	};
})(Game, AirMindedTimes);
