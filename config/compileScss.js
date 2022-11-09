import { path } from './path.js';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import gulp from 'gulp';

export default function compileSass() {
    const sass = gulpSass(dartSass);

    return gulp.src(path.source.styles, {sourcemaps: true})
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(gulp.dest(path.build.styles));
}