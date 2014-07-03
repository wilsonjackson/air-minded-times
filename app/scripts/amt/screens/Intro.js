Engine.module('amt.screens.Intro',
	[
		'input.Input',
		'graphics.Scene',
		'graphics.sprite.SpriteRepository',
		'graphics.sprite.TextSprite',
		'amt.screens.TitleScreen',
		'amt.game.Sprites'
	],
	function (Input, Scene, SpriteRepository, TextSprite, TitleScreen) {
		'use strict';

		var fontSprite = SpriteRepository.retrieve('font/fz');

		function IntroScene1() {
			this.ticks = 200;
			this.slide = new Slide(SpriteRepository.retrieve('intro/governments'), 10, 60, -1, 450);
			this.text = new Slide(
				new TextSprite(fontSprite, ['All governments have fallen.'])
					.fullWidth()
					.height(200)
					.center(),
				10, 60, 1, 650);
		}

		IntroScene1.prototype = Object.create(Scene.prototype);

		IntroScene1.prototype.update = function (input) {
			if (input.isPressed(Input.ACTION)) {
				Engine.setScene(new TitleScreen());
				return;
			}
			if (--this.ticks === 0) {
				Engine.setScene(new IntroScene2());
			}
		};

		IntroScene1.prototype.render = function (viewport) {
			this.slide.render(viewport);
			this.text.render(viewport);
		};

		function IntroScene2() {
			this.ticks = 200;
			this.slide = new Slide(SpriteRepository.retrieve('intro/sky-meat'), 10, 60, 1, 450);
			this.text = new Slide(
				new TextSprite(fontSprite, ['Sky meat has become a commodity.'])
					.fullWidth()
					.height(200)
					.center(),
				10, 60, -1, 650);
		}

		IntroScene2.prototype = Object.create(Scene.prototype);

		IntroScene2.prototype.update = function (input) {
			if (input.isPressed(Input.ACTION)) {
				Engine.setScene(new TitleScreen());
				return;
			}
			if (--this.ticks === 0) {
				Engine.setScene(new IntroScene3());
			}
		};

		IntroScene2.prototype.render = function (viewport) {
			this.slide.render(viewport);
			this.text.render(viewport);
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

		IntroScene3.prototype = Object.create(Scene.prototype);

		IntroScene3.prototype.update = function (input) {
			if (input.isPressed(Input.ACTION)) {
				Engine.setScene(new TitleScreen());
			}
			else if (++this.tickCount === this.ticks) {
				Engine.setScene(new TitleScreen());
			}
		};

		IntroScene3.prototype.render = function (viewport) {
			var context = viewport.context;
			if (this.alpha.length && this.tickCount % this.alphaTicks === 0) {
				this.currentAlpha = this.alpha.shift();
			}
			context.globalAlpha = this.currentAlpha;
			viewport.getGraphics().drawSprite(this.text, 0, viewport.height);
			context.globalAlpha = 1;
		};

		function Slide(sprite, firstFrame, duration, direction, yOffset) {
			this.tickCount = 0;
			this.sprite = sprite;
			this.firstFrame = firstFrame;
			this.duration = duration;
			this.xOffset = sprite.getWidth() * direction;
			this.yOffset = yOffset;
			this.unit = sprite.getWidth() / duration * direction;
		}

		Slide.prototype.render = function (viewport) {
			if (++this.tickCount >= this.firstFrame) {
				if (--this.duration >= 0) {
					this.xOffset -= this.unit;
				}
				viewport.getGraphics().drawSprite(this.sprite, this.xOffset, this.yOffset);
			}
		};

		return IntroScene1;
	});
