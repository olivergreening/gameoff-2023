import Phaser from 'phaser';

export default class BaseEntity extends Phaser.GameObjects.Rectangle {
	constructor(scene, x, y, w, h, fill) {
		super(scene, x, y, w, h, fill);
		scene.add.existing(this);
	}

	setHealth(to) {
		this.health = to;
	}

	kill() {
		this.setActive(false);
		this.setVisible(false);
	}

	debug() {
		return `Entity at (${this.x}, ${this.y}) with health ${this.health}`;
	}
}
