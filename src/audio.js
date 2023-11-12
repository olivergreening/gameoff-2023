import { Math } from 'phaser';
import Consts from './consts';

const DEFAULT_FADE_INOUT = 2000;

let _currentMusic = null;

// key => slots  => slot#
const SOUNDS = {
    'menu-move': [
        ['menu_move.m4a', 'menu_move.ogg']
    ],
    'menu-select': [
        ['menu_sel.m4a', 'menu_sel.ogg']
    ]
};

const MUSIC = {
    'music-menu': ['bruh-003.m4a', 'bruh-003.ogg'],
};

class Audio {

    static load(loader) {
        Object.keys(SOUNDS).forEach(key =>
            SOUNDS[key].forEach(
                (files, idx) => loader.audio(`${key}${idx}`, files.map(file => `../sounds/${file}`))
            )
        );

        Object.keys(MUSIC).forEach(key => loader.audio(key, MUSIC[key].map(file => `../music/${file}`)));
    }

    constructor(scene) {
        this.scene = scene;
        this.sounds = {};
        this.music = {};

        Object.keys(SOUNDS).forEach(key => this.sounds[key] = SOUNDS[key].map((_, idx) => scene.sound.add(`${key}${idx}`)));
        Object.keys(MUSIC).forEach(key => this.music[key] = scene.sound.add(key));

        this._soundsOn = Consts.noSounds == false;
        this._musicOn = Consts.noMusic == false;
    }

    playSound(name, config) {
        if (!this._soundsOn) {
            return;
        }

        if (config) {
            if (config.modal) {

                let idx = 0;
                if (config.idx) {
                    idx = config.idx;
                } else if (config.random) {
                    idx = Math.Between(0, this.sounds[name].length - 1);
                }

                let snd = this.sounds[name][idx];
                if (!snd.isPlaying) {
                    this.sounds[name][idx].play(config);
                }

                return;

            } else if (config.idx) {
                this.scene.sound.play(`${name}${config.idx}`, config);
            } else if (config.random) {
                const idx = Math.Between(1, this.sounds[name].length);
                this.scene.sound.play(`${name}${idx}`, config);
            }
        } else {
            this.scene.sound.play(`${name}0`, config);
        }
    }

    setSoundVol(name, vol) {
        if (!this._soundsOn) {
            return;
        }

        if (name) {
            this.sounds[name][0].setVolume(vol);
        }
    }

    isMusicPlaying(key) {
        if (!this._musicOn) {
            return;
        }

        if (key) {
            return this.music[key].isPlaying;
        } else {
            return _currentMusic.isPlaying;
        }
    }

    playMusic(key, config) {
        if (!this._musicOn) {
            return;
        }

        _currentMusic = this.music[key];
        if (config && config.loop) {
            _currentMusic.play({ loop: config.loop });
        }
    }

    stop(key = null) {
        // if (!this._musicOn) {
        //   return;
        // }

        if (key) {
            this.sounds[key][0].stop();
        } else {
            _currentMusic && _currentMusic.stop();
            this.scene.sound.stopAll();
        }
    }

    fadeIn(cb, config) {
        if (!this._musicOn) {
            cb && cb();
            return;
        }

        //_currentMusic.volume = 0;

        let duration = DEFAULT_FADE_INOUT
        let maxVol = 1

        if (config) {
            duration = config.duration || duration;
            maxVol = config.maxVol || maxVol;
        }

        this.scene.tweens.add({
            targets: _currentMusic,
            volume: maxVol,
            ease: 'Linear',
            duration: duration,
            onComplete: () => cb && cb()
        });
    }

    fadeOut(cb, config) {
        if (!this._musicOn || !_currentMusic) {
            cb && cb();
            return;
        }

        let duration = DEFAULT_FADE_INOUT
        if (config && config.duration) {
            duration = config.duration
        }

        this.scene.tweens.add({
            targets: _currentMusic,
            volume: 0,
            ease: 'Linear',
            duration: duration,
            onComplete: cb
        });
    }

    setMusicVol(key, vol) {
        if (this._musicOn) {
            this.music[key].volume = vol;
        }
    }

    set soundsOn(value) {
        this._soundsOn = value;
        localStorage.setItem(`no_sound`, !value);
    }

    get soundsOn() {
        return this._soundsOn;
    }

    set musicOn(value) {
        this._musicOn = value;
        localStorage.setItem(`no_music`, !value);
        if (!value) {
            this.stop();
        }
    }

    get musicOn() {
        return this._musicOn;
    }
}

export default Audio;