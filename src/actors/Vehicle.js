import Phaser from 'phaser';
import BaseActor from './BaseActor';
import Consts from '../consts';

export default class Player extends BaseActor {
	constructor(scene) {
		super(scene);
		this.lane = 0;
		this.lastLane = 0;
	}

	calculateLaneY(target) {
		return Consts.laneStartY + 22 + target * 32;
	}

	setLane(target) {
		this.depth = target;
		this.lastLane = this.lane;
		this.lane = target;
		this.y = this.calculateLaneY(this.lane);
	}
}
