Engine.module('world.map.Node',
	[
		'math.Vector'
	],
	function (Vector) {
		'use strict';

		var AXIS_X = 'x';
		var AXIS_Y = 'y';

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

		Node.AXIS_X = AXIS_X;
		Node.AXIS_Y = AXIS_Y;

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

		return Node;
	});
