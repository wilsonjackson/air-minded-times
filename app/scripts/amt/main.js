document.addEventListener('DOMContentLoaded', function () {
	'use strict';

	Engine.init({
		canvas: document.getElementById('viewport'),
		bootstrap: 'amt.game.Bootstrap'
	});
	Engine.start();
});
