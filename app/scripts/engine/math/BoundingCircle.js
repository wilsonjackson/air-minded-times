Engine.module('math.BoundingCircle',
	[
		'math.Vector',
		'math.BoundingRect',
		'math.Intersection'
	],
	function (Vector, BoundingRect, Intersection) {
		'use strict';

		function BoundingCircle(position, radius) {
			this.position = position;
			this.r = radius;
		}

		BoundingCircle.prototype.top = function () {
			return this.position.y;
		};

		BoundingCircle.prototype.right = function () {
			return this.position.x + this.r * 2;
		};

		BoundingCircle.prototype.bottom = function () {
			return this.position.y + this.r * 2;
		};

		BoundingCircle.prototype.left = function () {
			return this.position.x;
		};

		BoundingCircle.prototype.width = function () {
			return this.r * 2;
		};

		BoundingCircle.prototype.height = function () {
			return this.r * 2;
		};

		BoundingCircle.prototype.radius = function () {
			return this.r;
		};

		BoundingCircle.prototype.diameter = function () {
			return this.r * 2;
		};

		BoundingCircle.prototype.center = function () {
			return this.position.add(new Vector(this.r, this.r));
		};

		BoundingCircle.prototype.intersection = function (bounds) {
			if (bounds instanceof BoundingCircle) {
				var difference = this.center().subtract(bounds.center());
				if (difference.length() <= this.radius() + bounds.radius()) {
					return this.asRect().intersection(bounds.asRect());
				}
			}
			else if (bounds instanceof BoundingRect) {
				return this.intersectionWithRect(bounds);
			}
			return null;
		};

		BoundingCircle.prototype.intersectionWithRect = function (rect) {
			if (Intersection.doRectAndCircleIntersect(rect, this)) {
				return this.asRect().intersection(rect);
			}
			return null;
		};

		BoundingCircle.prototype.move = function (vector) {
			this.position = this.position.add(vector);
		};

		BoundingCircle.prototype.rotate = function () {
			// A circle doesn't change when it rotates. Easy!
		};

		BoundingCircle.prototype.toString = function () {
			return 'BoundingCircle(position=' + this.position + ', radius=' + this.r + ')';
		};

		BoundingCircle.prototype.asRect = function () {
			return new BoundingRect(this.position.add(new Vector(0, 0)), new Vector(this.r * 2, this.r * 2));
		};

		return BoundingCircle;
	});
