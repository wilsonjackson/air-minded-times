Engine.module('world.map.Wall',
	[
		'math.Vector',
		'math.BoundingRect',
		'world.map.Node'
	],
	function (Vector, BoundingRect, Node) {
		'use strict';

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
					this.axis === Node.AXIS_X ? this.nodes.length : 1,
					this.axis === Node.AXIS_Y ? this.nodes.length : 1);
			return new BoundingRect(this.nodes[0].position.multiply(tileSize), size.multiply(tileSize));
		};

		Wall.prototype.toString = function () {
			var start = this.nodes.length > 0 ? this.nodes[0].position : null;
			return 'Wall(axis=' + this.axis + ', length=' + this.nodes.length + ', start=' + start + ')';
		};

		return Wall;
	});
