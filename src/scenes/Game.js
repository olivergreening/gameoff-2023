import Phaser from 'phaser';
import Consts from '../consts';
import Player from '../actors/Player';
import { World } from '../world';

const MAX_POLICE = 1;
const MAX_NPC_PER_LANE = 100;

export class Game extends Phaser.Scene {
	constructor() {
		super('Game');
	}

	create() {
		this.player = new Player(this);
		this.npcs = [];
		this.police = [];

		this.cameras.main.startFollow(this.player);
		this.cameras.main.setBounds(0, 0, 80000, Consts.screenHeight);
		this.cameras.main.worldView.centerX

		this.world = new World(this, this.player);
		this.world.generate();
	}

	gameOver() {
		this.scene.start('Lose');
	}
	
	update(time, delta) {
		this.player.update(time, delta);
		this.world.update(time, delta);
	}
}
