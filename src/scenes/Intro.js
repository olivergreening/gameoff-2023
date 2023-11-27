import Phaser from 'phaser';
import Consts from '../consts';
import Audio from '../audio';
import { Controls } from '../controls';

export class Intro extends Phaser.Scene {
	constructor() {
		super('Intro');
	}

	create() {
		this.controls = new Controls(this.input);
		this.audio = new Audio(this);

		this.cameras.main.fadeIn(1500, 255, 255, 255);
		this.cameras.main.once('camerafadeincomplete', () =>
			this.time.addEvent({
				delay: 2000,
				callback: () => this.scene.start('Menu'),
			}),
		);

		this.add
			.image(Consts.screenWidth * 0.5, Consts.screenHeight * 0.5, 'title')
			.setOrigin(0.5)
			.setScale(3);

		this.add
			.bitmapText(
				Consts.screenWidth * 0.5,
				Consts.screenHeight - 50,
				Consts.font,
				'Press space to continue...',
				24,
			)
			.setOrigin(0.5);
	}

	update(time, delta) {
		this.controls.update(time);

		if (this.controls.action1.isPressed) {
			this.audio.playSound('menu-select-hard');
			this.scene.start('Menu');
		}
	}
}
