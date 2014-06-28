/* global Engine, AirMindedTimes */

(function (Engine, AirMindedTimes) {
	'use strict';

	var Input = Engine.input.Input;
	var Orientation = Engine.physics.Orientation;

	var movementMap = {};

	Engine.setup(function () {
		movementMap[AirMindedTimes.gameplay.GameplayMode.FREE_ROAM] = OmnidirectionalMovement;
		movementMap[AirMindedTimes.gameplay.GameplayMode.SCROLLING] = UnidirectionalMovement;
	});

	function PlayerMovement(player) {
		this.player = player;
		this.changed = false;
		AirMindedTimes.gameplay.GameplayMode.addObserver(this);
	}

	PlayerMovement.prototype.notify = function (gameplayMode) {
		this.movement = movementMap[gameplayMode.getMode()];
		this.changed = true;
	};

	PlayerMovement.prototype.update = function (world, input) {
		if (this.changed) {
			this.movement.enter(this.player);
			this.changed = false;
		}
		var newState = this.movement.update(this.player, world, input);
		if (newState) {
			this.movement = newState;
			newState.enter(this.player);
		}
	};

	PlayerMovement.prototype.destroy = function () {
		AirMindedTimes.gameplay.GameplayMode.removeObserver(this);
	};

	var OmnidirectionalMovement = {
		enter: function (/*object*/) {},
		update: function (object, world, inputState) {
			return OmnidirectionalMovement._getMovement(inputState) || false;
		},
		_getMovement: function (inputState) {
			if (inputState.isPressed(Input.UP)) {
				return this.MOVING_UP;
			}
			if (inputState.isPressed(Input.DOWN)) {
				return this.MOVING_DOWN;
			}
			if (inputState.isPressed(Input.LEFT)) {
				return this.MOVING_LEFT;
			}
			if (inputState.isPressed(Input.RIGHT)) {
				return this.MOVING_RIGHT;
			}
		},
		_getIdle: function (inputState, button) {
			return !inputState.isDown(button) ? this : null;
		},
		MOVING_UP: {
			enter: function (object) {
				object.entity.setOrientation(Orientation.NORTH);
			},
			update: function (object, world, inputState) {
				var newState = OmnidirectionalMovement._getMovement(inputState) || OmnidirectionalMovement._getIdle(inputState, Input.UP);
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
			update: function (object, world, inputState) {
				var newState = OmnidirectionalMovement._getMovement(inputState) || OmnidirectionalMovement._getIdle(inputState, Input.DOWN);
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
			update: function (object, world, inputState) {
				var newState = OmnidirectionalMovement._getMovement(inputState) || OmnidirectionalMovement._getIdle(inputState, Input.LEFT);
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
			update: function (object, world, inputState) {
				var newState = OmnidirectionalMovement._getMovement(inputState) || OmnidirectionalMovement._getIdle(inputState, Input.RIGHT);
				if (newState) {
					return newState;
				}
				object.entity.impulse(object.speed, 0);
			}
		}
	};

	var UnidirectionalMovement = {
		enter: function (object) {
			object.entity.setOrientation(Orientation.NORTH);
		},
		update: function (object, world, inputState) {
			if (inputState.isDown(Input.UP)) {
				object.entity.impulse(0, -object.speed);
			}
			if (inputState.isDown(Input.DOWN)) {
				object.entity.impulse(0, object.speed);
			}
			if (inputState.isDown(Input.LEFT)) {
				object.entity.impulse(-object.speed, 0);
			}
			if (inputState.isDown(Input.RIGHT)) {
				object.entity.impulse(object.speed, 0);
			}
		}
	};

	AirMindedTimes.controls = {
		PlayerMovement: PlayerMovement
	};
})(Engine, AirMindedTimes);
