/* global SpriteRepository, Sprite, Input, ObjectFactory, ObjectTypeRepository, SpriteObject, Inventory */

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
		this.type = ObjectTypeRepository.PLAYER;
		this.inventory = new Inventory();
		this.sprites = ['aero/extended-farewell', 'aero/biplanedieplane', 'aero/justice-glider-mkiv'];
		cycleSprite(this);
		this.speed = 3;
		this.movement = PlayerMovementState.IDLE;
	}

	Player.prototype = new SpriteObject();

	Player.prototype._init = function () {
		var self = this;
		this.entity.onCollision(ObjectTypeRepository.ITEM, function (collision) {
			collision.object.destroy();
			self.inventory.get(collision.object.item).add();
		});
		this.entity.onCollision(ObjectTypeRepository.EDGE, function (collision) {
			if (collision.offsetX === -1) {
				self.entity.x = 0;
			}
			else if (collision.offsetX === 1) {
				self.entity.x = collision.object.world.width - self.entity.w;
			}
			if (collision.offsetY === -1) {
				self.entity.y = 0;
			}
			else if (collision.offsetY === 1) {
				self.entity.y = collision.object.world.height - self.entity.h;
			}
		});
	};

	Player.prototype.update = function (world, inputState) {
		this.entity.update();
		var newState = this.movement.update(this, inputState);
		if (newState) {
			this.movement = newState;
			this.movement.enter(this);
		}
		if (inputState.isPressed(Input.ACTION)) {
			cycleSprite(this);
			return true;
		}
		world.centerOn(this.entity.x, this.entity.y, this.entity.w, this.entity.h);
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
				object.entity.moveY(-1);
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
				object.entity.moveY(1);
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
				object.entity.moveX(-1);
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
				object.entity.moveX(1);
			}
		}
	};

	ObjectFactory.register('player', Player);
})();
