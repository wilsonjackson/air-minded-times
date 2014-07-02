Engine.module('amt.objects.planes.JusticeGliderMkiv',
	[
		'graphics.sprite.SpriteRepository',
		'graphics.sprite.SpriteAnimator',
		'physics.Orientation',
		'amt.objects.planes.Plane'
	],
	function (SpriteRepository, SpriteAnimator, Orientation, Plane) {
		'use strict';

		function JusticeGliderMkiv() {
			Plane.call(this);

			this.bulletType = 'projectile/spray';
			this.bulletOffsets = [2];

			this.sprite.push(
				new SpriteAnimator(3, [
					SpriteRepository.retrieve('aero/justice-glider-mkiv-1'),
					SpriteRepository.retrieve('aero/justice-glider-mkiv-2')
				]));
		}

		JusticeGliderMkiv.prototype = Object.create(Plane.prototype);
		JusticeGliderMkiv.prototype.constructor = JusticeGliderMkiv;

		JusticeGliderMkiv.prototype._getBulletStartPosition = function (entity, orientation) {
			switch (orientation) {
				case Orientation.NORTH:
					return new Vector(entity.getX() + Math.round(entity.getWidth() / 2), entity.getY());
				case Orientation.EAST:
					return new Vector(entity.getX() + entity.getWidth(), entity.getY() + Math.round(entity.getHeight() / 2));
				case Orientation.SOUTH:
					return new Vector(entity.getX() + Math.round(entity.getWidth() / 2), entity.getY() + entity.getHeight());
				case Orientation.WEST:
					return new Vector(entity.getX(), entity.getY() + Math.round(entity.getHeight() / 2));
			}
		};

		return JusticeGliderMkiv;
	});
