$(function(){	
	//选择皮肤问题  
	$('.cq_circle').click(function(e) {
		if($(this).hasClass('cq_circle_selcted')){
			$(this).removeClass('cq_circle_selcted');
		}else{
			$(this).addClass('cq_circle_selcted');
		}
    });
	
	//选择皮肤问题
	$('.mine-message-cover-kinds').click(function(e) {
        $('.cover_question').show();
    });
	
	//点击选择皮肤问题里的确定按钮
	$('.cq_ok_btn').click(function(e) {
        $('.cover_question').hide();
    });

	//上传图片
	$('#file0').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('#img0').attr('src',data.result.data.url);
		}
	});
	
	$('#img0').click(function(e) {
		$('#file0').click();
	});
	
	//获取验证码
	$('.mine_yzm_btn').click(function(e) {
		$('.yzm').attr('yzm_tel',$('.mine-tel').val());
		//验证手机号
		if(isPhoneNum($('.mine-tel').val())){
			getYzmFn();
		}else{
			alertFn('请输入正确的手机号！');
		}
    });
	
	//获取个人资料
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl/app/cli/personalInfo/getUserInfo/3.0.0',  
		type : 'get',
		data : getFinalRequestObject({accessToken : localStorage.getItem('accessToken')}),
		dataType : 'json',  
		success : function(data){
			if(data.data.code == 0){
				//获取按钮保存状态
				saveStatusFn();
			}
			$('#img0').attr('src',data.data.profile);//头像
			$('.mine-name').val(data.data.nickName); //昵称
			if(data.data.sex == 0){//男
				$('.kuang_nan').attr('flage','on');
				$('.kuang_nv').attr('flage','off');
				$('.get_nan').show();
				$('.get_nv').hide();
			}
			if(data.data.sex == 1){//女
				$('.kuang_nan').attr('flage','off');
				$('.kuang_nv').attr('flage','on');
				$('.get_nan').hide();
				$('.get_nv').show();
			}
			if(data.data.sex == null){//null
				$('.kuang_nan').attr('flage','off');
				$('.kuang_nv').attr('flage','off');
				$('.get_nan').hide();
				$('.get_nv').hide();
			}
			$('.mine-birth').val(data.data.birthday);//出生日期
			$('.mine-tel').val(data.data.phoneNum).attr('tel',data.data.phoneNum);  //电话号码
			if(data.data.phoneNum == '' || isPhoneNum($.trim($('.mine-tel').val()))){
				$('.yzm').hide();	
			}else{
				$('.yzm').show();	
			}
			$('.num').html(data.data.addressNum);    //常用地址数量
			
			//设置日期
			var currYear = (new Date()).getFullYear();	
			var opt={};
			opt.date = {preset : 'date'};
			opt.datetime = {preset : 'datetime'};
			opt.time = {preset : 'time'};
			opt.default = {
				theme: 'android-ics light', //皮肤样式
				display: 'modal', //显示方式 
				mode: 'scroller', //日期选择模式
				dateFormat: 'yyyy-mm-dd',
				lang: 'zh',
				startYear: currYear - 50, //开始年份
				endYear: currYear + 10 //结束年份
			};
				
			$("#USER_AGE").scroller({ 
				preset: 'date',
				theme: 'android-ics light',
				display: 'modal',
				mode: 'scroller',
				dateFormat: 'yyyy-mm-dd',
				dateOrder : 'yymmdd',
				setText:'确定',
				cancelText:'取消',
				dayText:'日',
				monthText:'月', 
				yearText :'年',
			});
	
			var requestDate = $("#USER_AGE").val();
			if(requestDate != ""){
				requestDate = new Date(requestDate);
				$("#USER_AGE").scroller('setDate', requestDate, true);
			}else{
				requestDate = new Date('1991-01-01');
				$("#USER_AGE").scroller('setDate', requestDate, true);
			}
			
			//回选肤质
			$('.mine-cover-kinds option').each(function(index, element) {
                if($(this).attr('value') == data.data.skinType){
					$(this).attr('selected','selected');
				};
            });
			
			//分割皮肤问题
			var arr = data.data.skinProblem.split(' ');
			for(var x = 0; x < arr.length; x ++){
				getCoverProFn(arr[x]);	
			}
		}
	});
	
	//上传用户信息
	$('.btn-save').click(function(e) {
		if($.trim($('.mine-name').val()) != ''){
			var accessToken = localStorage.getItem('accessToken');
			var nickName = $('.mine-name').val();
			var profile = $('.true-img').attr('src');
			if($('.kuang_nv').attr('flage') == 'on'){
				sex = 1;	
			}else{
				sex = 0;	
			}
			var birthday  = $('.mine-birth').val();
			var phoneNum = $('.mine-tel').val();
			var starttime = new Date();
			var str = starttime.getFullYear()+'/'+parseInt(starttime.getMonth()+1)+'/'+starttime.getDate();
			var start = new Date(str.toLocaleString().replace("-", "/").replace("-", "/"));
			var end = new Date(birthday.replace("-", "/").replace("-", "/"));
			var skinType = $('.mine-cover-kinds option:checked').attr('value');
			var skinProblem = '';
			$('.cq_li .cq_circle').each(function(index, element) {
                if($(this).hasClass('cq_circle_selcted')){
					skinProblem += $(this).html()+' ';
				};
            });
			skinProblem = skinProblem.substring(0,skinProblem.length -1);
			if($.trim($('.mine-message-name .mine-name').val())== ''){
				alertFn('请输入姓名后再保存！');	
				$('.mine-message-name .mine-name').val('');
			}else if($('.mine-message-name .mine-name').val().length > 10){
				alertFn('姓名不得超过10个字符！');	
			}else if(end > start){
				alertFn('结束日期不能小于开始日期！');
				$('.mine-birth').val('');
			}else if($.trim($('.mine-tel').val()) == ''){
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl/app/cli/phoneUser/uploadUserInfo/3.0.0',
					type : 'post',
					data : getFinalRequestObject({accessToken : accessToken,nickName:nickName,profile:profile,sex:sex,birthday:birthday,phoneNum:phoneNum,skinType:skinType,skinProblem:skinProblem}),
					dataType : 'json',  
					success : function(data){
						if(data.code == 0){
							window.location.href = "mine.html?v=<%= VERSION %>";
						}else{
							alertFn(data.data.error);	
						}
					}
				});
			}else{
				if(isPhoneNum($.trim($('.mine-tel').val()))){
					if($('.mine-tel').val() == $('.mine-tel').attr('tel')){//手机号相等
						$('.yzm').hide();
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl/app/cli/phoneUser/uploadUserInfo/3.0.0',
							type : 'post',
							data : getFinalRequestObject({accessToken : accessToken,nickName:nickName,profile:profile,sex:sex,birthday:birthday,phoneNum:phoneNum,skinType:skinType,skinProblem:skinProblem}),
							dataType : 'json',  
							success : function(data){
								if(data.code == 0){
									window.location.href = "mine.html?v=<%= VERSION %>";
								}else{
									alertFn(data.data.error);	
								}
							}
						});
					}else if($('.mine-tel').val() != $('.mine-tel').attr('tel') && typeof($('.yzm').attr('code')) == "undefined"){
						alertFn('由于您更改了手机号，请重新验证！！');		
					}else if($('.mine-tel').val() != $('.mine-tel').attr('tel') && $('.mine-tel').val() != $('.yzm').attr('yzm_tel')){
						alertFn('由于您更改了手机号，请重新验证！！');		
					}else if($('.mine-tel').val() != $('.mine-tel').attr('tel') && $('.mine-tel').val() == $('.yzm').attr('yzm_tel')){
						//判断验证码
						if($('.yzm').attr('code') == $('.mine_yzm').val()){
							$.ajax({
								url : '<%= CLI_HOST_API_URL %>/nggirl/app/cli/phoneUser/uploadUserInfo/3.0.0',
								type : 'post',
								data : getFinalRequestObject({accessToken : accessToken,nickName:nickName,profile:profile,sex:sex,birthday:birthday,phoneNum:phoneNum,skinType:skinType,skinProblem:skinProblem}),
								dataType : 'json',  
								success : function(data){
									if(data.code == 0){
										window.location.href = "mine.html?v=<%= VERSION %>";
									}else{
										alertFn(data.data.error);	
									}
								}
							});
						}else{
							alertFn('验证码错误！！');		
						}
					}
				}else{
					$('.yzm').hide();
					alertFn('手机号不正确！！');	
				}
			}
		}
    });
	//点击常用地址
	$('.mine-message-common').click(function(e) {
		window.location.href ="addressCommonAddress.html?v=<%= VERSION %>";
    });
	
	//选中男
	$('.kuang_nan').click(function(e) {
        $(this).attr('flage','on')
		$('.get_nan').show();
		$('.kuang_nv').attr('flage','off')
		$('.get_nv').hide();
    });
	
	//选中女
	$('.kuang_nv').click(function(e) {
        $(this).attr('flage','on')
		$('.get_nv').show();
		$('.kuang_nan').attr('flage','off')
		$('.get_nan').hide();
    });
	
	//输入昵称时判断按钮保存状态
	$('.mine-name').keyup(function(e) {
        saveStatusFn();
    });
	
	//判断是否显示验证手机号
	$('.mine-tel').keyup(function(){
		if(isPhoneNum($.trim($('.mine-tel').val())) && $('.mine-tel').attr('tel') != $.trim($('.mine-tel').val())){
			$('.yzm').show();
		}else{
			$('.yzm').hide();
		}
	})
});

