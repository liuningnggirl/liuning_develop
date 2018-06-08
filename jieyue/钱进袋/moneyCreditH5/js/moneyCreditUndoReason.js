var getParam = urlParse();
var ua = navigator.userAgent;
loader.init();
var randomStr = Math.random().toString(36).substr(2);
$(function(){
    ua = JSON.parse(ua.substring(ua.lastIndexOf('/')+1));
    $('.cb_content li').live('click',function(){
        var this_ = $(this);
        if(this_.hasClass('on')){
            this_.removeClass('on').children('img').attr('src','./images/payt- xz@iOS_2x.png');
            this_.siblings().removeClass('on').children('img').attr('src','./images/payt- xz@iOS_2x.png');
        }else{
            this_.addClass('on').children('img').attr('src','./images/payt- xz2@iOS_2x.png');
            this_.siblings().removeClass('on').children('img').attr('src','./images/payt- xz@iOS_2x.png');
        }
    });

    //提交撤销借款申请
    $('.cb_btn').click(function(){
        var randomStr = Math.random().toString(36).substr(2);
        var causeCode = '';
        $('.cb_content li').each(function(){
            if($(this).hasClass('on')){
                causeCode = $(this).attr('code')
                return;
            }
        })
        var bodyObj = {
            "orderNo":getParam.orderNo,
            "causeCode":causeCode
        }
        var signObj = md5(JSON.stringify(bodyObj)).toUpperCase();//对body内容进行md5加密
        var obj = {
            "header": {
                "appType": ua.appType,
                "appNo": ua.appNo,
                "appVersion": ua.appVersion,
                "requestId": randomStr,
                "sign":signObj,
                "token":ua.token
            },
            "body":{
                "orderNo":getParam.orderNo,
                "causeCode":causeCode
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
            url: '/api/appLoan/cancelLoan/v1',
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
                    var param = '{"type": "finish","data":""}';
                    if(ua.appType == 'iOS'){
                        window.webkit.messageHandlers.jsCallbackMethod.postMessage(param);
                    }
                    if(ua.appType == 'android'){
                        window.jsToJava.jsCallbackMethod('{"type": "finish","data":{"refresh": "billCancelSuccess"}}');
                    }
                }else{
                    showMsg($('.error-msg'), decryptData.header.rspMsg);
                    loader.hideL();
                }
            },
            error: function (e) {
                loader.hideL();
            }
        });
    });

    //撤销原因列表查询
    var bodyObj = {};
    var signObj = md5(JSON.stringify(bodyObj)).toUpperCase();//对body内容进行md5加密

    var obj = {
        "header": {
            "appType": ua.appType,
            "appNo": ua.appNo,
            "appVersion": ua.appVersion,
            "requestId": randomStr,
            "sign":signObj,
            "token":ua.token
        },
        "body":{}
    }
    var aseScret = encrypt(JSON.stringify(obj));//aes加密后
    var endObj = {
        "data":aseScret
    }
    endObj = JSON.stringify(endObj);
    $.ajax({
        type: 'POST',
        contentType: "text/html; charset=UTF-8",
        url: '/api/appLoan/enum/v1',
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
                for(x in decryptData.body){
                    $('.cb_content').append('<li code="'+decryptData.body[x].code+'">\n' +
                        '            <p class="cc_msg">'+decryptData.body[x].name+'</p>\n' +
                        '            <img src="./images/payt- xz@iOS_2x.png" alt="" class="cc_select">\n' +
                        '        </li>');
                }
            }else{
                showMsg($('.error-msg'), decryptData.header.rspMsg);
                loader.hideL();
            }
        },
        error: function (e) {
            loader.hideL();
        }
    });
});
