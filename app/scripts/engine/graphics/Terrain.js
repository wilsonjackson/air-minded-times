Engine.module('graphics.Terrain',
	['graphics.Tile'],
	function (Tile) {
		'use strict';

		var indexed = [null];
		//noinspection UnnecessaryLocalVariableJS
		var Terrain = {
			add: function (sprite, impassable) {
				var tile = new Tile(sprite, impassable);
				indexed.push(tile);
				return tile;
			},

			readMapTerrain: function (mapTerrain) {
				return mapTerrain.map(function (n) {
					if (indexed[n] === null) {
						throw 'Invalid terrain index: ' + n;
					}
					return indexed[n];
				});
			}
		};

		return Terrain;
	});
