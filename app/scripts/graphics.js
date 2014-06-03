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

//	Graphics.prototype.centerOn = function (actor) {
//	};

	Graphics.prototype.drawSprite = function (sprite, x, y) {
		var context = this.viewport.context;
		if (sprite.direction !== 0) {
			var offsetX = -sprite.w / 2;
			var offsetY = -sprite.h / 2;
			context.save();
			context.translate(x + -offsetX, y + -offsetY);
			context.rotate(sprite.direction);
			sprite.draw(context, offsetX, offsetY);
			context.restore();
		}
		else {
			sprite.draw(context, x, y);
		}
	};

	function Viewport(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
		this.width = canvas.width;
		this.height = canvas.height;
	}

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
