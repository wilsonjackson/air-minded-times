Engine.module('graphics.Tile', function () {
	'use strict';

	function Tile(sprite, impassable) {
		this.sprite = sprite;
		this.impassable = impassable;
	}

	Tile.prototype.render = function (viewport, gridX, gridY) {
		viewport.getGraphics().drawSprite(this.sprite, gridX, gridY);
	};

	return Tile;
});
