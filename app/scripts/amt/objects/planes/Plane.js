Engine.module('amt.objects.planes.Plane',
	[
		'math.Vector',
		'physics.Orientation',
		'graphics.sprite.SpriteStack'
	],
	function (Vector, Orientation, SpriteStack) {
		'use strict';

		function Plane() {
			this.bulletType = 'projectile/bullet';
			this.bulletWidth = 10;
			this.bulletOffsets = [0];
			this.tickCount = 0;
			this.sprite = new SpriteStack([]);
			this.damageSprite = this.sprite;
			this.state = new AliveState(this);
		}

		Plane.prototype.fire = function (entity, orientation, world) {
			this.state.fire(entity, orientation, world);
		};

		Plane.prototype.startDamage = function () {
			this._undamagedSprite = this.sprite.swap(0, this.damageSprite);
		};

		Plane.prototype.endDamage = function () {
			if (this._undamagedSprite) {
				this.sprite.swap(0, this._undamagedSprite);
			}
		};

		Plane.prototype.update = function () {
			if (this.state) {
				this.state.update();
			}
		};

		Plane.prototype.destroy = function () {
			this.state.destroy();
			delete this.state;
		};

		function AliveState(plane) {
			this.plane = plane;
			this.firing = false;
			this.firingDelay = 10;
			this.readyToFire = true;
			this.tickCount = 0;
			this.ticksPerFrame = 7;
		}

		AliveState.prototype.fire = function (entity, orientation, world) {
			if (this.readyToFire) {
				if (this.plane.muzzleFlashSprite) {
					this.plane.sprite.push(this.plane.muzzleFlashSprite);
				}
				this._spawnBullets(entity, orientation, world);
				this.firing = true;
				this.readyToFire = false;
			}
		};

		AliveState.prototype.end = function () {
			if (this.firing) {
				this.readyToFire = true;
				this.tickCount = 0;
			}
		};

		AliveState.prototype.update = function () {
			if (this.firing) {
				if (++this.tickCount === this.ticksPerFrame) {
					this.firing = false;
					if (this.plane.muzzleFlashSprite) {
						this.plane.sprite.pop();
					}
				}
			}
			else if (!this.readyToFire) {
				if (++this.tickCount >= this.firingDelay) {
					this.readyToFire = true;
					this.tickCount = 0;
				}
			}
		};

		AliveState.prototype._spawnBullets = function (entity, orientation, world) {
			var bulletPosition = this._getBulletStartPosition(entity, orientation);
			for (var i = 0, len = this.plane.bulletOffsets.length; i < len; i++) {
				var offset = orientation.translateXY(Math.round(this.plane.bulletOffsets[i] - this.plane.bulletWidth / 2), 0);
				world.spawnObject(this.plane.bulletType, bulletPosition.x + offset.x, bulletPosition.y + offset.y, orientation);
			}
		};

		AliveState.prototype._getBulletStartPosition = function (entity, orientation) {
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

		AliveState.prototype.destroy = function () {
			delete this.plane;
		};

		return Plane;
	});
