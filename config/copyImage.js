import gulp from 'gulp';
import { path } from './path.js';

export default function copyImages() {
  return gulp.src(path.source.images)
    .pipe(gulp.dest(path.build.images));
};