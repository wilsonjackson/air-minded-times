Engine.module('amt.behavior.RestartOnDeathInterloper',
	['world.Interloper'],
	function (Interloper) {
		'use strict';

		function RestartOnDeathInterloper() {
			this.playerDied = false;
			this.waitTicks = 120;
			this.tickCount = 0;
		}

		RestartOnDeathInterloper.prototype = Object.create(Interloper.prototype);

		RestartOnDeathInterloper.prototype.mapChange = function (world) {
			var self = this;
			world.getPlayers()[0].on('death', function () {
				self.playerDied = true;
				self.tickCount = 0;
			});
		};

		RestartOnDeathInterloper.prototype.preUpdate = function (world) {
			if (this.playerDied) {
				if (++this.tickCount === this.waitTicks) {
					this.playerDied = false;
					world.loadMap(world.map);
				}
			}
		};

		return RestartOnDeathInterloper;
	});
