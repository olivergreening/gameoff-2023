import Phaser from 'phaser';
import Consts from '../consts';
import Utils from '../utils';

const MAX_DECALS = 20;

export default class RoadDecals {
    constructor(scene, config) {
        this.scene = scene;
        this.config = Utils.assert('config', config);
    }

    generate(maxSize) {
        // --- generate decal objects that will be put on random on the road
        this.group = this.scene.add.group({
            defaultKey: 'crack01.png',
            maxSize: maxSize || MAX_DECALS,
        });

        for (let i = 0; i < 25; i++) {
            this.createDecal(0, Consts.screenWidth);
        }
    }

    createDecal(xMin, xMax) {
        const isCreate = Phaser.Math.Between(0, 100) > 85;
        if (!isCreate) {
            return;
        }

        let name;
        switch (Phaser.Math.Between(0, 6)) {
            case 0:
            case 1:
                name = "crack01.png"; 
                break;
            case 2:
            case 3:
                name = "crack02.png"; 
                break;
            case 4: name = "tire.png"; break;
            case 5: name = "tire2.png"; break;
            case 6: name = "trailonroad.png"; break;
        }

        const x = Phaser.Math.Between(xMin, xMax);
        const y = Phaser.Math.Between(this.config.startY, this.config.endY) + this.config.tileHeight;
        const decal = this.group.get(x, y, 'road_decals', name);
        if (decal) {
            decal.setActive(true).setVisible(true).setDepth(Consts.z.decalsLayer);
            Utils.debug('(decal) created at', x, y)
        }
    }

    update() {
        const x = this.scene.cameras.main.worldView.centerX;
        this.createDecal(x + Consts.screenWidth, x + Consts.screenWidth * 2);

        this.group.children.iterate(decal => {
            if (decal.x < x - Consts.screenWidth) {
                this.group.killAndHide(decal);
            }
        });
    }
}