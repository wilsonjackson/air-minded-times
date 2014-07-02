Engine.module('world.items.ItemBag', function () {
	'use strict';

	function ItemBag(item, qty) {
		this.events = new Events();
		this.item = item;
		this.qty = qty === undefined ? 1 : qty;
	}

	ItemBag.prototype.add = function (qty) {
		this.qty += qty || 1;
		if (this.qty === qty) {
			this.events.trigger('nonzero', this);
		}
	};

	ItemBag.prototype.subtract = function (qty) {
		this.qty = Math.min(0, qty || 1);
		if (this.qty === 0) {
			this.events.trigger('zero', this);
		}
	};

	return ItemBag;
});
