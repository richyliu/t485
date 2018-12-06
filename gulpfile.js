const gulp = require("gulp");
const sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
const plumber = require("gulp-plumber");
const uglify = require("gulp-uglifyes"); //gulp-uglify-ecmascript/js6
const cssnano = require("gulp-cssnano");

const del = require("del");
const nunjucks = require("gulp-nunjucks");
const nunjucks_config = require("./nunjucks-data");
const nunjucksModule = require("nunjucks");
const merge = require("merge-stream");
const htmlmin = require("gulp-htmlmin");
const minifyInline = require("gulp-minify-inline");
const noop = require("gulp-noop");
const htmlMinOptions = {
	collapseWhitespace: true,
	removeComments:true
};
const base = "./src"
var nunjucksEnv = new nunjucksModule.Environment(new nunjucksModule.FileSystemLoader(base + "/templates"));
let env = process.env.NODE_ENV || "development";
let outdir = env == "production" ? "dist" : "devserver";

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
})
gulp.task("clean:docs", function (callback) {
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
    var fonts = gulp.src(base + "/fonts/**/*")
        .pipe(gulp.dest("./" + outdir + "/fonts/"));
    var img = gulp.src(base + "/img/**/*")
        .pipe(gulp.dest("./" + outdir + "/img/"));
    var jsmap = gulp.src(base + "/js/**/*.js.map")
        .pipe(gulp.dest("./" + outdir + "/js/"));
    var cssmap = gulp.src(base + "/css/**/*.css.map")
        .pipe(gulp.dest("./" + outdir + "/js/"));
    var jsmin = gulp.src(base + "/js/**/*.min.js")
        .pipe(gulp.dest("./" + outdir + "/js/"));
    var cssmin = gulp.src(base + "/css/**/*.min.css")
        .pipe(gulp.dest("./" + outdir + "/css/"));
    var favicons = gulp.src(base + "/favicons/**/*")
        .pipe(gulp.dest("./" + outdir + "/favicons/"));
    var cname = gulp.src(base + "/CNAME")
        .pipe(gulp.dest("./" + outdir));
    var fonts = gulp.src(base + "/fonts/**")
        .pipe(gulp.dest("./" + outdir + "/fonts/"));


    return merge(fonts, img, jsmap, cssmap, jsmin, jsmap, favicons, cname, fonts);
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


    return merge(scripts, unminifiedscripts, unminifiedstyles, styles);
});
gulp.task("set-production", function(callback) {

	env = "production";
	outdir = "dist";
	callback();
});
gulp.task("build", gulp.series("set-production", "clean:docs",
    gulp.parallel("styles", "assets", "scripts", "libraries"),
	"html"
), function (callback) {
    callback();
});
gulp.task("devbuild", gulp.series("clean:docs",
	gulp.parallel("styles",  "assets", "scripts", "libraries"),
	"html"
), function (callback) {
	callback();
});
gulp.task("serveBuild", function () {
	browserSync.init({
		server: {
			baseDir: "./dist"
		},
		files: [base + "/css/*", base + "/**/*.html", base + "/js/*"],
		open:false
	});
});
gulp.task("browserSync", function () {
    browserSync.init({
        server: {
            baseDir: "./" + outdir
		},
        files: [base + "/css/*", base + "/**/*.html", base + "/js/*"],
		open:false
    });
});

gulp.task("watch", gulp.parallel(function () {

    gulp.watch(base + "/css/*.+(scss|sass)", gulp.parallel("sass"));
    gulp.watch(base + "/css/*.css", gulp.parallel("css"));
    gulp.watch([base + "/js/*.js", "!" + base + "/js/*.min.js"], gulp.parallel("scripts"));
    gulp.watch(base + "/**/*.html", gulp.parallel("html"));
    gulp.watch([base + "/fonts/**/*", base + "/js/**/*.js", base + "/css/**/*.css", base + "/js/**/*.map", base + "/css/**/*.map", base + "/img/**/*"], gulp.parallel("assets"));

}, gulp.series("devbuild", "browserSync")));
