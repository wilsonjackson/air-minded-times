/* global Game, AirMindedTimes */

(function (Game, AirMindedTimes) {
	'use strict';

	var Input = Game.input.Input;
	var Orientation = Game.physics.Orientation;

	var GameplayMode = {
		setMode: function (mode) {
			currentMode = mode;
			updatePlayerControls();
		},

		createMovementControl: function () {
			var control = new PlayerControl();
			addPlayerControl(control);
			return control;
		}
	};

	var controls = [];
	var currentMode = GameplayMode.SCROLLING;

	function addPlayerControl(control) {
		controls.push(control);
		control.setMovement(currentMode);
	}

	function updatePlayerControls() {
		for (var i = 0, len = controls.length; i < len; i++) {
			controls[i].setMovement(currentMode);
		}
	}

	function PlayerControl() {
		this.changed = false;
	}

	PlayerControl.prototype.setMovement = function (mode) {
		this.changed = true;
		this.movement = mode;
	};

	PlayerControl.prototype.update = function (object, world, input) {
		if (this.changed) {
			this.movement.enter(object);
		}
		var newState = this.movement.update(object, world, input);
		if (newState) {
			this.movement = newState;
			newState.enter(object);
		}
	};

	var OmnidirectionalMovement = GameplayMode.FREE_ROAM = {
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

	GameplayMode.SCROLLING = {
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

	AirMindedTimes.gameplay = {
		GameplayMode: GameplayMode
	};
})(Game, AirMindedTimes);
