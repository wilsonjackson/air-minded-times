Engine.module('graphics.HudScene',
	[
		'math.Vector',
		'graphics.Scene'
	],
	function (Vector, Scene) {
		'use strict';

		function HudScene() {
			this.components = [];
		}

		HudScene.TOP_LEFT = new Vector(-1, -1);
		HudScene.TOP_CENTER = new Vector(0, -1);
		HudScene.TOP_RIGHT = new Vector(1, -1);
		HudScene.CENTER_LEFT = new Vector(-1, 0);
		HudScene.CENTER_RIGHT = new Vector(1, 0);
		HudScene.BOTTOM_LEFT = new Vector(-1, 1);
		HudScene.BOTTOM_CENTER = new Vector(0, 1);
		HudScene.BOTTOM_RIGHT = new Vector(1, 1);

		HudScene.prototype = Object.create(Scene.prototype);

		HudScene.prototype.addComponent = function (size, alignment, render) {
			this.components.push({
				size: size,
				alignment: alignment,
				render: render
			});
		};

		HudScene.prototype.render = function (viewport) {
			for (var i = 0, len = this.components.length; i < len; i++) {
				var c = this.components[i];
				c.render(subViewForComponent(viewport, c.size, c.alignment));
			}
		};

		function subViewForComponent(viewport, size, alignment) {
			var x, y;

			if (alignment.x === 0) {
				x = Math.round(viewport.width / 2);
			}
			else {
				x = alignment.x === -1 ? size.x / 2 : viewport.width - size.x / 2;
			}
			if (alignment.y === 0) {
				y = Math.round(viewport.height / 2);
			}
			else {
				y = alignment.y === -1 ? size.y / 2 : viewport.height - size.y / 2;
			}

			return viewport.subView(x, y, size.x, size.y);
		}

		return HudScene;
	});
