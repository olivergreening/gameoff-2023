import Phaser from 'phaser';
import Consts from '../consts';
import Utils from '../utils';
import RoadDecals from './RoadDecals';

export default class Road {
    constructor(scene, config) {
        this.scene = scene;
        this.config = Utils.assert('config', config);
        this.currentLayerIdx = 0;
    }

    generate(map, mapTilesWidth, mapTilesHeight) {
        const sy = this.config.startY;

        // --- add top and bottom sides
        this.top = this.scene.add.rectangle(0, 0, Consts.screenWidth * 2, sy * 2, 0xececec);
        this.top.setScrollFactor(0, 0);
        this.top.setDepth(Consts.z.roadLayer);

        this.bottom = this.scene.add.rectangle(0, Consts.tileSize * mapTilesHeight, 
            Consts.screenWidth * 2, Consts.screenHeight * 2 - Consts.tileSize * mapTilesHeight, 0xececec);
        this.bottom.setScrollFactor(0, 0);
        this.bottom.setDepth(Consts.z.roadLayer);

        // --- generate 3 layers of lanes that will server as a side-scrolling buffer 
        const roadTilset = map.addTilesetImage('road_tiles');
        const layers = [
            // lanes
            map.createBlankLayer('layer_lanes_1', roadTilset, 0, sy),
            map.createBlankLayer('layer_lanes_2', roadTilset, Consts.screenWidth, sy),
            map.createBlankLayer('layer_lanes_3', roadTilset, Consts.screenWidth * 2, sy),
        ];

        for (let y = 0; y < mapTilesHeight - 2; y += 2) {
            for (let x = 0; x < mapTilesWidth; x++) {
                if (x === 0) {
                    // crossroad tiles
                    layers.forEach(l => {
                        l.putTileAt(4, x, y);
                        // l.putTileAt(4 + 6, x, y + 1);
                        l.putTileAt(y + 1 === mapTilesHeight ? 4 + 12 : 4 + 6, x, y + 1);
                    });
                } else if (x === 1) {
                    // crossroad tiles
                    layers.forEach(l => {
                        l.putTileAt(5, x, y);
                        // l.putTileAt(5 + 6, x, y + 1);
                        l.putTileAt(y + 1 === mapTilesHeight ? 5 + 12 : 5 + 6, x, y + 1);
                    });
                } else {
                    // lane tiles
                    layers.forEach(l => {
                        l.putTileAt(0, x, y);
                        l.putTileAt((x - 2) % 4 + 6, x, y + 1);
                        // l.putTileAt(0, x, y + 2);
                    });
                }
            }
        }

        // put last 2 lanes
        for (let x = 0; x < mapTilesWidth; x++) {
            layers.forEach(l => {
                if (x === 0) {
                    // crossroad tiles
                    l.putTileAt(4, x, mapTilesHeight - 2);
                    l.putTileAt(4 + 12, x, mapTilesHeight - 1);
                } else if (x === 1) {
                    // crossroad tiles
                    l.putTileAt(5, x, mapTilesHeight - 2);
                    l.putTileAt(5 + 12, x, mapTilesHeight - 1);
                } else {
                    // lane tiles
                    l.putTileAt(0, x, mapTilesHeight - 2);
                    l.putTileAt(0, x, mapTilesHeight - 1);
                }
            });
        }

        layers.forEach((l, i) => {
            l.setScale(1);
            l.setDepth(Consts.z.roadLayer);
        });

        this.layers = layers;

        // --- generate decal objects that will be put on random on the road
        this.decals = new RoadDecals(this.scene, this.config);
        this.decals.generate();
    }

    update(player) {
        // scroll layers
        const x = this.scene.cameras.main.worldView.centerX;
        const screenWidthLimit_1 = Consts.screenWidth + Consts.screenWidth * 0.5; // 1200

        if (x % screenWidthLimit_1 >= screenWidthLimit_1 - player.speed ||
            (x % Consts.screenWidth >= Consts.screenWidth - player.speed && this.currentLayerIdx > 1)) {
            Utils.debug('(change) road tiles layer', x % 1200)

            const layer = this.layers[this.currentLayerIdx];
            layer.x = layer.x + Consts.screenWidth * this.layers.length;
            Utils.debug('(change) road tiles layer', this.currentLayerIdx, layer.x)

            this.currentLayerIdx += 1;
            if (this.currentLayerIdx >= this.layers.length) {
                this.currentLayerIdx = 0;
            }
        }

        // manage road decals
        this.decals.update();
    }
}