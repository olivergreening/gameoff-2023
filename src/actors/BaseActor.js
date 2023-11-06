import Phaser from 'phaser';

export default class BaseActor extends Phaser.GameObjects.Sprite {
	constructor(scene, texture) {
		super(scene, 0, 0, texture, 0);
		scene.add.existing(this);
	}

	debug() {}
}
