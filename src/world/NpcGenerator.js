import Phaser from 'phaser';
import Npc from '../actors/Npc';
import Consts from '../consts';
import Utils from '../utils';

const MAX_NPCS_PER_LANE = 50;
const GENERATE_TIME_DELAY = 2000; // ms

export default class NpcGenerator {
	constructor(scene, player, config) {
		this.scene = scene;
		this.player = player;
		this.config = Utils.assert('config', config);
		this.group = this.scene.add.group();
		this._createNow = false;
	}

	generate(skipLanes) {
		skipLanes = skipLanes || [];

		for (let lane = 0; lane < Consts.lanes; lane++) {
			if (skipLanes.indexOf(lane) < 0) {
				for (let i = 0; i < MAX_NPCS_PER_LANE; i++) {
					this.createEntity(Consts.screenWidth, Consts.worldWidth, lane);
				}
			}
		}

		// add objects generation timer
		this.triggerTimer = this.scene.time.addEvent({
			callback: () => this._createNow = true,
			delay: GENERATE_TIME_DELAY,
			loop: true
		});
	}

	createEntity(xMin, xMax, lane) {
		const entity = new Npc(this.scene, this);
		entity.x = Phaser.Math.Between(xMin, xMax);
		entity.setLane(lane);
		entity.speed *= Phaser.Math.Between(1, 1);
		entity.setActive(true);
		entity.setVisible(true);

		this.group.add(entity);
	}

	update(time, delta) {
		this.group.getChildren().forEach((entity) => entity.update(time, delta));

		if (this._createNow) {
			this._createNow = false;

			const cameraX = this.scene.cameras.main.worldView.centerX;

			this.createEntity(cameraX + Consts.screenWidth * 0.5,
				cameraX + Consts.screenWidth, this.player.lane);
		}
	}

	removeNpc(entity) {
		// console.debug('(kill npc)', entity.texture.key);
		this.group.killAndHide(entity);
		// destroy so the physics body also goes aways
		entity.destroy();
	}
}