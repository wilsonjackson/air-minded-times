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
			'margins',
			'_drawWidth',
			'_drawHeight'
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

		return DelegatingSprite;
	});
