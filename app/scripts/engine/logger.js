/* global Game */

(function () {
	'use strict';

	function DefaultLogger() {

	}

	DefaultLogger.prototype.trace = function (/*message*/) {
		console.trace.apply(console, ['[' + Game.tick + ']'].concat(Array.prototype.slice.call(arguments)));
	};

	DefaultLogger.prototype.debug = function (/*message*/) {
		console.debug.apply(console, ['[' + Game.tick + ']'].concat(Array.prototype.slice.call(arguments)));
	};

	DefaultLogger.prototype.info = function (/*message*/) {
		console.info.apply(console, ['[' + Game.tick + ']'].concat(Array.prototype.slice.call(arguments)));
	};

	DefaultLogger.prototype.warn = function (/*message*/) {
		console.warn.apply(console, ['[' + Game.tick + ']'].concat(Array.prototype.slice.call(arguments)));
	};

	DefaultLogger.prototype.error = function (/*message*/) {
		console.error.apply(console, ['[' + Game.tick + ']'].concat(Array.prototype.slice.call(arguments)));
	};

	window.DefaultLogger = DefaultLogger;
})();
