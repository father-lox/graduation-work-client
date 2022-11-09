import gulp from 'gulp';
import pug from 'gulp-pug';
import { path } from './path.js';

export default function compilePug() {
  return gulp.src(path.source.templates)
    .pipe(pug({}))
    .pipe(gulp.dest(path.build.templates));
};