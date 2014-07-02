Engine.module('amt.objects.enemies.Enemy',
	['world.objects.ObjectType', 'world.objects.SpriteObject', 'physics.EntityCategory'],
	function () {
		'use strict';

		var ObjectType = Engine.world.objects.ObjectType;
		var SpriteObject = Engine.world.objects.SpriteObject;
		var EntityCategory = Engine.physics.EntityCategory;

		function Enemy() {
			SpriteObject.call(this);
			this.type = ObjectType.ENEMY;
			this.entityCategory = EntityCategory.ENEMY;

			this.alive = true;
			this.hp = 1;
			this.state = new EnemyIdleState();
		}

		Enemy.prototype = Object.create(SpriteObject.prototype);

		Enemy.prototype._init = function () {
			var self = this;
			this.entity.addCollisionListener(function (collision, world) {
				if (collision.entity.category === EntityCategory.PROJECTILE && self.alive) {
					collision.entity.object.destroy();
					if (--self.hp === 0) {
						self.onDeath(world);
					}
					else {
						self.onDamage(world);
					}
				}
			});
		};

		Enemy.prototype.update = function (world) {
			var newState = this.state.update(world);
			if (newState) {
				this.state = newState;
			}
			this.sprite.update();
		};

		Enemy.prototype.onDamage = function (world) {
			if (!(this.state instanceof EnemyDamageState)) {
				this.damageSprite.reset();
				this.state = new EnemyDamageState(this);
				this.state.update(world);
			}
		};

		Enemy.prototype.onDeath = function (world) {
			this.alive = false;
			this.state = new EnemyDeathState(this);
			this.state.update(world);
		};

		Enemy.prototype.drop = function () {};

		function EnemyIdleState() {

		}

		EnemyIdleState.prototype.update = function () {

		};

		function EnemyDamageState(enemy) {
			this.enemy = enemy;
			this.originalSprite = enemy.sprite;
			this.countDown = enemy.damageTicks || 0;
		}

		EnemyDamageState.prototype.update = function (/*world*/) {
			if (!this.enemy.damageSprite || --this.countDown === 0) {
				this.enemy.sprite = this.originalSprite;
				return new EnemyIdleState();
			}
			else {
				this.enemy.sprite = this.enemy.damageSprite;
			}
		};

		function EnemyDeathState(enemy) {
			this.enemy = enemy;
			this.countDown = enemy.deathTicks || 0;
		}

		EnemyDeathState.prototype.update = function (world) {
			if (!this.enemy.deathSprite || --this.countDown === 0) {
				this.enemy.alive = false;
				this.enemy.drop(world);
				this.enemy.destroy();
			}
			else {
				this.enemy.sprite = this.enemy.deathSprite;
			}
		};

		return {
			Enemy: Enemy
		};
	});
