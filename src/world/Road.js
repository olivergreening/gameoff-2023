import Phaser from 'phaser';
import Consts from '../consts';
import Utils from '../utils';

export default class Road {
    constructor(scene) {
        this.scene = scene;
        this.currentLayerIdx = 0;
    }

    generate(map, mapTilesWidth, mapTilesHeight) {
        const tileset = map.addTilesetImage('road_tiles');

        const ypos = 100;
        const layers = [
            map.createBlankLayer('layer_lanes_1', tileset, 0, ypos),
            map.createBlankLayer('layer_lanes_2', tileset, Consts.screenWidth, ypos),
            map.createBlankLayer('layer_lanes_3', tileset, Consts.screenWidth * 2, ypos),
        ];

        for (let y = 0; y < mapTilesHeight; y += 3) {
            for (let x = 0; x < mapTilesWidth; x++) {
                if (x == 0) {
                    // crossroad tiles
                    layers.forEach(l => {
                        l.putTileAt(4, x, y);
                        l.putTileAt(4 + 6, x, y + 1);
                        l.putTileAt(y + 2 === mapTilesHeight ? 4 + 12 : 4 + 6, x, y + 2);
                    });
                } else if (x == 1) {
                    // crossroad tiles
                    layers.forEach(l => {
                        l.putTileAt(5, x, y);
                        l.putTileAt(5 + 6, x, y + 1);
                        l.putTileAt(y + 2 === mapTilesHeight ? 5 + 12 : 5 + 6, x, y + 2);
                    });
                } else {
                    // lane tiles
                    layers.forEach(l => {
                        l.putTileAt(0, x, y);
                        l.putTileAt((x - 2) % 4 + 6, x, y + 1);
                        l.putTileAt(0, x, y + 2);
                    });
                }
            }
        }

        layers.forEach((l, i) => {
            l.setScale(1);
            l.setDepth(-99);
        });

        this.layers = layers;
    }

    update(player) {
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
    }
}