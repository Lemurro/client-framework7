var gulp     = require('gulp');            // Сам Gulp JS
var cleanCSS = require('gulp-clean-css');  // Минификация CSS
var concat   = require('gulp-concat');     // Склейка файлов
var rename   = require('gulp-rename');     // Переименование файлов
var replace  = require('gulp-replace');    // Замена внутри файлов
var sort     = require('gulp-sort');       // Сортировка списка файлов
var uglify   = require('gulp-uglify');     // Минификация JS
var includer = require('gulp-x-includer'); // Склейка html файлов
var del      = require('del');             // Удаление файлов

var pathsPlugins = [];

// CLEAN

function clean() {
    return del('build/**', {force: true});
}

// WATCHER

function watcherCSS() {
    return gulp.watch('src/css/*.css', appCSS);
}

function watcherJS() {
    return gulp.watch('src/js/**/*.js', appJS);
}

// APP

function assets() {
    return gulp.src('src/assets/**/*')
        .pipe(gulp.dest('build/assets'));
}

function plugins(done) {
    if (pathsPlugins.length > 0) {
        return gulp.src(pathsPlugins)
            .pipe(gulp.dest('build/assets/plugins'));
    } else {
        done();
    }
}

function lemurro() {
    var files = [
        'node_modules/lemurro-client-framework7-core-frontend/dist/lemurro.min.css',
        'node_modules/lemurro-client-framework7-core-frontend/dist/lemurro.min.js'
    ];

    return gulp.src(files)
        .pipe(gulp.dest('build/assets'));
}

function appCSS() {
    return gulp.src('src/css/*.css')
        .pipe(sort())
        .pipe(concat('app.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('build/assets'));
}

function appJS() {
    return gulp.src('src/js/**/*.js')
        .pipe(sort())
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/assets'));
}

function pages() {
    return gulp.src('src/html/pages/*')
        .pipe(includer())
        .pipe(gulp.dest('build/pages'));
}

function indexHTMLProd() {
    return gulp.src('src/html/index.html')
        .pipe(includer())
        .pipe(replace('<!-- cordova.js here -->', '<script type="text/javascript" src="cordova.js"></script>'))
        .pipe(gulp.dest('build'));
}

function indexHTMLDev() {
    return gulp.src('src/html/index.html')
        .pipe(includer())
        .pipe(gulp.dest('build'));
}

function envProd() {
    return gulp.src('src/env/env.js')
        .pipe(gulp.dest('build/assets'));
}

function envDev() {
    return gulp.src('src/env/env-dev.js')
        .pipe(rename('env.js'))
        .pipe(gulp.dest('build/assets'));
}

// FONTAWESOME

function fontawesomeCSS() {
    return gulp.src('node_modules/@fortawesome/fontawesome-free/css/all.min.css')
        .pipe(gulp.dest('build/assets/fonts/fontawesome-free/css'));
}

function fontawesomeWebfonts() {
    return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(gulp.dest('build/assets/fonts/fontawesome-free/webfonts'));
}

// VARS

var all = gulp.series(
    clean,
    gulp.parallel(lemurro, assets, plugins, fontawesomeCSS, fontawesomeWebfonts, appCSS, appJS, pages)
);

// TASKS

gulp.task('build', gulp.series(all, gulp.parallel(indexHTMLProd, envProd)));

gulp.task('build-dev', gulp.series(all, gulp.parallel(indexHTMLDev, envDev)));

gulp.task('watcher', gulp.series(
    'build-dev',
    gulp.parallel(watcherCSS, watcherJS)
));