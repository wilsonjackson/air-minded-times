Engine.module('graphics.sprite.TextSprite',
	['graphics.sprite.Sprite'],
	function () {
		'use strict';

		var Sprite = Engine.graphics.sprite.Sprite;

		function TextSprite(fontSprite, text) {
			this.fontSprite = fontSprite;
			this.text = text;
			this.w = null;
			this.h = null;
			this.c = false;
			this.align = 0;
		}

		TextSprite.prototype = Object.create(Sprite.prototype);

		TextSprite.prototype.width = function (w) {
			this.w = w;
			return this;
		};

		TextSprite.prototype.height = function (h) {
			this.h = h;
			return this;
		};

		TextSprite.prototype.fullWidth = function () {
			this.w = Engine.getViewport().width;
			return this;
		};

		TextSprite.prototype.fullHeight = function () {
			this.h = Engine.getViewport().height;
			return this;
		};

		TextSprite.prototype.center = function () {
			this.c = true;
			return this;
		};

		TextSprite.prototype.left = function () {
			this.align = -1;
			return this;
		};

		TextSprite.prototype.right = function () {
			this.align = 1;
			return this;
		};

		TextSprite.prototype.getWidth = function () {
			return this.w || this.fontSprite.getWidth() * Math.max(this.text.map(function (s) {
				return s.length;
			}));
		};

		TextSprite.prototype.getHeight = function () {
			return this.h || this.fontSprite.getHeight() * this.text.length;
		};

		TextSprite.prototype.draw = function (context, x, y) {
			var self = this;
			var charW = self.fontSprite.getWidth();
			var charH = self.fontSprite.getHeight();
			var topLineY = Math.round(y - (self.c ? charH * self.text.length : this.getHeight()) / 2);

			for (var i = 0, len = self.text.length; i < len; i++) {
				var line = self.text[i];
				var left;
				if (this.align === -1) {
					left = x - this.getWidth() / 2;
				}
				else if (this.align === 1) {
					left = x + this.getWidth() / 2 - charW * line.length;
				}
				else {
					left = x - (self.c ? charW * line.length : this.getWidth()) / 2;
				}
				self.fontSprite.text(line);
				self.fontSprite.draw(context, Math.round(left), topLineY + charH * i);
			}
		};

		return {
			TextSprite: TextSprite
		};
	});
