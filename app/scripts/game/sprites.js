/* global SpriteRepository, FontSprite */

(function () {
	'use strict';

	function isFunction(o) {
		return !!(o && o.constructor && o.call && o.apply);
	}

	function spriteDef(name, url, grid, w, h, margins, ctor) {
		if (isFunction(margins)) {
			ctor = margins;
			margins = undefined;
		}
		return {name: name, url: url, x: grid.x, y: grid.y, w: w, h: h, ctor: ctor, margins: margins};
	}

	function _grid(size, offsetX, offsetY) {
		return function (x, y) {
			x = x * size + offsetX;
			y = y * size + offsetY;
			return {x: x, y: y, sub: _grid(grids[grids.indexOf(size) + 1], x, y)};
		};
	}

	var grids = [100, 50, 10];
	var grid = _grid(100, 0, 0);

	[
		// Aeroplanes
		spriteDef('aero/extended-farewell-1', 'sprites/sprites.png', grid(5, 4), 100, 100, [14, 0, 8, 1]),
		spriteDef('aero/extended-farewell-2', 'sprites/sprites.png', grid(5, 5), 100, 100, [14, 0, 8, 1]),
		spriteDef('aero/extended-farewell-muzzle-1', 'sprites/sprites.png', grid(5, 6), 100, 100, [14, 0, 8, 1]),
		spriteDef('aero/extended-farewell-muzzle-2', 'sprites/sprites.png', grid(5, 7), 100, 100, [14, 0, 8, 1]),

		spriteDef('aero/biplanedieplane-1', 'sprites/sprites.png', grid(4, 4), 100, 100, [14, 0, 8, 1]),
		spriteDef('aero/biplanedieplane-2', 'sprites/sprites.png', grid(4, 5), 100, 100, [14, 0, 8, 1]),
		spriteDef('aero/biplanedieplane-muzzle', 'sprites/sprites.png', grid(4, 6), 100, 100, [14, 0, 8, 1]),

		spriteDef('aero/justice-glider-mkiv-1', 'sprites/sprites.png', grid(6, 4), 100, 100, [18, 3, 14, 5]),
		spriteDef('aero/justice-glider-mkiv-2', 'sprites/sprites.png', grid(6, 5), 100, 100, [18, 3, 14, 5]),

		// Enemies & friends
		spriteDef('enemy/shell-1', 'sprites/sprites.png', grid(3, 4), 100, 100, [8, 20, 8, 20]),
		spriteDef('enemy/shell-2', 'sprites/sprites.png', grid(3, 5), 100, 100, [8, 20, 8, 20]),
		spriteDef('enemy/shell-damage', 'sprites/sprites.png', grid(3, 6), 100, 100, [8, 20, 8, 20]),

		spriteDef('enemy/baby-1', 'sprites/sprites.png', grid(4, 7).sub(0, 0), 50, 50),
		spriteDef('enemy/baby-2', 'sprites/sprites.png', grid(4, 7).sub(0, 1), 50, 50),
		spriteDef('enemy/baby-3', 'sprites/sprites.png', grid(4, 7).sub(1, 0), 50, 50),
		spriteDef('enemy/baby-4', 'sprites/sprites.png', grid(4, 7).sub(1, 1), 50, 50),

		spriteDef('decoration/egg-pile', 'sprites/sprites.png', grid(2, 6), 100, 100),
		spriteDef('decoration/egg-mound', 'sprites/sprites.png', grid(2, 8), 100, 100),
		spriteDef('decoration/egg-mountain', 'sprites/sprites.png', grid(0, 7), 200, 200),
		spriteDef('decoration/hatched-egg-pile', 'sprites/sprites.png', grid(2, 7), 100, 100),
		spriteDef('decoration/hatched-egg-mound', 'sprites/sprites.png', grid(0, 9), 200, 100),

		// Projectiles
		spriteDef('projectile/bullet', 'sprites/sprites.png', grid(2, 5).sub(0, 0).sub(0, 0), 10, 10),
		spriteDef('projectile/tesla', 'sprites/sprites.png', grid(2, 5).sub(0, 0).sub(1, 0), 10, 10),
		spriteDef('projectile/spray-1', 'sprites/sprites.png', grid(2, 5).sub(0, 0).sub(2, 0), 10, 10),
		spriteDef('projectile/spray-2', 'sprites/sprites.png', grid(2, 5).sub(0, 0).sub(3, 0), 10, 10),
		spriteDef('projectile/spray-3', 'sprites/sprites.png', grid(2, 5).sub(0, 0).sub(4, 0), 10, 10),

		// Effects
		spriteDef('effect/explode-1', 'sprites/sprites.png', grid(3, 7), 100, 100),
		spriteDef('effect/explode-2', 'sprites/sprites.png', grid(3, 8), 100, 100),
		spriteDef('effect/explode-3', 'sprites/sprites.png', grid(3, 9), 100, 100),

		// Items
		spriteDef('item/sky-meat', 'sprites/sprites.png', grid(5, 3), 100, 100, [25, 4, 23, 8]),
		spriteDef('item/small-sky-meat', 'sprites/sprites.png', grid(2, 4).sub(0, 0), 50, 50),

		// Fonts
		spriteDef('font/fz', 'fonts/fz-fantasy_zone-sega.png', grid(0, 0), 16, 16, FontSprite)]
		.forEach(function (spriteDef) {
			SpriteRepository.add(spriteDef);
		});
})();
