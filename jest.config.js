const { defaults: tsjPreset } = require('ts-jest/presets');
// const { jsWithTs: tsjPreset } = require('ts-jest/presets');
// const { jsWithBabel: tsjPreset } = require('ts-jest/presets');

let config = {
	"globals": {
		"ts-jest": {
			tsConfig: {
				module:"es6",
				allowSyntheticDefaultImports: true,
				esModuleInterop: true
			}
		}
	},
	"testURL": "https://example.com/directory/page.extension?a=Query%20A"
};
module.exports = Object.assign(tsjPreset, config);
// module.exports = {
// 	preset: 'ts-jest',
// 	testEnvironment: 'node',
// };