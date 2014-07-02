Engine.module('graphics.Viewport',
	['graphics.Graphics'],
	function (Graphics) {
		'use strict';

		function Viewport(canvas) {
			this.canvas = canvas;
			this.context = canvas.getContext('2d');
			this.width = canvas.width;
			this.height = canvas.height;
			this.background = '#000000';
			this.sceneOffset = new Vector(0, 0);
			this._graphics = null;
		}

		Viewport.prototype.clear = function () {
			this.context.fillStyle = this.background;
			this.context.fillRect(0, 0, this.width, this.height);
		};

		Viewport.prototype.getGraphics = function () {
			if (this._graphics === null) {
				this._graphics = new Graphics(this);
			}
			return this._graphics;
		};

		Viewport.prototype.getCenter = function () {
			return this.sceneOffset.add(new Vector(Math.round(this.width / 2), Math.round(this.height / 2)));
		};

		Viewport.prototype.getVisibleArea = function () {
			return new BoundingRect(
				new Vector(this.sceneOffset.x, this.sceneOffset.y),
				new Vector(this.width, this.height));
		};

		Viewport.prototype.centerOn = function (x, y, w, h) {
			var scene = Engine.getScene();
			this.sceneOffset = new Vector(
				Math.round(Math.min(Math.max(0, x - ((this.width - (w || 0)) / 2)), scene.width - this.width)),
				Math.round(Math.min(Math.max(0, y - ((this.height - (h || 0)) / 2)), scene.height - this.height)));
		};

		Viewport.prototype.translate = function (x, y) {
			return new Vector(x, y).subtract(this.sceneOffset);
		};

		return Viewport;
	});
