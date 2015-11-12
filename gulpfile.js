var gulp = require('gulp'),
    concat = require('gulp-concat'),
    concatCSS = require('gulp-concat-css');
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    url = require('gulp-css-url-adjuster'),
    autoprefixer = require('autoprefixer-core'),
    postcss = require('gulp-postcss'),
    flatten = require('gulp-flatten'),
    mustache = require('gulp-mustache');

var params = {
    out: 'public/',
    images: 'public/images/',
    fonts: 'public/fonts/',
    css: 'public/css/',
    js: 'public/js'
};

gulp.task('default', ['server', 'build']);

gulp.task('build', ['html', 'style', 'css', 'js', 'fonts', 'images', 'favicon']);

gulp.task('server', function() {
    browserSync.init({
        server: params.out,
        //browser: 'chrome' // Windows
        browser: 'google-chrome' // Linux
    });

    gulp.watch('html/*', ['html']);

    gulp.watch(['blocks/**/', 'blocks/**/*', 'blocks/style.css'], ['style', 'images']);

    gulp.watch('css/*', ['css']);

    gulp.watch('js/*', ['js']);
    
    gulp.watch('fonts/*', ['fonts']);

});

gulp.task('html', function() {
    return gulp.src('html/*.html')
    .pipe(mustache())
    .pipe(gulp.dest(params.out))
    .pipe(reload({ stream: true }));
});

gulp.task('favicon', function() {
    return gulp.src('html/favicon.ico')
        .pipe(gulp.dest(params.out))
        .pipe(reload({ stream: true }));
});

gulp.task('style', function() {
    return gulp.src('blocks/style.css')
    .pipe(concatCSS('style.css', {
        rebaseUrls: false
    }))
    .pipe(url({
        prepend: 'images/',
        replace: ['images/fonts/', 'fonts/']
    }))
    .pipe(postcss([ autoprefixer({
    	browsers: ['last 2 versions', 'ie >= 8', 'Opera >= 12', 'Safari 6']
    }) ]))
    .pipe(gulp.dest(params.out))
    .pipe(reload({ stream: true }));
});

gulp.task('css', function() {
    return gulp.src('css/*.css')
    .pipe(gulp.dest(params.css))
    .pipe(reload({ stream: true }));
});

gulp.task('js', function() {
    return gulp.src('js/*.js')
    .pipe(gulp.dest(params.js))
    .pipe(reload({ stream: true }));
});

gulp.task('fonts', function() {
    return gulp.src('fonts/**/')
    .pipe(gulp.dest(params.fonts))
    .pipe(reload({ stream: true }));
});

gulp.task('images', function() {
    return gulp.src('blocks/**/*.{png,jpg,jpeg,svg,gif}')
    .pipe(flatten())
    .pipe(gulp.dest(params.images))
    .pipe(reload({ stream: true }));
});
