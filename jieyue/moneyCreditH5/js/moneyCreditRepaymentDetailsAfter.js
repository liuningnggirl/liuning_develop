var getParam = urlParse();
var ua = navigator.userAgent;
loader.init();
$(function(){
    param = '{"type": "repaymentMoneyDetails","data":""}';
    ua = JSON.parse(ua.substring(ua.lastIndexOf('/')+1));
    //点击我要还款
    $('.repayment_btn').click(function(){
        if(ua.appType == 'android'){
            window.jsToJava.jsCallbackMethod(param);
        };
        if(ua.appType=='iOS'){
            window.webkit.messageHandlers.jsCallbackMethod.postMessage(param);
        }
    });

    //获取贷后还款明细
    var randomStr = Math.random().toString(36).substr(2);
    var bodyObj = {
        "contractNo": getParam.contractNo
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
        "body": {
            "contractNo": getParam.contractNo
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
        url: '/api/appLoan/repayPlanList/v1',
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
                    $('.content_box ul').append('<li>\n' +
                        '            <span>'+decryptData.body[x].term+'</span>\n' +
                        '            <span>'+decryptData.body[x].repayDate+'</span>\n' +
                        '            <span>'+decryptData.body[x].repayMoney+'</span>\n' +
                        '            <span>'+decryptData.body[x].alreadyMoney+'</span>\n' +
                        '            <span class="cb_status '+repayMoneyStatusFn(decryptData.body[x].status)+'">'+decryptData.body[x].status+'</span>\n' +
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
})

//判断还款状态
function repayMoneyStatusFn(status){
    var str = '';
    if(status == '已还'){
        str = 'cb_status_yihuan';
    }else if(status == '逾期'){
        str = 'cb_status_yuqi';
    }else if(status == '未还'){
        str = 'cb_status_weihuan';
    }
    return str;
}

