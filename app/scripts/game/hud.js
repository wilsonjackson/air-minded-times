/* global Game */

(function (Game) {
	'use strict';

	var Ui = Game.ui.Ui;
	var TextSprite = Game.graphics.TextSprite;

	var fontSprite = Game.graphics.SpriteRepository.retrieve('font/fz');
	var skyMeat = Game.inventory.ItemRepository.retrieve('sky-meat');
	var topPadding = 5;
	var sidePadding = 5;

	var meatCounterWidth = 200;
	var meatCounterHeight = 16;
	var meatCounter = Ui.addHudComponent(Ui.CORNER_NE, meatCounterWidth + sidePadding, meatCounterHeight + topPadding);
	meatCounter.init = function (world) {
		this.skyMeatBag = world.getPlayers()[0].inventory.get(skyMeat);
	};
	meatCounter.render = function (graphics, x, y) {
		var text = new TextSprite(fontSprite, [this.skyMeatBag.qty + ' Sky Meat'])
			.width(meatCounterWidth)
			.height(meatCounterHeight)
			.center()
			.right();
		graphics.drawSprite(text, x - sidePadding, y + topPadding);
	};

	var healthBarWidth = 200;
	var healthBarHeight = 16;
	var healthBar = Ui.addHudComponent(Ui.CORNER_NW, healthBarWidth + sidePadding, healthBarHeight + topPadding);
	healthBar.init = function (world) {
		this.player = world.getPlayers()[0];
	};
	healthBar.render = function (graphics, x, y) {
		var text = new TextSprite(fontSprite, [this.player.health + ''])
			.width(healthBarWidth)
			.height(healthBarHeight)
			.center()
			.left();
		graphics.drawSprite(text, x + sidePadding, y + topPadding);
	};
})(Game);
