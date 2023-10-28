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
            keyboard: true
        },
        scene: [Scenes.Preloader, Scenes.Menu, Scenes.Settings, Scenes.Game, Scenes.Credits]
    };
    
    const game = new Phaser.Game(config);
};