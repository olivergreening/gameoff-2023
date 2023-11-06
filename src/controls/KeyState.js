export class KeyState {

    constructor() {
        this.reset();
    }

    reset() {
        this._pressed = false;
        this._down = false;
        this._released = false;
        this._held = false;
        this._heldTime = 0;
    }

    set pressed(value) {
        this._pressed = value;
    }

    set down(value) {
        this._down = value;
    }

    set released(value) {
        this._released = value;
    }

    set held(value) {
        console.assert(typeof value === 'object', value);

        this._held = value.held;
        this._heldTime = value.time;
    }

    get isPressed() {
        return this._pressed;
    }

    get isDown() {
        return this._down;
    }

    get isReleased() {
        return this._released;
    }

    // /**
    //  * @returns true, if the key is held for at least ms (milliseconds) long
    //  */
    // isHeldFor(ms, currentTime) {
    //     return this._held && (currentTime - this._heldTime) > ms;
    // }
}