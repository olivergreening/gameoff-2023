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
        this.transposedMoney = 0;
        this.transposedSpeed = 0;
        this.transposedDist = 0;
        this._tachograph = [];
    }

    init() {
        this._addTopLeft();
        this._addBottomRight();

        // add tachograph timer
        this._tachographTimer = this.scene.time.addEvent({
            callback: () => {
                this._tachograph.push(this.transposedSpeed);
            },
            delay: 1000,
            loop: true
        });
    }

    update(time, delta) {
        this.transposedMoney = ~~Utils.transposeNumber(this.player.health, this.player.maxHealth, MAX_MONEY);
        this.scoreText.setText(this.formatMoney(this.transposedMoney));

        this.transposedSpeed = ~~Utils.transposeNumber(this.player.speed, this.player.maxSpeedForSmall, MAX_SPEED);
        this.speedText.setText(this.transposedSpeed);

        this.transposedDist = MAX_DISTANCE - ~~Utils.transposeNumber(this.player.x + this.player.width, Consts.worldWidth, MAX_DISTANCE);
        this.distanceText.setText(this.transposedDist);
    }

    _addTopLeft() {
        this.pin(this.scene.add.rectangle(
            0,
            0,
            FONT_SIZE * 18.5,
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

        this.scoreText = this.pin(this.scene.add
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

        this.speedText = this.pin(this.scene.add
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
            Consts.screenWidth - FONT_SIZE * 2,
            Consts.screenHeight + 20,
            200,
            100,
            0x232323,
        ));

        this.pin(this.scene.add
            .bitmapText(
                Consts.screenWidth - FONT_SIZE * 7,
                Consts.screenHeight - 20,
                Consts.font,
                'DISTANCE:',
                FONT_SIZE,
            ));

        this.distanceText = this.pin(this.scene.add
            .bitmapText(
                Consts.screenWidth - FONT_SIZE * 3 + 10,
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

    formatMoney(money) {
        return '$' + this.i18n.format(money);
    }

    get money() {
        return this.transposedMoney;
    }

    get moneyLost() {
        return MAX_MONEY - this.transposedMoney;
    }

    get distance() {
        return this.transposedDist;
    }

    get distanceTravelled() {
        return MAX_DISTANCE - this.transposedDist;
    }

    get averageSpeed() {
        return this._tachograph.length === 0 ?
            0 : this._tachograph.reduce((prev, curr) => curr + prev) / this._tachograph.length;
    }
}