import Phaser from 'phaser';
import Consts from '../consts';
import Audio from '../audio';

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
		this.createLoadingBar();

		// fonts
		this.load.bitmapFont(Consts.font, './fonts/m6x11/m6x11_no_aa.png', './fonts/m6x11/m6x11_no_aa.xml');

		// images
		this.load.image('menu_bkg_1', './images/1.png');
		this.load.image('menu_bkg_2', './images/3.png');
		this.load.image('road_tiles', './sprites/tilemaps-and-additive/roadtilemap16x16.png');

		// spritesheets
		this.load.spritesheet('player_car', './sprites/player-car/76x76.png', { frameWidth: 76, frameHeight: 76 });

		// audio sfx and music
		Audio.load(this.load);
	}

	createLoadingBar() {
		const progress = this.add.graphics();

		this.load.on('progress', (value) => {
			progress.clear();
			progress.fillStyle(0xffffff, 1);
			progress.fillRect(0, Consts.screenHeight * 0.5 - 10,
				Consts.screenWidth * value, 20);
		});

		this.load.on('complete', () => progress.destroy());
	}
}
