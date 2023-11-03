import Phaser from 'phaser';
import BaseEntity from './BaseEntity';
import Consts from '../consts';

export default class Player extends BaseEntity {
	constructor(scene, x, y, w, h, fill) {
		super(scene, x, y, w, h, fill);
		this.currentLane = 0;
	}

	switchLaneUp() {
		if (this.active) {
			if (this.currentLane < 6) {
				this.currentLane++;
				this.y = this.currentLane * Consts.laneHeight;
				return;
			}
			return this.debug();
		}
	}

	switchLaneDown() {
		if (this.active) {
			if (this.active && this.currentLane > 0) {
				this.currentLane--;
				this.y = this.currentLane * Consts.laneHeight;
				return;
			}
			return this.debug();
		}
	}
}
