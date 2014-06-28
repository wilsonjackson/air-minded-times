/* global Engine */

(function (Engine, window) {
	'use strict';

	var Ui = Engine.ui.Ui;
	var Input = Engine.input.Input;

	function AirMindedTimes() {
	}

	AirMindedTimes.prototype = Object.create(Engine.Bootstrap.prototype);

	AirMindedTimes.prototype.start = function (world) {
		Engine.logger.info('Starting AirMindedTimes');
		var GameplayMode = AirMindedTimes.gameplay.GameplayMode;
		var gameModeChanger = new Engine.world.Interloper();
		gameModeChanger.mapChange = function (world, map) {
			GameplayMode.setMode(map.gameMode || GameplayMode.FREE_ROAM);
			if (map.controller) {
				map.controller(world, map);
			}
		};
		world.addInterloper(gameModeChanger);
		world.addInterloper(new AirMindedTimes.hud.HudUpdateInterloper());
		world.addInterloper(new AirMindedTimes.gameplay.RestartOnDeathInterloper());

		Ui.activateScreen(new AirMindedTimes.cinematics.IntroScene1());
	};

	AirMindedTimes.prototype.preUpdate = function (world, input) {
		if (!Ui.isScreenActive() && input.isPressed(Input.PAUSE)) {
			Ui.activateScreen(new AirMindedTimes.screens.PauseScreen());
		}
	};

	AirMindedTimes.prototype.suspend = function () {
		if (!Ui.isScreenActive()) {
			Ui.activateScreen(new AirMindedTimes.screens.PauseScreen());
		}
	};

	window.AirMindedTimes = AirMindedTimes;
})(Engine, window);
