Engine.module('amt.objects.planes.TheExtendedFarewell',
	[
		'graphics.sprite.SpriteRepository',
		'graphics.sprite.SpriteAnimator',
		'amt.objects.planes.Plane'
	],
	function (SpriteRepository, SpriteAnimator, Plane) {
		'use strict';

		function TheExtendedFarewell() {
			Plane.call(this);

			this.bulletType = 'projectile/tesla';
			this.fireModes = [
				{bulletOffsets: [-30, 30], sprite: SpriteRepository.retrieve('aero/extended-farewell-muzzle-1')},
				{bulletOffsets: [-14, 14], sprite: SpriteRepository.retrieve('aero/extended-farewell-muzzle-2')}
			];
			this.setFireMode(this.fireModes[0]);

			var animationFrames = [
				SpriteRepository.retrieve('aero/extended-farewell-1'),
				SpriteRepository.retrieve('aero/extended-farewell-2')
			];
			this.sprite.push(new SpriteAnimator(3, animationFrames));
			this.damageSprite = new SpriteAnimator(3,
				[SpriteRepository.retrieve('aero/extended-farewell-damage')].concat(animationFrames));

			this.name = 'The Extended Farewell';
			this.description = [
				'Cutting edge technology and startling',
				'design come together in creating the',
				'unique 4-gun system that puts this',
				'machine at the forefront of the',
				'preferential ladder for aeroplane',
				'enthusiasts who are out to do some',
				'real or extreme damage.'
			];
		}

		TheExtendedFarewell.prototype = Object.create(Plane.prototype);
		TheExtendedFarewell.prototype.constructor = TheExtendedFarewell;

		TheExtendedFarewell.prototype.setFireMode = function (fireMode) {
			this.muzzleFlashSprite = fireMode.sprite;
			this.bulletOffsets = fireMode.bulletOffsets;
		};

		TheExtendedFarewell.prototype.fire = function () {
			if (this.state.readyToFire) {
				var fireMode = this.fireModes.pop();
				this.setFireMode(fireMode);
				this.fireModes.unshift(fireMode);
				Plane.prototype.fire.apply(this, arguments);
			}
		};

		return TheExtendedFarewell;
	});
