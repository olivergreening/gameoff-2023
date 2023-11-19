import Phaser from 'phaser';
import Consts from '../consts';
import Player from '../actors/Player';
import { Road } from '../world';

export class Game extends Phaser.Scene {
	constructor() {
		super('Game');
	}

	create() {
		this.player = new Player(this, 'player');
		this.cameras.main.startFollow(this.player);
		this.cameras.main.setBounds(0, 0, 80000, Consts.screenHeight);
		this.cameras.main.worldView.centerX
		
		this.road = new Road(this);
		this.road.generate();

		this.stripes = [];
		
		let x = 0;
		
		for (var i = 0; i < 625; i++) {
			const stripe = this.add.rectangle(x, 600, 64, 64, 0x0000ff).setOrigin(0, 1);
			this.stripes.push(stripe);
			x += 128;
		}
	}

	update(time, delta) {
		this.player.update(time, delta);

		this.road.update(this.player);
	}
}
