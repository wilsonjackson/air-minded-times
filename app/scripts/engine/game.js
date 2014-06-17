/* global Ui, Viewport, Input, Graphics, Physics, World, SpriteRepository, DefaultLogger, Stats */

(function () {
	'use strict';

	var Game = {};

	var nextGameTick;
	var suspended = false;

	function tick() {
		Game.run();
		window.requestAnimationFrame(tick, document.body);
	}

	Game.tick = 0;
	Game.delta = 0;

	Game.init = function (config) {
		if (!config.canvas || !(config.canvas instanceof HTMLCanvasElement)) {
			throw 'canvas element is required';
		}
		if (!config.bootstrap) {
			throw 'bootstrap object is required';
		}

		this.logger = new DefaultLogger();
		this.bootstrap = config.bootstrap;
		this.viewport = new Viewport(config.canvas);
		this.input = new Input();
		this.graphics = new Graphics(this.viewport);
		this.uiGraphics = new Graphics(this.viewport);
		this.world = new World(this.graphics);
		Ui.init(this.world);
		Physics.init(this.world);
	};

	Game.start = function () {
		Game.logger.info('Starting preload');
		SpriteRepository.preload().then(function () {
			Game.logger.info('Preload complete');
			Game.bootstrap.start();
			nextGameTick = new Date().getTime();
			tick();
		});
	};

	Game.suspend = function () {
		if (suspended) {
			return;
		}
		Game.logger.info('Game suspended');
		suspended = true;
		this.bootstrap.suspend();
	};

	Game.resume = function () {
		if (!suspended) {
			return;
		}
		Game.logger.info('Game resumed');
		nextGameTick = new Date().getTime();
		suspended = false;
		this.bootstrap.resume();
	};

	Game.run = (function () {
		var loops = 0;
		var skipTicks = 1000 / 50; // Target 50fps game updates
		var maxFrameSkip = 10;
		var time;

		var fpsStats = createStats().add();
		var tickStats = createStats(1).after(fpsStats);
		var renderStats = createStats(1).after(tickStats);

		return function () {
			loops = 0;

			// Suspended game bails immediately
			if (suspended) {
				return;
			}

			while ((time = new Date().getTime()) > nextGameTick && loops < maxFrameSkip) {
				++Game.tick;
				Game.delta = time - nextGameTick;
				tickStats.begin();
				// Process input
				var inputState = this.input.readInput();

				// Update
				this.bootstrap.preUpdate(inputState);
				Ui.update(inputState);
				if (!Ui.isScreenActive()) {
					this.world.update(inputState);
				}
				this.bootstrap.postUpdate(inputState);

				nextGameTick += skipTicks;
				loops++;
				tickStats.end();
			}

			// Render
			renderStats.begin();
			this.bootstrap.preRender();
			this.graphics.clear();
			if (!Ui.isScreenActive()) {
				this.world.render(this.graphics);
			}
			Ui.render(this.uiGraphics);
			this.bootstrap.postRender();
			renderStats.end();

			fpsStats.update();
		};
	})();

	Game.Bootstrap = function () {};
	Game.Bootstrap.prototype.start = function () {
		throw 'The game must implement a start method.';
	};
	Game.Bootstrap.prototype.preUpdate = function () {};
	Game.Bootstrap.prototype.postUpdate = function () {};
	Game.Bootstrap.prototype.preRender = function () {};
	Game.Bootstrap.prototype.postRender = function () {};
	Game.Bootstrap.prototype.suspend = function () {};
	Game.Bootstrap.prototype.resume = function () {};

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
		};
	}

	document.addEventListener('visibilitychange', function () {
		if (document.hidden) {
			Game.suspend();
		}
		else {
			Game.resume();
		}
	}, false);

	window.addEventListener('blur', function () {
		Game.suspend();
	}, false);
	window.addEventListener('focus', function () {
		Game.resume();
	}, false);

	window.Game = Game;
})();
