/* global Game */

(function (Game, window) {
	'use strict';

	var Ui = Game.ui.Ui;
	var Input = Game.input.Input;

	function AirMindedTimes() {
	}

	AirMindedTimes.prototype = Object.create(Game.Bootstrap.prototype);

	AirMindedTimes.prototype.start = function (world) {
		Game.logger.info('Starting AirMindedTimes');
		var GameplayMode = AirMindedTimes.gameplay.GameplayMode;
		var gameModeChanger = new Game.world.Interloper();
		gameModeChanger.mapChange = function (world, map) {
			GameplayMode.setMode(map.gameMode || GameplayMode.FREE_ROAM);
			if (map.controller) {
				map.controller(world, map);
			}
		};
		world.addInterloper(gameModeChanger);

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
})(Game, window);
