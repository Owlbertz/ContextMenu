// Requirements
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var minify_css = require('gulp-minify-css');
var compressor = require('gulp-compressor');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var path = require('path');

// Defines paths
var srcpath = 'src';
var destpath = 'dist';

var projectName = 'contextMenu';

/***************************************************
 * default
 *  build and deploy
 *** ************************************************/
gulp.task('default', ['build'], function() {
}); 


/***************************************************
 * build
 *  1. created languages with mustache
 *  2. converts sass to css
 *  3. compresses (concats and minifies) css
 *  4. compresses (concats and uglyfies) js
 *  5. copies files that are not handled yet
 *  output is stored in the destpath
 ***************************************************/
gulp.task('build', ['compress-js', 'compress-css', 'copy-files'], function() {
});

/***************************************************
 * compress-js
 ***************************************************/
gulp.task('compress-js', function () {
  return gulp.src([srcpath+'/js/'+projectName+'.js'])
    .pipe(uglify())
    .pipe(rename(projectName+'.min.js'))
    .pipe(gulp.dest(destpath+'/js/'));
});

/***************************************************
 * compress-css
 ***************************************************/
gulp.task('compress-css', function () {
  return sass(srcpath+'/css/'+projectName+'.scss', {sourcemap: false})
    .pipe(minify_css())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie 10', 'Android >= 4.1']
    }))
    .pipe(rename(projectName+'.min.css'))
    .pipe(gulp.dest(destpath+'/css/'));
});

/***************************************************
 * copy-files
 ***************************************************/
gulp.task('copy-files', function () {
    sass(srcpath+'/css/'+projectName+'.scss', {sourcemap: false})
    .pipe(gulp .dest(destpath+'/css'));
    gulp.src(srcpath+'/js/'+projectName+'.js')
    .pipe(gulp .dest(destpath+'/js'));
});