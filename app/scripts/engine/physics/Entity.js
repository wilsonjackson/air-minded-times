Engine.module('physics.Entity', function () {
	'use strict';

	function isFunction(o) {
		return !!(o && o.constructor && o.call && o.apply);
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

		this.isDestroyed = false;
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

	Entity.prototype.getCenter = function () {
		return this.bounds.center();
	};

	Entity.prototype.integrate = function () {
		this.bounds.move(this.nextMovement);
		this.currentMovement = this.nextMovement;
		this.nextMovement = new Vector(0, 0);
		this.isColliding = false;
	};

	Entity.prototype.solveCollision = function (collision, world) {
		for (var i = 0, len = this.collisionListeners.length; i < len; i++) {
			var adjustment = this.collisionListeners[i].solveCollision(collision, world);
			if (adjustment) {
				return adjustment;
			}
		}
	};

	Entity.prototype.collide = function (collision, world) {
		for (var i = 0, len = this.collisionListeners.length; i < len; i++) {
			this.collisionListeners[i].collide(collision, world);
			this.isColliding = true;
		}
	};

	Entity.prototype.destroy = function () {
		this.isDestroyed = true;
		this.events.trigger('destroy', this);
		delete this.events;
		delete this.object;
		delete this.bounds;
		delete this.nextMovement;
		delete this.currentMovement;
		this.collisionListeners = [];
	};

	Entity.prototype.toString = function () {
		return 'Entity(id=' + this._id + ', category=' + this.category + ')';
	};

	return {
		Entity: Entity
	};
});
