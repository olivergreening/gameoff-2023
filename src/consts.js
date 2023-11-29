const isStringBoolean = (item) => item === `true`;

const URLOptions = {};
window.location.search
	.slice(1)
	.split('&')
	.map((option) => {
		const keyValue = option.split('=');
		URLOptions[keyValue[0]] = isStringBoolean(keyValue[1]) || keyValue[1];
	});

const Consts = {
	screenWidth: 800,
	screenHeight: 600,
	worldWidth: 40000,
	lanes: 9,
	laneStartY: 140, // this is the y-pos where the lanes start from
	maxObstacleLanes: 4, // how many obstacles-only lanes to generate
	font: 'm6x11',
	tileSize: 16,
	sideWalkTileSize: 32,
	z: {
		roadLayer: -99,
		decalsLayer: -98,
		sidewalkLayer: -91,
		sidewalkOverlayLayer: -90,
		obstaclesLayer: -80,
		hudLayer: 0,
	},

	// dev flags passed as url parameters, e.g. `?debug=true&show_fps=true`
	debug: URLOptions[`debug`],
	debugPhysics: URLOptions[`debug_physics`],
	showFPS: URLOptions[`show_fps`],
	noSounds: isStringBoolean(localStorage.getItem(`no_sound`)),
	noMusic: isStringBoolean(localStorage.getItem(`no_music`)),
	scene: URLOptions[`scene`],
};

console.debug('[dev] options', URLOptions);

export default Consts;
