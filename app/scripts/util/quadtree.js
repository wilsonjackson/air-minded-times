(function () {
	'use strict';

	var MAX_OBJECTS = 10;
	var MAX_LEVELS = 5;

	function bounds(x, y, w, h) {
		return {x: x, y: y, w: w, h: h};
	}

	function QuadTree(level, bounds) {
		this.level = level;
		this.bounds = bounds;
		this.objects = [];
		this.nodes = [];
	}

	QuadTree.prototype.clear = function () {
		this.objects = [];
		if (this.nodes.length) {
			for (var i = 0, len = this.nodes.length; i < len; i++) {
				this.nodes[i].clear();
			}
			this.nodes = [];
		}
	};

	QuadTree.prototype.insert = function (object) {
		var index;
		if (this.nodes.length) {
			index = this._getIndex(object);
			if (index !== -1) {
				this.nodes[index].insert(object);
				return;
			}
		}

		this.objects.push(object);

		if (this.objects.length === MAX_OBJECTS && this.nodes.length === 0 && this.level < MAX_LEVELS) {
			this._split();
			for (var i = 0, len = this.objects.length; i < len; i++) {
				index = this._getIndex(this.objects[i]);
				if (index !== -1) {
					this.nodes[index].insert(this.objects.splice(i--, 1)[0]);
					--len;
				}
			}
		}
	};

	QuadTree.prototype.retrieve = function (object) {
		var objects = [];
		if (this.nodes.length) {
			var index = this._getIndex(object);
			if (index !== -1) {
				objects = this.nodes[index].retrieve(object);
			}
		}

		return this.objects.concat(objects);
	};

	QuadTree.prototype._getIndex = function (object) {
		var index = -1;

		var vMid = this.bounds.x + this.bounds.w / 2;
		var hMid = this.bounds.y + this.bounds.h / 2;

		var isNorth = object.y + object.h < hMid;
		var isSouth = object.y >= hMid;

		// isWest
		if (object.x + object.w < vMid) {
			if (isNorth) {
				index = 1;
			}
			else if (isSouth) {
				index = 2;
			}
		}
		// isEast
		else if (object.x >= vMid) {
			if (isNorth) {
				index = 0;
			}
			else if (isSouth) {
				index = 3;
			}
		}

		return index;
	};

	QuadTree.prototype._split = function () {
		var halfW = parseInt(this.bounds.w / 2, 10);
		var halfH = parseInt(this.bounds.h / 2, 10);
		var x = this.bounds.x;
		var y = this.bounds.y;

		this.nodes[0] = new QuadTree(this.level + 1, bounds(x + halfW, y, halfW, halfH));
		this.nodes[1] = new QuadTree(this.level + 1, bounds(x, y, halfW, halfH));
		this.nodes[2] = new QuadTree(this.level + 1, bounds(x, y + halfH, halfW, halfH));
		this.nodes[3] = new QuadTree(this.level + 1, bounds(x + halfW, y + halfH, halfW, halfH));
	};

	QuadTree.prototype.toString = function () {
		function toString(o) {
			return o ? o.toString() : 'NULL';
		}

		return 'QuadTree{' + this.objects.map(toString).join(',') + '}[' + this.nodes.map(toString).join(',') + ']';
	};

	window.QuadTree = QuadTree;
})();
