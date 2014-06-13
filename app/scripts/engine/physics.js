/* jshint bitwise: false */
/* globals Events, QuadTree, Vector, BoundingRect, BoundingCircle */

(function () {
	'use strict';

	function isFunction(o) {
		return !!(o && o.constructor && o.call && o.apply);
	}

	var Physics = (function () {
		var world;
		var nextEntity = 0;
		var entities = [];

		function newEntity(category, bounds, orientation, object) {
			var entity = entities[entities.length] = new Entity(++nextEntity,category, bounds, orientation, object);
			entity.onDestroy(function () {
				var index = entities.indexOf(entity);
				if (index > -1) {
					entities.splice(index, 1);
				}
			});
			return entity;
		}

		function detectObjectCollision(entityA, entityB) {
			var collidableA = entityA.collidable;
			var collidableB = entityB.collidable;
			if ((collidableA === true && collidableB === true) ||
				(isFunction(entityA.collidable) && entityA.collidable(entityB)) ||
				(isFunction(entityB.collidable) && entityB.collidable(entityA))) {

				var intersection = entityA.bounds.intersection(entityB.bounds);
				if (intersection !== null) {
					var collisionA = new Collision(entityB, intersection);
					var solutionA = entityA.solveCollision(collisionA);

					var collisionB = new Collision(entityA, intersection);
					var solutionB = entityB.solveCollision(collisionB);

					if (solutionA) {
						entityA.bounds.move(solutionA);
					}
					if (solutionB) {
						entityB.bounds.move(solutionB);
					}

					entityA.collide(new Collision(entityB));
					entityB.collide(new Collision(entityA));
				}
			}
		}

		function entityToQuadTreeObject(entity) {
			return {
				e: entity,
				x: entity.bounds.left(),
				y: entity.bounds.top(),
				w: entity.bounds.width(),
				h: entity.bounds.height()
			};
		}

		return {
			init: function (_world) {
				world = _world;
			},

			newRectEntity: function (category, x, y, w, h, orientation, object) {
				return newEntity(category, new BoundingRect(new Vector(x, y), new Vector(w, h)), orientation, object);
			},

			newCircleEntity: function (category, x, y, r, object) {
				return newEntity(category, new BoundingCircle(new Vector(x, y), r), Orientation.NORTH, object);
			},

			update: function () {
				var i, j, len = entities.length;
				var compared = {};
				var quadTree = new QuadTree(1, {x: 0, y: 0, w: world.width, h: world.height});

				for (i = 0; i < len; i++) {
					entities[i].integrate();
					quadTree.insert(entityToQuadTreeObject(entities[i]));
				}
				for (i = 0; i < len; i++) {
					var entity = entities[i];
					if (!entity) {
						// Safety check, as entities may be deleted by collision handlers.
						continue;
					}

					compared[entity._id] = {};

					if (entity.collidable === false) {
						continue;
					}
					var nearby = quadTree.retrieve(entityToQuadTreeObject(entity));
					var nlen = nearby.length;
					for (j = 0; j < nlen; j++) {
						var nearbyEntity = nearby[j].e;
						var alreadyChecked = compared[nearbyEntity._id] && compared[nearbyEntity._id][entity._id];
						if (alreadyChecked || nearbyEntity.collidable === false || nearbyEntity === entity ||
							(nearbyEntity.isStatic && entity.isStatic)) {
							continue;
						}
						detectObjectCollision(entity, nearbyEntity);
						compared[entity._id][nearbyEntity._id] = true;
					}
					entity.isRotated = false;
				}
			}
		};
	})();

	function Collision(entity, intersection) {
		this.entity = entity;
		this.intersection = intersection;
	}

	function Entity(id, category, bounds, orientation, object) {
		this._id = id;
		this.events = new Events();
		this.category = category;
		this.object = object;
		this.bounds = bounds;
		this.orientation = orientation;
		this.lastOrientation = null;
		this.nextMovement = new Vector(0, 0);
		this.currentMovement = new Vector(0, 0);

		this.isStatic = false;
		this.collidable = true;
		this.collisionListeners = [];
		this.isColliding = false;
		this.isRotated = false;
	}

	Entity.prototype.setStatic = function () {
		this.isStatic = true;
		return this;
	};

	Entity.prototype.onDestroy = function (fn) {
		this.events.on('destroy', fn);
	};

	Entity.prototype.addCollisionListener = function (listener) {
		if (isFunction(listener)) {
			listener = {
				solveCollision: function () {},
				collide: listener
			};
		}
		this.collisionListeners[this.collisionListeners.length] = listener;
	};

	Entity.prototype.impulse = function (x, y) {
		this.nextMovement = this.nextMovement.add(new Vector(x, y));
	};

	Entity.prototype.getOrientation = function () {
		return this.orientation;
	};

	Entity.prototype.setOrientation = function (orientation) {
		// Detect x/y orientation change
		if ((orientation.asRadians() + this.orientation.asRadians()) % Math.PI > 0) {
			this.bounds.rotate();
			this.isRotated = true;
		}
		this.lastOrientation = this.orientation;
		this.orientation = orientation;
	};

	Entity.prototype.getX = function () {
		return this.bounds.left();
	};

	Entity.prototype.getY = function () {
		return this.bounds.top();
	};

	Entity.prototype.getWidth = function () {
		return this.bounds.width();
	};

	Entity.prototype.getHeight = function () {
		return this.bounds.height();
	};

	Entity.prototype.integrate = function () {
		this.bounds.move(this.nextMovement);
		this.currentMovement = this.nextMovement;
		this.nextMovement = new Vector(0, 0);
		this.isColliding = false;
	};

	Entity.prototype.solveCollision = function (collision) {
		for (var i = 0, len = this.collisionListeners.length; i < len; i++) {
			var adjustment = this.collisionListeners[i].solveCollision(collision);
			if (adjustment) {
				return adjustment;
			}
		}
	};

	Entity.prototype.collide = function (collision) {
		for (var i = 0, len = this.collisionListeners.length; i < len; i++) {
			this.collisionListeners[i].collide(collision);
			this.isColliding = true;
		}
	};

	Entity.prototype.destroy = function () {
		this.events.trigger('destroy', this);
	};

	Entity.prototype.toString = function () {
		return 'Entity(id=' + this._id + ', category=' + this.category + ')';
	};

	function EntityCategory(value) {
		this.value = value;
	}

	EntityCategory.prototype.isA = function (type) {
		return !!(this.value & type.value);
	};

	EntityCategory.prototype.toString = function () {
		return 'EntityCategory(' + this.value + ')';
	};

	var nextType = 1;
	var types = {};

	EntityCategory.add = function (id/*, parents...*/) {
		var type = nextType;
		for (var i = 1, len = arguments.length; i < len; i++) {
			type |= arguments[i].value;
		}
		nextType = nextType << 1;
		return (types[id] = new EntityCategory(type));
	};

	EntityCategory.retrieve = function (id) {
		return types[id];
	};

	EntityCategory.retrieveMatching = function (type) {
		var matching = [];
		for (var i in types) {
			if (type.isA(types[i])) {
				matching.push(type);
			}
		}
		return matching;
	};

	EntityCategory.ACTOR = EntityCategory.add('actor');
	EntityCategory.PLAYER = EntityCategory.add('player', EntityCategory.ACTOR);
	EntityCategory.ENEMY = EntityCategory.add('enemy', EntityCategory.ACTOR);
	EntityCategory.NPC = EntityCategory.add('npc', EntityCategory.ACTOR);
	EntityCategory.OBSTACLE = EntityCategory.add('obstacle');
	EntityCategory.WALL = EntityCategory.add('wall', EntityCategory.OBSTACLE);
	EntityCategory.EDGE = EntityCategory.add('edge', EntityCategory.OBSTACLE);
	EntityCategory.ITEM = EntityCategory.add('item');
	EntityCategory.PROJECTILE = EntityCategory.add('projectile');

	// Rotation in radians
	var RADIANS_N = 0;
	var RADIANS_E = 90 * (Math.PI / 180);
	var RADIANS_S = 180 * (Math.PI / 180);
	var RADIANS_W = 270 * (Math.PI / 180);

	function Orientation(radians) {
		this.radians = radians;
	}

	Orientation.prototype.asRadians = function () {
		return this.radians;
	};

	Orientation.prototype.isXAxis = function () {
		return this.radians % Math.PI !== 0;
	};

	Orientation.prototype.isYAxis = function () {
		return this.radians % Math.PI === 0;
	};

	Orientation.prototype.translateXY = function (x, y) {
		if (this.radians === RADIANS_W || this.radians === RADIANS_E) {
			//noinspection JSSuspiciousNameCombination
			return {x: y, y: x};
		}
		else {
			return {x: x, y: y};
		}
	};

	Orientation.prototype.translateNESW = function (north, east, south, west) {
		switch (this.radians) {
			case RADIANS_N:
				return {n: north, e: east, s: south, w: west};
			case RADIANS_E:
				return {n: east, e: south, s: west, w: north};
			case RADIANS_S:
				return {n: south, e: west, s: north, w: east};
			case RADIANS_W:
				return {n: west, e: north, s: east, w: south};
		}
	};

	Orientation.prototype.toString = function () {
		return 'Orientation(radians=' + this.radians + ')';
	};

	Orientation.NORTH = new Orientation(RADIANS_N);
	Orientation.EAST = new Orientation(RADIANS_E);
	Orientation.SOUTH = new Orientation(RADIANS_S);
	Orientation.WEST = new Orientation(RADIANS_W);

	window.Physics = Physics;
	window.EntityCategory = EntityCategory;
	window.Orientation = Orientation;
})();
