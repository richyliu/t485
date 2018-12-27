const { defaults: tsjPreset } = require('ts-jest/presets');
// const { jsWithTs: tsjPreset } = require('ts-jest/presets');
// const { jsWithBabel: tsjPreset } = require('ts-jest/presets');

let config = {
	"globals": {
		"ts-jest": {
			tsConfig: {
				allowSyntheticDefaultImports: true,
				esModuleInterop: true
			}
		}
	}
};
console.log(Object.assign(tsjPreset, config))
console.log(Object.assign(tsjPreset, config).globals["ts-jest"].tsConfig)
module.exports = Object.assign(tsjPreset, config);
// module.exports = {
// 	preset: 'ts-jest',
// 	testEnvironment: 'node',
// };