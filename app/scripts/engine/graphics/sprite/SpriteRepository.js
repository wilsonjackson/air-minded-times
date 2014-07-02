Engine.module('graphics.sprite.SpriteRepository',
	['graphics.sprite.Sprite'],
	function () {
		'use strict';

		var Sprite = Engine.graphics.sprite.Sprite;

		var images = {};
		var sprites = {};
		var SpriteRepository = {
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

				urls.forEach(function (url) {
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

		return {
			SpriteRepository: SpriteRepository
		};
	});
