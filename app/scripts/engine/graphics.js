/* global Engine, Vector */

(function (Engine, Vector) {
	'use strict';

	function Viewport(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
		this.width = canvas.width;
		this.height = canvas.height;
		this.background = '#000000';
		this.sceneOffset = new Vector(0, 0);
		this._graphics = null;
	}

	Viewport.prototype.clear = function () {
		this.context.fillStyle = this.background;
		this.context.fillRect(0, 0, this.width, this.height);
	};

	Viewport.prototype.getGraphics = function () {
		if (this._graphics === null) {
			this._graphics = new Graphics(this);
		}
		return this._graphics;
	};

	Viewport.prototype.getCenter = function () {
		return this.sceneOffset.add(new Vector(Math.round(this.width / 2), Math.round(this.height / 2)));
	};

	Viewport.prototype.getVisibleArea = function () {
		return new BoundingRect(
			new Vector(this.sceneOffset.x, this.sceneOffset.y),
			new Vector(this.width, this.height));
	};

	Viewport.prototype.centerOn = function (x, y, w, h) {
		var scene = Engine.getScene();
		this.sceneOffset = new Vector(
			Math.round(Math.min(Math.max(0, x - ((this.width - (w || 0)) / 2)), scene.width - this.width)),
			Math.round(Math.min(Math.max(0, y - ((this.height - (h || 0)) / 2)), scene.height - this.height)));
	};

	Viewport.prototype.translate = function (x, y) {
		return new Vector(x, y).subtract(this.sceneOffset);
	};

	function Scene() {}
	Scene.prototype.activate = function () {};
	Scene.prototype.update = function (/*input*/) {};
	Scene.prototype.render = function (/*viewport*/) {};

	function Graphics(viewport) {
		this.viewport = viewport;
	}

	Graphics.prototype.drawSprite = function (sprite, x, y, orientation) {
		var translated;
		var context = this.viewport.context;
		if (orientation && orientation !== Engine.physics.Orientation.NORTH) {
			// 1. Center the canvas over the center of the sprite.
			// 2. Rotate the canvas in accordance with the object's orientation (so the direction it should be facing
			//    is up).
			// 3. Tell the sprite to draw itself centered on the canvas.
			// 4. Revert canvas to original center and rotation.
			context.save();
			translated = this.viewport.translate(x, y);
			context.translate(translated.x, translated.y);
			context.rotate(orientation.asRadians());
			sprite.draw(context, 0, 0);
			context.restore();
		}
		else {
			translated = this.viewport.translate(x, y);
			sprite.draw(context, translated.x, translated.y);
		}
	};

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
				Engine.logger.debug('Preloading ' + countdown + ' sprite(s)');

				urls.forEach(function(url) {
					images[url].onload = function () {
						countdown--;
						Engine.logger.debug(url + ' loaded; ' + countdown + ' sprite(s) remaining');
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

	Sprite.prototype.toString = function () {
		return 'Sprite(src=' + this.image.src + ', x=' + this.x + ', y=' + this.y + ', w=' + this.w + ', h=' + this.h + ')';
	};

	var spriteCopyProps = [
		'image',
		'x',
		'y',
		'w',
		'h',
		'margins',
		'_drawWidth',
		'_drawHeight'
	];

	function DelegatingSprite() {
	}

	DelegatingSprite.prototype = Object.create(Sprite.prototype);

	DelegatingSprite.prototype._copy = function () {
		var delegate = this.delegate;
		for (var i = 0, len = spriteCopyProps.length; i < len; i++) {
			this[spriteCopyProps[i]] = delegate[spriteCopyProps[i]];
		}
	};

	function SpriteAnimator(interval, sprites) {
		this.interval = interval || 10;
		this.frames = sprites;
		this.reset();
	}

	SpriteAnimator.prototype = Object.create(DelegatingSprite.prototype);

	SpriteAnimator.prototype.reset = function () {
		this.tickCount = -1;
		this.nextIdx = 0;
		this.delegate = this.frames[this.nextIdx];
		this._copy();
	};

	SpriteAnimator.prototype.update = function () {
		for (var i = 0, len = this.frames.length; i < len; i++) {
			this.frames[i].update();
		}
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

	SpriteAnimator.prototype.toString = function () {
		return 'SpriteAnimator[' + this.frames.map(function (o) {
			return o.toString();
		}).join(', ') + ']';
	};

	function SpriteStack(sprites) {
		this.stack = sprites || [];
		if (sprites.length > 0) {
			this._initStack();
		}
	}

	SpriteStack.prototype = Object.create(DelegatingSprite.prototype);

	SpriteStack.prototype._initStack = function () {
		this.delegate = this.stack[0];
		this._copy();
	};

	SpriteStack.prototype.push = function (/*sprite...*/) {
		var init = this.stack.length === 0;
		Array.prototype.push.apply(this.stack, arguments);
		if (init) {
			this._initStack();
		}
	};

	SpriteStack.prototype.pop = function () {
		return this.stack.pop();
	};

	SpriteStack.prototype.get = function (index) {
		return this.stack[index];
	};

	SpriteStack.prototype.swap = function (index, newSprite) {
		var oldSprite = this.stack[index];
		this.stack[index] = newSprite;
		return oldSprite;
	};

	SpriteStack.prototype.update = function () {
		for (var i = 0, len = this.stack.length; i < len; i++) {
			this.stack[i].update();
		}
	};

	SpriteStack.prototype.draw = function (context, x, y) {
		for (var i = 0, len = this.stack.length; i < len; i++) {
			this.stack[i].draw(context, x, y);
		}
	};

	SpriteStack.prototype.toString = function () {
		return 'SpriteStack[' + this.stack.map(function (o) {
			return o.toString();
		}).join(', ') + ']';
	};

	function BoxSprite() {
	}

	BoxSprite.prototype = Object.create(Sprite.prototype);

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

	FontSprite.prototype = Object.create(Sprite.prototype);

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
		this.align = 0;
	}

	TextSprite.prototype = Object.create(Sprite.prototype);

	TextSprite.prototype.width = function (w) {
		this.w = w;
		return this;
	};

	TextSprite.prototype.height = function (h) {
		this.h = h;
		return this;
	};

	TextSprite.prototype.fullWidth = function () {
		this.w = Engine.getViewport().width;
		return this;
	};

	TextSprite.prototype.fullHeight = function () {
		this.h = Engine.getViewport().height;
		return this;
	};

	TextSprite.prototype.center = function () {
		this.c = true;
		return this;
	};

	TextSprite.prototype.left = function () {
		this.align = -1;
		return this;
	};

	TextSprite.prototype.right = function () {
		this.align = 1;
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
			var left;
			if (this.align === -1) {
				left = x - this.getWidth() / 2;
			}
			else if (this.align === 1) {
				left = x + this.getWidth() / 2 - charW * line.length;
			}
			else {
				left = x - (self.c ? charW * line.length : this.getWidth()) / 2;
			}
			self.fontSprite.text(line);
			self.fontSprite.draw(context, Math.round(left), topLineY + charH * i);
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

	Tile.prototype.render = function (viewport, gridX, gridY) {
		viewport.getGraphics().drawSprite(this.sprite, gridX, gridY);
	};

	Engine.graphics = {
		Viewport: Viewport,
		Scene: Scene,
		Graphics: Graphics,
		SpriteRepository: SpriteRepository,
		Sprite: Sprite,
		SpriteAnimator: SpriteAnimator,
		SpriteStack: SpriteStack,
		FontSprite: FontSprite,
		TextSprite: TextSprite,
		BoxSprite: BoxSprite,
		Terrain: Terrain
	};
})(Engine, Vector);
