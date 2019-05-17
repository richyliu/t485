// Gulp Core
const gulp = require("gulp");

// Utilities
const plumber = require("gulp-plumber");
const del = require("del");
const merge = require("merge-stream");
const noop = require("gulp-noop");
const cache = require("gulp-cached");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const rename = require("gulp-rename");
const glob = require("glob");
const es = require("event-stream");

// HTML
const htmlMinOptions = {
    collapseWhitespace: true,
    removeComments: true,
};
const htmlmin = require("gulp-htmlmin");
const minifyInline = require("gulp-minify-inline");
const nunjucks = require("gulp-nunjucks");
const nunjucks_config = require("./nunjucks-data");
const nunjucksModule = require("nunjucks");

// Styles
const sass = require("gulp-sass");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");

// Scripts
const browserify = require("browserify");
const tsify = require("tsify");
const terser = require("gulp-terser");
const typedoc = require("gulp-typedoc");

// Development
var browserSync = require("browser-sync").create();

// Environment
let env = process.env.NODE_ENV || "development";
let outdir = env == "production" ? "dist" : "devserver";
let silentDocs = false;
let devWatch = false;
const base = "./src";
var nunjucksEnv = new nunjucksModule.Environment(new nunjucksModule.FileSystemLoader(base + "/templates"));


/**
 * Sass => CSS => Minified CSS
 */
gulp.task("sass", function() {
    return gulp.src(base + "/css/**/*.+(scss|sass)")
            .pipe(plumber())
            .pipe(env === "production" ? noop() : cache("sass"))
            .pipe(sass()) // Converts Sass to CSS with gulp-sass
            .pipe(env === "production" ? postcss([cssnano()]) : noop())
            .pipe(gulp.dest("./" + outdir + "/css/"))
            .pipe(browserSync.reload({
                stream: true,
            }));
});

/**
 * CSS => Minified CSS
 */
gulp.task("css", function() {
    return gulp.src([base + "/css/**/*.css", "!" + base + "/css/*.min.css"])
            .pipe(plumber())
            .pipe(env === "production" ? noop() : cache("css"))
            .pipe(env === "production" ? postcss([cssnano()]) : noop())
            .pipe(gulp.dest("./" + outdir + "/css/"))
            .pipe(browserSync.reload({
                stream: true,
            }));
});

/**
 * SASS + CSS
 */
gulp.task("styles", gulp.parallel("sass", "css"), function(callback) {

    callback();
});

/**
 * JS => Minified JS
 */
gulp.task("scripts", function() {
    return gulp.src([base + "/js/*.js", "!" + base + "/js/*.min.js"])
            .pipe(plumber())
            .pipe(env === "production" ? noop() : cache("scripts"))
            .pipe(env === "production" ? terser() : noop())
            .pipe(gulp.dest("./" + outdir + "/js/"))
            .pipe(browserSync.reload({
                stream: true,
            }));
});

/**
 * TS => JS => Minified JS
 */
gulp.task("typescript", function(done) {

    // https://fettblog.eu/gulp-browserify-multiple-bundles/

    glob(base + "/js/pages/**/**.ts", function(err, files) {
        if (err) done(err);

        let tasks = files.map(function(entry) {
            let b = browserify({
                entries: [entry],
                cache: {},
                packageCache: {},
                ignoreWatch: ["**/node_modules/**"],
                debug: (env !== "production"),
            })
                    .plugin(tsify)
                    //.transform(babelify, { extensions: [ '.tsx', '.ts' ] })
                    .bundle()
                    .pipe(plumber())
                    .pipe(source(entry))
                    .pipe(rename(function(path) {
                        //get rid of /js/pages/ but preserve any further directories.

                        path.dirname = path.dirname.split("/").slice(3).join("/");

                        //change the extension
                        path.extname = ".bundle.js";
                    }))
                    .pipe(buffer())
                    .pipe(env === "production" ? terser() : noop())
                    .pipe(gulp.dest("./" + outdir + "/js/"));

            b.on("update", function(ids) {
                console.log("bundling " + ids);
            });

            return b;
        });
        es.merge(tasks).on("end", done);
    });

});

/**
 * TS => Docs
 */
