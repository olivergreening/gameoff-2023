import Phaser from 'phaser';
import Consts from '../consts';
import Utils from '../utils';

const FONT_SIZE = 18;
const MAX_SPEED = 180; // kmph
const MAX_MONEY = 1_000_000; // €
const MAX_DISTANCE = 1000; // km

export default class Hud {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.i18n = new Intl.NumberFormat('en-US');
    }

    init() {
        this._addTopLeft();
        this._addBottomRight();
    }

    update(time, delta) {
        const transposedMoney = ~~Utils.transposeNumber(this.player.health, this.player.maxHealth, MAX_MONEY);
        this.score.setText('$' + this.i18n.format(transposedMoney));

        const transposedSpeed = ~~Utils.transposeNumber(this.player.speed, this.player.maxSpeedForSmall, MAX_SPEED);
        this.speed.setText(transposedSpeed);

        const transposedDist = MAX_DISTANCE - ~~Utils.transposeNumber(this.player.x + this.player.width, Consts.worldWidth, MAX_DISTANCE);
        this.distance.setText(transposedDist);
    }

    _addTopLeft() {
        this.pin(this.scene.add.rectangle(
            0,
            0,
            FONT_SIZE * 20,
            FONT_SIZE * 6,
            0x232323,
        ));

        this.pin(this.scene.add
            .bitmapText(
                10,
                10,
                Consts.font,
                'MONEY:',
                FONT_SIZE,
            ));

        this.score = this.pin(this.scene.add
            .bitmapText(
                FONT_SIZE * 4,
                10,
                Consts.font,
                '0',
                FONT_SIZE,
            ));

        this.pin(this.scene.add
            .bitmapText(
                10,
                FONT_SIZE + 10,
                Consts.font,
                'SPEED:',
                FONT_SIZE,
            ));

        this.speed = this.pin(this.scene.add
            .bitmapText(
                FONT_SIZE * 4,
                FONT_SIZE + 10,
                Consts.font,
                '0',
                FONT_SIZE,
            ));
    }

    _addBottomRight() {
        this.pin(this.scene.add.rectangle(
            Consts.screenWidth - FONT_SIZE * 5,
            Consts.screenHeight + 20,
            200,
            100,
            0x232323,
        ));

        this.pin(this.scene.add
            .bitmapText(
                Consts.screenWidth - FONT_SIZE * 10,
                Consts.screenHeight - 20,
                Consts.font,
                'DISTANCE:',
                FONT_SIZE,
            ));

        this.distance = this.pin(this.scene.add
            .bitmapText(
                Consts.screenWidth - FONT_SIZE * 6 + 10,
                Consts.screenHeight - 20,
                Consts.font,
                '0',
                FONT_SIZE,
            ));
    }

    pin(entity) {
        entity.setDepth(Consts.z.hudLayer);
        entity.setScrollFactor(0, 0);
        return entity;
    }
}