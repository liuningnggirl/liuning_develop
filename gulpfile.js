var gulp = require('gulp');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var htmlminify = require("gulp-html-minify");
var jshint = require("gulp-jshint");
var imagemin = require("gulp-imagemin");
var template = require('gulp-template');
var watch = require('gulp-watch');
var del = require('del');
var path = require('path');

//公共配置文件
var commonConfig = require('./config/common.json');
var config = commonConfig;

//合并配置文件
var extendObject = function (o, n) {
    var newObj = new Object();
    for (var p in o) {
        newObj[p] = o[p];
    }
    for (var p in n) {
        if (isSimpleObject(n[p]) || typeof(n[p]) == 'array') {
            newObj[p] = n[p];
        } else if (typeof(n[p]) == 'object') {
            if (o.hasOwnProperty(p)) {
                newObj[p] = extendObject(o[p], n[p]);
            } else {
                newObj[p] = n[p];
            }
        }
    }
    return newObj;
};

var isSimpleObject = function (obj) {
    if (obj == 'undefined' || obj == null
        || typeof(obj) == 'number'
        || typeof(obj) == 'string'
        || typeof(obj) == 'boolean'
        || typeof(obj) == 'date'
        || typeof(obj) == 'function') {
        return true;
    }
};

var initConfig = function (configFile) {
    var jsonConfig = require('./config/' + configFile);
    config = extendObject(commonConfig, jsonConfig);

    //版本号
    config.VERSION = config.PARAM_VERSION + '.' + config.PARAM_BUILD + '.' + new Date().getTime();

    //命令行参数:打包文件输出目录
    if (gutil.env.packageDir != undefined) {
        config.dest.packageDir = gutil.env.packageDir;
    }
    //命令行参数:是否是debug模式
    if (gutil.env.isDebug != undefined) {
        config.isDebug = gutil.env.isDebug;
    }

    if (config.isDebug == true || config.isDebug == 'true') {
        config.isDebug = true;
    } else {
        config.isDebug = false;
    }
    return config;
};

gulp.task('init-local-develop', function () {
    initConfig('local-develop.json');
    return;
});
gulp.task('init-local', function () {
    initConfig('local.json');
    return;
});
gulp.task('init-remote', function () {
    initConfig('remote.json');
    return;
});

//清理各个输出目录
gulp.task('clean', function () {
    gutil.log('清理输出目录:' + config.dest.packageDir);
    return gulp.src(config.dest.packageDir, {read: false}).pipe(clean({force: true}));
});

gulp.task('clean-jsrev', function () {
    gutil.log("清理js索引文件:" + config.dest.jsRevJsonDir);
    return gulp.src(config.dest.jsRevJsonDir, {read: false}).pipe(clean({force: true}));
});

gulp.task('clean-cssrev', function () {
    gutil.log("清理css索引文件:" + config.dest.cssRevJsonDir);
    return gulp.src(config.dest.cssRevJsonDir, {read: false}).pipe(clean({force: true}));
});

gulp.task('clean-imagerev', function () {
    gutil.log("清理图片索引文件:" + config.dest.imageRevJsonDir);
    return gulp.src(config.dest.imageRevJsonDir, {read: false}).pipe(clean({force: true}));
});


//打包
function pack(done) {
    console.info('正在打包,使用配置文件:' + config.configName);
    return runSequence(
        ['clean', 'clean-cssrev', 'clean-jsrev', 'clean-imagerev'],
        ['pack-js', 'pack-css', 'pack-image'],
        ['pack-rev'],
        done);
}


//打包文件:js/css/image/html等
gulp.task('pack-js', function () {
    return packJs(config.source.jsFiles, config.dest.packageDir);
});

function packJs(sourcePackFiles, destPackDir) {
    gutil.log('打包js文件');
    gutil.log(sourcePackFiles);
    gutil.log('输出路径:' + destPackDir);
    return gulp.src(sourcePackFiles)
        .pipe(template(config))
        .pipe(jshint())//检查js
        .pipe(config.isDebug ? gutil.noop() : uglify())//压缩
        .pipe(rev())
        .pipe(gulp.dest(destPackDir))
        .pipe(rev.manifest())
        .pipe(gulp.dest(config.dest.jsRevJsonDir));
}

gulp.task('pack-css', function () {
    return packCss(config.source.cssFiles, config.dest.packageDir);
});

function packCss(sourcePackFiles, destPackDir) {
    gutil.log('打包css文件:' + sourcePackFiles);
    gutil.log('输出路径:' + destPackDir);
    return gulp.src(sourcePackFiles)
        .pipe(template(config))
        .pipe(config.isDebug ? gutil.noop() : minifyCss())
        .pipe(rev())
        .pipe(gulp.dest(destPackDir))
        .pipe(rev.manifest())
        .pipe(gulp.dest(config.dest.cssRevJsonDir));
}

