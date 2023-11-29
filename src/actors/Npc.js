import Phaser from 'phaser';
import Vehicle from './Vehicle';
import Consts from '../consts.js';

export default class Npc extends Vehicle {
	constructor(scene) {
		super(scene);
		this.speed = 8;
		this.init();
	}

	init() {
		this.setOrigin(0, 1);

		switch (Phaser.Math.Between(0, 4)) {
			case 0:
				this.setTexture('couple_car');
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
		if (this.x > Consts.worldWidth) {
			this.x = 0;
		}

		this.x += this.speed;
	}
}
