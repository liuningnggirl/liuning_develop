var getParam = urlParse();
var ua = window.navigator.userAgent.toLowerCase();
var randomStr = Math.random().toString(36).substr(2);
loader.init();
$(function(){
    var operatSystem = '';
    //IOS直接跳转到APP Store
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        //微信内
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            console.log('ios微信内');
            operatSystem = "ios";
        }else {//微信外
            console.log('ios微信外');
            operatSystem = "ios";
        }
    }else {//安卓系统内部
        //微信内
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            console.log('android微信内');
            operatSystem = "android";
        }else {//微信外
            console.log('android微信外');
            operatSystem = "android";
        }
    }

    $(".down_btn").live('click', function(){
        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
            //微信内
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                console.log('ios微信内');
                //$('.gray_box').removeClass('hidden');
                window.location.href = "whiteDownLoad.html";
            }else {//微信外
                console.log('ios微信外');
                //openApp();
                window.location.href = "iosDownLoad.html";
            }
        }else {//安卓系统内部
            //微信内
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                console.log('android微信内');
                //$('.gray_box').removeClass('hidden');
                window.location.href = "whiteDownLoad.html";
            }else {//微信外
                console.log('android微信外');
                openApp();
            }
        }
    });
    function openApp() {
        var bodyObj = {
            "operatSystem": operatSystem//操作系统 android、ios（0：android， 1：ios）
        }
        var signObj = md5(JSON.stringify(bodyObj)).toUpperCase();//对body内容进行md5加密
        var randomStr = Math.random().toString(36).substr(2);
        var obj = {
            "header": {
                "appType": "000000",
                "appNo": "000000",
                "appVersion": "000000",
                "requestId": randomStr,
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
            url: '/api/h5/downloadVersion/v1/',
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
});