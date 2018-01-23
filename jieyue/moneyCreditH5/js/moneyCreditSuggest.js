var getParam = urlParse();
var ua = navigator.userAgent;
loader.init();
$(function(){
    ua = JSON.parse(ua.substring(ua.lastIndexOf('/')+1));
    $('.s-li').click(function(){
        $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active');
    })

    //字数统计
    $('.s-text').on('input',function(){
        var num = $.trim($('.s-text').val()).length;
        if(parseInt(num) >= 190){
            $('.fn_left').html(num).addClass('fn_left_color');
        }else{
            $('.fn_left').html(num).removeClass('fn_left_color');
        }

    })

    //意见反馈提交
    $('.next-step').click(function () {
        var serverType = '';
        $('.suggest-box ul li').each(function(){
            if($(this).children('div').hasClass('active')){
                serverType += $(this).children('div').html()+',';
            }
        })
        serverType = serverType.substring(0,serverType.length - 1);
        var randomStr = Math.random().toString(36).substr(2);
        var bodyObj = {
            "backComments": $('.s-text').val(),
            "serverType" : serverType
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
                "backComments": $('.s-text').val(),
                "serverType" : serverType
            }
        }
        if($.trim($('.s-text').val()) == '') {
            showMsg($('.error-msg'), '反馈意见不能为空');
        }else if(serverType == ''){
            showMsg($('.error-msg'), '请选择至少一个问题标签');
        }else if($.trim($('.s-text').val()).length < 10){
            showMsg($('.error-msg'), '问题描述不少于10个字');
        } else {
            var aseScret = encrypt(JSON.stringify(obj));//aes加密后
            var endObj = {
                "data":aseScret
            }
            endObj = JSON.stringify(endObj);
            $.ajax({
                type: 'POST',
                contentType: "text/html; charset=UTF-8",
                url: '/api/appUser/appSendComments/v1/',
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
                        showMsg($('.error-msg'), '感谢您的反馈，我们会尽快处理您的问题');
                        param = '{"type": "finish","data":""}';
                        if(ua.appType == 'iOS'){
                            window.webkit.messageHandlers.jsCallbackMethod.postMessage(param);
                        }
                        if(ua.appType == 'android'){
                            window.jsToJava.jsCallbackMethod(param);
                        }
                    }else if(decryptData.header.rspCode == '-999999'){
                        tokenInvalidParamFn(ua.appType,decryptData.header.rspMsg);
                        loader.hideL();
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
})