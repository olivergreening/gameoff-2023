import Phaser from 'phaser'

export class Preloader extends Phaser.Scene {

    constructor() {
        super('Preloader');
    }

    preload() {
        this.load.image('bg', 'assets/bg/bg.jpg');
        // TODO: load assets
    }

    create() {
        this.scene.start('Menu');
    }
    
}