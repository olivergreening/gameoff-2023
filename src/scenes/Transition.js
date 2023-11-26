import Phaser from 'phaser';
import Consts from '../consts';
import Audio from '../audio';
import { Controls } from '../controls';

export class Transition extends Phaser.Scene {
	constructor() {
		super('Transition');
	}

	create() {
		this.audio = new Audio(this);
		this.controls = new Controls(this.input);

		// todo: add a background image instead
		this.add
			.rectangle(0, 0, Consts.screenWidth, Consts.screenHeight, 0x5079bf)
			.setOrigin(0);

		this.add
			.bitmapText(
				Consts.screenWidth * 0.5,
				Consts.screenHeight * 0.5 - 50,
				Consts.font,
				'Get ready to escape!',
				48,
			)
			.setOrigin(0.5);
		this.add
			.bitmapText(
				Consts.screenWidth * 0.5,
				Consts.screenHeight - 50,
				Consts.font,
				'Press space to continue...',
				24,
			)
			.setOrigin(0.5);

		this.countdownText = this.add.bitmapText(
			Consts.screenWidth * 0.5,
			Consts.screenHeight - 150,
			Consts.font,
			'10',
			24,
		);
		this.countdownText.setOrigin(0.5);

		this.countdown = 10;

		this.tween = this.tweens.addCounter({
			from: 5,
			to: 0,
			duration: 1000,
			yoyo: false,
			repeat: 10,
			onStart: () => this.audio.playSound('menu-select-soft'),
			onUpdate: (tween) => {
				this.countdownText.scale = 1 + tween.getValue();
			},
			onRepeat: () => {
				const count = this.countdown;
				if (count > 1) {
					this.countdownText.setText(count - 1);
				} else if (count === 1) {
					this.countdownText.setText('GO');
				} else if (count === 0) {
				}

				this.audio.playSound('menu-select-soft');

				this.countdown -= 1;
			},
			onComplete: () => {
				this.scene.start('Game');
			},
		});
	}

	update(time, delta) {
		this.controls.update(time);

		if (this.controls.action1.isPressed) {
			this.audio.playSound('menu-select-hard');
			this.tween.stop();
			this.cameras.main.once('camerafadeoutcomplete', () =>
				this.scene.start('Game'),
			);
			this.cameras.main.fadeOut(800, 0);
		}
	}
}
