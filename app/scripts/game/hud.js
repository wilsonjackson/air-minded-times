/* global Ui, SpriteRepository, ObjectTypeRepository */

(function () {
	'use strict';

	var fontSprite = SpriteRepository.retrieve('font/fz');
	var skyMeat = ItemRepository.retrieve('sky-meat');
	var skyMeatBag;

	var meatCounter = Ui.addHudComponent(Ui.CORNER_NE, 200, 16);
	meatCounter.init = function (world) {
		skyMeatBag = world.firstObjectOfType(ObjectTypeRepository.PLAYER).inventory.get(skyMeat);
	};
	meatCounter.render = function (graphics, x, y) {
		fontSprite.text(skyMeatBag.qty + ' Sky Meat');
		graphics.drawSprite(fontSprite, x, y);
	};
})();
