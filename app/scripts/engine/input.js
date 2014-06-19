/* global Game */

(function (Game) {
	'use strict';

	function Input() {
		var keyMap = {
			38: Input.UP,      // Up
			40: Input.DOWN,    // Down
			37: Input.LEFT,    // Left
			39: Input.RIGHT,   // Right
			32: Input.ACTION,  // Space
			65: Input.A,       // a
			83: Input.B,       // s
			68: Input.C,       // d
			70: Input.D,       // f
			80: Input.PAUSE    // p
		};

		var pressed = this.pressed = [];
		var released = this.released = [];
		var state = {};

		function onKeyDown(e) {
			var button = keyMap[e.keyCode];
			if (button) {
				e.preventDefault();
				// Ignore subsequent button presses (key repeat)
				if (!state[button]) {
					pressed.push(button);
					state[button] = true;
				}
			}
		}

		function onKeyUp(e) {
			var button = keyMap[e.keyCode];
			if (button) {
				e.preventDefault();
				released.push(button);
				state[button] = false;
			}
		}

		document.body.addEventListener('keydown', onKeyDown, false);
		document.body.addEventListener('keyup', onKeyUp, false);
	}

	Input.UP = 'up';
	Input.DOWN = 'down';
	Input.LEFT = 'left';
	Input.RIGHT = 'right';
	Input.ACTION = 'action';
	Input.A = 'a';
	Input.B = 'b';
	Input.C = 'c';
	Input.D = 'd';
	Input.PAUSE = 'pause';

	Input.prototype.readInput = function () {
		return new InputState(
			this.pressed.splice(0, this.pressed.length),
			this.released.splice(0, this.released.length));
	};

	function InputState(pressed, released) {
		this.pressed = pressed;
		this.released = released;
	}

	InputState.prototype.isPressed = function (button) {
		return this.pressed.indexOf(button) !== -1;
	};

	InputState.prototype.isReleased = function (button) {
		return this.released.indexOf(button) !== -1;
	};

	Game.input = {
		Input: Input,
		InputState: InputState
	};
})(Game);
