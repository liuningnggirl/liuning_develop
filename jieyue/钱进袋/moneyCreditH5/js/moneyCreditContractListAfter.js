var getParam = urlParse();
var ua = navigator.userAgent;
loader.init();
$(function(){
    ua = JSON.parse(ua.substring(ua.lastIndexOf('/')+1));
    //获取签约后的合同列表
    var randomStr = Math.random().toString(36).substr(2);
    var bodyObj = {
        "contractNo":getParam.contractNo
    }
    var signObj = md5(JSON.stringify(bodyObj)).toUpperCase();//对body内容进行md5加密

    //接收客户端传过来的参数
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
            "contractNo":getParam.contractNo
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
        url: '/api/appLoan/loanAgreemenInfo',
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
                var data = decryptData.body.contractInfoUrl;
                for(x in decryptData.body.contractInfoUrl){
                    $('.list-box ul').append('<li name="'+data[x].name+'" url="'+data[x].url+'">\n' +
                        '            <div class="list-li i-third">\n' +
                        '                <span>'+data[x].name+'</span>\n' +
                        '                <img src="images/arrow-icon%20@iOS_2x.png">\n' +
                        '            </div>\n' +
                        '        </li>');
                }
            }else if(decryptData.header.rspCode == '-999999'){
                tokenInvalidParamFn(ua.appType,decryptData.header.rspMsg);
                loader.hideL();
            }else{
                showMsg($('.error-msg'), decryptData.header.rspMsg);
                loader.hideL();
            }
        },
        error: function (e) {
            loader.hideL();
        }
    });

    //查看合同详情
    $('.list-box ul li').live("click",function(){
        var param = '{"type": "contractListParam","data":{"url":"'+$(this).attr('url')+'","name":"'+$(this).attr('name')+'"}}';
        if(ua.appType == 'android'){
            window.jsToJava.jsCallbackMethod(param);
        };
        if(ua.appType=='iOS'){
            window.webkit.messageHandlers.jsCallbackMethod.postMessage(JSON.parse(param));
        }
    })
});