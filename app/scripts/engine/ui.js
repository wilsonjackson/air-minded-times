/* global Game */

(function (Game) {
	'use strict';

	function CoverScreen() {}
	CoverScreen.prototype.activate = function () {};
	CoverScreen.prototype.update = function (/*world, input*/) {};
	CoverScreen.prototype.render = function (/*graphics*/) {};

	function HudComponent(offset, width, height) {
		this.offset = offset;
		this.width = width;
		this.height = height;
		this.initialized = false;
		this.removed = false;
	}

	HudComponent.prototype.init = function () {
	};

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

			activateScreen: function (screen) {
				this.activeScreen = screen;
				screen.activate();
			},

			deactivateScreen: function () {
				this.activeScreen = null;
			},

			isScreenActive: function () {
				return this.activeScreen !== null;
			},

			addHudComponent: function (corner, width, height) {
				hud[corner] = new HudComponent(offsets[corner], width, height);
				return hud[corner];
			},

//			menu: function () {
//
//			},

			update: function (world, input) {
				if (this.activeScreen !== null) {
					this.activeScreen.update(world, input);
				}
			},

			render: function (graphics) {
				if (this.activeScreen !== null) {
					this.activeScreen.render(graphics);
				}
				else {
					for (var i = 0; i < 4; i++) {
						if (hud[i] !== null) {
							if (!hud[i].initialized) {
								hud[i].init(this.world);
								hud[i].initialized = true;
							}
							hud[i].render(graphics,
								hud[i].offset[0] ? graphics.viewport.width - hud[i].width : 0,
								hud[i].offset[1] ? graphics.viewport.height - hud[i].height : 0);
						}
					}
				}
			}
		};
	})();

	Game.ui = {
		Ui: Ui,
		CoverScreen: CoverScreen
	};
})(Game);
