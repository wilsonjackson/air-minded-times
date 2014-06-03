/* global SpriteFactory */

(function () {
	'use strict';

	function p(i) {
		return i * 50;
	}

	[{name: 'aero/extended-farewell', url: 'aero/planes.png', x: p(1), y: p(0), w: 50, h: 50},
		{name: 'aero/biplane-dieplane', url: 'aero/planes.png', x: p(0), y: p(0), w: 50, h: 50},
		{name: 'aero/justice-glider-mkiv', url: 'aero/planes.png', x: p(2), y: p(0), w: 50, h: 50},
		{name: 'terrain/cloud-empty', url: 'terrain/clouds.png', x: p(0), y: p(1), w: 50, h: 50},
		{name: 'terrain/cloud-nw', url: 'terrain/clouds.png', x: p(2), y: p(3), w: 50, h: 50},
		{name: 'terrain/cloud-n', url: 'terrain/clouds.png', x: p(4), y: p(0), w: 50, h: 50},
		{name: 'terrain/cloud-ne', url: 'terrain/clouds.png', x: p(5), y: p(3), w: 50, h: 50},
		{name: 'terrain/cloud-w', url: 'terrain/clouds.png', x: p(2), y: p(1), w: 50, h: 50},
		{name: 'terrain/cloud-c', url: 'terrain/clouds.png', x: p(3), y: p(1), w: 50, h: 50},
		{name: 'terrain/cloud-e', url: 'terrain/clouds.png', x: p(6), y: p(1), w: 50, h: 50},
		{name: 'terrain/cloud-sw', url: 'terrain/clouds.png', x: p(2), y: p(4), w: 50, h: 50},
		{name: 'terrain/cloud-s', url: 'terrain/clouds.png', x: p(4), y: p(2), w: 50, h: 50},
		{name: 'terrain/cloud-se', url: 'terrain/clouds.png', x: p(5), y: p(4), w: 50, h: 50},
		{name: 'terrain/cloud-a-nw', url: 'terrain/clouds.png', x: p(2), y: p(0), w: 50, h: 50},
		{name: 'terrain/cloud-a-nnw', url: 'terrain/clouds.png', x: p(3), y: p(0), w: 50, h: 50},
		{name: 'terrain/cloud-a-nne', url: 'terrain/clouds.png', x: p(5), y: p(0), w: 50, h: 50},
		{name: 'terrain/cloud-a-ne', url: 'terrain/clouds.png', x: p(6), y: p(0), w: 50, h: 50},
		{name: 'terrain/cloud-a-sw', url: 'terrain/clouds.png', x: p(2), y: p(2), w: 50, h: 50},
		{name: 'terrain/cloud-a-ssw', url: 'terrain/clouds.png', x: p(3), y: p(2), w: 50, h: 50},
		{name: 'terrain/cloud-a-sse', url: 'terrain/clouds.png', x: p(5), y: p(2), w: 50, h: 50},
		{name: 'terrain/cloud-a-se', url: 'terrain/clouds.png', x: p(6), y: p(2), w: 50, h: 50},
		{name: 'terrain/cloud-in-nw', url: 'terrain/clouds.png', x: p(3), y: p(3), w: 50, h: 50},
		{name: 'terrain/cloud-in-ne', url: 'terrain/clouds.png', x: p(4), y: p(3), w: 50, h: 50},
		{name: 'terrain/cloud-in-sw', url: 'terrain/clouds.png', x: p(3), y: p(4), w: 50, h: 50},
		{name: 'terrain/cloud-in-se', url: 'terrain/clouds.png', x: p(4), y: p(4), w: 50, h: 50},
		{name: 'terrain/cloud-heart-w', url: 'terrain/clouds.png', x: p(0), y: p(2), w: 50, h: 50},
		{name: 'terrain/cloud-heart-e', url: 'terrain/clouds.png', x: p(1), y: p(2), w: 50, h: 50},
		{name: 'terrain/cloud-heart2-w', url: 'terrain/clouds.png', x: p(0), y: p(0), w: 50, h: 50},
		{name: 'terrain/cloud-heart2-e', url: 'terrain/clouds.png', x: p(1), y: p(0), w: 50, h: 50},
		{name: 'terrain/cloud-puff', url: 'terrain/clouds.png', x: p(5), y: p(1), w: 50, h: 50}]
		.forEach(function (spriteDef) {
			SpriteFactory.add(spriteDef);
		});
})();
