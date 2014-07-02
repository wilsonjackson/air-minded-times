Engine.module('math.Intersection',
	[
		'math.Vector'
	],
	function (Vector) {
		'use strict';

		//noinspection UnnecessaryLocalVariableJS
		var Intersection = {
			doRectAndCircleIntersect: function (rect, circle) {
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
		};

		return Intersection;
	});
