import Consts from '../consts';

import Road from './Road';
import Sidewalk from './Sidewalk';
import Obstacles from './Obstacles';
import NpcGenerator from './NpcGenerator';

const MAP_WIDTH = Consts.screenWidth / Consts.tileSize;
const MAP_HEIGHT = 20;

const SIDEWALK_MAP_WIDTH = Consts.screenWidth / Consts.sideWalkTileSize;
const SIDEWALK_MAP_HEIGHT = Consts.screenHeight / Consts.sideWalkTileSize + 1;

export class World {
	constructor(scene, player) {
		this.scene = scene;
		this.player = player;
		this._colliders = [];
	}

	generate() {
		const cfg = {
			mapWidth: MAP_WIDTH,
			mapHeight: MAP_HEIGHT,
			tileWidth: Consts.tileSize,
			tileHeight: Consts.tileSize,
			startY: Consts.laneStartY,
			endY: MAP_HEIGHT * Consts.tileSize,
		};

		const map = this.scene.make.tilemap({
			tileWidth: Consts.tileSize,
			tileHeight: Consts.tileSize,
			width: MAP_WIDTH * 3,
			height: MAP_HEIGHT * 3,
		});

		this.road = new Road(this.scene, cfg);
		this.road.generate(map);

		const map2 = this.scene.make.tilemap({
			tileWidth: Consts.sideWalkTileSize,
			tileHeight: Consts.sideWalkTileSize,
			width: SIDEWALK_MAP_WIDTH * 3,
			height: SIDEWALK_MAP_HEIGHT * 3,
		});

		this.sidewalk = new Sidewalk(this.scene, cfg);
		this.sidewalk.generate(map2);

		this.obstacles = new Obstacles(this.scene, cfg);
		this.obstacles.generate();

		this.npcs = new NpcGenerator(this.scene, cfg);
		this.npcs.generate();
		
		console.log('*** obstacleLanes', this.obstacleLanes);
	}

	addObstaclesCollider(entity, cb) {
		this._colliders.push(this.scene.physics.add.collider(entity, this.obstacles.obstaclesGroup,
			(entityHit, obstacleHit) => {
				// play
				this.obstacles.obstaclesGroup.killAndHide(obstacleHit);
				cb();
			}));
	}
	
	addNpcsCollider(actor, cb) {
		this._colliders.push(this.scene.physics.add.collider(actor, this.npcs.group, (actorHit, npcHit) => {
			npcHit.preDestroy();
			cb(npcHit);
		}));
	}

	/**
	 * Remove all registered colliders for world objects
	 */
	removeColliders() {
		this._colliders.forEach((collider) => this.scene.physics.world.removeCollider(collider));
	}

	update(time, delta) {
		this.road.update(this.player);
		this.sidewalk.update(this.player);
		this.obstacles.update(time, delta);
		this.npcs.update(time, delta);
	}

	/**
	 * returns an array of lanes which will only have obstacles on them
	 * and no NPCs
	 */
	get obstacleLanes() {
		return this.obstacles.obstacleLanes;
	}
}
