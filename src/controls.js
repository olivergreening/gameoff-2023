import Consts from './consts';

const stickThreshold = 0.1;

export default class Controls {

    constructor(input, justReleased = false) {
        this.input = input;
        // TODO: there should be a better way to pass this param
        this.justPressed = justReleased;

        if (input.gamepad) {
            this.pad1 = input.gamepad.pad;
        }

        // add all possible keyboard inputs
        this.keys = {
            ups: [
                input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
                input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
            ],
            downs: [
                input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
                input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
            ],
            lefts: [
                input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
                input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
            ],
            rights: [
                input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
                input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
            ],
            action1: [
                input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
                input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O),
                input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
                input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
            ],
            action2: [
                input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y),
                input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P),
                // input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
            ]
        };

        // allow for testing game stuff
        // these should be disabled in production builds
        if (Consts.debug) {
            this.keys = {
                ...this.keys,
                killAll: input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
                killNearby: input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
                killVisible: input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V),
                warpAtEnd: input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B),
                hurtHero: input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N),
                healHero: input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M),
                showDialog: input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
                makeRain: input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R),
            };
        }
    }

    _keyPressed(keys) {
        for (const k of keys) {

            if (this.justPressed) {
                if (Phaser.Input.Keyboard.JustUp(k))
                    return true;
            } else {
                if (k.isDown) {
                    return true;
                }
            }

        }
        return false;
    }

    _padPressed(button) {
        if (this.justPressed) {
            return this.pad1.justPressed(button, 25);
        }

        return this.pad1.isDown(button);
    }

    _stickMoved(isAxisOverTreshold) {
        if (this.justPressed) {
            return false;
        }

        return isAxisOverTreshold;
    }

    get up() {
        return this._keyPressed(this.keys.ups);
        // return (
        //   this._keyPressed(this.keys.ups) ||
        //   this._padPressed(Phaser.Gamepad.XBOX360_DPAD_UP) ||
        //   this._stickMoved(
        //     this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -stickThreshold
        //   )
        // );
    }

    get down() {
        return this._keyPressed(this.keys.downs);
        // return (
        //   this._keyPressed(this.keys.downs) ||
        //   this._padPressed(Phaser.Gamepad.XBOX360_DPAD_DOWN) ||
        //   this._stickMoved(
        //     this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > stickThreshold
        //   )
        // );
    }

    get left() {
        return this._keyPressed(this.keys.lefts);
        // return (
        //   this._keyPressed(this.keys.lefts) ||
        //   this._padPressed(Phaser.Gamepad.XBOX360_DPAD_LEFT) ||
        //   this._stickMoved(
        //     this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -stickThreshold
        //   )
        // );
    }

    get right() {
        return this._keyPressed(this.keys.rights);
        // return (
        //   this._keyPressed(this.keys.rights) ||
        //   this._padPressed(Phaser.Gamepad.XBOX360_DPAD_RIGHT) ||
        //   this._stickMoved(
        //     this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > stickThreshold
        //   )
        // );
    }

    get action1() {
        return this._keyPressed(this.keys.action1);
        // return (
        //   this._keyPressed(this.keys.kicks) ||
        //   this._padPressed(Phaser.Gamepad.XBOX360_A)
        // );
    }

    get action2() {
        return this._keyPressed(this.keys.action2);
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