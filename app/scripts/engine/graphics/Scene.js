Engine.module('graphics.Scene', function () {
	'use strict';

	function Scene() {}
	Scene.prototype.activate = function () {};
	Scene.prototype.update = function (/*input*/) {};
	Scene.prototype.render = function (/*viewport*/) {};

	return {
		Scene: Scene
	};
});
