import Phaser from 'phaser';
import Npc from '../actors/Npc';
import Consts from '../consts';
import Utils from '../utils';

const MAX_NPCS = 50;

export default class NpcGenerator {
	constructor(scene, config) {
		this.scene = scene;
		this.config = Utils.assert('config', config);
		this.group = this.scene.add.group();
	}
	
	generate() {
		for (let lane = 0; lane < Consts.lanes; lane++) {
			for (let i = 0; i < MAX_NPCS; i++) {
				this.createEntity(Consts.screenWidth, Consts.worldWidth, lane);
			}
		}
	}
	
	createEntity(xMin, xMax, lane) {				
		const entity = new Npc(this.scene);

		if (entity) {
			entity.x = Phaser.Math.Between(xMin, xMax);
			entity.setLane(lane);
			entity.speed *= Phaser.Math.Between(1, 1);
			entity.setActive(true);
			entity.setVisible(true);
			this.scene.physics.add.existing(entity, false);
			this.group.add(entity);
		}
	}
	
	update(time, delta) {
		this.group.getChildren().forEach((entity) => entity.update(time, delta));
	}
}