/* global SpriteFactory, Sprite, Physics, Input */

(function () {
	'use strict';

	function cycleSprite(player) {
		var nextSpriteName = player.sprites.shift();
		var nextSprite = SpriteFactory.getSprite(nextSpriteName);
		if (player.sprite) {
			nextSprite.direction = player.sprite.direction;
		}
		player.sprite = nextSprite;
		player.sprites.push(nextSpriteName);
	}

	function Player(x, y, w, h) {
		this.sprites = ['aero/extended-farewell', 'aero/biplane-dieplane', 'aero/justice-glider-mkiv'];
		this.entity = Physics.newEntity(x, y, w, h);
		this.entity.speed = 2;
		cycleSprite(this);
		this.movement = PlayerMovementState.IDLE;
	}

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
		return newState !== false;
	};

	Player.prototype.render = function (graphics) {
		graphics.drawSprite(this.sprite, this.entity.x, this.entity.y, this.entity.w, this.entity.h);
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

	window.Player = Player;
})();
