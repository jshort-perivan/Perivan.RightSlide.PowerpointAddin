/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var del = require('del');
var gulp = require('gulp');
var gutil = require('gulp-util');
var cssmin = require('gulp-cssmin');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var ts = require('gulp-typescript');
var replace = require('gulp-replace');
var webpack = require('webpack');

// Recompile Bootstrap to disable screen size responsiveness

var bootstrapDistPath = 'node_modules/bootstrap/dist';
var bootstrapSassPath = 'node_modules/bootstrap/scss';

// Copy custom gridpoints settings file - this is in the "styles" folder to avoid being overriden by npm
gulp.task('bootstrap-copy-variables', function () {
    return gulp.src('wwwroot/styles/sass/common/overrides/_bootstrap-custom-variables.scss')
        .pipe(rename('_custom.scss'))
        .pipe(gulp.dest(bootstrapSassPath));
});

// Clear original bootstrap files and recompile with our new settings
gulp.task('bootstrap-compile', ['bootstrap-copy-variables'], function () {
    del([bootstrapDistPath + '/css/*.css']);
    return gulp.src(bootstrapSassPath + '/bootstrap.scss')
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(gulp.dest(bootstrapDistPath + '/css'));
});

// Create minified file
gulp.task('bootstrap-minify', ['bootstrap-compile'], function () {
    return gulp.src(bootstrapDistPath + '/css/bootstrap.css')
        .pipe(cssmin())
        .pipe(rename('bootstrap.min.css'))
        .pipe(gulp.dest(bootstrapDistPath + '/css'));
});

// Copy compiled files to our usual lib folder - main task that covers all bootstrap operations
gulp.task('lib-bootstrap', ['bootstrap-minify'], function () {
    return gulp.src(bootstrapDistPath + '/**/*.css')
        .pipe(gulp.dest('wwwroot/lib/bootstrap/dist'));
});

gulp.task('sass', function () {
    return gulp.src('wwwroot/styles/sass/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('wwwroot/styles/css'));
});

gulp.task('sass:watch', ['sass'], function () {
    gulp.watch('wwwroot/styles/sass/**/*.scss', ['sass']);
});

var webpackConfig = require('./webpack/webpack.prod.ts');
gulp.task('webpack:publish', function (callback) {
    webpack(webpackConfig, function (err, stats) {
        if (err)
            throw new gutil.PluginError('webpack:publish', err);
        gutil.log('[webpack:publish] Completed\n' + stats.toString({
            assets: true,
            chunks: false,
            chunkModules: false,
            colors: true,
            hash: false,
            timings: false,
            version: false
        }));
        callback();
    });
});

gulp.task('webpack:clean', function (callback) {
    del(['wwwroot/dist']);
});
