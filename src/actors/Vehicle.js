import Phaser from 'phaser';
import BaseActor from './BaseActor';

export default class Player extends BaseActor {
	constructor(scene, texture) {
		super(scene, texture);
		this.lane = 0;
	}

	calculateLaneY(target) {
		return 0 + target * 64;
	}
	
	setLane(target) {
		this.lane = target;
		this.y = this.calculateLaneY(this.lane);
	}
}
