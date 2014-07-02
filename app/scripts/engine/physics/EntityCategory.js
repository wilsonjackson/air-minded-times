/* jshint bitwise: false */
Engine.module('physics.EntityCategory', function () {
	'use strict';

	function EntityCategory(value, id) {
		this.value = value;
		this.id = id;
	}

	EntityCategory.prototype.isA = function (type) {
		return !!(this.value & type.value);
	};

	EntityCategory.prototype.toString = function () {
		return 'EntityCategory(id=' + this.id + ', value=' + this.value + ')';
	};

	var nextType = 1;
	var types = {};

	EntityCategory.add = function (id/*, parents...*/) {
		var type = nextType;
		for (var i = 1, len = arguments.length; i < len; i++) {
			type |= arguments[i].value;
		}
		nextType = nextType << 1;
		return (types[id] = new EntityCategory(type, id));
	};

	EntityCategory.retrieve = function (id) {
		return types[id];
	};

	EntityCategory.retrieveMatching = function (type) {
		var matching = [];
		for (var i in types) {
			//noinspection JSUnfilteredForInLoop
			if (type.isA(types[i])) {
				matching.push(type);
			}
		}
		return matching;
	};

	EntityCategory.ACTOR = EntityCategory.add('actor');
	EntityCategory.PLAYER = EntityCategory.add('player', EntityCategory.ACTOR);
	EntityCategory.ENEMY = EntityCategory.add('enemy', EntityCategory.ACTOR);
	EntityCategory.NPC = EntityCategory.add('npc', EntityCategory.ACTOR);
	EntityCategory.OBSTACLE = EntityCategory.add('obstacle');
	EntityCategory.WALL = EntityCategory.add('wall', EntityCategory.OBSTACLE);
	EntityCategory.EDGE = EntityCategory.add('edge', EntityCategory.OBSTACLE);
	EntityCategory.ITEM = EntityCategory.add('item');
	EntityCategory.PROJECTILE = EntityCategory.add('projectile');
	EntityCategory.DECORATION = EntityCategory.add('decoration');

	return EntityCategory;
});
