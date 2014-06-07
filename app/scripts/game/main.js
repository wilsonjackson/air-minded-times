/* global Game, Map */

document.addEventListener('DOMContentLoaded', function () {
	'use strict';

	Game.init({
		canvas: document.getElementById('viewport')
	});
	Game.world.setBackground('#4d5967');
	Game.world.loadMap(Map.TEST_MAP);
	Game.start();
});
