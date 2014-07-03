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
		// Inform subclasses of initialization.
		if (this._init) {
			this._init();
		}
	};

	Sprite.prototype.getWidth = function () {
		return this.w;
	};

	Sprite.prototype.getHeight = function () {
		return this.h;
	};

	Sprite.prototype.getHitboxWidth = function () {
		return this.w - this.margins[1] - this.margins[3];
	};

	Sprite.prototype.getHitboxHeight = function () {
		return this.h - this.margins[0] - this.margins[2];
	};

	//noinspection JSUnusedGlobalSymbols
	Sprite.prototype.getTopMargin = function () {
		return this.margins[0];
	};

	Sprite.prototype.getLeftMargin = function () {
		return this.margins[3];
	};

	//noinspection JSUnusedGlobalSymbols
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
		// Anchor at bottom left corner
		context.drawImage(this.image,
			this.x,
			this.y,
			this.w,
			this.h,
			x - this.margins[3],
			y - this.h + this.margins[2],
			this.w,
			this.h);
	};

	Sprite.prototype.toString = function () {
		return 'Sprite(src=' + this.image.src + ', x=' + this.x + ', y=' + this.y + ', w=' + this.w + ', h=' + this.h + ')';
	};

	return Sprite;
});
