Engine.module('amt.game.Hud',
	[
		'math.Vector',
		'graphics.HudScene',
		'graphics.sprite.SpriteRepository',
		'graphics.sprite.TextSprite',
		'world.items.ItemRepository',
		'amt.game.Sprites',
		'amt.objects.items.Items'
	],
	function (Vector, HudScene, SpriteRepository, TextSprite, ItemRepository) {
		'use strict';

		var fontSprite = SpriteRepository.retrieve('font/fz');
		var skyMeat = ItemRepository.retrieve('sky-meat');
		var topPadding = 5;
		var sidePadding = 5;

		var meatCounterWidth = 200;
		var meatCounterHeight = 16;
		var meatCounterHudSize = new Vector(meatCounterWidth + sidePadding, meatCounterHeight + topPadding);
		var healthBarWidth = 200;
		var healthBarHeight = 16;
		var healthBarHudSize = new Vector(healthBarWidth + sidePadding, healthBarHeight + topPadding);

		function Hud(game) {
			HudScene.call(this);

			this.addComponent(healthBarHudSize, HudScene.TOP_LEFT, function (viewport) {
				var text = new TextSprite(fontSprite, [game.getPlayer().health + ''])
					.width(healthBarWidth)
					.height(healthBarHeight)
					.center()
					.left();
				viewport.getGraphics().drawSprite(text, sidePadding, topPadding);
			});

			this.addComponent(meatCounterHudSize, HudScene.TOP_RIGHT, function (viewport) {
				var text = new TextSprite(fontSprite, [game.getInventory().get(skyMeat).qty + ' Sky Meat'])
					.width(meatCounterWidth)
					.height(meatCounterHeight)
					.center()
					.right();
				viewport.getGraphics().drawSprite(text, -sidePadding, topPadding);
			});
		}

		Hud.prototype = Object.create(HudScene.prototype);

		return Hud;
	});
