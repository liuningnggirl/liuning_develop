
//获取最终的请求参数
function getFinalRequestObject(appParams) {
    //系统参数
    var finalParams = new Object();
    finalParams.app_id = 'h5gzh';
    finalParams.nonce = Math.ceil(Math.random() * 1000000);
    finalParams.timestamp = Date.parse(new Date());
    finalParams.version = '<%= PARAM_VERSION %>';
    finalParams.build = '<%= PARAM_BUILD %>';
    finalParams.udid= 'h5';
    finalParams.devicemodel=getDeviceModel();
    finalParams.sysname=getSysName();
    finalParams.sysversion=getSysVersion();

    //放入应用参数
    if (appParams != null && appParams != undefined) {
        //自动添加一个请求参数accessToken
        if(strIsEmpty(appParams.accessToken)){
            appParams.accessToken = getAccessToken();
        }
        for (var prop in appParams) {
            //只保留不为空的参数
            if (appParams[prop] != null && appParams[prop] != undefined
                && $.trim(appParams[prop]).length != 0) {
                finalParams[prop] = appParams[prop];
            }
        }

    }
    //生成sign
    finalParams.sign = getSign(finalParams);
    return finalParams;
}

var ua = navigator.userAgent.toLowerCase();	
//获取设备类别
function getDeviceModel(){
    if(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream){
        return "iphone";
    }else{
        return "android"
    }
}
function getSysName(){
    if(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream){
        return "ios";
    }else{
        return "android"
    }
}

function getSysVersion(){
    return "";
}
//根据请求数据中的系统参数和应用参数，生成sign
function getSign(requestObject) {
    var appsecret = '123456';
    var signArray = new Array();
    for (var prop in requestObject) {
        signArray.push(prop + '');
        //signArray.push(prop + '=' + requestObject[prop]);
    }
    var originstr = getSignKeyValueStr(requestObject, signArray, appsecret);
    return md5(originstr);
}

//生成key=value类型字符串
function getSignKeyValueStr(requestObject, signArray, appsecret) {
    var resultArray = quickSort(signArray);
    var str = '';
    for (var i = 0; i < resultArray.length; i++) {
        str += (resultArray[i] + '=' + requestObject[resultArray[i]]);
        str += '&';
    }
    return str + appsecret;
}

//对请求参数进行快速排序
function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    var pivotIndex = Math.floor(arr.length / 2);
    var pivot = arr.splice(pivotIndex, 1)[0];
    var left = [];
    var right = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return quickSort(left).concat([pivot], quickSort(right));
}


// 从地址栏中获取参数
function getParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return decodeURI(r[2]);
    return '';
}

