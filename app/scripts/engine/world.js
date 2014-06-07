/* global Physics, Terrain, ObjectFactory, Sprite */

(function () {
	'use strict';

	function World(graphics) {
		this.graphics = graphics;
		this.map = null;
		this.terrain = [];
		this.objects = [];
		this.width = 0;
		this.height = 0;
		this._removeObjectCallback = this.removeObject.bind(this);
	}

	World.prototype.setBackground = function (background) {
		this.graphics.setBackground(background);
	};

	World.prototype.centerOn = function (x, y, w, h) {
		this.graphics.centerOn(x, y, w, h, this.width, this.height);
	};

	World.prototype.addObject = function (object) {
		this.objects.push(object);
		object.onDestroy(this._removeObjectCallback);
	};

	World.prototype.removeObject = function (object) {
		var i = this.objects.indexOf(object);
		if (i > -1) {
			this.objects.splice(i, 1);
		}
	};

	World.prototype.firstObjectOfType = function (type) {
		for (var i = 0, len = this.objects.length; i < len; i++) {
			if (this.objects[i].type === type) {
				return this.objects[i];
			}
		}
		return null;
	};

	World.prototype.loadMap = function (map) {
		var world = this;
		world.map = map;
		world.terrain = Terrain.readMapTerrain(map.terrain);
		world.width = map.width * map.tileSize;
		world.height = Math.ceil(world.terrain.length / map.width) * map.tileSize;
		map.objects.forEach(function (object) {
			world.addObject(ObjectFactory.spawn(object.id, object.x, object.y, object.direction || Sprite.D_UP));
		});
	};

	World.prototype.update = function (inputState) {
		Physics.update();

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
