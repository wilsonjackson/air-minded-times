Engine.module('world.items.ItemRepository', function () {
	'use strict';

	var items = {};

	var ItemRepository = {
		add: function (item) {
			return (items[item.id] = item);
		},

		retrieve: function (id) {
			return items[id];
		}
	};

	return {
		ItemRepository: ItemRepository
	};
});
