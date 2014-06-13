/* global describe, it, beforeEach, expect, Vector, BoundingRect, BoundingCircle */

(function () {
	'use strict';

	describe('Vector', function () {
		var v1;
		var v2;

		beforeEach(function () {
			v1 = new Vector(5, 20);
			v2 = new Vector(10, -2);
		});

		it('should calculate the vector\'s length', function () {
			expect(v1.length()).to.be.closeTo(20.615, 0.001);
			expect(v2.length()).to.be.closeTo(10.198, 0.001);
		});

		it('should convert to a unit vector', function () {
			var unit1 = v1.unit();
			expect(unit1.x).to.be.closeTo(0.243, 0.001);
			expect(unit1.y).to.be.closeTo(0.970, 0.001);

			var unit2 = v2.unit();
			expect(unit2.x).to.be.closeTo(0.980, 0.001);
			expect(unit2.y).to.be.closeTo(-0.196, 0.001);
		});

		it('should add two vectors', function () {
			var added = v1.add(v2);

			expect(added.x).to.equal(15);
			expect(added.y).to.equal(18);
		});

		it('should subtract two vectors', function () {
			var subtracted1 = v1.subtract(v2);
			expect(subtracted1.x).to.equal(-5);
			expect(subtracted1.y).to.equal(22);

			var subtracted2 = v2.subtract(v1);
			expect(subtracted2.x).to.equal(5);
			expect(subtracted2.y).to.equal(-22);
		});

		it('should multiply by a scalar', function () {
			var multiplied1 = v1.multiply(15);
			expect(multiplied1.x).to.equal(75);
			expect(multiplied1.y).to.equal(300);

			var multiplied2 = v2.multiply(-3);
			expect(multiplied2.x).to.equal(-30);
			expect(multiplied2.y).to.equal(6);
		});

		it('should calculate a dot product with another vector', function () {
			expect(v1.dotProduct(v2)).to.equal(10);
		});
	});

	describe('Bounding rect', function () {
		var rect;

		beforeEach(function () {
			rect = new BoundingRect(new Vector(5, 5), new Vector(5, 3));
		});

		it('should provide accessors for the rect\'s dimensions', function () {
			expect(rect.top()).to.equal(5);
			expect(rect.right()).to.equal(10);
			expect(rect.bottom()).to.equal(8);
			expect(rect.left()).to.equal(5);
			expect(rect.width()).to.equal(5);
			expect(rect.height()).to.equal(3);
			var center = rect.center();
			expect(center.x).to.equal(7.5);
			expect(center.y).to.equal(6.5);
		});

		it('should check whether a vector is contained in the rect', function () {
			expect(rect.contains(new Vector(6, 7))).to.equal(true);
			expect(rect.contains(new Vector(7, 2))).to.equal(false);
			expect(rect.contains(new Vector(11, 9))).to.equal(false);
		});

		it('should check whether another rect overlaps', function () {
			var overlapping = new BoundingRect(new Vector(2, 2), new Vector(6, 6));
			expect(rect.overlaps(overlapping)).to.equal(true);

			var nonOverlapping = new BoundingRect(new Vector(11, 2), new Vector(12, 6));
			expect(rect.overlaps(nonOverlapping)).to.equal(false);
		});

		it('should calculate the intersection of two rects', function () {
			var overlapping = new BoundingRect(new Vector(2, 2), new Vector(6, 5));
			var intersection = rect.intersection(overlapping);
			expect(intersection.left()).to.equal(5);
			expect(intersection.top()).to.equal(5);
			expect(intersection.width()).to.equal(3);
			expect(intersection.height()).to.equal(2);

			var nonOverlapping = new BoundingRect(new Vector(11, 2), new Vector(12, 6));
			var nonIntersection = rect.intersection(nonOverlapping);
			expect(nonIntersection).to.equal(null);
		});

		it('should calculate the intersection of a rect and a circle', function () {
			var overlapping = new BoundingCircle(new Vector(1, 7), 3);
			var intersection = rect.intersection(overlapping);
			expect(intersection.left()).to.equal(5);
			expect(intersection.top()).to.equal(7);
			expect(intersection.width()).to.equal(2);
			expect(intersection.height()).to.equal(1);

			var nonOverlapping = new BoundingCircle(new Vector(11, 2), 6);
			var nonIntersection = rect.intersection(nonOverlapping);
			expect(nonIntersection).to.equal(null);
		});

		it('should allow the position of the rect to be changed', function () {
			rect.move(new Vector(-4, 2));
			expect(rect.left()).to.equal(1);
			expect(rect.top()).to.equal(7);
			rect.move(new Vector(0, -1));
			expect(rect.left()).to.equal(1);
			expect(rect.top()).to.equal(6);
		});

		it('should allow the rect to be rotated around its center', function () {
			rect.rotate();
			expect(rect.left()).to.equal(6);
			expect(rect.top()).to.equal(4);
			expect(rect.width()).to.equal(3);
			expect(rect.height()).to.equal(5);
			rect.rotate();
			expect(rect.left()).to.equal(5);
			expect(rect.top()).to.equal(5);
			expect(rect.width()).to.equal(5);
			expect(rect.height()).to.equal(3);
		});

		it('should calculate the vector between the centers of two rects', function () {
			var distance = rect.distance(new BoundingRect(new Vector(7, 2), new Vector(2, 3)));
			expect(distance.x).to.equal(-0.5);
			expect(distance.y).to.equal(3);
		});

		it('should construct an instance using corner vectors', function () {
			var cornerRect = BoundingRect.fromCorners(new Vector(2, 3), new Vector(8, 10));
			expect(cornerRect.position.x).to.equal(2);
			expect(cornerRect.position.y).to.equal(3);
			expect(cornerRect.size.x).to.equal(6);
			expect(cornerRect.size.y).to.equal(7);

			var inverseCornerRect = BoundingRect.fromCorners(new Vector(2, 3), new Vector(-5, -6));
			expect(inverseCornerRect.position.x).to.equal(-5);
			expect(inverseCornerRect.position.y).to.equal(-6);
			expect(inverseCornerRect.size.x).to.equal(7);
			expect(inverseCornerRect.size.y).to.equal(9);
		});
	});

	describe('Bounding circle', function () {
		var circle;

		beforeEach(function () {
			circle = new BoundingCircle(new Vector(1, 2), 3);
		});

		it('should provide accessors for circle dimensions', function () {
			expect(circle.left()).to.equal(1);
			expect(circle.top()).to.equal(2);
			expect(circle.right()).to.equal(7);
			expect(circle.bottom()).to.equal(8);
			expect(circle.radius()).to.equal(3);
			expect(circle.diameter()).to.equal(6);
			expect(circle.width()).to.equal(6);
			expect(circle.height()).to.equal(6);
		});

		it('should calculate the intersection with another circle', function () {
			var overlapping = new BoundingCircle(new Vector(5, 4), 3);
			var intersectionRect = circle.intersection(overlapping);
			expect(intersectionRect.left()).to.equal(5);
			expect(intersectionRect.top()).to.equal(4);
			expect(intersectionRect.width()).to.equal(2);
			expect(intersectionRect.height()).to.equal(4);

			var nonOverlapping = new BoundingCircle(new Vector(9, 1), 3);
			expect(circle.intersection(nonOverlapping)).to.equal(null);
		});

		it('should calculate the intersection with a rectangle (corner)', function () {
			var cornerOverlap = new BoundingRect(new Vector(6, 6), new Vector(2, 2));
			var cornerIntersectionRect = circle.intersection(cornerOverlap);
			expect(cornerIntersectionRect.left()).to.equal(6);
			expect(cornerIntersectionRect.top()).to.equal(6);
			expect(cornerIntersectionRect.width()).to.equal(1);
			expect(cornerIntersectionRect.height()).to.equal(2);
		});

		it('should calculate the intersection with a rectangle (side)', function () {
			var sideOverlap = new BoundingRect(new Vector(-1, 2), new Vector(3, 6));
			var sideIntersectionRect = circle.intersection(sideOverlap);
			expect(sideIntersectionRect.left()).to.equal(1);
			expect(sideIntersectionRect.top()).to.equal(2);
			expect(sideIntersectionRect.width()).to.equal(1);
			expect(sideIntersectionRect.height()).to.equal(6);
		});

		it('should calculate the intersection with a rectangle (no overlap)', function () {
			var noOverlap = new BoundingRect(new Vector(7, 7), new Vector(2, 2));
			expect(circle.intersection(noOverlap)).to.equal(null);
		});

		it('should allow the position of the circle to be changed', function () {
			circle.move(new Vector(-4, 2));
			expect(circle.left()).to.equal(-3);
			expect(circle.top()).to.equal(4);
			circle.move(new Vector(0, -1));
			expect(circle.left()).to.equal(-3);
			expect(circle.top()).to.equal(3);
		});
	});
})();
