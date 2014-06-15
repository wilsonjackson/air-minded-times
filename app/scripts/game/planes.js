/* globals Vector, Orientation, SpriteRepository, SpriteAnimator, SpriteStack */

(function () {
	'use strict';

	function Plane() {
		this.bulletType = 'projectile/bullet';
		this.bulletOffsets = [0];
		this.firingDelay = 10;
		this.readyToFire = true;
		this.ticksPerFrame = 7;
		this.tickCount = 0;
		this.sprite = new SpriteStack([]);
	}

	Plane.prototype.fire = function (entity, orientation, world) {
		if (this.readyToFire) {
			this.sprite.push(this.muzzleFlashSprite);
			this._spawnBullets(entity, orientation, world);
			this.firing = true;
			this.readyToFire = false;
		}
	};

	Plane.prototype._spawnBullets = function (entity, orientation, world) {
		var bulletPosition  = this._getBulletStartPosition(entity, orientation);
		for (var i = 0, len = this.bulletOffsets.length; i < len; i++) {
			var offset = orientation.translateXY(this.bulletOffsets[i], 0);
			world.spawnObject(this.bulletType, bulletPosition.x + offset.x, bulletPosition.y + offset.y, orientation);
		}
	};

	Plane.prototype._getBulletStartPosition = function (entity, orientation) {
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

	Plane.prototype.update = function () {
		if (this.firing) {
			if (++this.tickCount === this.ticksPerFrame) {
				this.firing = false;
				this.sprite.pop();
			}
		}
		else if (!this.readyToFire) {
			if (++this.tickCount >= this.firingDelay) {
				this.readyToFire = true;
				this.tickCount = 0;
			}
		}
	};

	function ExtendedFarewell() {
		this.bulletType = 'projectile/tesla';
		this.fireModes = [
			{bulletOffsets: [-30, 30], sprite: SpriteRepository.retrieve('aero/extended-farewell-muzzle-1')},
			{bulletOffsets: [-14, 14], sprite: SpriteRepository.retrieve('aero/extended-farewell-muzzle-2')}
		];
		this.setFireMode(this.fireModes[0]);

		this.sprite.push(
			new SpriteAnimator(3, [
				SpriteRepository.retrieve('aero/extended-farewell-1'),
				SpriteRepository.retrieve('aero/extended-farewell-2')
			]));
	}

	ExtendedFarewell.prototype = new Plane();

	ExtendedFarewell.prototype.setFireMode = function (fireMode) {
		this.muzzleFlashSprite = fireMode.sprite;
		this.bulletOffsets = fireMode.bulletOffsets;
	};

	ExtendedFarewell.prototype.fire = function () {
		if (this.readyToFire) {
			var fireMode = this.fireModes.pop();
			this.setFireMode(fireMode);
			this.fireModes.unshift(fireMode);
			Plane.prototype.fire.apply(this, arguments);
		}
	};

	function Biplanedieplane() {
		this.sprite.push(
			new SpriteAnimator(3, [
				SpriteRepository.retrieve('aero/biplanedieplane-1'),
				SpriteRepository.retrieve('aero/biplanedieplane-2')
			]));
		this.muzzleFlashSprite = SpriteRepository.retrieve('aero/biplanedieplane-muzzle');
		this.bulletOffsets = [-14, 14];
	}

	Biplanedieplane.prototype = new Plane();

	window.Planes = {
		EXTENDED_FAREWELL: ExtendedFarewell,

		BIPLANEDIEPLANE: Biplanedieplane,

		JUSTICEGLIDERMKIV: {

		}
	};
})();