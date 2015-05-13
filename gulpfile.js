var gulp = require('gulp'),
    shell = require('gulp-shell');

var blasUtilFunctions = [
  'dcabs1',
  'lsame',
  'scabs1',
  'xerbla'
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

var blasL2Functions = [
  'sgemv',
  'sgbmv',
  'ssymv',
  'ssbmv',
  'sspmv',
  'strmv',
  'stbmv',
  'stpmv',
  'strsv',
  'stbsv',
  'stpsv',
  'sger',
  'ssyr',
  'sspr',
  'ssyr2',
  'sspr2',
  'dgemv',
  'dgbmv',
  'dsymv',
  'dsbmv',
  'dspmv',
  'dtrmv',
  'dtbmv',
  'dtpmv',
  'dtrsv',
  'dtbsv',
  'dtpsv',
  'dger',
  'dsyr',
  'dspr',
  'dsyr2',
  'dspr2',
  'cgemv',
  'cgbmv',
  'chemv',
  'chbmv',
  'chpmv',
  'ctrmv',
  'ctbmv',
  'ctpmv',
  'ctrsv',
  'ctbsv',
  'ctpsv',
  'cgeru',
  'cgerc',
  'cher',
  'chpr',
  'cher2',
  'chpr2',
  'zgemv',
  'zgbmv',
  'zhemv',
  'zhbmv',
  'zhpmv',
  'ztrmv',
  'ztbmv',
  'ztpmv',
  'ztrsv',
  'ztbsv',
  'ztpsv',
  'zgeru',
  'zgerc',
  'zher',
  'zhpr',
  'zher2',
  'zhpr2'
];

var blasL3Functions = [
  'sgemm',
  'ssymm',
  'ssyrk',
  'ssyr2k',
  'strmm',
  'strsm',
  'dgemm',
  'dsymm',
  'dsyrk',
  'dsyr2k',
  'dtrmm',
  'dtrsm',
  'cgemm',
  'csymm',
  'chemm',
  'csyrk',
  'cherk',
  'csyr2k',
  'cher2k',
  'ctrmm',
  'ctrsm',
  'zgemm',
  'zsymm',
  'zhemm',
  'zsyrk',
  'zherk',
  'zsyr2k',
  'zher2k',
  'ztrmm',
  'ztrsm'
];

var libf2cFunctions = [
  'cabs',
  'close',
  'c_abs',
  'c_div',
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
  return [].concat(blasL1Functions, blasL2Functions, blasL3Functions)
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

gulp.task('f2c-l2', shell.task(
  blasL2Functions
    .map(function (name) {
      return 'f2c -dblas blas/' + name + '.f';
    })
));

gulp.task('compile-l2', ['f2c-l2'], shell.task(
  blasL2Functions
    .map(function (name) {
      return 'emcc blas/' + name + '.c -I. -o blas/' + name + '.bc';
    })
));

gulp.task('f2c-l3', shell.task(
  blasL3Functions
    .map(function (name) {
      return 'f2c -dblas blas/' + name + '.f';
    })
));

gulp.task('compile-l3', ['f2c-l3'], shell.task(
  blasL3Functions
    .map(function (name) {
      return 'emcc blas/' + name + '.c -I. -o blas/' + name + '.bc';
    })
));

gulp.task('link', ['compile-libf2c', 'compile-util', 'compile-l1', 'compile-l2', 'compile-l3'], shell.task([
  "emcc libf2c/*.bc blas/*.bc -o linalg.js -s EXPORTED_FUNCTIONS='[" + exportedFunctions() + "]' --post-js export.js"
]));

gulp.task('build', ['link']);

gulp.task('test', shell.task('mocha --recursive --colors --reporter dot'));

gulp.task('default', ['build']);
