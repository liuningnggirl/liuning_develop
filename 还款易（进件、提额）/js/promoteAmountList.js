loader.init();
$(function(){
    //社保
    $('.content_box .shebao').click(function(){
        if(!$(this).hasClass('after')) window.location.href="promoteAmountInsurance.html?consultId="+endConsultId;
    });

    //房产信息
    $('.content_box .fangchan').click(function(){
        if($(this).hasClass('after')){
            window.location.href="promoteAmountProperty.html?commitType=after&mobile="+endMobile+'&custName='+endCustName+'&cardNo='+endCardNo+'&consultId='+endConsultId;
        }else{
            window.location.href="promoteAmountProperty.html";
        }
    });

    //商业保险
    $('.content_box .baoxian').click(function(){
        if(!$(this).hasClass('after')) window.location.href="promoteAmountBusinessInsurance.html?consultId="+endConsultId;
    });

    //公积金
    $('.content_box .gongjijin').click(function(){
        if(!$(this).hasClass('after')) window.location.href="promoteAmountPublicMoney.html?consultId="+endConsultId;
    });

    //网银
    $('.content_box .wangyin').click(function(){

    });

    //跳过并提交
    $('.btn_submit').click(function(){
        if(typeStr == 'and'){
            window.jsToJava.redirect_submit_loan_jieyue();//吊起and借款提交成功页面
        }else if(typeStr == 'ios'){
            window.webkit.messageHandlers.redirect_submit_loan_jieyue.postMessage(null);//吊起ios借款提交成功页面
        }
    });


});

function isGrantType(data){
    var grantType = data.grantType;
    $('.content_box li').each(function(){
        if($(this).attr('grantType') == grantType){
            if(data.grantResult == '0001' || data.grantResult == '0002'){//已经授权,已授权并且已超时
                if(grantType == '05'){//公积金
                    $(this).children('img').attr('src','./images/gongjijin_after.png');
                    $(this).addClass('after');
                }else if(grantType == '04'){//社保
                    $(this).children('img').attr('src','./images/shebao_after.png');
                    $(this).addClass('after');
                }else if(grantType == '08'){//商业保险
                    $(this).children('img').attr('src','./images/shangyebaodan_after.png');
                    $(this).addClass('after');
                }
            }else if(data.grantResult == '0003'){//未授权
                if(grantType == '05'){//公积金
                    $(this).children('img').attr('src','./images/gongjijin_before.png');
                }else if(grantType == '04'){//社保
                    $(this).children('img').attr('src','./images/shebao_before.png');
                }else if(grantType == '08'){//商业保险
                    $(this).children('img').attr('src','./images/shangyebaodan_before.png');
                }
            }
        }
    });
}


//获取客户端传过来的mobile,custName,consultId,cardNo
function getAppParamJieYue(mobile,custName,consultId,cardNo){
    endMobile = mobile;
    endCustName = custName;
    endConsultId = consultId;
    endCardNo = cardNo;
    //授权信息查询
    //社保 05
    var obj_05 = new Object();
    obj_05.mobile = endMobile;
    obj_05.custName = endCustName;
    obj_05.cardNo = endCardNo;
    obj_05.grantType = '05,04,08';
    obj_05.consultId = endConsultId;
    var _obj_05 = JSON.stringify(obj_05, 'utf-8');
    $.ajax({
        type: 'POST',
        contentType: "text/html; charset=UTF-8",
        url: '/fintech-appbiz/api/APPBizRest/appAuthorizeQuery/v1/',
        data: _obj_05,
        dataType: 'json',
        beforeSend: function () {
            loader.showL();
        },
        success: function (data) {
            if(data.retCode == '200'){
                loader.hideL();
                for(x in data.responseBody.dataList){
                    isGrantType(data.responseBody.dataList[x]);
                }
            }else{
                showMsg($('.error-msg'), data.errorDesc);
            }
        },
        error: function () {
            loader.hideL();
        }
    });

    //完善资料咨询信息接口
    var fang_obj = new Object();
    fang_obj.mobile = endMobile;
    fang_obj.custName = endCustName;
    fang_obj.cardNo = endCardNo;
    fang_obj.consultId = endConsultId;
    var _fang_obj = JSON.stringify(fang_obj, 'utf-8');
    $.ajax({
        type: 'POST',
        contentType: "text/html; charset=UTF-8",
        url: '/fintech-appbiz/api/APPBizRest/queryApplyInfo/v1/',
        data: _fang_obj,
        dataType: 'json',
        beforeSend: function () {
            loader.showL();
        },
        success: function (data) {
            if(data.retCode == '200' && data.responseBody!=null){
                loader.hideL();
                if(data.responseBody.lbTIntoInfoHouse[0].housePicList.length != 0){//认证成功
                    $('.content_box .fangchan').children('img').attr('src','./images/fangchanxinxi_after.png');
                    $('.content_box .fangchan').addClass('after');
                };
            }else{
                showMsg($('.error-msg'), data.errorDesc);
            }
        },
        error: function () {
            loader.hideL();
        }
    });

}