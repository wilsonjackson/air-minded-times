Engine.module('amt.objects.Player',
	[
		'physics.EntityCategory',
		'input.Input',
		'graphics.sprite.SpriteRepository',
		'graphics.sprite.SpriteAnimator',
		'graphics.sprite.SpriteStack',
		'world.objects.SpriteObject',
		'world.objects.ObjectType'
	],
	function () {
		'use strict';

		var EntityCategory = Engine.physics.EntityCategory;
		var Input = Engine.input.Input;
		var SpriteRepository = Engine.graphics.sprite.SpriteRepository;
		var SpriteAnimator = Engine.graphics.sprite.SpriteAnimator;
		var SpriteStack = Engine.graphics.sprite.SpriteStack;
		var SpriteObject = Engine.world.objects.SpriteObject;
		var ObjectType = Engine.world.objects.ObjectType;

		function Player() {
			SpriteObject.call(this);
			var currentGame = Engine.amt.game.Game.current();

			this.type = ObjectType.PLAYER;
			this.entityCategory = EntityCategory.PLAYER;

			this.movement = new Engine.amt.behavior.PlayerMovement(this);
			this.obstacleCollisionListener = new Engine.amt.behavior.ObstacleCollisionListener(this);
			this.plane = currentGame.createPlane();
			this.sprite = this.plane.sprite;
			this.inventory = currentGame.getInventory();
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

		Engine.world.objects.ObjectFactory.register('player', Player);
	});
