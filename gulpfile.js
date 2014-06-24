var gulp = require('gulp');

//var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var imagemin = require('gulp-imagemin');
var less = require('gulp-less');
var stylish = require('jshint-stylish');
var del = require('del');
var rename = require('gulp-rename');
var connect = require('gulp-connect');


var paths = {
  scripts: ['src/js/**/*.js'],
  less:	['src/less/**/*.less']
};


// Lint JS
gulp.task('lint', function() {
  gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use all packages available on npm
gulp.task('clean', function(cb) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  del(['build'], cb);
});

gulp.task('scripts', [], function() {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(paths.scripts)
    //.pipe(coffee())
    .pipe(uglify())
    .pipe(concat('bootstrap-datetimepicker.min.js'))
    .pipe(connect.reload())
    .pipe(gulp.dest('build/js'));
});

gulp.task('styles', [], function() {
  // Generate and minify less
  return gulp.src(paths.less)
    .pipe(less({ sourceMap: false, compress: true }))
    .pipe(rename('bootstrap-datetimepicker.min.css'))
    .pipe(connect.reload())
    .pipe(gulp.dest('build/css'));
});

gulp.task('connectDev', function () {
  connect.server({
    port: 8000,
    livereload: true
  });
});

gulp.task('connectDist', function () {
  connect.server({
    port: 8001,
    livereload: true
  });
});

// Copy all static images
/*
gulp.task('images', ['clean'], function() {
 return gulp.src(paths.images)
    // Pass in options to the task
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/img'));
});
*/

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.less, ['styles']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('build', ['clean', 'scripts','styles']);
gulp.task('default', ['connectDev','watch']);
gulp.task('jshint', ['lint']);