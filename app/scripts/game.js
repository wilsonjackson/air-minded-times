/* global Viewport, Input, Graphics, World, SpriteFactory, Stats */

(function () {
	'use strict';

	var Game = {};

	Game.init = function (config) {
		this.config = config;
		if (!config.canvas || !(config.canvas instanceof HTMLCanvasElement)) {
			throw 'canvas element is required';
		}

		this.viewport = new Viewport(config.canvas);
		this.input = new Input(this.viewport);
		this.graphics = new Graphics(this.viewport);
		this.world = new World(this.viewport);
	};

	Game.start = function () {
		console.log('Starting preload');
		SpriteFactory.preload().then(function () {
			console.log('Preload complete');
			var executeFrame = function () {
				Game.run();
				window.requestAnimationFrame(executeFrame, document.body);
			};
			executeFrame();
		});
	};

	Game.run = (function () {
		var loops = 0;
		var skipTicks = 1000 / 50;
		var maxFrameSkip = 10;
		var nextGameTick = new Date().getTime();
		var skipRender = false;
		var enableRenderSkip = true;

		var fpsStats = new Stats();
		fpsStats.domElement.style.position = 'absolute';
		fpsStats.domElement.style.top = 0;
		fpsStats.domElement.style.right = 0;
		document.body.appendChild(fpsStats.domElement);

		var tickStats = new Stats();
		tickStats.setMode(1);
		tickStats.domElement.style.position = 'absolute';
		tickStats.domElement.style.top = fpsStats.domElement.offsetHeight + 'px';
		tickStats.domElement.style.right = 0;
		document.body.appendChild(tickStats.domElement);

		return function () {
			loops = 0;

			while (new Date().getTime() > nextGameTick && loops < maxFrameSkip) {
				tickStats.begin();
				// Process input
				var inputState = this.input.readInput();

				// Update
				var wasUpdated = this.world.update(inputState);
				skipRender = !wasUpdated && skipRender;

				nextGameTick += skipTicks;
				loops++;
				tickStats.end();
			}

			// Render
			if (!enableRenderSkip || !skipRender) {
				this.graphics.clear();
				this.world.render(this.graphics);
				skipRender = true;
			}
			fpsStats.update();
		};
	})();

	window.Game = Game;
})();
