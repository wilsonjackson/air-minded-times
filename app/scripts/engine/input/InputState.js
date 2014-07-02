Engine.module('input.InputState', function () {
	'use strict';

	function InputState(pressed, released, state) {
		this.pressed = pressed;
		this.released = released;
		this.state = state;
	}

	InputState.prototype.isPressed = function (button) {
		return this.pressed.indexOf(button) !== -1;
	};

	InputState.prototype.isDown = function (button) {
		return !!this.state[button];
	};

	//noinspection JSUnusedGlobalSymbols
	InputState.prototype.isReleased = function (button) {
		return this.released.indexOf(button) !== -1;
	};

	return InputState;
});
