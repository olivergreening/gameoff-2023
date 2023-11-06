import Phaser from 'phaser';
import Vehicle from './Vehicle';
import { Controls } from '../controls';

export default class Player extends Vehicle {
	constructor(scene, texture) {
		super(scene, texture);


		this.setLane(0);
		this.setScale(2);
		this.setFrame(3);
		this.setOrigin(0, 0);

		this.controls = new Controls(this.scene.input);

		this.canSwitchLane = true;

		this.accelerationSpeed = .1;
		this.decelerationSpeed = .1;
		this.minSpeed = 10;
		this.maxSpeed = 20;
		this.speed = this.minSpeed;
	}

	upLane() {
		if (this.lane > 0) {
			const target = this.lane - 1;
			const tween = {
				targets: this,
				y: this.calculateLaneY(target),
				duration: 200,
				ease: 'Quadratic.In',
				onStart: () => {
					this.canSwitchLane = false;
					this.setFrame(2);
				},
				onComplete: () => {
					this.setFrame(3);
					this.setLane(target);
					this.canSwitchLane = true;
				},
			};

			this.scene.tweens.add(tween);
			return;
		}

		// TODO: add sound effect
		this.scene.cameras.main.shake(200, .01);
		return;
	}

	downLane() {
		if (this.lane < 6) {
			const target = this.lane + 1;
			const tween = {
				targets: this,
				y: this.calculateLaneY(target),
				duration: 200,
				ease: 'Quadratic.In',
				onStart: () => {
					this.canSwitchLane = false;
					this.setFrame(4);
				},
				onComplete: () => {
					this.setFrame(3);
					this.setLane(target);
					this.canSwitchLane = true;
				},
			};

			this.scene.tweens.add(tween);
			return;
		}

		// TODO: add sound effect
		this.scene.cameras.main.shake(200, .01);
		return;
	}

	preUpdate(time, delta) {
		// TODO: add collision logic
	}

	update(time, delta) {
		this.controls.update(time);

		if (this.canSwitchLane) {
			if (this.controls.up.isPressed) {
				this.upLane();
			} else if (this.controls.down.isPressed) {
				this.downLane();
			}
		}

		if (this.controls.left.isPressed) {
			this.speed = 10;
		} else if (this.controls.right.isPressed) {
			this.speed += this.accelerationSpeed;
			this.speed = (this.speed > this.maxSpeed) ? this.maxSpeed : this.speed;
		} else {
			this.speed -= this.decelerationSpeed;
			this.speed = (this.speed < 10) ? 10 : this.speed;
		}

		console.log(this.x)
		this.x += this.speed;
	}
}
