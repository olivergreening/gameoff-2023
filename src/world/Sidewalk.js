import Phaser from 'phaser';
import Consts from '../consts';
import Utils from '../utils';

const TILE_SIZE = 32;

export default class Sidewalk {
    constructor(scene, config) {
        this.scene = scene;
        this.config = Utils.assert('config', config);
        this.currentTopLayerIdx = 0;
        this.currentBottomLayerIdx = 0;
    }

    generate(map) {
        const sy = -20;
        const ey = this.config.endY + Consts.laneStartY;

        // --- generate 3 layers of environment assets that will server as a side-scrolling buffer
        const tileset = map.addTilesetImage('sidewalk_tiles');
        this.topLayers = [
            // top
            map.createBlankLayer('layer_sidewalk_1', tileset, 0, sy),
            map.createBlankLayer('layer_sidewalk_2', tileset, Consts.screenWidth, sy),
            map.createBlankLayer('layer_sidewalk_3', tileset, Consts.screenWidth * 2, sy),
        ];
        this.bottomLayers = [
            map.createBlankLayer('layer_sidewalk_4', tileset, 0, ey),
            map.createBlankLayer('layer_sidewalk_5', tileset, Consts.screenWidth, ey),
            map.createBlankLayer('layer_sidewalk_6', tileset, Consts.screenWidth * 2, ey),
        ];

        this.tilesetGid = tileset.firstgid;

        this.topLayers.forEach(l => {
            l.setDepth(Consts.z.sidewalkLayer);
            this.populateLayer(l);
        });
        this.bottomLayers.forEach(l => {
            l.setDepth(Consts.z.sidewalkLayer);
            this.populateLayer(l);
        });
    }

    tileId(x, y) {
        return this.tilesetGid + (y * 10) + x;
    }

    populateLayer(layer) {
        const w = Consts.screenWidth / TILE_SIZE;
        const h = Consts.laneStartY / TILE_SIZE;

        let grass = Phaser.Math.Between(0, 100) > 50;

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                if (grass) {
                    if (!layer.hasTileAt(x, y)) {
                        const rnd = Phaser.Math.Between(0, 100);
                        if (rnd > 95 && y < h - 1) {
                            // put a tree
                            layer.putTileAt(this.tileId(9, 0), x, y);
                            layer.putTileAt(this.tileId(9, 1), x, y + 1);
                        } else if (rnd > 85) {
                            // put a bush
                            layer.putTileAt(this.tileId(8, 1), x, y);
                        } else {
                            // put grass
                            layer.putTileAt(this.tileId(0, 0), x, y);
                        }
                    }
                } else {
                    const rnd = Phaser.Math.Between(0, 100);
                    if (rnd > 50) {
                        layer.putTileAt(this.tileId(1, 0), x, y);
                    } else if (rnd > 25) {
                        layer.putTileAt(this.tileId(2, 0), x, y);
                    } else if (rnd > 5) {
                        layer.putTileAt(this.tileId(2, 1), x, y);
                    } else if (rnd > 3) {
                        layer.putTileAt(this.tileId(3, 0), x, y);
                    } else if (rnd > 1) {
                        layer.putTileAt(this.tileId(3, 1), x, y);
                    } else {
                        layer.putTileAt(this.tileId(1, 1), x, y);
                    }
                }
            }
        }

        // Zaun
        // const ypos = ~~h;
        // for (let x = 0; x < w; x++) {
        //     if (!layer.hasTileAt(x, ypos)) {
        //         layer.putTileAt(this.tileId(0, 5), x, ypos);
        //     }
        // }
    }

    update(player) {
        // scroll layers
        const x = this.scene.cameras.main.worldView.centerX;
        const screenWidthLimit_1 = Consts.screenWidth + Consts.screenWidth * 0.5; // 1200

        const v1 = x % screenWidthLimit_1 >= screenWidthLimit_1 - player.speed;
        const v2 = x % Consts.screenWidth >= Consts.screenWidth - player.speed;

        if (v1 || v2 && this.currentTopLayerIdx > 1) {
            const layer = this.topLayers[this.currentTopLayerIdx];
            layer.x = layer.x + Consts.screenWidth * this.topLayers.length;

            this.currentTopLayerIdx += 1;
            if (this.currentTopLayerIdx >= this.topLayers.length) {
                this.currentTopLayerIdx = 0;
            }
        }

        if (v1 || v2 && this.currentBottomLayerIdx > 1) {
            const layer = this.bottomLayers[this.currentBottomLayerIdx];
            layer.x = layer.x + Consts.screenWidth * this.bottomLayers.length;

            this.currentBottomLayerIdx += 1;
            if (this.currentBottomLayerIdx >= this.bottomLayers.length) {
                this.currentBottomLayerIdx = 0;
            }
        }
    }
}
