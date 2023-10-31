import Phaser from 'phaser';

export class Preloader extends Phaser.Scene {
	constructor() {
		super('Preloader');
	}

	preload() {
		this.load.image('agent', 'sprites/agent.png');
        this.load.image('tileset01', 'tiles/tileset01.png');
        this.load.tilemapTiledJSON('level1', 'levels/01.tmj');
		this.load.spritesheet('agent_anim', 'sprites/agent.png', { frameWidth: 64, frameHeight: 64 });
	}

	create() {
		this.scene.start('Game');
	}
}
