import Phaser from 'phaser';

import Consts from './consts';
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
			arcade: {
				debug: true,
			},
		},
		scene: [
			Scenes.Preloader,
			Scenes.Intro,
			Scenes.Menu,
			Scenes.Transition,
			Scenes.Game,
			Scenes.Gameover,
		],
		render: {
			pixelArt: true,
		},
	};

	const game = new Phaser.Game(config);
};
