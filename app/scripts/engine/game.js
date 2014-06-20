/* global Stats */

(function (window, document) {
	'use strict';

	var setup = [];
	var session;
	var nextGameTick;
	var suspended = false;

	var Game = {};

	Game.tick = 0;
	Game.delta = 0;

	Game.setup = function (callback) {
		checkNotInitialized();
		setup.push(callback);
	};

	Game.init = function (config) {
		checkNotInitialized();
		this.logger = new Game.logging.DefaultLogger();
		setup.forEach(function (callback) {
			callback();
		});
		setup = [];
		session = new GameSession(config);
		registerGlobalEventHandlers();
	};

	Game.start = function () {
		Game.logger.info('Starting preload');
		Game.graphics.SpriteRepository.preload().then(function () {
			Game.logger.info('Preload complete');
			session.bootstrap.start(session.world);
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
		session.bootstrap.suspend();
	};

	Game.resume = function () {
		if (!suspended) {
			return;
		}
		Game.logger.info('Game resumed');
		nextGameTick = new Date().getTime();
		suspended = false;
		session.bootstrap.resume();
	};

	Game.getWorld = function () {
		return session.world;
	};

	Game.getViewport = function () {
		return session.viewport;
	};

	Game.Bootstrap = function () {};
	Game.Bootstrap.prototype.start = function () {
		throw 'The game must implement a start method.';
	};
	Game.Bootstrap.prototype.preUpdate = function (/*world, input*/) {};
	Game.Bootstrap.prototype.postUpdate = function (/*world, input*/) {};
	Game.Bootstrap.prototype.preRender = function (/*graphics*/) {};
	Game.Bootstrap.prototype.postRender = function (/*graphics*/) {};
	Game.Bootstrap.prototype.suspend = function () {};
	Game.Bootstrap.prototype.resume = function () {};

	function GameSession(config) {
		if (!config.canvas || !(config.canvas instanceof HTMLCanvasElement)) {
			throw 'canvas element is required';
		}
		if (!config.bootstrap) {
			throw 'bootstrap object is required';
		}

		this.bootstrap = config.bootstrap;
		this.viewport = new Game.graphics.Viewport(config.canvas);
		this.input = new Game.input.Input();
		this.graphics = new Game.graphics.Graphics(this.viewport);
		this.uiGraphics = new Game.graphics.Graphics(this.viewport);
		this.world = new Game.world.World(this.graphics);
		Game.ui.Ui.init(this.world);
		Game.physics.Physics.init(this.world);
	}

	GameSession.prototype.run = (function () {
		var Ui;
		var loops = 0;
		var skipTicks = 1000 / 50; // Target 50fps game updates
		var maxFrameSkip = 10;
		var time;

		var fpsStats = createStats().add();
		var tickStats = createStats(1).after(fpsStats);
		var renderStats = createStats(1).after(tickStats);

		return function () {
			Ui = Game.ui.Ui;
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
				this.bootstrap.preUpdate(this.world, inputState);
				Ui.update(this.world, inputState);
				if (!Ui.isScreenActive()) {
					this.world.update(inputState);
				}
				this.bootstrap.postUpdate(this.world, inputState);

				nextGameTick += skipTicks;
				loops++;
				tickStats.end();
			}

			// Render
			renderStats.begin();
			this.bootstrap.preRender(this.graphics);
			this.graphics.clear();
			if (!Ui.isScreenActive()) {
				this.world.render(this.graphics);
			}
			Ui.render(this.uiGraphics);
			this.bootstrap.postRender(this.graphics);
			renderStats.end();

			fpsStats.update();
		};
	})();

	function tick() {
		session.run();
		window.requestAnimationFrame(tick, document.body);
	}

	function checkNotInitialized() {
		if (session) {
			throw 'Game already initialized';
		}
	}

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

	function registerGlobalEventHandlers() {
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
	}

	window.Game = Game;
})(window, document);
