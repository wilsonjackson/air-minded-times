/* globals ItemRepository, ObjectFactory, ObjectType, SpriteObject, SpriteRepository, EntityCategory */

(function () {
	'use strict';

	var SKY_MEAT = ItemRepository.add({
		id: 'sky-meat',
		name: 'Sky Meat',
		description: 'The bounty of the wild blue yonder.',
		sprite: SpriteRepository.retrieve('item/sky-meat')
	});

	function SkyMeat() {
		this.type = ObjectType.ITEM;
		this.item = SKY_MEAT;
		this.sprite = SpriteRepository.retrieve('item/sky-meat');
		this.entityCategory = EntityCategory.ITEM;
	}

	SkyMeat.prototype = new SpriteObject();

	function SmallSkyMeat() {
		this.type = ObjectType.ITEM;
		this.item = SKY_MEAT;
		this.sprite = SpriteRepository.retrieve('item/small-sky-meat');
		this.entityCategory = EntityCategory.ITEM;
	}

	SmallSkyMeat.prototype = new SpriteObject();

	ObjectFactory.register('item/sky-meat', SkyMeat);
	ObjectFactory.register('item/small-sky-meat', SmallSkyMeat);
})();
