import Consts from '../consts';

import Road from './Road';
import Sidewalk from './Sidewalk';
import Traps from './Traps';

const MAP_WIDTH = Consts.screenWidth / Consts.tileSize;
const MAP_HEIGHT = 20;

const SIDEWALK_MAP_WIDTH = Consts.screenWidth / Consts.sideWalkTileSize;
const SIDEWALK_MAP_HEIGHT = Consts.screenHeight / Consts.sideWalkTileSize + 1;

export class World {
	constructor(scene, player) {
		this.scene = scene;
		this.player = player;
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

		this.traps = new Traps(this.scene, cfg);
		this.traps.generate();
	}

	update(time, delta) {
		this.road.update(this.player);
		this.sidewalk.update(this.player);
	}
}
