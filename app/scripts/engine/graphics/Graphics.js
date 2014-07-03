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
				var xCenterOffset = Math.round(sprite.width / 2);
				var yCenterOffset = -Math.round(sprite.height / 2);
				context.save();
				translated = this.viewport.translate(x + xCenterOffset, y + yCenterOffset);
				context.translate(translated.x, translated.y);
				context.rotate(orientation.asRadians());
				sprite.draw(context, -xCenterOffset, -yCenterOffset);
				context.restore();
			}
			else {
				translated = this.viewport.translate(x, y);
				sprite.draw(context, translated.x, translated.y);
			}
		};

		Graphics.prototype.drawRect = function (x, y, w, h, options) {
			var context = this.viewport.context;
			if (options.fill) {
				context.fillStyle = options.fill;
				context.fillRect(x, y - h, w, h);
			}
			if (options.stroke) {
				context.strokeStyle = options.stroke;
				context.strokeRect(x, y - h, w, h);
			}
		};

		return Graphics;
	});
