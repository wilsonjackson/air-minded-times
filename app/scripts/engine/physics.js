/* globals QuadTree, ObjectTypeRepository */

(function () {
	'use strict';

	var Physics = (function () {
		var edgeType;
		var world;
		var quadTree;

		function isFunction(o) {
			return !!(o && o.constructor && o.call && o.apply);
		}

		function detectEdgeCollision(object) {
			var offsetX = 0;
			var offsetY = 0;
			if (object.entity.x < 0) {
				offsetX = -1;
			}
			else if (object.entity.x + object.entity.w > world.width) {
				offsetX = 1;
			}
			if (object.entity.y < 0) {
				offsetY = -1;
			}
			else if (object.entity.y + object.entity.h > world.height) {
				offsetY = 1;
			}
			if (offsetX !== 0 || offsetY !== 0) {
				object.entity.addCollision(
					new Collision({type: ObjectTypeRepository.EDGE, world: world}, offsetX, offsetY));
			}
		}

		function detectObjectCollision(objectA, objectB) {
			var collidableA = objectA.entity.collidable;
			var collidableB = objectB.entity.collidable;
			if ((collidableA === true && collidableB === true) ||
				(isFunction(objectA.entity.collidable) && objectA.entity.collidable(objectB)) ||
				(isFunction(objectB.entity.collidable) && objectB.entity.collidable(objectA))) {

				// Collision! Detection!
				var aR = objectA.entity.w / 2;
				var bR = objectB.entity.h / 2;

				// Center vector of A
				var aX = objectA.entity.x + aR;
				var aY = objectA.entity.y + aR;

				// Center vector of B
				var bX = objectB.entity.x + bR;
				var bY = objectB.entity.y + bR;

				var xDifference = aX - bX;
				var yDifference = aY - bY;

				if (Math.sqrt(Math.pow(xDifference, 2) + Math.pow(yDifference, 2)) <= aR + bR) {
					objectA.entity.addCollision(new Collision(objectB, -xDifference, -yDifference));
					objectB.entity.addCollision(new Collision(objectA, xDifference, yDifference));
				}
			}
		}

		return {
			init: function (_world) {
				world = _world;
				quadTree = new QuadTree(1, {x: 0, y: 0, w: world.width, h: world.height});
			},

			newEntity: function (x, y, w, h, speed, accel) {
				return new Entity(x, y, w, h, speed, accel);
			},

			update: function () {
				quadTree.clear();
				var i, j, len = world.objects.length;
				for (i = 0; i < len; i++) {
					world.objects[i].entity.clearCollisions();
					quadTree.insert(world.objects[i]);
				}
				for (i = 0; i < len; i++) {
					var object = world.objects[i];
					if (object.collidable === false) {
						continue;
					}
					detectEdgeCollision(object);
					var nearby = quadTree.retrieve(object);
					var nlen = nearby.length;
					for (j = 0; j < nlen; j++) {
						if (nearby[j].collidable === false || nearby[j] === object) {
							continue;
						}
						detectObjectCollision(object, nearby[j]);
					}
				}
			}
		};
	})();

	function Entity(x, y, w, h, speed, accel) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.speed = speed || 1;
		this.accel = accel || 1;
		this.velocity = 0;
		this.collidable = true;
		this.collisions = [];
		this.collisionHandlers = [];
	}

	Entity.prototype.moveX = function (direction) {
		if (this.velocity < this.speed) {
			this.velocity = Math.min(this.velocity + this.accel, this.speed);
		}
		this.x += this.velocity * direction;
	};

	Entity.prototype.moveY = function (direction) {
		if (this.velocity < this.speed) {
			this.velocity = Math.min(this.velocity + this.accel, this.speed);
		}
		this.y += this.velocity * direction;
	};

	Entity.prototype.stop = function () {
		this.velocity = 0;
	};

	Entity.prototype.addCollision = function (collision) {
		// Don't add collisions already added by the inverse check
		for (var i = 0, len = this.collisions.length; i < len; i++) {
			if (this.collisions[i].object === collision.object) {
				return;
			}
		}
		this.collisions.push(collision);
	};

	Entity.prototype.clearCollisions = function () {
		this.collisions = [];
	};

	Entity.prototype.onCollision = function (type, fn) {
		this.collisionHandlers[this.collisionHandlers.length] = [type, fn];
	};

	Entity.prototype.update = function () {
		var i, j, ilen, jlen;
		for (i = 0, ilen = this.collisions.length; i < ilen; i++) {
			for (j = 0, jlen = this.collisionHandlers.length; j < jlen; j++) {
				if (this.collisionHandlers[j][0].isA(this.collisions[i].object.type)) {
					this.collisionHandlers[j][1](this.collisions[i]);
				}
			}
		}
	};

	function Collision(object, offsetX, offsetY) {
		this.object = object;
		this.offsetX = offsetX;
		this.offsetY = offsetY;
	}

	window.Physics = Physics;
})();
