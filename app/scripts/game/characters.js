/* global Game, CoverScreen, Ui, Input, Planes, SpriteRepository, TextSprite, PlaneSelection */

(function () {
	'use strict';

	var fontSprite = SpriteRepository.retrieve('font/fz');

	function CharacterSelectionScreen() {
		this.heading = new TextSprite(fontSprite, ['Select your plane!']);
		this.biplanedieplane = new Planes.BIPLANEDIEPLANE();
		this.extendedFarewell = new Planes.EXTENDED_FAREWELL();
		this.selection = this.biplanedieplane;
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
			this.selection = this.selection === this.biplanedieplane ? this.extendedFarewell : this.biplanedieplane;
		}
		this.biplanedieplane.sprite.update();
		this.extendedFarewell.sprite.update();
	};

	CharacterSelectionScreen.prototype.render = function (graphics) {
		var center = graphics.getCenter();
		var selectionOffset = this.selection === this.biplanedieplane ? -125 : 125;
		var selectionVertCenter = center.y - 50;
		var boxSize = 180;
		var fillSize = boxSize - 6;

		graphics.drawSprite(this.heading, center.x, 80);

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

		graphics.drawSprite(this.biplanedieplane.sprite, center.x - 125, selectionVertCenter);
		graphics.drawSprite(this.extendedFarewell.sprite, center.x + 125, selectionVertCenter);

		graphics.drawSprite(new TextSprite(fontSprite, [this.selection.name]), center.x + selectionOffset, selectionVertCenter + boxSize / 2 + 40);
		var description = new TextSprite(fontSprite, this.selection.description);
		description.width(600);
		description.height(300);
		graphics.drawSprite(description, center.x, selectionVertCenter + boxSize / 2 + 230);
	};

	window.CharacterSelectionScreen = CharacterSelectionScreen;
})();
