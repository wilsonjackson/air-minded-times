/* global Game, Input, ObjectType, Ui, IntroScene1, PauseScreen */

(function () {
	'use strict';

	function AirMindedTimes() {

	}

	AirMindedTimes.prototype = new Game.Bootstrap();

	AirMindedTimes.prototype.start = function () {
		Ui.activateScreen(new IntroScene1());
	};

	AirMindedTimes.prototype.preUpdate = function (input) {
		if (!Ui.isScreenActive() && input.isPressed(Input.PAUSE)) {
			Ui.activateScreen(new PauseScreen());
			return;
		}

		var player = Game.world.firstObjectOfType(ObjectType.PLAYER);
		if (player) {
			Game.world.centerOn(player.entity.getX(), player.entity.getY(), player.entity.getWidth(), player.entity.getHeight());
		}
	};

	AirMindedTimes.prototype.suspend = function () {
		if (!Ui.isScreenActive()) {
			Ui.activateScreen(new PauseScreen());
		}
	};

	window.AirMindedTimes = AirMindedTimes;
})();
