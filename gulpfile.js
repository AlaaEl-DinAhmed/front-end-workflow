const gulp = require('gulp')
const livereload = require('gulp-livereload');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer');
const dir = require('postcss-dir-pseudo-class');
const postcssDirPseudoClass = require('postcss-logical');
const nested = require('postcss-nested');
const combineSelectors = require('postcss-combine-duplicated-selectors');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();


/*
PostCSS plugins used
*/
const plugins = [
    autoprefixer({
        browsers: ['last 5 versions']
    }),
    postcssDirPseudoClass(),
    dir(),
    nested(),
    combineSelectors(),
    cssnano()
]

gulp.task('browserSync', () => {
    browserSync.init({
        server: {
            baseDir: 'build',
            index: 'index.html'
        }
    });
});


// HTML
gulp.task('html', () => {
    gulp.src('src/*.html')
        .pipe(gulp.dest('build/'))
        .pipe(livereload());
})

// CSS
gulp.task('styles', () => {
    gulp.src('src/styles/*.scss')
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(postcss(plugins))
        .pipe(gulp.dest('build/styles/'))
        .pipe(livereload());
})

// JavaScript
gulp.task('js', () => {
    return gulp.src('src/scripts/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('build/scripts/'))
});
// Watch
gulp.task('watch', ['html', 'styles', 'js' , 'browserSync'], () => {
    livereload.listen();
    gulp.watch('src/*.html', ['html', browserSync.reload])
    gulp.watch('src/styles/*.scss', ['styles', browserSync.reload])
    gulp.watch('src/scripts/*.js', ['js', browserSync.reload])

})

/*
Default task to run gulpfile
Just run gulp in your command line
*/
gulp.task('default', ['html', 'styles', 'js', 'watch']);