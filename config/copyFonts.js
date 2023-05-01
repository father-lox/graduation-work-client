import gulp from 'gulp';
import { path } from './path.js';

export default function copyImages() {
  return gulp.src(path.source.fonts)
    .pipe(gulp.dest(path.build.fonts));
};