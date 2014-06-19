/* globals Game, AirMindedTimes, Vector */

(function (Game, AirMindedTimes, Vector) {
	'use strict';

	var Orientation = Game.physics.Orientation;
	var SpriteRepository = Game.graphics.SpriteRepository;
	var SpriteAnimator = Game.graphics.SpriteAnimator;
	var SpriteStack = Game.graphics.SpriteStack;

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
			if (this.muzzleFlashSprite) {
				this.sprite.push(this.muzzleFlashSprite);
			}
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
				if (this.muzzleFlashSprite) {
					this.sprite.pop();
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

	function TheExtendedFarewell() {
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

	TheExtendedFarewell.prototype = new Plane();

	TheExtendedFarewell.prototype.setFireMode = function (fireMode) {
		this.muzzleFlashSprite = fireMode.sprite;
		this.bulletOffsets = fireMode.bulletOffsets;
	};

	TheExtendedFarewell.prototype.fire = function () {
		if (this.readyToFire) {
			var fireMode = this.fireModes.pop();
			this.setFireMode(fireMode);
			this.fireModes.unshift(fireMode);
			Plane.prototype.fire.apply(this, arguments);
		}
	};

	function GreenWonderful() {
		this.sprite.push(
			new SpriteAnimator(3, [
				SpriteRepository.retrieve('aero/green-wonderful-1'),
				SpriteRepository.retrieve('aero/green-wonderful-2')
			]));
		this.muzzleFlashSprite = SpriteRepository.retrieve('aero/green-wonderful-muzzle');
		this.bulletOffsets = [-14, 14];

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

	GreenWonderful.prototype = new Plane();

	function JusticeGliderMkiv() {
		this.bulletType = 'projectile/spray';
		this.sprite.push(
			new SpriteAnimator(3, [
				SpriteRepository.retrieve('aero/justice-glider-mkiv-1'),
				SpriteRepository.retrieve('aero/justice-glider-mkiv-2')
			]));
		this.bulletOffsets = [2];
	}

	JusticeGliderMkiv.prototype = new Plane();

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
})(Game, AirMindedTimes, Vector);