gulp.task("docs", function() {


    return gulp
            .src([base + "/js/**/*.ts", "!" + base + "/js/pages/**/*", "!./node_modules/**"])
            .pipe(plumber())
            .pipe(env === "production" ? noop() : cache("docs"))
            .pipe(typedoc({
                // TypeScript options (see typescript docs)
                module: "browser",
                target: "es6",
                //lib:["es6", "dom"],
                includeDeclarations: true,
                // compilerOptions: {
                // 	module: "browser",
                // 	target: "es6",
                // 	lib:["es6", "dom"]
                // },

                // Output options (see typedoc docs)
                out: "./" + outdir + "/developer/docs/",
                //json: "./" + outdir + "/developer/docs/docs.json",

                // Exclude node_modules
                exclude: "**/node_modules/**",
                //ignore: "**/node_modules/**",
                //excludeExternals: true,


                // TypeDoc options (see typedoc docs)
                name: "T485 v2 Internal Docs",
                theme: "typedoc_theme",
                plugins: [],
                ignoreCompilerErrors: true,
                version: true,
                logger: silentDocs ? "none" : undefined,
            }));
});

/**
 * Delete build directory
 */
gulp.task("clean", function(callback) {
    del.sync("./" + outdir, callback);
    callback();
});

/**
 * Nunjucks => HTML => Minified HTML
 */
gulp.task("html", function() {
    return gulp.src(base + "/**/*.html")
            .pipe(plumber())
            .pipe(env === "production" ? noop() : cache("html"))
            .pipe(nunjucks.compile(nunjucks_config, {
                env: nunjucksEnv,
            }))
            .pipe(env === "production" ? minifyInline() : noop())
            .pipe(env === "production" ? htmlmin(htmlMinOptions) : noop())
            .pipe(gulp.dest("./" + outdir));
});

/**
 * Copy misc. files.
 */
gulp.task("assets", function() {
    let fonts = gulp.src(base + "/fonts/**/*")
            .pipe(plumber())
            .pipe(env === "production" ? noop() : cache("assets-fonts"))
            .pipe(gulp.dest("./" + outdir + "/fonts/"));
    let img = gulp.src(base + "/img/**/*")
            .pipe(plumber())
            .pipe(env === "production" ? noop() : cache("assets-img"))
            .pipe(gulp.dest("./" + outdir + "/img/"));
    let jsmap = gulp.src(base + "/js/**/*.js.map")
            .pipe(plumber())
            .pipe(env === "production" ? noop() : cache("assets-jsmap"))
            .pipe(gulp.dest("./" + outdir + "/js/"));
    let cssmap = gulp.src(base + "/css/**/*.css.map")
            .pipe(plumber())
            .pipe(env === "production" ? noop() : cache("assets-cssmap"))
            .pipe(gulp.dest("./" + outdir + "/js/"));
    let jsmin = gulp.src(base + "/js/**/*.min.js")
            .pipe(plumber())
            .pipe(env === "production" ? noop() : cache("assets-jsmin"))
            .pipe(gulp.dest("./" + outdir + "/js/"));
    let cssmin = gulp.src(base + "/css/**/*.min.css")
            .pipe(plumber())
            .pipe(env === "production" ? noop() : cache("assets-cssmin"))
            .pipe(gulp.dest("./" + outdir + "/css/"));
    let favicons = gulp.src(base + "/favicons/**/*")
            .pipe(plumber())
            .pipe(env === "production" ? noop() : cache("assets-favicons"))
            .pipe(gulp.dest("./" + outdir + "/favicons/"));
    let cname = gulp.src(base + "/CNAME")
            .pipe(plumber())
            .pipe(env === "production" ? noop() : cache("assets-cname"))
            .pipe(gulp.dest("./" + outdir));
    let serviceWorker = gulp.src(base + "/service-worker.js")
            .pipe(plumber())
            .pipe(gulp.dest("./" + outdir));


    return merge(fonts, img, jsmap, cssmap, jsmin, jsmap, favicons, cname, serviceWorker);
});

/**
 * Copy js libraries, css libraries, and fonts
 */
