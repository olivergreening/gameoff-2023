import Consts from './consts';

const Utils = {

    assert: (what, obj) => {
        if (typeof obj === 'undefined') {
            throw `${what} is undefined`;
        }
        return obj;
    },

    debug: (...args) => {
        if (Consts.debug) {
            console.debug(args);
        }
    }

};

export default Utils;
