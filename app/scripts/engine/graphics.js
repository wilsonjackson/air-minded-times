(function () {
	'use strict';

	function Graphics(viewport) {
		this.viewport = viewport;
		this.background = '#ffffff';
		this.offsetX = 0;
		this.offsetY = 0;
	}

	Graphics.prototype.clear = function () {
		// Assigning width to a canvas clears its contents
		//noinspection SillyAssignmentJS
//		this.viewport.canvas.width = this.viewport.canvas.width;
		this.viewport.context.fillStyle = this.background;
		this.viewport.context.fillRect(0, 0, this.viewport.width, this.viewport.height);
	};

	Graphics.prototype.setBackground = function (background) {
		this.background = background;
	};

	Graphics.prototype.centerOn = function (x, y, w, h, worldWidth, worldHeight) {
		this.offsetX = Math.min(Math.max(0, x - ((this.viewport.width - (w || 0)) / 2)), worldWidth - this.viewport.width);
		this.offsetY = Math.min(Math.max(0, y - ((this.viewport.height - (h || 0)) / 2)), worldHeight - this.viewport.height);
	};

	Graphics.prototype.translate = function (x, y) {
		return {
			x: x - this.offsetX,
			y: y - this.offsetY
		};
	};

	Graphics.prototype.drawSprite = function (sprite, x, y) {
		var translated;
		var context = this.viewport.context;
		if (sprite.direction !== 0) {
			var spriteOffsetX = -sprite.w / 2;
			var spriteOffsetY = -sprite.h / 2;
			translated = this.translate(x - spriteOffsetX, y - spriteOffsetY);
			context.save();
			context.translate(translated.x, translated.y);
			context.rotate(sprite.direction);
			sprite.draw(context, spriteOffsetX, spriteOffsetY);
			context.restore();
		}
		else {
			translated = this.translate(x, y);
			sprite.draw(context, translated.x, translated.y);
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
				var sprite = new (spriteDef.constructor || Sprite);
				sprite.init(images[spriteDef.url], spriteDef.x, spriteDef.y, spriteDef.w, spriteDef.h);
				sprites[spriteDef.name] = sprite;
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

	function Sprite() {
		// Empty constructor for easy extension; configured via init()
	}

	// Rotation in radians
	Sprite.D_UP = 0;
	Sprite.D_DOWN = 180 * (Math.PI / 180);
	Sprite.D_LEFT = 270 * (Math.PI / 180);
	Sprite.D_RIGHT = 90 * (Math.PI / 180);

	Sprite.prototype.init = function (image, x, y, w, h) {
		this.image = image;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.direction = Sprite.D_UP;
		// Inform subclasses of initialization.
		if (this._init) {
			this._init();
		}
	};

	Sprite.prototype.update = function () {
		// No default update action; this is where animation would occur.
		return false;
	};

	Sprite.prototype.draw = function (context, x, y) {
		context.drawImage(this.image, this.x, this.y, this.w, this.h, x, y, this.w, this.h);
	};

	var indexed = [null];
	var Terrain = {
		add: function (sprite) {
			var tile = new Tile(sprite);
			indexed.push(tile);
			return tile;
		},

		readMapTerrain: function (mapTerrain) {
			return mapTerrain.map(function (n) {
				if (indexed[n] === null) {
					throw 'Invalid terrain index: ' + n;
				}
				return indexed[n];
			});
		}
	};

	function Tile(sprite, impassable) {
		this.sprite = sprite;
		this.impassable = impassable || false;
	}

	Tile.prototype.render = function (graphics, gridX, gridY) {
		graphics.drawSprite(this.sprite, gridX * 100, gridY * 100);
	};

	window.Graphics = Graphics;
	window.Viewport = Viewport;
	window.SpriteFactory = SpriteFactory;
	window.Sprite = Sprite;
	window.Terrain = Terrain;
})();
