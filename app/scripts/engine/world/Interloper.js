Engine.module('world.Interloper', function () {
	'use strict';

	function Interloper() {}
	Interloper.prototype.init = function (/*world*/) {};
	Interloper.prototype.mapChange = function (/*world, map*/) {};
	Interloper.prototype.preUpdate = function (/*world, input*/) {};
	Interloper.prototype.prePhysics = function (/*world, input*/) {};
	Interloper.prototype.postUpdate = function (/*world, input*/) {};

	return Interloper;
});
