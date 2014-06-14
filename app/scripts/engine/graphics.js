/* globals Orientation */

(function () {
	'use strict';

	function Graphics(viewport) {
		this.viewport = viewport;
		this.background = '#ffffff';
		this.offsetX = 0;
		this.offsetY = 0;
	}

	Graphics.prototype.clear = function () {
		this.viewport.context.fillStyle = this.background;
		this.viewport.context.fillRect(0, 0, this.viewport.width, this.viewport.height);
	};

	Graphics.prototype.setBackground = function (background) {
		this.background = background;
	};

	Graphics.prototype.centerOn = function (x, y, w, h, worldWidth, worldHeight) {
		this.offsetX = Math.round(Math.min(Math.max(0, x - ((this.viewport.width - (w || 0)) / 2)), worldWidth - this.viewport.width));
		this.offsetY = Math.round(Math.min(Math.max(0, y - ((this.viewport.height - (h || 0)) / 2)), worldHeight - this.viewport.height));
	};

	Graphics.prototype.translate = function (x, y) {
		return {
			x: x - this.offsetX,
			y: y - this.offsetY
		};
	};

	Graphics.prototype.drawSprite = function (sprite, x, y, orientation) {
		var translated;
		var context = this.viewport.context;
		if (orientation && orientation !== Orientation.NORTH) {
			// Orientation involves the following steps:
			// 1. Calculate the half-width and half-height of the sprite.
			// 2. Use the half dimensions, rotated according to the object's orientation, to center the canvas over
			//    the center of the sprite.
			// 3. Rotate the canvas in accordance with the object's orientation (so the direction it should be facing
			//    is up.
			// 4. Tell the sprite to draw itself centered on the canvas (offset by half its dimensions).
			// 5. Revert canvas to original center and rotation.

			var spriteOffsetX = -Math.round(sprite.getWidth() / 2);
			var spriteOffsetY = -Math.round(sprite.getHeight() / 2);
			var rotatedOffset = orientation.translateXY(spriteOffsetX, spriteOffsetY);
			translated = this.translate(x - rotatedOffset.x, y - rotatedOffset.y);

			context.save();
			context.translate(translated.x, translated.y);
			context.rotate(orientation.asRadians());
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

	var SpriteRepository = (function () {
		var images = {};
		var sprites = {};

		return {
			add: function (spriteDef) {
				if (!images[spriteDef.url]) {
					images[spriteDef.url] = new Image();
				}
				var Ctor = (spriteDef.ctor || Sprite);
				var sprite = new Ctor();
				sprite.init(images[spriteDef.url], spriteDef.x, spriteDef.y, spriteDef.w, spriteDef.h, spriteDef.margins);
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

			retrieve: function (name) {
				if (!sprites[name]) {
					throw 'unknown sprite: ' + name;
				}
				return sprites[name];
			}
		};
	})();

	SpriteRepository.NULL_SPRITE = {
		w: 100,
		h: 100,
		init: function () {},
		update: function () {},
		draw: function (context, x, y) {
			context.fillStyle = '#f00';
			context.fillRect(x, y, this.w, this.h);
		}
	};

	// No constructor args for easy extension; configured via init()
	function Sprite() {

	}

	Sprite.prototype.init = function (image, x, y, w, h, margins) {
		this.image = image;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.margins = margins || [0, 0, 0, 0];
		this._drawWidth = this.getWidth();
		this._drawHeight = this.getHeight();
		// Inform subclasses of initialization.
		if (this._init) {
			this._init();
		}
	};

	Sprite.prototype.getWidth = function () {
		return this.w - this.margins[1] - this.margins[3];
	};

	Sprite.prototype.getHeight = function () {
		return this.h - this.margins[0] - this.margins[2];
	};

	Sprite.prototype.getTopMargin = function () {
		return this.margins[0];
	};

	Sprite.prototype.getLeftMargin = function () {
		return this.margins[3];
	};

	Sprite.prototype.getRightMargin = function () {
		return this.margins[1];
	};

	Sprite.prototype.getBottomMargin = function () {
		return this.margins[2];
	};

	Sprite.prototype.update = function () {
		// No default update action; this is where animation would occur.
		return false;
	};

	Sprite.prototype.draw = function (context, x, y) {
		context.drawImage(this.image, this.x + this.margins[3], this.y + this.margins[0], this._drawWidth,
			this._drawHeight, x, y, this._drawWidth, this._drawHeight);
	};

	function DelegatingSprite() {
	}

	DelegatingSprite.prototype = new Sprite();

	DelegatingSprite.prototype._copy = function () {
		var delegate = this.delegate;
		for (var i in delegate) {
			if (!(i in Sprite.prototype) && i in delegate) {
				//noinspection JSUnfilteredForInLoop
				this[i] = delegate[i];
			}
		}
	};

	function SpriteAnimator(interval, sprites) {
		this.interval = interval || 10;
		this.tickCount = -1;
		this.frames = sprites;
		this.nextIdx = 0;
		this.delegate = this.frames[this.nextIdx];
		this._copy();
	}

	SpriteAnimator.prototype = new DelegatingSprite();

	SpriteAnimator.prototype.update = function () {
		if (++this.tickCount === this.interval) {
			this.tickCount = 0;
			++this.nextIdx;
			if (this.nextIdx === this.frames.length) {
				this.nextIdx = 0;
			}
			this.delegate = this.frames[this.nextIdx];
			this._copy();
		}
	};

	function SpriteStack(sprites) {
		this.spriteStack = sprites || [];
		if (sprites.length > 0) {
			this._initStack();
		}
	}

	SpriteStack.prototype = new DelegatingSprite();

	SpriteStack.prototype._initStack = function () {
		this.delegate = this.spriteStack[0];
		this._copy();
	};

	SpriteStack.prototype.push = function (/*sprite...*/) {
		var init = this.spriteStack.length === 0;
		Array.prototype.push.apply(this.spriteStack, arguments);
		if (init) {
			this._initStack();
		}
	};

	SpriteStack.prototype.pop = function () {
		return this.spriteStack.pop();
	};

	SpriteStack.prototype.get = function (index) {
		return this.spriteStack[index];
	};

	SpriteStack.prototype.update = function () {
		for (var i = 0, len = this.spriteStack.length; i < len; i++) {
			this.spriteStack[i].update();
		}
	};

	SpriteStack.prototype.draw = function (context, x, y) {
		for (var i = 0, len = this.spriteStack.length; i < len; i++) {
			this.spriteStack[i].draw(context, x, y);
		}
	};

	function FontSprite() {
		this.chars = ' !"# %&\'[]*+,-. 0123456789     ? ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
		this.buffer = [];
	}

	FontSprite.prototype = new Sprite();

	FontSprite.prototype.text = function (text) {
		var chars = this.chars;
		this.buffer = text.toUpperCase().split('').map(function (char) {
			return chars.indexOf(char);
		});
	};

	FontSprite.prototype.draw = function (context, x, y) {
		var self = this;
		var n = 0;
		this.buffer.forEach(function (index) {
			context.drawImage(self.image, self.x + index * self.w, self.y, self.w, self.h, x + n, y, self.w, self.h);
			n += self.w;
		});
		this.buffer = [];
	};

	var indexed = [null];
	var Terrain = {
		add: function (sprite, impassable) {
			var tile = new Tile(sprite, impassable);
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
		this.impassable = impassable;
	}

	Tile.prototype.render = function (graphics, gridX, gridY) {
		graphics.drawSprite(this.sprite, gridX * 100, gridY * 100);
	};

	window.Graphics = Graphics;
	window.Viewport = Viewport;
	window.SpriteRepository = SpriteRepository;
	window.Sprite = Sprite;
	window.SpriteAnimator = SpriteAnimator;
	window.SpriteStack = SpriteStack;
	window.FontSprite = FontSprite;
	window.Terrain = Terrain;
})();
