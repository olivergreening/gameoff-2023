import Phaser from 'phaser';
import Consts from '../consts';
import Utils from '../utils';

import Road from './Road';

const MAP_WIDTH = 53;
const MAP_HEIGHT = 21;

export class World {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
    }

    generate() {
        const map = this.scene.make.tilemap({
            tileWidth: Consts.tileSize,
            tileHeight: Consts.tileSize,
            width: MAP_WIDTH * 3,
            height: MAP_HEIGHT * 3
        });

        this.road = new Road(this.scene, {
            tileWidth: Consts.tileSize,
            tileHeight: Consts.tileSize,
            startY: 100,
            endY: MAP_HEIGHT * Consts.tileSize
        });
        this.road.generate(map, MAP_WIDTH, MAP_HEIGHT);
    }

    update(time, delta) {
        this.road.update(this.player);
    }
}