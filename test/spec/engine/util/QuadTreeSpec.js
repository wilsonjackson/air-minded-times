describe('QuadTree', function () {
	'use strict';

	var tree;
	var nwObject;
	var neObject;
	var seObject;
	var oddObject;

	beforeEach(Engine.load(
		['util.QuadTree'],
		function (QuadTree) {
			tree = new QuadTree(1, {x: 0, y: 0, w: 100, h: 100});
			nwObject = {x: 10, y: 10, w: 10, h: 10};
			neObject = {x: 60, y: 10, w: 10, h: 10};
			seObject = {x: 80, y: 80, w: 10, h: 10};
			oddObject = {x: 45, y: 10, w: 10, h: 10};
		}));

	describe('indexing', function () {
		it('should insert an object', function () {
			tree.insert(nwObject);
			expect(tree.objects).to.have.members([nwObject]);
		});

		it('should split into sub-nodes when full of objects', function () {
			for (var i = 0; i < 10; i++) {
				tree.insert(nwObject);
			}

			expect(tree.nodes).to.have.length(4);
		});

		it('should add objects to the node that contains them', function () {
			// nw quadrant
			for (var i = 0; i < 9; i++) {
				tree.insert(nwObject);
			}
			// se quadrant
			tree.insert(seObject);

			// nw quadrant
			expect(tree.nodes[1].objects).to.include.members([nwObject]);
			// se quadrant
			expect(tree.nodes[3].objects).to.have.members([seObject]);
		});

		it('should add objects not fully in any sub-node to the parent node', function () {
			for (var i = 0; i < 10; i++) {
				tree.insert(nwObject);
			}
			tree.insert(oddObject);

			expect(tree.objects).to.have.members([oddObject]);
		});

		it('should clear all objects and nodes', function () {
			for (var i = 0; i < 10; i++) {
				tree.insert(nwObject);
			}
			tree.clear();

			expect(tree.nodes).to.have.length(0);
			expect(tree.objects).to.have.length(0);
		});

		it('should add an object right on the edge of a node to that node', function () {
			for (var i = 0; i < 10; i++) {
				tree.insert(nwObject);
			}
			// Upper-left corner of NE quadrant
			var cornerObject = {x: 50, y: 0, w: 10, h: 10};
			tree.insert(cornerObject);

			expect(tree.nodes[0].objects).to.have.members([cornerObject]);
		});

		it('should only split the quadtree once', function () {
			var i;
			for (i = 0; i < 10; i++) {
				tree.insert(nwObject);
			}
			var splitNodes = tree.nodes.concat([]);

			for (i = 0; i < 10; i++) {
				tree.insert(oddObject);
			}

			expect(tree.nodes[0]).to.equal(splitNodes[0]);
			expect(tree.nodes[1]).to.equal(splitNodes[1]);
			expect(tree.nodes[2]).to.equal(splitNodes[2]);
			expect(tree.nodes[3]).to.equal(splitNodes[3]);
		});
	});

	describe('retrieval', function () {
		it('should retrieve both sub-node and parent-node objects for regions fully in a sub-node', function () {
			tree._split();
			tree.insert(nwObject);
			tree.insert(neObject);
			tree.insert(oddObject);

			// retrieve from ne
			var matches = tree.retrieve({x: 75, y: 20, w: 10, h: 10});

			expect(matches).to.have.members([neObject, oddObject]);
		});

		it('should retrieve only parent-contained objects for regions not fully within a sub-node', function () {
			tree._split();
			tree.insert(nwObject);
			tree.insert(oddObject);

			var matches = tree.retrieve({x: 10, y: 49, w: 10, h: 10});

			expect(matches).to.have.members([oddObject]);
		});
	});
});
