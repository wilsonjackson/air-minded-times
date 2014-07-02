Engine.module('world.items.Inventory',
	['world.items.ItemBag'],
	function (ItemBag) {
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
			itemBag.on('nonzero', Array.prototype.push.bind(this._items));
			itemBag.on('zero', function () {
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

		return Inventory;
	});
