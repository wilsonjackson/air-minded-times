Engine.module('amt.objects.projectiles.Tesla',
	[
		'world.objects.ObjectFactory',
		'graphics.sprite.SpriteRepository',
		'amt.objects.projectiles.Bullet'
	],
	function (ObjectFactory, SpriteRepository, Bullet) {
		'use strict';

		function Tesla() {
			Bullet.call(this);
			this.sprite = SpriteRepository.retrieve('projectile/tesla');
		}

		Tesla.prototype = Object.create(Bullet.prototype);

		ObjectFactory.register('projectile/tesla', Tesla);
	});
