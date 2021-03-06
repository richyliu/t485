// Import Utils
const gulp = require("gulp");//gulp
const sass = require("gulp-sass");//sass
const browserSync = require("browser-sync").create();//dev preview
const useref = require("gulp-useref");//concatenate css and js when added to html with proper comment syntax
const uglify = require("gulp-uglify-es").default;//minify js(wih es6) IMPORTANT: use .defualt afterwards
const gulpIf = require("gulp-if");//conditionals
const cssnano = require("gulp-cssnano"); //minify css
const imagemin = require("gulp-imagemin"); //minify images
const cache = require("gulp-cache"); //cacheing images
const del = require("del"); //delete
const runSequence = require("run-sequence"); //sequencing
const replace = require("gulp-replace");//regex and simple replace
const log = require('fancy-log');//error logging.
const nunjucks = require("gulp-nunjucks");//nunjucks
const nunjucks_config = require("./nunjucks-data");//nunjucks config data
const nunjucksModule = require("nunjucks");//nunjucks
const plumber = require("gulp-plumber");//error handling
const merge = require('merge-stream');

let nunjucksEnv = new nunjucksModule.Environment(new nunjucksModule.FileSystemLoader("./app/templates"));
let baseurl = "./app/";
//Catchall
// gulp.task("catchall", function () {
// 	//get all scss files in the css folder
// 	return gulp.src(["./app/**/*"])
// 		//.pipe(plumber())
// 		.pipe(gulp.dest("./docs/"))
// 		//.pipe(browserSync.reload({
// 		//	stream: true
// 		//}))
// });


// Process Sass
gulp.task("sass", function () {
	//get all scss files in the css folder
	return gulp.src(["./app/css/**/*.scss", "./app/admin/css/**/*.scss"], {base: baseurl + "css/"})
	// {base: baseurl} ensures that files in subdirectories stay in subdirectories(baseurl is a variable)
	// https://github.com/gulpjs/gulp/blob/master/docs/recipes/maintain-directory-structure-while-globbing.md
	
		.pipe(plumber())
		.pipe(sass()) // Use gulp-sass
		.pipe(gulp.dest("./docs/css"))
		.pipe(browserSync.reload({
			stream: true
		}))
});

