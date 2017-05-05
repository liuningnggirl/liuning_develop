$(function(){
	//旧密码显示明文
	$('.eyes_one').click(function(e) {
		//判断显示明文还是隐藏明文
		if($(this).attr('pwd_one') == 'no'){//可见
			$(this).attr('src','images/new_login_eyes.png');
			document.getElementById("pwd_one").type="text";
			$(this).attr('pwd_one','yes');
		}else{
			$(this).attr('src','images/new_login_pwd_eyes.png');
			document.getElementById("pwd_one").type="password";
			$(this).attr('pwd_one','no');		
		}
    });
	
	//新密码显示明文
	$('.eyes_two').click(function(e) {
		//判断显示明文还是隐藏明文
		if($(this).attr('pwd_two') == 'no'){//可见
			$(this).attr('src','images/new_login_eyes.png');
			document.getElementById("pwd_two").type="text";
			$(this).attr('pwd_two','yes');
		}else{
			$(this).attr('src','images/new_login_pwd_eyes.png');
			document.getElementById("pwd_two").type="password";
			$(this).attr('pwd_two','no');		
		}
    });
	
	//删除旧密码
	$('.del_one').click(function(e) {
        $('.pwd_one').val('');
		saveStatusFn();
    });
	
	//删除新密码
	$('.del_two').click(function(e) {
        $('.pwd_two').val('');
		saveStatusFn();
    });
	
	//旧密码输入
	$('.pwd_one').keyup(function(e) {
		saveStatusFn();
		if($(this).val() != ''){
			$('.del_one').show();	
		}else{
			$('.del_one').hide();	
		}
    });
	
	//新密码输入
	$('.pwd_two').keyup(function(e) {
		saveStatusFn();
		if($(this).val() != ''){
			$('.del_two').show();	
		}else{
			$('.del_two').hide();	
		}
    });
	
	//点击完成按钮
	$('.ok_btn').click(function(e) {
        if($.trim($('.pwd_one').val()) != '' && $.trim($('.pwd_two').val().length) > 5){
			$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/personalInfo/resetPassword',getFinalRequestObject({accessToken:getAccessToken(),oldPassword:$('.pwd_one')[0].value,newPassword:$('.pwd_two')[0].value}),function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					alert('新密码设置成功，请重新登录');
					window.location.href = "login_new.html?v=<%= VERSION %>";
				}else{
					alert(data.data.error);	
				}
			});	
		}
    });
});


//判断按钮保存状态
function saveStatusFn(){
	if($.trim($('.pwd_one').val()) != ''){
		$('.ok_btn').css('background','#51c8b4');	
	}else{
		$('.ok_btn').css('background','#b3b3b3');
		return;
	}
	if($.trim($('.pwd_two').val().length) > 5){
		$('.ok_btn').css('background','#51c8b4');	
	}else{
		$('.ok_btn').css('background','#b3b3b3');
		return;
	}
}
