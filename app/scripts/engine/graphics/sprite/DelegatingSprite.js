Engine.module('graphics.sprite.DelegatingSprite',
	['graphics.sprite.Sprite'],
	function (Sprite) {
		'use strict';

		var spriteCopyProps = [
			'image',
			'x',
			'y',
			'w',
			'h',
			'margins'
		];

		function DelegatingSprite() {
		}

		DelegatingSprite.prototype = Object.create(Sprite.prototype);

		DelegatingSprite.prototype._copy = function () {
			var delegate = this.delegate;
			for (var i = 0, len = spriteCopyProps.length; i < len; i++) {
				this[spriteCopyProps[i]] = delegate[spriteCopyProps[i]];
			}
		};

		DelegatingSprite.prototype.translatePosition = function (referenceSprite, sprite, x, y) {
			return {
				x: x + Math.round((referenceSprite.getHitboxWidth() - sprite.getHitboxWidth()) / 2),
				y: y - Math.round((referenceSprite.getHitboxHeight() - sprite.getHitboxHeight()) / 2)
			};
		};

		return DelegatingSprite;
	});
