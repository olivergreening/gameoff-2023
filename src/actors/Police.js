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
		
		this.speed = 10;
		
		this.init();
	}
	
	init() {
		this.x = 0;
		this.setLane(0);
		this.setOrigin(0, 1);
		
		if (Phaser.Math.Between(0, 1) == 0) {
			this.setTexture('police_car');
		} else {
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
		if (this.player.lane != this.lane) {
			if (this.player.lane > this.lane) {
				this.downLane();
			} else {
				this.upLane();
			}
		}
	}
}