//验证手机号
function isPhoneNum(phoneNum){
	var reg = /^1[3|8|7|5|4]\d{9}$/;
	return reg.test(phoneNum);		
}


//判断按钮保存状态
function saveStatusFn(){
	if($.trim($('.mine-name').val()) != ''){
		$('.btn-save').css('background','#51c8b4');	
		$('.footer').css('background','#51c8b4');	
	}else{
		$('.btn-save').css('background','#b3b3b3');
		$('.footer').css('background','#b3b3b3');
		return;
	}
}

//获取验证码
function getYzmFn(){
	$('.mine_yzm_btn').unbind();
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/phoneUser/getPhoneCode/2.3.0',getFinalRequestObject({phoneNum:$('.mine-tel').val()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			var SysSecond;
			var InterValObj;
			$(document).ready(function () {
				SysSecond = parseInt(60); //这里获取倒计时的起始时间
				InterValObj = window.setInterval(SetRemainTime, 1000); //间隔函数，1秒执行
			});
			$('.yzm').attr('code',data.data.code);
			$('.mine_yzm_btn').css({'color':'#9a9a9a','border':'1px solid #9a9a9a'});
			//将时间减去1秒，计算天、时、分、秒
			function SetRemainTime() {
				if (SysSecond > 0) {
					SysSecond = SysSecond - 1;
					var second = Math.floor(SysSecond % 60);             // 计算秒
					var minite = Math.floor((SysSecond / 60) % 60);      //计算分
					var hour = Math.floor((SysSecond / 3600) % 24);      //计算小时
					var day = Math.floor((SysSecond / 3600) / 24);        //计算天
					if (day > 0) {
						$(".mine_yzm_btn").html(second + '秒');
					} else {
						$(".mine_yzm_btn").html(second + '秒');
					}
				} else {//剩余时间小于或等于0的时候，就停止间隔函数
					window.clearInterval(InterValObj);
					//这里可以添加倒计时时间为0后需要执行的事件
					$(".mine_yzm_btn").html('请重新获取');
					$('.mine_yzm_btn').bind('click',getYzmFn);
					$('.mine_yzm_btn').css({'color':'#50c8b4','border':'1px solid #50c8b4'});
				}
			}
		}else{
			alertFn(data.data.error);	
		}
	});
}

//获取皮肤问题
function getCoverProFn(arr){
	$('.cq_li .cq_circle').each(function(index, element) {
		if($(this).html() == arr){
			$(this).addClass('cq_circle_selcted');
		};
	});
	return;
}


