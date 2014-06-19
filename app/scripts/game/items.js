/* globals Game */

(function (Game) {
	'use strict';

	var EntityCategory = Game.physics.EntityCategory;
	var ObjectFactory = Game.objects.ObjectFactory;
	var ObjectType = Game.objects.ObjectType;
	var SpriteObject = Game.objects.SpriteObject;
	var SpriteRepository = Game.graphics.SpriteRepository;
	var ItemRepository = Game.inventory.ItemRepository;

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
})(Game);
