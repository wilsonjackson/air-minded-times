(function () {
	'use strict';

	function Input(/*viewport*/) {
		var keyMap = {
			38: Input.UP,
			40: Input.DOWN,
			37: Input.LEFT,
			39: Input.RIGHT,
			32: Input.ACTION,
			65: Input.A,
			83: Input.B,
			68: Input.C,
			70: Input.D
		};

		var pressed = this.pressed = [];
		var released = this.released = [];
		var state = {};

		function onKeyDown(e) {
			//		e.preventDefault();
			var button = keyMap[e.keyCode];
			// Ignore subsequent button presses (sent by key repeat)
			if (button && !state[button]) {
				pressed.push(button);
				state[button] = true;
			}
		}

		function onKeyUp(e) {
			//		e.preventDefault();
			var button = keyMap[e.keyCode];
			if (button) {
				released.push(button);
				state[button] = false;
			}
		}

		document.body.addEventListener('keydown', onKeyDown, false);
		document.body.addEventListener('keyup', onKeyUp, false);
	}

	Input.prototype.readInput = function () {
		return new InputState(
			this.pressed.splice(0, this.pressed.length),
			this.released.splice(0, this.released.length));
	};

	Input.UP = 'up';
	Input.DOWN = 'down';
	Input.LEFT = 'left';
	Input.RIGHT = 'right';
	Input.ACTION = 'action';
	Input.A = 'a';
	Input.B = 'b';
	Input.C = 'c';
	Input.D = 'd';
	//Input.UP = 1;
	//Input.DOWN = 2;
	//Input.LEFT = 3;
	//Input.RIGHT = 4;
	//Input.ACTION = 5;
	//Input.A = 6;
	//Input.B = 7;
	//Input.C = 8;
	//Input.D = 9;

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

	window.Input = Input;
	window.InputState = InputState;
})();
