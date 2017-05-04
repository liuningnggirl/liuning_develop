$(function(){
	//获取弹窗高度
	$('.gray_box').height($(window).height());
	
	//弹框位置
	$('.alert_box').css('margin-top',($(window).height() -130)/2+'px');
	
	$('.tel').val(getParam('tel'));
	$('.yzm').val(getParam('yzm'));
	saveStatusFn();
	$('.box_p').css('margin-top',$(window).height() - 340);
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
	
	//点击返回箭头，返回到登录页面
	$('.box_return').click(function(e) {
        window.location.href="login_new.html?v=<%= VERSION %>";
    });
	
	//查看用户服务条款
	$('.box_p a').click(function(e) {
        window.location.href = "<%= CLI_HOST_API_URL %>/nggirl/h5/mobile/terms_of_service.html?v=<%= VERSION %>";
    });
	
	//获取验证码
	$('.get_yzm').click(function(e) {
		//验证手机号
		if(isPhoneNum($('.tel')[0].value)){
			getYzmFn();
		}else{
			alert('请输入正确的手机号！');
		}
    });
	
	//注册验证手机号
	$('.yz_btn').click(function(e) {
        if($.trim($('.tel').val()) != '' && $.trim($('.yzm').val()) !=''){
			var yzm = $('.yzm')[0].value;
			var phoneNum = $('.tel')[0].value;
			var data = getFinalRequestObject({phoneNum: phoneNum, code: yzm});
			$.ajax({
				type: 'POST',
				url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/phoneUser/checkRegisterCode',
				data: data,
				success: function (result) {
					result = $.parseJSON(result);
					if (result.code == '1') {
						alert(result.data);
					} else {
						checkedPhoneNum = phoneNum;
						checkedYzm = yzm;
						document.title = '注册(2/2)_南瓜姑娘';
						window.location.href="register_two.html?tel="+$('.tel')[0].value +'&yzm='+ $('.yzm')[0].value+'&v=<%= VERSION %>';
						//存储验证码以及手机号
						localStorage.clear();
						localStorage.setItem("register_yzm", checkedYzm);
						localStorage.setItem("register_tel", checkedPhoneNum);
					}
				}
			});
		}
    });
	
	//关闭弹框
	$('.gray_box,.btn_cancle,.btn_forget_pwd').click(function(e) {
        $('.gray_box').hide();
    });
	
	//点击忘记密码
	$('.btn_forget_pwd').click(function(e) {
        window.location.href = 'forget_pwd_one.html?v=<%= VERSION %>';
    });
});

//判断按钮保存状态
function saveStatusFn(){
	if($('.tel').val() != ''){
		$('.yz_btn').css('background','#51c8b4');	
	}else{
		$('.yz_btn').css('background','#b3b3b3');
		return;
	}
	if($('.yzm').val() != ''){
		$('.yz_btn').css('background','#51c8b4');	
	}else{
		$('.yz_btn').css('background','#b3b3b3');
		return;
	}
}

//获取验证码
function getYzmFn(){
	$('.get_yzm').unbind();
	var phoneNum = $.trim($('.tel')[0].value);
	var data = getFinalRequestObject({phoneNum: phoneNum});
	$.ajax({
		type: 'GET',
		url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/phoneUser/getCode',
		data: data,
		success: function (result) {
			result = $.parseJSON(result);
			if (result.code == '1') {
				$('.gray_box').show();
				$(".get_yzm").html('获取验证码');
				$('.get_yzm').css({'color':'#50c8b4','border':'1px solid #50c8b4'});
				$('.get_yzm').bind('click',getYzmFn);
			}else{
				var SysSecond;
				var InterValObj;
				$(document).ready(function () {
					SysSecond = parseInt(60); //这里获取倒计时的起始时间
					InterValObj = window.setInterval(SetRemainTime, 1000); //间隔函数，1秒执行
				});
				$('.get_yzm').css({'color':'#9a9a9a','border':'1px solid #9a9a9a'});
				//将时间减去1秒，计算天、时、分、秒
				function SetRemainTime() {
					if (SysSecond > 0) {
						SysSecond = SysSecond - 1;
						var second = Math.floor(SysSecond % 60);             // 计算秒
						var minite = Math.floor((SysSecond / 60) % 60);      //计算分
						var hour = Math.floor((SysSecond / 3600) % 24);      //计算小时
						var day = Math.floor((SysSecond / 3600) / 24);        //计算天
						if (day > 0) {
							$(".get_yzm").html(second + '秒');
						} else {
							$(".get_yzm").html(second + '秒');
						}
					} else {//剩余时间小于或等于0的时候，就停止间隔函数
						window.clearInterval(InterValObj);
						//这里可以添加倒计时时间为0后需要执行的事件
						$(".get_yzm").html('请重新获取');
						$('.get_yzm').bind('click',getYzmFn);
						$('.get_yzm').css({'color':'#50c8b4','border':'1px solid #50c8b4'});
					}
				}
			}
		}
	});
}

//验证手机号
function isPhoneNum(phoneNum){
	var reg = /^1[3|8|7|5|4]\d{9}$/;
	return reg.test(phoneNum);		
}

