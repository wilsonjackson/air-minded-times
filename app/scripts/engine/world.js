/* global Game */

(function (Game, Vector, BoundingRect) {
	'use strict';

	var Physics = Game.physics.Physics;
	var EntityCategory = Game.physics.EntityCategory;
	var ObjectType = Game.objects.ObjectType;

	var DEBUG_DRAW_MAP_OBSTACLES = false;

	function World(graphics) {
		this.graphics = graphics;
		this.map = null;
		this.terrain = [];
		this.interlopers = [];
		this.objects = [];
		this.width = 0;
		this.height = 0;
		this._removeObjectCallback = this.removeObject.bind(this);
	}

	World.prototype.getPlayers = function () {
		var players = [];
		for (var i = 0, len = this.objects.length; i < len; i++) {
			if (this.objects[i] !== null && this.objects[i].type === ObjectType.PLAYER) {
				players.push(this.objects[i]);
			}
		}
		return players;
	};

	World.prototype.setBackground = function (background) {
		this.graphics.setBackground(background);
	};

	World.prototype.getCenter = function () {
		return this.graphics.getCenter();
	};

	World.prototype.getVisibleArea = function () {
		return new BoundingRect(
			new Vector(this.graphics.offsetX, this.graphics.offsetY),
			new Vector(this.graphics.viewport.width, this.graphics.viewport.height));
	};

	World.prototype.centerOn = function (x, y, w, h) {
		this.graphics.centerOn(x, y, w, h, this.width, this.height);
	};

	World.prototype.addObject = function (object) {
		this.objects[this.objects.length] = object;
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

	World.prototype.addInterloper = function (interloper) {
		this.interlopers[this.interlopers.length] = interloper;
		interloper.init(this);
	};

	World.prototype.removeInterloper = function (interloper) {
		var i = this.interlopers.indexOf(interloper);
		if (i > -1) {
			this.interlopers[i] = null;
		}
	};

	World.prototype._cleanAfterUpdate = function () {
		var i, len;
		for (i = 0, len = this.objects.length; i < len; i++) {
			if (this.objects[i] === null) {
				this.objects.splice(i--, 1);
			}
		}
		for (i = 0, len = this.interlopers.length; i < len; i++) {
			if (this.interlopers[i] === null) {
				this.interlopers.splice(i--, 1);
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
		Game.logger.info('Loading new map');

		var i, len;
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
		var grid = new Game.map.MapGrid(map.width, map.tileSize);
		grid.load(world.terrain);
		var boundaryRects = grid.calculateBoundaries();
		for (i = 0, len = boundaryRects.length; i < len; i++) {
			this.mapEntities[this.mapEntities.length] = Physics.newEntity(EntityCategory.WALL, boundaryRects[i])
				.setStatic();
		}

		// Populate world with level objects
		map.objects.forEach(function (object) {
			world.spawnObject(object.id, object.x, object.y, object.orientation);
		});

		for (i = 0, len = this.interlopers.length; i < len; i++) {
			if (this.interlopers[i] !== null) {
				this.interlopers[i].mapChange(this, map);
			}
		}
	};

	World.prototype.update = function (inputState) {
		var i, len;
		for (i = 0, len = this.interlopers.length; i < len; i++) {
			if (this.interlopers[i] !== null) {
				this.interlopers[i].preUpdate(this, inputState);
			}
		}
		for (i = 0, len = this.objects.length; i < len; i++) {
			// Defend against objects deleted during update
			if (this.objects[i] !== null) {
				this.objects[i].update(this, inputState);
			}
		}
		for (i = 0, len = this.interlopers.length; i < len; i++) {
			if (this.interlopers[i] !== null) {
				this.interlopers[i].prePhysics(this, inputState);
			}
		}
		Physics.update();
		for (i = 0, len = this.interlopers.length; i < len; i++) {
			if (this.interlopers[i] !== null) {
				this.interlopers[i].postUpdate(this, inputState);
			}
		}
		// Clean up deleted objects after update and physics
		this._cleanAfterUpdate();
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

	function Interloper() {}
	Interloper.prototype.init = function (/*world*/) {};
	Interloper.prototype.mapChange = function (/*world, map*/) {};
	Interloper.prototype.preUpdate = function (/*world, input*/) {};
	Interloper.prototype.prePhysics = function (/*world, input*/) {};
	Interloper.prototype.postUpdate = function (/*world, input*/) {};

	Game.world = {
		World: World,
		Interloper: Interloper
	};
})(Game, Vector, BoundingRect);
