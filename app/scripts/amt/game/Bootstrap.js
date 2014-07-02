Engine.module('amt.game.Bootstrap',
	[
		'input.Input',
		'amt.screens.Intro',
		'amt.screens.PauseScreen'
	],
	function (Input, Intro, PauseScreen) {
		'use strict';

		function Bootstrap() {
		}

		Bootstrap.prototype = Object.create(Engine.Bootstrap.prototype);

		Bootstrap.prototype.start = function () {
			Engine.logger.info('Starting AirMindedTimes');
			Engine.setScene(new Intro());
		};

		Bootstrap.prototype.preUpdate = function (scene, input) {
			if (input.isPressed(Input.PAUSE)) {
				Engine.pushScene(new PauseScreen());
			}
		};

		Bootstrap.prototype.suspend = function () {
//		Engine.pushScene(new AirMindedTimes.screens.PauseScreen());
		};

		return Bootstrap;
	});
