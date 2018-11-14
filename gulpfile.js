const gulp = require("gulp");
const sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
const plumber = require("gulp-plumber");
const uglify = require("gulp-uglifyes"); //gulp-uglify-ecmascript/js6
const cssnano = require("gulp-cssnano");
const gulpIf = require("gulp-if");
const del = require("del");
const nunjucks = require("gulp-nunjucks");
var nunjucks_config = require("./nunjucks-data");
const nunjucksModule = require("nunjucks");
const merge = require("merge-stream");
const htmlmin = require("gulp-htmlmin");
const minifyInline = require("gulp-minify-inline");
const noop = require("gulp-noop");
const htmlMinOptions = {
	collapseWhitespace: true,
	removeComments:true
};

var nunjucksEnv = new nunjucksModule.Environment(new nunjucksModule.FileSystemLoader("app/templates"));
let env = process.env.NODE_ENV || "development";
const outdir = "dist";

gulp.task("sass", function () {
    return gulp.src("./app/css/*.+(scss|sass)")
        .pipe(plumber())
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
		.pipe(env === "production" ? cssnano() : noop())
        .pipe(gulp.dest("./" + outdir + "/css/"))
        .pipe(browserSync.reload({
            stream: true
        }));
});
gulp.task("css", function () {
    return gulp.src(["./app/css/*.css", "!./app/css/*.min.css"])
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
    return gulp.src(["./app/js/*.js", "!./app/js/*.min.js"])
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
    return gulp.src("./app/**/*.html")
        .pipe(plumber())
        .pipe(nunjucks.compile(nunjucks_config, {
            env: nunjucksEnv
        }))
		.pipe(env === "production" ? minifyInline() : noop())
		.pipe(env === "production" ? htmlmin(htmlMinOptions) : noop())
		.pipe(gulp.dest("./" + outdir));
});

gulp.task("assets", function () {
    var fonts = gulp.src("./app/fonts/**/*")
        .pipe(gulp.dest("./" + outdir + "/fonts/"));
    var img = gulp.src("./app/img/**/*")
        .pipe(gulp.dest("./" + outdir + "/img/"));
    var jsmap = gulp.src("./app/js/**/*.js.map")
        .pipe(gulp.dest("./" + outdir + "/js/"));
    var cssmap = gulp.src("./app/css/**/*.css.map")
        .pipe(gulp.dest("./" + outdir + "/js/"));
    var jsmin = gulp.src("./app/js/**/*.min.js")
        .pipe(gulp.dest("./" + outdir + "/js/"));
    var cssmin = gulp.src("./app/css/**/*.min.css")
        .pipe(gulp.dest("./" + outdir + "/css/"));
    var favicons = gulp.src("./app/favicons/**/*")
        .pipe(gulp.dest("./" + outdir + "/favicons/"));
    var cname = gulp.src("./app/CNAME")
        .pipe(gulp.dest("./" + outdir));
    var fonts = gulp.src("./app/fonts/**")
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
		    "./node_modules/dropzone/dist/min/dropzone.min.js",


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
		    "./node_modules/dropzone/dist/min/dropzone.min.css",

        ])
        .pipe(gulp.dest("./" + outdir + "/css/"));


    return merge(scripts, unminifiedscripts, unminifiedstyles, styles);
});
gulp.task("set-production", function(callback) {

	env = "production";
	callback();
});
gulp.task("build", gulp.series("set-production", "clean:docs",
    gulp.parallel("styles", "html", "assets", "scripts", "libraries")
), function (callback) {
    callback();
});
gulp.task("devbuild", gulp.series("clean:docs",
	gulp.parallel("styles", "html", "assets", "scripts", "libraries")
), function (callback) {
	callback();
});
gulp.task("browserSync", function () {
    browserSync.init({
        server: {
            baseDir: "./" + outdir
		},
        files: ["app/css/*", "app/**/*.html", "app/js/*"],
		open:false
    });
});

gulp.task("watch", gulp.parallel("devbuild", "browserSync", function () {

    gulp.watch("app/css/*.+(scss|sass)", gulp.parallel("sass"));
    gulp.watch("app/css/*.css", gulp.parallel("css"));
    gulp.watch(["app/js/*.js", "!app/js/*.min.js"], gulp.parallel("scripts"));
    gulp.watch("app/**/*.html", gulp.parallel("html"));
    gulp.watch(["app/fonts/**/*", "app/js/**/*.js", "app/css/**/*.css", "app/js/**/*.map", "app/css/**/*.map", "app/img/**/*"], gulp.parallel("assets"));

}));
