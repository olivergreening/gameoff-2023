import Phaser from 'phaser';
import Consts from '../consts';
import Controls from '../controls';

const W = Consts.screenWidth, H = Consts.screenHeight;
const W_2 = Consts.screenWidth * 0.5, H_2 = Consts.screenHeight * 0.5;
const MX = 60, MY = 50; // initial title and menu positions
const TITLE_FONT_SIZE = 64, MENU_FONT_SIZE = 38, TEXT_FONT_SIZE = 24;

const MenuStates = {
	MAIN: 1,
	OPTIONS: 2,
	HALL_OF_FAME: 3,
	CREDITS: 4,
};

export class Menu extends Phaser.Scene {
	constructor() {
		super('Menu');
	}

	create() {
		this.tileback1 = this.add.tileSprite(W_2, H_2, W, H, 'menu_bkg_1');
		this.tileback2 = this.add.tileSprite(W_2, H - 324 * 0.5, W, 324, 'menu_bkg_2');
		this.title = this.add.bitmapText(MX, 50, Consts.font, 'GETAWAY HEIST', TITLE_FONT_SIZE);

		this.ypos = 0; // first menu option pre-selected
		this.ymax = 0;
		this.menus = [];
		this.texts = [];
		this.controls = new Controls(this.input, true);

		this.createMainMenu();

		// common for all menus
		this.tween = this.tweens.addCounter({
			from: 0,
			to: 0.15,
			duration: 400,
			yoyo: true,
			repeat: -1,
			onUpdate: (tween) => {
				this.menus[this.ypos].scale = 1 + tween.getValue();
				this.menus[this.ypos].x = MX + tween.getValue() * 60;
			}
		});
	}

	update(time, delta) {
		this.tileback1.tilePositionX += 0.09;
		this.tileback2.tilePositionX += 0.5;

		if (this.controls.up) {
			this.menus[this.ypos].setScale(1, 1);
			this.menus[this.ypos].setX(MX);
			this.tween.restart();

			this.ypos -= 1;
			if (this.ypos < 0) {
				this.ypos = this.ymax;
			}
		} else if (this.controls.down) {
			this.menus[this.ypos].setScale(1, 1);
			this.menus[this.ypos].setX(MX);
			this.tween.restart();

			this.ypos += 1;
			if (this.ypos > this.ymax) {
				this.ypos = 0;
			}
		} else if (this.controls.action1) {
			switch (this.state) {
				case MenuStates.MAIN:
					switch (this.ypos) {
						case 0: this.scene.start('Game'); break; // TODO: add transition scene
						case 1: this.createOptions(); break;
						case 2: this.createHallOfFame(); break;
						case 3: this.createCredits(); break;
					}
					break;
				case MenuStates.OPTIONS:
					switch (this.ypos) {
						case 0: this.createMainMenu(); break; // go back to main
						case 1:
							// toggle sound
							this.enableSound = !this.enableSound;
							this.menus[this.ypos].text = `SOUND: ${this.enableSound ? 'ON' : 'OFF'}`;
							break;
						case 2:
							// toggle music
							this.enableMusic = !this.enableMusic;
							this.menus[this.ypos].text = `MUSIC: ${this.enableMusic ? 'ON' : 'OFF'}`;
							break;
					}
					break;
				case MenuStates.HALL_OF_FAME:
					switch (this.ypos) {
						case 0: this.createMainMenu(); break; // go back to main
					}
					break;
				case MenuStates.CREDITS:
					switch (this.ypos) {
						case 0: this.createMainMenu(); break; // go back to main
					}
					break;
			}
		}
	}

	clearMenu() {
		if (this.sectionTitle) {
			this.sectionTitle.destroy();
		}
		if (this.menus) {
			this.menus.forEach(text => text.destroy());
		}
		if (this.texts) {
			this.texts.forEach(text => text.destroy());
		}
		if (this.tween) {
			this.tween.stop();
		}
	}

