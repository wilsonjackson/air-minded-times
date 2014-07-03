Engine.module('world.objects.SpriteObject',
	[
		'math.BoundingRect',
		'math.BoundingCircle',
		'util.Events',
		'physics.Physics',
		'physics.EntityCategory',
		'graphics.sprite.SpriteRepository'
	],
	function (BoundingRect, BoundingCircle, Events, Physics, EntityCategory, SpriteRepository) {
		'use strict';

		var DEBUG_COLLISIONS = false;
		var DEBUG_SPRITE = false;

		function SpriteObject() {
			Events.mixin(this);
			this.sprite = SpriteRepository.NULL_SPRITE;

			this.entityCategory = EntityCategory.OBSTACLE;
			this.entityShape = SpriteObject.SHAPE_RECT;
			this.entity = null;
		}

		SpriteObject.prototype.init = function (x, y, orientation) {
			var dimensions = orientation.translateXY(this.sprite.getHitboxWidth(), this.sprite.getHitboxHeight());
			var margins = orientation.translateXY(this.sprite.getLeftMargin(), this.sprite.getBottomMargin());
			var leftEdge = x + margins.x;
			var topEdge = y - dimensions.y - margins.y;
			switch (this.entityShape) {
				case SpriteObject.SHAPE_CIRCLE:
					this.entity = Physics.createCircleEntity(
						this.entityCategory, leftEdge, topEdge, dimensions.x() / 2, orientation, this);
					break;
				case SpriteObject.SHAPE_RECT:
					this.entity = Physics.createRectEntity(
						this.entityCategory, leftEdge, topEdge, dimensions.x, dimensions.y, orientation, this);
					break;
			}
			if (this._init) {
				this._init();
			}
		};

		SpriteObject.prototype.onDestroy = function (fn) {
			this.on('destroy', fn);
		};

		SpriteObject.prototype.destroy = function () {
			this.trigger('destroy', this);
			this.entity.destroy();
			delete this.entity;
			Events.destroyMixin(this);
			if (this._destroy) {
				this._destroy();
			}
		};

		SpriteObject.prototype.update = function () {
			return false;
		};

		SpriteObject.prototype.render = function (viewport) {
			var context;
			viewport.getGraphics().drawSprite(this.sprite,
					this.entity.getX(),
					this.entity.getY() + this.entity.getHeight(),
				this.entity.getOrientation());
			if (DEBUG_SPRITE) {
				var spriteSize = this.entity.getOrientation().translateXY(
						this.sprite.getWidth(),
						this.sprite.getHeight());
				var spriteOffset = {
					x: Math.round((this.entity.getWidth() - spriteSize.x) / 2),
					y: Math.round((this.entity.getHeight() - spriteSize.y) / 2)
				};
				context = viewport.context;
				context.strokeStyle = '#00f';
				context.strokeRect(
						this.entity.getX() + 0.5 + spriteOffset.x - viewport.sceneOffset.x,
						this.entity.getY() + 0.5 + spriteOffset.y - viewport.sceneOffset.y,
						this.sprite.getWidth(),
						this.sprite.getHeight());
			}
			if (DEBUG_COLLISIONS) {
				context = viewport.context;
				context.strokeStyle = this.entity.isColliding ? '#f00' : '#fff';
				if (this.entity.bounds instanceof BoundingCircle) {
					var halfW = this.entity.getWidth() / 2;
					context.save();
					context.beginPath();
					context.arc(this.entity.getX() + halfW - viewport.sceneOffset.x, this.entity.getY() + halfW - viewport.sceneOffset.y, halfW, 0, Math.PI * 2);
					context.stroke();
					context.closePath();
					context.restore();
				}
				if (this.entity.bounds instanceof BoundingRect) {
					context.strokeRect(
							this.entity.getX() + 0.5 - viewport.sceneOffset.x,
							this.entity.getY() + 0.5 - viewport.sceneOffset.y,
						this.entity.getWidth(),
						this.entity.getHeight());
				}
			}
		};

		SpriteObject.SHAPE_CIRCLE = 'CIRCLE';
		SpriteObject.SHAPE_RECT = 'RECT';

		return SpriteObject;
	});
