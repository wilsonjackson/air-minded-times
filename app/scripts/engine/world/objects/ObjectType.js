Engine.module('world.objects.ObjectType', function () {
	'use strict';

	var ObjectType = {
		PLAYER: 'player',
		ENEMY: 'enemy',
		DECORATION: 'decoration',
		ITEM: 'item',
		PROJECTILE: 'projectile'
	};

	return {
		ObjectType: ObjectType
	};
});
