var getParam = urlParse();
//var ua = navigator.userAgent;
var operatSystem = '';
loader.init();
$(function(){
    //ua = JSON.parse(ua.substring(ua.lastIndexOf('/')+1));
    var randomStr = Math.random().toString(36).substr(2);
    //获取验证码
    $('.cyc_send').click(function(){
        var bodyObj = {
            "mobile": $.trim($('.cc_tel').val()),
            "type" : "1",
            "pid" : getParam.pid
        }
        var signObj = md5(JSON.stringify(bodyObj)).toUpperCase();//对body内容进行md5加密
        var obj = {
            "header": {
                "appType": getParam.appType,
                "appNo": getParam.appNo,
                "appVersion": getParam.appVersion,
                "requestId": randomStr,
                "sign":signObj,
                "token":getParam.token
            },
            "body":{
                "mobile": $.trim($('.cc_tel').val()),
                "type" : "1",
                "pid" : getParam.pid
            }
        }
        var aseScret = encrypt(JSON.stringify(obj));//aes加密后
        var endObj = {
            "data":aseScret
        }
        endObj = JSON.stringify(endObj);
        if($.trim($('.cc_tel').val()) == ''){
            showMsg($('.error-msg'), '请输入手机号~');
        }else if(!isPhoneNum($.trim($('.cc_tel').val()))){
            showMsg($('.error-msg'), '请输入正确手机号~');
        }else{
            $.ajax({
                type: 'POST',
                contentType: "text/html; charset=UTF-8",
                url: '/api/appUser/appSMCode/v1/',
                headers:{AESKEY:'H5AesKey'},
                data: endObj,
                dataType: 'json',
                beforeSend: function () {
                    loader.showL();
                },
                success: function (data) {
                    var decryptData = JSON.parse(decrypt(data.data));
                    if(decryptData.header.rspMsg == '成功'){
                        loader.hideL();
                        showMsg($('.error-msg'), "验证码已发送,请注意查收~");
                        callBackCodeFu();
                    }else{
                        loader.hideL();
                        showMsg($('.error-msg'), decryptData.header.rspMsg);
                    }
                },
                error: function (e) {
                    loader.hideL();
                }
            });
        }
    });

    //注册
    $('.cc_register_btn').on("click",function(){
        var bodyObj = {
            "mobile": $.trim($('.cc_tel').val()),
            "password":$.trim($('.cyc_pwd').val()),
            "smCode":$.trim($('.cyc_yzm').val()),
            "type" : "1",
            "marketChannel" : getParam.marketChannel,//应用市场渠道（91助手、360助手 等）
            "promotionSource" : getParam.promotionSource,//运营推广来源（1-百融 2-卡牛）
            "terminalType" : "h5"//终端类型（ios、android、h5、pad）
        }
        var signObj = md5(JSON.stringify(bodyObj)).toUpperCase();//对body内容进行md5加密
        var obj = {
            "header": {
                "appType": getParam.appType,
                "appNo": getParam.appNo,
                "appVersion": getParam.appVersion,
                "requestId": randomStr,
                "sign":signObj,
                "token":getParam.token
            },
            "body":{
                "mobile": $.trim($('.cc_tel').val()),
                "password":$.trim($('.cyc_pwd').val()),
                "smCode":$.trim($('.cyc_yzm').val()),
                "type" : "1",
                "marketChannel" : getParam.marketChannel,//应用市场渠道（91助手、360助手 等）
                "promotionSource" : getParam.promotionSource,//运营推广来源（1-百融 2-卡牛）
                "terminalType" : "h5"//终端类型（ios、android、h5、pad）
            }
        }
        var aseScret = encrypt(JSON.stringify(obj));//aes加密后
        var endObj = {
            "data":aseScret
        }
        endObj = JSON.stringify(endObj);
        if($.trim($('.cc_tel').val()) == ''){
            showMsg($('.error-msg'), '请输入手机号');
        }else if(!isPhoneNum($.trim($('.cc_tel').val()))){
            showMsg($('.error-msg'), '请输入正确手机号');
        }else if($.trim($('.cyc_yzm').val()) == ''){
            showMsg($('.error-msg'), '请输入验证码');
        }else if($.trim($('.cyc_pwd').val()) == ''){
            showMsg($('.error-msg'), '请输入密码');
        }else if(!CheckPassWord($.trim($('.cyc_pwd').val()))){
            showMsg($('.error-msg'), '登录密码为6-20位字母+数字，请重新输入');
        }else{
            $.ajax({
                type: 'POST',
                contentType: "text/html; charset=UTF-8",
                url: '/api/appUser/appRegister/v1/',
                headers:{AESKEY:'H5AesKey'},
                data: endObj,
                dataType: 'json',
                beforeSend: function () {
                    loader.showL();
                },
                success: function (data) {
                    var decryptData = JSON.parse(decrypt(data.data));
                    if(decryptData.header.rspMsg == '成功'){
                        loader.hideL();
                        $('.content_box').addClass('hidden');
                        $('.success_box').removeClass('hidden');
                        setTimeout(function(){
                            doanLoadAppFn();
                        },1000)
                    }else{
                        loader.hideL();
                        showMsg($('.error-msg'), decryptData.header.rspMsg);
                    }
                },
                error: function (e) {
                    loader.hideL();
                }
            });
        }
    });

    //眼睛切换
    $('.cyc_eyes').click(function(){
        var this_ = $(this);
        if(this_.hasClass('on')){
            this_.removeClass('on');
            this_.attr('src','images/pwd_close.png');
            document.getElementById("pwd").type="password";
        }else{
            this_.addClass('on');
            this_.attr('src','images/pwd_open.png');
            document.getElementById("pwd").type="text";
        }
    });

    //注册协议
    $('.cp_url').on("click",function(){
        window.location.href = "../agreement/userRegistration.html"
    });

    //登录
    $('.cl_login').click(function(){
        doanLoadAppFn();
    });
})

