import Phaser from 'phaser';
import Consts from '../consts';
import Controls from '../controls';

const W = Consts.screenWidth, H = Consts.screenHeight;
const W_2 = Consts.screenWidth * 0.5, H_2 = Consts.screenHeight * 0.5;
const MX = 60, MY = 50; // initial title and menu positions
const TITLE_FONT_SIZE = 64, MENU_FONT_SIZE = 38;

const MenuStates = {
	MAIN: 1,
	SETTINGS: 2,
	CREDITS: 3,
};

export class Menu extends Phaser.Scene {
	constructor() {
		super('Menu');
	}

	create() {
		this.tileback1 = this.add.tileSprite(W_2, H_2, W, H, 'menu_bkg_1');
		this.tileback2 = this.add.tileSprite(W_2, H - 324 * 0.5, W, 324, 'menu_bkg_2');

		this.state = MenuStates.MAIN;
		this._createMainMenu();
	}

	update(time, delta) {
		this.tileback1.tilePositionX += 0.09;
		this.tileback2.tilePositionX += 0.5;

		this._updateMainMenu();
	}

	_createMainMenu() {
		this.title = this.add.bitmapText(MX, MY, Consts.font, 'GETAWAY HEIST', TITLE_FONT_SIZE);
		this.play = this.add.bitmapText(MX, MY + 120, Consts.font, 'PLAY', MENU_FONT_SIZE);
		this.options = this.add.bitmapText(MX, MY + 170, Consts.font, 'OPTIONS', MENU_FONT_SIZE);
		this.credits = this.add.bitmapText(MX, MY + 220, Consts.font, 'CREDITS', MENU_FONT_SIZE);

		this.menus = [this.play, this.options, this.credits];

		this.controls = new Controls(this.input, true);
		this.ypos = 0;

		this.tween = this.tweens.addCounter({
			from: 0,
			to: 0.25,
			duration: 400,
			yoyo: true,
			repeat: -1,
			onUpdate: (tween) => {
				this.menus[this.ypos].scale = 1 + tween.getValue();
				this.menus[this.ypos].x = MX + tween.getValue() * 60;
			}
		});
	}

	_updateMainMenu() {
		if (this.controls.up) {
			this.menus[this.ypos].setScale(1, 1);
			this.menus[this.ypos].setX(MX);
			this.tween.restart();

			this.ypos -= 1;
			if (this.ypos < 0) {
				this.ypos = 2;
			}
		} else if (this.controls.down) {
			this.menus[this.ypos].setScale(1, 1);
			this.menus[this.ypos].setX(MX);
			this.tween.restart();

			this.ypos += 1;
			if (this.ypos > 2) {
				this.ypos = 0;
			}
		}
	}
}
