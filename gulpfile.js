import gulp from 'gulp';
import compileSass from './config/compileScss.js';
import compilePug from './config/compilePug.js';
import watch from './config/watch.js';

gulp.task('default', gulp.series(compileSass, compilePug, watch));