/* global Game */

(function (Game) {
	'use strict';

	var Ui = Game.ui.Ui;

	var fontSprite = Game.graphics.SpriteRepository.retrieve('font/fz');
	var skyMeat = Game.inventory.ItemRepository.retrieve('sky-meat');
	var skyMeatBag;

	var meatCounter = Ui.addHudComponent(Ui.CORNER_NE, 200, 16);
	meatCounter.init = function (world) {
		skyMeatBag = world.firstObjectOfType(Game.objects.ObjectType.PLAYER).inventory.get(skyMeat);
	};
	meatCounter.render = function (graphics, x, y) {
		fontSprite.text(skyMeatBag.qty + ' Sky Meat');
		graphics.drawSprite(fontSprite, x, y);
	};
})(Game);
