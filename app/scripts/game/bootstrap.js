/* global Engine */

(function (Engine, window) {
	'use strict';

	var Input = Engine.input.Input;

	function AirMindedTimes() {
	}

	AirMindedTimes.prototype = Object.create(Engine.Bootstrap.prototype);

	AirMindedTimes.prototype.start = function () {
		Engine.logger.info('Starting AirMindedTimes');
		Engine.setScene(new AirMindedTimes.cinematics.IntroScene1());
	};

	AirMindedTimes.prototype.preUpdate = function (scene, input) {
		if (input.isPressed(Input.PAUSE)) {
			Engine.pushScene(new AirMindedTimes.screens.PauseScreen());
		}
	};

	AirMindedTimes.prototype.suspend = function () {
//		Engine.pushScene(new AirMindedTimes.screens.PauseScreen());
	};

	window.AirMindedTimes = AirMindedTimes;
})(Engine, window);
