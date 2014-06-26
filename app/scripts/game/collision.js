(function (Game, AirMindedTimes, Vector) {
	'use strict';

	var EntityCategory = Game.physics.EntityCategory;
	var Orientation = Game.physics.Orientation;

	var collisionListenerMap = {};

	Game.setup(function () {
		collisionListenerMap[AirMindedTimes.gameplay.GameplayMode.FREE_ROAM] = FreeRoamObstacleCollisionListener;
		collisionListenerMap[AirMindedTimes.gameplay.GameplayMode.SCROLLING] = ScrollingObstacleCollisionListener;
	});

	function ObstacleCollisionListener(player) {
		this.player = player;
		AirMindedTimes.gameplay.GameplayMode.addObserver(this);
	}

	ObstacleCollisionListener.prototype.notify = function (gameplayMode) {
		var ListenerCtor = collisionListenerMap[gameplayMode.getMode()];
		this.delegate = new ListenerCtor(this.player);
	};

	ObstacleCollisionListener.prototype.solveCollision = function (collision) {
		return this.delegate.solveCollision(collision);
	};

	ObstacleCollisionListener.prototype.collide = function (collision) {
		return this.delegate.collide(collision);
	};

	ObstacleCollisionListener.prototype.destroy = function () {
		this.delegate.destroy();
		delete this.delegate;
		delete this.player;
	};


	function BaseObstacleCollisionListener() {
	}

	BaseObstacleCollisionListener.prototype.collide = function (collision) {
		if (collision.entity.category.isA(EntityCategory.ITEM)) {
			this.player.inventory.get(collision.entity.object.item).add();
			collision.entity.object.destroy();
		}
	};

	BaseObstacleCollisionListener.prototype.destroy = function () {
		delete this.player;
	};

	function FreeRoamObstacleCollisionListener(player) {
		this.player = player;
	}

	FreeRoamObstacleCollisionListener.prototype = Object.create(BaseObstacleCollisionListener.prototype);

	FreeRoamObstacleCollisionListener.prototype.solveCollision = function (collision) {
		if (collision.entity.category.isA(EntityCategory.OBSTACLE)) {
			var player = this.player;
			if (player.entity.isRotated) {
				if (player.entity.lastOrientation === Orientation.NORTH || player.entity.lastOrientation === Orientation.SOUTH) {
					return new Vector(0, collision.intersection.height() * (player.entity.getY() < collision.intersection.top() ? -1 : 1));
				}
				else if (player.entity.lastOrientation === Orientation.EAST || player.entity.lastOrientation === Orientation.WEST) {
					return new Vector(collision.intersection.width() * (player.entity.getX() < collision.intersection.left() ? -1 : 1), 0);
				}
			}
			if (player.entity.currentMovement.x !== 0) {
				return new Vector(collision.intersection.width() * (player.entity.currentMovement.x > 0 ? -1 : 1), 0);
			}
			if (player.entity.currentMovement.y !== 0) {
				return new Vector(0, collision.intersection.height() * (player.entity.currentMovement.y > 0 ? -1 : 1));
			}
		}
	};

	function ScrollingObstacleCollisionListener(player) {
		this.player = player;
	}

	ScrollingObstacleCollisionListener.prototype = Object.create(BaseObstacleCollisionListener.prototype);

	ScrollingObstacleCollisionListener.prototype.solveCollision = function (collision) {
		if (collision.entity.category.isA(EntityCategory.OBSTACLE)) {
			var player = this.player;
			var isXMoving = player.entity.currentMovement.x !== 0;
			var isYMoving = player.entity.currentMovement.y !== 0;
			var overlapWidth = collision.intersection.width();
			var overlapHeight = collision.intersection.height();
			if (isXMoving && isYMoving) {
				var isXOverlapSmaller = Math.abs(overlapWidth) < Math.abs(overlapHeight);
				var xOverlapDirection = player.entity.getX() === collision.intersection.left() ? 1 : -1;
				var yOverlapDirection = player.entity.getY() === collision.intersection.top() ? 1 : -1;
				return  new Vector(isXOverlapSmaller ? overlapWidth * xOverlapDirection : 0, isXOverlapSmaller ? 0 : overlapHeight * yOverlapDirection);
			}
			else if (isXMoving) {
				return new Vector(overlapWidth * (player.entity.currentMovement.x > 0 ? -1 : 1), 0);
			}
			else if (isYMoving) {
				return new Vector(0, overlapHeight * (player.entity.currentMovement.y > 0 ? -1 : 1));
			}
		}
	};

	AirMindedTimes.collision = {
		ObstacleCollisionListener: ObstacleCollisionListener
	};
})(Game, AirMindedTimes, Vector);
