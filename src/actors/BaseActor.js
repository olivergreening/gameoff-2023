import Phaser from 'phaser';

export default class BaseActor extends Phaser.GameObjects.Sprite {
	constructor(scene) {
		super(scene, 0, 0);

		this.health = 100;

		scene.add.existing(this);
	}

	setHealth(target) {
		if (target >= 0 && target <= 100) {
			this.health = target;
		}
	}
}
