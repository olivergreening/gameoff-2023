import Consts from './consts';

const Utils = {

    debug: (...args) => {
        if (Consts.debug) {
            console.debug(args);
        }
    }

};

export default Utils;
