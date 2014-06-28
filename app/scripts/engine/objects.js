/* global Engine, Events, BoundingCircle, BoundingRect */

(function (Engine, Events, BoundingCircle, BoundingRect) {
	'use strict';

	var Physics = Engine.physics.Physics;
	var Orientation = Engine.physics.Orientation;

	var DEBUG_COLLISIONS = false;
	var DEBUG_SPRITE = false;

	function SpriteObject() {
		this.events = new Events();
		this.sprite = Engine.graphics.SpriteRepository.NULL_SPRITE;

		this.entityCategory = Engine.physics.EntityCategory.OBSTACLE;
		this.entityShape = SpriteObject.SHAPE_RECT;
		this.entity = null;
	}

	SpriteObject.prototype.init = function (x, y, orientation) {
		var dimensions = orientation.translateXY(this.sprite.getWidth(), this.sprite.getHeight());
		var leftEdge = x - Math.round(dimensions.x / 2);
		var topEdge = y - Math.round(dimensions.y / 2);
		switch (this.entityShape) {
			case SpriteObject.SHAPE_CIRCLE:
				this.entity = Physics.newCircleEntity(
					this.entityCategory, leftEdge, topEdge, dimensions.x() / 2, orientation, this);
				break;
			case SpriteObject.SHAPE_RECT:
				this.entity = Physics.newRectEntity(
					this.entityCategory, leftEdge, topEdge, dimensions.x, dimensions.y, orientation, this);
				break;
		}
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
		delete this.events;
		delete this.entity;
		if (this._destroy) {
			this._destroy();
		}
	};

	SpriteObject.prototype.update = function () {
		return false;
	};

	SpriteObject.prototype.render = function (graphics) {
		var context;
		graphics.drawSprite(this.sprite,
			this.entity.getX() + Math.round(this.entity.getWidth() / 2),
			this.entity.getY() + Math.round(this.entity.getHeight() / 2),
			this.entity.getOrientation());
		if (DEBUG_SPRITE) {
			var spriteSize = this.entity.getOrientation().translateXY(
					this.sprite.getWidth() + this.sprite.getLeftMargin() + this.sprite.getRightMargin(),
					this.sprite.getHeight() + this.sprite.getTopMargin() + this.sprite.getBottomMargin());
			var spriteOffset = {
				x: Math.round((this.entity.getWidth() - spriteSize.x) / 2),
				y: Math.round((this.entity.getHeight() - spriteSize.y) / 2)
			};
			context = graphics.viewport.context;
			context.strokeStyle = '#00f';
			context.strokeRect(
					this.entity.getX() + 0.5 + spriteOffset.x - graphics.offsetX,
					this.entity.getY() + 0.5 + spriteOffset.y - graphics.offsetY,
					this.sprite.getWidth() + this.sprite.getLeftMargin() + this.sprite.getRightMargin(),
					this.sprite.getHeight() + this.sprite.getTopMargin() + this.sprite.getBottomMargin());
		}
		if (DEBUG_COLLISIONS) {
			context = graphics.viewport.context;
			context.strokeStyle = this.entity.isColliding ? '#f00' : '#fff';
			if (this.entity.bounds instanceof BoundingCircle) {
				var halfW = this.entity.getWidth() / 2;
				context.save();
				context.beginPath();
				context.arc(this.entity.getX() + halfW - graphics.offsetX, this.entity.getY() + halfW - graphics.offsetY, halfW, 0, Math.PI * 2);
				context.stroke();
				context.closePath();
				context.restore();
			}
			if (this.entity.bounds instanceof BoundingRect) {
				context.strokeRect(
						this.entity.getX() + 0.5 - graphics.offsetX,
						this.entity.getY() + 0.5 - graphics.offsetY,
						this.entity.getWidth(),
						this.entity.getHeight());
			}
		}
	};

	SpriteObject.SHAPE_CIRCLE = 'CIRCLE';
	SpriteObject.SHAPE_RECT = 'RECT';

	var ObjectFactory = (function () {
		var types = {};

		return {
			register: function (id, ctor) {
				types[id] = ctor;
			},

			create: function (id) {
				var Ctor = types[id];
				return new Ctor();
			},

			spawn: function (id, x, y, orientation) {
				Engine.logger.debug('Spawning ' + id + ' at ' + x + ',' + y);
				var object = this.create(id);
				object.init(x, y, orientation || Orientation.NORTH);
				return object;
			}
		};
	})();

	var ObjectType = {
		PLAYER: 'player',
		ENEMY: 'enemy',
		DECORATION: 'decoration',
		ITEM: 'item',
		PROJECTILE: 'projectile'
	};

	Engine.objects = {
		SpriteObject: SpriteObject,
		ObjectFactory: ObjectFactory,
		ObjectType: ObjectType
	};
})(Engine, Events, BoundingCircle, BoundingRect);
