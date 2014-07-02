Engine.module('amt.objects.planes.GreenWonderful',
	[
		'graphics.sprite.SpriteRepository',
		'graphics.sprite.SpriteAnimator',
		'amt.objects.planes.Plane'
	],
	function () {
		'use strict';

		var SpriteRepository = Engine.graphics.sprite.SpriteRepository;
		var SpriteAnimator = Engine.graphics.sprite.SpriteAnimator;
		var Plane = Engine.amt.objects.planes.Plane;

		function GreenWonderful() {
			Plane.call(this);

			this.bulletOffsets = [-14, 14];

			var animationFrames = [
				SpriteRepository.retrieve('aero/green-wonderful-1'),
				SpriteRepository.retrieve('aero/green-wonderful-2')
			];
			this.sprite.push(new SpriteAnimator(3, animationFrames));
			this.muzzleFlashSprite = SpriteRepository.retrieve('aero/green-wonderful-muzzle');
			this.damageSprite = new SpriteAnimator(3,
				[SpriteRepository.retrieve('aero/green-wonderful-damage')].concat(animationFrames));

			this.name = 'Green Wonderful';
			this.description = [
				'A sight to behold when it darts left',
				'and right, forward and backward.',
				'Renowned for its ability to fly',
				'through the air, this is one',
				'aeroplane that has definitely earned',
				'its reputation as "Green Aluminum',
				'Bird Of The Sky".'
			];
		}

		GreenWonderful.prototype = Object.create(Plane.prototype);
		GreenWonderful.prototype.constructor = GreenWonderful;

		return {
			GREEN_WONDERFUL: GreenWonderful
		};
	});
