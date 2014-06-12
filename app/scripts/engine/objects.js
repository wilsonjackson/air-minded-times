/* globals Events, SpriteRepository, Sprite, Physics, EntityCategory */

(function () {
	'use strict';

	var DEBUG_COLLISIONS = false;

	function SpriteObject() {
		this.events = new Events();
		this.sprite = SpriteRepository.NULL_SPRITE;

		this.entityCategory = EntityCategory.OBSTACLE;
		this.entityShape = SpriteObject.SHAPE_CIRCLE;
		this.entity = null;

		this.direction = Sprite.D_UP;
	}

	SpriteObject.prototype.init = function (x, y, direction) {
		switch (this.entityShape) {
			case SpriteObject.SHAPE_CIRCLE:
				this.entity = Physics.newCircleEntity(this.entityCategory, x, y, this.sprite.w / 2, this);
				break;
			case SpriteObject.SHAPE_RECT:
				this.entity = Physics.newRectEntity(this.entityCategory, x, y, this.sprite.w, this.sprite.h, this);
				break;
		}
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
		this.entity.destroy();
	};

	SpriteObject.prototype.update = function () {
		return false;
	};

	SpriteObject.prototype.render = function (graphics) {
		if (DEBUG_COLLISIONS) {
			var context = graphics.viewport.context;
			var halfW = this.entity.getWidth() / 2;
			context.save();
			context.strokeStyle = this.entity.isColliding ? '#f00' : '#fff';
			context.beginPath();
			context.arc(this.entity.getX() + halfW - graphics.offsetX, this.entity.getY() + halfW - graphics.offsetY, halfW, 0, Math.PI * 2);
			context.stroke();
			context.closePath();
			context.restore();
		}
		graphics.drawSprite(this.sprite, this.entity.getX(), this.entity.getY());
	};

	SpriteObject.SHAPE_CIRCLE = 'CIRCLE';
	SpriteObject.SHAPE_RECT = 'RECT';

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

	var ObjectType = {
		PLAYER: 'player',
		ITEM: 'item'
	};

	window.SpriteObject = SpriteObject;
	window.ObjectFactory = ObjectFactory;
	window.ObjectType = ObjectType;
})();
