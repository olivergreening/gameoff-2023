import Phaser from 'phaser';

export class Game extends Phaser.Scene {
	constructor() {
		super('Game');
	}

	create() {
		const level1 = this.make.tilemap({ key: 'level1' });
		level1.addTilesetImage('tileset01', 'tileset01');
		level1.addTilesetImage('agent', 'agent');

		// static layers
		this.layers = {
			tiles: level1.createLayer('base_tiles', 'tileset01'),
			objects: level1.createLayer('transition_tiles', ['tileset01', 'agent']),
			npcs: level1.createLayer('sprites', ['tileset01', 'agent']),
		};

		// player actor
		this.anims.create({
			key: 'walk_up',
			frames: this.anims.generateFrameNumbers('agent_anim', { start: 0, end: 8 }),
			frameRate: 8,
			repeat: -1
		});
		this.anims.create({
			key: 'walk_left',
			frames: this.anims.generateFrameNumbers('agent_anim', { start: 9, end: 17 }),
			frameRate: 8,
			repeat: -1
		});
		this.anims.create({
			key: 'walk_down',
			frames: this.anims.generateFrameNumbers('agent_anim', { start: 18, end: 26 }),
			frameRate: 8,
			repeat: -1
		});
		this.anims.create({
			key: 'walk_right',
			frames: this.anims.generateFrameNumbers('agent_anim', { start: 27, end: 35 }),
			frameRate: 8,
			repeat: -1
		});
		this.anims.create({
			key: 'stand',
			frames: this.anims.generateFrameNumbers('agent_anim', { frames: [27] }),
			frameRate: 8,
			repeat: -1
		});

		// put the player where Tiled says
		const objPlayer = level1.objects[0].objects[0];
		this.player = this.physics.add.sprite(objPlayer.x, objPlayer.y, 'stand').setBounce(0.2).setCollideWorldBounds(true);

		// input
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	update(time, delta) {
		let move = false;
		let isAnimPlaying = false;
		const speed = 120;
		
		if (this.cursors.left.isDown) {
			move = true;
			isAnimPlaying = true;
			this.player.setVelocityX(-speed);
			this.player.anims.play('walk_left', true);
		} else if (this.cursors.right.isDown) {
			move = true;
			isAnimPlaying = true;
			this.player.setVelocityX(speed);
			this.player.anims.play('walk_right', true);
		}

		if (this.cursors.up.isDown) {
			move = true;
			this.player.setVelocityY(-speed);
			if (!isAnimPlaying) {
				this.player.anims.play('walk_up', true);
			}
		} else if (this.cursors.down.isDown) {
			move = true;
			this.player.setVelocityY(speed);
			if (!isAnimPlaying) {
				this.player.anims.play('walk_down', true);
			}
		}

		if (!move) {
			this.player.setVelocityX(0);
			this.player.setVelocityY(0);
			this.player.anims.play('stand');
		}
	}
}
