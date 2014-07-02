Engine.module('logging.DefaultLogger', function () {
	'use strict';

	function DefaultLogger() {
	}

	DefaultLogger.prototype.trace = function (/*message*/) {
		console.trace.apply(console, ['[' + Engine.tick + ']'].concat(Array.prototype.slice.call(arguments)));
	};

	DefaultLogger.prototype.debug = function (/*message*/) {
		console.debug.apply(console, ['[' + Engine.tick + ']'].concat(Array.prototype.slice.call(arguments)));
	};

	DefaultLogger.prototype.info = function (/*message*/) {
		console.info.apply(console, ['[' + Engine.tick + ']'].concat(Array.prototype.slice.call(arguments)));
	};

	DefaultLogger.prototype.warn = function (/*message*/) {
		console.warn.apply(console, ['[' + Engine.tick + ']'].concat(Array.prototype.slice.call(arguments)));
	};

	DefaultLogger.prototype.error = function (/*message*/) {
		console.error.apply(console, ['[' + Engine.tick + ']'].concat(Array.prototype.slice.call(arguments)));
	};

	return {
		DefaultLogger: DefaultLogger
	};
});
