var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    gulpif = require('gulp-if'),
    order = require('gulp-order'),
    gutil = require('gulp-util'),
    foreach = require('gulp-foreach'),
    debug = require('gulp-debug'),
    path =require('path'),
    del = require('del');

gulp.task('default', ['clean'], function() {
    gulp.start('fonts', 'styles');
});

gulp.task('clean', function(cb) {
    del(['assets/css', 'assets/js', 'assets/less', 'assets/img', 'assets/fonts'], cb)
});

gulp.task('fonts', function() {
    
    var fileList = [
        'bower_components/bootstrap/dist/fonts/*', 
        'bower_components/fontawesome/fonts/*'
    ];
    
    return gulp.src(fileList)
        .pipe(gulp.dest('assets/fonts'));
});

gulp.task('styles', function() {
    
    var baseContent = '@import "bower_components/bootstrap/less/bootstrap.less";@import "bower_components/bootswatch/$theme$/variables.less";@import "bower_components/bootswatch/$theme$/bootswatch.less";@import "bower_components/bootstrap/less/utilities.less";';
    
    return gulp.src('bower_components/bootswatch/**/bootswatch.less')
        .pipe(foreach(function(stream, file) {
            var themeName = path.basename(path.dirname(file.path)),
                content = replaceAll(baseContent, '$theme$', themeName),
                file = string_src('bootstrap-' +  themeName + '.less', content);
            
            return file;
        }))
        .pipe(less())
        .pipe(gulp.dest('assets/css'));
});

// http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function string_src(filename, string) {
  var src = require('stream').Readable({ objectMode: true })
  src._read = function () {
    this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(string) }))
    this.push(null)
  }
  return src
}