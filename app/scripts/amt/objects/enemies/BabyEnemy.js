Engine.module('amt.objects.enemies.BabyEnemy',
	[
		'world.objects.ObjectFactory',
		'graphics.sprite.SpriteRepository',
		'graphics.sprite.SpriteAnimator',
		'graphics.sprite.SpriteStack',
		'amt.objects.enemies.Enemy'
	],
	function (ObjectFactory, SpriteRepository, SpriteAnimator, SpriteStack, Enemy) {
		'use strict';

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
