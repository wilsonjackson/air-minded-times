Engine.module('physics.Collision', function () {
	'use strict';

	function Collision(entity, intersection) {
		this.entity = entity;
		this.intersection = intersection;
	}

	return Collision;
});
