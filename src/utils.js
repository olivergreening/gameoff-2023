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
	},
	
	createFramesFromImages(base, begin, end = begin) {
		const increment = (begin <= end) ? 1 : -1;
		const arr = [];
		
		if (begin !== end) {
			for (let i = begin; i !== end + increment; i += increment) {
				arr.push({key: base + i});
			}				
		} else {
			arr.push({key: base + begin});
		}
		
		return arr;
	},

	transposeNumber(current, max, newMax) {
		return (current / max) * newMax;
	}
};

export default Utils;
