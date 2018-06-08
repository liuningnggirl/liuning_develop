var getParam = urlParse();
$(function(){
    $('.i-first').click(function () {
        window.location.href = 'agreement/borrowAgreement.html';
    })
    $('.i-second').click(function () {
        window.location.href = 'agreement/insuranceServiceAgreement.html';
    })
    $('.i-third').click(function () {
        window.location.href = 'agreement/repayStatement.html';
    })
    $('.i-fourth').click(function () {
        window.location.href = 'agreement/informationManagement.html';
    })
    $('.i-fifth').click(function () {
        window.location.href = 'agreement/entrustDeduct.html';
    })

    //获取签约后的合同列表
    var obj = {
        "header": {
            "appType": getParam.getParam,
            "appNo": getParam.appNo,
            "appVersion": getParam.appVersion,
            "requestId":getParam.requestId,
            "sign":getParam.sign,
            "token":getParam.token
        },
        "body":{
            "contractNo":getParam.contractNo
        }
    }
    obj = JSON.stringify(obj,'utf-8');
    $.ajax({
        type: 'POST',
        contentType: "text/html; charset=UTF-8",
        url: '/api/appLoan/loanAgreemenInfo',
        headers:{AESKEY:'H5AesKey'},
        data: obj,
        dataType: 'json',
        beforeSend: function () {
            loader.showL();
        },
        success: function (data) {

        },
        error: function (e) {
            loader.hideL();
        }
    });

})