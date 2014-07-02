Engine.module('amt.game.Bootstrap',
	[
		'input.Input',
		'amt.screens.Intro',
		'amt.screens.PauseScreen'
	],
	function () {
		'use strict';

		var Input = Engine.input.Input;

		function Bootstrap() {
		}

		Bootstrap.prototype = Object.create(Engine.Bootstrap.prototype);

		Bootstrap.prototype.start = function () {
			Engine.logger.info('Starting AirMindedTimes');
			Engine.setScene(new Engine.amt.screens.Intro());
		};

		Bootstrap.prototype.preUpdate = function (scene, input) {
			if (input.isPressed(Input.PAUSE)) {
				Engine.pushScene(new Engine.amt.screens.PauseScreen());
			}
		};

		Bootstrap.prototype.suspend = function () {
//		Engine.pushScene(new AirMindedTimes.screens.PauseScreen());
		};

		return {
			Bootstrap: Bootstrap
		};
	});
