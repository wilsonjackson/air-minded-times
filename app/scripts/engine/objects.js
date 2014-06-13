/* globals Events, SpriteRepository, Physics, EntityCategory, BoundingCircle, BoundingRect */

(function () {
	'use strict';

	var DEBUG_COLLISIONS = true;
	var DEBUG_SPRITE = true;

	function SpriteObject() {
		this.events = new Events();
		this.sprite = SpriteRepository.NULL_SPRITE;

		this.entityCategory = EntityCategory.OBSTACLE;
		this.entityShape = SpriteObject.SHAPE_RECT;
		this.entity = null;
	}

	SpriteObject.prototype.init = function (x, y, orientation) {
		var xPlusMargin = x + this.sprite.getTopMargin();
		var yPlusMargin = y + this.sprite.getLeftMargin();
		switch (this.entityShape) {
			case SpriteObject.SHAPE_CIRCLE:
				this.entity = Physics.newCircleEntity(
					this.entityCategory, xPlusMargin, yPlusMargin, this.sprite.getWidth() / 2, orientation, this);
				break;
			case SpriteObject.SHAPE_RECT:
				this.entity = Physics.newRectEntity(
					this.entityCategory, xPlusMargin, yPlusMargin, this.sprite.getWidth(), this.sprite.getHeight(), orientation, this);
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
	};

	SpriteObject.prototype.update = function () {
		return false;
	};

	SpriteObject.prototype.render = function (graphics) {
		var context;
		graphics.drawSprite(this.sprite, this.entity.getX(), this.entity.getY(), this.entity.getOrientation());
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
	};

	SpriteObject.SHAPE_CIRCLE = 'CIRCLE';
	SpriteObject.SHAPE_RECT = 'RECT';

	var ObjectFactory = (function () {
		var types = {};

		return {
			register: function (id, ctor) {
				types[id] = ctor;
			},

			spawn: function (id, x, y, orientation) {
				console.log('Spawning ' + id + ' at ' + x + ',' + y);
				var Ctor = types[id];
				var object = new Ctor();
				object.init(x, y, orientation);
				return object;
			}
		};
	})();

	var ObjectType = {
		PLAYER: 'player',
		ENEMY: 'enemy',
		ITEM: 'item',
		PROJECTILE: 'projectile'
	};

	window.SpriteObject = SpriteObject;
	window.ObjectFactory = ObjectFactory;
	window.ObjectType = ObjectType;
})();
