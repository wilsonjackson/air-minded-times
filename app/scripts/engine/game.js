/* global Viewport, Input, Graphics, World, SpriteFactory, Stats */

(function () {
	'use strict';

	var Game = {};

	var nextGameTick;
	var paused = false;

	function tick() {
		Game.run();
		window.requestAnimationFrame(tick, document.body);
	}

	Game.init = function (config) {
		if (!config.canvas || !(config.canvas instanceof HTMLCanvasElement)) {
			throw 'canvas element is required';
		}

		this.viewport = new Viewport(config.canvas);
		this.input = new Input();
		this.graphics = new Graphics(this.viewport);
		this.world = new World(this.graphics);
	};

	Game.start = function () {
		console.log('Starting preload');
		SpriteFactory.preload().then(function () {
			console.log('Preload complete');
			tick();
		});
	};

	Game.pause = function () {
		if (paused) {
			return;
		}
		console.log('Game paused');
		paused = true;
	};

	Game.resume = function () {
		if (!paused) {
			return;
		}
		console.log('Game resumed');
		nextGameTick = new Date().getTime();
		paused = false;
	};

	Game.run = (function () {
		var loops = 0;
		var skipTicks = 1000 / 50;
		var maxFrameSkip = 10;
		var skipRender = false;
		var enableRenderSkip = true;
		nextGameTick = new Date().getTime();

		var fpsStats = createStats().add();
		var tickStats = createStats(1).after(fpsStats);
		var renderStats = createStats(1).after(tickStats);

		return function () {
			loops = 0;

			while (new Date().getTime() > nextGameTick && loops < maxFrameSkip) {
				tickStats.begin();
				// Process input
				var inputState = this.input.readInput();

				// Paused game bails on tick
				if (paused) {
					return;
				}

				// Update
				var wasUpdated = this.world.update(inputState);
				skipRender = !wasUpdated && skipRender;

				nextGameTick += skipTicks;
				loops++;
				tickStats.end();
			}

			// Render
			if (!enableRenderSkip || !skipRender) {
				renderStats.begin();
				this.graphics.clear();
				this.world.render(this.graphics);
				skipRender = true;
				renderStats.end();
			}
			fpsStats.update();
		};
	})();

	function createStats(mode) {
		var s = new Stats();
		s.setMode(mode || 0);
		s.domElement.style.position = 'absolute';
		s.domElement.style.right = 0;
		return {
			add: function () {
				s.domElement.style.top = 0;
				document.body.appendChild(s.domElement);
				return s;
			},
			after: function (other) {
				s.domElement.style.top = (other.domElement.offsetTop + other.domElement.offsetHeight) + 'px';
				document.body.appendChild(s.domElement);
				return s;
			}
		}
	}

	document.addEventListener('visibilitychange', function () {
		if (document.hidden) {
			Game.pause();
		}
		else {
			Game.resume();
		}
	}, false);

	window.addEventListener('blur', function () {
		Game.pause();
	}, false);
	window.addEventListener('focus', function () {
		Game.resume();
	}, false);

	window.Game = Game;
})();
