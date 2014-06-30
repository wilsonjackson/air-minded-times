/* global Engine, AirMindedTimes */
(function (Engine, AirMindedTimes) {
	'use strict';

	var currentGame = null;
	var levels = null;

	Engine.setup(function () {
		levels = [
			AirMindedTimes.levels.LEVEL1A
		];
	});

	function Game(world, planeCtor) {
		this.world = world;
		this.planeCtor = planeCtor;
		this.inventory = new Engine.inventory.Inventory();
		this.currentLevel = -1;
		world.addInterloper(this);
	}

	Game.prototype = Object.create(Engine.world.Interloper.prototype);

	Game.prototype.createPlane = function () {
		return new this.planeCtor();
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

	Game.startNew = function (world, planeCtor) {
		if (currentGame !== null) {
			currentGame.destroy();
		}
		currentGame = new Game(world, planeCtor);
		return currentGame;
	};

	Game.current = function () {
		return currentGame;
	};

	AirMindedTimes.game = {
		Game: Game
	}
})(Engine, AirMindedTimes);
