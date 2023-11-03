import Phaser from 'phaser';
import Vehicle from './Vehicle';
import Controls from '../controls';

export default class Player extends Vehicle {
	constructor(scene) {
		super(scene, 0, 0, 64, 64, 0xff0000);
		this.laneSwitchDelay = 100;
		this.lastLaneSwitchTime = 0;
		this.controls = new Controls(scene.input, true);
		this.arrowUp = this.scene.input.keyboard.addKey('W');
		this.arrowDown = this.scene.input.keyboard.addKey('S');
		this.setOrigin(0, 0);
	}

	preUpdate() {
		// collision logic
	}

	update(time, delta) {
		if (this.active) {
			if (
				this.controls.up &&
				time - this.lastLaneSwitchTime > this.laneSwitchDelay
			) {
				this.switchLaneDown();
				this.lastLaneSwitchTime = time;
			} else if (
				this.controls.down &&
				time - this.lastLaneSwitchTime > this.laneSwitchDelay
			) {
				this.switchLaneUp();
				this.lastLaneSwitchTime = time;
			}
		}
	}
}
