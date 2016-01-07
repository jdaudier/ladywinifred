'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var util = require('gulp-util');
var $ = require('gulp-load-plugins')();
var uglify = require('gulp-uglify');

var AUTOPREFIXER_BROWSERS = [
	'ie >= 10',
	'ie_mob >= 10',
	'chrome >= 39',
	'and_chr >= 39',
	'safari >= 6.1',
	'ff >= 34',
	'ios >= 6.1',
	'android >= 4'
];

function onError(err) {
	util.log(util.colors.red(err.message));

	$.notify.onError({
		title: 'Compilation Failure!',
		message: 'Check your terminal console',
		sound: 'Basso'
	})(err);

	this.emit('end');
}

// Optimize & copy images to dist
gulp.task('images', function() {
	util.log(util.colors.bgCyan.bold('Optimize images'));

	return gulp.src([
		'public/images/**/*'
	])
		.pipe($.cache($.imagemin({
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('public/images'))
		.pipe($.size({title: 'images'}));
});

// Copy, concatenate & minify vendor styles to dist
gulp.task('vendor-styles', function() {
	util.log(util.colors.bgCyan.bold('Copy vendor styles to dist folder'));

	return gulp.src([
		'node_modules/normalize.css/normalize.css'
	])
		.pipe($.cssnano())
		.pipe($.rename('normalize.min.css'))
		.pipe(gulp.dest('public/stylesheets'))
		.pipe($.size({title: 'vendor styles'}));
});

// Compile, auto-prefix, concatenate & minify stylesheets
gulp.task('styles', function() {
	util.log(util.colors.bgCyan.bold('Auto-prefix & Minify CSS'));

	return gulp.src([
		'public/stylesheets/style.css'
	]).pipe($.plumber({
		errorHandler: onError
	}))
		.pipe($.sourcemaps.init())
		.pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
		.pipe($.cssnano())
		.pipe($.sourcemaps.write('.'))
		.pipe($.rename('style.min.css'))
		.pipe(gulp.dest('public/stylesheets'))
		.pipe($.size({title: 'styles'}));
});

// Concatenate & minify vendor JavaScript
gulp.task('vendor-scripts', function () {
    util.log(util.colors.bgGreen.bold('Concatenate & minify vendor JS'));

    return gulp.src([
        './node_modules/velocity-animate/velocity.min.js',
        './public/javascripts/vendor/**/*.js'
    ])
        .pipe($.sourcemaps.init())
        .pipe($.concat('vendor.min.js'))
        .pipe(uglify({
            mangle: true,
            compress: {
                sequences: true,
                dead_code: true,
                conditionals: true,
                booleans: true,
                unused: true,
                if_return: true,
                join_vars: true
            }
        }).on('error', util.log))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('public/javascripts'))
        .pipe($.size({title: 'vendor scripts'}));
});

// Concatenate & minify our JavaScript: http://davidwalsh.name/compress-uglify
gulp.task('scripts', ['lint-src'], function() {
	util.log(util.colors.bgCyan.bold('Concatenate & minify our JS'));

	return gulp.src([
		'public/javascripts/main.js'
	])
		.pipe($.plumber({
			errorHandler: onError
		}))
		.pipe($.sourcemaps.init())
		.pipe(uglify({
			preserveComments: 'some',
			mangle: true,
			compress: {
				sequences: true,
				dead_code: true,
				conditionals: true,
				booleans: true,
				unused: true,
				if_return: true,
				join_vars: true,
				drop_debugger: true,
				drop_console: true
			}
		}).on('error', util.log))
		.pipe($.sourcemaps.write('.'))
		.pipe($.rename('main.min.js'))
		.pipe(gulp.dest('public/javascripts'))
		.pipe($.size({title: 'scripts'}))
		.pipe($.notify({
			title: 'Script Police',
			message: 'JSHint & JSCS passed. Let it fly!',
			sound: 'Hero'
		}));
});

// Send a notification when JSHint or JSCS fail, so that you know your changes didn't build
function jshintNotify(file) {
	if (!file.jshint) {
		return;
	}

	return file.jshint.success ? false : {
		title: 'JSHint is not happy!',
		message: 'Check your terminal console',
		sound: 'Funk'
	};
}

function jscsNotify(file) {
	if (!file.jscs) {
		return;
	}

	return file.jscs.success ? false : {
		title: 'JSCS is not happy!',
		message: 'Check your terminal console',
		sound: 'Funk'
	};
}

// Lint our JS code
gulp.task('lint-src', function() {
	util.log(util.colors.bgCyan.bold('Linting our source code'));

	return gulp.src([
		'public/javascripts/main.js'
	])
		.pipe($.plumber({
			errorHandler: onError
		}))
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'))
		.pipe($.notify(jshintNotify))
		.pipe($.jscs())
		.pipe($.notify(jscsNotify))
		.pipe($.jshint.reporter('fail'));

});

gulp.task('development', function(cb) {
	runSequence(['vendor-styles', 'styles', 'vendor-scripts', 'scripts'], cb);
});

gulp.task('default', ['development']);