gulp.task('pack-image', function () {
    return packImage(config.source.imageFiles, config.dest.packageDir);
});

function packImage(sourcePackFiles, destPackDir) {
    gutil.log('打包压缩image');
    gutil.log(sourcePackFiles);
    return gulp.src(sourcePackFiles)
        .pipe(config.isDebug ? gutil.noop() : imagemin())
        .pipe(rev())
        .pipe(gulp.dest(destPackDir))
        .pipe(rev.manifest())
        .pipe(gulp.dest(config.dest.imageRevJsonDir));
}


//打包并替换html中的路径:css/js/image
gulp.task('pack-html', function () {
    return packHtml(config.source.htmlFiles, config.dest.packageDir);
});

function packHtml(sourcePackFiles, destPackDir) {
    gutil.log('将html中的css/js/image路径替换');
    var sourceFiles = [config.dest.rootDir + '**/*.json'].concat(sourcePackFiles);
    gutil.log(sourceFiles);
    return gulp.src(sourceFiles)
        .pipe(template(config))
        .pipe(revCollector())
        .pipe(config.isDebug ? gutil.noop() : htmlminify())
        .pipe(gulp.dest(destPackDir));
}


//打包
function pack(done) {
    gutil.log('正在打包,使用配置文件:' + config.configName);
    return runSequence(
        ['clean', 'clean-cssrev', 'clean-jsrev', 'clean-imagerev'],
        ['pack-js', 'pack-css', 'pack-image'],
        ['pack-html'],
        done);
}

//打包
//默认打包本地测试文件
gulp.task('default', ['pack:local-develop']);
gulp.task('pack', ['pack:local-develop']);


//打包本地测试文件
gulp.task('pack:local-develop', ['init-local-develop'], pack);

//打包测试服务器文件
gulp.task('pack:local', ['init-local'], pack);

//打包正式服务器文件
gulp.task('pack:remote', ['init-remote'], pack);

//使用本地开发配置,监视文件变化
gulp.task('watch', ['init-local-develop'], function (done) {
    gulp.watch(config.source.jsFiles, function (event) {
        var destFile = getWatchedFileDestFile(event.path);
        var destDir = getWatchedFileDestDir(event.path) + path.sep;
        logAndClean(event, destFile);
        if (event.type == 'added' || event.type == 'changed') {
            return packJs(event.path, destDir);
        }
    });
    gulp.watch(config.source.cssFiles, function (event) {
        var destFile = getWatchedFileDestFile(event.path);
        var destDir = getWatchedFileDestDir(event.path) + path.sep;
        logAndClean(event, destFile);
        if (event.type == 'added' || event.type == 'changed') {
            return packCss(event.path, destDir);
        }
    });
    gulp.watch(config.source.imageFiles, function (event) {
        var destFile = getWatchedFileDestFile(event.path);
        var destDir = getWatchedFileDestDir(event.path) + path.sep;
        logAndClean(event, destFile);
        if (event.type == 'added' || event.type == 'changed') {
            return packImage(event.path, destDir);
        }
    });
    gulp.watch(config.source.htmlFiles, function (event) {
        var destFile = getWatchedFileDestFile(event.path);
        gutil.log(destFile);
        var destDir = getWatchedFileDestDir(event.path) + path.sep;
        logAndClean(event, destFile);
        if (event.type == 'added' || event.type == 'changed') {
            return packHtml(event.path, destDir);
        }
    });
});

function logAndClean(event, destFile) {
    if (event.type == 'added') {
        gutil.log('添加了新文件:' + event.path);
    } else if (event.type == 'changed') {
        gutil.log('修改了文件:' + event.path);
        del(destFile, {force: true});
        gutil.log('del===' + destFile);
    } else {
        gutil.log('删除了文件:' + event.path);
        del(destFile, {force: true});
    }
}

function getWatchedFileDestFile(watchedFilePath) {
    var pathArr = watchedFilePath.split(path.sep);
    var array = new Array();
    for (var i = pathArr.length; i >= 0; i--) {
        if ('h5' != pathArr[i]) {
            array.unshift(pathArr[i]);
        } else {
            break;
        }
    }
    var destFile = path.normalize(path.normalize(config.dest.packageDir) + array.join(path.sep));
    if (destFile.endsWith(path.sep)) {
        destFile = destFile.substr(0, destFile.length - 1);
    }
    return destFile;
}

function getWatchedFileDestDir(watchedFilePath) {
    var destFile = getWatchedFileDestFile(watchedFilePath);
    return destFile.substring(0, destFile.lastIndexOf(path.sep));
}






