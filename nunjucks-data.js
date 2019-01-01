/**
 * Define any nunjucks template variable here.
 * See https://www.npmjs.com/package/gulp-nunjucks and https://mozilla.github.io/nunjucks/
 */
let templateVars = {

};

let now = new Date();
const timeObj = {
	year:now.getFullYear()
}

//add date variables
Object.assign(templateVars, timeObj);
module.exports = templateVars;