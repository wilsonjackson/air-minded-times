(function () {
	'use strict';

	function ObjectType(value) {
		this.value = value;
	}

	ObjectType.prototype.isA = function (type) {
		return !!(this.value & type.value);
	};

	var ObjectTypeRepository = (function () {
		var nextType = 1;
		var types = {};

		return {
			add: function (id/*, parents...*/) {
				var type = nextType;
				for (var i = 1, len = arguments.length; i < len; i++) {
					type |= arguments[i];
				}
				nextType = nextType << 1;
				return types[id] = new ObjectType(type);
			},

			retrieve: function (id) {
				return types[id];
			},

			retrieveMatching: function (type) {
				var matching = [];
				for (var i in types) {
					if (type.isA(types[i])) {
						matching.push(type);
					}
				}
				return matching;
			}
		}
	})();

	ObjectTypeRepository.ACTOR = ObjectTypeRepository.add('actor');
	ObjectTypeRepository.PLAYER = ObjectTypeRepository.add('player', ObjectType.ACTOR);
	ObjectTypeRepository.ENEMY = ObjectTypeRepository.add('enemy', ObjectType.ACTOR);
	ObjectTypeRepository.NPC = ObjectTypeRepository.add('npc', ObjectType.ACTOR);
	ObjectTypeRepository.OBSTACLE = ObjectTypeRepository.add('obstacle');
	ObjectTypeRepository.WALL = ObjectTypeRepository.add('wall', ObjectType.OBSTACLE);
	ObjectTypeRepository.EDGE = ObjectTypeRepository.add('edge', ObjectType.OBSTACLE);
	ObjectTypeRepository.ITEM = ObjectTypeRepository.add('item');

	window.ObjectTypeRepository = ObjectTypeRepository;
})();
