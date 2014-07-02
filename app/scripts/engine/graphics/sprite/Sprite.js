Engine.module('graphics.sprite.Sprite', function () {
	'use strict';

	// No constructor args for easy extension; configured via init()
	function Sprite() {

	}

	Sprite.prototype.init = function (image, x, y, w, h, margins) {
		this.image = image;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.margins = margins || [0, 0, 0, 0];
		this._drawWidth = this.getWidth();
		this._drawHeight = this.getHeight();
		// Inform subclasses of initialization.
		if (this._init) {
			this._init();
		}
	};

	Sprite.prototype.getWidth = function () {
		return this.w - this.margins[1] - this.margins[3];
	};

	Sprite.prototype.getHeight = function () {
		return this.h - this.margins[0] - this.margins[2];
	};

	Sprite.prototype.getTopMargin = function () {
		return this.margins[0];
	};

	Sprite.prototype.getLeftMargin = function () {
		return this.margins[3];
	};

	Sprite.prototype.getRightMargin = function () {
		return this.margins[1];
	};

	Sprite.prototype.getBottomMargin = function () {
		return this.margins[2];
	};

	Sprite.prototype.update = function () {
		// No default update action; this is where animation would occur.
		return false;
	};

	Sprite.prototype.draw = function (context, x, y) {
		context.drawImage(this.image,
				this.x + this.margins[3],
				this.y + this.margins[0],
			this._drawWidth,
			this._drawHeight,
				x - Math.round(this.getWidth() / 2),
				y - Math.round(this.getHeight() / 2),
			this._drawWidth,
			this._drawHeight);
	};

	Sprite.prototype.toString = function () {
		return 'Sprite(src=' + this.image.src + ', x=' + this.x + ', y=' + this.y + ', w=' + this.w + ', h=' + this.h + ')';
	};

	return {
		Sprite: Sprite
	};
});
