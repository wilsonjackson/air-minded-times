Engine.module('physics.Physics',
	['physics.Collision', 'physics.Entity', 'physics.Orientation'],
	function () {
		'use strict';

		var Collision = Engine.physics.Collision;
		var Entity = Engine.physics.Entity;
		var Orientation = Engine.physics.Orientation;

		var entityUid = 0;

		function isFunction(o) {
			return !!(o && o.constructor && o.call && o.apply);
		}

		function detectObjectCollision(entityA, entityB, world) {
			var collidableA = entityA.collidable;
			var collidableB = entityB.collidable;
			if ((collidableA === true && collidableB === true) ||
				(isFunction(entityA.collidable) && entityA.collidable(entityB)) ||
				(isFunction(entityB.collidable) && entityB.collidable(entityA))) {

				var intersection = entityA.bounds.intersection(entityB.bounds);
				if (intersection !== null) {
					var collisionA = new Collision(entityB, intersection);
					var solutionA = entityA.solveCollision(collisionA, world);

					var collisionB = new Collision(entityA, intersection);
					var solutionB = entityB.solveCollision(collisionB, world);

					if (solutionA) {
						entityA.bounds.move(solutionA);
					}
					if (solutionB) {
						entityB.bounds.move(solutionB);
					}

					entityA.collide(collisionA, world);
					entityB.collide(collisionB, world);
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

		function Physics(world) {
			this.world = world;
			this.entities = [];
		}

		Physics.prototype.addEntity = function (entity) {
			var self = this;
			self.entities[self.entities.length] = entity;
			entity.onDestroy(function () {
				var index = self.entities.indexOf(entity);
				if (index > -1) {
					self.entities.splice(index, 1);
				}
			});
			return entity;
		};

		Physics.prototype.destroyAllEntities = function () {
			for (var i = 0, len = this.entities.length; i < len; i++) {
				if (this.entities[i]) {
					this.entities[i].destroy();
				}
			}
			this.entities = [];
		};

		Physics.prototype.update = function () {
			var i, j, len = this.entities.length;
			var compared = {};
			var quadTree = new QuadTree(1, {x: 0, y: 0, w: this.world.width, h: this.world.height});

			for (i = 0; i < len; i++) {
				this.entities[i].integrate();
				quadTree.insert(entityToQuadTreeObject(this.entities[i]));
			}
			for (i = 0; i < len; i++) {
				var entity = this.entities[i];
				if (!entity || entity.isDestroyed) {
					// Safety check, as entities may be destroyed/deleted by collision handlers.
					continue;
				}

				compared[entity._id] = {};

				if (entity.collidable === false) {
					continue;
				}
				var nearby = quadTree.retrieve(entityToQuadTreeObject(entity));
				var nlen = nearby.length;
				for (j = 0; j < nlen && !entity.isDestroyed; j++) {
					var nearbyEntity = nearby[j].e;
					var alreadyChecked = compared[nearbyEntity._id] && compared[nearbyEntity._id][entity._id];
					if (alreadyChecked || nearbyEntity.collidable === false || nearbyEntity === entity ||
						(nearbyEntity.isStatic && entity.isStatic)) {
						continue;
					}
					detectObjectCollision(entity, nearbyEntity, this.world);
					compared[entity._id][nearbyEntity._id] = true;
				}
			}
			for (i = 0; i < len; i++) {
				if (this.entities[i]) {
					this.entities[i].isRotated = false;
				}
			}
		};

		Physics.createEntity = function (category, bounds, orientation, object) {
			return new Entity(++entityUid, category, bounds, orientation, object);
		};

		Physics.createRectEntity = function (category, x, y, w, h, orientation, object) {
			return this.createEntity(category, new BoundingRect(new Vector(x, y), new Vector(w, h)), orientation, object);
		};

		Physics.createCircleEntity = function (category, x, y, r, object) {
			return this.createEntity(category, new BoundingCircle(new Vector(x, y), r), Orientation.NORTH, object);
		};

		return {
			Physics: Physics
		};
	});
