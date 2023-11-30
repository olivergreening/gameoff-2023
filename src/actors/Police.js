import Phaser from 'phaser';
import Vehicle from './Vehicle';
import Consts from '../consts.js';

export default class Police extends Vehicle {
	constructor(scene, player, otherPolice, npcs, obstacles) {
		super(scene);

		this.player = player;
		this.otherPolice = otherPolice;
		this.npcs = npcs;
		this.obstacles = obstacles;

		this.states = {
			isLaneSwitchAllowed: true,
		};

		this.speed = 8;

		this.init();
	}

	init() {
		this.setOrigin(0, 1);

		switch (Phaser.Math.Between(0, 1)) {
			case 0:
				this.body.setSize(53, 22, true);
				this.body.setOffset(this.speed, 10)
				this.setTexture('police_car');
				break;
			case 1:
				this.body.setSize(51, 22, true);
				this.body.setOffset(this.speed, 16)
				this.setTexture('police_big_car');
				break;
		}
	}

	update(time, delta) {
		this.x += this.speed;
	}
}
