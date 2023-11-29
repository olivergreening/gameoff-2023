import Phaser from 'phaser';
import Vehicle from './Vehicle';
import Consts from '../consts';
import Utils from '../utils';
import { Controls } from '../controls';
import Audio from '../audio';

export default class Player extends Vehicle {
	constructor(scene, police, npcs) {
		super(scene);

		this.controls = new Controls(this.scene.input);
		this.audio = new Audio(this.scene);
		
		this.police = police;
		this.npcs = npcs;

		this.states = {
			isLaneSwitchAllowed: true,
			isBraking: false,
			isBig: false,
			isSizeSwitchAllowed: true,
		};
		
		this.brakingSpeed = 0.2;
		this.accelerationSpeed = 0.1;
		this.decelerationSpeed = 0.1;
		this.minSpeedForSmall = 8;
		this.maxSpeedForSmall = 12;
		this.minSpeedForBig = 6;
		this.maxSpeedForBig = 8;
		this.minSpeed = this.minSpeedForSmall;
		this.maxSpeed = this.maxSpeedForSmall;
		this.speed = this.minSpeed;

		// add body for Arcade-engine collisions
		scene.physics.add.existing(this, false);
		this.switchPhysicsBodySize();

		this.init();
	}

	init() {
		this.x = 400;
		this.setLane(4);
		this.setOrigin(0, 1);
		this.createAnimations();
		this.setAnimationToFoward();
	}

	createAnimations() {
		this.anims.create({
			key: 'bigTransform',
			frames: Utils.createFramesFromImages('player_car_', 8, 1),
			duration: 500,
			repeat: 0,
		});
		
		this.anims.create({
			key: 'bigFoward',
			frames: Utils.createFramesFromImages('player_car_', 9),
			repeat: -1,
		});
		
		this.anims.create({
			key: 'bigUp',
			frames: Utils.createFramesFromImages('player_car_', 11),
			repeat: -1,
		});
		
		this.anims.create({
			key: 'bigDown',
			frames: Utils.createFramesFromImages('player_car_', 10),
			repeat: -1,
		});
		
		this.anims.create({
			key: 'smallTransform',
			frames: Utils.createFramesFromImages('player_car_', 1, 8),
			duration: 500,
			repeat: 0,
		});
		
		this.anims.create({
			key: 'smallFoward',
			frames: Utils.createFramesFromImages('player_car_', 12),
			repeat: -1,
		});
		
		this.anims.create({
			key: 'smallUp',
			frames: Utils.createFramesFromImages('player_car_', 14),
			repeat: -1,
		});
		
		this.anims.create({
			key: 'smallDown',
			frames: Utils.createFramesFromImages('player_car_', 13),
			repeat: -1,
		});
	}

	setAnimation(target) {
		this.play(target);
		// this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (anim) => {
        //     if (anim.key === 'smallTransform' || anim.key === 'bigTransform') {
		// 		this.switchPhysicsBodySize();
		// 	}
        // }, this);
	}

	setAnimationToFoward() {
		const target = this.states.isBig ? 'bigFoward' :'smallFoward';
		this.setAnimation(target);
	}

	setAnimationToUp() {
		const target = this.states.isBig ? 'bigUp' : 'smallUp';
		this.setAnimation(target);
	}

	setAnimationToDown() {
		const target = this.states.isBig ? 'bigDown' : 'smallDown';
		this.setAnimation(target);
	}

	setAnimationToTransform() {
		const target = this.states.isBig ? 'bigTransform' : 'smallTransform';
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
		this.scene.screenShake();
	}

	downLane() {
		if (this.lane < Consts.lanes) {
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
		this.scene.screenShake();
	}

	switchPhysicsBodySize() {
		// TODO: something's getting messed up with the sizes on anim transform,
		// so using hardcoded values for now
		// const width = this.width;
		// const height = this.height;

		if (this.states.isBig) {
			const width = 61, height = 48;
			this.body.setSize(width - 8, height - 14, true);
			this.body.setOffset(10, 10);
		} else {
			const width = 32, height = 32;
			this.body.setSize(width * 0.65, height * 0.4, true);
			this.body.setOffset(8, 2);
		}
	}

	switchSize() {
		if (this.states.isSizeSwitchAllowed) {
			this.setAnimationToTransform();
			this.states.isBig = !this.states.isBig;

			if (this.states.isBig) {
				this.minSpeed = this.minSpeedForBig;
				this.maxSpeed = this.maxSpeedForBig;
			} else {
				this.minSpeed = this.minSpeedForSmall;
				this.maxSpeed = this.maxSpeedForSmall;
			}

			this.switchPhysicsBodySize();
		}
	}

	update(time, delta) {
		this.controls.update(time);

		if (this.states.isLaneSwitchAllowed) {
			if (this.controls.up.isPressed) {
				this.audio.playSound('player-shift-lane-up');
				this.upLane();
			} else if (this.controls.down.isPressed) {
				this.audio.playSound('player-shift-lane-down');
				this.downLane();
			}
		}

		if (this.states.isBraking) {
			if (this.controls.left.isDown) {
				this.speed -= this.brakingSpeed;
				this.speed = this.speed < this.minSpeed ? this.minSpeed : this.speed;
			} else {
				this.states.isBraking = false;
			}
		} else {
			if (this.controls.right.isDown) {
				this.speed += this.accelerationSpeed;
				this.speed = this.speed > this.maxSpeed ? this.maxSpeed : this.speed;
			} else if (this.controls.left.isDown) {
				this.states.isBraking = true;
			} else {
				
				this.speed -= this.decelerationSpeed;
				this.speed = this.speed < this.minSpeed ? this.minSpeed : this.speed;
			}
		}

		if (this.controls.action1.isPressed) {
			this.switchSize();
		}

		this.x += this.speed;
	}
}
