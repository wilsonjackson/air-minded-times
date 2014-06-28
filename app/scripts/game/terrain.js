/* global Engine */

(function (Engine) {
	'use strict';

	var SpriteRepository = Engine.graphics.SpriteRepository;
	var Terrain = Engine.graphics.Terrain;

	function addTerrainSprite(name, url, tileSize, width, height, impassableTiles) {
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				var spriteName = name + '/' + ((y * tileSize) + (x * tileSize));
				SpriteRepository.add({
					name: spriteName,
					url: url,
					x: x * tileSize,
					y: y * tileSize,
					w: tileSize,
					h: tileSize
				});
				var impassable = impassableTiles && impassableTiles.indexOf(y * width + x) !== -1;
				Terrain.add(SpriteRepository.retrieve(spriteName), impassable);
			}
		}
	}

	addTerrainSprite('terrain/level1', 'terrain/level1.png', 100, 10, 10, [
			5 * 10 + 1,
			5 * 10 + 2,
			5 * 10 + 3,
			5 * 10 + 4
	]);
})(Engine);
