import Phaser from 'phaser';
import Consts from '../consts';
import Player from '../actors/Player';
import { World } from '../world';

export class Game extends Phaser.Scene {
	constructor() {
		super('Game');
	}

	create() {
		this.player = new Player(this);
		
		// TEMPORARY: just to show player's speed
		this.speedHud = this.add.rectangle(800, 600, 800, 50, 0x00ff00, 1);
		this.speedHud.setOrigin(1, 1);
		
		this.cameras.main.startFollow(this.player);
		this.cameras.main.setBounds(0, 0, 80000, Consts.screenHeight);
		this.cameras.main.worldView.centerX

		this.world = new World(this, this.player);
		this.world.generate();
	}

	update(time, delta) {
		this.player.update(time, delta);
		this.world.update(time, delta);
		
		this.speedHud.x += this.player.speed;
		this.speedHud.width = (800 * (this.player.speed * 10)) / 200;
	}
}
