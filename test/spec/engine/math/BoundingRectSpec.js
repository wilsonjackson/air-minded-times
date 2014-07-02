describe('Bounding rect', function () {
	'use strict';

	var BoundingCircle;
	var BoundingRect;
	var Vector;
	var rect;

	beforeEach(Engine.load(
		['math.BoundingCircle', 'math.BoundingRect', 'math.Vector'],
		function (_BoundingCircle_, _BoundingRect_, _Vector_) {
			BoundingCircle = _BoundingCircle_;
			BoundingRect = _BoundingRect_;
			Vector = _Vector_;
			rect = new BoundingRect(new Vector(5, 5), new Vector(5, 3));
		}));

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
