describe('Bounding circle', function () {
	'use strict';

	var BoundingCircle;
	var BoundingRect;
	var Vector;
	var circle;

	beforeEach(Engine.load(
		['math.BoundingCircle', 'math.BoundingRect', 'math.Vector'],
		function (_BoundingCircle_, _BoundingRect_, _Vector_) {
			BoundingCircle = _BoundingCircle_;
			BoundingRect = _BoundingRect_;
			Vector = _Vector_;
			circle = new BoundingCircle(new Vector(1, 2), 3);
		}));

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
