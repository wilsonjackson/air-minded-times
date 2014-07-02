Engine.module('amt.behavior.ScrollingMode',
	['world.Interloper', 'amt.game.Game'],
	function () {
		'use strict';

		var Interloper = Engine.world.Interloper;
		var Game = Engine.amt.game.Game;

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
		}

		AutoScroller.prototype = Object.create(Interloper.prototype);

		AutoScroller.prototype.init = function (world) {
			var self = this;
			world.getPlayers()[0].events.on('death', function () {
				world.removeInterloper(self);
			});
			Engine.getViewport().centerOn(Math.round(world.width / 2), world.height);
			this.maxDistance = world.height - Engine.getViewport().height;
			this.easeDistance = this.maxDistance;
			for (var s = 1; s <= this.maxScrollSpeed; s++) {
				this.easeDistance -= s * this.easeTicks;
			}
		};

		AutoScroller.prototype.preUpdate = function (world) {
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
			var viewport = Engine.getViewport();
			var newCenter = viewport.getCenter().add(scrollVector);
			viewport.centerOn(newCenter.x, newCenter.y);
			world.getPlayers()[0].entity.impulse(scrollVector.x, scrollVector.y);

			this.distance += this.scrollSpeed;
		};

		AutoScroller.prototype.prePhysics = function (world) {
			var player = world.getPlayers()[0];
			var nextPlayerY = player.entity.getY() + player.entity.nextMovement.y;
			var visibleArea = Engine.getViewport().getVisibleArea();
			var minPlayerY = visibleArea.top() + Math.floor(visibleArea.height() / 3);
			var maxPlayerY = visibleArea.bottom() - player.entity.getHeight();

			if (nextPlayerY < minPlayerY) {
				player.entity.impulse(0, minPlayerY - nextPlayerY);
			}
			if (nextPlayerY > maxPlayerY) {
				player.entity.impulse(0, maxPlayerY - nextPlayerY);
			}
		};

		AutoScroller.prototype.postUpdate = function (world) {
			var player = world.getPlayers()[0];
			var visibleArea = Engine.getViewport().getVisibleArea();
			var maxPlayerY = visibleArea.bottom() - player.entity.getHeight();
			if (player.entity.getY() > maxPlayerY) {
				player.die();
			}
		};

		function PlayerScroller() {
		}

		PlayerScroller.prototype = Object.create(Interloper.prototype);

		PlayerScroller.prototype.postUpdate = function (world) {
			var player = world.firstObjectOfType(Engine.objects.ObjectType.PLAYER);
			if (player) {
				Engine.getViewport().centerOn(player.entity.getX(), player.entity.getY(), player.entity.getWidth(), player.entity.getHeight());
			}
		};
	});
