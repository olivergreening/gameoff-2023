import Phaser from 'phaser';
import Consts from '../consts';
import Audio from '../audio';
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
		this.player = new Player(this, this.police, this.npcs);
		this.npcs = [];
		this.police = [];

		for (let lane = 0; lane < Consts.lanes + 1; lane++) {
			for (let i = 0; i < MAX_NPC; i++) {
				const npc = new Npc(this, this.player, this.police, this.npcs);
				npc.x = Math.random() * (Consts.worldWidth - 0) + 0;
				npc.setLane(lane);
				npc.speed *= Math.random() * (1.05 - 0.95) + 0.95;
				this.npcs.push(npc);
			}
		}

		for (let i = 0; i < MAX_POLICE; i++) {
			const police = new Police(this, this.player, this.npcs);
			this.police.push(police);
		}

		this.cameras.main.startFollow(this.player);
		this.cameras.main.setBounds(0, 0, Consts.worldWidth, Consts.screenHeight);

		this.world = new World(this, this.player);
		this.world.generate();

		this.audio = new Audio(this);
		this.audio.setMusicVol('music-play', 0);
		this.audio.playMusic('music-play', { loop: true });
		this.audio.fadeIn(null, { duration: 2000, maxVol: 0.55 });
	}

	gameOver() {
		this.scene.start('Lose');
	}

	update(time, delta) {
		this.player.update(time, delta);
		this.world.update(time, delta);
		this.police.forEach((police) => police.update(time, delta));
		this.npcs.forEach((npc, i) => {
			if (npc.states.hasCollisionWithPlayer) {
				npc.destroy(this.npcs, i);
			}

			npc.update(time, delta);
		});
	}
}
