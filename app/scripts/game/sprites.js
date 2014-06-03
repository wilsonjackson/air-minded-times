/* global SpriteFactory */

(function () {
	'use strict';

	function p(i) {
		return i * 100;
	}

	[{name: 'aero/extended-farewell', url: 'aero/planes.png', x: p(1), y: p(0), w: 100, h: 100},
		{name: 'aero/biplane-dieplane', url: 'aero/planes.png', x: p(0), y: p(0), w: 100, h: 100},
		{name: 'aero/justice-glider-mkiv', url: 'aero/planes.png', x: p(2), y: p(0), w: 100, h: 100},

		// Default empty tile
		{name: 'terrain/empty', url: 'terrain/clouds.png', x: p(5), y: p(3), w: 100, h: 100},

		// Cloud masses
		{name: 'terrain/cloud-nw', url: 'terrain/clouds.png', x: p(0), y: p(0), w: 100, h: 100},
		{name: 'terrain/cloud-n', url: 'terrain/clouds.png', x: p(2), y: p(0), w: 100, h: 100},
		{name: 'terrain/cloud-ne', url: 'terrain/clouds.png', x: p(1), y: p(0), w: 100, h: 100},
		{name: 'terrain/cloud-w', url: 'terrain/clouds.png', x: p(3), y: p(1), w: 100, h: 100},
		{name: 'terrain/cloud-c', url: 'terrain/clouds.png', x: p(5), y: p(2), w: 100, h: 100},
		{name: 'terrain/cloud-e', url: 'terrain/clouds.png', x: p(3), y: p(0), w: 100, h: 100},
		{name: 'terrain/cloud-sw', url: 'terrain/clouds.png', x: p(0), y: p(1), w: 100, h: 100},
		{name: 'terrain/cloud-s', url: 'terrain/clouds.png', x: p(2), y: p(1), w: 100, h: 100},
		{name: 'terrain/cloud-se', url: 'terrain/clouds.png', x: p(1), y: p(1), w: 100, h: 100},
		// For now all 'inner' corners are just using the center tile.
		{name: 'terrain/cloud-in-nw', url: 'terrain/clouds.png', x: p(5), y: p(2), w: 100, h: 100},
		{name: 'terrain/cloud-in-ne', url: 'terrain/clouds.png', x: p(5), y: p(2), w: 100, h: 100},
		{name: 'terrain/cloud-in-sw', url: 'terrain/clouds.png', x: p(5), y: p(2), w: 100, h: 100},
		{name: 'terrain/cloud-in-se', url: 'terrain/clouds.png', x: p(5), y: p(2), w: 100, h: 100},

		// Netting masses
		{name: 'terrain/net-nw', url: 'terrain/clouds.png', x: p(0), y: p(4), w: 100, h: 100},
		{name: 'terrain/net-n', url: 'terrain/clouds.png', x: p(2), y: p(4), w: 100, h: 100},
		{name: 'terrain/net-ne', url: 'terrain/clouds.png', x: p(1), y: p(4), w: 100, h: 100},
		{name: 'terrain/net-w', url: 'terrain/clouds.png', x: p(3), y: p(5), w: 100, h: 100},
		{name: 'terrain/net-c', url: 'terrain/clouds.png', x: p(4), y: p(3), w: 100, h: 100},
		{name: 'terrain/net-e', url: 'terrain/clouds.png', x: p(3), y: p(4), w: 100, h: 100},
		{name: 'terrain/net-sw', url: 'terrain/clouds.png', x: p(0), y: p(5), w: 100, h: 100},
		{name: 'terrain/net-s', url: 'terrain/clouds.png', x: p(2), y: p(5), w: 100, h: 100},
		{name: 'terrain/net-se', url: 'terrain/clouds.png', x: p(1), y: p(5), w: 100, h: 100},

		// Cloud in netting
		{name: 'terrain/cloud-net-nw', url: 'terrain/clouds.png', x: p(0), y: p(2), w: 100, h: 100},
		{name: 'terrain/cloud-net-n', url: 'terrain/clouds.png', x: p(2), y: p(2), w: 100, h: 100},
		{name: 'terrain/cloud-net-ne', url: 'terrain/clouds.png', x: p(1), y: p(2), w: 100, h: 100},
		{name: 'terrain/cloud-net-w', url: 'terrain/clouds.png', x: p(3), y: p(3), w: 100, h: 100},
		{name: 'terrain/cloud-net-c', url: 'terrain/clouds.png', x: p(4), y: p(2), w: 100, h: 100},
		{name: 'terrain/cloud-net-e', url: 'terrain/clouds.png', x: p(3), y: p(2), w: 100, h: 100},
		{name: 'terrain/cloud-net-sw', url: 'terrain/clouds.png', x: p(0), y: p(3), w: 100, h: 100},
		{name: 'terrain/cloud-net-s', url: 'terrain/clouds.png', x: p(2), y: p(3), w: 100, h: 100},
		{name: 'terrain/cloud-net-se', url: 'terrain/clouds.png', x: p(1), y: p(3), w: 100, h: 100},

		// Designs
		{name: 'terrain/heart-w', url: 'terrain/clouds.png', x: p(4), y: p(1), w: 100, h: 100},
		{name: 'terrain/heart-e', url: 'terrain/clouds.png', x: p(5), y: p(1), w: 100, h: 100},
		{name: 'terrain/heart-u-w', url: 'terrain/clouds.png', x: p(4), y: p(0), w: 100, h: 100},
		{name: 'terrain/heart-u-e', url: 'terrain/clouds.png', x: p(5), y: p(0), w: 100, h: 100},
		{name: 'terrain/heart-a-w', url: 'terrain/clouds.png', x: p(6), y: p(1), w: 100, h: 100},
		{name: 'terrain/heart-a-e', url: 'terrain/clouds.png', x: p(7), y: p(1), w: 100, h: 100},
		{name: 'terrain/heart-a-u-w', url: 'terrain/clouds.png', x: p(6), y: p(0), w: 100, h: 100},
		{name: 'terrain/heart-a-u-e', url: 'terrain/clouds.png', x: p(7), y: p(0), w: 100, h: 100},
		{name: 'terrain/puff', url: 'terrain/clouds.png', x: p(6), y: p(2), w: 100, h: 100}]
		.forEach(function (spriteDef) {
			SpriteFactory.add(spriteDef);
		});
})();