//从地址栏中获取参数(因为2.2之前的ios跳转到webview获取的url地址没有组装上=后的参数，所以导致页面获取不到参数，这里把reg中的=换成了%3d)
function getParamHack(name) {
    var reg = new RegExp("(^|&)" + name + "_3d([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
    	var val = decodeURI(r[2]);
    //微信分享后会给这里添加等号
    	if(val.indexOf('=') == (val.length-1)){
    		val = val.substring(0,val.length-1);
    	}
        return val;
    return '';
}

// 判断字符串是否为空
function strIsEmpty(str) {
    if (str == undefined || str == null || $.trim(str).length == 0) {
        return true;
    }
    return false;
}

//从userAgent中获取app版本
function getAppVersion(){
    var reg = new RegExp("\\[-ngversion=(\\d+\\.\\d+)-\\]");
    var res = navigator.userAgent.match(reg);
    
    if(res == null){
    	return "1.00";
    }
    var versionArray = res[1].split(".");
    if(versionArray[1].length == 1){
        versionArray[1] = "0"+versionArray[1];
    }
    var version = versionArray[0]+"."+versionArray[1];

    return version;
}

// 从地址栏和本地存储中获取accessToken，地址栏参数优先
function getAccessToken() {
    var accessToken = '';
    //在app内，且app内实现了window.ngjsInterface.getToken方法，那么从app主动获取token
    if(isInApp() && typeof(window.ngjsInterface) != "undefined" && typeof(window.ngjsInterface.getToken) != "undefined"){
    	accessToken = window.ngjsInterface.getToken();
    }else{
    	var appAccessToken = localStorage.accessToken;
        var queryAccessToken = getParam("accessToken");
        if (!strIsEmpty(appAccessToken) || !strIsEmpty(queryAccessToken)) {
            accessToken = !strIsEmpty(queryAccessToken) ? queryAccessToken : appAccessToken;
        }
    }
    

    // localStorage中始终存储最新的accessToken
    setAccessToken(accessToken);
    return accessToken;
}

//设置accessToken
function setAccessToken(accessToken){
    localStorage.accessToken = accessToken;
}


// 验证手机号是否正确
function isPhoneNum(phoneNum) {
    var reg = /^1(([3|8|7|5][0-9])|(5[^4|\D]))\d{8}$/;
    return reg.test(phoneNum);
}

//当前页面是否在微信内
function isInWeixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

//微信浏览器版本是否小于5.0
function isWeixinLessThan5() {
    var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
    return wechatInfo[1] < "5.0";
}

//回退到上一个页面
function goBack() {
    if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)) { // IE
        if (history.length > 0) {
            window.history.go(-1);
        }
    } else { //非IE浏览器
        if (navigator.userAgent.indexOf('Firefox') >= 0 ||
            navigator.userAgent.indexOf('Opera') >= 0 ||
            navigator.userAgent.indexOf('Safari') >= 0 ||
            navigator.userAgent.indexOf('Chrome') >= 0 ||
            navigator.userAgent.indexOf('WebKit') >= 0) {

            if (window.history.length > 1) {
                window.history.go(-1);
            }
            ;
        } else { //未知的浏览器
            window.history.go(-1);
        }
    }
}

//1,如果accessToken无效,则执行errorfun函数
//2,如果accessToken有效,则执行successfun函数
function checkAccessToken(successfun,errorfun){
    if(strIsEmpty(getAccessToken())){
        if(typeof(errorfun) == 'function'){
            errorfun();
        }
        else{
            location.href = '<%= CLI_HOST_API_URL %>/nggirl/h5/cosmetic/login_new.html?v=<%= VERSION %>'
        }
    };

    var data = getFinalRequestObject({
        accessToken : getAccessToken()
    });

    $.ajax({
        type : 'GET',
        url : '<%= CLI_HOST_API_URL %>/nggirl/app/cli/checkAccessToken',
        data : data,
        dataType:'json',
        success : function(result) {
            //授权令牌无效
            if (result.code !=  0) {
                if(typeof(errorfun) == 'function'){
                    errorfun();
                }
                else{
                    location.href = '<%= CLI_HOST_API_URL %>/nggirl/h5/cosmetic/login_new.html?v=<%= VERSION %>'
                }
            }
            //授权令牌有效
            else {
                if(typeof(successfun) == 'function'){
                    successfun();
                }else{
                    //goBack();
                }
            }
        }
    });
}


//1,如果accessToken无效,则进入登录页面
//1.1,登录成功后跳转到redirectUrlAfterLogin页面
//1.2,如果没有设置redirectUrlAfterLogin,则会退到上一个页面
//2,如果accessToken有效,则执行successfun函数
function checkAccessTokenLogin(successfun,redirectUrlAfterLogin){

    if(strIsEmpty(getAccessToken())){
        if(!strIsEmpty(redirectUrlAfterLogin)){
            setRedirectUrlAfterLogin(redirectUrlAfterLogin);
        }else{
            setRedirectUrlAfterLogin('');
        }
        location.href = '<%= CLI_HOST_API_URL %>/nggirl/h5/cosmetic/login_new.html?v=<%= VERSION %>'
    };

    var data = getFinalRequestObject({
        accessToken : getAccessToken()
    });

    $.ajax({
        type : 'GET',
        url :'<%= CLI_HOST_API_URL %>/nggirl/app/cli/checkAccessToken',
        data : data,
        dataType:'json',
        success : function(result) {
            //授权令牌无效,就登录
            if (result.code != 0) {
                if(!strIsEmpty(redirectUrlAfterLogin)){
                    setRedirectUrlAfterLogin(redirectUrlAfterLogin);
                }else{
                    setRedirectUrlAfterLogin('');
                }
                location.href = '<%= CLI_HOST_API_URL %>/nggirl/h5/cosmetic/login_new.html?v=<%= VERSION %>'
            }
            //授权令牌有效
            else {
                if(typeof(successfun) == 'function'){
                    successfun();
                }else{
                    //goBack();
                }
            }
        }
    });
}

