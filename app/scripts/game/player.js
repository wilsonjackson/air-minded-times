(function (Game, AirMindedTimes) {
	'use strict';

	var EntityCategory = Game.physics.EntityCategory;
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
		this.collisionListener = new AirMindedTimes.collision.DelegatingCollisionListener(this);
		this.plane = PlaneSelection.plane;
		this.sprite = this.plane.sprite;
		this.inventory = new Inventory();
		this.speed = 4;
	}

	Player.prototype = new Game.objects.SpriteObject();

	Player.prototype._init = function () {
		this.entity.addCollisionListener(this.collisionListener);
	};

	Player.prototype._destroy = function () {
		this.movement.destroy();
		this.collisionListener.destroy();
		delete this.movement;
		delete this.collisionListener;
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
})(Game, AirMindedTimes);
