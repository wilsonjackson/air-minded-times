/* global Vector, Orientation, Input, ObjectFactory, ObjectType, EntityCategory, SpriteObject, Inventory, Planes */

(function () {
	'use strict';

	var planes = [Planes.EXTENDED_FAREWELL, Planes.JUSTICE_GLIDER_MKIV, Planes.BIPLANEDIEPLANE];

	function Player() {
		this.type = ObjectType.PLAYER;
		this.entityCategory = EntityCategory.PLAYER;
		this.movement = PlayerMovementState.IDLE;
		this.plane = new Planes.EXTENDED_FAREWELL();
		this.sprite = this.plane.sprite;
		this.inventory = new Inventory();
		this.speed = 4;
	}

	Player.prototype = new SpriteObject();

	Player.prototype._init = function () {
		var self = this;
		this.entity.addCollisionListener({
			solveCollision: function (collision) {
				if (collision.entity.category.isA(EntityCategory.OBSTACLE)) {
					if (self.entity.isRotated) {
						if (self.entity.lastOrientation === Orientation.NORTH || self.entity.lastOrientation === Orientation.SOUTH) {
							return new Vector(0, collision.intersection.height() * (self.entity.getY() < collision.intersection.top() ? -1 : 1));
						}
						else if (self.entity.lastOrientation === Orientation.EAST || self.entity.lastOrientation === Orientation.WEST) {
							return new Vector(collision.intersection.width() * (self.entity.getX() < collision.intersection.left() ? -1 : 1), 0);
						}
					}
					if (self.entity.currentMovement.x !== 0) {
						return new Vector(collision.intersection.width() * (self.entity.currentMovement.x > 0 ? -1 : 1), 0);
					}
					if (self.entity.currentMovement.y !== 0) {
						return new Vector(0, collision.intersection.height() * (self.entity.currentMovement.y > 0 ? -1 : 1));
					}
				}
			},
			collide: function (collision) {
				if (collision.entity.category.isA(EntityCategory.ITEM)) {
					collision.entity.object.destroy();
					self.inventory.get(collision.entity.object.item).add();
				}
			}
		});
	};

	Player.prototype.update = function (world, inputState) {
		var newState = this.movement.update(this, inputState);
		if (newState) {
			this.movement = newState;
			this.movement.enter(this);
		}
		if (inputState.isPressed(Input.ACTION)) {
			this.plane.fire(this.entity, this.entity.getOrientation(), world);
		}
		if (inputState.isPressed(Input.D)) {
			var PlaneConstructor = planes.pop();
			this.plane = new PlaneConstructor();
			this.sprite = this.plane.sprite;
			planes.unshift(PlaneConstructor);

			var x = this.entity.getX();
			var y = this.entity.getY();
			var orientation = this.entity.getOrientation();
			this.entity.destroy();
			this.init(x, y, orientation);
		}
		this.plane.update(world, inputState);
		return this.sprite.update() || newState !== false;
	};


	var PlayerMovementState = {
		_getMovement: function (inputState) {
			if (inputState.isPressed(Input.UP)) {
				return PlayerMovementState.MOVING_UP;
			}
			if (inputState.isPressed(Input.DOWN)) {
				return PlayerMovementState.MOVING_DOWN;
			}
			if (inputState.isPressed(Input.LEFT)) {
				return PlayerMovementState.MOVING_LEFT;
			}
			if (inputState.isPressed(Input.RIGHT)) {
				return PlayerMovementState.MOVING_RIGHT;
			}
		},
		_getIdle: function (inputState, button) {
			return inputState.isReleased(button) ? PlayerMovementState.IDLE : null;
		},
		IDLE: {
			enter: function (/*object*/) {},
			update: function (object, inputState) {
//				object.entity.();
				return PlayerMovementState._getMovement(inputState) || false;
			}
		},
		MOVING_UP: {
			enter: function (object) {
				object.entity.setOrientation(Orientation.NORTH);
			},
			update: function (object, inputState) {
				var newState = PlayerMovementState._getMovement(inputState) || PlayerMovementState._getIdle(inputState, Input.UP);
				if (newState) {
					return newState;
				}
				object.entity.impulse(0, -object.speed);
			}
		},
		MOVING_DOWN: {
			enter: function (object) {
				object.entity.setOrientation(Orientation.SOUTH);
			},
			update: function (object, inputState) {
				var newState = PlayerMovementState._getMovement(inputState) || PlayerMovementState._getIdle(inputState, Input.DOWN);
				if (newState) {
					return newState;
				}
				object.entity.impulse(0, object.speed);
			}
		},
		MOVING_LEFT: {
			enter: function (object) {
				object.entity.setOrientation(Orientation.WEST);
			},
			update: function (object, inputState) {
				var newState = PlayerMovementState._getMovement(inputState) || PlayerMovementState._getIdle(inputState, Input.LEFT);
				if (newState) {
					return newState;
				}
				object.entity.impulse(-object.speed, 0);
			}
		},
		MOVING_RIGHT: {
			enter: function (object) {
				object.entity.setOrientation(Orientation.EAST);
			},
			update: function (object, inputState) {
				var newState = PlayerMovementState._getMovement(inputState) || PlayerMovementState._getIdle(inputState, Input.RIGHT);
				if (newState) {
					return newState;
				}
				object.entity.impulse(object.speed, 0);
			}
		}
	};

	ObjectFactory.register('player', Player);
})();
