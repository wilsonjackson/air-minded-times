/* global Game, Map, Player */

document.addEventListener('DOMContentLoaded', function () {
	'use strict';

	Game.init({
		canvas: document.getElementById('viewport')
	});
	Game.world.loadMap(Map.BUTTLAND);
	Game.world.addObject(new Player(0, 0, 20, 20));
	Game.start();
});
