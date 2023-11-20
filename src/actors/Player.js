import Phaser from 'phaser';
import Vehicle from './Vehicle';
import Audio from '../audio';
import { Controls } from '../controls';

export default class Player extends Vehicle {
	constructor(scene) {
		super(scene);

		this.controls = new Controls(this.scene.input);

		this.states = {
			isLaneSwitchAllowed: true,
			isBraking: false,
			isBig: false,
		};

		this.brakingSpeed = .2;
		this.accelerationSpeed = .1;
		this.decelerationSpeed = .1;
		this.minSpeed = 10;
		this.maxSpeed = 20;
		this.speed = this.minSpeed;
		
		this.money = 0;
		
		this.init();
		this.createAnimations();
	}

	init() {
		this.x = 400;
		this.setLane(0);
		this.setOrigin(.5, 0);
		this.setTexture('player_car');
		this.setFrame(0);
	}
	
	createAnimations() {
		this.currentAnimation = 0;
		this.animations = [
			{
				key: 'bigTransform',
				frames: this.anims.generateFrameNumbers('player_car', { frames: [7, 6, 5, 4, 3, 2, 1, 0] }),
				duration: 500,
				repeat: 0,
			},
			{
				key: 'bigFoward',
				frames: this.anims.generateFrameNumbers('player_car', { frames: [9] }),
				repeat: -1,
			},
			{
				key: 'bigUp',
				frames: this.anims.generateFrameNumbers('player_car', { frames: [11] }),
				repeat: -1,
			},
			{
				key: 'bigDown',
				frames: this.anims.generateFrameNumbers('player_car', { frames: [10] }),
				repeat: -1,
			},
			{
				key: 'smallTransform',
				frames: this.anims.generateFrameNumbers('player_car', { frames: [0, 1, 2, 3, 4, 5, 6, 7] }),
				duration: 500,
				repeat: 0,
			},
			{
				key: 'smallFoward',
				frames: this.anims.generateFrameNumbers('player_car', { frames: [12] }),
				repeat: -1,
			},
			{
				key: 'smallUp',
				frames: this.anims.generateFrameNumbers('player_car', { frames: [14] }),
				repeat: -1,
			},
			{
				key: 'smallDown',
				frames: this.anims.generateFrameNumbers('player_car', { frames: [13] }),
				repeat: -1,
			},
		]; 

		for (const animation of this.animations) {
			this.anims.create(animation);
		}
		
		this.setAnimationToFoward();
	}
	
	setAnimation(target) {
		if (target >= 0 && target <= this.animations.length) {
			this.currentAnimation = target;
			this.play(this.animations[this.currentAnimation].key);
		}
	}
	
	setAnimationToFoward() {
		const target = (this.states.isBig) ? 1 : 5;
		this.setAnimation(target);
	}

	setAnimationToUp() {
		const target = (this.states.isBig) ? 2 : 6;
		this.setAnimation(target);
	}

	setAnimationToDown() {
		const target = (this.states.isBig) ? 3 : 7;
		this.setAnimation(target);
	}

	setAnimationToTransform() {
		const target = (this.states.isBig) ? 0 : 4;
		this.setAnimation(target);
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
					this.states.isLaneSwitchAllowed = false;
					this.setAnimationToUp();
				},
				onComplete: () => {
					this.setAnimationToFoward();
					this.setLane(target);
					this.states.isLaneSwitchAllowed = true;
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
		if (this.lane < 3) {
			const target = this.lane + 1;
			const tween = {
				targets: this,
				y: this.calculateLaneY(target),
				duration: 200,
				ease: 'Quadratic.In',
				onStart: () => {
					this.states.isLaneSwitchAllowed = false;
					this.setAnimationToDown();
				},
				onComplete: () => {
					this.setAnimationToFoward();
					this.setLane(target);
					this.states.isLaneSwitchAllowed = true;
				},
			};

			this.scene.tweens.add(tween);
			return;
		}

		// TODO: add sound effect
		this.scene.cameras.main.shake(200, .01);
		return;
	}

	switchSize() {
		this.setAnimationToTransform();
		this.states.isBig = !this.states.isBig;
	}

	update(time, delta) {
		this.controls.update(time);

		if (this.states.isLaneSwitchAllowed) {
			if (this.controls.up.isPressed) {
				this.upLane();
			} else if (this.controls.down.isPressed) {
				this.downLane();
			}
		}

		if (this.states.isBraking) {
			if (this.controls.left.isDown) {
				this.speed -= this.brakingSpeed;
				this.speed = (this.speed < 10) ? 10 : this.speed;
			} else {
				this.states.isBraking = false;
			}
		} else {
			if (this.controls.right.isDown) {
				this.speed += this.accelerationSpeed;
				this.speed = (this.speed > this.maxSpeed) ? this.maxSpeed : this.speed;
			} else if (this.controls.left.isDown) { 
				this.states.isBraking = true;
			} else {
				this.speed -= this.decelerationSpeed;
				this.speed = (this.speed < 10) ? 10 : this.speed;
			}
		}
		
		if (this.controls.action1.isPressed) {
			this.switchSize();
		}

		this.x += this.speed;
	}
}