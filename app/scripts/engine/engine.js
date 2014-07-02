/* global Stats */

(function (window, document) {
	'use strict';

	var setup = [];
	var session;
	var nextGameTick;
	var suspended = false;

	var Engine = {};

	Engine.tick = 0;
	Engine.delta = 0;

	Engine.setup = function (callback) {
		checkNotInitialized();
		setup.push(callback);
	};

	Engine.init = function (config) {
		checkNotInitialized();
		this.logger = new Engine.logging.DefaultLogger();
		setup.forEach(function (callback) {
			callback();
		});
		setup = [];
		session = new GameSession(config);
		registerGlobalEventHandlers();
	};

	Engine.start = function () {
		Engine.logger.info('Starting preload');
		Engine.graphics.SpriteRepository.preload().then(function () {
			Engine.logger.info('Preload complete');
			session.bootstrap.start();
			nextGameTick = new Date().getTime();
			tick();
		});
	};

	Engine.suspend = function () {
		if (suspended) {
			return;
		}
		Engine.logger.info('Game suspended');
		suspended = true;
		session.bootstrap.suspend();
	};

	Engine.resume = function () {
		if (!suspended) {
			return;
		}
		Engine.logger.info('Game resumed');
		nextGameTick = new Date().getTime();
		suspended = false;
		session.bootstrap.resume();
	};

	Engine.getViewport = function () {
		return session.viewport;
	};

	Engine.getScene = function () {
		return session.scene;
	};

	Engine.setScene = function (scene) {
		session.scene = scene;
		scene.activate();
	};

	Engine.pushScene = function (scene) {
		session.scenes.push(session.scene);
		session.scene = scene;
		scene.activate();
	};

	Engine.popScene = function () {
		if (session.scenes.length > 0) {
			session.scene = session.scenes.pop();
			session.scene.activate();
		}
		else {
			session.scene = null;
		}
	};

	Engine.Bootstrap = function () {};
	Engine.Bootstrap.prototype.start = function () {
		throw 'The game must implement a start method.';
	};
	Engine.Bootstrap.prototype.preUpdate = function (/*input*/) {};
	Engine.Bootstrap.prototype.postUpdate = function (/*input*/) {};
	Engine.Bootstrap.prototype.preRender = function (/*viewport*/) {};
	Engine.Bootstrap.prototype.postRender = function (/*viewport*/) {};
	Engine.Bootstrap.prototype.suspend = function () {};
	Engine.Bootstrap.prototype.resume = function () {};

	function GameSession(config) {
		if (!config.canvas || !(config.canvas instanceof HTMLCanvasElement)) {
			throw 'canvas element is required';
		}
		if (!config.bootstrap) {
			throw 'bootstrap object is required';
		}

		this.bootstrap = config.bootstrap;
		this.viewport = new Engine.graphics.Viewport(config.canvas);
		this.input = new Engine.input.Input();
		this.scene = null;
		this.scenes = [];
	}

	GameSession.prototype.run = (function () {
		var loops = 0;
		var skipTicks = 1000 / 50; // Target 50fps game updates
		var maxFrameSkip = 10;
		var time;

		var fpsStats = createStats().add();
		var tickStats = createStats(1).after(fpsStats);
		var renderStats = createStats(1).after(tickStats);

		return function () {
			loops = 0;

			// Suspended/uninitialized game bails immediately
			if (suspended || this.scene === null) {
				return;
			}

			while ((time = new Date().getTime()) > nextGameTick && loops < maxFrameSkip) {
				++Engine.tick;
				Engine.delta = time - nextGameTick;
				tickStats.begin();
				// Process input
				var inputState = this.input.readInput();

				// Update
				this.bootstrap.preUpdate(this.scene, inputState);
				this.scene.update(inputState);
				this.bootstrap.postUpdate(this.scene, inputState);

				nextGameTick += skipTicks;
				loops++;
				tickStats.end();
			}

			// Render
			renderStats.begin();
			this.bootstrap.preRender(this.scene, this.viewport);
			this.viewport.clear();
			this.scene.render(this.viewport);
			this.bootstrap.postRender(this.scene, this.viewport);
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
			throw 'Engine already initialized';
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
				Engine.suspend();
			}
			else {
				Engine.resume();
			}
		}, false);

		window.addEventListener('blur', function () {
			Engine.suspend();
		}, false);
		window.addEventListener('focus', function () {
			Engine.resume();
		}, false);
	}

	window.Engine = Engine;
})(window, document);