//回调获取验证码
function callBackCodeFu(){
    $('.cyc_send').unbind('click');
    SysSecond = parseInt(60);
    InterValObj = window.setInterval(SetRemainTime, 1000);
}
function SetRemainTime() {
    if (SysSecond > 0) {
        SysSecond = SysSecond - 1;
        $('.cyc_send').html(SysSecond+'s'+'后重新获取');
    } else {
        window.clearInterval(InterValObj);
        $('.cyc_send').bind('click',function(){
            callBackCodeFu();
        });
        $('.cyc_send').html('重新获取');
    }
}

//下载app
function doanLoadAppFn(){
    //IOS直接跳转到APP Store
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        var ua = window.navigator.userAgent.toLowerCase();
        //微信内
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            console.log('ios微信内');
            operatSystem = "1";
            $('.content_box').addClass('hidden');
            $('.gray_box ').removeClass('hidden');
        }else {//微信外
            console.log('ios微信外');
            operatSystem = "1";
            getDownLoadUrl();
        }
    }else {//安卓系统内部
        var ua = window.navigator.userAgent.toLowerCase();
        //微信内
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            console.log('android微信内');
            operatSystem = "0";
            $('.content_box').addClass('hidden');
            $('.gray_box ').removeClass('hidden');
        }else {//微信外
            console.log('android微信外');
            operatSystem = "0";
            getDownLoadUrl();
        }
    }
}
//获取下载地址
function getDownLoadUrl(){
    var bodyObj = {
        "operatSystem": operatSystem//操作系统 android、ios（0：android， 1：ios）
    }
    var signObj = md5(JSON.stringify(bodyObj)).toUpperCase();//对body内容进行md5加密
    var obj = {
        "header": {
            "appType": "000000",
            "appNo": "000000",
            "appVersion": "000000",
            "requestId": "000000",
            "sign":signObj,
            "token":"000000",
        },
        "body":{
            "operatSystem": operatSystem//操作系统 android、ios（0：android， 1：ios）
        }
    }
    var aseScret = encrypt(JSON.stringify(obj));//aes加密后
    var endObj = {
        "data":aseScret
    }
    endObj = JSON.stringify(endObj);
    $.ajax({
        type: 'POST',
        contentType: "text/html; charset=UTF-8",
        url: '/api/appUser/selectByOperatSystem/',
        headers:{AESKEY:'H5AesKey'},
        data: endObj,
        dataType: 'json',
        beforeSend: function () {
            loader.showL();
        },
        success: function (data) {
            var decryptData = JSON.parse(decrypt(data.data));
            if(decryptData.header.rspMsg == '成功'){
                loader.hideL();
                window.location.href = decryptData.body.downUrl;
            }else{
                loader.hideL();
                showMsg($('.error-msg'), decryptData.header.rspMsg);
            }
        },
        error: function (e) {
            loader.hideL();
        }
    });
}
