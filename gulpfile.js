"use strict";

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const server = require("browser-sync").create();
const minify = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const del = require("del");
const webp = require("gulp-webp");
const mozjpeg = require("imagemin-mozjpeg");

gulp.task("css", function () {
  return gulp.src("./sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("images", function () {
  return gulp.src("./img/**/*.{png,jpg}")
      .pipe(imagemin([
        imagemin.optipng({optimizationLevel: 3}),
        imagemin.mozjpeg({progressive: true}),
      ]))
      .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
    return gulp.src("./img/**/*.{png,jpg}")
        .pipe(webp({quality: 90}))
        .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {
    return gulp.src([
        "./*.html"
    ], {
        base: "./"
    })
    .pipe(gulp.dest("build"))
    .pipe(server.stream());
});

gulp.task("js", function () {
    return gulp.src([
        "./js/**",
    ], {
        base: "./"
    })
        .pipe(gulp.dest("build"))
        .pipe(server.stream());
});

gulp.task("copy", function () {
    return gulp.src([
        "./fonts/**/*.{woff,woff2}",
        "./img/**/*.svg",
    ], {
        base: "./"
    })
    .pipe(gulp.dest("build"))
    .pipe(server.stream());
});

gulp.task("clean", function () {
    return del("build");
});

gulp.task("server", function () {
  server.init({
    server: "./build",
    single: true,
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("./sass/**/*.scss").on("change", gulp.series("css"));
  gulp.watch("./*.html").on("change", gulp.series("html"));
  gulp.watch("./js/*.js").on("change", gulp.series("js"));

});

gulp.task("build", gulp.series(
    "clean",
    "copy",
    "js",
    "html",
    "css",
    "images",
    "webp",
    "server"
));


