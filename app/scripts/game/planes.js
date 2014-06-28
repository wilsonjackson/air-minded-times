/* global Engine, AirMindedTimes, Vector */

(function (Engine, AirMindedTimes, Vector) {
	'use strict';

	var Orientation = Engine.physics.Orientation;
	var SpriteRepository = Engine.graphics.SpriteRepository;
	var SpriteAnimator = Engine.graphics.SpriteAnimator;
	var SpriteStack = Engine.graphics.SpriteStack;

	function Plane() {
		this.bulletType = 'projectile/bullet';
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
			var offset = orientation.translateXY(this.plane.bulletOffsets[i], 0);
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

	function TheExtendedFarewell() {
		Plane.call(this);

		this.bulletType = 'projectile/tesla';
		this.fireModes = [
			{bulletOffsets: [-30, 30], sprite: SpriteRepository.retrieve('aero/extended-farewell-muzzle-1')},
			{bulletOffsets: [-14, 14], sprite: SpriteRepository.retrieve('aero/extended-farewell-muzzle-2')}
		];
		this.setFireMode(this.fireModes[0]);

		var animationFrames = [
			SpriteRepository.retrieve('aero/extended-farewell-1'),
			SpriteRepository.retrieve('aero/extended-farewell-2')];
		this.sprite.push(new SpriteAnimator(3, animationFrames));
		this.damageSprite = new SpriteAnimator(3,
			[SpriteRepository.retrieve('aero/extended-farewell-damage')].concat(animationFrames));

		this.name = 'The Extended Farewell';
		this.description = [
				'Cutting edge technology and startling',
				'design come together in creating the',
				'unique 4-gun system that puts this',
				'machine at the forefront of the',
				'preferential ladder for aeroplane',
				'enthusiasts who are out to do some',
				'real or extreme damage.'];
	}

	TheExtendedFarewell.prototype = Object.create(Plane.prototype);
	TheExtendedFarewell.prototype.constructor = TheExtendedFarewell;

	TheExtendedFarewell.prototype.setFireMode = function (fireMode) {
		this.muzzleFlashSprite = fireMode.sprite;
		this.bulletOffsets = fireMode.bulletOffsets;
	};

	TheExtendedFarewell.prototype.fire = function () {
		if (this.firingState.readyToFire) {
			var fireMode = this.fireModes.pop();
			this.setFireMode(fireMode);
			this.fireModes.unshift(fireMode);
			Plane.prototype.fire.apply(this, arguments);
		}
	};

	function GreenWonderful() {
		Plane.call(this);

		this.bulletOffsets = [-14, 14];

		var animationFrames = [
			SpriteRepository.retrieve('aero/green-wonderful-1'),
			SpriteRepository.retrieve('aero/green-wonderful-2')];
		this.sprite.push(new SpriteAnimator(3, animationFrames));
		this.muzzleFlashSprite = SpriteRepository.retrieve('aero/green-wonderful-muzzle');
		this.damageSprite = new SpriteAnimator(3,
			[SpriteRepository.retrieve('aero/green-wonderful-damage')].concat(animationFrames));

		this.name = 'Green Wonderful';
		this.description = [
				'A sight to behold when it darts left',
				'and right, forward and backward.',
				'Renowned for its ability to fly',
				'through the air, this is one',
				'aeroplane that has definitely earned',
				'its reputation as "Green Aluminum',
				'Bird Of The Sky".'];
	}

	GreenWonderful.prototype = Object.create(Plane.prototype);
	GreenWonderful.prototype.constructor = GreenWonderful;

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

	AirMindedTimes.planes = {
		THE_EXTENDED_FAREWELL: TheExtendedFarewell,
		GREEN_WONDERFUL: GreenWonderful,
		JUSTICE_GLIDER_MKIV: JusticeGliderMkiv
	};
})(Engine, AirMindedTimes, Vector);
