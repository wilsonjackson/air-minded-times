/* global Game, AirMindedTimes, Vector */

(function (Game, AirMindedTimes, Vector) {
	'use strict';

	var EntityCategory = Game.physics.EntityCategory;
	var Orientation = Game.physics.Orientation;
	var Input = Game.input.Input;
	var Inventory = Game.inventory.Inventory;
	var ObjectType = Game.objects.ObjectType;

	var PlaneSelection = {
		plane: new AirMindedTimes.planes.GREEN_WONDERFUL()
	};

	function Player() {
		this.type = ObjectType.PLAYER;
		this.entityCategory = EntityCategory.PLAYER;
		this.movement = new AirMindedTimes.controls.PlayerMovement();
		this.plane = PlaneSelection.plane;
		this.sprite = this.plane.sprite;
		this.inventory = new Inventory();
		this.speed = 4;
	}

	Player.prototype = new Game.objects.SpriteObject();

	Player.prototype._init = function () {
		var self = this;
		this.entity.addCollisionListener({
			solveCollision: function (collision) {
				if (collision.entity.category.isA(EntityCategory.OBSTACLE)) {
					if (self.entity.isRotated) {
						if (self.entity.lastOrientation === Orientation.NORTH || self.entity.lastOrientation === Orientation.SOUTH) {
							return new Vector(0, collision.intersection.height() * (self.entity.getY() < collision.intersection.top() ? -1 : 1));
						}
						else if (self.entity.lastOrientation === Orientation.EAST || self.entity.lastOrientation === Orientation.WEST) {
							return new Vector(collision.intersection.width() * (self.entity.getX() < collision.intersection.left() ? -1 : 1), 0);
						}
					}
					if (self.entity.currentMovement.x !== 0) {
						return new Vector(collision.intersection.width() * (self.entity.currentMovement.x > 0 ? -1 : 1), 0);
					}
					if (self.entity.currentMovement.y !== 0) {
						return new Vector(0, collision.intersection.height() * (self.entity.currentMovement.y > 0 ? -1 : 1));
					}
				}
			},
			collide: function (collision) {
				if (collision.entity.category.isA(EntityCategory.ITEM)) {
					self.inventory.get(collision.entity.object.item).add();
					collision.entity.object.destroy();
				}
			}
		});
	};

	Player.prototype._destroy = function () {
		this.movement.destroy();
		delete this.movement;
		delete this.plane;
		delete this.inventory;
	};

	Player.prototype.update = function (world, inputState) {
		this.movement.update(this, world, inputState);
		if (inputState.isPressed(Input.ACTION)) {
			this.plane.fire(this.entity, this.entity.getOrientation(), world);
		}
		this.plane.update(world, inputState);
		this.sprite.update();
	};

	Game.objects.ObjectFactory.register('player', Player);

	AirMindedTimes.player = {
		PlaneSelection: PlaneSelection
	};
})(Game, AirMindedTimes, Vector);
