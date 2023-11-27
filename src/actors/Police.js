import Phaser from 'phaser';
import Vehicle from './Vehicle';
import Consts from '../consts.js';

export default class Police extends Vehicle {
	constructor(scene, player, npcs) {
		super(scene);

		this.player = player;
		this.npcs = npcs;

		this.states = {
			isLaneSwitchAllowed: true,
			collisionWithPlayer: false,
			collisionWithNpcs: false,
		};

		this.speed = 8;

		this.init();
	}

	init() {
		this.x = 0;
		this.setLane(1);
		this.setOrigin(0, 1);

		switch (Phaser.Math.Between(0, 1)) {
			case 0:
				this.setTexture('police_car');
				break;
			case 1:
				this.setTexture('police_big_car');
				break;
		}
	}

	upLane() {
		if (this.lane > 0) {
			const target = this.lane - 1;
			const tween = {
				targets: this,
				y: this.calculateLaneY(target),
				duration: 400,
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
				duration: 400,
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
		this.states.collisionWithPlayer = this.checkForCollision(this, this.player);
		this.states.collisionWithNpcs = this.checkForCollision(this, this.npcs);
	}

	update(time, delta) {
		this.x += this.speed;
	}
}
