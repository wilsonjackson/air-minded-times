/* global Game, CoverScreen, Ui, Input, Planes, SpriteRepository, TextSprite, PlaneSelection */

(function () {
	'use strict';

	var fontSprite = SpriteRepository.retrieve('font/fz');

	function CharacterSelectionScreen() {
		this.heading = new TextSprite(fontSprite, ['Select your plane!']);
		this.greenWonderful = new Planes.GREEN_WONDERFUL();
		this.theExtendedFarewell = new Planes.THE_EXTENDED_FAREWELL();
		this.selection = this.greenWonderful;
		this.selected = false;
		this.startCountdown = 50;
		this.hideBox = false;
	}

	CharacterSelectionScreen.prototype = new CoverScreen();

	CharacterSelectionScreen.prototype.update = function (input) {
		if (input.isPressed(Input.ACTION)) {
			this.selected = true;
		}
		if (this.selected) {
			if (--this.startCountdown === 0) {
				PlaneSelection.plane = this.selection;
				Ui.deactivateScreen();
				Game.world.loadMap(Map.LEVEL2);
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

			var box = SpriteRepository.retrieve('interface/box');
			box.setWidth(boxSize);
			box.setHeight(boxSize);
			graphics.drawSprite(box, center.x + selectionOffset, selectionVertCenter);
		}

		graphics.drawSprite(this.greenWonderful.sprite, center.x - 125, selectionVertCenter);
		graphics.drawSprite(this.theExtendedFarewell.sprite, center.x + 125, selectionVertCenter);

		graphics.drawSprite(new TextSprite(fontSprite, [this.selection.name]), center.x, selectionVertCenter + boxSize / 2 + 60);
		var description = new TextSprite(fontSprite, this.selection.description);
		description.width(600);
		description.height(300);
		graphics.drawSprite(description, center.x, selectionVertCenter + boxSize / 2 + 270);
	};

	window.CharacterSelectionScreen = CharacterSelectionScreen;
})();
