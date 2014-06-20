/* global Game, AirMindedTimes */

(function (Game, AirMindedTimes) {
	'use strict';

	var Ui = Game.ui.Ui;
	var CoverScreen = Game.ui.CoverScreen;
	var Input = Game.input.Input;
	var SpriteRepository = Game.graphics.SpriteRepository;
	var TextSprite = Game.graphics.TextSprite;

	var fontSprite = SpriteRepository.retrieve('font/fz');

	function IntroScene1() {
		this.ticks = 200;
		this.slide = new Slide(SpriteRepository.retrieve('intro/governments'), 10, 60, -1, 50);
		this.text = new Slide(
			new TextSprite(fontSprite, ['All governments have fallen.'])
				.fullWidth()
				.height(200)
				.center(),
			10, 60, 1, 450);
	}

	IntroScene1.prototype = new CoverScreen();

	IntroScene1.prototype.update = function (world, input) {
		if (input.isPressed(Input.ACTION)) {
			Ui.activateScreen(new AirMindedTimes.screens.TitleScreen());
			return;
		}
		if (--this.ticks === 0) {
			Ui.activateScreen(new IntroScene2());
		}
	};

	IntroScene1.prototype.render = function (graphics) {
		this.slide.render(graphics);
		this.text.render(graphics);
	};

	function IntroScene2() {
		this.ticks = 200;
		this.slide = new Slide(SpriteRepository.retrieve('intro/sky-meat'), 10, 60, 1, 50);
		this.text = new Slide(
			new TextSprite(fontSprite, ['Sky meat has become a commodity.'])
				.fullWidth()
				.height(200)
				.center(),
			10, 60, -1, 450);
	}

	IntroScene2.prototype = new CoverScreen();

	IntroScene2.prototype.update = function (world, input) {
		if (input.isPressed(Input.ACTION)) {
			Ui.activateScreen(new AirMindedTimes.screens.TitleScreen());
			return;
		}
		if (--this.ticks === 0) {
			Ui.activateScreen(new IntroScene3());
		}
	};

	IntroScene2.prototype.render = function (graphics) {
		this.slide.render(graphics);
		this.text.render(graphics);
	};

	function IntroScene3() {
		this.ticks = 180;
		this.tickCount = -1;
		this.alpha = [0, 0.25, 0.5, 0.75, 1];
		this.alphaTicks = 25;
		this.currentAlpha = 0;
		this.text = new TextSprite(fontSprite, ['It seems that these must certainly be...'])
			.fullWidth()
			.fullHeight()
			.center();
	}

	IntroScene3.prototype = new CoverScreen();

	IntroScene3.prototype.update = function (world, input) {
		if (input.isPressed(Input.ACTION)) {
			Ui.activateScreen(new AirMindedTimes.screens.TitleScreen());
		}
		else if (++this.tickCount === this.ticks) {
			Ui.activateScreen(new AirMindedTimes.screens.TitleScreen());
		}
	};

	IntroScene3.prototype.render = function (graphics) {
		var context = graphics.viewport.context;
		if (this.alpha.length && this.tickCount % this.alphaTicks === 0) {
			this.currentAlpha = this.alpha.shift();
		}
		context.globalAlpha = this.currentAlpha;
		var center = graphics.getCenter();
		graphics.drawSprite(this.text, center.x, center.y);
		context.globalAlpha = 1;
	};

	function Slide(sprite,  firstFrame, duration, direction, yOffset) {
		this.tickCount = 0;
		this.sprite = sprite;
		this.firstFrame = firstFrame;
		this.duration = duration;
		this.xOffset = sprite.getWidth() * direction;
		this.yOffset = yOffset;
		this.unit = sprite.getWidth() / duration * direction;
	}

	Slide.prototype.render = function (graphics) {
		if (++this.tickCount >= this.firstFrame) {
			if (--this.duration >= 0) {
				this.xOffset -= this.unit;
			}
			graphics.drawSprite(this.sprite,
					Math.round(this.xOffset + this.sprite.getWidth() / 2),
					Math.round(this.yOffset + this.sprite.getHeight() / 2));
		}
	};

	AirMindedTimes.cinematics = {
		IntroScene1: IntroScene1
	};
})(Game, AirMindedTimes);
