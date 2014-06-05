/* global SpriteFactory, Sprite */

(function () {
	'use strict';

	function spriteDef(name, url, x, y, w, h, ctor) {
		return {name: name, url: url, x: x * 100, y: y * 100, w: w, h: h, constructor: ctor};
	}

	function PlaneSprite() {
		this.count = 0;
		this.animState = false;
	}

	PlaneSprite.prototype = new Sprite();

	PlaneSprite.prototype.update = function () {
		this.count++;
		if (this.count % 3 === 0) {
			this.count = 0;
			this.animState = !this.animState;
			this.y += this.h * (this.animState ? 1 : -1);
			return true;
		}
	};

	[spriteDef('aero/extended-farewell', 'aero/planes.png', 1, 0, 100, 100, PlaneSprite),
		spriteDef('aero/biplane-dieplane', 'aero/planes.png', 0, 0, 100, 100, PlaneSprite),
		spriteDef('aero/justice-glider-mkiv', 'aero/planes.png', 2, 0, 100, 100, PlaneSprite),

		// Default empty tile
		spriteDef('terrain/empty', 'terrain/clouds.png', 5, 3, 100, 100),

		// Cloud masses
		spriteDef('terrain/cloud-nw', 'terrain/clouds.png', 0, 0, 100, 100),
		spriteDef('terrain/cloud-n', 'terrain/clouds.png', 2, 0, 100, 100),
		spriteDef('terrain/cloud-ne', 'terrain/clouds.png', 1, 0, 100, 100),
		spriteDef('terrain/cloud-w', 'terrain/clouds.png', 3, 1, 100, 100),
		spriteDef('terrain/cloud-c', 'terrain/clouds.png', 5, 2, 100, 100),
		spriteDef('terrain/cloud-e', 'terrain/clouds.png', 3, 0, 100, 100),
		spriteDef('terrain/cloud-sw', 'terrain/clouds.png', 0, 1, 100, 100),
		spriteDef('terrain/cloud-s', 'terrain/clouds.png', 2, 1, 100, 100),
		spriteDef('terrain/cloud-se', 'terrain/clouds.png', 1, 1, 100, 100),
		// For now all 'inner' corners are just using the center tile.
		spriteDef('terrain/cloud-in-nw', 'terrain/clouds.png', 5, 2, 100, 100),
		spriteDef('terrain/cloud-in-ne', 'terrain/clouds.png', 5, 2, 100, 100),
		spriteDef('terrain/cloud-in-sw', 'terrain/clouds.png', 5, 2, 100, 100),
		spriteDef('terrain/cloud-in-se', 'terrain/clouds.png', 5, 2, 100, 100),

		// Netting masses
		spriteDef('terrain/net-nw', 'terrain/clouds.png', 0, 4, 100, 100),
		spriteDef('terrain/net-n', 'terrain/clouds.png', 2, 4, 100, 100),
		spriteDef('terrain/net-ne', 'terrain/clouds.png', 1, 4, 100, 100),
		spriteDef('terrain/net-w', 'terrain/clouds.png', 3, 5, 100, 100),
		spriteDef('terrain/net-c', 'terrain/clouds.png', 4, 3, 100, 100),
		spriteDef('terrain/net-e', 'terrain/clouds.png', 3, 4, 100, 100),
		spriteDef('terrain/net-sw', 'terrain/clouds.png', 0, 5, 100, 100),
		spriteDef('terrain/net-s', 'terrain/clouds.png', 2, 5, 100, 100),
		spriteDef('terrain/net-se', 'terrain/clouds.png', 1, 5, 100, 100),

		// Cloud in netting
		spriteDef('terrain/cloud-net-nw', 'terrain/clouds.png', 0, 2, 100, 100),
		spriteDef('terrain/cloud-net-n', 'terrain/clouds.png', 2, 2, 100, 100),
		spriteDef('terrain/cloud-net-ne', 'terrain/clouds.png', 1, 2, 100, 100),
		spriteDef('terrain/cloud-net-w', 'terrain/clouds.png', 3, 3, 100, 100),
		spriteDef('terrain/cloud-net-c', 'terrain/clouds.png', 4, 2, 100, 100),
		spriteDef('terrain/cloud-net-e', 'terrain/clouds.png', 3, 2, 100, 100),
		spriteDef('terrain/cloud-net-sw', 'terrain/clouds.png', 0, 3, 100, 100),
		spriteDef('terrain/cloud-net-s', 'terrain/clouds.png', 2, 3, 100, 100),
		spriteDef('terrain/cloud-net-se', 'terrain/clouds.png', 1, 3, 100, 100),

		// Designs
		spriteDef('terrain/heart-w', 'terrain/clouds.png', 4, 1, 100, 100),
		spriteDef('terrain/heart-e', 'terrain/clouds.png', 5, 1, 100, 100),
		spriteDef('terrain/heart-u-w', 'terrain/clouds.png', 4, 0, 100, 100),
		spriteDef('terrain/heart-u-e', 'terrain/clouds.png', 5, 0, 100, 100),
		spriteDef('terrain/heart-a-w', 'terrain/clouds.png', 6, 1, 100, 100),
		spriteDef('terrain/heart-a-e', 'terrain/clouds.png', 7, 1, 100, 100),
		spriteDef('terrain/heart-a-u-w', 'terrain/clouds.png', 6, 0, 100, 100),
		spriteDef('terrain/heart-a-u-e', 'terrain/clouds.png', 7, 0, 100, 100),
		spriteDef('terrain/puff', 'terrain/clouds.png', 6, 2, 100, 100)]
		.forEach(function (spriteDef) {
			SpriteFactory.add(spriteDef);
		});
})();
