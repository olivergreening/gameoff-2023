import Phaser from 'phaser';
import Vehicle from './Vehicle';
import Audio from '../audio';
import { Controls } from '../controls';

export default class Police extends Vehicle {
	constructor(scene, player) {
		super(scene);

		this.player = player;

		this.states = {
			isLaneSwitchAllowed: true,
		};

		this.speed = 8;

		this.init();
	}

	init() {
		this.x = 0;
		this.setLane(0);
		this.setOrigin(0, 1);

		if (1 == 1) {
			this.setSize(52, 32, 13, 23);
			this.setDisplayOrigin(9, 32);
			this.setTexture('police_car');
		} else {
			this.setSize(50, 38, 14, 18);
			this.setDisplayOrigin(9, 36.5);
			this.setTexture('police_big_car');
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

		return;
	}

	downLane() {
		if (this.lane < 3) {
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

		return;
	}

	update(time, delta) {
		this.x += this.speed;
	}
}
