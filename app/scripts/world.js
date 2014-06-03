/* global Terrain */

(function () {
	'use strict';

	function World(viewport) {
		this.viewport = viewport;
		this.map = null;
		this.terrain = [];
		this.objects = [];
		this.width = 0;
		this.height = 0;
	}

	World.prototype.centerOn = function (x, y, w, h) {
		this.viewport.centerOn(x, y, w, h, this.width, this.height);
	};

	World.prototype.addObject = function (object) {
		this.objects.push(object);
	};

	World.prototype.loadMap = function (map) {
		this.map = map;
		this.terrain = Terrain.readMapTerrain(map.terrain);
		this.width = map.width * map.tileSize;
		this.height = Math.ceil(this.terrain.length / map.width) * map.tileSize;
	};

	World.prototype.update = function (inputState) {
		var wasUpdated = false;
		for (var i = 0; i < this.objects.length; i++) {
			var updated = this.objects[i].update(this, inputState);
			wasUpdated = wasUpdated || updated;
		}
		return wasUpdated;
	};

	World.prototype.render = function (graphics) {
		for (var j = 0; j < this.terrain.length; j++) {
			this.terrain[j].render(graphics, j % this.map.width, Math.floor(j / this.map.width));
		}

		for (var i = 0; i < this.objects.length; i++) {
			this.objects[i].render(graphics);
		}
	};

	window.World = World;
})();
