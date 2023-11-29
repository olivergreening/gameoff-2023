import Phaser from 'phaser';
import Audio from '../audio';

export default class VehicleCollisionExplosion extends Phaser.GameObjects.Sprite {
	constructor(scene) {
		super(scene);
		this.scene = scene;
		this.audio = new Audio(this.scene);
		this.scene.add.existing(this);
		this.init();
	}
	
	init() {
		this.setOrigin(0.5, 0.5);
		this.setDepth(100);
		this.setActive(true);
		this.setVisible(false);
		this.createAnimations();
	}
	
	createAnimations() {
		this.anims.create({
			key: 'default',
			frames: this.anims.generateFrameNumbers('car_collision', {
				frames: [0, 1, 2, 3],
			}),
			repeat: 0,
		});
		
		this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation) => {
      		this.setVisible(false);
		}, this);
	}
	
	playDefault(x, y) {
		this.x = x;
		this.y = y;
		this.setVisible(true);
		this.play('default');
		this.audio.playSound('explosion');
	}
}