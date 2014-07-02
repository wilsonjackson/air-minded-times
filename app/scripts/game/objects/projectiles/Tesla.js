Engine.module('amt.objects.projectiles.Tesla',
	[
		'world.objects.ObjectFactory',
		'graphics.sprite.SpriteRepository'
	],
	function () {
		'use strict';

		var ObjectFactory = Engine.world.objects.ObjectFactory;
		var SpriteRepository = Engine.graphics.sprite.SpriteRepository;
		var Bullet = Engine.amt.objects.projectiles.Bullet;

		function Tesla() {
			Bullet.call(this);
			this.sprite = SpriteRepository.retrieve('projectile/tesla');
		}

		Tesla.prototype = Object.create(Bullet.prototype);

		ObjectFactory.register('projectile/tesla', Tesla);
	});
