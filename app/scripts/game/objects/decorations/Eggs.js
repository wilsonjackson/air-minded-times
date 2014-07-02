Engine.module('amt.objects.decorations.Eggs',
	[
		'world.objects.ObjectFactory',
		'world.objects.ObjectType',
		'world.objects.SpriteObject',
		'graphics.sprite.SpriteRepository',
		'physics.EntityCategory'
	],
	function () {
		'use strict';

		var ObjectFactory = Engine.world.objects.ObjectFactory;
		var ObjectType = Engine.world.objects.ObjectType;
		var SpriteObject = Engine.world.objects.SpriteObject;
		var SpriteRepository = Engine.graphics.sprite.SpriteRepository;
		var EntityCategory = Engine.physics.EntityCategory;

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

		ObjectFactory.register('decoration/egg-pile', createEggPileConstructor('decoration/egg-pile'));
		ObjectFactory.register('decoration/egg-mound', createEggPileConstructor('decoration/egg-mound'));
		ObjectFactory.register('decoration/egg-mountain', createEggPileConstructor('decoration/egg-mountain'));
		ObjectFactory.register('decoration/hatched-egg-pile', createEggPileConstructor('decoration/hatched-egg-pile'));
		ObjectFactory.register('decoration/hatched-egg-mound', createEggPileConstructor('decoration/hatched-egg-mound'));
	});
