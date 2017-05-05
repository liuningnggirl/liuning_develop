$(function(){
	//判断电话号码框是否有数据
	$('.tel').keyup(function(){
		saveStatusFn();
		if($(this).val() != ''){
			$('.tel_del').show();	
		}else{
			$('.tel_del').hide();	
		}
	});
	
	//判断密码框是否有数据
	$('.pwd').keyup(function(){
		saveStatusFn();
		if($(this).val() != ''){
			$('.pwd_del').show();	
		}else{
			$('.pwd_del').hide();	
		}
	});
	
	//密码显示明文
	$('.eyes').click(function(e) {
		//判断显示明文还是隐藏明文
		if($(this).attr('pwd') == 'no'){//可见
			$(this).attr('src','images/new_login_eyes.png');
			document.getElementById("pwd").type="text";
			$(this).attr('pwd','yes');
		}else{
			$(this).attr('src','images/new_login_pwd_eyes.png');
			document.getElementById("pwd").type="password";
			$(this).attr('pwd','no');		
		}
    });
	
	//清空电话号码
	$('.tel_del').click(function(e) {
        $('.tel').val('');
		$(this).hide();
		saveStatusFn();
    });
	
	//清空密码
	$('.pwd_del').click(function(e) {
        $('.pwd').val('');
		$(this).hide();
		saveStatusFn();
    });
	
	//点击注册，跳转到注册页面
	$('.lb_register').click(function(e) {
        window.location.href = "register_one.html?v=<%= VERSION %>";
    });
	
	//点击忘记密码，跳转到忘记密码页面
	$('.lb_login').click(function(e) {
        window.location.href = "forget_pwd_one.html?v=<%= VERSION %>";
    });
	
	//点击登录按钮
	$('.btn_ok').click(function(e) {
        //判断按钮是否达到可点击状态
		if($('.tel').val() != '' && $('.pwd').val() !=''){
			if (/iphone|ipad|ipod/.test(ua)) {
				_czc.push(['_trackEvent','jiaoxue','phoneType=iOS','click','btn_ok']);	
			} else if (/android/.test(ua)) {
				_czc.push(['_trackEvent','jiaoxue','phoneType=and','click','btn_ok']);
			};
			var userName = $('.tel')[0];
			var password = $('.pwd')[0];
			var data = getFinalRequestObject({phoneNum: userName.value, password: password.value});
			if(isPhoneNum(userName.value)){
				$.ajax({
					type: 'POST',
					url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/register/weixin/logon/1.5.0',
					data: data, 
					dataType: 'json',
					success: function (result) {
						if (result.code == '0') {
							localStorage.setItem('isThirdLogon',result.data.isThirdLogon);
							setAccessToken(result.data.accessToken);
							//判断是否在app内
							if(isInApp() && typeof(window.ngjsInterface) != "undefined" && typeof(window.ngjsInterface.reWriteToken) != "undefined"){
								window.ngjsInterface.reWriteToken(result.data.accessToken, result.data.imAccount, result.data.imPassword);
							}
							//如果已经设置了重定向地址,就进入重定向地址
							if (!strIsEmpty(getRedirectUrlAfterLogin())) {
								window.location.href = getRedirectUrlAfterLogin();
							}
							//如果没有设置,就返回首页
							else {
								window.location.href = "/nggirl/h5/cosmetic/index.html?v=<%= VERSION %>";
							}
						} else {
							alert(result.data.error);
						}
					}
				});
			}else{
				alert('手机号格式不正确');	
			}
		}
    });
	
	//点击叉号
	$('.box_close').click(function(e) {
		//如果已经设置了重定向地址,就进入重定向地址
		if (!strIsEmpty(getRedirectUrlAfterLogin())) {
			//window.location.href = getRedirectUrlAfterLogin();
			//我的页面
			var notLoginHref=localStorage.redirectUrlAfterLogin;
			if(notLoginHref.indexOf("mine.html") !=-1){
				window.location.href = "index.html?v=<%= VERSION %>";
			}else{
				window.location.href = getRedirectUrlAfterLogin();
			}
		}else {//如果没有设置,就回退页面
			goBack();
		} 
   });
});

//判断按钮保存状态
function saveStatusFn(){
	if($('.tel').val() != ''){
		$('.btn_ok').css('background','#51c8b4');	
	}else{
		$('.btn_ok').css('background','#b3b3b3');
		return;
	}
	if($('.pwd').val() != ''){
		$('.btn_ok').css('background','#51c8b4');	
	}else{
		$('.btn_ok').css('background','#b3b3b3');
		return;
	}
}

//验证手机号
function isPhoneNum(phoneNum){
	var reg = /^1[3|8|7|5|4]\d{9}$/;
	return reg.test(phoneNum);		
}

