import Phaser from 'phaser';

const DEFAULT_HEALTH = 100;

export default class BaseActor extends Phaser.GameObjects.Sprite {
	constructor(scene) {
		super(scene);
		this.maxHealth = DEFAULT_HEALTH;
		this.health = DEFAULT_HEALTH;
		scene.add.existing(this);
	}

	setHealth(target) {
		if (target >= 0 && target <= 100) {
			this.health = target;
		}
	}
}
