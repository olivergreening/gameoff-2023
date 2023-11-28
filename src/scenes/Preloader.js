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
		this.load.image(
			'sidewalk_tiles',
			'./sprites/tilemaps-and-additives/tilemap-down-environment-32x32.png'
		);
		this.load.image('trap_fakehole', './sprites/traps/fall/fakehole-trap-84x64.png');
		this.load.image('trap_hole', './sprites/traps/fall/hole-trap-46x20.png');
		this.load.image('trap_banana_01', './sprites/traps/spin/banana-trap-32x32-01.png');
		this.load.image('trap_banana_02', './sprites/traps/spin/banana-trap-32x32-02.png');
		this.load.image('trap_banana_03', './sprites/traps/spin/banana-trap-32x32-03.png');
		this.load.image('trap_banana_04', './sprites/traps/spin/banana-trap-32x32-04.png');
		this.load.image('trap_banana_04', './sprites/traps/spin/banana-trap-32x32-04.png');
		// this.load.image('trap_road_v_block', './sprites/traps/stop/roadblock-vertical-trap-52x52.png');

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
		this.load.spritesheet('trap_road_h_block', './sprites/traps/stop/roadblock-horizontal-trap-52x52.png',
			{ frameWidth: 52, frameHeight: 52 });
		this.load.spritesheet('trap_road_pole', './sprites/traps/stop/road-stick-trap-32x32.png',
			{ frameWidth: 32, frameHeight: 32 });

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
