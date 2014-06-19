/* global Game */

(function (Game, window) {
	'use strict';

	var Ui = Game.ui.Ui;
	var Input = Game.input.Input;

	function AirMindedTimes() {

	}

	AirMindedTimes.prototype = new Game.Bootstrap();

	AirMindedTimes.prototype.start = function () {
		Ui.activateScreen(new AirMindedTimes.cinematics.IntroScene1());
	};

	AirMindedTimes.prototype.preUpdate = function (world, input) {
		if (!Ui.isScreenActive() && input.isPressed(Input.PAUSE)) {
			Ui.activateScreen(new AirMindedTimes.screens.PauseScreen());
			return;
		}

		var player = world.firstObjectOfType(Game.objects.ObjectType.PLAYER);
		if (player) {
			world.centerOn(player.entity.getX(), player.entity.getY(), player.entity.getWidth(), player.entity.getHeight());
		}
	};

	AirMindedTimes.prototype.suspend = function () {
		if (!Ui.isScreenActive()) {
			Ui.activateScreen(new AirMindedTimes.screens.PauseScreen());
		}
	};

	window.AirMindedTimes = AirMindedTimes;
})(Game, window);
