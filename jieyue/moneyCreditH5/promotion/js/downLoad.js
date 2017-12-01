var getParam = urlParse();
var ua = navigator.userAgent;
loader.init();
$(function(){
    var operatSystem = '';
    //IOS直接跳转到APP Store
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        var ua = window.navigator.userAgent.toLowerCase();
        //微信内
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            console.log('ios微信内');
            operatSystem = "1";
        }else {//微信外
            console.log('ios微信外');
            operatSystem = "1";
        }
    }else {//安卓系统内部
        var ua = window.navigator.userAgent.toLowerCase();
        //微信内
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            console.log('android微信内');
            operatSystem = "0";
        }else {//微信外
            console.log('android微信外');
            operatSystem = "0";
        }
    }

    $(".down_btn").live('click', openApp);
    function openApp() {
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
                    window.open(decryptData.body.downUrl);
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