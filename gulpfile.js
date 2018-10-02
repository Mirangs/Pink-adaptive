"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var run = require("run-sequence");
var del = require("del");
var uglify = require("gulp-uglify");
var pump = require("pump");

gulp.task("style", function () {
	gulp.src("sass/style.{scss,sass}")
		.pipe(plumber())
		.pipe(sass())
		.pipe(postcss([
			autoprefixer()
		]))
		.pipe(gulp.dest("build/css"))
		.pipe(minify())
		.pipe(rename("style.min.css"))
		.pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("js", function() {
		gulp.src("js/**/*.js")
  		.pipe(gulp.dest("build/js"))
  		.pipe(uglify())
  		.pipe(rename("index.min.js"))
  		.pipe(gulp.dest("build/js"));
});

gulp.task("serve", function() {
	server.init({
		server: "build/"
	});

	gulp.watch("sass/**/*.{scss,sass}", ["style"]);
	gulp.watch("*.html", ["html"]);
  gulp.watch("*.html").on("change", server.reload);
	gulp.watch("js/**/*.js", ["js"]);
  gulp.watch("img/**/*.{jpg,png,svg}", ["sprite", "images", server.reload]);
});

gulp.task("images", function() {
	return gulp.src("img/**/*.{png,jpg,svg}")
	.pipe(imagemin([
		imagemin.optipng({optimizationLevel: 3}),
		imagemin.jpegtran({progressive: true}),
		imagemin.svgo({
      plugins: [
        {removeViewBox: true},
        {cleanUpIDs: false}
      ]
    })
	]))
	.pipe(gulp.dest("build/img"));
});

gulp.task("webp", function() {
	return gulp.src("img/**/*.{png,jpg}")
	.pipe(webp({quality: 90}))
	.pipe(gulp.dest("build/img"));
});

gulp.task("sprite", function() {
	return gulp.src("img/icon-*.svg")
	.pipe(svgstore({
		inlineSvg: true
	}))
	.pipe(rename("sprite.svg"))
	.pipe(gulp.dest("build/img"));
});

gulp.task("html", function() {
	return gulp.src("*.html")
		.pipe(posthtml([
			include()
		]))
		.pipe(gulp.dest("build"));
});

gulp.task("build", function(done) {
	run(
		"clean",
		"copy",
		"style",
		"js",
		"sprite",
    "images",
		"html",
		done
	);
});

gulp.task("copy", function() {
	return gulp.src([
		"fonts/**/*.{woff,woff2}",
	], {
		base: "."
	})
	.pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
	return del("build");
});
