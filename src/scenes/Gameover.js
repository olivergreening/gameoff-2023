import Phaser from 'phaser';
import Consts from '../consts';
import { Controls } from '../controls';
import Audio from '../audio';

const W = Consts.screenWidth,
	H = Consts.screenHeight;
const W_2 = Consts.screenWidth * 0.5,
	H_2 = Consts.screenHeight * 0.5;

export class Gameover extends Phaser.Scene {
	constructor() {
		super('Gameover');
	}

	init(data) {
		console.debug('(gameover)', data);

		this.score = data.score || 0;
	}

	create() {
		this.controls = new Controls(this.input);
		this.audio = new Audio(this);

		this.cameras.main.fadeIn(500, 255, 255, 255);

		this.tileback1 = this.add.tileSprite(W_2, H_2, W, H, 'menu_bkg_1');
		this.tileback2 = this.add.tileSprite(
			W_2,
			H - 324 * 0.5,
			W,
			324,
			'menu_bkg_2',
		);

		let text01 = this.score > 0 ? `Congratulations!` : `Oh, no!`;
		let text02 = this.score > 0 ? `You managed to get away` : `You were caught! See you in 25 years`;

		this.add.bitmapText(
			Consts.screenWidth * 0.5,
			Consts.screenHeight * 0.5 - 200,
			Consts.font,
			text01,
			48,
		).setOrigin(0.5);

		this.add.bitmapText(
			Consts.screenWidth * 0.5,
			Consts.screenHeight * 0.5 - 150,
			Consts.font,
			text02,
			28,
		).setOrigin(0.5);

		// TODO:
		// if (this.score > 0) {
		// 	this.add.bitmapText(
		// 		Consts.screenWidth * 0.5,
		// 		Consts.screenHeight * 0.5 - 100,
		// 		Consts.font,
		// 		'Enter your initials for the high-scores',
		// 		28,
		// 	).setOrigin(0.5);
		// }
	}

	update(time, delta) {
		this.controls.update(time);

		if (this.controls.action1.isPressed) {
			this.audio.playSound('menu-select-hard');
			this.cameras.main.once('camerafadeoutcomplete', () =>
				this.scene.start('Menu'),
			);
			this.cameras.main.fadeOut(800, 0);
		}
	}
}
