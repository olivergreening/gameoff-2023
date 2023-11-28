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

		this.init();
	}

	init() {
		this.x = 400;
		this.setLane(4);
		this.setOrigin(0, 1);
		this.createExplosion();
		this.createAnimations();
		this.setAnimationToFoward();
	}

	screenShake() {
		this.scene.cameras.main.shake(200, 0.01);
	}
	
	createExplosion() {
		this.explosion = this.scene.add.sprite();
		this.explosion.depth = 100;
		this.explosion.setOrigin(0.5, 0.5);
		this.explosion.visible = false;
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

		this.explosion.anims.create({
			key: 'default',
			frames: this.explosion.anims.generateFrameNumbers('car_collision', {
				frames: [0, 1, 2, 3],
			}),
			repeat: 0,
		});
	}

	setAnimation(target) {
		this.play(target);
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

	playExplosionAnimation() {
		this.explosion.visible = true;
		this.explosion.play('default');
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
		this.screenShake();
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
		this.screenShake();
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
