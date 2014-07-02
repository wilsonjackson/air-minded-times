/* global Engine */

(function (Engine, document) {
	'use strict';

	function Scene() {}
	Scene.prototype.activate = function () {};
	Scene.prototype.update = function (/*world, input*/) {};
	Scene.prototype.render = function (/*viewport*/) {};

	function HudComponent(offset, width, height) {
		this.offset = offset;
		this.width = width;
		this.height = height;
		this.removed = false;
	}

	HudComponent.prototype.remove = function () {
		this.removed = true;
	};

	function Menu() {

	}

	Menu.prototype.close = function () {
		this.removed = false;
	};

	var Ui = (function () {
		var hud = [null, null, null, null];
		var offsets = [[false, false], [true, false], [true, true], [false, true]];

		return {
			CORNER_NW: 0,
			CORNER_NE: 1,
			CORNER_SE: 2,
			CORNER_SW: 3,

			init: function (world) {
				this.world = world;
			},

			addHudComponent: function (corner, width, height) {
				hud[corner] = new HudComponent(offsets[corner], width, height);
				return hud[corner];
			},

//			menu: function () {
//
//			},

			update: function (input) {
				if (this.activeScreen !== null) {
					this.activeScreen.update(input);
				}
			},

			render: function (viewport) {
				if (this.activeScreen !== null) {
					this.activeScreen.render(viewport);
				}
				else {
					for (var i = 0; i < 4; i++) {
						if (hud[i] !== null) {
							var xOffset = hud[i].width / 2;
							var yOffset = hud[i].height / 2;
							hud[i].render(viewport,
								hud[i].offset[0] ? viewport.width - xOffset : xOffset,
								hud[i].offset[1] ? viewport.height - yOffset : yOffset);
						}
					}
				}
			}
		};
	})();

	//noinspection JSUnusedGlobalSymbols
	var Effects = {
		snapshotCanvas: function () {
			var mainCanvas = Engine.getViewport().canvas;
			var snapshot = document.createElement('canvas');
			snapshot.setAttribute('width', mainCanvas.getAttribute('width'));
			snapshot.setAttribute('height', mainCanvas.getAttribute('height'));
			snapshot.style.display = 'none';
			snapshot.style.position = 'absolute';
			snapshot.style.left = '0';
			snapshot.style.top = '0';
			mainCanvas.parentElement.insertBefore(snapshot, mainCanvas.nextSibling);
			snapshot.getContext('2d').drawImage(mainCanvas, 0, 0);
			return snapshot;
		},

		fadeOut: function (ticks, callback) {
			ticks = ticks || 30;
			var tick = 0;
			var snapshot = this.snapshotCanvas();
			var scene = new Scene();
			scene.update = function () {
				if (tick === ticks) {
					snapshot.parentElement.removeChild(snapshot);
					Engine.popScene();
					if (callback) {
						callback();
					}
					return;
				}
				++tick;
			};
			scene.render = function (viewport) {
				var context = viewport.context;
				context.drawImage(snapshot, 0, 0);
				context.globalAlpha = (1 / ticks) * tick;
				context.fillStyle = '#000';
				context.fillRect(0, 0, viewport.width, viewport.height);
				context.globalAlpha = 1;
			};
			Engine.pushScene(scene);
		},

		mosaic: function (steps, stepTicks, callback) {
			steps = steps || 8;
			stepTicks = stepTicks || 6;

			var step = 1;
			var lastStep = 0;
			var tick = 0;
			var snapshot = this.snapshotCanvas();
			var snapshotContext = snapshot.getContext('2d');
			var pixels = snapshotContext.getImageData(0, 0, snapshot.width, snapshot.height).data;
			var stepImageData = snapshotContext.createImageData(snapshot.width, snapshot.height);
			var stepPixels = stepImageData.data;
			var scene = new Scene();
			scene.update = function () {
				if (step === steps && tick === stepTicks) {
					snapshot.parentElement.removeChild(snapshot);
					Engine.popScene();
					if (callback) {
						callback();
					}
					return;
				}
				if (tick === stepTicks) {
					++step;
					tick = 0;
				}
				++tick;
			};
			scene.render = function (viewport) {
				var pixelsPerTile = 4 * step;
				var xTiles = Math.floor(snapshot.width / pixelsPerTile);
				var yTiles = Math.floor(snapshot.height / pixelsPerTile);

				var reds;
				var greens;
				var blues;
				var i, j;
				if (lastStep !== step) {
					for (var x = 0; x < xTiles; x++) {
						var tileX = x * pixelsPerTile * 4;
						for (var y = 0; y < yTiles; y++) {
							var tileY = y * pixelsPerTile * 4;
							var cornerIdx = tileY * snapshot.width + tileX;
							reds = 0;
							greens = 0;
							blues = 0;
							var n = 0;
							var pixelIdx;
							for (i = 0; i < pixelsPerTile; i++) {
								for (j = 0; j < pixelsPerTile; j++) {
									pixelIdx = (cornerIdx + j * snapshot.width * 4 + i * 4);
									reds += pixels[pixelIdx];
									greens += pixels[pixelIdx + 1];
									blues += pixels[pixelIdx + 2];
									n++;
								}
							}
							var red = Math.round(reds / n);
							var green = Math.round(greens / n);
							var blue = Math.round(blues / n);
							for (i = 0; i < pixelsPerTile; i++) {
								for (j = 0; j < pixelsPerTile; j++) {
									pixelIdx = (cornerIdx + j * snapshot.width * 4 + i * 4);
									stepPixels[pixelIdx] = red;
									stepPixels[pixelIdx+1] = green;
									stepPixels[pixelIdx+2] = blue;
									stepPixels[pixelIdx+3] = 255;
								}
							}
						}
					}
					snapshotContext.putImageData(stepImageData, 0, 0);
				}
				viewport.context.drawImage(snapshot, 0, 0);
			};
			Engine.pushScene(scene);
		}
	};

	Engine.ui = {
		Ui: Ui,
		Scene: Scene,
		Effects: Effects
	};
})(Engine, document);
