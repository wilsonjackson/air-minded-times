/* globals Vector, ObjectFactory, ObjectType, SpriteObject, SpriteRepository, Orientation, EntityCategory */

(function () {
	'use strict';

	function Bullet() {
		this.type = ObjectType.PROJECTILE;
		this.entityCategory = EntityCategory.PROJECTILE;
		this.sprite = SpriteRepository.retrieve('projectile/bullet');
		this.speed = 10;
		this.range = 500;
		this.traveled = 0;
	}

	Bullet.prototype = new SpriteObject();

	Bullet.prototype._init = function () {
		switch (this.entity.getOrientation()) {
			case Orientation.NORTH:
				this.movementVector = new Vector(0, -this.speed);
				break;
			case Orientation.SOUTH:
				this.movementVector = new Vector(0, this.speed);
				break;
			case Orientation.WEST:
				this.movementVector = new Vector(-this.speed, 0);
				break;
			case Orientation.EAST:
				this.movementVector = new Vector(this.speed, 0);
				break;
		}

		// Bullet is initialized with its intended center position instead of top/left, so it's corrected here.
		this.entity.impulse(-(this.entity.getWidth() / 2), -(this.entity.getHeight() / 2));
	};

	Bullet.prototype.update = function () {
		if (this.traveled >= this.range) {
			this.destroy();
			return;
		}
		this.traveled += this.speed;
		this.entity.impulse(this.movementVector.x, this.movementVector.y);
	};

	Bullet.prototype.render = function () {
		SpriteObject.prototype.render.apply(this, arguments);
	};

	function Tesla() {
		this.sprite = SpriteRepository.retrieve('projectile/tesla');
	}

	Tesla.prototype = new Bullet();

	function Spray() {
		this.bulletSprites = [
			SpriteRepository.retrieve('projectile/spray-1'),
			SpriteRepository.retrieve('projectile/spray-2'),
			SpriteRepository.retrieve('projectile/spray-3')
		];
		this._randomSprite();
	}

	Spray.prototype = new Bullet();

	Spray.prototype._randomSprite = function () {
		var random = Math.floor(Math.random() * this.bulletSprites.length % this.bulletSprites.length);
		this.sprite = this.bulletSprites[random];
	};

	Spray.prototype.update = function () {
		this._randomSprite();
		Bullet.prototype.update.apply(this, arguments);
	};

	ObjectFactory.register('projectile/bullet', Bullet);
	ObjectFactory.register('projectile/tesla', Tesla);
	ObjectFactory.register('projectile/spray', Spray);
})();
