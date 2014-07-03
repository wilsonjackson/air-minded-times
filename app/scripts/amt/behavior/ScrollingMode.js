Engine.module('amt.behavior.ScrollingMode',
	[
		'math.Vector',
		'world.Interloper',
		'amt.game.Game'
	],
	function (Vector, Interloper, Game) {
		'use strict';

		Game.on('start', function (game) {
			game.on('modechange', function (mode) {
				if (mode === Game.MODE.SCROLLING) {
					installInterloper(game.getWorld(), new AutoScroller());
				}
				if (mode === Game.MODE.FREE_ROAM) {
					installInterloper(game.getWorld(), new PlayerScroller());
				}
			});
		});

		var removeLastGameplayInterloper = function () {};
		function installInterloper(world, interloper) {
			removeLastGameplayInterloper();
			world.addInterloper(interloper);
			removeLastGameplayInterloper = function () {
				world.removeInterloper(interloper);
			};
		}

		function AutoScroller() {
			this.distance = 0;
			this.maxDistance = 0;
			this.easeDistance = 0;
			this.scrollDirection = -1;
			this.scrollSpeed = 0;
			this.maxScrollSpeed = 3;
			this.easedIn = false;
			this.easeTicks = 35;
			this.ticks = 0;
			this.scrollPos = null;
			this.minPlayerY = 0;
			this.maxPlayerY = 0;
		}

		AutoScroller.prototype = Object.create(Interloper.prototype);

		AutoScroller.prototype.init = function (world) {
			var self = this;
			var viewport = Engine.getViewport();
			var player = Game.current().getPlayer();
			player.on('death', function () {
				world.removeInterloper(self);
			});

			this.maxDistance = world.height - viewport.height;
			this.easeDistance = this.maxDistance;
			for (var s = 1; s <= this.maxScrollSpeed; s++) {
				this.easeDistance -= s * this.easeTicks;
			}

			this.scrollPos = new Vector(Math.round(world.width / 2), world.height);
			this.minPlayerY = world.height - viewport.height / 3 * 2;
			this.maxPlayerY = world.height - player.entity.getHeight();
		};

		AutoScroller.prototype.preUpdate = function () {
			if (!this.easedIn && this.scrollSpeed < this.maxScrollSpeed && ++this.ticks % this.easeTicks === 0) {
				this.scrollSpeed++;
				if (this.scrollSpeed === this.maxScrollSpeed) {
					this.ticks = 0;
					this.easedIn = true;
				}
			}
			else if (this.scrollSpeed > 0 && this.distance >= this.easeDistance && ++this.ticks % this.easeTicks === 0) {
				this.scrollSpeed--;
			}

			var scrollVector = new Vector(0, this.scrollSpeed * this.scrollDirection);
			Game.current().getPlayer().entity.impulse(scrollVector.x, scrollVector.y);
			this.scrollPos = this.scrollPos.add(scrollVector);
			this.minPlayerY += scrollVector.y;
			this.maxPlayerY += scrollVector.y;

			this.distance += this.scrollSpeed;
		};

		AutoScroller.prototype.prePhysics = function () {
			var player = Game.current().getPlayer();
			var nextPlayerY = player.entity.getY() + player.entity.nextMovement.y;

			if (nextPlayerY < this.minPlayerY) {
				player.entity.impulse(0, this.minPlayerY - nextPlayerY);
			}
			if (nextPlayerY > this.maxPlayerY) {
				player.entity.impulse(0, this.maxPlayerY - nextPlayerY);
			}
		};

		AutoScroller.prototype.postUpdate = function () {
			var player = Game.current().getPlayer();
			if (player.entity.getY() > this.maxPlayerY) {
				player.die();
			}
		};

		AutoScroller.prototype.preRender = function (world, viewport) {
			viewport.centerOn(this.scrollPos.x, this.scrollPos.y, 0, 0, world.width, world.height);
			this.scrollPos = viewport.getCenter();
		};

		function PlayerScroller() {
		}

		PlayerScroller.prototype = Object.create(Interloper.prototype);

		PlayerScroller.prototype.preRender = function (world, viewport) {
			var player = Game.current().getPlayer();
			if (player) {
				viewport.centerOn(
					player.entity.getX(),
					player.entity.getY(),
					player.entity.getWidth(),
					player.entity.getHeight(),
					world.width,
					world.height);
			}
		};
	});
