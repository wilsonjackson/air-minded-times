Engine.module('world.Interloper', function () {
	'use strict';

	/**
	 * @constructor
	 */
	function Interloper() {}
	Interloper.prototype.init = function (/*world*/) {};
	Interloper.prototype.mapChange = function (/*world, map*/) {};
	Interloper.prototype.preUpdate = function (/*world, input*/) {};
	Interloper.prototype.prePhysics = function (/*world, input*/) {};
	Interloper.prototype.postUpdate = function (/*world, input*/) {};
	Interloper.prototype.preRender = function (/*world, viewport*/) {};
	Interloper.prototype.postRender = function (/*world, viewport*/) {};

	return Interloper;
});
