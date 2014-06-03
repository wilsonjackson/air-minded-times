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
		EMPTY: new Tile(SpriteFactory.getSprite('terrain/empty')),
		CLOUD_NW: new Tile(SpriteFactory.getSprite('terrain/cloud-nw')),
		CLOUD_N: new Tile(SpriteFactory.getSprite('terrain/cloud-n')),
		CLOUD_NE: new Tile(SpriteFactory.getSprite('terrain/cloud-ne')),
		CLOUD_W: new Tile(SpriteFactory.getSprite('terrain/cloud-w')),
		CLOUD_C: new Tile(SpriteFactory.getSprite('terrain/cloud-c')),
		CLOUD_E: new Tile(SpriteFactory.getSprite('terrain/cloud-e')),
		CLOUD_SW: new Tile(SpriteFactory.getSprite('terrain/cloud-sw')),
		CLOUD_S: new Tile(SpriteFactory.getSprite('terrain/cloud-s')),
		CLOUD_SE: new Tile(SpriteFactory.getSprite('terrain/cloud-se')),
		NET_NW: new Tile(SpriteFactory.getSprite('terrain/net-nw')),
		NET_N: new Tile(SpriteFactory.getSprite('terrain/net-n')),
		NET_NE: new Tile(SpriteFactory.getSprite('terrain/net-ne')),
		NET_W: new Tile(SpriteFactory.getSprite('terrain/net-w')),
		NET_C: new Tile(SpriteFactory.getSprite('terrain/net-c')),
		NET_E: new Tile(SpriteFactory.getSprite('terrain/net-e')),
		NET_SW: new Tile(SpriteFactory.getSprite('terrain/net-sw')),
		NET_S: new Tile(SpriteFactory.getSprite('terrain/net-s')),
		NET_SE: new Tile(SpriteFactory.getSprite('terrain/net-se')),
		CLOUD_NET_NW: new Tile(SpriteFactory.getSprite('terrain/cloud-net-nw')),
		CLOUD_NET_N: new Tile(SpriteFactory.getSprite('terrain/cloud-net-n')),
		CLOUD_NET_NE: new Tile(SpriteFactory.getSprite('terrain/cloud-net-ne')),
		CLOUD_NET_W: new Tile(SpriteFactory.getSprite('terrain/cloud-net-w')),
		CLOUD_NET_C: new Tile(SpriteFactory.getSprite('terrain/cloud-net-c')),
		CLOUD_NET_E: new Tile(SpriteFactory.getSprite('terrain/cloud-net-e')),
		CLOUD_NET_SW: new Tile(SpriteFactory.getSprite('terrain/cloud-net-sw')),
		CLOUD_NET_S: new Tile(SpriteFactory.getSprite('terrain/cloud-net-s')),
		CLOUD_NET_SE: new Tile(SpriteFactory.getSprite('terrain/cloud-net-se')),
//		CLOUD_IN_NW: new Tile(SpriteFactory.getSprite('terrain/cloud-in-nw')),
//		CLOUD_IN_NE: new Tile(SpriteFactory.getSprite('terrain/cloud-in-ne')),
//		CLOUD_IN_SW: new Tile(SpriteFactory.getSprite('terrain/cloud-in-sw')),
//		CLOUD_IN_SE: new Tile(SpriteFactory.getSprite('terrain/cloud-in-se')),
		HEART_W: new Tile(SpriteFactory.getSprite('terrain/heart-w')),
		HEART_E: new Tile(SpriteFactory.getSprite('terrain/heart-e')),
		HEART_U_W: new Tile(SpriteFactory.getSprite('terrain/heart-u-w')),
		HEART_U_E: new Tile(SpriteFactory.getSprite('terrain/heart-u-e')),
		HEART_ALT_W: new Tile(SpriteFactory.getSprite('terrain/heart-a-w')),
		HEART_ALT_E: new Tile(SpriteFactory.getSprite('terrain/heart-a-e')),
		HEART_ALT_U_W: new Tile(SpriteFactory.getSprite('terrain/heart-a-u-w')),
		HEART_ALT_U_E: new Tile(SpriteFactory.getSprite('terrain/heart-a-u-e')),
		PUFF: new Tile(SpriteFactory.getSprite('terrain/puff')),
		readMapTerrain: function (mapTerrain) {
			return mapTerrain.map(function (n) {
				if (Terrain.indexed[n] === null) {
					throw 'Invalid terrain index: ' + n;
				}
				return Terrain.indexed[n];
			});
		}
	};

	Terrain.indexed = [null, // 1-indexed
		Terrain.CLOUD_NW, Terrain.CLOUD_NE, Terrain.CLOUD_N, Terrain.CLOUD_E, Terrain.HEART_U_W, Terrain.HEART_U_E, Terrain.HEART_ALT_U_W, Terrain.HEART_ALT_U_E,
		Terrain.CLOUD_SW, Terrain.CLOUD_SE, Terrain.CLOUD_S, Terrain.CLOUD_W, Terrain.HEART_W, Terrain.HEART_E, Terrain.HEART_ALT_W, Terrain.HEART_ALT_E,
		Terrain.CLOUD_NET_NW, Terrain.CLOUD_NET_NE, Terrain.CLOUD_NET_N, Terrain.CLOUD_NET_E, Terrain.CLOUD_NET_C, Terrain.CLOUD_C, Terrain.PUFF, null,
		Terrain.CLOUD_NET_SW, Terrain.CLOUD_NET_SE, Terrain.CLOUD_NET_S, Terrain.CLOUD_NET_W, Terrain.NET_C, Terrain.EMPTY, null, null,
		Terrain.NET_NW, Terrain.NET_NE, Terrain.NET_N, Terrain.NET_W, null, null, null, null,
		Terrain.NET_SW, Terrain.NET_SE, Terrain.NET_S, Terrain.NET_E, null, null, null, null
	];

	var Map = {
		TEST_MAP: {
			tileSize: 50,
			width: 14,
			terrain: [1, 2, 29, 29, 29, 28, 27, 27, 20, 29, 29, 30, 30, 30, 12, 4, 29, 29, 29, 28, 23, 34, 20, 29, 30, 30, 30, 30, 9, 10, 29, 36, 29, 25, 27, 36, 26, 30, 30, 30, 30, 30, 29, 29, 29, 30, 29, 17, 19, 19, 18, 30, 30, 30, 30, 30, 5, 6, 30, 30, 30, 25, 27, 27, 26, 15, 16, 30, 30, 30, 5, 6, 30, 30, 30, 1, 3, 3, 2, 15, 16, 30, 30, 30, 5, 6, 30, 30, 1, 29, 11, 11, 10, 15, 16, 30, 30, 30, 30, 30, 30, 30, 9, 10, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
		}
	};

	window.Terrain = Terrain;
	window.Map = Map;
})();
