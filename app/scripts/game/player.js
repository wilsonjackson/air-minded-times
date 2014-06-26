(function (Game, AirMindedTimes) {
	'use strict';

	var EntityCategory = Game.physics.EntityCategory;
	var Input = Game.input.Input;
	var SpriteRepository = Game.graphics.SpriteRepository;
	var SpriteAnimator = Game.graphics.SpriteAnimator;
	var SpriteStack = Game.graphics.SpriteStack;
	var Inventory = Game.inventory.Inventory;
	var SpriteObject = Game.objects.SpriteObject;
	var ObjectType = Game.objects.ObjectType;

	var PlaneSelection = {
		plane: new AirMindedTimes.planes.GREEN_WONDERFUL()
	};

	function Player() {
		SpriteObject.call(this);

		this.type = ObjectType.PLAYER;
		this.entityCategory = EntityCategory.PLAYER;

		this.movement = new AirMindedTimes.controls.PlayerMovement(this);
		this.obstacleCollisionListener = new AirMindedTimes.collision.ObstacleCollisionListener(this);
		this.plane = PlaneSelection.plane;
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

	Game.objects.ObjectFactory.register('player', Player);

	AirMindedTimes.player = {
		PlaneSelection: PlaneSelection
	};
})(Game, AirMindedTimes);
