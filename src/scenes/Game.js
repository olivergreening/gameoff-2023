import Phaser from 'phaser';
import Consts from '../consts';
import Audio from '../audio';
import Player from '../actors/Player';
import VehicleCollisionExplosion from '../effects/VehicleCollisionExplosion';
import { World } from '../world';
import Hud from '../hud';

const MAX_POLICE = 1;
const MAX_NPC = 50;

export class Game extends Phaser.Scene {
	constructor() {
		super('Game');
		this._gameover = false;
	}

	create() {
		this.audio = new Audio(this);
		this.audio.playMusic('music-play', { vol: 0, loop: true });
		this.audio.fadeIn(null, { duration: 2000, maxVol: 0.5 });

		this.cameras.main.fadeIn(Consts.cameraFadeDelay, 255, 255, 255);

		this.explosion = new VehicleCollisionExplosion(this);
		this.player = new Player(this);

		this.hud = new Hud(this, this.player);
		this.hud.init();

		this.cameras.main.startFollow(this.player);
		this.cameras.main.setBounds(0, 0, Consts.worldWidth, Consts.screenHeight);
		this.cameras.main.postFX.addVignette(0.5, 0.5, 0.95);
		
		this.world = new World(this, this.player);
		this.world.generate();

		// collision detection for world objects
		this.world.addObstaclesCollider(this.player, () => {
			this.onPlayerHit();
			this.audio.playSound('explosion');
		});

		// collision detection for world npcs
		this.world.addNpcsCollider(this.player, (npc) => {
			this.onPlayerHit();
			const explosionX = npc.x + npc.width / 2;
			const explosionY = npc.y - npc.height / 2;
			this.explosion.playDefault(explosionX, explosionY);
			npc.preDestroy();
		});

		// have NPCs get destroyed if they collide with an obstacle
		this.world.addObstaclesToNPCsCollider((npc) => {
			const explosionX = npc.x + npc.width / 2;
			const explosionY = npc.y - npc.height / 2;
			this.explosion.playDefault(explosionX, explosionY);
			npc.preDestroy();
		});

		// collision detection for police
		this.world.addPoliceCollider(this.player, (police) => {
			this.gameOver(false);
		});
	}

	onPlayerHit() {
		if (!this.player.states.isBig) {
			this.player.setHealth(this.player.health - 2);
			this.screenShake();
		}
	}

	gameOver(win) {
		this._gameover = true; // player is no longer in control
		this.world.removeColliders();
		this.player.setVisible(false);

		this.audio.fadeOut({ duration: Consts.cameraFadeDelay });

		this.cameras.main.once('camerafadeoutcomplete', () =>
			this.scene.start('Gameover', {
				win: win,
				money: this.hud.formatMoney(this.hud.money),
				moneyLost: this.hud.formatMoney(this.hud.moneyLost),
				distance: this.hud.distance,
				distanceTravelled: this.hud.distanceTravelled,
				averageSpeed: this.hud.averageSpeed
			}),
		);

		this.cameras.main.fadeOut(Consts.cameraFadeDelay * 2, 0);
	}

	screenShake(time, intensity) {
		this.cameras.main.shake(time, intensity);
	}

	update(time, delta) {
		this.world.update(time, delta);
		this.hud.update(time, delta);

		if (this._gameover) {
			return;
		}

		this.player.update(time, delta);

		// game end condition: player either loses all the cash or max distance reached
		if (this.player.x > Consts.worldWidth) {
			this.gameOver(true);
		} else if (this.player.health <= 0) {
			this.gameOver(false);
		}

		if (Consts.debug && this.player.controls.action2.isPressed) {
			// DEBUG: end the game to check stats
			this.gameOver();
		}
	}
}
