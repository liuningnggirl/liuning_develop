$(function () {

    //登录按钮
    $('.login-btn').click(function (e) {
		if($('.login .user-name').val() == ''){
			alert('请填写手机号！！');	
		}else if($('.login .user-key').val() == ''){
			alert('请填写密码！！');
		}else{
            if (/iphone|ipad|ipod/.test(ua)) {
                _czc.push(['_trackEvent','login-btn','phoneType=iOS','登录','login-btn']);  
            } else if (/android/.test(ua)) {
                _czc.push(['_trackEvent','login-btn','phoneType=and','登录','login-btn']);
            };
			var userName = $('.user-name')[0];
			var password = $('.user-key')[0];
			var data = getFinalRequestObject({phoneNum: userName.value, password: password.value});
			$.ajax({
				type: 'POST',
				url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/register/weixin/logon/1.5.0',
				data: data, 
				dataType: 'json',
				success: function (result) {
					if (result.code == '0') {
						setAccessToken(result.data.accessToken);
						//判断是否在app内
						if(isInApp()){
							window.ngjsInterface.reWriteToken(result.data.accessToken, result.data.imAccount, result.data.imPassword);
						}
						//如果已经设置了重定向地址,就进入重定向地址
						if (!strIsEmpty(getRedirectUrlAfterLogin())) {
							window.location.href = getRedirectUrlAfterLogin();
						}
						//如果没有设置,就回退页面
						else {
							goBack();
						}
					} else {
						alert(result.data.error);
					}
				}
			});
		}
    });

    $(".box-txt .user-name").focus();
    //验证结果
    var checkLogin = function () {
        var errorMsg = '';
        //验证用户名
        if ($('.user-name').value == "") {
            errorMsg = '请输入用户名.';
        }
        //验证密码
        if ($('.user-key').value == "") {
            errorMsg = '请输入密码.';
        }

        return errorMsg;
    };

    //忘记密码1-->获取验证码
    var yzmFCanClick = true;
    $('.find-pwd .yzm').click(function (e) {
        if (yzmFCanClick) {
            if ($('.find-pwd .fp-name').val() == null || $('.find-pwd .fp-name').val() == '') {
                alert('请输入手机号');
            } else {
                yzmFCanClick = false;

                //请求后台发送验证码
                var phoneNum = $(this).siblings('.fp-name')[0].value;
                var data = getFinalRequestObject({phoneNum: phoneNum});
                $.ajax({
                    type: 'GET',
                    url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/phoneUser/getCodeForgot',
                    data: data,
                    success: function (result) {
                        result = $.parseJSON(result);
                        if (result.code == '1') {
                            alert(result.data.error);
                            $("#remainTime").html('获取验证码');
                            yzmFCanClick = true;
                            return;
                        } else {
                            var SysSecond;
                            var InterValObj;
                            $(document).ready(function () {
                                SysSecond = parseInt(60); //这里获取倒计时的起始时间
                                InterValObj = window.setInterval(SetRemainTime, 1000); //间隔函数，1秒执行
                            });
                            //将时间减去1秒，计算天、时、分、秒
                            function SetRemainTime() {
                                if (SysSecond > 0) {
                                    SysSecond = SysSecond - 1;
                                    var second = Math.floor(SysSecond % 60);             // 计算秒
                                    var minite = Math.floor((SysSecond / 60) % 60);      //计算分
                                    var hour = Math.floor((SysSecond / 3600) % 24);      //计算小时
                                    var day = Math.floor((SysSecond / 3600) / 24);        //计算天
                                    if (day > 0) {
                                        $("#remainTime").html(second + '秒');
                                    } else {
                                        $("#remainTime").html(second + '秒');
                                    }
                                } else {//剩余时间小于或等于0的时候，就停止间隔函数
                                    yzmFCanClick = true;
                                    window.clearInterval(InterValObj);
                                    //这里可以添加倒计时时间为0后需要执行的事件
                                    $("#remainTime").html('请重新获取');
                                }
                            }
                        }
                    }
                });
            }
        }
    });
    //忘记密码1-->验证
    var checkedPhoneNum, checkedYzm;
    $('.find-pwd .btn-yz').click(function (e) {
    	if($('.find-pwd .fp-name').val() == ''){
    		alert('请填写注册手机号！！');	
    	}else if($('.find-pwd .fp-key').val() == ''){
    		alert('请填写验证码！！');
    	}else{
	        if ($('.find-pwd .fp-key') != null && $('.find-pwd .fp-key')[0].value != '') {
	            var yzm = $('.find-pwd .fp-key')[0].value;
	            var phoneNum = $('.find-pwd .fp-name')[0].value;
	            var data = getFinalRequestObject({phoneNum: phoneNum, code: yzm});
	            $.ajax({
	                type: 'POST',
	                url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/phoneUser/checkRegisterCode',
	                data: data,
	                success: function (result) {
	                    result = $.parseJSON(result);
	                    if (result.code == '1') {
	                        alert('验证码无效.');
	                    } else {
	                        checkedPhoneNum = phoneNum;
	                        checkedYzm = yzm;
	                        document.title = '找回密码(2/2)_南瓜姑娘';
	                        $('.find-pwd').hide();
	                        $('.reset-pwd').slideDown();
							$('.reset-pwd .rp-message .num').html($('.find-box .fp-name').val());
	                    }
	                }
	            });
	        } else {
	            alert('请输入验证码');
	        }
    	}
    });

    //忘记密码2-->确定
    $('.reset-pwd .btn-ok').click(function (e) {
    	if($.trim($('.reset-pwd .rp-name').val())== ''){
    		alert('请填写新密码！！');	
			$('.reset-pwd .rp-name').val('');
    	}else if($.trim($('.reset-pwd .rp-name').val()).length< 6 && $.trim($('.reset-pwd .rp-name').val()).length< 32){
    		alert('密码不得小于6位！！');
			$('.reset-pwd .rp-name').val('');	
    	}else if($.trim($('.reset-pwd .rp-key').val()).length< 6 && $.trim($('.reset-pwd .rp-name').val()).length< 32){
    		alert('请再次填写密码！！');
			$('.reset-pwd .rp-key').val('');
    	}else{
    	   if (/iphone|ipad|ipod/.test(ua)) {
                _czc.push(['_trackEvent','reset-ps-btn','phoneType=iOS','注册','reset-ps-btn']);  
            } else if (/android/.test(ua)) {
                _czc.push(['_trackEvent','reset-ps-btn','phoneType=and','注册','reset-ps-btn']);
            };
	
	        if ($.trim($('.reset-pwd .rp-name'))!= null && $.trim($('.reset-pwd .rp-name')[0].value)!= '') {
	            var secretNew = $.trim($('.reset-pwd .rp-name')[0].value);
	            var secretAgain = $.trim($('.reset-pwd .rp-key')[0].value);
	
	            if (secretNew != secretAgain) {
	                alert('两次输入的密码不一致.');
	                return;
	            }
	            var data = getFinalRequestObject({phoneNum: checkedPhoneNum, code: checkedYzm, newPassword: secretNew});
	            $.ajax({
	                type: 'POST',
	                url:'<%= CLI_HOST_API_URL %>/nggirl/app/cli/phoneUser/updatePasswordForgot',
	                data: data,
	                success: function (result) {
	                    result = $.parseJSON(result);
	                    if (result.code == '1') {
	                        alert(result.data.error);
	                    } else {
	                        setAccessToken(result.data.accessToken);
	                        location.href = 'index.html?v=<%= VERSION %>';
	                    }
	                }
	            });
	        }
    	}   
    });

    //注册1-->验证
    var yzmRCanClick = true;
    $('.register-pwd .yzm').click(function (e) {
        if (yzmRCanClick) {
            if ($('.register-pwd .fp-name').val() == null || $('.register-pwd .fp-name').val() == '') {
                alert('请输入手机号');
            } else {
                yzmRCanClick = false;


                //请求后台发送验证码
                var phoneNum = $(this).siblings('.fp-name')[0].value;
                var data = getFinalRequestObject({phoneNum: phoneNum});
                $.ajax({
                    type: 'GET',
                    url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/phoneUser/getCode',
                    data: data,
                    success: function (result) {
                        result = $.parseJSON(result);
                        if (result.code == '1') {
                            alert(result.data.error);
                            $("#remainTime01").html('获取验证码');
                            yzmRCanClick = true;
                            return;
                        } else {
							$('.register-success .rp-message .num').html($('.register-box .fp-name').val());
                            var SysSecond;
                            var InterValObj;
                            $(document).ready(function () {
                                SysSecond = parseInt(60); //这里获取倒计时的起始时间
                                InterValObj = window.setInterval(SetRemainTime, 1000); //间隔函数，1秒执行
                            });
                            //将时间减去1秒，计算天、时、分、秒
                            function SetRemainTime() {
                                if (SysSecond > 0) {
                                    SysSecond = SysSecond - 1;
                                    var second = Math.floor(SysSecond % 60);             // 计算秒
                                    var minite = Math.floor((SysSecond / 60) % 60);      //计算分
                                    var hour = Math.floor((SysSecond / 3600) % 24);      //计算小时
                                    var day = Math.floor((SysSecond / 3600) / 24);        //计算天
                                    if (day > 0) {
                                        $("#remainTime01").html(second + '秒');
                                    } else {
                                        $("#remainTime01").html(second + '秒');
                                    }
                                } else {//剩余时间小于或等于0的时候，就停止间隔函数
                                    window.clearInterval(InterValObj);
                                    yzmRCanClick = true;
                                    //这里可以添加倒计时时间为0后需要执行的事件
                                    $("#remainTime01").html('请重新获取');
                                }
                            }
                        }
                    }
                });
            }
        }
    });

    //注册1-->验证
    var checkedPhoneNum, checkedYzm;
    $('.register-pwd .btn-yz').click(function (e) {

    	if($('.register-box .fp-name').val() == ''){
    		alert('请填写注册要使用的手机号！！');	
    	}else if($.trim($('.register-box .fp-key').val())== ''){
    		alert('请填写验证码！！');	
    	}else{
	        if ($.trim($('.register-pwd .fp-key')) != null && $.trim($('.register-pwd .fp-key')[0].value) != '') {
	            var yzm = $('.register-pwd .fp-key')[0].value;
	            var phoneNum = $('.register-pwd .fp-name')[0].value;
	            var data = getFinalRequestObject({phoneNum: phoneNum, code: yzm});
	            $.ajax({
	                type: 'POST',
	                url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/phoneUser/checkRegisterCode',
	                data: data,
	                success: function (result) {
	                    result = $.parseJSON(result);
	                    if (result.code == '1') {
	                        alert('验证码无效.');
	                    } else {
	                        checkedPhoneNum = phoneNum;
	                        checkedYzm = yzm;
	                        document.title = '注册(2/2)_南瓜姑娘';
	                        $('.register-pwd').hide();
	                        $('.register-success').slideDown();
	                    }
	                }
	            });
	        } else {
	            alert('请输入验证码');
	        }
    	}
    });
    //注册2-->立即注册
    $('.register-success .btn-ok').click(function (e) {
        if (/iphone|ipad|ipod/.test(ua)) {
                _czc.push(['_trackEvent','rigist','phoneType=iOS','注册','rigist']);  
            } else if (/android/.test(ua)) {
                _czc.push(['_trackEvent','rigist','phoneType=and','注册','rigist']);
            };

        if ($('.register-success .rp-name') != null && $('.register-success .rp-name')[0].value != '') {
            var secretNew = $.trim($('.register-success .rp-name')[0].value);
            var secretAgain = $.trim($('.register-success .rp-key')[0].value);

            if (secretNew != secretAgain) {
                alert('两次输入的密码不一致.');
                return;
            }
            var data = getFinalRequestObject({phoneNum: checkedPhoneNum, code: checkedYzm, password: secretNew});
            $.ajax({
                type: 'POST',
                url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/phoneUser/create',
                data: data,
                success: function (result) {
                    result = $.parseJSON(result);
                    if (result.code == '1') {
                        alert(result.data.error);
                    } else {
                        setAccessToken(result.data.accessToken);
                        location.href = 'home_page.html?v=<%= VERSION %>';
                    }
                }
            });
        } else {
            alert('请输入密码.');
        }
    });

  /*  <!--  注册账号 -->*/
    $('.box-txt .register').click(function (e) {
        document.title = '注册(1/2)_南瓜姑娘';
        $('.login').hide();
        $('.register-pwd').slideDown();
    });

   /* <!--  忘记密码 -->*/
    $('.box-txt .forget').click(function (e) {
        document.title = '找回密码(1/2)_南瓜姑娘';
        $('.login').hide();
        $('.find-pwd').slideDown();
    });


});