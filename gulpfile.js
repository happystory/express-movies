var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var mocha = require('gulp-mocha');

// 路径配置
var paths = {
    client: [
        'views/pages/*.jade',
    ],
    server: [
        'schemas/*.js',
        'models/*.js',
        'app.js',
    ],
    index: 'app.js'
};

// nodemon配置，启动或重启服务
// https://www.npmjs.com/package/gulp-nodemon
gulp.task('serve', ['livereload'], function() {
    return nodemon({
        script: paths.index,
        ext: 'js',
        ignore: ['node_modules/'],
        watch: paths.server,
        env: {
            'NODE_ENV': 'development'
        }
    });
});

// 当客户端被监听的文件改变时，刷新浏览器
// https://www.npmjs.com/package/gulp-livereload
gulp.task('livereload', function() {
    livereload.listen();
    gulp.watch(paths.client, function(file) {
        livereload.changed(file.path);
    });
});

// default 任务，同时开启serve、livereload任务
gulp.task('default', ['serve', 'livereload']);

gulp.task('mochaTest', function() {
    gulp.src('test/**/*.js')
        .pipe(mocha({reporter: 'spec'}));
});

// test 任务
gulp.task('test', ['mochaTest']);

