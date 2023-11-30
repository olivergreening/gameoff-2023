import Phaser from 'phaser';
import Vehicle from './Vehicle';
import Consts from '../consts.js';

export default class Npc extends Vehicle {
	constructor(scene, parent) {
		super(scene);
		this.parent = parent;
		this.speed = 8;
		this.init();
	}

	init() {
		this.setOrigin(0, 1);

		switch (Phaser.Math.Between(0, 4)) {
			case 0:
				this.body.setSize(46, 22, true);
				this.body.setOffset(this.speed, 6);
				this.setTexture('couple_car');
				break;
			case 1:
				this.body.setSize(58, 22, true);
				this.body.setOffset(this.speed, 30);
				this.setTexture('ice_cream_car');
				break;
			case 2:
				this.body.setSize(42, 22, true);
				this.body.setOffset(this.speed, 8);
				this.setTexture('mini_car');
				break;
			case 3:
				this.body.setSize(50, 22, true);
				this.body.setOffset(this.speed, 6);
				this.setTexture('muscle_car');
				break;
			case 4:
				this.body.setSize(46, 22, true);
				this.body.setOffset(this.speed, 10);
				this.setTexture('sedan_car');
				break;
		}
	}

	preDestroy() {
		const tween = {
			targets: this,
			alpha: 0,
			duration: 200,
			ease: 'Quadratic.In',
			onStart: () => {
				this.speed = 0;
			},
			onComplete: () => {
				this.destroy();
			},
		};

		this.scene.tweens.add(tween);
	}

	update(time, delta) {
		this.x += this.speed;

		const cameraX = this.scene.cameras.main.worldView.centerX;

		// NPC past screen bounds or point of no return relative to camera's position
		if (this.x > Consts.worldWidth || this.x < cameraX - Consts.screenWidth) {
			this.parent.removeNpc(this);
		}
	}
}
