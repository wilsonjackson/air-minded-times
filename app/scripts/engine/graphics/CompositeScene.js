Engine.module('graphics.CompositeScene',
	[
		'graphics.Scene'
	],
	function (Scene) {
		'use strict';

		function CompositeScene(/*scenes...*/) {
			this.children = Array.prototype.slice.call(arguments);
			console.log('scene with children ' + this.children.map(function (o) {return o.toString();}).join(', '));
		}

		CompositeScene.prototype = Object.create(Scene.prototype);

		CompositeScene.prototype.activate = function () {
			for (var i = 0, len = this.children.length; i < len; i++) {
				this.children[i].activate();
			}
		};

		CompositeScene.prototype.update = function (input) {
			for (var i = 0, len = this.children.length; i < len; i++) {
				this.children[i].update(input);
			}
		};

		CompositeScene.prototype.render = function (viewport) {
			for (var i = 0, len = this.children.length; i < len; i++) {
				this.children[i].render(viewport);
			}
		};

		return CompositeScene;
	});
