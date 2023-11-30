import Phaser from 'phaser';

const DEFAULT_HEALTH = 100;

export default class BaseActor extends Phaser.GameObjects.Sprite {
	constructor(scene) {
		super(scene);
		this.maxHealth = DEFAULT_HEALTH;
		this.health = DEFAULT_HEALTH;
		this.scene.add.existing(this);
		this.scene.physics.add.existing(this, false);
	}

	setHealth(target) {
		if (target >= 0 && target <= 100) {
			this.health = target;
		}
	}
}
