(function (Game, Vector, BoundingRect) {
	'use strict';

	var AXIS_X = 'x';
	var AXIS_Y = 'y';

	function MapGrid(width, tileSize) {
		this.width = width;
		this.tileSize = tileSize;
		this.nodes = [];
		this.walls = [];
	}

	MapGrid.prototype.load = function (terrain) {
		for (var i = 0, len = terrain.length; i < len; i++) {
			if (!terrain[i].impassable) {
				var position = this.toVector(i);
				var neighbors = [];
				if (position.y !== 0) {
					neighbors.push(this.toIndex(position.subtract(new Vector(0, 1))));
				}
				if (position.x !== this.width - 1) {
					neighbors.push(this.toIndex(position.add(new Vector(1, 0))));
				}
				if (position.y !== Math.floor(terrain.length / this.width) - 1) {
					neighbors.push(this.toIndex(position.add(new Vector(0, 1))));
				}
				if (position.x !== 0) {
					neighbors.push(this.toIndex(position.subtract(new Vector(1, 0))));
				}
				for (var j = 0, jlen = neighbors.length; j < jlen; j++) {
					if (terrain[neighbors[j]].impassable) {
						this.createNode(neighbors[j]);
					}
				}
			}
		}
	};

	MapGrid.prototype.createNode = function (index) {
		if (!this.nodes[index]) {
			this.nodes[index] = new Node(this.toVector(index), this);
		}
	};

	MapGrid.prototype.createWall = function (axis) {
		return (this.walls[this.walls.length] = new Wall(axis));
	};
	
	MapGrid.prototype.mergeWalls = function (wall1, wall2) {
		while (wall2.nodes.length > 0) {
			wall2.nodes[0].setWall(wall1);
		}
		this.walls.splice(this.walls.indexOf(wall2), 1);
	};

	MapGrid.prototype.getNodeAt = function (vector) {
		return this.nodes[this.toIndex(vector)];
	};

	MapGrid.prototype.calculateBoundaries = function () {
		var i, len;
		var keys = Object.keys(this.nodes);
		for (i = 0, len = keys.length; i < len; i++) {
			this.nodes[keys[i]].pickWall();
		}

		var boundingRects = [];
		for (i = 0, len = this.walls.length; i < len; i++) {
			if (this.walls[i].nodes.length > 0) {
				boundingRects.push(this.walls[i].createBoundingRect(this.tileSize));
			}
		}
		return boundingRects;
	};

	MapGrid.prototype.toVector = function (i) {
		return new Vector(i % this.width, Math.floor(i / this.width));
	};

	MapGrid.prototype.toIndex = function (vector) {
		return vector.y * this.width + vector.x;
	};

	MapGrid.prototype.toString = function () {
		return 'Grid(walls=[' + this.walls.map(function (o) {
			return o.toString();
		}).join(', ') + '])';
	};

	function Node(position, grid) {
		// check top node, then left node for existing wall and add
		// if either is missing, initialize new wall(s)
		this.position = position;
		this.grid = grid;
		this.walls = {};

		var above = grid.getNodeAt(position.subtract(new Vector(0, 1)));
		this.walls[AXIS_Y] = above ? above.getWall(AXIS_Y) : grid.createWall(AXIS_Y);
		this.walls[AXIS_Y].addNode(this);

		var left = grid.getNodeAt(position.subtract(new Vector(1, 0)));
		this.walls[AXIS_X] = left ? left.getWall(AXIS_X) : grid.createWall(AXIS_X);
		this.walls[AXIS_X].addNode(this);

		var right = grid.getNodeAt(position.add(new Vector(1, 0)));
		if (right) {
			this.grid.mergeWalls(this.walls[AXIS_X], right.getWall(AXIS_X));
		}
		var bottom = grid.getNodeAt(position.add(new Vector(0, 1)));
		if (bottom) {
			this.grid.mergeWalls(this.walls[AXIS_Y], bottom.getWall(AXIS_Y));
		}
	}

	Node.prototype.getWall = function (axis) {
		return this.walls[axis];
	};

	Node.prototype.setWall = function (wall) {
		this.walls[wall.axis].removeNode(this);
		this.walls[wall.axis] = wall;
		wall.addNode(this);
	};

	Node.prototype.removeFromWall = function (axis) {
		this.walls[axis].removeNode(this);
		delete this.walls[axis];
	};

	Node.prototype.pickWall = function () {
		if (this.walls[AXIS_Y].isMiddleNode(this)) {
			this.removeFromWall(AXIS_X);
			return;
		}
		if (this.walls[AXIS_X].isMiddleNode(this)) {
			this.removeFromWall(AXIS_Y);
			return;
		}
		if (this.walls[AXIS_Y].nodes.length > this.walls[AXIS_X].nodes.length) {
			this.removeFromWall(AXIS_X);
		}
		else {
			this.removeFromWall(AXIS_Y);
		}
	};

	Node.prototype.toString = function () {
		return 'Node(position=' + this.position + ')';
	};

	function Wall(axis) {
		this.axis = axis;
		this.nodes = [];
	}

	Wall.prototype.addNode = function (node) {
		this.nodes[this.nodes.length] = node;
	};

	Wall.prototype.removeNode = function (node) {
		var i = this.nodes.indexOf(node);
		this.nodes.splice(i, 1);
	};

	Wall.prototype.isMiddleNode = function (node) {
		var i = this.nodes.indexOf(node);
		return i !== 0 && i !== this.nodes.length - 1;
	};

	Wall.prototype.createBoundingRect = function (tileSize) {
		var size = new Vector(
			this.axis === AXIS_X ? this.nodes.length : 1,
			this.axis === AXIS_Y ? this.nodes.length : 1);
		return new BoundingRect(this.nodes[0].position.multiply(tileSize), size.multiply(tileSize));
	};

	Wall.prototype.toString = function () {
		var start = this.nodes.length > 0 ? this.nodes[0].position : null;
		return 'Wall(axis=' + this.axis + ', length=' + this.nodes.length + ', start=' + start + ')';
	};

	Game.map = {
		MapGrid: MapGrid
	};
})(Game, Vector, BoundingRect);
