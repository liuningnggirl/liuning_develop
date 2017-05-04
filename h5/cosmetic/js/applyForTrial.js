$(function(){
	var skinType = '干性';
	//窗体改变时判断当前窗体宽度
	window.onresize = function(){
		adaFn();
	}
	adaFn();
	//按钮保存状态
	saveStatusFn();
	
	/*getApplyHistory();*/
	
	//选择女
	$('.ar_nv').click(function(e) {
        $(this).attr('sel','on');
		$('.ar_nan').attr('sel','off');
		$(this).children('img').attr('src','images/applyForTrail_no_selected.png');
		$('.ar_nan img').attr('src','images/applyForTrail_no_select.png');
    });
	
	//选择男
	$('.ar_nan').click(function(e) {
        $(this).attr('sel','on');
		$('.ar_nv').attr('sel','off');
		$(this).children('img').attr('src','images/applyForTrail_no_selected.png');
		$('.ar_nv img').attr('src','images/applyForTrail_no_select.png');
    });
	
	//选择不同的肤质
	$('.skin_type>span').click(function(e) {
        $(this).addClass('blue').siblings().removeClass('blue');
		skinType = $(this).html();
    });
	
	//输入姓名
	$('.an_name_input').keyup(function(e) {
        saveStatusFn();
    });
	
	//输入电话
	$('.an_tel_input').keyup(function(e) {
        saveStatusFn();
    });
	
	//输入微信
	$('.an_weixin_input').keyup(function(e) {
        saveStatusFn();
    });
	
	//输入收货地址
	$('.apd').keyup(function(e) {
        saveStatusFn();
    });
	//获取焦点时隐藏底部按钮
	$('.apd,.liuyan').live('focus',function(e) {
        $(".btn_submit").css('position','relative');
		$("body").css("margin-bottom","0");
    });
	$('.apd,.liuyan').live('blur',function(e) {
        $(".btn_submit").css('position','fixed');
		$("body").css("margin-bottom","62px");
    });
	$(".apd").live('keydown',function(){
		if($(this).text()== "为了您能够收到试用妆品，请填写详细地址"){
			$(this).text("");
			$(this).html('').css('color','#4c4c4c');
		}
		saveStatusFn();
	});
	
	$(".apd").live('afterpaste',function(){
		if($(this).text()== "为了您能够收到试用妆品，请填写详细地址"){
			$(this).text("");
			$(this).html('').css('color','#4c4c4c');
		}
		saveStatusFn();
	});
	
	//当申请留言获得光标
	$('.liuyan').live('keydown',function(e) {
		$(this).focus();
		if($(this).text()== "申请的留言内容更精彩，获得试用资格的机会更大哦~"){
			$(this).text("");
			$(this).html('').css('color','#4c4c4c');
		}
		if($(this).html() == "申请的留言内容更精彩，<br>获得试用资格的机会更大哦~"){
			$(this).html('').css('color','#4c4c4c');
		}
    });
	
	//当申请留言获得光标
	$('.liuyan').live('afterpaste',function(e) {
		$(this).focus();
		if($(this).text()== "申请的留言内容更精彩，获得试用资格的机会更大哦~"){
			$(this).text("");
			$(this).html('').css('color','#4c4c4c');
		}
		if($(this).html() == '申请的留言内容更精彩，<br>获得试用资格的机会更大哦~'){
			$(this).html('').css('color','#4c4c4c');
		}
		saveStatusFn();
    });
	
	//点击提交申请按钮
	$('.btn_submit').click(function(e) {
		if($.trim($('.an_name_input').val()) == ''){
			alertFn('小南瓜还不知道你叫啥类~');	
		}else if($.trim($('.an_tel_input').val()) == ''){
			alertFn('能告诉小南瓜你的电话吗^_^');
		}else if($.trim($('.an_weixin_input').val()) == ''){
			alertFn('能加个微信就最好不过啦O(∩_∩)O~~');
		}else if($('.apd').html() == '为了您能够收到试用妆品，请填写详细地址'){
			alertFn('小南瓜有小礼物寄给你要告诉我地址哦~');
		}else{
			$('.gray_btn_double').show();
			$('.integral_window').css('margin-top',($(window).height() - $('.integral_window').height())/2);
			$('body').css('overflow','hidden');
		}
    });

	//点击申请成功返回首页
	$('.return_details').click(function(e) {
       $('.apply_for_success,.apply_for_trial').hide();
	   $('.part1').show();
	   getDetailStatus();
	   getApplyList();
	   getAllMessage();
    });
	
	//点击详情返回首页
	$('.return_details_ok').click(function(e) {
       $('.apply_for_details,.apply_for_trial').hide();
	   $('.part1').show();
	   getDetailStatus();
	   getApplyList();
	   getAllMessage();
    });
	
	//点击返回申请详情
	$('.return_applay_details').click(function(e) {
		$('.apply_for_success').hide();
		$('.apply_for_details').show();
		//获取申请状态
		$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/cosmetic/getCosmeticTrialDetail/2.1.0',getFinalRequestObject({cosmeticId:getParamHack('cosmeticId'),accessToken: getAccessToken(),}),function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				//申请时间
				$('.time').html(data.data.applyTime);
				//判断申请状态
				
				//试用妆品图
				$('.apply_for_details .cover').height($('.apply_for_details .cover').width() /2);
				$('.apply_for_details .cover').attr('src',data.data.cosmeticImg);
				
				//试用妆品名称
				$('.apply_for_details .bc_content').html(data.data.name);
				if(data.data.cosmeticStatus == 0 && data.data.applyStatus == 1){//申请中
					$('.bc_status').html('申请审核中，请耐心等待！');
					$('.apply_status').html('申请中');
				}
				if(data.data.cosmeticStatus == 2 || data.data.cosmeticStatus == 3 && data.data.applyStatus == 1 && data.data.applyResult == 0){//申请失败
					$('.bc_status').html('好可惜哦，下次继续努力~');
					$('.apply_status').html('申请失败');
				}
				if(data.data.cosmeticStatus == 2 || data.data.cosmeticStatus == 3 && data.data.applyStatus == 1 && data.data.applyResult == 1){//申请成功
					$('.bc_status').html('恭喜您，申请成功，可免费领取试用！');
					$('.apply_status').html('申请成功');
				}
			}else{
				alert(data.data.error);	
			}
		});
    });
	
	//当申请留言获得光标
	$('.liuyan').click(function(e) {
		$(this).focus();
		if($(this).html() == '申请的留言内容更精彩，<br>获得试用资格的机会更大哦~'){
			$(this).html('').css('color','#4c4c4c');
		}
    });
	
	//当申请留言失去光标
	$('.liuyan').blur(function(e) {
		if($(this).html() == ''){
			$(this).html('申请的留言内容更精彩，<br>获得试用资格的机会更大哦~').css('color','#A9A9A9');
		}
    });
	
	//当地址获得光标
	$('#address').click(function(e) {
		$(this).focus();
		if($(this).html() == '为了您能够收到试用妆品，请填写详细地址'){
			$(this).html('').css('color','#4c4c4c');;
		}
    });
	
	//当地址失去光标
	$('#address').blur(function(e) {
		if($(this).html() == ''){
			$(this).html('为了您能够收到试用妆品，请填写详细地址').css('color','#A9A9A9');
		}
    });
	
	//点击取消
	$('.btn_left').click(function(e) {
        $('.gray_btn_double').hide();
		$('body').css('overflow','auto');
    });
	
	//点击确认
	$('.btn_right').click(function(e) {
        //$('.gray_btn_double').hide();
		//$('body').css('overflow','auto');
		
		if($.trim($('.an_name_input').val()) != '' && $.trim($('.an_tel_input').val()) != '' && $.trim($('.an_weixin_input').val()) != '' && $('.apd').html() != '为了您能够收到试用妆品，请填写详细地址' && $.trim($(".apd").text())!=""){
			//性别
			var sex = '';
			if($('.ar_nv').attr('sel') == 'on'){
				sex = 1;
			}else{
				sex = 0;	
			}
			
			//留言
			var message = '';
			if($('.liuyan').html() == '申请的留言内容更精彩，<br>获得试用资格的机会更大哦~' || $.trim($(".liuyan").text()) == ''){
				message = '南瓜家福利好赞！求抽中！';
			}else{
				message = $('.liuyan').text();
			}
			
			//地址
			var address = $('#address').text();
			var genData = {
				cosmeticId:getParamHack('cosmeticId'),
				accessToken: getAccessToken(),
				realName:$.trim($('.an_name_input').val()),
				sex:sex,
				age:$.trim($('.an_age_input').val()),
				phoneNum:$.trim($('.an_tel_input').val()),
				wechat:$.trim($('.an_weixin_input').val()),
				skinType:skinType,
				address:address,
				message:message
			};
			//验证手机号
			if(isPhoneNum($.trim($('.an_tel_input').val()))){
				$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/cosmetic/commitApply/2.1.0',getFinalRequestObject(genData),function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						$('.apply_for_trial,.gray_btn_double').hide();
						$('.apply_for_success').show();
						//申请时间
						$('.apply_for_success .time').html(data.data.applyTime);
						//试用妆品图
						$('.apply_for_success .cover').height($('.cover').width() /2);
						$('.apply_for_success .cover').attr('src',data.data.cosmeticImg);
						$('.apply_for_success .bc_content').html(data.data.name);
					}else{
						$('.gray_btn_double').hide();
						$('body').css('overflow','auto');
						$('.gray_btn_double').hide();
						alertFn(data.data.error);	
					}
				});
			}else{
				$('.gray_btn_double').hide();
				$('body').css('overflow','auto');
				$('.gray_btn_double').hide();
				alertFn('哎呦，手机号写错啦~~！');	
			}
		}
		
    });
});

