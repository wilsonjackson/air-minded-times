Engine.module('world.World',
	[
		'physics.Physics',
		'physics.EntityCategory',
		'world.objects.ObjectFactory',
		'world.objects.ObjectType',
		'world.map.MapGrid',
		'graphics.Scene',
		'graphics.Terrain'
	],
	function (Physics, EntityCategory, ObjectFactory, ObjectType, MapGrid, Scene, Terrain) {
		'use strict';

		var DEBUG_DRAW_MAP_OBSTACLES = false;

		function World() {
			this.physics = new Physics(this);
			this.map = null;
			this.terrain = [];
			this.interlopers = [];
			this.objects = [];
			this.width = 0;
			this.height = 0;
			this._removeObjectCallback = this.removeObject.bind(this);
		}

		World.prototype = Object.create(Scene.prototype);

		World.prototype.getPlayers = function () {
			var players = [];
			for (var i = 0, len = this.objects.length; i < len; i++) {
				if (this.objects[i] !== null && this.objects[i].type === ObjectType.PLAYER) {
					players.push(this.objects[i]);
				}
			}
			return players;
		};

		World.prototype.addObject = function (object) {
			this.objects[this.objects.length] = object;
			this.physics.addEntity(object.entity);
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
			this.addObject(ObjectFactory.spawn(id, x, y, orientation));
		};

		World.prototype.spawnObjectAt = function (id, object, orientation) {
			var center = object.entity.getCenter();
			this.addObject(ObjectFactory.spawnAtCenter(id, center.x, center.y, orientation));
		};

		//noinspection JSUnusedGlobalSymbols
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
			this.physics.destroyAllEntities();

			this.map = null;
			this.mapEntities = [];
			this.terrain = [];
			this.objects = [];
			this.width = 0;
			this.height = 0;
		};

		World.prototype.loadMap = function (map) {
			Engine.logger.info('Loading new map');

			var i, len;
			this.reset();

			var world = this;
			world.map = map;
			world.terrain = Terrain.readMapTerrain(map.terrain);
			world.width = map.width * map.tileSize;
			world.height = Math.ceil(world.terrain.length / map.width) * map.tileSize;

			// Create physical map boundaries
			this.physics.addEntity(Physics.createRectEntity(EntityCategory.EDGE, 0, -map.tileSize, world.width, map.tileSize, world).setStatic());
			this.physics.addEntity(Physics.createRectEntity(EntityCategory.EDGE, world.width, 0, map.tileSize, world.height, world).setStatic());
			this.physics.addEntity(Physics.createRectEntity(EntityCategory.EDGE, 0, world.height, world.width, map.tileSize, world).setStatic());
			this.physics.addEntity(Physics.createRectEntity(EntityCategory.EDGE, -map.tileSize, 0, map.tileSize, world.height, world).setStatic());

			this.mapEntities = [];
			// Create impassable tile entities
			var grid = new MapGrid(map.width, map.tileSize);
			grid.load(world.terrain);
			var boundaryRects = grid.calculateBoundaries();
			for (i = 0, len = boundaryRects.length; i < len; i++) {
				this.mapEntities[this.mapEntities.length] = this.physics.addEntity(
					Physics.createEntity(EntityCategory.WALL, boundaryRects[i]).setStatic());
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
			this.physics.update();
			for (i = 0, len = this.interlopers.length; i < len; i++) {
				if (this.interlopers[i] !== null) {
					this.interlopers[i].postUpdate(this, inputState);
				}
			}
			// Clean up deleted objects after update and physics
			this._cleanAfterUpdate();
		};

		World.prototype.render = function (viewport) {
			var i, len;
			for (i = 0, len = this.interlopers.length; i < len; i++) {
				if (this.interlopers[i] !== null) {
					this.interlopers[i].preRender(this, viewport);
				}
			}

			// Pre-calculate the visible part of the map and only render enough tiles to keep it filled.
			// Safety conditions are attached to the calculation of the last row and last column to ensure it never tries
			// to render a tile that doesn't exist (when you're near the extreme right or bottom edge).
			var firstRow = Math.floor(viewport.sceneOffset.y / this.map.tileSize);
			var lastRow = Math.min(firstRow + Math.ceil(viewport.height / this.map.tileSize) + 1, this.terrain.length / this.map.width);
			var firstCol = Math.floor(viewport.sceneOffset.x / this.map.tileSize);
			var lastCol = Math.min(firstCol + Math.ceil(viewport.width / this.map.tileSize) + 1, this.map.width);
			for (var row = firstRow; row < lastRow; row++) {
				for (var col = firstCol; col < lastCol; col++) {
					this.terrain[(row * this.map.width + col)].render(viewport, col * this.map.tileSize, row * this.map.tileSize + this.map.tileSize);
				}
			}

			for (i = 0, len = this.objects.length; i < len; i++) {
				this.objects[i].render(viewport);
			}

			if (DEBUG_DRAW_MAP_OBSTACLES) {
				for (i = 0, len = this.mapEntities.length; i < len; i++) {
					var mapEntity = this.mapEntities[i];
					viewport.context.strokeStyle = mapEntity.category.isA(EntityCategory.OBSTACLE) ? '#ff0' : '#0f0';
					viewport.context.strokeRect(
							mapEntity.getX() - viewport.sceneOffset.x,
							mapEntity.getY() - viewport.sceneOffset.y,
						mapEntity.getWidth(), mapEntity.getHeight());
				}
			}

			for (i = 0, len = this.interlopers.length; i < len; i++) {
				if (this.interlopers[i] !== null) {
					this.interlopers[i].postRender(this, viewport);
				}
			}
		};

		return World;
	});
