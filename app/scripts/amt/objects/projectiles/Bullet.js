Engine.module('amt.objects.projectiles.Bullet',
	[
		'math.Vector',
		'physics.Orientation',
		'physics.EntityCategory',
		'world.objects.ObjectFactory',
		'world.objects.ObjectType',
		'world.objects.SpriteObject',
		'graphics.sprite.SpriteRepository'
	],
	function (Vector, Orientation, EntityCategory, ObjectFactory, ObjectType, SpriteObject, SpriteRepository) {
		'use strict';

		function Bullet() {
			SpriteObject.call(this);
			this.type = ObjectType.PROJECTILE;
			this.entityCategory = EntityCategory.PROJECTILE;
			this.sprite = SpriteRepository.retrieve('projectile/bullet');
			this.speed = 10;
			this.range = 500;
			this.traveled = 0;
		}

		Bullet.prototype = Object.create(SpriteObject.prototype);

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

		ObjectFactory.register('projectile/bullet', Bullet);

		return Bullet;
	});
