var gulp     = require('gulp');            // Сам Gulp JS
var cleanCSS = require('gulp-clean-css');  // Минификация CSS
var concat   = require('gulp-concat');     // Склейка файлов
var includer = require('gulp-x-includer'); // Склейка html файлов
var replace  = require('gulp-replace');    // Замена внутри файлов
var uglify   = require('gulp-uglify');     // Минификация JS

var pathsPlugins = [];

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

function pages() {
    return gulp.src('src/html/pages/*')
        .pipe(includer())
        .pipe(gulp.dest('build/pages'));
}

function indexHTMLDev() {
    return gulp.src('src/html/index.html')
        .pipe(includer())
        .pipe(gulp.dest('build'));
}

function indexHTMLProd() {
    return gulp.src('src/html/index.html')
        .pipe(includer())
        .pipe(replace('<!-- cordova.js here -->', '<script type="text/javascript" src="cordova.js"></script>'))
        .pipe(replace("var pathServerAPI = 'http://lemurro-api.localhost/';", "var pathServerAPI = 'http://your.api.domain.tld/';"))
        .pipe(replace('var modeCordova   = false;', 'var modeCordova   = true;'))
        .pipe(gulp.dest('build'));
}

// TASKS

gulp.task('build', gulp.parallel(lemurro, assets, plugins, appCSS, appJS, pages, indexHTMLProd));

gulp.task('watcher', gulp.series(
    gulp.parallel(lemurro, assets, plugins, appCSS, appJS, pages, indexHTMLDev),
    gulp.parallel(watcherCSS, watcherJS)
));