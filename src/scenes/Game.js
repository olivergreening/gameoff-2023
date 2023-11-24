import Phaser from 'phaser';
import Consts from '../consts';
import Player from '../actors/Player';
import Npc from '../actors/Npc';
import Police from '../actors/Police';
import { World } from '../world';

const MAX_POLICE = 1;
const MAX_NPC = 50;

export class Game extends Phaser.Scene {
	constructor() {
		super('Game');
	}

	create() {
		this.player = new Player(this);
		this.npcs = [];
		this.police = [];

		let npcX;
		
		for (let lane = 0; lane < Consts.lanes + 1; lane++) {
			for (let i = 0; i < MAX_NPC; i++) {
				const npc = new Npc(this, this.player);
				npc.x = Math.random() * (Consts.worldWidth - 0) + 0;
				npc.setLane(lane);
				npc.speed *= Math.random() * (1.05 - 0.95) + 0.95;
				this.npcs.push(npc);
				npcX = npc.x;
			}
		}
		
		
		for (let i = 0; i < MAX_POLICE; i++) {
			const police = new Police(this, this.player);
			this.police.push(police);
		}
		
		this.cameras.main.startFollow(this.player);
		this.cameras.main.setBounds(0, 0, Consts.worldWidth, Consts.screenHeight);

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
