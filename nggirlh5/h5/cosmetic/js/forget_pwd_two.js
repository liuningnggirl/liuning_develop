$(function(){	
	//清空验证码
	$('.del_yzm').click(function(e) {
        $('.yzm').val('');
		$(this).hide();
		saveStatusFn();
    });
	
	//判断验证码框是否有数据
	$('.yzm').keyup(function(){
		saveStatusFn();
		if($(this).val() != ''){
			$('.del_yzm').show();	
		}else{
			$('.del_yzm').hide();	
		}
	});
	
	//点击返回箭头，返回到注册（1/2）页面
	$('.box_return').click(function(e) {
        window.location.href="forget_pwd_one.html?tel="+getParam('tel')+'&yzm='+getParam('yzm')+'&v=<%= VERSION %>';
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
	
	//修改密码完成按钮
	$('.yz_btn').click(function(e) {
        if($.trim($('.yzm').val()).length > 5){
			$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/phoneUser/updatePasswordForgot',getFinalRequestObject({phoneNum:localStorage.getItem("register_tel"),newPassword:$.trim($('.yzm')[0].value),code:localStorage.getItem("register_yzm")}),function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					setAccessToken(data.data.accessToken);
					location.href = 'index.html?v=<%= VERSION %>';
				}else{
					alert(data.data.error);	
				}
			});	
		}
    });
});

//判断按钮保存状态
function saveStatusFn(){
	if($.trim($('.yzm').val()).length > 5){
		$('.yz_btn').css('background','#51c8b4');	
	}else{
		$('.yz_btn').css('background','#b3b3b3');
		return;
	}
}
