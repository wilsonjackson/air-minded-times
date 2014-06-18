/* globals Vector, Game, Orientation */

(function () {
	'use strict';

	function Graphics(viewport) {
		this.viewport = viewport;
		this.background = '#000000';
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

	Graphics.prototype.getCenter = function () {
		return new Vector(
				Math.round(this.viewport.width / 2) + this.offsetX,
				Math.round(this.viewport.height / 2) + this.offsetY);
	};

	Graphics.prototype.drawSprite = function (sprite, x, y, orientation) {
		var translated;
		var context = this.viewport.context;
		if (orientation && orientation !== Orientation.NORTH) {
			// 1. Center the canvas over the center of the sprite.
			// 2. Rotate the canvas in accordance with the object's orientation (so the direction it should be facing
			//    is up).
			// 3. Tell the sprite to draw itself centered on the canvas.
			// 4. Revert canvas to original center and rotation.
			context.save();
			translated = this.translate(x, y);
			context.translate(translated.x, translated.y);
			context.rotate(orientation.asRadians());
			sprite.draw(context, 0, 0);
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
				Game.logger.debug('Preloading ' + countdown + ' sprite(s)');

				urls.forEach(function(url) {
					images[url].onload = function () {
						countdown--;
						Game.logger.debug(url + ' loaded; ' + countdown + ' sprite(s) remaining');
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
		context.drawImage(this.image,
				this.x + this.margins[3],
				this.y + this.margins[0],
			this._drawWidth,
			this._drawHeight,
			x - Math.round(this.getWidth() / 2),
			y - Math.round(this.getHeight() / 2),
			this._drawWidth,
			this._drawHeight);
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
		this.frames = sprites;
		this.reset();
	}

	SpriteAnimator.prototype = new DelegatingSprite();

	SpriteAnimator.prototype.reset = function () {
		this.tickCount = -1;
		this.nextIdx = 0;
		this.delegate = this.frames[this.nextIdx];
		this._copy();
	};

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

	function BoxSprite() {
	}

	BoxSprite.prototype = new Sprite();

	BoxSprite.prototype._init = function () {
		this.sectionSize = this.getWidth() / 3;
	};

	BoxSprite.prototype.setWidth = function (width) {
		this.width = width;
	};

	BoxSprite.prototype.setHeight = function (height) {
		this.height = height;
	};

	BoxSprite.prototype.draw = function (context, x, y) {
		var self = this;
		var size = this.sectionSize;
		var halfW = this.width / 2;
		var halfH = this.height / 2;
		var left = x - halfW;
		var top = y - halfH;
		var right = x + halfW - size;
		var bottom = y + halfH - size;

		// Top & bottom
		var hOffset = right - left - size;
		while (hOffset > 0) {
			if (hOffset < size) {
				hOffset = size;
			}
			context.drawImage(self.image, self.x + size, self.y, size, size, left + hOffset, top, size, size);
			context.drawImage(self.image, self.x + size, self.y + size * 2, size, size, left + hOffset, bottom, size, size);
			hOffset -= size;
		}

		// Left & right
		var vOffset = bottom - top - size;
		while (vOffset > 0) {
			if (vOffset < size) {
				vOffset = size;
			}
			context.drawImage(self.image, self.x, self.y + size, size, size, left, top + vOffset, size, size);
			context.drawImage(self.image, self.x + size * 2, self.y + size, size, size, right, top + vOffset, size, size);
			vOffset -= size;
		}

		// Corners
		context.drawImage(self.image, self.x, self.y, size, size, left, top, size, size);
		context.drawImage(self.image, self.x + size * 2, self.y, size, size, right, top, size, size);
		context.drawImage(self.image, self.x, self.y + size * 2, size, size, left, bottom, size, size);
		context.drawImage(self.image, self.x + size * 2, self.y + size * 2, size, size, right, bottom, size, size);
	};

	BoxSprite.SECTION_NW = [0, 0];
	BoxSprite.SECTION_N = [1, 0];
	BoxSprite.SECTION_NE = [2, 0];
	BoxSprite.SECTION_E = [2, 1];
	BoxSprite.SECTION_SE = [2, 2];
	BoxSprite.SECTION_S = [1, 2];
	BoxSprite.SECTION_SW = [0, 2];
	BoxSprite.SECTION_W = [0, 1];

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

	function TextSprite(fontSprite, text) {
		this.fontSprite = fontSprite;
		this.text = text;
		this.w = null;
		this.h = null;
		this.c = false;
	}

	TextSprite.prototype = new Sprite();

	TextSprite.prototype.width = function (w) {
		this.w = w;
		return this;
	};

	TextSprite.prototype.height = function (h) {
		this.h = h;
		return this;
	};

	TextSprite.prototype.fullWidth = function () {
		this.w = Game.uiGraphics.viewport.width;
		return this;
	};

	TextSprite.prototype.fullHeight = function () {
		this.h = Game.uiGraphics.viewport.height;
		return this;
	};

	TextSprite.prototype.center = function () {
		this.c = true;
		return this;
	};

	TextSprite.prototype.getWidth = function () {
		return this.w || this.fontSprite.getWidth() * Math.max(this.text.map(function (s) {
			return s.length;
		}));
	};

	TextSprite.prototype.getHeight = function () {
		return this.h || this.fontSprite.getHeight() * this.text.length;
	};

	TextSprite.prototype.draw = function (context, x, y) {
		var self = this;
		var charW = self.fontSprite.getWidth();
		var charH = self.fontSprite.getHeight();
		var topLineY = Math.round(y - (self.c ? charH * self.text.length : this.getHeight()) / 2);

		for (var i = 0, len = self.text.length; i < len; i++) {
			var line = self.text[i];
			self.fontSprite.text(line);
			self.fontSprite.draw(context,
				Math.round(x - (self.c ? charW * line.length : this.getWidth()) / 2),
				topLineY + charH * i);
		}
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
		graphics.drawSprite(this.sprite, gridX, gridY);
	};

	window.Graphics = Graphics;
	window.Viewport = Viewport;
	window.SpriteRepository = SpriteRepository;
	window.Sprite = Sprite;
	window.SpriteAnimator = SpriteAnimator;
	window.SpriteStack = SpriteStack;
	window.FontSprite = FontSprite;
	window.TextSprite = TextSprite;
	window.BoxSprite = BoxSprite;
	window.Terrain = Terrain;
})();
