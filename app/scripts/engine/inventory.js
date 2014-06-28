/* global Engine, Events */

(function (Engine, Events) {
	'use strict';

	function Inventory() {
		// Index holds an ItemBag for every item ever added or retrieved, regardless of qty.
		this._idx = {};
		// Items holds ItemBags from idx only if qty > 0
		this._items = [];
	}

	Inventory.prototype._add = function (item, qty) {
		var inv = this;
		var itemBag = new ItemBag(item, qty);
		itemBag.events.on('nonzero', Array.prototype.push.bind(this._items));
		itemBag.events.on('zero', function () {
			var idx = inv._items.indexOf(itemBag);
			if (idx > -1) {
				inv._items.splice(idx, 1);
			}
		});

		this._idx[item.id] = itemBag;
		if (qty > 0) {
			this._items.push(itemBag);
		}
	};

	Inventory.prototype.list = function () {
		return this._items;
	};

	Inventory.prototype.get = function (item) {
		if (!this._idx[item.id]) {
			this._add(item, 0);
		}
		return this._idx[item.id];
	};

	Inventory.prototype.clear = function () {
		this._idx = {};
		this._items.splice(0, this._items.length);
	};

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

	var ItemRepository = (function () {
		var items = {};

		return {
			add: function (item) {
				return (items[item.id] = item);
			},

			retrieve: function (id) {
				return items[id];
			}
		};
	})();

	Engine.inventory = {
		Inventory: Inventory,
		ItemRepository: ItemRepository
	};
})(Engine, Events);
