Engine.module('graphics.sprite.SpriteAnimator',
	['graphics.sprite.DelegatingSprite'],
	function (DelegatingSprite) {
		'use strict';

		function SpriteAnimator(interval, sprites) {
			this.interval = interval || 10;
			this.frames = sprites;
			this.reset();
		}

		SpriteAnimator.prototype = Object.create(DelegatingSprite.prototype);

		SpriteAnimator.prototype.reset = function () {
			this.tickCount = -1;
			this.nextIdx = 0;
			this.delegate = this.frames[this.nextIdx];
			this._copy();
		};

		SpriteAnimator.prototype.update = function () {
			for (var i = 0, len = this.frames.length; i < len; i++) {
				this.frames[i].update();
			}
			if (++this.tickCount === this.interval) {
				this.tickCount = 0;
				++this.nextIdx;
				if (this.nextIdx === this.frames.length) {
					this.nextIdx = 0;
				}
				this.delegate = this.frames[this.nextIdx];
				this._copy();
			}
		};

		SpriteAnimator.prototype.toString = function () {
			return 'SpriteAnimator[' + this.frames.map(function (o) {
				return o.toString();
			}).join(', ') + ']';
		};

		return SpriteAnimator;
	});
