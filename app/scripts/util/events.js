(function () {
	'use strict';

	function Events() {
		this.events = {};
	}

	Events.prototype.on = function (name, fn) {
		var events = this.events[name] || (this.events[name] = []);
		events.push(fn);
	};

	Events.prototype.trigger = function (name, data) {
		var events = this.events[name];
		if (events) {
			for (var i = 0, len = events.length; i < len; i++) {
				events[i](data);
			}
		}
	};

	window.Events = Events;
})();
