Engine.module('amt.objects.enemies.ShellEnemy',
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

		ObjectFactory.register('enemy/shell', ShellEnemy);
	});
