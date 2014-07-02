Engine.module('graphics.sprite.BoxSprite',
	['graphics.sprite.Sprite'],
	function () {
		'use strict';

		var Sprite = Engine.graphics.sprite.Sprite;

		function BoxSprite() {
		}

		BoxSprite.prototype = Object.create(Sprite.prototype);

		BoxSprite.prototype._init = function () {
			this.sectionSize = this.getWidth() / 3;
		};

		BoxSprite.prototype.setWidth = function (width) {
			this.width = width;
		};

		BoxSprite.prototype.setHeight = function (height) {
			this.height = height;
		};

		BoxSprite.prototype.draw = function (context, x, y) {
			var self = this;
			var size = this.sectionSize;
			var halfW = this.width / 2;
			var halfH = this.height / 2;
			var left = x - halfW;
			var top = y - halfH;
			var right = x + halfW - size;
			var bottom = y + halfH - size;

			// Top & bottom
			var hOffset = right - left - size;
			while (hOffset > 0) {
				if (hOffset < size) {
					hOffset = size;
				}
				context.drawImage(self.image, self.x + size, self.y, size, size, left + hOffset, top, size, size);
				context.drawImage(self.image, self.x + size, self.y + size * 2, size, size, left + hOffset, bottom, size, size);
				hOffset -= size;
			}

			// Left & right
			var vOffset = bottom - top - size;
			while (vOffset > 0) {
				if (vOffset < size) {
					vOffset = size;
				}
				context.drawImage(self.image, self.x, self.y + size, size, size, left, top + vOffset, size, size);
				context.drawImage(self.image, self.x + size * 2, self.y + size, size, size, right, top + vOffset, size, size);
				vOffset -= size;
			}

			// Corners
			context.drawImage(self.image, self.x, self.y, size, size, left, top, size, size);
			context.drawImage(self.image, self.x + size * 2, self.y, size, size, right, top, size, size);
			context.drawImage(self.image, self.x, self.y + size * 2, size, size, left, bottom, size, size);
			context.drawImage(self.image, self.x + size * 2, self.y + size * 2, size, size, right, bottom, size, size);
		};

		BoxSprite.SECTION_NW = [0, 0];
		BoxSprite.SECTION_N = [1, 0];
		BoxSprite.SECTION_NE = [2, 0];
		BoxSprite.SECTION_E = [2, 1];
		BoxSprite.SECTION_SE = [2, 2];
		BoxSprite.SECTION_S = [1, 2];
		BoxSprite.SECTION_SW = [0, 2];
		BoxSprite.SECTION_W = [0, 1];

		return {
			BoxSprite: BoxSprite
		};
	});
