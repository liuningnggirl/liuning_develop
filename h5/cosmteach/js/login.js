		$(function(){
			var preWindow = document.referrer
			
			//登录按钮
			$('.login-btn').click(function(e){
				if (/iphone|ipad|ipod/.test(ua)) {
					_czc.push(['_trackEvent','jiaoxue','phoneType=iOS','click','login-btn']);   
				} else if (/android/.test(ua)) {
					 _czc.push(['_trackEvent','jiaoxue','phoneType=and','click','login-btn']);
				};	
				
				var userName = $('.user-name')[0];
				var password = $('.user-key')[0];
				var data = getFinalRequestObject({phoneNum:userName.value, password:password.value});
				$.ajax({
					type:'POST',
					url:'/nggirl/app/cli/phoneUser/logon',
					data:data,
					success:function(result){
						result = $.parseJSON(result);
						if(result.code == '0'){
							//$.cookie("accessToken", result.data.accessToken); 
							localStorage.accessToken = result.data.accessToken;
							history.go(-1);
						}else{
							alert(result.data.error);
						}
					}
				});
			});

			$(".box-txt .user-name").focus();
			//验证结果
	        var checkLogin = function(){
	        	var errorMsg = '';
	             //验证用户名
	             if($('.user-name').value==""){
	                errorMsg = '请输入用户名.';
	             }
	             //验证密码
	             if( $('.user-key').value==""){
	                errorMsg = '请输入密码.';
	             }
	             
	             return errorMsg;
	        };

	//忘记密码1-->获取验证码
			var yzmFCanClick = true;
			$('.find-pwd .yzm').click(function(e) {
				if(yzmFCanClick){
					if($('.find-pwd .fp-name').val() == null || $('.find-pwd .fp-name').val() == ''){
						alert('请输入手机号');	
					}else{
						yzmFCanClick = false;

						//请求后台发送验证码
						var phoneNum = $(this).siblings('.fp-name')[0].value;
						var data = getFinalRequestObject({phoneNum:phoneNum});
						$.ajax({
							type:'GET',
							url:'/nggirl/app/cli/phoneUser/getCodeForgot',
							data:data,
							success:function(result){
								result = $.parseJSON(result);
								if(result.code == '1'){
									alert(result.data.error);
									$("#remainTime").html('获取验证码');
									yzmFCanClick = true;
									return;
								}else{
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
												$("#remainTime").html(second+'秒');
											} else {
												$("#remainTime").html(second+'秒');
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
			var checkedPhoneNum,checkedYzm;
			$('.find-pwd .btn-yz').click(function(e){

					if($('.find-pwd .fp-key') != null && $('.find-pwd .fp-key')[0].value != ''){
						var yzm =  $('.find-pwd .fp-key')[0].value;
						var phoneNum = $('.find-pwd .fp-name')[0].value;
						var data = getFinalRequestObject({phoneNum:phoneNum, code:yzm});
						$.ajax({
							type:'POST',
							url:'/nggirl/app/cli/phoneUser/checkRegisterCode',
							data:data,
							success:function(result){
								result = $.parseJSON(result);
								if(result.code == '1'){
									alert('验证码无效.');
								}else{
									checkedPhoneNum = phoneNum;
									checkedYzm = yzm;
									document.title='找回密码(2/2)_南瓜姑娘';
									$('.reset-pwd .num').html(checkedPhoneNum);
	            					$('.find-pwd').hide();
									$('.reset-pwd').slideDown();
								}
							}
						});
					}else{
						alert('请输入验证码');
					}
			});

	//忘记密码2-->确定
			$('.reset-pwd .btn-ok').click(function(e){
				if (/iphone|ipad|ipod/.test(ua)) {
					_czc.push(['_trackEvent','login','phoneType=iOS','click','reset-ps-btn']);   
				} else if (/android/.test(ua)) {
					 _czc.push(['_trackEvent','login','phoneType=and','click','reset-ps-btn']);
				};
				
					if($('.reset-pwd .rp-name') != null && $('.reset-pwd .rp-name')[0].value != ''){
						var secretNew =  $('.reset-pwd .rp-name')[0].value;
						var secretAgain = $('.reset-pwd .rp-key')[0].value;

						if(secretNew != secretAgain){
							alert('两次输入的密码不一致.');
							return;
						}
						var data = getFinalRequestObject({phoneNum:checkedPhoneNum, code:checkedYzm,newPassword:secretNew});
						$.ajax({
							type:'POST',
							url:'/nggirl/app/cli/phoneUser/updatePasswordForgot',
							data:data,
							success:function(result){
								result = $.parseJSON(result);
								if(result.code == '1'){
									alert(result.data.error);
								}else{
									//$.cookie("accessToken", result.data.accessToken); 
									localStorage.accessToken = result.data.accessToken;
									location.href = 'teaching-page.html?v=<%= VERSION %>'; 
								}
							}
						});
					}
			});

	//注册1-->验证
			var yzmRCanClick = true;
			$('.register-pwd .yzm').click(function(e) {
				if(yzmRCanClick){
		            if($('.register-pwd .fp-name').val() == null || $('.register-pwd .fp-name').val() == ''){
						alert('请输入手机号');	
					}else{
						yzmRCanClick = false;

						
						//请求后台发送验证码
						var phoneNum = $(this).siblings('.fp-name')[0].value;
						var data = getFinalRequestObject({phoneNum:phoneNum});
						$.ajax({
							type:'GET',
							url:'/nggirl/app/cli/phoneUser/getCode',
							data:data,
							success:function(result){
								result = $.parseJSON(result);
								if(result.code == '1'){
									alert(result.data.error);
									$("#remainTime01").html('获取验证码');
									yzmRCanClick = true;
									return;
								}else{
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
												$("#remainTime01").html(second+'秒');
											} else {
												$("#remainTime01").html(second+'秒');
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
			var checkedPhoneNum,checkedYzm;
			$('.register-pwd .btn-yz').click(function(e){

					if($('.register-pwd .fp-key') != null && $('.register-pwd .fp-key')[0].value != ''){
						var yzm =  $('.register-pwd .fp-key')[0].value;
						var phoneNum = $('.register-pwd .fp-name')[0].value;
						var data = getFinalRequestObject({phoneNum:phoneNum, code:yzm});
						$.ajax({
							type:'POST',
							url:'/nggirl/app/cli/phoneUser/checkRegisterCode',
							data:data,
							success:function(result){
								result = $.parseJSON(result);
								if(result.code == '1'){
									alert('验证码无效.');
								}else{
									checkedPhoneNum = phoneNum;
									checkedYzm = yzm;
									document.title='注册(2/2)_南瓜姑娘';
									$('.register-success .num').html(checkedPhoneNum);
						            $('.register-pwd').hide();
						            $('.register-success').slideDown();
								}
							}
						});
					}else{
						alert('请输入验证码');
					}
			});
	//注册2-->立即注册
			$('.register-success .btn-ok').click(function(e){
				if (/iphone|ipad|ipod/.test(ua)) {
					_czc.push(['_trackEvent','register','phoneType=iOS','click','rigist']);   
				} else if (/android/.test(ua)) {
					 _czc.push(['_trackEvent','register','phoneType=and','click','rigist']);
				};
				
					if($('.register-success .rp-name') != null && $('.register-success .rp-name')[0].value != ''){
						var secretNew =  $('.register-success .rp-name')[0].value;
						var secretAgain = $('.register-success .rp-key')[0].value;

						if(secretNew != secretAgain){
							alert('两次输入的密码不一致.');
							return;
						}
						var data = getFinalRequestObject({phoneNum:checkedPhoneNum, code:checkedYzm,password:secretNew});
						$.ajax({
							type:'POST',
							url:'/nggirl/app/cli/phoneUser/create',
							data:data,
							success:function(result){
								result = $.parseJSON(result);
								if(result.code == '1'){
									alert(result.data.error);
								}else{
//									$.cookie("accessToken", result.data.accessToken);
									localStorage.accessToken = result.data.accessToken;
									location.href = 'teaching-page.html?v=<%= VERSION %>'; 
								}
							}
						});
					}else{
						alert('请输入密码.');
					}
			});
			

	/*<!--  注册账号 -->*/
			$('.box-txt .register').click(function(e) {
				document.title='注册(1/2)_南瓜姑娘';
				$('.login').hide();
	            $('.register-pwd').slideDown(); 
	        });
			
	/*<!--  注册成功-->绑定密码 -->*/
			$('.register-pwd .btn-yz').click(function(e) {
				document.title='注册(2/2)_南瓜姑娘';
	            $('.register-pwd').hide();
	            $('.register-success').slideDown();
	        });	
			
	/*<!--  忘记密码 -->*/
			$('.box-txt .forget').click(function(e) {
				document.title='找回密码(1/2)_南瓜姑娘';
	            $('.login').hide();
	            $('.find-pwd').slideDown(); 
	        });
			

			
		});