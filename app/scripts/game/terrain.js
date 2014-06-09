/* global Terrain, SpriteRepository */

(function () {
	'use strict';

	// Order must match sprite sheet!
//	Terrain.CLOUD_NW = Terrain.add(SpriteRepository.retrieve('terrain/cloud-nw'));
//	Terrain.CLOUD_NE = Terrain.add(SpriteRepository.retrieve('terrain/cloud-ne'));
//	Terrain.CLOUD_N = Terrain.add(SpriteRepository.retrieve('terrain/cloud-n'));
//	Terrain.CLOUD_E = Terrain.add(SpriteRepository.retrieve('terrain/cloud-e'));
//	Terrain.HEART_U_W = Terrain.add(SpriteRepository.retrieve('terrain/heart-u-w'));
//	Terrain.HEART_U_E = Terrain.add(SpriteRepository.retrieve('terrain/heart-u-e'));
//	Terrain.HEART_ALT_U_W = Terrain.add(SpriteRepository.retrieve('terrain/heart-a-u-w'));
//	Terrain.HEART_ALT_U_E = Terrain.add(SpriteRepository.retrieve('terrain/heart-a-u-e'));
//
//	Terrain.CLOUD_SW = Terrain.add(SpriteRepository.retrieve('terrain/cloud-sw'));
//	Terrain.CLOUD_SE = Terrain.add(SpriteRepository.retrieve('terrain/cloud-se'));
//	Terrain.CLOUD_S = Terrain.add(SpriteRepository.retrieve('terrain/cloud-s'));
//	Terrain.CLOUD_W = Terrain.add(SpriteRepository.retrieve('terrain/cloud-w'));
//	Terrain.HEART_W = Terrain.add(SpriteRepository.retrieve('terrain/heart-w'));
//	Terrain.HEART_E = Terrain.add(SpriteRepository.retrieve('terrain/heart-e'));
//	Terrain.HEART_ALT_W = Terrain.add(SpriteRepository.retrieve('terrain/heart-a-w'));
//	Terrain.HEART_ALT_E = Terrain.add(SpriteRepository.retrieve('terrain/heart-a-e'));
//
//	Terrain.CLOUD_NET_NW = Terrain.add(SpriteRepository.retrieve('terrain/cloud-net-nw'));
//	Terrain.CLOUD_NET_NE = Terrain.add(SpriteRepository.retrieve('terrain/cloud-net-ne'));
//	Terrain.CLOUD_NET_N = Terrain.add(SpriteRepository.retrieve('terrain/cloud-net-n'));
//	Terrain.CLOUD_NET_E = Terrain.add(SpriteRepository.retrieve('terrain/cloud-net-e'));
//	Terrain.CLOUD_NET_C = Terrain.add(SpriteRepository.retrieve('terrain/cloud-net-c'));
//	Terrain.CLOUD_C = Terrain.add(SpriteRepository.retrieve('terrain/cloud-c'));
//	Terrain.PUFF = Terrain.add(SpriteRepository.retrieve('terrain/puff'));
//	Terrain.add(null);
//
//	Terrain.CLOUD_NET_SW = Terrain.add(SpriteRepository.retrieve('terrain/cloud-net-sw'));
//	Terrain.CLOUD_NET_SE = Terrain.add(SpriteRepository.retrieve('terrain/cloud-net-se'));
//	Terrain.CLOUD_NET_S = Terrain.add(SpriteRepository.retrieve('terrain/cloud-net-s'));
//	Terrain.CLOUD_NET_W = Terrain.add(SpriteRepository.retrieve('terrain/cloud-net-w'));
//	Terrain.NET_C = Terrain.add(SpriteRepository.retrieve('terrain/net-c'));
//	Terrain.EMPTY = Terrain.add(SpriteRepository.retrieve('terrain/empty'));
//	Terrain.add(null);
//	Terrain.add(null);
//
//	Terrain.NET_NW = Terrain.add(SpriteRepository.retrieve('terrain/net-nw'));
//	Terrain.NET_NE = Terrain.add(SpriteRepository.retrieve('terrain/net-ne'));
//	Terrain.NET_N = Terrain.add(SpriteRepository.retrieve('terrain/net-n'));
//	Terrain.NET_W = Terrain.add(SpriteRepository.retrieve('terrain/net-w'));
//	Terrain.add(null);
//	Terrain.add(null);
//	Terrain.add(null);
//	Terrain.add(null);
//
//	Terrain.NET_SW = Terrain.add(SpriteRepository.retrieve('terrain/net-sw'));
//	Terrain.NET_SE = Terrain.add(SpriteRepository.retrieve('terrain/net-se'));
//	Terrain.NET_S = Terrain.add(SpriteRepository.retrieve('terrain/net-s'));
//	Terrain.NET_E = Terrain.add(SpriteRepository.retrieve('terrain/net-e'));
//	Terrain.add(null);
//	Terrain.add(null);
//	Terrain.add(null);
//	Terrain.add(null);

	function addTerrainSprite(name, url, tileSize, width, height) {
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
				Terrain.add(SpriteRepository.retrieve(spriteName));
			}
		}
	}

	addTerrainSprite('terrain/level1', 'terrain/level1.png', 100, 10, 6);

//		Terrain.CLOUD_IN_NW = Terrain.add(SpriteRepository.retrieve('terrain/cloud-in-nw'));
//		Terrain.CLOUD_IN_NE = Terrain.add(SpriteRepository.retrieve('terrain/cloud-in-ne'));
//		Terrain.CLOUD_IN_SW = Terrain.add(SpriteRepository.retrieve('terrain/cloud-in-sw'));
//		Terrain.CLOUD_IN_SE = Terrain.add(SpriteRepository.retrieve('terrain/cloud-in-se'));
})();
