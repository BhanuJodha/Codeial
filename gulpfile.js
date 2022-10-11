const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const rev = require("gulp-rev");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const del = require("del");

gulp.task("css", (done) => {
    console.log("Minifying CSS");

    gulp.src("./assets/scss/**/*.scss")
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest("./assets/css"));

    gulp.src("./assets/**/*.css")
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(rev.manifest({
        cwd: "public",
        merge: true
    }))
    .pipe(gulp.dest("./public/assets"));

    done();
});

gulp.task("js", (done)=>{
    console.log("Minifying JS");

    gulp.src("./assets/**/*.js")
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(rev.manifest({
        cwd: "public",
        merge: true
    }))
    .pipe(gulp.dest("./public/assets"));

    done();
});

gulp.task("images", (done)=>{
    console.log("Minifying images");

    gulp.src("./assets/**/*.+(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjp|png|svg|webp)")
    .pipe(imagemin())
    .pipe(gulp.dest("./public/assets"))

    done();
});

gulp.task("clear:assets", (done) => {
    console.log("Clearing assets");

    del.sync("./public/assets/*");

    done();
});

gulp.task("build", gulp.series("clear:assets","css","js","images"), (done) => {
    console.log("Build sucessfully completed");
    done();
});

