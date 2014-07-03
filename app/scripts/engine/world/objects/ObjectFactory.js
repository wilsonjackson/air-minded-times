Engine.module('world.objects.ObjectFactory',
	['physics.Orientation'],
	function (Orientation) {
		'use strict';

		var types = {};

		//noinspection UnnecessaryLocalVariableJS
		var ObjectFactory = {
			register: function (id, ctor) {
				types[id] = ctor;
			},

			create: function (id) {
				var Ctor = types[id];
				return new Ctor();
			},

			spawn: function (id, x, y, orientation) {
				Engine.logger.debug('Spawning ' + id + ' at ' + x + ',' + y + ' (bottom left pt)');
				var object = this.create(id);
				object.init(x, y, orientation || Orientation.NORTH);
				return object;
			},

			spawnAtCenter: function (id, x, y, orientation) {
				Engine.logger.debug('Spawning ' + id + ' at ' + x + ',' + y + ' (center pt)');
				var object = this.create(id);
				object.init(
						x - Math.round(object.sprite.getWidth() / 2),
						y + Math.round(object.sprite.getHeight() / 2),
						orientation || Orientation.NORTH);
				return object;
			}
		};

		return ObjectFactory;
	});
