var gulp = require('gulp'),
    shell = require('gulp-shell');

var blasUtilFunctions = [
  'dcabs1',
  'scabs1'
];

var blasL1Functions = [
  'srotg',
  'srotmg',
  'srot',
  'srotm',
  'sswap',
  'sscal',
  'scopy',
  'saxpy',
  'sdot',
  'sdsdot',
  'snrm2',
  'scnrm2',
  'sasum',
  'isamax',
  'drotg',
  'drotmg',
  'drot',
  'drotm',
  'dswap',
  'dscal',
  'dcopy',
  'daxpy',
  'ddot',
  'dsdot',
  'dnrm2',
  'dznrm2',
  'dasum',
  'idamax',
  'crotg',
  'csrot',
  'cswap',
  'cscal',
  'csscal',
  'ccopy',
  'caxpy',
  'cdotu',
  'cdotc',
  'scasum',
  'icamax',
  'zrotg',
  'zdrot',
  'zswap',
  'zscal',
  'zdscal',
  'zcopy',
  'zaxpy',
  'zdotu',
  'zdotc',
  'dzasum',
  'izamax'
];

var libf2cFunctions = [
  'cabs',
  'close',
  'c_abs',
  'd_cnjg',
  'd_imag',
  'd_sign',
  'endfile',
  'err',
  'r_cnjg',
  'r_imag',
  'r_sign',
  'sig_die',
  'z_abs',
  'z_div'
];

var exportedFunctions = function () {
  return blasL1Functions
    .map(function (name) {
      return '"_' + name + '_"';
    })
    .join(',');
};

gulp.task('precompile-libf2c', shell.task(
  'cp libf2c/signal1.h0 libf2c/signal1.h',
  'cp libf2c/sysdep1.h0 libf2c/sysdep1.h'
));

gulp.task('compile-libf2c', ['precompile-libf2c'], shell.task(
  libf2cFunctions.map(function (name) {
    return 'emcc libf2c/' + name + '.c -I. -o libf2c/' + name + '.bc';
  })
));

gulp.task('f2c-util', shell.task(
  blasUtilFunctions
    .map(function (name) {
      return 'f2c -dblas blas/' + name + '.f';
    })
));

gulp.task('compile-util', ['f2c-util'], shell.task(
  blasUtilFunctions
    .map(function (name) {
      return 'emcc blas/' + name + '.c -I. -o blas/' + name + '.bc';
    })
));

gulp.task('f2c-l1', shell.task(
  blasL1Functions
    .map(function (name) {
      return 'f2c -dblas blas/' + name + '.f';
    })
));

gulp.task('compile-l1', ['f2c-l1'], shell.task(
  blasL1Functions
    .map(function (name) {
      return 'emcc blas/' + name + '.c -I. -o blas/' + name + '.bc';
    })
));

gulp.task('link', ['compile-libf2c', 'compile-util', 'compile-l1'], shell.task([
  "emcc libf2c/*.bc blas/*.bc -o linalg.js -s EXPORTED_FUNCTIONS='[" + exportedFunctions() + "]' --post-js export.js"
]));

gulp.task('build', ['link']);

gulp.task('default', ['build']);
