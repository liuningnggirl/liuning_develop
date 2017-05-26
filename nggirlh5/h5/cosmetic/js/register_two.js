$(function(){
	//清空电话号码
	$('.del_tel').click(function(e) {
        $('.tel').val('');
		$(this).hide();
		saveStatusFn();
    });
	
	//清空验证码
	$('.del_yzm').click(function(e) {
        $('.yzm').val('');
		$(this).hide();
		saveStatusFn();
    });
	
	//判断电话号码框是否有数据
	$('.tel').keyup(function(){
		saveStatusFn();
		if($(this).val() != ''){
			$('.del_tel').show();	
		}else{
			$('.del_tel').hide();	
		}
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
        window.location.href="register_one.html?tel="+getParam('tel')+'&yzm='+getParam('yzm')+'&v=<%= VERSION %>';
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
	
	//上传头像
	$('#file0').fileupload({
			dataType: 'json',
			done: function (e, data) {
				if(data.result.code == 0){
					$('.user_img').attr('src',data.result.data.url);
				}else{
					alert(data.result.data.error);
				}
			}
		});
	
	$('.user_img').click(function(e) {
		$('#file0').click();
	});
	
	//完成注册
	$('.yz_btn').click(function(e) {
		var profile = '';
		if($('.user_img').attr('src') == 'images/login_new_2.4.0_lno_useImg.png'){
			profile ='';
		}else{
			profile =$('.user_img').attr('src');	
		}
		if($.trim($('.tel').val()) !='' && $.trim($('.yzm').val().length) > 5 ){
			var data = getFinalRequestObject({phoneNum:localStorage.getItem("register_tel"), code: localStorage.getItem("register_yzm"), password: $('.yzm')[0].value,profile:profile,nickName:$('.tel').val()});
			$.ajax({
				type: 'POST',
				url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/phoneUser/create/2.1.0',
				data: data,
				success: function (result) {
					result = $.parseJSON(result);
					if (result.code == '1') {
						alert(result.data.error);
					} else {
						if (/iphone|ipad|ipod/.test(ua)) {
							_czc.push(['_trackEvent','nggirl_regist_success','phoneType=iOS','用户注册成功时','true','']);	
						} else if (/android/.test(ua)) {
							_czc.push(['_trackEvent','nggirl_regist_success','phoneType=and','用户注册成功时','true','']);
						};
						setAccessToken(result.data.accessToken);
						location.href = 'index.html?v=<%= VERSION %>';
					}
				}
			});
		}
    });
});

//判断按钮保存状态
function saveStatusFn(){
	if($.trim($('.tel').val())!= ''){
		$('.yz_btn').css('background','#51c8b4');	
	}else{
		$('.yz_btn').css('background','#b3b3b3');
		return;
	}
	if($.trim($('.yzm').val().length)> 5){
		$('.yz_btn').css('background','#51c8b4');	
	}else{
		$('.yz_btn').css('background','#b3b3b3');
		return;
	}
}
