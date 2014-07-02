(function () {
	'use strict';

	var Engine = window.Engine || (window.Engine = {});
	var modules = {};

	Engine.module = function (name, deps, fn) {
		modules[name] = [deps, fn];
	};

	Engine.load = function (names, fn) {
		return function () {
			var stack = [];
			var artifacts = {};
			var args = [];
			for (var i = 0, len = names.length; i < len; i++) {
				args.push(mod(names[i], stack, artifacts));
			}
			fn.apply(null, args);
		};
	};

	function mod(name, stack, artifacts) {
		if (name in artifacts) {
			return artifacts[name];
		}
		if (name.indexOf('.') === -1) {
			throw 'Module name must include a dot';
		}
		if (stack.indexOf(name) !== -1) {
			throw 'Circular module dependency: ' + stack.join(' -> ') + ' -> ' + name;
		}
		if (!modules[name]) {
			throw 'Unknown module: ' + name + ' (dependency of ' + stack[stack.length - 1] + ')';
		}

		var hasDeps = !!modules[name][0].push;
		var deps = hasDeps ? modules[name][0] : [];
		var fn = modules[name][hasDeps ? 1 : 0];
		var args = [];

		stack.push(name);
		for (var i = 0, len = deps.length; i < len; i++) {
			args.push(mod(deps[i], stack, artifacts, artifacts));
		}
		stack.pop();

		return (artifacts[name] = fn.apply(null, args));
	}
})();
