/* global Game, AirMindedTimes */

document.addEventListener('DOMContentLoaded', function () {
	'use strict';

	Game.init({
		canvas: document.getElementById('viewport'),
		bootstrap: new AirMindedTimes()
	});
	Game.start();
});
