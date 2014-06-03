/* global SpriteFactory */

(function () {
	'use strict';

	function Tile(sprite, impassable) {
		this.sprite = sprite;
		this.impassable = impassable || false;
	}

	Tile.prototype.render = function (graphics, gridX, gridY) {
		graphics.drawSprite(this.sprite, gridX * 50, gridY * 50);
	};

	var Terrain = {
		CLOUD_EMPTY: new Tile(SpriteFactory.getSprite('terrain/cloud-empty')),
		CLOUD_NW: new Tile(SpriteFactory.getSprite('terrain/cloud-nw')),
		CLOUD_N: new Tile(SpriteFactory.getSprite('terrain/cloud-n')),
		CLOUD_NE: new Tile(SpriteFactory.getSprite('terrain/cloud-ne')),
		CLOUD_W: new Tile(SpriteFactory.getSprite('terrain/cloud-w')),
		CLOUD_C: new Tile(SpriteFactory.getSprite('terrain/cloud-c')),
		CLOUD_E: new Tile(SpriteFactory.getSprite('terrain/cloud-e')),
		CLOUD_SW: new Tile(SpriteFactory.getSprite('terrain/cloud-sw')),
		CLOUD_S: new Tile(SpriteFactory.getSprite('terrain/cloud-s')),
		CLOUD_SE: new Tile(SpriteFactory.getSprite('terrain/cloud-se')),
		CLOUD_IN_NW: new Tile(SpriteFactory.getSprite('terrain/cloud-in-nw')),
		CLOUD_IN_NE: new Tile(SpriteFactory.getSprite('terrain/cloud-in-ne')),
		CLOUD_IN_SW: new Tile(SpriteFactory.getSprite('terrain/cloud-in-sw')),
		CLOUD_IN_SE: new Tile(SpriteFactory.getSprite('terrain/cloud-in-se')),
		CLOUD_HEART_W: new Tile(SpriteFactory.getSprite('terrain/cloud-heart-w')),
		CLOUD_HEART_E: new Tile(SpriteFactory.getSprite('terrain/cloud-heart-e')),
		CLOUD_HEART2_W: new Tile(SpriteFactory.getSprite('terrain/cloud-heart2-w')),
		CLOUD_HEART2_E: new Tile(SpriteFactory.getSprite('terrain/cloud-heart2-e')),
		CLOUD_PUFF: new Tile(SpriteFactory.getSprite('terrain/cloud-puff')),
		readMapTerrain: function (mapTerrain) {
			var terrain = [];
			for (var i = 0; i < mapTerrain.length; i++) {
				terrain.push(Terrain.charMap[mapTerrain.charAt(i)]);
			}
			return terrain;
		}
	};

	Terrain.charMap = {
		'a': Terrain.CLOUD_EMPTY,
		'b': Terrain.CLOUD_NW,
		'c': Terrain.CLOUD_N,
		'd': Terrain.CLOUD_NE,
		'e': Terrain.CLOUD_W,
		'f': Terrain.CLOUD_C,
		'g': Terrain.CLOUD_E,
		'h': Terrain.CLOUD_SW,
		'i': Terrain.CLOUD_S,
		'j': Terrain.CLOUD_SE,
		'k': Terrain.CLOUD_IN_NW,
		'l': Terrain.CLOUD_IN_NE,
		'm': Terrain.CLOUD_IN_SW,
		'n': Terrain.CLOUD_IN_SE,
		'o': Terrain.CLOUD_HEART_W,
		'p': Terrain.CLOUD_HEART_E,
		'q': Terrain.CLOUD_HEART2_W,
		'r': Terrain.CLOUD_HEART2_E,
		's': Terrain.CLOUD_PUFF
	};

	var Map = {
		BUTTLAND: {
			tileSize: 50,
			width: 14,
			terrain:
				'iiiiijaaaaaaaa' +
				'aaaaaaaaopaaaa' +
				'aaaaaaaaaaaaaa' +
				'aaabcccdaaaqra' +
				'aaaefffgaaaaaa' +
				'aaahiiijaaaaaa' +
				'aaaaaaaaaaaaaa' +
				'aaaaaaaaaabccd' +
				'aaopaaabdaeffg' +
				'aaaaaaaemcnffg' +
				'aaaaaaahikfffg' +
				'aaaaaaaaahiiij'
		}
	};

	window.Terrain = Terrain;
	window.Map = Map;
})();
