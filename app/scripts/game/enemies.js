/* global Engine */

(function (Engine) {
	'use strict';

	var ObjectFactory = Engine.objects.ObjectFactory;
	var ObjectType = Engine.objects.ObjectType;
	var SpriteObject = Engine.objects.SpriteObject;
	var SpriteRepository = Engine.graphics.SpriteRepository;
	var SpriteAnimator = Engine.graphics.SpriteAnimator;
	var SpriteStack = Engine.graphics.SpriteStack;
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

	function ShellEnemy() {
		Enemy.call(this);
		this.hp = 3;
		this.sprite = new SpriteAnimator(25, [
			SpriteRepository.retrieve('enemy/shell-1'),
			SpriteRepository.retrieve('enemy/shell-2')
		]);
		this.damageSprite = new SpriteAnimator(5, [
			SpriteRepository.retrieve('enemy/shell-2'),
			SpriteRepository.retrieve('enemy/shell-damage')
		]);
		this.damageTicks = 25;
		this.deathSprite = new SpriteAnimator(5, [
			new SpriteStack([
				SpriteRepository.retrieve('enemy/shell-2'),
				SpriteRepository.retrieve('effect/explode-1')
			]),
			SpriteRepository.retrieve('effect/explode-2'),
			SpriteRepository.retrieve('effect/explode-3')
		]);
		this.deathTicks = 15;
	}

	ShellEnemy.prototype = Object.create(Enemy.prototype);

	ShellEnemy.prototype.drop = function (world) {
		var center = this.entity.getCenter();
		world.spawnObject('item/sky-meat', center.x, center.y);
	};

	function BabyEnemy() {
		Enemy.call(this);
		this.hp = 1;
		this.sprite = new SpriteAnimator(25, [
			SpriteRepository.retrieve('enemy/baby-1'),
			SpriteRepository.retrieve('enemy/baby-2'),
			SpriteRepository.retrieve('enemy/baby-1'),
			SpriteRepository.retrieve('enemy/baby-2'),
			SpriteRepository.retrieve('enemy/baby-3'),
			SpriteRepository.retrieve('enemy/baby-4'),
			SpriteRepository.retrieve('enemy/baby-3'),
			SpriteRepository.retrieve('enemy/baby-4')
		]);
		this.deathSprite = new SpriteAnimator(5, [
			new SpriteStack([
				SpriteRepository.retrieve('enemy/baby-1'),
				SpriteRepository.retrieve('effect/explode-1')
			]),
			SpriteRepository.retrieve('effect/explode-2'),
			SpriteRepository.retrieve('effect/explode-3')
		]);
		this.deathTicks = 15;
	}

	BabyEnemy.prototype = Object.create(Enemy.prototype);

	BabyEnemy.prototype.drop = function (world) {
		var center = this.entity.getCenter();
		world.spawnObject('item/small-sky-meat', center.x, center.y);
	};

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

	function createEggPileConstructor(spriteName) {
		var EggPileCtor = function () {
			SpriteObject.call(this);
			this.type = ObjectType.DECORATION;
			this.entityCategory = EntityCategory.OBSTACLE;
			this.sprite = SpriteRepository.retrieve(spriteName);
		};

		EggPileCtor.prototype = Object.create(SpriteObject.prototype);

		return EggPileCtor;
	}

	ObjectFactory.register('enemy/shell', ShellEnemy);
	ObjectFactory.register('enemy/baby', BabyEnemy);
	ObjectFactory.register('decoration/egg-pile', createEggPileConstructor('decoration/egg-pile'));
	ObjectFactory.register('decoration/egg-mound', createEggPileConstructor('decoration/egg-mound'));
	ObjectFactory.register('decoration/egg-mountain', createEggPileConstructor('decoration/egg-mountain'));
	ObjectFactory.register('decoration/hatched-egg-pile', createEggPileConstructor('decoration/hatched-egg-pile'));
	ObjectFactory.register('decoration/hatched-egg-mound', createEggPileConstructor('decoration/hatched-egg-mound'));
})(Engine);
