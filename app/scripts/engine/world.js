/* global Game */

(function (Game) {
	'use strict';

	var Physics = Game.physics.Physics;
	var EntityCategory = Game.physics.EntityCategory;

	var DEBUG_DRAW_MAP_OBSTACLES = false;

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
			// The reference to the removed object is broken, and will be cleaned up at the end of the current/next
			// update loop. If it were spliced immediately, it could cause unpredictable skipping of updates.
			this.objects[i] = null;
		}
	};

	World.prototype._cleanRemovedObjects = function () {
		for (var i = 0, len = this.objects.length; i < len; i++) {
			if (this.objects[i] === null) {
				this.objects.splice(i--, 1);
			}
		}
	};

	World.prototype.spawnObject = function (id, x, y, orientation) {
		this.addObject(Game.objects.ObjectFactory.spawn(id, x, y, orientation));
	};

	World.prototype.firstObjectOfType = function (type) {
		for (var i = 0, len = this.objects.length; i < len; i++) {
			if (this.objects[i].type === type) {
				return this.objects[i];
			}
		}
		return null;
	};

	World.prototype.reset = function () {
		for (var i = 0, len = this.objects.length; i < len; i++) {
			if (this.objects[i]) {
				this.objects[i].destroy();
			}
		}
		Physics.destroyAllEntities();

		this.map = null;
		this.mapEntities = [];
		this.terrain = [];
		this.objects = [];
		this.width = 0;
		this.height = 0;
	};

	World.prototype.loadMap = function (map) {
		this.reset();

		var world = this;
		world.map = map;
		world.terrain = Game.graphics.Terrain.readMapTerrain(map.terrain);
		world.width = map.width * map.tileSize;
		world.height = Math.ceil(world.terrain.length / map.width) * map.tileSize;

		// Create physical map boundaries
		Physics.newRectEntity(EntityCategory.EDGE, 0, -map.tileSize, world.width, map.tileSize, world).setStatic();
		Physics.newRectEntity(EntityCategory.EDGE, world.width, 0, map.tileSize, world.height, world).setStatic();
		Physics.newRectEntity(EntityCategory.EDGE, 0, world.height, world.width, map.tileSize, world).setStatic();
		Physics.newRectEntity(EntityCategory.EDGE, -map.tileSize, 0, map.tileSize, world.height, world).setStatic();

		this.mapEntities = [];
		// Create impassable tile entities
		for (var i = 0, len = world.terrain.length; i < len; i++) {
			if (world.terrain[i].impassable) {
				var row = Math.floor(i / map.width);
				var col = i % map.width;
				this.mapEntities[this.mapEntities.length] = Physics.newRectEntity(EntityCategory.WALL, col * map.tileSize, row * map.tileSize, map.tileSize, map.tileSize, world.terrain[i])
					.setStatic();
			}
		}

		// Populate world with level objects
		map.objects.forEach(function (object) {
			world.spawnObject(object.id, object.x, object.y, object.orientation);
		});
	};

	World.prototype.update = function (inputState) {
		var wasUpdated = false;
		for (var i = 0, len = this.objects.length; i < len; i++) {
			// Defend against objects deleted during update
			if (this.objects[i] === null) {
				continue;
			}
			var updated = this.objects[i].update(this, inputState);
			wasUpdated = wasUpdated || updated;
		}
		Physics.update();
		// Clean up deleted objects after update and physics
		this._cleanRemovedObjects();
		return wasUpdated;
	};

	World.prototype.render = function (graphics) {
		// Pre-calculate the visible part of the map and only render enough tiles to keep it filled.
		// Safety conditions are attached to the calculation of the last row and last column to ensure it never tries
		// to render a tile that doesn't exist (when you're near the extreme right or bottom edge).
		var firstRow = Math.floor(graphics.offsetY / this.map.tileSize);
		var lastRow = Math.min(firstRow + Math.ceil(graphics.viewport.height / this.map.tileSize) + 1, this.terrain.length / this.map.width);
		var firstCol = Math.floor(graphics.offsetX / this.map.tileSize);
		var lastCol = Math.min(firstCol + Math.ceil(graphics.viewport.width / this.map.tileSize) + 1, this.map.width);
		var halfTileSize = Math.round(this.map.tileSize / 2);
		for (var row = firstRow; row < lastRow; row++) {
			for (var col = firstCol; col < lastCol; col++) {
				this.terrain[(row * this.map.width + col)].render(graphics, col * this.map.tileSize + halfTileSize, row * this.map.tileSize + halfTileSize);
			}
		}

		for (var i = 0, len = this.objects.length; i < len; i++) {
			this.objects[i].render(graphics);
		}

		if (DEBUG_DRAW_MAP_OBSTACLES) {
			for (var j = 0, jlen = this.mapEntities.length; j < jlen; j++) {
				var mapEntity = this.mapEntities[j];
				graphics.viewport.context.strokeStyle = mapEntity.category.isA(EntityCategory.OBSTACLE) ? '#ff0' : '#0f0';
				graphics.viewport.context.strokeRect(
						mapEntity.getX() - graphics.offsetX,
						mapEntity.getY() - graphics.offsetY,
					mapEntity.getWidth(), mapEntity.getHeight());
			}
		}
	};

	Game.world = {
		World: World
	};
})(Game);
