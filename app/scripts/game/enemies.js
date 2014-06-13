/* globals ObjectFactory, ObjectType, SpriteObject, SpriteRepository, SpriteAnimator, EntityCategory */

(function () {
	'use strict';

	function ShellEnemy() {
		this.type = ObjectType.ENEMY;
		this.entityCategory = EntityCategory.ENEMY;
		this.sprite = new SpriteAnimator(25, [
			SpriteRepository.retrieve('enemy/shell'),
			SpriteRepository.retrieve('enemy/shell-2')
		]);
	}

	ShellEnemy.prototype = new SpriteObject();

	ShellEnemy.prototype._init = function () {
		var self = this;
		this.entity.addCollisionListener(function (collision) {
			if (collision.entity.category === EntityCategory.PROJECTILE) {
				self.destroy();
				collision.entity.object.destroy();
			}
		});
	};

	ShellEnemy.prototype.update = function () {
		this.sprite.update();
	};

	ObjectFactory.register('shell-enemy', ShellEnemy);
})();
