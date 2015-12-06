var gulp = require('gulp'),
    concat = require('gulp-concat'),
    concatCSS = require('gulp-concat-css'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    url = require('gulp-css-url-adjuster'),
    autoprefixer = require('autoprefixer-core'),
    postcss = require('gulp-postcss'),
    flatten = require('gulp-flatten'),
    mustache = require('gulp-mustache'),
    clean = require('del'),
    params = {
        out: 'public/',
        images: 'public/images/',
        fonts: 'public/fonts/',
        css: 'public/css/',
        js: 'public/js'
    };

gulp.task('clean', function () {
    return clean(params.out);
});

gulp.task('html', function () {
    return gulp.src('html/*.html', {
        since: gulp.lastRun('html')
    })
    .pipe(mustache())
    .pipe(gulp.dest(params.out))
    .pipe(reload({ stream: true }));
});

gulp.task('favicon', function () {
    return gulp.src('html/favicon.ico', {
        since: gulp.lastRun('favicon')
    })
        .pipe(gulp.dest(params.out))
        .pipe(reload({ stream: true }));
});

gulp.task('style', function () {
    return gulp.src('blocks/style.css', {
        since: gulp.lastRun('style')
    })
    .pipe(concatCSS('style.css', {
        rebaseUrls: false
    }))
    .pipe(url({
        prepend: 'images/',
        replace: ['images/fonts/', 'fonts/']
    }))
    .pipe(postcss([autoprefixer({
        browsers: ['last 2 versions', 'ie >= 8', 'Opera >= 12', 'Safari 6']
    })]))
    .pipe(gulp.dest(params.out))
    .pipe(reload({ stream: true }));
});

gulp.task('css', function () {
    return gulp.src('css/*.css', {
        since: gulp.lastRun('css')
    })
    .pipe(gulp.dest(params.css))
    .pipe(reload({ stream: true }));
});

gulp.task('js', function () {
    return gulp.src('js/*.js', {
        since: gulp.lastRun('js')
    })
    .pipe(gulp.dest(params.js))
    .pipe(reload({ stream: true }));
});

gulp.task('fonts', function () {
    return gulp.src('fonts/**/*', {
        since: gulp.lastRun('fonts')
    })
    .pipe(gulp.dest(params.fonts))
    .pipe(reload({ stream: true }));
});

gulp.task('images', function () {
    return gulp.src('blocks/**/*.{png,jpg,jpeg,svg,gif}', {
        since: gulp.lastRun('images')
    })
    .pipe(flatten())
    .pipe(gulp.dest(params.images))
    .pipe(reload({ stream: true }));
});

gulp.task('server', function () {
    browserSync.init({
        server: params.out,
        // browser: 'chrome' // Windows
        browser: 'google-chrome' // Linux
    });
});

gulp.task('watch', function () {
    gulp.watch('html/*', gulp.parallel('html'));
    gulp.watch(['blocks/**/*', 'blocks/style.css'], gulp.parallel('style', 'images'));
    gulp.watch('css/*', gulp.parallel('css'));
    gulp.watch('js/*', gulp.parallel('js'));
    gulp.watch('fonts/*', gulp.parallel('fonts'));
});

gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('html', 'style', 'css', 'js', 'fonts', 'images'/* , 'favicon'*/)
));

gulp.task('default', gulp.series('build', gulp.parallel('server', 'watch')));
