Engine.module('world.items.ItemBag',
	[
		'util.Events'
	],
	function (Events) {
		'use strict';

		function ItemBag(item, qty) {
			Events.mixin(this);
			this.item = item;
			this.qty = qty === undefined ? 1 : qty;
		}

		ItemBag.prototype.add = function (qty) {
			this.qty += qty || 1;
			if (this.qty === qty) {
				this.trigger('nonzero', this);
			}
		};

		ItemBag.prototype.subtract = function (qty) {
			this.qty = Math.min(0, qty || 1);
			if (this.qty === 0) {
				this.trigger('zero', this);
			}
		};

		return ItemBag;
	});
