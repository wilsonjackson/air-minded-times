/* globals Events, SpriteRepository, Sprite, Physics */

(function () {
	'use strict';

	var DEBUG_COLLISIONS = true;

	function SpriteObject() {
		this.events = new Events();
		this.sprite = SpriteRepository.NULL_SPRITE;
		this.entity = null;
		this.speed = 1;
		this.direction = Sprite.D_UP;
	}

	SpriteObject.prototype.init = function (x, y, direction) {
		this.entity = Physics.newEntity(x, y, this.sprite.w, this.sprite.h, this.speed);
		this.direction = direction;
		if (this._init) {
			this._init();
		}
	};

	SpriteObject.prototype.onDestroy = function (fn) {
		this.events.on('destroy', fn);
	};

	SpriteObject.prototype.destroy = function () {
		this.events.trigger('destroy', this);
	};

	SpriteObject.prototype.update = function () {
		return false;
	};

	SpriteObject.prototype.render = function (graphics) {
		if (DEBUG_COLLISIONS) {
			var context = graphics.viewport.context;
			var halfW = this.entity.w / 2;
			context.save();
			context.strokeStyle = this.entity.collisions.length ? '#f00' : '#fff';
			context.beginPath();
			context.arc(this.entity.x + halfW - graphics.offsetX, this.entity.y + halfW - graphics.offsetY, halfW, 0, Math.PI * 2);
			context.stroke();
			context.closePath();
			context.restore();
		}
		graphics.drawSprite(this.sprite, this.entity.x, this.entity.y, this.entity.w, this.entity.h);
	};

	var ObjectFactory = (function () {
		var types = {};

		return {
			register: function (id, ctor) {
				types[id] = ctor;
			},

			spawn: function (id, x, y, direction) {
				console.log('Spawning ' + id + ' at ' + x + ',' + y);
				var Ctor = types[id];
				var object = new Ctor();
				object.init(x, y, direction);
				return object;
			}
		};
	})();

	window.SpriteObject = SpriteObject;
	window.ObjectFactory = ObjectFactory;
})();
