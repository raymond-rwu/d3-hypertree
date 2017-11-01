var gulp        = require('gulp')
var ts          = require('gulp-typescript')
var sass        = require('gulp-sass')
var concat      = require('gulp-concat')
var gutil       = require('gulp-util')
var merge       = require('merge2')
var del         = require('del');
var webpack     = require('webpack-stream')

var paths = {
    src: './src/',
    dist: './dist/'
}

// ---------------------------------------------------------------------------------------------

gulp.task('clean', () =>
    del([
        'dist/report.csv',
        'dist/**/*',               // here we use a globbing pattern to match everything inside the `mobile` folder
        '!dist/mobile/deploy.json' // we don't want to clean this file though so we negate the pattern
    ])
)

gulp.task('tsc', () => {
    var tsResult = gulp.src(paths.src + '**/*.ts')
        .pipe(ts.createProject(require('./tsconfig').compilerOptions)())

    return merge([
        tsResult.dts.pipe(gulp.dest(paths.dist + 'd/')),
        tsResult.js.pipe(gulp.dest(paths.dist + 'js/'))
    ])
})

gulp.task('webpack', ['tsc'], () =>
    gulp.src(paths.dist + 'js/index.js')
        .pipe(webpack({
            output: { filename:'index.js' },
            devtool: 'source-map'
        }))
        .pipe(gulp.dest(paths.dist)) 
)

gulp.task('sass', () =>
    gulp.src(paths.src + '**/*.scss')
        .pipe(sass())
        .pipe(concat('index-browser.css'))
        .pipe(gulp.dest(paths.dist))
)

// ---------------------------------------------------------------------------------------------

gulp.task('build',    ['webpack', 'sass'])
gulp.task('test',     ['build'])
gulp.task('data')

gulp.task('commit',   ['test'])
gulp.task('push',     ['commit'])
gulp.task('deploy')

gulp.task('default',  ['watch'])
gulp.task('watch',    ['build'], () => {    
    gulp.watch(paths.src + '**/*.ts',   ['build'])
    gulp.watch(paths.src + '**/*.scss', ['sass+bs'])
})
