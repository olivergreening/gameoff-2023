import Phaser from 'phaser';
import Player from '../actors/Player';

export class Game extends Phaser.Scene {
	constructor() {
		super('Game');
	}

	create() {
		this.player = new Player(this);
	}

	update(time, delta) {
		this.player.update(this.time.now, this.time.delta);
	}
}
