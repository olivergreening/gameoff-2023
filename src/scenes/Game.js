import Phaser from 'phaser';
import Consts from '../consts';
import Player from '../actors/Player';
import Npc from '../actors/Npc';
import Police from '../actors/Police';
import { World } from '../world';

const MAX_POLICE = 1;
const MAX_NPC = 1;

export class Game extends Phaser.Scene {
	constructor() {
		super('Game');
	}

	create() {
		this.player = new Player(this);
		this.npcs = [];
		this.police = [];

		for (let i = 0; i < MAX_NPC; i++) {
			const npc = new Npc(this);
			this.npcs.push(npc);
		}
		
		for (let i = 0; i < MAX_POLICE; i++) {
			const police = new Police(this, this.player);
			police.setLane(1);
			this.police.push(police);
		}
		
		this.cameras.main.startFollow(this.player);
		this.cameras.main.setBounds(0, 0, 40000, Consts.screenHeight);

		this.world = new World(this, this.player);
		this.world.generate();
	}

	gameOver() {
		this.scene.start('Lose');
	}

	update(time, delta) {
		this.player.update(time, delta);
		this.world.update(time, delta);
		this.npcs.forEach((npc) => npc.update(time, delta));
		this.police.forEach((police) => police.update(time, delta));
	}
}
