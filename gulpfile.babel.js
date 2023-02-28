import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
import image from "gulp-image";
// import sass from "gulp-sass";
const sass = require("gulp-sass")(require("node-sass"));
import autoprefixer from "gulp-autoprefixer";
import miniCSS from "gulp-csso";

sass.compiler = require("node-sass");

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build"
  },
  img: {
    src: "src/img/*",
    dest: "build/img"
  },
  scss: {
    watch: "src/**/*.scss",
    src: "src/scss/style.scss",
    dest: "build/css"
  }
};

const pug = () =>
  gulp
    .src(routes.pug.src)
    .pipe(gpug())
    .pipe(gulp.dest(routes.pug.dest));

const clean = () => del(["build/"]);

const webserver = () => gulp.src("build").pipe(ws({ livereloard: true, open: true }));

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.scss.watch, styles);
}; 

const img = () =>
  gulp
  .src(routes.img.src)
  .pipe(image())
  .pipe(gulp.dest(routes.img.dest));
  
const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    // .pipe(
    //   autoprefixer({
    //     browsers: ["last 2 versions"]
    //   })
    // )
    .pipe(autoprefixer())
    .pipe(miniCSS())
    .pipe(gulp.dest(routes.scss.dest));

const prepare = gulp.series([clean]);

const assets = gulp.series([pug, img, styles]);

const postDev = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, postDev]);