Engine.module('amt.objects.projectiles.Spray',
	[
		'world.objects.ObjectFactory',
		'graphics.sprite.SpriteRepository',
		'amt.objects.projectiles.Bullet'
	],
	function (ObjectFactory, SpriteRepository, Bullet) {
		'use strict';

		function Spray() {
			Bullet.call(this);
			this.bulletSprites = [
				SpriteRepository.retrieve('projectile/spray-1'),
				SpriteRepository.retrieve('projectile/spray-2'),
				SpriteRepository.retrieve('projectile/spray-3')
			];
			this._randomSprite();
		}

		Spray.prototype = Object.create(Bullet.prototype);

		Spray.prototype._randomSprite = function () {
			var random = Math.floor(Math.random() * this.bulletSprites.length % this.bulletSprites.length);
			this.sprite = this.bulletSprites[random];
		};

		Spray.prototype.update = function () {
			this._randomSprite();
			Bullet.prototype.update.apply(this, arguments);
		};

		ObjectFactory.register('projectile/spray', Spray);
	});
