import gulp from 'gulp';
import { path } from './path.js';
import compileSass from './compileScss.js';
import compilePug from './compilePug.js';

export default function watching() {
    gulp.watch(path.watch.styles, compileSass);
    gulp.watch(path.watch.templates, compilePug);
}