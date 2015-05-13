var gulp = require('gulp'),
    shell = require('gulp-shell'),
    libf2cFiles = require('./libf2c-files'),
    blasFiles = require('./blas-files'),
    lapackFiles = require('./lapack-files'),
    exportFunctions = require('./export-functions');

var lapackInstallFiles = [
  'dlamch',
  'slamch'
];

var cblasWrapFiles = [
  'cblaswr',
  'fblaswr'
];

var joinNames = function (names) {
  return names
    .map(function (name) {
      return '"' + name + '"';
    })
    .join(',');
};

gulp.task('compile-libf2c', shell.task(
  libf2cFiles.map(function (name) {
    return 'emcc clapack/F2CLIBS/libf2c/' + name + '.c -Iclapack/INCLUDE -o build/' + name + '.bc';
  })
));

gulp.task('compile-blas', shell.task(
  blasFiles
    .map(function (name) {
      return 'emcc clapack/BLAS/SRC/' + name + '.c -Iclapack/INCLUDE -o build/' + name + '.bc';
    })
));

gulp.task('compile-cblas-wrap', shell.task(
  cblasWrapFiles
    .map(function (name) {
      return 'emcc clapack/BLAS/WRAP/' + name + '.c -Iclapack/INCLUDE -o build/' + name + '.bc';
    })
));

gulp.task('compile-lapack-install', shell.task(
  lapackInstallFiles
    .map(function (name) {
      return 'emcc clapack/INSTALL/' + name + '.c -Iclapack/INCLUDE -o build/' + name + '.bc';
    })
));

gulp.task('compile-lapack', shell.task(
  lapackFiles
    .map(function (name) {
      return 'emcc clapack/SRC/' + name + '.c -Iclapack/INCLUDE -o build/' + name + '.bc';
    })
));

gulp.task('link', ['compile-libf2c', 'compile-blas', 'compile-lapack', 'compile-lapack-install'], shell.task([
  "emcc build/*.bc -o linalg.js -s EXPORTED_FUNCTIONS='[" + joinNames(exportFunctions) + "]' --post-js export.js"
]));

gulp.task('build', ['link']);

gulp.task('test', shell.task('mocha --recursive --colors --reporter dot'));

gulp.task('default', ['build']);
