Engine.module('math.BoundingRect',
	[
		'math.Vector'
	],
	function (Vector) {
		'use strict';

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
				return null;
			}
			else if (bounds && bounds.intersectionWithRect) {
				return bounds.intersectionWithRect(this);
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

		return BoundingRect;
	});
