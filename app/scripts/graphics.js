(function () {
	'use strict';

	function Graphics(viewport) {
		this.viewport = viewport;
	}

	Graphics.prototype.clear = function () {
		// Assigning width to a canvas clears its contents
		//noinspection SillyAssignmentJS
		this.viewport.canvas.width = this.viewport.canvas.width;
	};

	Graphics.prototype.drawSprite = function (sprite, x, y) {
		var translated;
		var context = this.viewport.context;
		if (sprite.direction !== 0) {
			var spriteOffsetX = -sprite.w / 2;
			var spriteOffsetY = -sprite.h / 2;
			translated = this.viewport.translate(x - spriteOffsetX, y - spriteOffsetY);
			context.save();
			context.translate(translated.x, translated.y);
			context.rotate(sprite.direction);
			sprite.draw(context, spriteOffsetX, spriteOffsetY);
			context.restore();
		}
		else {
			translated = this.viewport.translate(x, y);
			sprite.draw(context, translated.x, translated.y);
		}
	};

	function Viewport(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
		this.width = canvas.width;
		this.height = canvas.height;
	}

	Viewport.prototype.centerOn = function (x, y, w, h, worldWidth, worldHeight) {
		this.offsetX = Math.min(Math.max(0, x - ((this.width - (w || 0)) / 2)), worldWidth - this.width);
		this.offsetY = Math.min(Math.max(0, y - ((this.height - (h || 0)) / 2)), worldHeight - this.height);
	};

	Viewport.prototype.translate = function (x, y) {
		return {
			x: x - this.offsetX,
			y: y - this.offsetY
		};
	};

	var SpriteFactory = (function () {
		var images = {};
		var sprites = {};

		return {
			add: function (spriteDef) {
				if (!images[spriteDef.url]) {
					images[spriteDef.url] = new Image();
				}
				sprites[spriteDef.name] =
					new Sprite(images[spriteDef.url], spriteDef.x, spriteDef.y, spriteDef.w, spriteDef.h);
			},

			preload: function () {
				var callback = null;
				var urls = Object.keys(images);
				var countdown = urls.length;
				console.log('Preloading ' + countdown + ' sprite(s)');

				urls.forEach(function(url) {
					images[url].onload = function () {
						countdown--;
						console.log(url + ' loaded; ' + countdown + ' sprite(s) remaining');
						if (countdown === 0 && callback) {
							callback();
						}
					};
					images[url].src = 'images/' + url;
				});

				return {
					then: function (cb) {
						callback = cb;
					}
				};
			},

			getSprite: function (name) {
				if (!sprites[name]) {
					throw 'unknown sprite: ' + name;
				}
				return sprites[name];
			}
		};
	})();

	function Sprite(image, x, y, w, h) {
		this.image = image;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.direction = Sprite.D_UP;
	}

	Sprite.prototype.draw = function (context, x, y) {
		context.drawImage(this.image, this.x, this.y, this.w, this.h, x, y, this.w, this.h);
	};

	// Rotation in radians
	Sprite.D_UP = 0;
	Sprite.D_DOWN = 180 * (Math.PI / 180);
	Sprite.D_LEFT = 270 * (Math.PI / 180);
	Sprite.D_RIGHT = 90 * (Math.PI / 180);

	window.Graphics = Graphics;
	window.Viewport = Viewport;
	window.SpriteFactory = SpriteFactory;
	window.Sprite = Sprite;
})();