//获取登录后的重定向地址
function getRedirectUrlAfterLogin(){
    return localStorage.redirectUrlAfterLogin;
}

//设置登录后的重定向地址
function setRedirectUrlAfterLogin(redirectUrlAfterLogin){
    localStorage.redirectUrlAfterLogin = redirectUrlAfterLogin;
}

function toString(obj){
    if(obj == null || obj == undefined){
        return '';
    }
    return '' + obj;
}

//设置服务号的appid
function getFwhAppId(){
    return '<%= FWH_APPID %>';
}

//判断页面是否在app中打开
function isInApp(){
	return /nggirl/gi.test(navigator.userAgent);
}

/*
	demo:
	$('#btn').click(function(e) {
        name('我是提示信息');
    });
*/
//提示弹框
function alertFn(title){
	var gray_box = document.createElement('div');
	gray_box.setAttribute('class','gray_box');
	var alert_box = document.createElement('div');
	alert_box.setAttribute('class','alert_box');
	gray_box.appendChild(alert_box);
	var ab_title = document.createElement('p');
	ab_title.appendChild(document.createTextNode('提示'));
	ab_title.setAttribute('class','ab_title');
	var ab_title_p = document.createElement('p');
	ab_title_p.appendChild(document.createTextNode(title))
	alert_box.appendChild(ab_title);
	alert_box.appendChild(ab_title_p);
	document.body.appendChild(gray_box);
	
	//弹框样式
	gray_box.style.zIndex=10000;
	gray_box.style.width = '100%';
	gray_box.style.background ='rgba(0,0,0,.5)';
	gray_box.style.position = 'fixed';
	gray_box.style.top = '0px';
	alert_box.style.width = '80%';
	alert_box.style.padding = '20px 0';
	alert_box.style.background = '#fff';
	alert_box.style.margin = '0 auto';
	alert_box.style.textAlign = 'center';
	alert_box.style.position = 'relative';
	alert_box.style.borderRadius = '5px';
	ab_title.style.padding = '10px 0';
	gray_box.style.height = window.screen.height+'px';
	alert_box.style.marginTop = (window.screen.height - alert_box.clientHeight)/2+'px';
	setTimeout("$('.gray_box').remove()",1000);
}