gulp.task("libraries", function() {

    let scripts = gulp.src([
        "./node_modules/bootstrap/dist/js/bootstrap.min.js",
        "./node_modules/bootstrap/dist/js/bootstrap.min.js.map",
        "./node_modules/jquery/dist/jquery.min.js",
        "./node_modules/jquery/dist/jquery.min.map",
        "./node_modules/popper.js/dist/umd/popper.min.js",
        "./node_modules/popper.js/dist/umd/popper.min.js.map",
        "./node_modules/bootstrap-select/dist/js/bootstrap-select.min.js",
        "./node_modules/list.js/dist/list.min.js",

    ])
            .pipe(plumber())
            .pipe(env === "production" ? noop() : cache("libraries-scripts"))
            .pipe(gulp.dest("./" + outdir + "/js/"));
    let unminifiedScripts = gulp.src([
        "./node_modules/flatpickr/dist/flatpickr.js",

    ])
            .pipe(plumber())
            .pipe(env === "production" ? noop() : cache("libraries-unminifiedscripts"))
            .pipe(env === "production" ? terser() : noop())
            .pipe(gulp.dest("./" + outdir + "/js/"));
    let unminifiedStyles = gulp.src([
        "./node_modules/flatpickr/dist/flatpickr.css",

    ])
            .pipe(plumber())
            .pipe(env === "production" ? noop() : cache("libraries-unminifiedstyles"))
            .pipe(env === "production" ? postcss([cssnano()]) : noop())
            .pipe(gulp.dest("./" + outdir + "/css/"));
    let styles = gulp.src([
        "./node_modules/bootstrap/dist/css/bootstrap.min.css",
        "./node_modules/bootstrap/dist/css/bootstrap.min.css.map",
        "./node_modules/bootstrap-select/dist/css/bootstrap-select.min.css",

    ])
            .pipe(plumber())
            .pipe(env === "production" ? noop() : cache("libraries-styles"))
            .pipe(gulp.dest("./" + outdir + "/css/"));

    let fontjs = gulp.src([
        "./node_modules/@fortawesome/fontawesome-pro/js/all.min.js",
        "./node_modules/@fortawesome/fontawesome-pro/js/brands.min.js",
        "./node_modules/@fortawesome/fontawesome-pro/js/fontawesome.min.js",
        "./node_modules/@fortawesome/fontawesome-pro/js/light.min.js",
        "./node_modules/@fortawesome/fontawesome-pro/js/regular.min.js",
        "./node_modules/@fortawesome/fontawesome-pro/js/solid.min.js",

    ])
            .pipe(plumber())
            .pipe(env === "production" ? noop() : cache("libraries-fontjs"))
            .pipe(gulp.dest("./" + outdir + "/fonts/fontawesome/js/"));
    let fontcss = gulp.src([
        "./node_modules/@fortawesome/fontawesome-pro/css/svg-with-js.min.css",

    ])
            .pipe(plumber())
            .pipe(env === "production" ? noop() : cache("libraries-fontcss"))
            .pipe(gulp.dest("./" + outdir + "/fonts/fontawesome/css/"));
    let fontfolder = gulp.src([
        "./node_modules/typeface-lora/**",
        "./node_modules/typeface-raleway/**",

    ], { base: "./node_modules/" })
            .pipe(plumber())
            .pipe(gulp.dest("./" + outdir + "/fonts/"));


    return merge(scripts, unminifiedScripts, unminifiedStyles, styles, fontjs, fontcss);
});

/**
 * Set env var to production
 */
gulp.task("set-production", function(callback) {

    env = "production";
    outdir = "dist";
    callback();
});

/**
 * Set typedoc to use silent docs.
 */
gulp.task("set-silentDocs", function(callback) {
    silentDocs = true;
    callback();
});

/**
 * Build to devserver.
 */
gulp.task("devBuild", gulp.series("set-silentDocs", "clean",
        gulp.parallel("styles", "assets", "scripts", "typescript", "libraries", "docs"),
        "html",
), function(callback) {
    callback();
});

/**
 * Build to dist dir.
 */
gulp.task("build", gulp.series("set-production", "devBuild"), function(callback) {
    callback();
});

/**
 * Start local server from dist dir.
 */
gulp.task("serveBuild", function() {
    browserSync.init({
        server: {
            baseDir: "./dist",
            serveStaticOptions: {
                extensions: ["html"],
            },
        },
        open: false,
    });
});

/**
 * Start local server from devserver dir.
 */
gulp.task("serveDev", function() {
    browserSync.init({
        server: {
            baseDir: "./devserver",
            serveStaticOptions: {
                extensions: ["html"],
            },
        },
        open: false,
    });
});

/**
 * Start live server.
 */
gulp.task("browserSync", function() {
    browserSync.init({
        server: {
            baseDir: "./" + outdir,
            serveStaticOptions: {
                extensions: ["html"],
            },
        },
        open: false,
    });
});

/**
 * Start live dev server.
 */
gulp.task("watch", gulp.parallel(function() {
    devWatch = true;
    gulp.watch(base + "/css/**/*.+(scss|sass)", gulp.parallel("sass"));
    gulp.watch(base + "/css/**/*.css", gulp.parallel("css"));
    gulp.watch([base + "/js/**/*.js", "!" + base + "/js/*.min.js"], gulp.parallel("scripts"));
    gulp.watch([base + "/js/**/*.ts"], gulp.series("typescript", "docs"));
    gulp.watch("readme.md", gulp.parallel("docs"));
    gulp.watch(base + "/**/*.html", gulp.parallel("html"));
    gulp.watch([base + "/fonts/**/*", base + "/js/**/*.js", base + "/css/**/*.css", base + "/js/**/*.map", base + "/css/**/*.map", base + "/img/**/*", base + "/service-worker.js"], gulp.parallel("assets"));

}, gulp.series("devBuild", "browserSync")));

