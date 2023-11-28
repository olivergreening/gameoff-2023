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
			this.scene.start('Intro');
		}
	}

	preload() {
		this.createLoadingBar();

		// fonts
		this.load.bitmapFont(
			Consts.font,
			'./fonts/m6x11/m6x11_no_aa.png',
			'./fonts/m6x11/m6x11_no_aa.xml',
		);

		// images
		this.load.image('title', './images/smuglogo.png');
		this.load.image('menu_bkg_1', './images/1.png');
		this.load.image('menu_bkg_2', './images/3.png');
		this.load.image(
			'road_tiles',
			'./sprites/tilemaps-and-additives/road-tilemap-16x16.png',
		);
		this.load.atlas(
			'road_decals',
			'./sprites/decals/all-decals.png',
			'./sprites/decals/all-decals.json',
		);
		this.load.atlas(
			'road_weeds',
			'./sprites/tilemaps-and-additives/weeds.png',
			'./sprites/tilemaps-and-additives/weeds.json',
		);
		this.load.image('police_big_car', './sprites/cars/cop-big-car-50x38.png');
		this.load.image('police_car', './sprites/cars/cop-car-52x32.png');
		this.load.image('couple_car', './sprites/cars/couple-car-46x29.png');
		this.load.image('ice_cream_car', './sprites/cars/ice-cream-car-58x52.png');
		this.load.image('mini_car', './sprites/cars/mini-car-41x30.png');
		this.load.image('muscle_car', './sprites/cars/muscle-car-50x28.png');
		this.load.image('sedan_car', './sprites/cars/sedan-car-45x32.png');
		for (let i = 1; i <= 14; i++) {
			this.load.image(`player_car_${i}`, `./sprites/cars/player-car-${i}.png`);
		}

		// spritesheets
		this.load.spritesheet(
			'smoke_begin',
			'./sprites/particles/smoke-particle-begin-48x64.png',
			{ frameWidth: 48, frameHeight: 64 },
		);
		this.load.spritesheet(
			'smoke_loop',
			'./sprites/particles/smoke-particle-repeat-48x64.png',
			{ frameWidth: 48, frameHeight: 64 },
		);
		this.load.spritesheet(
			'car_collision',
			'./sprites/particles/car-collision-particle-48x48.png',
			{ frameWidth: 48, frameHeight: 48 },
		);

		// audio sfx and music
		Audio.load(this.load);
	}

	createLoadingBar() {
		const progress = this.add.graphics();

		this.load.on('progress', (value) => {
			progress.clear();
			progress.fillStyle(0xffffff, 1);
			progress.fillRect(
				0,
				Consts.screenHeight * 0.5 - 10,
				Consts.screenWidth * value,
				20,
			);
		});

		this.load.on('complete', () => progress.destroy());
	}
}
