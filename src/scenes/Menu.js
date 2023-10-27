import Phaser from 'phaser'

export class Menu extends Phaser.Scene {

    constructor() {
        super('Menu');

        this.bg
    }

    create() {
        this.bg = this.add.tileSprite(0, 0, 800, 600, 'bg').setOrigin(0);
    }

    update(time, delta) {

    }
}