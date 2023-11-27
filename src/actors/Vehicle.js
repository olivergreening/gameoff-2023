import Phaser from 'phaser';
import BaseActor from './BaseActor';
import Consts from '../consts.js';

export default class Player extends BaseActor {
	constructor(scene) {
		super(scene);

		this.lane = 0;
	}

	calculateLaneY(target) {
		return Consts.laneStartY + 22 + target * 32;
	}

	setLane(target) {
		this.depth = target;
		this.lane = target;
		this.y = this.calculateLaneY(this.lane);
	}

	checkForCollision(obj) {
		return false;
	}
}
