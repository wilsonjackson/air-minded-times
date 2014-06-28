/* global Engine, AirMindedTimes */

document.addEventListener('DOMContentLoaded', function () {
	'use strict';

	Engine.init({
		canvas: document.getElementById('viewport'),
		bootstrap: new AirMindedTimes()
	});
	Engine.start();
});