//增长积分的弹窗
function alertNewScore(score){
	var gray_boxs = document.createElement('div');
	gray_boxs.setAttribute('class','gray_boxs');
	var alert_box = document.createElement('div');
	alert_box.setAttribute('class','alert_box');
	gray_boxs.appendChild(alert_box);
	var ab_title = document.createElement('img');
	ab_title.style.backgroundImage="url(images/integral_small_icon.png)";
	ab_title.setAttribute('class','ab_title');
	var ab_title_p = document.createElement('p');
	ab_title_p.appendChild(document.createTextNode(score))
	alert_box.appendChild(ab_title);
	alert_box.appendChild(ab_title_p);
	document.body.appendChild(gray_boxs);
	
	//弹框样式
	gray_boxs.style.zIndex=10000;
	gray_boxs.style.width = '140px';
	gray_boxs.style.height = '110px';
	gray_boxs.style.background ='rgba(0,0,0,.5)';
	gray_boxs.style.position = 'fixed';
	gray_boxs.style.top = '50%';
	gray_boxs.style.left = '50%';
	gray_boxs.style.margin = '-55px 0 0 -70px';
	gray_boxs.style.borderRadius = '5px';
	alert_box.style.width = '100%';
	alert_box.style.padding = '20px 0';
	alert_box.style.color = '#fff';
	alert_box.style.margin = '0 auto';
	alert_box.style.textAlign = 'center';
	alert_box.style.position = 'relative';
	alert_box.style.borderRadius = '5px';
	ab_title.style.padding = '0 24px 47px';
	ab_title.style.backgroundSize="25px 27px";
	ab_title.style.backgroundRepeat="no-repeat";
	ab_title.style.backgroundPosition="center 5px";
	setTimeout("$('.gray_boxs').remove()",1000);
}
//html标签过滤方法,过滤用户所有曾经输入的字段
function htmlEscape(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

//去掉粘贴文本的样式
function eraseStyleInCopyText(str){
	var re=/<[^>]+>/ig;
	return str.replace(re,"");
}

//获取图片路径
function getImgUrl(s){
    var res = s.replace(/\[/g,",[").replace(/\]/g,"],").replace(/\],,\[/,"],[");
	var arr = res.split(',');
	console.log(arr);
	var str = '';
	for(var x = 0; x < arr.length; x++){
		str += getImgFile(arr[x]);	
	}
	return str;
}
function getImgFile(img){
	if(img == '[ok]'){
		return '<img src="images/listImg/0.png" data-innerhtml="[pk]" width="24px" class="img">'	
	}else if(img == '[大哭]'){
		return '<img src="images/listImg/1.png" data-innerhtml="[大哭]" width="24px class="img">'
	}else if(img == '[对不起]'){
		return '<img src="images/listImg/2.png" data-innerhtml="[对不起]" width="24px" class="img">'	
	}else if(img == '[飞吻]'){
		return '<img src="images/listImg/3.png" data-innerhtml="[飞吻]" width="24px" class="img">'	
	}else if(img == '[愤怒]'){
		return '<img src="images/listImg/4.png" data-innerhtml="[愤怒]" width="24px" class="img">'	
	}else if(img == '[敷面膜]'){
		return '<img src="images/listImg/5.png" data-innerhtml="[敷面膜]" width="24px" class="img">'	
	}else if(img == '[黑脸]'){
		return '<img src="images/listImg/6.png" data-innerhtml="[黑脸]" width="24px" class="img">'	
	}else if(img == '[流泪]'){
		return '<img src="images/listImg/7.png" data-innerhtml="[流泪]" width="24px" class="img">'	
	}else if(img == '[撇嘴]'){
		return '<img src="images/listImg/8.png" data-innerhtml="[撇嘴]" width="24px" class="img">'	
	}else if(img == '[凄凉]'){
		return '<img src="images/listImg/9.png" data-innerhtml="[凄凉]" width="24px" class="img">'	
	}else if(img == '[生气]'){
		return '<img src="images/listImg/10.png" data-innerhtml="[生气]" width="24px" class="img">'	
	}else if(img == '[调皮]'){
		return '<img src="images/listImg/11.png" data-innerhtml="[调皮]" width="24px" class="img">'	
	}else if(img == '[吐舌]'){
		return '<img src="images/listImg/12.png" data-innerhtml="[吐舌]" width="24px" class="img">'	
	}else if(img == '[晚安]'){
		return '<img src="images/listImg/13.png" data-innerhtml="[晚安]" width="24px" class="img">'	
	}else if(img == '[心碎]'){
		return '<img src="images/listImg/14.png" data-innerhtml="[心碎]" width="24px" class="img">'	
	}else if(img == '[疑问]'){
		return '<img src="images/listImg/15.png" data-innerhtml="[疑问]" width="24px" class="img">'	
	}else if(img == '[长草]'){
		return '<img src="images/listImg/16.png" data-innerhtml="[长草]" width="24px" class="img">'	
	}else{
		return img;	
	}
}

//加载动画
function loadAnimationFn(){
	var div = document.createElement('div');
	div.setAttribute('class','blue_loading');
	var images = document.createElement('img');
	images.setAttribute('src','images/blue_loading.gif');
	div.appendChild(images);
	document.body.appendChild(div);
	div.style.width = '100%';
	div.style.height = '100%';
	div.style.position = 'fixed';
	div.style.left = '0px';
	div.style.top = '0px';
	div.style.zIndex = '999';
	div.style.background = 'rgba(255,255,255,1)';
	div.style.textAlign = 'center';
	images.style.margin = '35% auto 0';
	images.style.width = '50%';
}
