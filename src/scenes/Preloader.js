import Phaser from 'phaser';
import Consts from '../consts';

export class Preloader extends Phaser.Scene {
	constructor() {
		super('Preloader');
	}

	create() {
		if (Consts.scene) {
			this.scene.start(Consts.scene);
		} else {
			this.scene.start('Menu');
		}
	}

	preload() {
		// fonts
		this.load.bitmapFont(Consts.font, './fonts/m6x11/m6x11_no_aa.png', './fonts/m6x11/m6x11_no_aa.xml');

		// images
		this.load.image('menu_bkg_1', './images/1.png');
		this.load.image('menu_bkg_2', './images/3.png');

		// spritesheets

		// audio sfx

		// music
	}
}
