Engine.module('amt.game.Game',
	[
		'world.Interloper',
		'amt.game.Levels'
	],
	function () {
		'use strict';

		var Levels = Engine.amt.game.Levels;

		var currentGame = null;
		var levels = [
			Levels.LEVEL1A
		];

		function Game(world, planeCtor) {
			var self = this;
			Events.mixin(self);
			self.world = world;
			self.mode = null;
			self.player = null;
			self.planeCtor = planeCtor;
			self.inventory = new Engine.world.items.Inventory();
			self.currentLevel = -1;
			world.addInterloper(self);
//		world.addInterloper(new AirMindedTimes.hud.HudUpdateInterloper());
			world.addInterloper(new Engine.amt.behavior.RestartOnDeathInterloper());
		}

		Game.MODE = {
			FREE_ROAM: 'FREE_ROAM',
			SCROLLING: 'SCROLLING'
		};

		Game.prototype = Object.create(Engine.world.Interloper.prototype);

		Game.prototype.mapChange = function (world, map) {
			this.player = this.world.getPlayers()[0];
			var newMode = map.gameMode || Game.MODE.FREE_ROAM;
			if (newMode !== this.mode) {
				this.mode = newMode;
				this.trigger('modechange', newMode);
			}
		};

		Game.prototype.createPlane = function () {
			return new this.planeCtor();
		};

		Game.prototype.getWorld = function () {
			return this.world;
		};

		//noinspection JSUnusedGlobalSymbols
		Game.prototype.getMode = function () {
			return this.mode;
		};

		//noinspection JSUnusedGlobalSymbols
		Game.prototype.getPlayer = function () {
			return this.player;
		};

		Game.prototype.getInventory = function () {
			return this.inventory;
		};

		Game.prototype.startNextLevel = function () {
			this.world.loadMap(levels[++this.currentLevel]);
		};

		Game.prototype.destroy = function () {
			this.world.removeInterloper(this);
			this.world = null;
			this.planeCtor = null;
			this.inventory = null;
		};

		Game.start = function (planeCtor) {
			if (currentGame !== null) {
				currentGame.destroy();
			}
			var world = new Engine.world.World();
			currentGame = new Game(world, planeCtor);
			Engine.setScene(world);
			Game.trigger('start', currentGame);
			return currentGame;
		};

		Game.current = function () {
			return currentGame;
		};

		Events.mixin(Game);

		return {
			Game: Game
		};
	});
