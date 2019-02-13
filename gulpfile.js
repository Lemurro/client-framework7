var gulp     = require('gulp');           // Сам Gulp JS
var cleanCSS = require('gulp-clean-css'); // Минификация CSS
var concat   = require('gulp-concat');    // Склейка файлов
var replace  = require('gulp-replace');   // Замена внутри файлов
var uglify   = require('gulp-uglify');    // Минификация JS

var pathCore = [
    'node_modules/lemurro-client-framework7-core-frontend/dist/core.min.css',
    'node_modules/lemurro-client-framework7-core-frontend/dist/core.min.js'
];

var pathLibs = [
    'node_modules/framework7/css/framework7.min.css',
    'node_modules/framework7/js/framework7.min.js',
    'node_modules/inputmask/dist/min/inputmask/dependencyLibs/inputmask.dependencyLib.min.js',
    'node_modules/inputmask/dist/min/inputmask/inputmask.min.js',
    'node_modules/jsdeferred/jsdeferred.nodoc.js',
    'node_modules/localforage/dist/localforage.min.js',
    'node_modules/sweetalert2/dist/sweetalert2.min.css',
    'node_modules/sweetalert2/dist/sweetalert2.min.js'
];

// WATCHER

function watcherCSS() {
    return gulp.watch('src/css/*.css', appCSS);
}

function watcherJS() {
    return gulp.watch('src/js/**/*.js', appJS);
}

// APP

function appCSS() {
    return gulp.src('src/css/*.css')
        .pipe(concat('app.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('build/assets'));
}

function appJS() {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/assets'));
}

function core() {
    return gulp.src(pathCore)
        .pipe(gulp.dest('build/assets'));
}

function libs() {
    return gulp.src(pathLibs)
        .pipe(gulp.dest('build/assets/plugins'));
}

function fontawesomeCSS() {
    return gulp.src('node_modules/@fortawesome/fontawesome-free/css/all.min.css')
        .pipe(gulp.dest('build/assets/fonts/fontawesome-free/css'));
}

function fontawesomeWebfonts() {
    return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(gulp.dest('build/assets/fonts/fontawesome-free/webfonts'));
}

function assets() {
    return gulp.src('src/assets/**/*')
        .pipe(gulp.dest('build/assets'));
}

function pages() {
    return gulp.src('src/pages/*')
        .pipe(gulp.dest('build/pages'));
}

function indexHTMLDev() {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('build'));
}

function indexHTMLProd() {
    return gulp.src('src/index.html')
        .pipe(replace('<!-- cordova.js here -->', '<script type="text/javascript" src="cordova.js"></script>'))
        .pipe(replace("var pathServerAPI = 'http://lemurro-api.localhost/';", "var pathServerAPI = 'http://your.api.domain.tld/';"))
        .pipe(replace('var modeCordova   = false;', 'var modeCordova   = true;'))
        .pipe(gulp.dest('build'));
}

// VARS

var fontawesome = gulp.parallel(fontawesomeCSS, fontawesomeWebfonts);

// TASKS

gulp.task('build', gulp.parallel(core, libs, fontawesome, assets, appCSS, appJS, pages, indexHTMLProd));

gulp.task('watcher', gulp.series(
    gulp.parallel(core, libs, fontawesome, assets, appCSS, appJS, pages, indexHTMLDev),
    gulp.parallel(watcherCSS, watcherJS)
));