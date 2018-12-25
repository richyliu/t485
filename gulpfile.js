const gulp = require("gulp");
const sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
const plumber = require("gulp-plumber");
const uglify = require("gulp-uglifyes"); //gulp-uglify-ecmascript/js6
const cssnano = require("gulp-cssnano");
const del = require("del");
const merge = require("merge-stream");
const htmlmin = require("gulp-htmlmin");
const minifyInline = require("gulp-minify-inline");
const noop = require("gulp-noop");
const htmlMinOptions = {
	collapseWhitespace: true,
	removeComments:true
};



let env = process.env.NODE_ENV || "development";
let outdir = env == "production" ? "dist" : "devserver";
const base = "./src";

const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require('vinyl-buffer')
const tsify = require("tsify");
const rename = require("gulp-rename");
const glob = require("glob");
const es = require("event-stream");
const typedoc = require("gulp-typedoc");

const nunjucks = require("gulp-nunjucks");
const nunjucks_config = require("./nunjucks-data");
const nunjucksModule = require("nunjucks");
var nunjucksEnv = new nunjucksModule.Environment(new nunjucksModule.FileSystemLoader(base + "/templates"));




gulp.task("sass", function () {
	return gulp.src(base + "/css/*.+(scss|sass)")
		.pipe(plumber())
		.pipe(sass()) // Converts Sass to CSS with gulp-sass
		.pipe(env === "production" ? cssnano() : noop())
		.pipe(gulp.dest("./" + outdir + "/css/"))
		.pipe(browserSync.reload({
			stream: true
		}));
});
gulp.task("css", function () {
	return gulp.src([base + "/css/*.css", "!" + base + "/css/*.min.css"])
		.pipe(plumber())
		.pipe(env === "production" ? cssnano() : noop())
		.pipe(gulp.dest("./" + outdir + "/css/"))
		.pipe(browserSync.reload({
			stream: true
		}));
});
gulp.task("styles", gulp.parallel("sass", "css"), function (callback) {

	callback();
});
gulp.task("scripts", function () {
	return gulp.src([base + "/js/*.js", "!" + base + "/js/*.min.js"])
		.pipe(plumber())
		.pipe(env === "production" ? uglify() : noop())
		.pipe(gulp.dest("./" + outdir + "/js/"))
		.pipe(browserSync.reload({
			stream: true
		}));
});



gulp.task("typescript", function (done) {

	// https://fettblog.eu/gulp-browserify-multiple-bundles/

	glob(base + "/js/pages/**/**.ts", function(err, files) {
		if(err) done(err);

		let tasks = files.map(function(entry) {
			return browserify({
				entries: [entry],
				debug:(env !== "production")
			})
				.plugin(tsify)
				.bundle()
				.pipe(plumber())
				.pipe(source(entry))
				.pipe(rename(function(path){
					//get rid of /js/pages/ but preserve any further directories.

					path.dirname = path.dirname.split("/").slice(3).join("/");

					//change the extension
					path.extname = ".bundle.js";
				}))
				.pipe(buffer())
				.pipe(env === "production" ? uglify() : noop())
				.pipe(gulp.dest("./" + outdir + "/js/"));
		});
		es.merge(tasks).on("end", done);
	})

});


// Typedoc is a documentation generator for typescript
gulp.task("docs", function() {


	return gulp
		.src([base + "/js/**/*.ts", "!./node_modules/**"])
		.pipe(plumber())
		.pipe(typedoc({
			// TypeScript options (see typescript docs)
			module: "browser",
			target: "es5",
			includeDeclarations: true,

			// Output options (see typedoc docs)
			out: "./" + outdir + "/docs",
			//json: "./" + outdir + "/docs/docs.json",

			//exclude node_modules
			exclude: '**/node_modules/**',
			ignore: '**/node_modules/**',
			excludeExternals: true,


			// TypeDoc options (see typedoc docs)
			name: "T485 v2 Internal Docs",
			theme: "default",
			plugins: [],
			ignoreCompilerErrors: false,
			version: true,
		}));
});

gulp.task("clean", function (callback) {
	del.sync("./" + outdir, callback);
	callback();
});
gulp.task("html", function () {
	return gulp.src(base + "/**/*.html")
		.pipe(plumber())
		.pipe(nunjucks.compile(nunjucks_config, {
			env: nunjucksEnv
		}))
		.pipe(env === "production" ? minifyInline() : noop())
		.pipe(env === "production" ? htmlmin(htmlMinOptions) : noop())
		.pipe(gulp.dest("./" + outdir));
});

