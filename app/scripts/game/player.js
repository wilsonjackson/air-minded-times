(function (Engine, AirMindedTimes) {
	'use strict';

	var EntityCategory = Engine.physics.EntityCategory;
	var Input = Engine.input.Input;
	var SpriteRepository = Engine.graphics.SpriteRepository;
	var SpriteAnimator = Engine.graphics.SpriteAnimator;
	var SpriteStack = Engine.graphics.SpriteStack;
	var Inventory = Engine.inventory.Inventory;
	var SpriteObject = Engine.objects.SpriteObject;
	var ObjectType = Engine.objects.ObjectType;

	var PlaneSelection = {
		plane: AirMindedTimes.planes.GREEN_WONDERFUL
	};

	function Player() {
		SpriteObject.call(this);

		this.type = ObjectType.PLAYER;
		this.entityCategory = EntityCategory.PLAYER;

		this.movement = new AirMindedTimes.controls.PlayerMovement(this);
		this.obstacleCollisionListener = new AirMindedTimes.collision.ObstacleCollisionListener(this);
		this.plane = new PlaneSelection.plane();
		this.sprite = this.plane.sprite;
		this.inventory = new Inventory();
		this.health = 3;
		this.invulnerable = 0;
		this.speed = 4;
		this.deathTicks = 0;
	}

	Player.prototype = Object.create(SpriteObject.prototype);

	Player.prototype._init = function () {
		this.entity.addCollisionListener(this.obstacleCollisionListener);
		this.entity.addCollisionListener(this.onCollide.bind(this));
	};

	Player.prototype._destroy = function () {
		this.movement.destroy();
		this.obstacleCollisionListener.destroy();
		this.plane.destroy();
		delete this.movement;
		delete this.obstacleCollisionListener;
		delete this.plane;
		delete this.inventory;
	};

	Player.prototype.update = function (world, inputState) {
		if (this.invulnerable > 0) {
			if (--this.invulnerable === 0) {
				this.plane.endDamage();
			}
		}
		if (this.deathTicks > 0) {
			if (--this.deathTicks === 0) {
				this.destroy();
				return;
			}
		}
		else {
			this.movement.update(world, inputState);
			if (inputState.isPressed(Input.ACTION)) {
				this.plane.fire(this.entity, this.entity.getOrientation(), world);
			}
			this.plane.update(world, inputState);
		}
		this.sprite.update();
	};

	Player.prototype.onCollide = function (collision) {
		if (this.invulnerable === 0 && collision.entity.category === EntityCategory.ENEMY) {
			if (--this.health > 0) {
				this.plane.startDamage();
				this.invulnerable = 60;
			}
			else {
				this.die();
			}
		}
	};

	Player.prototype.die = function () {
		this.events.trigger('death', this);
		this.entity.collidable = false;
		this.sprite = new SpriteAnimator(5, [
			new SpriteStack([
				this.sprite,
				SpriteRepository.retrieve('effect/explode-1')
			]),
			SpriteRepository.retrieve('effect/explode-2'),
			SpriteRepository.retrieve('effect/explode-3')
		]);
		this.deathTicks = 15;
	};

	Engine.objects.ObjectFactory.register('player', Player);

	AirMindedTimes.player = {
		PlaneSelection: PlaneSelection
	};
})(Engine, AirMindedTimes);
