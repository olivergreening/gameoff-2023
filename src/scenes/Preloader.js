import Phaser from 'phaser';

export class Preloader extends Phaser.Scene {
	constructor() {
		super('Preloader');
	}

	preload() {
		this.load.image('bg', '/sprites/bg.jpg');
	}

	create() {
		this.scene.start('Menu');
	}
}
