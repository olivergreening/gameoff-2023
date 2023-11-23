import { KeyState } from './KeyState';
import Consts from '../consts';

const stickThreshold = 0.1;

export class Controls {
	constructor(input) {
		this.input = input;

		if (input.gamepad) {
			this.pad1 = input.gamepad.pad;
		}

		// add all possible keyboard inputs
		this.keys = {
			ups: [
				input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
				input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
			],
			downs: [
				input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
				input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
			],
			lefts: [
				input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
				input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
			],
			rights: [
				input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
				input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
			],
			action1: [
				input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y),
				input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
				input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
				input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
			],
			action2: [input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)],
		};

		this.states = {
			up: new KeyState(),
			down: new KeyState(),
			left: new KeyState(),
			right: new KeyState(),
			action1: new KeyState(),
			action2: new KeyState(),
		};

		// allow for testing game stuff in no-production builds
		if (Consts.debug) {
			this.keys = {
				...this.keys,
				//killAll: input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
			};
		}
	}

	// _padPressed(button) {
	//     if (this.justPressed) {
	//         return this.pad1.justPressed(button, 25);
	//     }

	//     return this.pad1.isDown(button);
	// }

	// _stickMoved(isAxisOverTreshold) {
	//     if (this.justPressed) {
	//         return false;
	//     }

	//     return isAxisOverTreshold;
	// }

	_updateState(state, keys) {
		let found = false;

		for (let k of keys) {
			if (k.isDown) {
				found = true;

				if (state.isDown) {
					state.pressed = false;
					// if (!state.isHeld) {
					//     state.held = {
					//         held: true,
					//         time: time
					//     };
					// }
				} else {
					state.pressed = true;
					state.down = true;
				}

				break;
			}
		}

		if (!found) {
			if (state.isDown) {
				state.down = false;
				// state.held = { held: false };
				state.released = true;
			} else {
				state.reset();
			}
		}
	}

	update(time, delta) {
		this._updateState(this.states.up, this.keys.ups);
		this._updateState(this.states.down, this.keys.downs);
		this._updateState(this.states.left, this.keys.lefts);
		this._updateState(this.states.right, this.keys.rights);
		this._updateState(this.states.action1, this.keys.action1);
		this._updateState(this.states.action2, this.keys.action2);
	}

	get up() {
		return this.states.up;
		// return (
		//   this._keyPressed(this.keys.ups) ||
		//   this._padPressed(Phaser.Gamepad.XBOX360_DPAD_UP) ||
		//   this._stickMoved(
		//     this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -stickThreshold
		//   )
		// );
	}

	get down() {
		return this.states.down;
		// return (
		//   this._keyPressed(this.keys.downs) ||
		//   this._padPressed(Phaser.Gamepad.XBOX360_DPAD_DOWN) ||
		//   this._stickMoved(
		//     this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > stickThreshold
		//   )
		// );
	}

	get left() {
		return this.states.left;
		// return (
		//   this._keyPressed(this.keys.lefts) ||
		//   this._padPressed(Phaser.Gamepad.XBOX360_DPAD_LEFT) ||
		//   this._stickMoved(
		//     this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -stickThreshold
		//   )
		// );
	}

	get right() {
		return this.states.right;
		// return (
		//   this._keyPressed(this.keys.rights) ||
		//   this._padPressed(Phaser.Gamepad.XBOX360_DPAD_RIGHT) ||
		//   this._stickMoved(
		//     this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > stickThreshold
		//   )
		// );
	}

	get action1() {
		return this.states.action1;
		// return (
		//   this._keyPressed(this.keys.kicks) ||
		//   this._padPressed(Phaser.Gamepad.XBOX360_A)
		// );
	}

	get action2() {
		return this.states.action2;
		// return (
		//   this._keyPressed(this.keys.kicks) ||
		//   this._padPressed(Phaser.Gamepad.XBOX360_A)
		// );
	}

	// DEBUG

	debug(what) {
		return this.keys[what].justPressed();
	}
}
