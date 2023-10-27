import Phaser from 'phaser';

import * as Scenes from './scenes';

window.onload = function () {
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        input: {
            gamepad: false,
            keyboard: true
        },
        scene: [Scenes.Preloader, Scenes.Menu, Scenes.Settings, Scenes.Game, Scenes.Credits]
    };
    
    const game = new Phaser.Game(config);
};