import Phaser from 'phaser';
import Vehicle from './Vehicle';
import Consts from '../consts.js';
import Audio from '../audio';
import { Controls } from '../controls';

export default class Npc extends Vehicle {
	constructor(scene) {
		super(scene);

		this.states = {
			isLaneSwitchAllowed: true,
		};
		
		this.speed = 8;

		this.init();
	}

	init() {
		this.x = 0;
		this.setLane(0);
		
		switch (Phaser.Math.Between(0, 4)) {
			case 0:
				this.setSize(46, 29, 15, 24);
				this.setDisplayOrigin(9, 27);
				this.setTexture('couple_car');
				break;
			case 1:
				this.setSize(58, 52, 11, 10);
				this.setDisplayOrigin(8.5, 52);
				this.setTexture('ice_cream_car');
				break;
			case 2:
				this.setSize(41, 30, 17, 23);
				this.setDisplayOrigin(9.5, 27.5);
				this.setTexture('mini_car');
				break;
			case 3:
				this.setSize(50, 28, 13, 24);
				this.setDisplayOrigin(8.5, 25.75);
				this.setTexture('muscle_car');
				break;
			case 4:
				this.setSize(45, 32, 15, 22);
				this.setDisplayOrigin(9, 30);
				this.setTexture('sedan_car');
				break;
		}
		
		this.visible = true;
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
	
	update(time, delta) {
		this.x += this.speed;
	}
}
