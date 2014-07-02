Engine.module('world.objects.ObjectType', function () {
	'use strict';

	//noinspection UnnecessaryLocalVariableJS
	var ObjectType = {
		PLAYER: 'player',
		ENEMY: 'enemy',
		DECORATION: 'decoration',
		ITEM: 'item',
		PROJECTILE: 'projectile'
	};

	return ObjectType;
});