	createMainMenu() {
		this.clearMenu();

		this.state = MenuStates.MAIN;
		this.menus = [
			this.add.bitmapText(MX, MY + 140, Consts.font, 'PLAY', MENU_FONT_SIZE),
			this.add.bitmapText(MX, MY + 190, Consts.font, 'OPTIONS', MENU_FONT_SIZE),
			this.add.bitmapText(MX, MY + 240, Consts.font, 'HALL OF FAME', MENU_FONT_SIZE),
			this.add.bitmapText(MX, MY + 290, Consts.font, 'CREDITS', MENU_FONT_SIZE)
		];
		this.ypos = 0;
		this.ymax = 3;

		if (this.tween) {
			this.tween.restart();
		}
	}

	createOptions() {
		this.clearMenu();

		this.state = MenuStates.OPTIONS;
		this.sectionTitle = this.add.bitmapText(W - 200, MY + 19, Consts.font, 'OPTIONS', MENU_FONT_SIZE);
		// TODO: use values from an audio class
		this.enableSound = true;
		this.enableMusic = true;
		this.menus = [
			this.add.bitmapText(MX, H - 90, Consts.font, 'BACK', MENU_FONT_SIZE),
			this.add.bitmapText(MX, MY + 140, Consts.font, 'SOUND: ON', MENU_FONT_SIZE),
			this.add.bitmapText(MX, MY + 190, Consts.font, 'MUSIC: ON', MENU_FONT_SIZE),
			// this.add.bitmapText(MX, MY + 240, Consts.font, 'GAMEPAD: ON', MENU_FONT_SIZE),
		];
		this.ypos = 0;
		this.ymax = 2;

		if (this.tween) {
			this.tween.restart();
		}
	}

	createHallOfFame() {
		this.clearMenu();

		this.state = MenuStates.HALL_OF_FAME;
		this.sectionTitle = this.add.bitmapText(W - 240, MY + 19, Consts.font, 'HALL OF FAME', MENU_FONT_SIZE);
		this.menus = [
			this.add.bitmapText(MX, H - 90, Consts.font, 'BACK', MENU_FONT_SIZE)
		];
		this.ypos = 0;
		this.ymax = 0;

		if (this.tween) {
			this.tween.restart();
		}
	}

	createCredits() {
		this.clearMenu();

		this.state = MenuStates.CREDITS;
		this.sectionTitle = this.add.bitmapText(W - 200, MY + 19, Consts.font, 'CREDITS', MENU_FONT_SIZE);
		this.menus = [
			this.add.bitmapText(MX, H - 90, Consts.font, 'BACK', MENU_FONT_SIZE)
		];
		this.ypos = 0;
		this.ymax = 0;

		this.texts = [
			this.add.bitmapText(MX, MY + 120, Consts.font, 'gfx:', TEXT_FONT_SIZE),
			this.add.bitmapText(MX + 20, MY + 150, Consts.font, 'BeshkekArt, beshkekart.itch.io', TEXT_FONT_SIZE),
			this.add.bitmapText(MX, MY + 190, Consts.font, 'programming:', TEXT_FONT_SIZE),
			this.add.bitmapText(MX + 20, MY + 220, Consts.font, 'Oliver Greening', TEXT_FONT_SIZE),
			this.add.bitmapText(MX + 20, MY + 250, Consts.font, 'Petar Petrov', TEXT_FONT_SIZE),
			this.add.bitmapText(MX, MY + 290, Consts.font, 'music/sfx:', TEXT_FONT_SIZE),
			this.add.bitmapText(MX + 20, MY + 320, Consts.font, 'Warren Corkscrew, soundcloud.com/warren-corkscrew', TEXT_FONT_SIZE),
			this.add.bitmapText(MX, MY + 360, Consts.font, 'voice acting:', TEXT_FONT_SIZE),
			this.add.bitmapText(MX + 20, MY + 390, Consts.font, 'Patryk Sokol, Sokolsoundworks.com', TEXT_FONT_SIZE)
		];

		if (this.tween) {
			this.tween.restart();
		}
	}
}
