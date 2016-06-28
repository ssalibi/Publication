var gulp = require('gulp'),
  connect = require('gulp-connect'),
  proxy = require('http-proxy-middleware'),
  minimist = require('minimist');

var defaultOptions = {
  default: {
    serverUrl: 'http://127.0.0.1:8081',
    port: 8000,
    livereloadPort: 35729,
    paths: [
      'app/**',
      'index.html'
    ]
  }
};

var config = minimist(process.argv.slice(2), defaultOptions);

gulp.task('watch', function() {
  gulp.watch(config.paths, ['reload']);
});

gulp.task('reload', function() {
  gulp.src(config.paths).pipe(connect.reload());
});

gulp.task('connect', function() {
  connect.server({
    root: ['.'],
    port: config.port,
    livereload: {
      port: config.livereloadPort
    },
    middleware: function(conn, opt) {
      return [
        proxy('/rest', {
          target: config.serverUrl,
          changeOrigin: false,
          ws: true
        })
      ];
    }
  });
});

gulp.task('serve', ['connect', 'watch']);

gulp.task('default', ['serve']);