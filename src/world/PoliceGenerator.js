import Phaser from 'phaser';
import Police from '../actors/Police';
import Consts from '../consts';
import Utils from '../utils';

export default class BaseActor extends Phaser.GameObjects.Sprite {
	constructor(scene, config) {
		super(scene);
		this.scene = scene;
		this.config = Utils.assert('config', config);
		this.group = this.scene.add.group();
	}
	
	generate() {
		for (let i = 0; i < Consts.lanes + 1; i++) {
			this.createEntity(i);
		}
	}
	
	createEntity(lane) {
		const entity = new Police(this.scene, this.player, this.otherPolice, this.npcs, this.obstacles);
		
		if (entity) {
			entity.x = 0;
			entity.setLane(lane);
			entity.setActive(true);
			entity.setVisible(true);
			this.group.add(entity);	
		}
	}
	
	update(time, delta) {
		this.group.getChildren().forEach((entity) => entity.update(time, delta));
	}
}