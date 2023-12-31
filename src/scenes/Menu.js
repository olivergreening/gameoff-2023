import Phaser from 'phaser';
import Consts from '../consts';
import Audio from '../audio';
import { Controls } from '../controls';

const W = Consts.screenWidth,
	H = Consts.screenHeight;
const W_2 = Consts.screenWidth * 0.5,
	H_2 = Consts.screenHeight * 0.5;
const MX = 60,
	MY = 50; // initial title and menu positions
const TITLE_FONT_SIZE = 64,
	MENU_FONT_SIZE = 38,
	TEXT_FONT_SIZE = 24;

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
		// sfx
		this.audio = new Audio(this);
		this.audio.setMusicVol('music-menu', 0);
		this.audio.playMusic('music-menu', { loop: true });
		this.audio.fadeIn(null, { maxVol: 0.65 });

		this.tileback1 = this.add.tileSprite(W_2, H_2, W, H, 'menu_bkg_1');
		this.tileback2 = this.add.tileSprite(
			W_2,
			H - 324 * 0.5,
			W,
			324,
			'menu_bkg_2',
		);
		// this.title = this.add.bitmapText(
		// 	MX,
		// 	50,
		// 	Consts.font,
		// 	'GETAWAY HEIST',
		// 	TITLE_FONT_SIZE,
		// );
		this.title = this.add.image(MX + 115, 80, 'title');
		this.title.setScale(1.25);

		this.ypos = 0; // first menu option pre-selected
		this.ymax = 0;
		this.menus = [];
		this.texts = [];
		this.controls = new Controls(this.input);
		this.playTapped = false; // when PLAY gets tapped, stop menu selections

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
			},
		});
	}

	update(time, delta) {
		if (this.playTapped) {
			return;
		}

		this.controls.update(time);

		this.tileback1.tilePositionX += 0.1;
		this.tileback2.tilePositionX -= 0.5;

		if (this.controls.up.isPressed) {
			this.audio.playSound('menu-move');

			this.menus[this.ypos].setScale(1, 1);
			this.menus[this.ypos].setX(MX);
			this.tween.restart();

			this.ypos -= 1;
			if (this.ypos < 0) {
				this.ypos = this.ymax;
			}
		} else if (this.controls.down.isPressed) {
			this.audio.playSound('menu-move');

			this.menus[this.ypos].setScale(1, 1);
			this.menus[this.ypos].setX(MX);
			this.tween.restart();

			this.ypos += 1;
			if (this.ypos > this.ymax) {
				this.ypos = 0;
			}
		} else if (this.controls.action1.isPressed) {
			switch (this.state) {
				case MenuStates.MAIN:
					this.audio.playSound('menu-enter');
					switch (this.ypos) {
						case 0:
							this.playTapped = true;
							this.audio.fadeOut({ duration: Consts.cameraFadeDelay });
							this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Transition'));
							this.cameras.main.fadeOut(Consts.cameraFadeDelay, 0);
							break;
						case 1:
							this.createOptions();
							break;
						case 2:
							this.createHallOfFame();
							break;
						case 3:
							this.createCredits();
							break;
					}
					break;
				case MenuStates.OPTIONS:
					switch (this.ypos) {
						case 0:
							this.audio.playSound('menu-exit');
							this.createMainMenu(); // go back to main
							break;
						case 1:
							// toggle sound
							if (this.audio.soundsOn) {
								this.audio.playSound('menu-exit');
							}
							this.audio.soundsOn = !this.audio.soundsOn;
							this.menus[this.ypos].text = `SOUND: ${this.audio.soundsOn ? 'ON' : 'OFF'
								}`;

							if (this.audio.soundsOn) {
								this.audio.playSound('menu-enter');
							}
							break;
						case 2:
							// toggle music
							if (this.audio.musicOn) {
								this.audio.playSound('menu-exit');
							}

							this.audio.musicOn = !this.audio.musicOn;
							this.menus[this.ypos].text = `MUSIC: ${this.audio.musicOn ? 'ON' : 'OFF'
								}`;
							if (this.audio.musicOn) {
								this.audio.playMusic('music-menu', { loop: true });
							}

							if (this.audio.musicOn) {
								this.audio.playSound('menu-enter');
							}
							break;
					}
					break;
				case MenuStates.HALL_OF_FAME:
					switch (this.ypos) {
						case 0:
							this.audio.playSound('menu-exit');
							this.createMainMenu(); // go back to main
							break;
					}
					break;
				case MenuStates.CREDITS:
					switch (this.ypos) {
						case 0:
							this.audio.playSound('menu-exit');
							this.createMainMenu(); // go back to main
							break;
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
			this.menus.forEach((text) => text.destroy());
		}
		if (this.texts) {
			this.texts.forEach((text) => text.destroy());
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
			this.add.bitmapText(
				MX,
				MY + 240,
				Consts.font,
				'HALL OF FAME',
				MENU_FONT_SIZE,
			),
			this.add.bitmapText(MX, MY + 290, Consts.font, 'CREDITS', MENU_FONT_SIZE),
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
		this.sectionTitle = this.add.bitmapText(
			W - 200,
			MY + 19,
			Consts.font,
			'OPTIONS',
			MENU_FONT_SIZE,
		);
		this.menus = [
			this.add.bitmapText(MX, H - 90, Consts.font, 'BACK', MENU_FONT_SIZE),
			this.add.bitmapText(
				MX,
				MY + 140,
				Consts.font,
				`SOUND: ${this.audio.soundsOn ? 'ON' : 'OFF'}`,
				MENU_FONT_SIZE,
			),
			this.add.bitmapText(
				MX,
				MY + 190,
				Consts.font,
				`MUSIC: ${this.audio.musicOn ? 'ON' : 'OFF'}`,
				MENU_FONT_SIZE,
			),
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
		this.sectionTitle = this.add.bitmapText(
			W - 240,
			MY + 19,
			Consts.font,
			'HALL OF FAME',
			MENU_FONT_SIZE,
		);
		this.menus = [
			this.add.bitmapText(MX, H - 90, Consts.font, 'BACK', MENU_FONT_SIZE),
		];
		this.ypos = 0;
		this.ymax = 0;

		this.texts = [
			this.add.bitmapText(
				MX + 20,
				MY + 150,
				Consts.font,
				'sorry, (*shrug*) we could not finish this in time...',
				TEXT_FONT_SIZE,
			),
		];

		if (this.tween) {
			this.tween.restart();
		}
	}

	createCredits() {
		this.clearMenu();

		this.state = MenuStates.CREDITS;
		this.sectionTitle = this.add.bitmapText(
			W - 200,
			MY + 19,
			Consts.font,
			'CREDITS',
			MENU_FONT_SIZE,
		);
		this.menus = [
			this.add.bitmapText(MX, H - 90, Consts.font, 'BACK', MENU_FONT_SIZE),
		];
		this.ypos = 0;
		this.ymax = 0;

		this.texts = [
			this.add.bitmapText(MX, MY + 120, Consts.font, 'gfx:', TEXT_FONT_SIZE),
			this.add.bitmapText(
				MX + 20,
				MY + 150,
				Consts.font,
				'BeshkekArt, beshkekart.itch.io',
				TEXT_FONT_SIZE,
			),
			this.add.bitmapText(
				MX,
				MY + 190,
				Consts.font,
				'programming:',
				TEXT_FONT_SIZE,
			),
			this.add.bitmapText(
				MX + 20,
				MY + 220,
				Consts.font,
				'Oliver Greening, github.com/olivergreening',
				TEXT_FONT_SIZE,
			),
			this.add.bitmapText(
				MX + 20,
				MY + 250,
				Consts.font,
				'Petar Petrov, github.com/petarov',
				TEXT_FONT_SIZE,
			),
			this.add.bitmapText(
				MX,
				MY + 290,
				Consts.font,
				'music/sfx:',
				TEXT_FONT_SIZE,
			),
			this.add.bitmapText(
				MX + 20,
				MY + 320,
				Consts.font,
				'Warren Corkscrew, soundcloud.com/warren-corkscrew',
				TEXT_FONT_SIZE,
			),
			this.add.bitmapText(
				MX,
				MY + 360,
				Consts.font,
				'voice acting:',
				TEXT_FONT_SIZE,
			),
			this.add.bitmapText(
				MX + 20,
				MY + 390,
				Consts.font,
				'Patryk Sokol, Sokolsoundworks.com',
				TEXT_FONT_SIZE,
			),
		];

		if (this.tween) {
			this.tween.restart();
		}
	}
}
