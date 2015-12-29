'use strict';

var gulp       = require('gulp');
var path       = require('path');
var browserify = require('browserify');
var reactify   = require('reactify');
var watchify   = require('watchify');
var source     = require('vinyl-source-stream');
var concat     = require('gulp-concat');
var sass       = require('gulp-sass');
var rename     = require('gulp-rename');
var uglify     = require('gulp-uglify');
var minifyCSS  = require('gulp-minify-css');
var streamify = require('gulp-streamify');
var $          = require('gulp-load-plugins')();
var gulpServer = require('gulp-live-server');
var gutil = require('gulp-util');
var babelify = require('babelify');
var caseVerify = require('dep-case-verify');

var SOURCE_DIR = __dirname + '/js-app/';
var GIT_DIR = __dirname + '/main/webapp/';
var JS_FILENAME = 'app-2.2.1.js';
var JS_VENDOR_FILENAME = 'vendor.min-2.2.1.js';

// gulp-plumber for error handling
function onError() {
    /* jshint ignore:start */
    var args = Array.prototype.slice.call(arguments);
    $.util.beep();
    $.notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>"
    }).apply(this, args);
    this.emit('end'); // Keep gulp from hanging on this task
    /* jshint ignore:end */
}

// Styles
gulp.task('app-scss', function() {
    return gulp.src(SOURCE_DIR + 'styles/main.scss')
    //gulp.src(SOURCE_DIR + 'styles/**/*')
        .pipe($.plumber({errorHandler: onError}))
        .pipe($.concat('main.scss'))
        .pipe(sass())
        .pipe(minifyCSS({keepBreaks:true}))
        .pipe(rename('main.css'))
        .pipe(gulp.dest(GIT_DIR + 'static/styles'))
        .pipe($.size());
});

// Scripts
gulp.task('app-js', function() {
    var bundler;
    bundler = browserify({
        basedir: __dirname,
        noparse: ['react/addons', 'reflux', 'underscore', 'react-router', 'moment', /*'griddle-react',*/ 'material-ui','material-ui-sass'],
        // for uno: entries point app.jsx, for merge: entry point main.jsx
        entries: [SOURCE_DIR +  'main.jsx'],
        transform: [babelify, reactify],
        extensions: ['.jsx'],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    });

    bundler.plugin(caseVerify);

    //bundler = watchify(bundler);

    function rebundle() {
        console.log('Building Scripts...');
        var start = Date.now();
        return bundler.bundle()
            .on('error', onError)
            .pipe(source(JS_FILENAME))
            .pipe(gulp.dest( GIT_DIR + 'static/scripts'))
            .pipe($.notify(function() {
                console.log('Building Complete - ' + (Date.now() - start) + 'ms');
            }))
    }

//    bundler.on('update', rebundle);

    return rebundle();
});

// JS Vendor Scripts
gulp.task('vendor-js', function() {
    return gulp.src([
              SOURCE_DIR + 'vendor/bower_components/jquery/dist/jquery.min.js',
              SOURCE_DIR + 'vendor/bower_components/bootstrap/dist/js/bootstrap.min.js',
              SOURCE_DIR + 'vendor/clean_zone/clean_zone.js',
              SOURCE_DIR + 'vendor/jquery_rich_text/jquery-te-1.4.0.js',
              SOURCE_DIR + 'vendor/bootstrap-validator/validator.min.js',
              SOURCE_DIR + 'vendor/security/triple_des.js'
           ])
          .pipe(concat('vendor.js'))
          .pipe(uglify())
          .pipe(rename('vendor.min-2.1.22.js'))
          .pipe(gulp.dest( GIT_DIR + 'static/scripts'))
});

// JS Vendor css
gulp.task('vendor-css', function() {
    return gulp.src([
              SOURCE_DIR + '/vendor/bower_components/bootstrap/dist/css/bootstrap.min.css',
              SOURCE_DIR + '/vendor/bower_components/fontawesome/css/font-awesome.min.css',
              SOURCE_DIR + '/vendor/clean_zone/clean_zone.css',
              SOURCE_DIR + '/vendor/griddle/griddle.css',
              SOURCE_DIR + '/vendor/react-spinner/react-spinner.css',
              SOURCE_DIR + '/vendor/jquery_rich_text/jquery-te-1.4.0.css'
           ])
          .pipe(concat('vendor.css'))
          .pipe(minifyCSS({keepBreaks:true}))
          .pipe(rename('vendor.min.css'))
          .pipe(gulp.dest(GIT_DIR + 'static/styles'))
});

gulp.task('serve', function() {
    var express_file = SOURCE_DIR + 'DEV-ENV/server.js';
    var server = gulpServer.new( express_file );
    server.start();
});

gulp.task('uglify-js', function () {
    var bundler;
    bundler = browserify({
        basedir: __dirname,
        noparse: ['react/addons', 'reflux', 'underscore', 'react-router', 'moment', /*'griddle-react',*/ 'material-ui','material-ui-sass'],
        // for uno: entries point app.jsx, for merge: entry point main.jsx
        entries: [SOURCE_DIR +  'main.jsx'],
        transform: [babelify, reactify],
        extensions: ['.jsx'],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    });

    //bundler = watchify(bundler);

    function rebundle() {
        console.log('Building Scripts...');
        var start = Date.now();
        return bundler.bundle()
            .on('error', onError)
            .pipe(source(JS_FILENAME))
            .pipe(streamify(uglify().on('error', gutil.log)))
            .pipe(gulp.dest( GIT_DIR + 'static/scripts'))
            .pipe($.notify(function() {
                console.log('Building Complete - ' + (Date.now() - start) + 'ms');
            }))
    }

//    bundler.on('update', rebundle);

    return rebundle();
});

gulp.task('uglify', function () {
   return gulp.src(GIT_DIR + 'static/scripts' + JS_FILENAME)
            .pipe(uglify())
            .pipe(gulp.dest( GIT_DIR + 'static/scripts'));
});

// gulp.task('uglifyIndexJs', function () {
//    return gulp.src(GIT_DIR + 'static/scripts/index.min.js')
//             .pipe(uglify())
//             .pipe(gulp.dest( GIT_DIR + 'static/scripts/'));
// });

// Build task
gulp.task('build', ['app-scss', 'vendor-js', 'vendor-css', 'app-js']);

gulp.task('production', ['app-scss', 'vendor-js', 'vendor-css', 'uglify-js']);

// Default task for starting gulp server
gulp.task('default', ['build', 'serve'],function() {
    gulp.watch(SOURCE_DIR+'**/*.jsx', ['app-js']);
    gulp.watch(SOURCE_DIR+'**/*.js', ['app-js']);
    gulp.watch(SOURCE_DIR + '/vendor/**/*.js', ['vendor-js']);
    gulp.watch(SOURCE_DIR + '/styles/**/*.scss', ['app-scss']);
    gulp.watch(SOURCE_DIR + '/vendor/**/*.css', ['vendor-css']);
});
