import Phaser from 'phaser';
import Police from '../actors/Police';
import Consts from '../consts';
import Utils from '../utils';

const MIN_POLICE = 2;
const MAX_POLICE = 4;

export default class BaseActor extends Phaser.GameObjects.Sprite {
	constructor(scene, player, npcs, obstacles, config) {
		super(scene);
		this.scene = scene;
		this.config = Utils.assert('config', config);
		this.group = this.scene.add.group();
		this.player = player;
		this.npcs = npcs;
		this.obstacles = obstacles;
		this.otherPolice = this.group;
	}
	
	generate() {
		const numPolice = Phaser.Math.Between(MIN_POLICE, MAX_POLICE);
		const lanes = [0, 3, 7, 9];
		
		for (let i = 0; i < numPolice; i++) {
			this.createEntity(lanes[i]);
		}
	}
	
	createEntity(lane) {
		const entity = new Police(this.scene, this.player, this.otherPolice, this.npcs, this.obstacles);
		
		if (entity) {
			entity.x = 10;
			entity.setLane(lane);
			// entity.speed *= Phaser.Math.Between(1, 1);
			entity.setActive(true);
			entity.setVisible(true);
			this.group.add(entity);	
		}
	}
	
	update(time, delta) {
		this.group.getChildren().forEach((entity) => entity.update(time, delta));
	}
}