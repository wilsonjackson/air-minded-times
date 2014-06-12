/* global Vector, SpriteRepository, Sprite, Input, ObjectFactory, ObjectType, EntityCategory, SpriteObject, Inventory */

(function () {
	'use strict';

	function cycleSprite(player) {
		var nextSpriteName = player.sprites.shift();
		var nextSprite = SpriteRepository.retrieve(nextSpriteName);
		if (player.sprite) {
			nextSprite.direction = player.sprite.direction;
		}
		player.sprite = nextSprite;
		player.sprites.push(nextSpriteName);
	}

	function Player() {
		this.type = ObjectType.PLAYER;
		this.inventory = new Inventory();
		this.sprites = ['aero/extended-farewell', 'aero/biplanedieplane', 'aero/justice-glider-mkiv'];
		cycleSprite(this);
		this.speed = 4;
		this.movement = PlayerMovementState.IDLE;
		this.entityCategory = EntityCategory.PLAYER;
	}

	Player.prototype = new SpriteObject();

	Player.prototype._init = function () {
		var self = this;
		this.entity.addCollisionListener({
			solveCollision: function (collision) {
				if (collision.entity.category.isA(EntityCategory.OBSTACLE)) {
					if (self.entity.lastMovement.x !== 0) {
						return new Vector(collision.intersection.width() * (self.entity.lastMovement.x > 0 ? -1 : 1), 0);
					}
					if (self.entity.lastMovement.y !== 0) {
						return new Vector(0, collision.intersection.height() * (self.entity.lastMovement.y > 0 ? -1 : 1));
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
			cycleSprite(this);
			return true;
		}
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
				object.sprite.direction = Sprite.D_UP;
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
				object.sprite.direction = Sprite.D_DOWN;
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
				object.sprite.direction = Sprite.D_LEFT;
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
				object.sprite.direction = Sprite.D_RIGHT;
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
