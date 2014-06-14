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
		spriteDef('aero/extended-farewell-1', 'sprites/sprites.png', grid(5, 2), 100, 100, [14, 0, 8, 1]),
		spriteDef('aero/extended-farewell-2', 'sprites/sprites.png', grid(5, 3), 100, 100, [14, 0, 8, 1]),
		spriteDef('aero/extended-farewell-muzzle-1', 'sprites/sprites.png', grid(5, 4), 100, 100, [14, 0, 8, 1]),
		spriteDef('aero/extended-farewell-muzzle-2', 'sprites/sprites.png', grid(5, 5), 100, 100, [14, 0, 8, 1]),

		spriteDef('aero/biplanedieplane-1', 'sprites/sprites.png', grid(4, 2), 100, 100, [14, 0, 8, 1]),
		spriteDef('aero/biplanedieplane-2', 'sprites/sprites.png', grid(4, 3), 100, 100, [14, 0, 8, 1]),
		spriteDef('aero/biplanedieplane-muzzle', 'sprites/sprites.png', grid(4, 4), 100, 100, [14, 0, 8, 1]),

		spriteDef('aero/justice-glider-mkiv-1', 'sprites/sprites.png', grid(6, 2), 100, 100, [18, 3, 14, 5]),
		spriteDef('aero/justice-glider-mkiv-2', 'sprites/sprites.png', grid(6, 3), 100, 100, [18, 3, 14, 5]),

		// Enemies & friends
		spriteDef('enemy/shell', 'sprites/sprites.png', grid(3, 2), 100, 100, [8, 20, 8, 20]),
		spriteDef('enemy/shell-2', 'sprites/sprites.png', grid(3, 3), 100, 100, [8, 20, 8, 20]),

		// Projectiles
		spriteDef('projectile/bullet', 'sprites/sprites.png', grid(2, 3).sub(0, 0).sub(0, 0), 10, 10),
		spriteDef('projectile/tesla', 'sprites/sprites.png', grid(2, 3).sub(0, 0).sub(1, 0), 10, 10),
		spriteDef('projectile/spray-1', 'sprites/sprites.png', grid(2, 3).sub(0, 0).sub(2, 0), 10, 10),
		spriteDef('projectile/spray-2', 'sprites/sprites.png', grid(2, 3).sub(0, 0).sub(3, 0), 10, 10),
		spriteDef('projectile/spray-3', 'sprites/sprites.png', grid(2, 3).sub(0, 0).sub(4, 0), 10, 10),

		// Items
		spriteDef('item/sky-meat', 'sprites/sprites.png', grid(5, 1), 100, 100, [25, 4, 23, 8]),

		// Fonts
		spriteDef('font/fz', 'fonts/fz-fantasy_zone-sega.png', grid(0, 0), 16, 16, FontSprite)]
		.forEach(function (spriteDef) {
			SpriteRepository.add(spriteDef);
		});
})();