// Process CSS
gulp.task("styles", function () {
	//get all scss files in the css folder
	return gulp.src(["./app/css/**/*.css", "!./app/css/**/*.scss"], {base: baseurl + "css/"})
		.pipe(plumber())
		.pipe(cssnano())
		.pipe(gulp.dest("./docs/css"))
		.pipe(browserSync.reload({
			stream: true
		}))
});
// Process JS
gulp.task("scripts", function () {
	
	return gulp.src(["./app/js/*.js"], {base: baseurl + "js/"})//Dont uglify tinymce, instead that is piped into others
		.pipe(plumber())
		.pipe(uglify())
		.pipe(gulp.dest("./docs/js"))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task("tinymce", function(){
    return gulp.src(["./app/js/tinymce/**/*"], {base: baseurl + "js/tinymce/"})
    .pipe(gulp.dest("./docs/js/tinymce/"))
})

gulp.task("templates", function () {
	//get all scss files in the css folder
	return gulp.src(["./app/templates/**/*"], {base: baseurl + "templates/"})
		.pipe(plumber())
		.pipe(nunjucks.compile(nunjucks_config, { env: nunjucksEnv }))
		.pipe(replace(/<!--\s*build:(scss|sass)(?: |	){1,2}([a-zA-Z0-9-_\.+:]+)\.(\1|css)\s*-->/gim, function (match, p1, p2, p3, offset, string) {
			// See http://mdn.io/string.replace#Specifying_a_function_as_a_parameter 
			
			//do nothing
			//if its an absolute url
			
			if (p2.charAt(0) != "/") {
				p2 = "./css/" + p2;
			}
			//this is assuming that the sass function is run
			return "<link href=\"" + p2 + ".css\" rel=\"stylesheet\" type=\"text/css\">";
		}))
		//save the useref files so it can be uglified
		.pipe(gulp.dest("./docs"))
		
		
		.pipe(browserSync.reload({
			stream: true
		}))
});

// Process HTML
gulp.task("html", function () {
	//get all scss files in the css folder
	return gulp.src(["./app/**/*.+(html|htm)", "!./app/offline/**/*", "!./app/templates/**/*", "!./app/admin/**/*"], {base: baseurl})
		.pipe(plumber())
		.pipe(nunjucks.compile(nunjucks_config, { env: nunjucksEnv }))
		.pipe(replace(/<!--\s*build:(scss|sass)(?: |	){1,2}([a-zA-Z0-9-_\.+:]+)\.(\1|css)\s*-->/gim, function (match, p1, p2, p3, offset, string) {
			// See http://mdn.io/string.replace#Specifying_a_function_as_a_parameter 
			
			//do nothing
			//if it's an absolute url
			
			if (p2.charAt(0) != "/") {
				p2 = "/css/" + p2;
			}
			//this is assuming that the sass function is run
			return "<link href=\"" + p2 + ".css\" rel=\"stylesheet\" type=\"text/css\">";
		}))
		//save the useref files so it can be uglified
		.pipe(useref())
		.pipe(gulp.dest("./docs"))
		// Minifies JS only
		.pipe(gulpIf("*.js", uglify()))
		.pipe(gulpIf("*.css", cssnano()))
		//save the file after uglification
		.pipe(gulp.dest("./docs"))
		
		.pipe(browserSync.reload({
			stream: true
		}));
});

//images
gulp.task("img", function () {
	return gulp.src(["./app/img/**/*"], {base: baseurl + "img/"})
		.pipe(plumber())
		//.pipe(cache(imagemin()))//optimize the image and cache the result
		//dont optimize because takes too long and not very useful
		.pipe(gulp.dest("./docs/img"))
		.pipe(browserSync.reload({
			stream: true
		}));
});

//fonts
gulp.task("fonts", function () {
	return gulp.src("./app/fonts/**/*", {base: baseurl + "fonts/"})
		.pipe(plumber())
		.pipe(gulp.dest("./docs/fonts"))
		.pipe(browserSync.reload({
			stream: true
		}));
})

gulp.task("other", function(){
	
	var cname = gulp.src(["./app/CNAME"], {base: baseurl})
	.pipe(plumber())
	.pipe(gulp.dest("./docs/"));
	var favicon1 = gulp.src(["./app/favicons/**/*"], {base: baseurl + "favicons/"})
	.pipe(plumber())
	.pipe(gulp.dest("./docs/favicons/"));
	var favicon2 = gulp.src(["./app/favicon.ico"], {base: baseurl})
	.pipe(plumber())
	.pipe(gulp.dest("./docs/"));
	var admin = gulp.src(["./app/admin/**/*"], {base: baseurl + "admin/"})
	.pipe(plumber())
	.pipe(gulp.dest("./docs/admin/"));
	var resources = gulp.src(["./app/resources/**/*"], {base: baseurl + "resources/"})
	.pipe(plumber())
	.pipe(gulp.dest("./docs/resources/"));

	return merge(cname, favicon1, favicon2, admin, resources);

})



gulp.task("clean:docs", function () {
	return del.sync("docs");
})
gulp.task("cache:clear", function (callback) {
	return cache.clearAll(callback)
})
//TODO
gulp.task("build", function (callback) {
	runSequence("clean:docs",/*"catchall", */
		["templates", "sass", "img", "fonts", "html", "styles", "scripts", "other", "tinymce"],
		callback
	)
	
})

gulp.task("default", function (callback) {
	runSequence("build", "watch",
		callback
	)
})
gulp.task("browserSync", function () {
	browserSync.init({
		server: {
			baseDir: "./docs",
			port:8000
		},
	})
})

gulp.task("watch", ["browserSync"], function () {
    //gulp.watch(["./**/*"], ["catchall"])
	gulp.watch(["./app/css/**/*.scss"], ["sass"]);
	gulp.watch(["./app/css/**/*.css", "!./app/css/**/*.scss"], ["styles"]);
	gulp.watch(["./app/**/*.html"], ["html"/*, "templates"*/]);
	gulp.watch(["./app/js/**/*.js"], ["scripts", "tinymce"]);
	gulp.watch(["./app/fonts/**/*"], ["fonts"]);
	gulp.watch(["./app/img/**/*.+(png|jpg|jpeg|gif|svg)"], ["img"]);

})