gulp.task("assets", function () {
	let fonts = gulp.src(base + "/fonts/**/*")
		.pipe(gulp.dest("./" + outdir + "/fonts/"));
	let img = gulp.src(base + "/img/**/*")
		.pipe(gulp.dest("./" + outdir + "/img/"));
	let jsmap = gulp.src(base + "/js/**/*.js.map")
		.pipe(gulp.dest("./" + outdir + "/js/"));
	let cssmap = gulp.src(base + "/css/**/*.css.map")
		.pipe(gulp.dest("./" + outdir + "/js/"));
	let jsmin = gulp.src(base + "/js/**/*.min.js")
		.pipe(gulp.dest("./" + outdir + "/js/"));
	let cssmin = gulp.src(base + "/css/**/*.min.css")
		.pipe(gulp.dest("./" + outdir + "/css/"));
	let favicons = gulp.src(base + "/favicons/**/*")
		.pipe(gulp.dest("./" + outdir + "/favicons/"));
	let cname = gulp.src(base + "/CNAME")
		.pipe(gulp.dest("./" + outdir));



	return merge(fonts, img, jsmap, cssmap, jsmin, jsmap, favicons, cname);
});
gulp.task("libraries", function () {

	// Bootstrap
	var scripts = gulp.src([
		"./node_modules/bootstrap/dist/js/bootstrap.min.js",
		"./node_modules/bootstrap/dist/js/bootstrap.min.js.map",
		"./node_modules/jquery/dist/jquery.min.js",
		"./node_modules/jquery/dist/jquery.min.map",
		"./node_modules/popper.js/dist/umd/popper.min.js",
		"./node_modules/popper.js/dist/umd/popper.min.js.map",
		"./node_modules/bootstrap-select/dist/js/bootstrap-select.min.js",
		"./node_modules/list.js/dist/list.min.js",


	])
		.pipe(gulp.dest("./" + outdir + "/js/"));
	var unminifiedscripts = gulp.src([
		"./node_modules/flatpickr/dist/flatpickr.js",

	])
		.pipe(plumber())
		.pipe(env === "production" ? uglify() : noop())
		.pipe(gulp.dest("./" + outdir + "/js/"));
	var unminifiedstyles = gulp.src([
		"./node_modules/flatpickr/dist/flatpickr.css",

	])
		.pipe(plumber())
		.pipe(env === "production" ? cssnano() : noop())
		.pipe(gulp.dest("./" + outdir + "/css/"));
	var styles = gulp.src([
		"./node_modules/bootstrap/dist/css/bootstrap.min.css",
		"./node_modules/bootstrap/dist/css/bootstrap.min.css.map",
		"./node_modules/bootstrap-select/dist/css/bootstrap-select.min.css",

	])
		.pipe(gulp.dest("./" + outdir + "/css/"));

	var fontjs = gulp.src([
		"./node_modules/@fortawesome/fontawesome-pro/js/all.min.js",
		"./node_modules/@fortawesome/fontawesome-pro/js/brands.min.js",
		"./node_modules/@fortawesome/fontawesome-pro/js/fontawesome.min.js",
		"./node_modules/@fortawesome/fontawesome-pro/js/light.min.js",
		"./node_modules/@fortawesome/fontawesome-pro/js/regular.min.js",
		"./node_modules/@fortawesome/fontawesome-pro/js/solid.min.js"

	])
		.pipe(gulp.dest("./" + outdir + "/fontawesome/js/"));
	var fontcss = gulp.src([
		"./node_modules/@fortawesome/fontawesome-pro/css/svg-with-js.min.css"

	])
		.pipe(gulp.dest("./" + outdir + "/fontawesome/css/"));


	return merge(scripts, unminifiedscripts, unminifiedstyles, styles, fontjs, fontcss);
});
gulp.task("set-production", function(callback) {

	env = "production";
	outdir = "dist";
	callback();
});

gulp.task("devbuild", gulp.series("clean",
	gulp.parallel("styles", "docs", "assets", "scripts", "typescript", "libraries"),
	"html"
), function (callback) {
	callback();
});
gulp.task("build", gulp.series("set-production", "devbuild"), function (callback) {
	callback();
});
gulp.task("serveBuild", function () {
	browserSync.init({
		server: {
			baseDir: "./dist",
			serveStaticOptions: {
				extensions: ["html"]
			}
		},
		open:false
	});
});
gulp.task("browserSync", function () {
	browserSync.init({
		server: {
			baseDir: "./" + outdir,
			serveStaticOptions: {
				extensions: ["html"]
			}
		},
		open:false
	});
});

gulp.task("watch", gulp.parallel(function () {

	gulp.watch(base + "/css/**/*.+(scss|sass)", gulp.parallel("sass"));
	gulp.watch(base + "/css/**/*.css", gulp.parallel("css"));
	gulp.watch([base + "/js/**/*.js", "!" + base + "/js/*.min.js"], gulp.parallel("scripts"));
	gulp.watch([base + "/js/**/*.ts"], gulp.parallel("typescript", "docs"));
	gulp.watch(base + "/**/*.html", gulp.parallel("html"));
	gulp.watch([base + "/fonts/**/*", base + "/js/**/*.js", base + "/css/**/*.css", base + "/js/**/*.map", base + "/css/**/*.map", base + "/img/**/*"], gulp.parallel("assets"));

}, gulp.series("devbuild", "browserSync")));

