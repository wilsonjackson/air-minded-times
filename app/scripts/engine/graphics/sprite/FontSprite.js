Engine.module('graphics.sprite.FontSprite',
	['graphics.sprite.Sprite'],
	function () {
		'use strict';

		var Sprite = Engine.graphics.sprite.Sprite;

		function FontSprite() {
			this.chars = ' !"# %&\'[]*+,-. 0123456789     ? ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
			this.buffer = [];
		}

		FontSprite.prototype = Object.create(Sprite.prototype);

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

		return {
			FontSprite: FontSprite
		};
	});
