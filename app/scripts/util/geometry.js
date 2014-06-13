(function () {
	'use strict';

	function Vector(x, y) {
		this.x = x;
		this.y = y;
	}

	Vector.prototype.length = function () {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	};

	Vector.prototype.unit = function () {
		var l = this.length();
		return new Vector(this.x / l, this.y / l);
	};

	Vector.prototype.add = function (vector) {
		return new Vector(this.x + vector.x, this.y + vector.y);
	};

	Vector.prototype.subtract = function (vector) {
		return new Vector(this.x - vector.x, this.y - vector.y);
	};

	Vector.prototype.multiply = function (scalar) {
		return new Vector(this.x * scalar, this.y * scalar);
	};

	Vector.prototype.dotProduct = function (vector) {
		return this.x * vector.x + this.y * vector.y;
	};

	Vector.prototype.toString = function () {
		return 'Vector(' + this.x + ', ' + this.y + ')';
	};

	function BoundingRect(position, size) {
		this.position = position;
		this.size = size;
	}

	BoundingRect.prototype.top = function () {
		return this.position.y;
	};

	BoundingRect.prototype.right = function () {
		return this.position.x + this.size.x;
	};

	BoundingRect.prototype.bottom = function () {
		return this.position.y + this.size.y;
	};

	BoundingRect.prototype.left = function () {
		return this.position.x;
	};

	BoundingRect.prototype.width = function () {
		return this.size.x;
	};

	BoundingRect.prototype.height = function () {
		return this.size.y;
	};

	BoundingRect.prototype.center = function () {
		return this.position.add(new Vector(this.size.x / 2, this.size.y / 2));
	};

	BoundingRect.prototype.contains = function (vector) {
		return !(this.position.x > vector.x || this.position.x + this.size.x < vector.x ||
			this.position.y > vector.y || this.position.y + this.size.y < vector.y);
	};

	BoundingRect.prototype.overlaps = function (boundingRect) {
		var combinedRect = BoundingRect.fromCorners(
			new Vector(Math.min(this.left(), boundingRect.left()), Math.min(this.top(), boundingRect.top())),
			new Vector(Math.max(this.right(), boundingRect.right()), Math.max(this.bottom(), boundingRect.bottom())));

		return combinedRect.width() < this.width() + boundingRect.width() &&
			combinedRect.height() < this.height() + boundingRect.height();
	};

	BoundingRect.prototype.intersection = function (bounds) {
		if (bounds instanceof BoundingRect) {
			var maxLeft = Math.max(this.left(), bounds.left());
			var maxTop = Math.max(this.top(), bounds.top());
			var minBottom = Math.min(this.bottom(), bounds.bottom());
			var minRight = Math.min(this.right(), bounds.right());
			if (maxLeft < minRight && maxTop < minBottom) {
				return BoundingRect.fromCorners(new Vector(maxLeft, maxTop), new Vector(minRight, minBottom));
			}
		}
		else if (bounds instanceof BoundingCircle) {
			if (rectCircleIntersection(this, bounds)) {
				return this.intersection(bounds.asRect());
			}
		}
		return null;
	};

	BoundingRect.prototype.distance = function (boundingRect) {
		return this.center().subtract(boundingRect.center());
	};

	BoundingRect.prototype.move = function (vector) {
		this.position = this.position.add(vector);
	};

	BoundingRect.prototype.rotate = function () {
		var halfX = Math.round(this.size.x / 2);
		var halfY = Math.round(this.size.y / 2);

		//noinspection JSSuspiciousNameCombination
		this.size = new Vector(this.size.y, this.size.x);
		this.position = new Vector(this.position.x + halfX - halfY, this.position.y + halfY - halfX);
	};

	BoundingRect.prototype.toString = function () {
		return 'BoundingRect(position=' + this.position + ', size=' + this.size + ')';
	};

	BoundingRect.fromCorners = function (corner1, corner2) {
		var x = Math.min(corner1.x, corner2.x);
		var y = Math.min(corner1.y, corner2.y);
		var w = Math.max(corner1.x, corner2.x) - x;
		var h = Math.max(corner1.y, corner2.y) - y;
		return new BoundingRect(new Vector(x, y), new Vector(w, h));
	};

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
			if (rectCircleIntersection(bounds, this)) {
				return this.asRect().intersection(bounds);
			}
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

	function rectCircleIntersection(rect, circle) {
		var distance = circle.center().subtract(rect.center());
		var absDistance = new Vector(Math.abs(distance.x), Math.abs(distance.y));
		var halfRectWidth = rect.width() / 2;
		var halfRectHeight = rect.height() / 2;
		var radius = circle.radius();

		// Distance is greater than rect bounds + circle radius
		if (absDistance.x > halfRectWidth + radius || absDistance.y > halfRectHeight + radius) {
			return false;
		}

		// Circle center is within rectangle
		if (absDistance.x <= halfRectWidth || absDistance.y <= halfRectHeight) {
			return true;
		}

		// Literal corner case
		return Math.pow(absDistance.x - halfRectWidth, 2) + Math.pow(absDistance.y - halfRectHeight, 2) <= Math.pow(radius, 2);
	}

	window.Vector = Vector;
	window.BoundingRect = BoundingRect;
	window.BoundingCircle = BoundingCircle;
})();
