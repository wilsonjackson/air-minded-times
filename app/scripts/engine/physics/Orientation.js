Engine.module('physics.Orientation', function () {
	'use strict';

	// Rotation in radians
	var RADIANS_N = 0;
	var RADIANS_E = 90 * (Math.PI / 180);
	var RADIANS_S = 180 * (Math.PI / 180);
	var RADIANS_W = 270 * (Math.PI / 180);

	function Orientation(radians) {
		this.radians = radians;
	}

	Orientation.prototype.asRadians = function () {
		return this.radians;
	};

	//noinspection JSUnusedGlobalSymbols
	Orientation.prototype.isXAxis = function () {
		return this.radians % Math.PI !== 0;
	};

	//noinspection JSUnusedGlobalSymbols
	Orientation.prototype.isYAxis = function () {
		return this.radians % Math.PI === 0;
	};

	Orientation.prototype.translateXY = function (x, y) {
		if (this.radians === RADIANS_W || this.radians === RADIANS_E) {
			//noinspection JSSuspiciousNameCombination
			return {x: y, y: x};
		}
		else {
			return {x: x, y: y};
		}
	};

	//noinspection JSUnusedGlobalSymbols
	Orientation.prototype.translateNESW = function (north, east, south, west) {
		switch (this.radians) {
			case RADIANS_N:
				return {n: north, e: east, s: south, w: west};
			case RADIANS_E:
				return {n: east, e: south, s: west, w: north};
			case RADIANS_S:
				return {n: south, e: west, s: north, w: east};
			case RADIANS_W:
				return {n: west, e: north, s: east, w: south};
		}
	};

	Orientation.prototype.toString = function () {
		return 'Orientation(radians=' + this.radians + ')';
	};

	Orientation.NORTH = new Orientation(RADIANS_N);
	Orientation.EAST = new Orientation(RADIANS_E);
	Orientation.SOUTH = new Orientation(RADIANS_S);
	Orientation.WEST = new Orientation(RADIANS_W);

	return Orientation;
});
