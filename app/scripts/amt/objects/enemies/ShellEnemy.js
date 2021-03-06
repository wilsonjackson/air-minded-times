Engine.module('amt.objects.enemies.ShellEnemy',
	[
		'world.objects.ObjectFactory',
		'graphics.sprite.SpriteRepository',
		'graphics.sprite.SpriteAnimator',
		'graphics.sprite.SpriteStack',
		'amt.objects.enemies.Enemy'
	],
	function (ObjectFactory, SpriteRepository, SpriteAnimator, SpriteStack, Enemy) {
		'use strict';

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
			world.spawnObjectAt('item/sky-meat', this);
		};

		ObjectFactory.register('enemy/shell', ShellEnemy);
	});
