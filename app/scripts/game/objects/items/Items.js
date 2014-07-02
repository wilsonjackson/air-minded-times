Engine.module('amt.objects.items.Items',
	[
		'physics.EntityCategory',
		'world.objects.ObjectFactory',
		'world.objects.ObjectType',
		'world.objects.SpriteObject',
		'world.items.ItemRepository',
		'graphics.sprite.SpriteRepository'
	],
	function () {
		'use strict';

		var EntityCategory = Engine.physics.EntityCategory;
		var ObjectFactory = Engine.world.objects.ObjectFactory;
		var ObjectType = Engine.world.objects.ObjectType;
		var SpriteObject = Engine.world.objects.SpriteObject;
		var ItemRepository = Engine.world.items.ItemRepository;
		var SpriteRepository = Engine.graphics.sprite.SpriteRepository;

		var SKY_MEAT = ItemRepository.add({
			id: 'sky-meat',
			name: 'Sky Meat',
			description: 'The bounty of the wild blue yonder.',
			sprite: SpriteRepository.retrieve('item/sky-meat')
		});

		function SkyMeat() {
			SpriteObject.call(this);
			this.type = ObjectType.ITEM;
			this.item = SKY_MEAT;
			this.sprite = SpriteRepository.retrieve('item/sky-meat');
			this.entityCategory = EntityCategory.ITEM;
		}

		SkyMeat.prototype = Object.create(SpriteObject.prototype);

		function SmallSkyMeat() {
			SpriteObject.call(this);
			this.type = ObjectType.ITEM;
			this.item = SKY_MEAT;
			this.sprite = SpriteRepository.retrieve('item/small-sky-meat');
			this.entityCategory = EntityCategory.ITEM;
		}

		SmallSkyMeat.prototype = Object.create(SpriteObject.prototype);

		ObjectFactory.register('item/sky-meat', SkyMeat);
		ObjectFactory.register('item/small-sky-meat', SmallSkyMeat);
	});
