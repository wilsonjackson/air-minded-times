Engine.module('graphics.sprite.SpriteStack',
	['graphics.sprite.DelegatingSprite'],
	function () {
		'use strict';

		var DelegatingSprite = Engine.graphics.sprite.DelegatingSprite;

		function SpriteStack(sprites) {
			this.stack = sprites || [];
			if (sprites.length > 0) {
				this._initStack();
			}
		}

		SpriteStack.prototype = Object.create(DelegatingSprite.prototype);

		SpriteStack.prototype._initStack = function () {
			this.delegate = this.stack[0];
			this._copy();
		};

		SpriteStack.prototype.push = function (/*sprite...*/) {
			var init = this.stack.length === 0;
			Array.prototype.push.apply(this.stack, arguments);
			if (init) {
				this._initStack();
			}
		};

		SpriteStack.prototype.pop = function () {
			return this.stack.pop();
		};

		SpriteStack.prototype.get = function (index) {
			return this.stack[index];
		};

		SpriteStack.prototype.swap = function (index, newSprite) {
			var oldSprite = this.stack[index];
			this.stack[index] = newSprite;
			return oldSprite;
		};

		SpriteStack.prototype.update = function () {
			for (var i = 0, len = this.stack.length; i < len; i++) {
				this.stack[i].update();
			}
		};

		SpriteStack.prototype.draw = function (context, x, y) {
			for (var i = 0, len = this.stack.length; i < len; i++) {
				this.stack[i].draw(context, x, y);
			}
		};

		SpriteStack.prototype.toString = function () {
			return 'SpriteStack[' + this.stack.map(function (o) {
				return o.toString();
			}).join(', ') + ']';
		};

		return {
			SpriteStack: SpriteStack
		};
	});
