/* global Game, AirMindedTimes, Vector */

(function (Game, AirMindedTimes, Vector) {
	'use strict';

	var Interloper = Game.world.Interloper;

	var currentMode;
	var observers = [];

	function notifyObservers() {
		for (var i = 0, len = observers.length; i < len; i++) {
			observers[i].notify(GameplayMode);
		}
	}

	var GameplayMode = {
		FREE_ROAM: 'FREE_ROAM',
		SCROLLING: 'SCROLLING',

		getMode: function () {
			return currentMode;
		},

		setMode: function (mode) {
			currentMode = mode;
			notifyObservers();
		},

		addObserver: function (observer, suppressImmediateNotify) {
			observers.push(observer);
			if (currentMode && !suppressImmediateNotify) {
				observer.notify(this);
			}
		},

		removeObserver: function (observer) {
			var i = observers.indexOf(observer);
			if (i > -1) {
				observers.splice(i, 1);
			}
		}
	};

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
		world.centerOn(Math.round(world.width / 2), world.height);
		this.maxDistance = world.height - Game.getViewport().height;
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
		var newCenter = world.getCenter().add(scrollVector);
		world.centerOn(newCenter.x, newCenter.y);
		world.getPlayers()[0].entity.impulse(scrollVector.x, scrollVector.y);

		this.distance += this.scrollSpeed;
	};

	AutoScroller.prototype.prePhysics = function (world) {
		var player = world.getPlayers()[0];
		var nextPlayerY = player.entity.getY() + player.entity.nextMovement.y;
		var visibleArea = world.getVisibleArea();
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
		var visibleArea = world.getVisibleArea();
		var maxPlayerY = visibleArea.bottom() - player.entity.getHeight();
		if (player.entity.getY() > maxPlayerY) {
			player.die();
		}
	};

	function PlayerScroller() {
	}

	PlayerScroller.prototype = Object.create(Interloper.prototype);

	PlayerScroller.prototype.postUpdate = function (world) {
		var player = world.firstObjectOfType(Game.objects.ObjectType.PLAYER);
		if (player) {
			world.centerOn(player.entity.getX(), player.entity.getY(), player.entity.getWidth(), player.entity.getHeight());
		}
	};

	GameplayMode.addObserver({
		notify: function (gameplayMode) {
			var mode = gameplayMode.getMode();
			if (mode === GameplayMode.SCROLLING) {
				installInterloper(Game.getWorld(), new AutoScroller());
			}
			if (mode === GameplayMode.FREE_ROAM) {
				installInterloper(Game.getWorld(), new PlayerScroller());
			}
		}
	});

	var removeLast = function () {};

	function installInterloper(world, interloper) {
		removeLast();
		world.addInterloper(interloper);
		removeLast = function () {
			world.removeInterloper(interloper);
		};
	}

	function RestartOnDeathInterloper() {
		this.playerDied = false;
		this.waitTicks = 120;
		this.tickCount = 0;
	}

	RestartOnDeathInterloper.prototype = Object.create(Interloper.prototype);

	RestartOnDeathInterloper.prototype.mapChange = function (world) {
		var self = this;
		world.getPlayers()[0].events.on('death', function () {
			self.playerDied = true;
			self.tickCount = 0;
		});
	};

	RestartOnDeathInterloper.prototype.preUpdate = function (world) {
		if (this.playerDied) {
			if (++this.tickCount === this.waitTicks) {
				this.playerDied = false;
				world.loadMap(world.map);
			}
		}
	};

	AirMindedTimes.gameplay = {
		GameplayMode: GameplayMode,
		RestartOnDeathInterloper: RestartOnDeathInterloper
	};
})(Game, AirMindedTimes, Vector);
