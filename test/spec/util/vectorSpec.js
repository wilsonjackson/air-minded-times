/* global describe, it, beforeEach, expect, Vector, BoundingBox */

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

	describe('Bounding box', function () {
		var v1;
		var v2;
		var box;

		beforeEach(function () {
			v1 = new Vector(5, 5);
			v2 = new Vector(10, 8);
			box = new BoundingBox(v1, v2);
		});

		it('should return min and max x and y values', function () {
			expect(box.minX()).to.equal(5);
			expect(box.maxX()).to.equal(10);
			expect(box.minY()).to.equal(5);
			expect(box.maxY()).to.equal(8);
		});

		it('should check whether a vector is contained in the box', function () {
			expect(box.contains(new Vector(6, 7))).to.equal(true);
			expect(box.contains(new Vector(7, 2))).to.equal(false);
			expect(box.contains(new Vector(11, 9))).to.equal(false);
		});

		it('should check whether another box overlaps', function () {
			var overlapping = new BoundingBox(new Vector(2, 2), new Vector(6, 6));
			expect(box.overlaps(overlapping)).to.equal(true);

			var nonOverlapping = new BoundingBox(new Vector(11, 2), new Vector(12, 6));
			expect(box.overlaps(nonOverlapping)).to.equal(false);
		});

		it('should create a bounding box from coordinates plus width and height', function () {
			var whBox = BoundingBox.create(1, 2, 30, 15);
			expect(whBox.vector1.x).to.equal(1);
			expect(whBox.vector1.y).to.equal(2);
			expect(whBox.vector2.x).to.equal(31);
			expect(whBox.vector2.y).to.equal(17);
		});
	});
})();
