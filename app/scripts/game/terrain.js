/* global Terrain SpriteFactory */

(function () {
	'use strict';

	// Order must match sprite sheet!
	Terrain.CLOUD_NW = Terrain.add(SpriteFactory.getSprite('terrain/cloud-nw'));
	Terrain.CLOUD_NE = Terrain.add(SpriteFactory.getSprite('terrain/cloud-ne'));
	Terrain.CLOUD_N = Terrain.add(SpriteFactory.getSprite('terrain/cloud-n'));
	Terrain.CLOUD_E = Terrain.add(SpriteFactory.getSprite('terrain/cloud-e'));
	Terrain.HEART_U_W = Terrain.add(SpriteFactory.getSprite('terrain/heart-u-w'));
	Terrain.HEART_U_E = Terrain.add(SpriteFactory.getSprite('terrain/heart-u-e'));
	Terrain.HEART_ALT_U_W = Terrain.add(SpriteFactory.getSprite('terrain/heart-a-u-w'));
	Terrain.HEART_ALT_U_E = Terrain.add(SpriteFactory.getSprite('terrain/heart-a-u-e'));

	Terrain.CLOUD_SW = Terrain.add(SpriteFactory.getSprite('terrain/cloud-sw'));
	Terrain.CLOUD_SE = Terrain.add(SpriteFactory.getSprite('terrain/cloud-se'));
	Terrain.CLOUD_S = Terrain.add(SpriteFactory.getSprite('terrain/cloud-s'));
	Terrain.CLOUD_W = Terrain.add(SpriteFactory.getSprite('terrain/cloud-w'));
	Terrain.HEART_W = Terrain.add(SpriteFactory.getSprite('terrain/heart-w'));
	Terrain.HEART_E = Terrain.add(SpriteFactory.getSprite('terrain/heart-e'));
	Terrain.HEART_ALT_W = Terrain.add(SpriteFactory.getSprite('terrain/heart-a-w'));
	Terrain.HEART_ALT_E = Terrain.add(SpriteFactory.getSprite('terrain/heart-a-e'));

	Terrain.CLOUD_NET_NW = Terrain.add(SpriteFactory.getSprite('terrain/cloud-net-nw'));
	Terrain.CLOUD_NET_NE = Terrain.add(SpriteFactory.getSprite('terrain/cloud-net-ne'));
	Terrain.CLOUD_NET_N = Terrain.add(SpriteFactory.getSprite('terrain/cloud-net-n'));
	Terrain.CLOUD_NET_E = Terrain.add(SpriteFactory.getSprite('terrain/cloud-net-e'));
	Terrain.CLOUD_NET_C = Terrain.add(SpriteFactory.getSprite('terrain/cloud-net-c'));
	Terrain.CLOUD_C = Terrain.add(SpriteFactory.getSprite('terrain/cloud-c'));
	Terrain.PUFF = Terrain.add(SpriteFactory.getSprite('terrain/puff'));
	Terrain.add(null);

	Terrain.CLOUD_NET_SW = Terrain.add(SpriteFactory.getSprite('terrain/cloud-net-sw'));
	Terrain.CLOUD_NET_SE = Terrain.add(SpriteFactory.getSprite('terrain/cloud-net-se'));
	Terrain.CLOUD_NET_S = Terrain.add(SpriteFactory.getSprite('terrain/cloud-net-s'));
	Terrain.CLOUD_NET_W = Terrain.add(SpriteFactory.getSprite('terrain/cloud-net-w'));
	Terrain.NET_C = Terrain.add(SpriteFactory.getSprite('terrain/net-c'));
	Terrain.EMPTY = Terrain.add(SpriteFactory.getSprite('terrain/empty'));
	Terrain.add(null);
	Terrain.add(null);

	Terrain.NET_NW = Terrain.add(SpriteFactory.getSprite('terrain/net-nw'));
	Terrain.NET_NE = Terrain.add(SpriteFactory.getSprite('terrain/net-ne'));
	Terrain.NET_N = Terrain.add(SpriteFactory.getSprite('terrain/net-n'));
	Terrain.NET_W = Terrain.add(SpriteFactory.getSprite('terrain/net-w'));
	Terrain.add(null);
	Terrain.add(null);
	Terrain.add(null);
	Terrain.add(null);

	Terrain.NET_SW = Terrain.add(SpriteFactory.getSprite('terrain/net-sw'));
	Terrain.NET_SE = Terrain.add(SpriteFactory.getSprite('terrain/net-se'));
	Terrain.NET_S = Terrain.add(SpriteFactory.getSprite('terrain/net-s'));
	Terrain.NET_E = Terrain.add(SpriteFactory.getSprite('terrain/net-e'));
	Terrain.add(null);
	Terrain.add(null);
	Terrain.add(null);
	Terrain.add(null);

//		Terrain.CLOUD_IN_NW = Terrain.add(SpriteFactory.getSprite('terrain/cloud-in-nw'));
//		Terrain.CLOUD_IN_NE = Terrain.add(SpriteFactory.getSprite('terrain/cloud-in-ne'));
//		Terrain.CLOUD_IN_SW = Terrain.add(SpriteFactory.getSprite('terrain/cloud-in-sw'));
//		Terrain.CLOUD_IN_SE = Terrain.add(SpriteFactory.getSprite('terrain/cloud-in-se'));

	window.Map = {
		TEST_MAP: {
			tileSize: 100,
			width: 14,
			terrain: [1, 2, 29, 29, 29, 28, 27, 27, 20, 29, 29, 30, 30, 30, 12, 4, 29, 29, 29, 28, 23, 34, 20, 29, 30, 30, 30, 30, 9, 10, 29, 36, 29, 25, 27, 36, 26, 30, 30, 30, 30, 30, 29, 29, 29, 30, 29, 17, 19, 19, 18, 30, 30, 30, 30, 30, 5, 6, 30, 30, 30, 25, 27, 27, 26, 15, 16, 30, 30, 30, 5, 6, 30, 30, 30, 1, 3, 3, 2, 15, 16, 30, 30, 30, 5, 6, 30, 30, 1, 29, 11, 11, 10, 15, 16, 30, 30, 30, 30, 30, 30, 30, 9, 10, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
		}
	};
})();
