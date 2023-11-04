
const isStringBoolean = (item) => item === `true`;

const URLOptions = {};
window.location.search.slice(1).split('&').map((option) => {
  const keyValue = option.split('=');
  URLOptions[keyValue[0]] = isStringBoolean(keyValue[1]) || keyValue[1];
});

const Consts = {
	screenWidth: 800,
	screenHeight: 600,
	laneHeight: 64,

	font: 'm6x11',
	
	// dev flags passed as url parameters, e.g. `?debug=true&show_fps=true`
	debug: URLOptions[`debug`],
	debugPhysics: URLOptions[`debug_physics`],
	showFPS: URLOptions[`show_fps`],
	noSounds: URLOptions[`no_sound`],
	noMusic: URLOptions[`no_music`],
};

console.debug('[dev] options', URLOptions);

export default Consts;
