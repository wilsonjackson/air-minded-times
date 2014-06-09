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

	function BoundingBox(cornerVector1, cornerVector2) {
		this.vector1 = cornerVector1;
		this.vector2 = cornerVector2;
	}

	BoundingBox.prototype.minX = function () {
		return Math.min(this.vector1.x, this.vector2.x);
	};

	BoundingBox.prototype.maxX = function () {
		return Math.max(this.vector1.x, this.vector2.x);
	};

	BoundingBox.prototype.minY = function () {
		return Math.min(this.vector1.y, this.vector2.y);
	};

	BoundingBox.prototype.maxY = function () {
		return Math.max(this.vector1.y, this.vector2.y);
	};

	BoundingBox.prototype.contains = function (vector) {
		return !(this.minX() > vector.x || this.maxX() < vector.x ||
			this.minY() > vector.y || this.maxY() < vector.y);
	};

	BoundingBox.prototype.overlaps = function (boundingBox) {
		var vector3 = new Vector(this.vector1.x, this.vector2.y);
		var vector4 = new Vector(this.vector2.x, this.vector1.y);
		return (boundingBox.contains(this.vector1) || boundingBox.contains(this.vector2) ||
			boundingBox.contains(vector3) || boundingBox.contains(vector4));
	};

	BoundingBox.create = function (x, y, w, h) {
		return new BoundingBox(new Vector(x, y), new Vector(x + w, y + h));
	};

	window.Vector = Vector;
	window.BoundingBox = BoundingBox;
})();
