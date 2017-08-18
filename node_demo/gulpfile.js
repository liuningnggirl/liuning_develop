//导入工具包 require('node_modules里对应模块')
//npm install xxx --save-dev:自动把模块和版本号添加到(devdependencies)依赖部分;
/*
	.gulp.task(name,fn) -定义任务，第一个参数是人物名，第二个参数是任务内容
	.gulp.src(path) -选择文件，传入参数是文件路径
	.gulp.dest(path) -输出文件
	.gulp.pipe() -管道，可以暂时将pipe 理解为将操作加入执行队列
*/

//获取组件,导入需要工具包
var gulp = require('gulp'),//本地安装gulp所用到的地方
    uglify = require('gulp-uglify'),//获取 uglify 模块（用于压缩 js)
    gutil = require('gulp-util'),//类似于console.log
    minifyCSS = require('gulp-minify-css'),//获取 minify-css 模块（用于压缩CSS）
    imagemin = require('gulp-imagemin'),//获取 imagemin 模块（用于压缩image PNG, JPEG, GIF和SVG图片)
    concat = require('gulp-concat'),//合并多个文件为一个文件
    rename = require('gulp-rename'),//重命名文件
    smushit = require('gulp-smushit'),//压缩图片，是一个yahoo开发的一款用来优化png,jpg的插件，无损压缩  缺点：压缩用时较长
    rev = require('gulp-rev'),//- 对文件名加MD5后缀
    revCollector = require('gulp-rev-collector'),//- 路径替换
    htmlmin = require('gulp-htmlmin') //压缩html
    //fontSpider=require('gulp-font-spider');//压缩字体  --安装插件的时候npm要低于5.0版本，否则装不上

gulp.task('readjson', function () {
    initConfig('local.json');
    return;
});


var initConfig = function (configFile) {
    gutil.log(configFile+'000000000000000000');
}


//创建压缩任务
//压缩html文件
gulp.task('html',function(){
    gutil.log('压缩html文件...');
    var options = {
        //removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        //collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        //removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        //removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        //removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('src/html/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/html'));
})


//压缩js文件
//载命令行使用 gulp js 启动此任务
gulp.task('js',function(){
    gutil.log('压缩js文件...');
    //1\.找到文件
    gulp.src('src/js/*.js')
    //2\.压缩文件
        .pipe(uglify())
        //3\.另存压缩后的文件
        .pipe(gulp.dest('dist/js'))
})

//压缩css文件
//在命令行中使用 gulp css 启动此任务
gulp.task('css',function(){
    gutil.log('压缩css文件...');
    //1\.找到文件
    gulp.src('src/css/*.css')
    //2\.压缩文件
        .pipe(minifyCSS())
        //3\.另存为压缩文件  --输出文件
        .pipe(gulp.dest('dist/css'))
})

//压缩image文件
//在命令行中使用 gulp images 启动此任务
gulp.task('images',function(){
    gutil.log('压缩images文件...');
    //1\.找到图片
    gulp.src(['src/images/*','src/images/media/*'])
    //2\.压缩图片
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
            //use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        //3\.另存为压图片路径
        .pipe(gulp.dest('dist/images'))
})

//无损压缩图片
//在命令行中使用 gulp smushit 启动此任务
gulp.task('smushit',function(){
    gutil.log('无损压缩images文件...');
    gulp.src('src/images/*/*.*')
        .pipe(smushit({
            verbose: true
        }))
        .pipe(smushit({
            verbose:true
        }))
        .pipe(gulp.dest('dist/images'))
})


//合并文件
//将多个文件合并成一个文件，在命令行中使用 gulp concat 启动此任务
//合并js文件
gulp.task("concatjs",function(){
    gutil.log(gutil.colors.red('把1.js和2.js合并为main.js，输出到dest/js目录下'))
    // 把1.js和2.js合并为main.js，输出到dest/js目录下
    gulp.src(['src/js/01.js','src/js/02.js'])
        .pipe(concat('main.js'))//合并文件到main.js
        .pipe(uglify())//压缩合并后的文件
        .pipe(rename('main.min.js'))//重命名输出文件
        .pipe(gulp.dest('dist/js'));//将合并的文件放到dist/js目录下
})

//合并css文件   文件名加MD5后缀
gulp.task("concatcss",function(){
    gulp.src(['src/css/01.css','src/css/02.css'])
        .pipe(concat('main.css'))
        .pipe(minifyCSS())
        .pipe(rev()) //- 文件名加MD5后缀
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest())//- 生成一个rev-manifest.json
        .pipe(gulp.dest('dist/revcss'));//- 将 rev-manifest.json 保存到 rev 目录内
})


//监听文件修改，当文件被修改则执行 js 任务名称
//但是乜有命令可以运行 gulp.watch() ,需要将 gulp.watch() 包含在一个任务中
//在命令行使用 gulp watch 启动此任务
gulp.task('watch', function () {
    //监听文件修改，当文件被修改则执行 js 任务
    gulp.watch('src/js/*.js', ['js']);//监听js文件
    gulp.watch('src/css/*.css', ['css']);//监听css文件
    gulp.watch('src/images/*.*)', ['images'])//监听images文件
})

//使用 gulp.task('default')定义默认任务
//在命令行使用 gulp 启动 js 任务和 watch 任务 
gulp.task('default',['js','css','images']);
