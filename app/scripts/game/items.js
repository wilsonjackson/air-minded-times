/* global Engine */

(function (Engine) {
	'use strict';

	var EntityCategory = Engine.physics.EntityCategory;
	var ObjectFactory = Engine.objects.ObjectFactory;
	var ObjectType = Engine.objects.ObjectType;
	var SpriteObject = Engine.objects.SpriteObject;
	var SpriteRepository = Engine.graphics.SpriteRepository;
	var ItemRepository = Engine.inventory.ItemRepository;

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
})(Engine);
