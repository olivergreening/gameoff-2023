import Phaser from 'phaser';
import Vehicle from './Vehicle';
import Audio from '../audio';
import { Controls } from '../controls';

export default class Npc extends Vehicle {
	constructor(scene) {
		super(scene);

		this.speed = 10;

		this.init();
	}

	init() {
		this.x = 0;
		this.setLane(0);
		this.setOrigin(0, 1);

		switch (Phaser.Math.Between(0, 4)) {
			case 0:
				this.setTexture('couple_car');
				this.setTint;
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
	}

	update(time, delta) {
		this.x += this.speed;
	}
}