//适配常用手机
function adaFn(){
	if($(window).width() == '375'){
		$('.skin_type span').css('padding','0px 3.87%');	
	}
	if($(window).width() == '414'){
		$('.skin_type span').css('padding','0 4.46%');	
	}	
	if($(window).width() == '320'){
		$('.skin_type span').css('padding','0 2.75%');	
	}	
}

//判断按钮状态
function saveStatusFn(){
	var canSubmit = true;
	if($.trim($('.an_name_input').val()) == ''){
		canSubmit = false;
	}
	if($.trim($('.an_tel_input').val()) == ''){
		canSubmit = false;	
	}
	if($.trim($('.an_weixin_input').val()) == ''){
		canSubmit = false;	
	}
	if($.trim($('.apd').html()) == '为了您能够收到试用妆品，请填写详细地址' || $.trim($(".apd").text())==""){
		canSubmit = false;		
	}
	
	if(canSubmit == true){
		$('.btn_submit').css('background','#51c8b4');
	}else{
		$('.btn_submit').css('background','#b3b3b3');
	}
}

//验证手机号
function isPhoneNum(phoneNum){
	var reg = /^1[3|8|7|5|4]\d{9}$/;
	return reg.test(phoneNum);		
}

function getApplyHistory(){
	//判断是否为第一次申请
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/cosmetic/getCosmeticTrialUserInfo/2.4.0',getFinalRequestObject({accessToken:getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			//判断是否为第一次申请
			if(data.data.isFirstApply == 0){//否
				$('.an_name_input').val(data.data.realName);
				if(data.data.sex == 0){
					$('.as_right .ar_nan').attr('sel','on');
					$('.as_right .ar_nv').attr('sel','off');
				}
				if(data.data.sex == 1){
					$('.as_right .ar_nan').attr('sel','off');
					$('.as_right .ar_nv').attr('sel','on');
				}
				$('.an_age_input').val(data.data.age);
				$('.an_tel_input').val(data.data.phoneNum);
				$('.an_weixin_input').val(data.data.wechat);
				$('#address').text(data.data.address).css('color','#3a3a3a');
				$('.skin_type span').each(function(index, element) {
					if($(this).html() == data.data.skinType){
						$(this).addClass('blue').siblings().removeClass('blue');
					}
				});
				$('.apply_for_trial .btn_submit').css('background','#51c8b4');
			}
		}else{
			alertFn(data.data.error);	
		}
	});
}

