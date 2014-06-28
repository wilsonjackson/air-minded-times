/* global Game */

(function (Game, AirMindedTimes) {
	'use strict';

	var Ui = Game.ui.Ui;
	var TextSprite = Game.graphics.TextSprite;

	var fontSprite = Game.graphics.SpriteRepository.retrieve('font/fz');
	var skyMeat = Game.inventory.ItemRepository.retrieve('sky-meat');
	var topPadding = 5;
	var sidePadding = 5;

	var meatCounterWidth = 200;
	var meatCounterHeight = 16;
	var healthBarWidth = 200;
	var healthBarHeight = 16;

	var player = null;

	var meatCounter = Ui.addHudComponent(Ui.CORNER_NE, meatCounterWidth + sidePadding, meatCounterHeight + topPadding);
	meatCounter.render = function (graphics, x, y) {
		if (player === null) {
			return;
		}
		var text = new TextSprite(fontSprite, [player.inventory.get(skyMeat).qty + ' Sky Meat'])
			.width(meatCounterWidth)
			.height(meatCounterHeight)
			.center()
			.right();
		graphics.drawSprite(text, x - sidePadding, y + topPadding);
	};

	var healthBar = Ui.addHudComponent(Ui.CORNER_NW, healthBarWidth + sidePadding, healthBarHeight + topPadding);
	healthBar.render = function (graphics, x, y) {
		if (player === null) {
			return;
		}
		var text = new TextSprite(fontSprite, [player.health + ''])
			.width(healthBarWidth)
			.height(healthBarHeight)
			.center()
			.left();
		graphics.drawSprite(text, x + sidePadding, y + topPadding);
	};

	function HudUpdateInterloper() {
	}

	HudUpdateInterloper.prototype = Object.create(Game.world.Interloper.prototype);

	HudUpdateInterloper.prototype.mapChange = function (world) {
		player = world.getPlayers()[0];
		player.events.on('destroy', function () {
			player = null;
		});
	};

	AirMindedTimes.hud = {
		HudUpdateInterloper: HudUpdateInterloper
	};
})(Game, AirMindedTimes);
