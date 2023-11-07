import Phaser from 'phaser';

import Consts from './consts';
import Utils from './utils';
import * as Scenes from './scenes';

window.onload = function () {
	const config = {
		type: Phaser.AUTO,
		width: Consts.screenWidth,
		height: Consts.screenHeight,
		input: {
			gamepad: false,
			keyboard: true,
		},
		physics: {
			default: 'arcade',
			arcade: {},
		},
		scene: [
			Scenes.Preloader,
			Scenes.Transition,
			Scenes.Menu,
			Scenes.Game,
			Scenes.Win,
			Scenes.Lose,
		],
		render: {
			pixelArt: true,
		},
	};

	const game = new Phaser.Game(config);
};
