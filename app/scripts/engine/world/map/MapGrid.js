Engine.module('world.map.MapGrid',
	[
		'world.map.Node',
		'world.map.Wall'
	],
	function (Node, Wall) {
		'use strict';

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

		return MapGrid;
	});
