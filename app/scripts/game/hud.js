/* global Engine */

(function (Engine, AirMindedTimes) {
	'use strict';

//	var Ui = Engine.ui.Ui;
//	var TextSprite = Engine.graphics.TextSprite;
//
//	var fontSprite = Engine.graphics.SpriteRepository.retrieve('font/fz');
//	var skyMeat = Engine.inventory.ItemRepository.retrieve('sky-meat');
//	var topPadding = 5;
//	var sidePadding = 5;
//
//	var meatCounterWidth = 200;
//	var meatCounterHeight = 16;
//	var healthBarWidth = 200;
//	var healthBarHeight = 16;
//
//	var player = null;
//
//	var meatCounter = Ui.addHudComponent(Ui.CORNER_NE, meatCounterWidth + sidePadding, meatCounterHeight + topPadding);
//	meatCounter.render = function (graphics, x, y) {
//		if (player === null) {
//			return;
//		}
//		var text = new TextSprite(fontSprite, [player.inventory.get(skyMeat).qty + ' Sky Meat'])
//			.width(meatCounterWidth)
//			.height(meatCounterHeight)
//			.center()
//			.right();
//		graphics.drawSprite(text, x - sidePadding, y + topPadding);
//	};
//
//	var healthBar = Ui.addHudComponent(Ui.CORNER_NW, healthBarWidth + sidePadding, healthBarHeight + topPadding);
//	healthBar.render = function (graphics, x, y) {
//		if (player === null) {
//			return;
//		}
//		var text = new TextSprite(fontSprite, [player.health + ''])
//			.width(healthBarWidth)
//			.height(healthBarHeight)
//			.center()
//			.left();
//		graphics.drawSprite(text, x + sidePadding, y + topPadding);
//	};
//
//	function HudUpdateInterloper() {
//	}
//
//	HudUpdateInterloper.prototype = Object.create(Engine.world.Interloper.prototype);
//
//	HudUpdateInterloper.prototype.mapChange = function (world) {
//		player = world.getPlayers()[0];
//		player.events.on('destroy', function () {
//			player = null;
//		});
//	};
//
//	AirMindedTimes.hud = {
//		HudUpdateInterloper: HudUpdateInterloper
//	};
})(Engine, AirMindedTimes);
