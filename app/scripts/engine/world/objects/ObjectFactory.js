Engine.module('world.objects.ObjectFactory',
	['physics.Orientation'],
	function () {
		'use strict';

		var Orientation = Engine.physics.Orientation;

		var types = {};
		var ObjectFactory = {
			register: function (id, ctor) {
				types[id] = ctor;
			},

			create: function (id) {
				var Ctor = types[id];
				return new Ctor();
			},

			spawn: function (id, x, y, orientation) {
				Engine.logger.debug('Spawning ' + id + ' at ' + x + ',' + y);
				var object = this.create(id);
				object.init(x, y, orientation || Orientation.NORTH);
				return object;
			}
		};

		return {
			ObjectFactory: ObjectFactory
		};
	});
