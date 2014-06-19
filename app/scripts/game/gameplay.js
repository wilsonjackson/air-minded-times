/* global Game, AirMindedTimes */

(function (Game, AirMindedTimes) {
	'use strict';

	var currentMode;
	var listeners = [];

	function notifyListeners() {
		for (var i = 0, len = listeners.length; i < len; i++) {
			listeners[i].notify(currentMode);
		}
	}

	var GameplayMode = {
		FREE_ROAM: 'FREE_ROAM',
		SCROLLING: 'SCROLLING',

		setMode: function (mode) {
			currentMode = mode;
			notifyListeners();
		},

		addListener: function (listener) {
			listeners.push(listener);
			if (currentMode) {
				listener.notify(currentMode);
			}
		},

		removeListener: function (listener) {
			var i = listeners.indexOf(listener);
			if (i > -1) {
				listeners.splice(i, 1);
			}
		}
	};


	AirMindedTimes.gameplay = {
		GameplayMode: GameplayMode
	};
})(Game, AirMindedTimes);
