/* global SpriteRepository, Sprite, CoverScreen, Input, Ui, TitleScreen */

(function () {
	'use strict';

	var fontSprite = SpriteRepository.retrieve('font/fz');

	function IntroScene1() {
		this.frames = 360;
		this.slide = new Slide(SpriteRepository.retrieve('intro/governments'), 10, 60, -1, 50);
		var textSprite = new TextSprite('All governments have fallen.', fontSprite, 800, 200);
		this.text = new Slide(textSprite, 10, 60, 1, 350);
	}

	IntroScene1.prototype = new CoverScreen();

	IntroScene1.prototype.update = function (input) {
		if (input.isPressed(Input.ACTION)) {
			Ui.activateScreen(new TitleScreen());
			return;
		}
		if (--this.frames === 0) {
			Ui.activateScreen(new IntroScene2());
		}
	};

	IntroScene1.prototype.render = function (graphics) {
		var screenWidth = graphics.viewport.width;
		var screenHeight = graphics.viewport.height;
		var context = graphics.viewport.context;
		context.fillStyle = '#000';
		context.fillRect(0, 0, screenWidth, screenHeight);

		this.slide.render(graphics);
		this.text.render(graphics);
	};

	function IntroScene2() {
		this.frames = 360;
		this.slide = new Slide(SpriteRepository.retrieve('intro/sky-meat'), 10, 60, 1, 50);
		var textSprite = new TextSprite('Sky meat has become a commodity.', fontSprite, 800, 200);
		this.text = new Slide(textSprite, 10, 60, -1, 350);
	}

	IntroScene2.prototype = new CoverScreen();

	IntroScene2.prototype.update = function (input) {
		if (input.isPressed(Input.ACTION)) {
			Ui.activateScreen(new TitleScreen());
			return;
		}
		if (--this.frames === 0) {
			Ui.activateScreen(new IntroScene3());
		}
	};

	IntroScene2.prototype.render = function (graphics) {
		var screenWidth = graphics.viewport.width;
		var screenHeight = graphics.viewport.height;
		var context = graphics.viewport.context;
		context.fillStyle = '#000';
		context.fillRect(0, 0, screenWidth, screenHeight);

		this.slide.render(graphics);
		this.text.render(graphics);
	};

	function IntroScene3() {
		this.frames = 280;
		this.frameCount = -1;
		this.alpha = [0, 0.25, 0.5, 0.75, 1];
		this.alphaFrames = 25;
		this.currentAlpha = 0;
		this.text = 'It seems that these must certainly be...';
	}

	IntroScene3.prototype = new CoverScreen();

	IntroScene3.prototype.update = function (input) {
		if (input.isPressed(Input.ACTION)) {
			Ui.activateScreen(new TitleScreen());
			return;
		}
		if (++this.frameCount === this.frames) {
			Ui.activateScreen(new TitleScreen());
		}
	};

	IntroScene3.prototype.render = function (graphics) {
		var screenWidth = graphics.viewport.width;
		var screenHeight = graphics.viewport.height;
		var context = graphics.viewport.context;
		context.fillStyle = '#000';
		if (this.alpha.length) {
			context.globalAlpha = 1;
		}
		context.fillRect(0, 0, screenWidth, screenHeight);

		if (this.alpha.length && this.frameCount % this.alphaFrames === 0) {
			this.currentAlpha = this.alpha.shift();
			Game.logger.debug('Setting alpha to ' + this.currentAlpha);
		}
		context.globalAlpha = this.currentAlpha;
		fontSprite.text(this.text);
		graphics.drawSprite(fontSprite,
			Math.round((screenWidth - this.text.length * fontSprite.getWidth()) / 2),
			Math.round((screenHeight - fontSprite.getHeight()) / 2));
	};

	function Slide(sprite,  firstFrame, duration, direction, yOffset) {
		this.frameCount = 0;
		this.sprite = sprite;
		this.firstFrame = firstFrame;
		this.duration = duration;
		this.xOffset = sprite.getWidth() * direction;
		this.yOffset = yOffset;
		this.unit = sprite.getWidth() / duration * direction;
	}

	Slide.prototype.render = function (graphics) {
		if (++this.frameCount >= this.firstFrame) {
			if (--this.duration >= 0) {
				this.xOffset -= this.unit;
			}
			graphics.drawSprite(this.sprite,
					Math.round(this.xOffset + this.sprite.getWidth() / 2),
					Math.round(this.yOffset + this.sprite.getHeight() / 2));
		}
	};

	function TextSprite(text, fontSprite, w, h) {
		this.text = text;
		this.fontSprite = fontSprite;
		this.w = w;
		this.h = h;
	}

	TextSprite.prototype = new Sprite();

	TextSprite.prototype.getWidth = function () {
		return this.w;
	};

	TextSprite.prototype.getHeight = function () {
		return this.h;
	};

	TextSprite.prototype.draw = function (context, x, y) {
		this.fontSprite.text(this.text);
		this.fontSprite.draw(context,
				Math.round(x - (this.fontSprite.getWidth() * this.text.length) / 2),
				Math.round(y - this.fontSprite.getHeight() / 2));
	};

	window.IntroScene1 = IntroScene1;
})();
