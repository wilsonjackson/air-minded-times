Engine.module('graphics.Graphics',
	['physics.Orientation'],
	function (Orientation) {
		'use strict';

		function Graphics(viewport) {
			this.viewport = viewport;
		}

		Graphics.prototype.drawSprite = function (sprite, x, y, orientation) {
			var translated;
			var context = this.viewport.context;
			if (orientation && orientation !== Orientation.NORTH) {
				// 1. Center the canvas over the center of the sprite.
				// 2. Rotate the canvas in accordance with the object's orientation (so the direction it should be facing
				//    is up).
				// 3. Tell the sprite to draw itself centered on the canvas.
				// 4. Revert canvas to original center and rotation.
				context.save();
				translated = this.viewport.translate(x, y);
				context.translate(translated.x, translated.y);
				context.rotate(orientation.asRadians());
				sprite.draw(context, 0, 0);
				context.restore();
			}
			else {
				translated = this.viewport.translate(x, y);
				sprite.draw(context, translated.x, translated.y);
			}
		};

		return Graphics;
	});
