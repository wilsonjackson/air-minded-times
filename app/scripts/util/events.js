(function () {
	'use strict';

	function Events() {
		this.events = {};
	}

	Events.prototype.on = function (name, fn) {
		var events = this.events[name] || (this.events[name] = []);
		events.push(fn);
	};

	Events.prototype.off = function (name, fn) {
		var events = this.events[name];
		if (events) {
			var i = events.indexOf(fn);
			if (i > -1) {
				events.splice(i, 1);
			}
		}
	};

	Events.prototype.trigger = function (name, data) {
		var events = this.events[name];
		if (events) {
			for (var i = 0, len = events.length; i < len; i++) {
				events[i](data);
			}
		}
	};

	Events.mixin = function (object) {
		var events = new Events();
		object.on = events.on.bind(events);
		object.off = events.off.bind(events);
		object.trigger = events.trigger.bind(events);
	};

	window.Events = Events;
})();
