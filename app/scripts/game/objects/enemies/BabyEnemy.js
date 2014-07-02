Engine.module('amt.objects.enemies.BabyEnemy',
	[
		'world.objects.ObjectFactory',
		'graphics.sprite.SpriteRepository',
		'graphics.sprite.SpriteAnimator',
		'graphics.sprite.SpriteStack',
		'amt.objects.enemies.Enemy'
	],
	function () {
		'use strict';

		var ObjectFactory = Engine.world.objects.ObjectFactory;
		var SpriteRepository = Engine.graphics.sprite.SpriteRepository;
		var SpriteAnimator = Engine.graphics.sprite.SpriteAnimator;
		var SpriteStack = Engine.graphics.sprite.SpriteStack;
		var Enemy = Engine.amt.objects.enemies.Enemy;

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

		ObjectFactory.register('enemy/baby', BabyEnemy);
	});
