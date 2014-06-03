(function () {
	'use strict';

	var Physics = {
		newEntity: function (x, y, w, h) {
			return new Entity(x, y, w, h);
		},

		resolveCollisions: function () {

		}
	};

	function Entity(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.speed = 1;
		this.accel = 1;
		this.velocity = 0;
	}

	Entity.prototype.moveX = function (direction) {
		if (this.velocity < this.speed) {
			this.velocity = Math.min(this.velocity + this.accel, this.speed);
		}
		this.x += this.velocity * direction;
	};

	Entity.prototype.moveY = function (direction) {
		if (this.velocity < this.speed) {
			this.velocity = Math.min(this.velocity + this.accel, this.speed);
		}
		this.y += this.velocity * direction;
	};

	Entity.prototype.stop = function () {
		this.velocity = 0;
	};

	window.Physics = Physics;
})();
