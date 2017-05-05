# nggirl-webh5

管理后台项目的h5页面，即nggirl-web项目根目录下的全部文件

使用说明

1，[安装node](http://www.runoob.com/nodejs/nodejs-install-setup.html)

2，[安装npm](http://www.runoob.com/nodejs/nodejs-npm.html)

3，切换到项目根目录

4，安装gulp和项目所需插件

```shell
npm install
```

5，更改gulp-rev和gulp-rev-collector

> 打开node_modules\gulp-rev\index.js

> 第144行 manifest[originalFile] = revisionedFile;

> 更新为: manifest[originalFile] = originalFile + '?v=' + file.revHash;

> 打开nodemodules\gulp-rev\nodemodules\rev-path\index.js

> 10行 return filename + '-' + hash + ext;

> 更新为: return filename + ext;

> 打开node_modules\gulp-rev-collector\index.js

> 31行if ( !_.isString(json[key]) || path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' ) !==  path.basename(key) ) {

> 更新为: if ( !_.isString(json[key]) || path.basename(json[key]).split('?')[0] !== path.basename(key) ) {


6，使用gulp编译打包

1) 本地测试包,执行命令:

```shell
gulp pack:local-develop
```
或者

```shell
gulp pack
```
或者

```shell
gulp
```

2) 远程(测试服务器)测试包,执行命令:

```shell
gulp pack:local
```

3) 正式服务器打包,执行命令:

```shell
gulp pack:remote
```

这三个命令会分别读取不同的配置文件:local-develop.json/local.json/remote.json

7，本地开发时，监视本地文件修改

开发过程中gulp会监视用户修改的内容，将源文件实时编译到指定的输出目录。

直接执行命令：

```shell
gulp watch
```
