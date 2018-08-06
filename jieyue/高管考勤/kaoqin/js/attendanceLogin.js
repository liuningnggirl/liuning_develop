loader.init();
var getParam = urlParse();
var ua = navigator.userAgent;
$(function(){
    //隐藏客户端标题栏箭头
    var leftIsShow = '{"type": "leftIsShow","data": {"isHide":"1"}}';
    if(ua.indexOf("androidH5App") >= 0){
        window.jsToJava.jsCallbackMethod(leftIsShow);
    };

    //获取验证码
    $('.get_yzm').click(function(){
        if(!$('.login_btn').hasClass('login_btn_gray')){
            var obj = {};
            if(isValContent($('.tel .cc_tel').val())){
                errorMessageSlideUpFn('手机号不能为空');
            }else if(!isPhoneNum($('.tel .cc_tel').val())){
                errorMessageSlideUpFn('请输入正确手机号');
            }else{
                obj.tellphone = $('.tel .cc_tel').val();
                obj = JSON.stringify(obj,'utf-8');
                $.ajax({
                    type: 'POST',
                    contentType: "text/html; charset=UTF-8",
                    url: '/schedule/sendSmsCodes',
                    data: obj,
                    dataType: 'json',
                    beforeSend: function () {
                        loader.showL();
                    },
                    success: function (data) {
                        if(data.responseBody!= null && data.retCode == '200'){
                            loader.hideL();
                            errorMessageSlideUpFn('验证码发送成功');
                            callBackCodeFu();
                        }else{
                            loader.hideL();
                            errorMessageSlideUpFn(data.responseBody.returnmessage);
                        }
                    },
                    error: function (e) {
                        loader.hideL();
                    }
                });
            }
        }
    });

    //登陆
    $('.login_btn').click(function(){
        var _this = $(this);
        if(!_this.hasClass('login_btn_gray')){
            if(isValContent($('.tel .cc_tel').val())){
                errorMessageSlideUpFn('手机号不能为空');
            }else if(!isPhoneNum($('.tel .cc_tel').val())){
                errorMessageSlideUpFn('请输入正确手机号');
            }else if(isValContent($('.yzm .cc_yzm').val())){
                errorMessageSlideUpFn('验证码不能为空');
            }else{
                var login_obj = {};
                login_obj.tellphone = $('.tel .cc_tel').val();
                login_obj.verifycode = $('.yzm .cc_yzm').val();
                login_obj = JSON.stringify(login_obj,'utf-8');
                $.ajax({
                    type: 'POST',
                    contentType: "text/html; charset=UTF-8",
                    url: '/schedule/logins',
                    data: login_obj,
                    dataType: 'json',
                    beforeSend: function () {
                        loader.showL();
                    },
                    success: function (data) {
                        loader.hideL();
                        if(data.responseBody.returnparam != null  && data.retCode == 200){
                            localStorage.setItem('lastLoginDateTime',data.responseBody.returnparam.lastLoginDateTime);
                            window.location.href = "attendanceIndex.html?employeeid="+data.responseBody.returnparam.employeeid;
                            localStorage.setItem('localStorageLoginNum',data.responseBody.returnparam.ifone);
                            //回调客户端方法  type=loginCallBack  isLogin=true  登录成功
                            var loginCallBack = '{"type": "loginCallBack","data": {"isLogin":"true","mobile":"'+$('.tel .cc_tel').val()+'","employeeid":"'+data.responseBody.returnparam.employeeid+'","verifycode":"'+$('.yzm .cc_yzm').val()+'"}}';
                            if(ua.indexOf("androidH5App") >= 0){
                                window.jsToJava.jsCallbackMethod(loginCallBack);
                            };
                        }else{
                            errorMessageSlideUpFn(data.errorDesc);
                        }
                    },
                    error: function (e) {
                        loader.hideL();
                    }
                });
            }
        };
    });

    var bbNetwork = new BBNetwork(function(status){
        var tipMsg = "" ;
        if("online" != status){
            errorMessageFixFn('网络不给力，请检查网络设置');
            $('.login_btn').addClass('login_btn_gray');
        }else{
            $('.login_btn').removeClass('login_btn_gray');
        }
    }) ;
    if(!bbNetwork.isOnline()){
        errorMessageFixFn('网络不给力，请检查网络设置');
        $('.login_btn').addClass('login_btn_gray');
    }else{
        $('.login_btn').removeClass('login_btn_gray');
    }
});

//回调获取验证码
function callBackCodeFu(){
    $('.get_yzm').unbind('click');
    SysSecond = parseInt(60);
    InterValObj = window.setInterval(SetRemainTime, 1000);
}
function SetRemainTime() {
    if (SysSecond > 0) {
        SysSecond = SysSecond - 1;
        $('.get_yzm').html(SysSecond+'s').addClass('gray_color');
    } else {
        window.clearInterval(InterValObj);
        $('.get_yzm').bind('click',function(){
            callBackCodeFu();
        });
        $('.get_yzm').html('获取验证码').removeClass('gray_color');
    }
}

