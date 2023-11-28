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
	
	checkForCollision(actor) {
		if (this.lane == actor.lane && this.x + this.width >= actor.x && this.x <= actor.x + actor.width) {
			return true;
		}
		
		return false;
	}
}
