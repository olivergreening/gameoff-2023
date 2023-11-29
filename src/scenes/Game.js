import Phaser from 'phaser';
import Consts from '../consts';
import Audio from '../audio';
import Player from '../actors/Player';
import VehicleCollisionExplosion from '../effects/VehicleCollisionExplosion';
import { World } from '../world';

const MAX_POLICE = 1;
const MAX_NPC = 50;

let money = 10000000;
let destructionCaused = 0;

export class Game extends Phaser.Scene {
	constructor() {
		super('Game');
	}

	create() {
		this.audio = new Audio(this);
		this.audio.playMusic('music-play', { vol: 0, loop: true });
		this.audio.fadeIn(null, { duration: 2000, maxVol: 0.5 });

		this.explosion = new VehicleCollisionExplosion(this);
		this.player = new Player(this);

		this.cameras.main.startFollow(this.player);
		this.cameras.main.setBounds(0, 0, Consts.worldWidth, Consts.screenHeight);

		this.world = new World(this, this.player);
		this.world.generate();

		// collision detection for world objects
		this.world.addObstaclesCollider(this.player, () => {
			this.onPlayerHit();
		});
		
		// collision detection for world npcs
		this.world.addNpcsCollider(this.player, (npc) => {
			this.onPlayerHit();
			const explosionX = npc.x + npc.width / 2;
			const explosionY = npc.y - npc.height / 2;
			this.explosion.playDefault(explosionX, explosionY);
			npc.preDestroy();
		});
	}

	onPlayerHit() {
		if (!this.player.states.isBig) {
			this.player.setHealth(this.player.health - 2);
			this.screenShake();
		}
	}

	gameOver() {
		this.world.removeColliders();
		this._gameover = true; // player is no longer in control

		this.audio.fadeOut(() => console.log('test'), { duration: 750 });
		this.cameras.main.once('camerafadeoutcomplete', () =>
			this.scene.start('Gameover', {
				// TODO: pass player score and stats for the game over screen
				score: 0
			}),
		);
		this.cameras.main.fadeOut(1000, 0);			
	}

	screenShake(time, intensity) {
		this.cameras.main.shake(time, intensity);
	}
	
	update(time, delta) {
		this.world.update(time, delta);
		this.player.update(time, delta);

		if (this._gameover) {
			return;
		}

		if (this.player.health == 0) {
			this.gameOver();
		}
	}
}
