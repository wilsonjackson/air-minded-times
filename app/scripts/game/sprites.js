/* global SpriteRepository, Sprite */

(function () {
	'use strict';

	function spriteDef(name, url, x, y, w, h, ctor) {
		return {name: name, url: url, x: x * w, y: y * h, w: w, h: h, ctor: ctor};
	}

	function AnimatedSprite() {
		this.count = 0;
		this.animState = false;
	}

	AnimatedSprite.prototype = new Sprite();

	AnimatedSprite.prototype.update = function () {
		this.count++;
		if (this.count % 3 === 0) {
			this.count = 0;
			this.animState = !this.animState;
			this.y += this.h * (this.animState ? 1 : -1);
			return true;
		}
	};

	function FontSprite() {
		this.chars = ' !"# %&\'[]*+,-. 0123456789     ? ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
		this.buffer = [];
	}

	FontSprite.prototype = new Sprite();

	FontSprite.prototype.text = function (text) {
		var chars = this.chars;
		this.buffer = text.toUpperCase().split('').map(function (char) {
			return chars.indexOf(char);
		});
	};

	FontSprite.prototype.draw = function (context, x, y) {
		var self = this;
		var n = 0;
		this.buffer.forEach(function (index) {
			context.drawImage(self.image, self.x + index * self.w, self.y, self.w, self.h, x + n, y, self.w, self.h);
			n += self.w;
		});
		this.buffer = [];
	};

	[
		// Aeroplanes
		spriteDef('aero/extended-farewell', 'sprites/sprites.png', 5, 2, 100, 100, AnimatedSprite),
		spriteDef('aero/biplanedieplane', 'sprites/sprites.png', 4, 2, 100, 100, AnimatedSprite),
		spriteDef('aero/justice-glider-mkiv', 'sprites/sprites.png', 6, 2, 100, 100, AnimatedSprite),

		// Items
		spriteDef('item/sky-meat', 'sprites/sprites.png', 2, 2, 100, 100),

		// Enemies & friends
		spriteDef('enemy/shell', 'sprites/sprites.png', 3, 2, 100, 100, AnimatedSprite),

		// Fonts
		spriteDef('font/fz', 'fonts/fz-fantasy_zone-sega.png', 0, 0, 16, 16, FontSprite)]
		.forEach(function (spriteDef) {
			SpriteRepository.add(spriteDef);
		});
})();
