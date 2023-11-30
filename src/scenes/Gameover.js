import Phaser from 'phaser';
import Consts from '../consts';
import Utils from '../utils';
import { Controls } from '../controls';
import Audio from '../audio';

const FONT_SIZE = 28;
const W = Consts.screenWidth,
	H = Consts.screenHeight;
const W_2 = Consts.screenWidth * 0.5,
	H_2 = Consts.screenHeight * 0.5;

export class Gameover extends Phaser.Scene {
	constructor() {
		super('Gameover');
	}

	init(data) {
		Utils.assert('(gameover data', data);
		this.data = data;
		this.win = data.money > 0;
	}

	create() {
		this.controls = new Controls(this.input);
		this.audio = new Audio(this);
		this.audio.stop();

		this.cameras.main.fadeIn(Consts.cameraFadeDelay, 255, 255, 255);

		this.tileback1 = this.add.tileSprite(W_2, H_2, W, H, 'menu_bkg_1');
		this.tileback2 = this.add.tileSprite(
			W_2,
			H - 324 * 0.5,
			W,
			324,
			'menu_bkg_2',
		);

		let text01 = this.win ? `Congratulations!` : `Oh, no!`;
		let text02 = this.win ? `You managed to get away` : `You were caught! See you in 25 years`;

		this.add.bitmapText(
			Consts.screenWidth * 0.5,
			Consts.screenHeight * 0.5 - 200,
			Consts.font,
			text01,
			FONT_SIZE + 20,
		).setOrigin(0.5);

		this.add.bitmapText(
			Consts.screenWidth * 0.5,
			Consts.screenHeight * 0.5 - 150,
			Consts.font,
			text02,
			FONT_SIZE,
		).setOrigin(0.5);

		const stats = [
			{
				text: 'Money',
				value: this.data.money
			},
			{
				text: 'Money lost',
				value: this.data.moneyLost
			},
			{
				text: 'Distance travelled',
				value: this.data.distanceTravelled
			},
			{
				text: 'Average speed',
				value: Phaser.Math.RoundTo(this.data.averageSpeed)
			}
		];

		stats.forEach((entry, idx) => {
			this.add.bitmapText(
				Consts.screenWidth * 0.5 - 120,
				Consts.screenHeight * 0.5 - 80 + (idx * (FONT_SIZE + 10)),
				Consts.font,
				entry.text + ': ' + entry.value,
				FONT_SIZE,
			).setOrigin(0);
		});
	}

	update(time, delta) {
		this.controls.update(time);

		if (this.controls.action1.isPressed) {
			this.audio.playSound('menu-select-hard');
			this.cameras.main.once('camerafadeoutcomplete', () =>
				this.scene.start('Menu'),
			);
			this.cameras.main.fadeOut(Consts.cameraFadeDelay, 0);
		}
	}
}
