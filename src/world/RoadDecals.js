import Phaser from 'phaser';
import Consts from '../consts';
import Utils from '../utils';

const MAX_DECALS = 20;
const MAX_ADDITIVES = 10;

export default class RoadDecals {
	constructor(scene, config) {
		this.scene = scene;
		this.config = Utils.assert('config', config);
	}

	generate(maxSize) {
		// generate decal objects that will be put on random on the road
		this.group = this.scene.add.group({
			maxSize: maxSize || MAX_DECALS,
		});

		// generate additive objects
		this.groupAdditives = this.scene.add.group({
			maxSize: maxSize || MAX_ADDITIVES,
		});

		// generate initial entities
		for (let i = 0; i < 10; i++) {
			this.createDecal(0, Consts.screenWidth * 2);
			this.createAdditive(0, Consts.screenWidth * 2);
		}
	}

	canCreate() {
		return Phaser.Math.Between(0, 100) > 85;
	}

	createDecal(xMin, xMax) {
		let name;
		switch (Phaser.Math.Between(0, 6)) {
			case 0:
			case 1:
				name = 'crack01.png';
				break;
			case 2:
			case 3:
				name = 'crack02.png';
				break;
			case 4:
				name = 'tire.png';
				break;
			case 5:
				name = 'tire2.png';
				break;
			case 6:
				name = 'trailonroad.png';
				break;
		}

		const x = Phaser.Math.Between(xMin, xMax);
		const y =
			Phaser.Math.Between(this.config.startY, this.config.endY) +
			this.config.tileHeight * 2;
		const decal = this.group.get(x, y, 'road_decals', name);
		if (decal) {
			const scale = Phaser.Math.Between(1, 2);
			const flipped = Phaser.Math.Between(0, 100) > 50;
			decal
				.setActive(true)
				.setVisible(true)
				.setDepth(Consts.z.decalsLayer)
				.setScale(scale)
				.setFlipX(flipped);
			//Utils.debug('(decal) created at', x, y);
		}
	}

	createAdditive(xMin, xMax) {
		let name;
		switch (Phaser.Math.Between(0, 4)) {
			case 0:
				name = 'weed-additive-16x16-01.png';
				break;
			case 1:
				name = 'weed-additive-16x16-02.png';
				break;
			case 2:
				name = 'weed-additive-16x16-03.png';
				break;
			case 3:
				name = 'weed-additive-16x16-04.png';
				break;
			case 4:
				name = 'weed-additive-16x16-05.png';
				break;
		}

		const x = Phaser.Math.Between(xMin, xMax);
		const y =
			Phaser.Math.Between(0, 100) > 50
				? this.config.startY + Phaser.Math.Between(-1, 1)
				: this.config.endY +
				this.config.tileHeight * 3.5 +
				Phaser.Math.Between(-1, 1);

		const decal = this.groupAdditives.get(x, y, 'road_weeds', name);
		if (decal) {
			const scale = 1; // Phaser.Math.Between(1, 2);
			const flipped = Phaser.Math.Between(0, 100) > 50;
			decal
				.setActive(true)
				.setVisible(true)
				.setDepth(Consts.z.decalsLayer)
				.setScale(scale)
				.setFlipX(flipped);
			//Utils.debug('(additive) created at', x, y);
		}
	}

	update() {
		const x = this.scene.cameras.main.worldView.centerX;
		const min = x + Consts.screenWidth * 1.75;
		const max = x + Consts.screenWidth * 2;

		if (this.canCreate()) {
			this.createDecal(min, max);
		}

		if (this.canCreate()) {
			this.createAdditive(min, max);
		}

		this.group.children.iterate((decal) => {
			if (decal.x < x - Consts.screenWidth) {
				this.group.killAndHide(decal);
			}
		});

		this.groupAdditives.children.iterate((decal) => {
			if (decal.x < x - Consts.screenWidth) {
				this.groupAdditives.killAndHide(decal);
			}
		});
	}
}
