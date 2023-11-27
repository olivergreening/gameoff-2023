import Phaser from 'phaser';
import Vehicle from './Vehicle';
import Consts from '../consts.js';

export default class Npc extends Vehicle {
	constructor(scene, player, police, npcs) {
		super(scene);

		this.player = player;
		this.police = police;
		this.npcs = npcs;

		this.states = {
			isLaneSwitchAllowed: true,
			collisionWithPlayer: false,
			collisionWithPolice: false,
			collisionWithNpcs: false,
		};

		this.speed = 8;

		this.init();
	}

	init() {
		this.x = 0;
		this.setLane(0);
		this.setOrigin(0, 1);

		switch (Phaser.Math.Between(0, 4)) {
			case 0:
				this.setTexture('couple_car');
				break;
			case 1:
				this.setTexture('ice_cream_car');
				break;
			case 2:
				this.setTexture('mini_car');
				break;
			case 3:
				this.setTexture('muscle_car');
				break;
			case 4:
				this.setTexture('sedan_car');
				break;
		}

		this.visible = true;
	}

	destroy(arr, i) {
		this.arr.splice(i);
	}

	upLane() {
		if (this.lane > 0) {
			const target = this.lane - 1;
			const tween = {
				targets: this,
				y: this.calculateLaneY(target),
				duration: 200,
				ease: 'Quadratic.In',
				onStart: () => {
					this.states.isLaneSwitchAllowed = false;
				},
				onComplete: () => {
					this.setLane(target);
					this.states.isLaneSwitchAllowed = true;
				},
			};

			this.scene.tweens.add(tween);
			return;
		}
	}

	downLane() {
		if (this.lane < Consts.lanes) {
			const target = this.lane + 1;
			const tween = {
				targets: this,
				y: this.calculateLaneY(target),
				duration: 200,
				ease: 'Quadratic.In',
				onStart: () => {
					this.states.isLaneSwitchAllowed = false;
				},
				onComplete: () => {
					this.setLane(target);
					this.states.isLaneSwitchAllowed = true;
				},
			};

			this.scene.tweens.add(tween);
			return;
		}
	}

	preUpdate(time, delta) {
		this.states.collisionWithPlayer = this.checkForCollision(this.player);
		this.states.collisionWithPolice = this.checkForCollision(this.police);
		this.states.collisionWithNpcs = this.checkForCollision(this.npcs);
	}

	update(time, delta) {
		if (this.x > Consts.worldWidth) {
			this.x = 0;
		}

		this.x += this.speed;
	}
}
