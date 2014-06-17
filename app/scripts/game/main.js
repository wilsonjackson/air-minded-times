/* global Game, Map */

document.addEventListener('DOMContentLoaded', function () {
	'use strict';

	Game.init({
		canvas: document.getElementById('viewport')
	});
	Game.world.loadMap(Map.LEVEL2);
	Game.start();
});
