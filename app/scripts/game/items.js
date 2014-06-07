/* globals ItemRepository, ObjectFactory, ObjectTypeRepository, SpriteObject, SpriteRepository */

(function () {
	'use strict';

	var SKY_MEAT = ItemRepository.add({
		id: 'sky-meat',
		name: 'Sky Meat',
		description: 'The bounty of the wild blue yonder.',
		sprite: SpriteRepository.retrieve('item/sky-meat')
	});

	function SkyMeat() {
		this.type = ObjectTypeRepository.ITEM;
		this.item = SKY_MEAT;
		this.sprite = SpriteRepository.retrieve('item/sky-meat');
	}

	SkyMeat.prototype = new SpriteObject();

	ObjectFactory.register('sky-meat', SkyMeat);
})();
