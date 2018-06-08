var oneSelectedBizareaArray = '';
var allBizareaArray = '';
$(function(){	
	if($.inArray(getParam('selectedBizarea') ,localStorage.getItem('workDetails_bizarea').split('、')) < 0 && getParam('areaId') ==-1){//判断用户选择的服务地址是否在商圈范围内
		$('.alert-window').show();
	}else{
		$('.alert-window').hide();
	}

	//获取弹窗高度
	$('.alert-window').height($(window).height());
	$('.gray_box_load').height($(window).height());
	
	//获取验证码
	$('.mine_yzm_btn').click(function(e) {
		$('.yzm').attr('yzm_tel',$('#phoneNum').val());
		//验证手机号
		if(isPhoneNum($('#phoneNum').val())){
			getYzmFn();
		}else{
			alertFn('请输入正确的手机');
		}
    });
	
	//获取选择的服务地址
	if(getParam('reservationAddress') == ""){
		$('.detail').html('请选择服务地址');
	}else{
		$('.detail').html(getParam('reservationAddress'));
	}
	
	oneSelectedBizareaArray = getParam('selectedBizarea');//获取从服务地址页面带回来的已选中的商圈名称
	allBizareaArray = localStorage.getItem('workDetails_bizarea').split('、');//获取所有商圈
		
	var remoteurl = '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/getWorksDetailIos/1.5.0';
	// 从地址栏中取得
	var dresserId = localStorage.getItem('dresserId');
	var coursetypeId = getParam('coursetypeId');
	var workType = getParam('workType');
	var price = getParam('price');
	var data = getFinalRequestObject({dresserId:dresserId});
	$('.right option:selected').html(localStorage.getItem('time'));
	$('#USER_AGE').val(localStorage.getItem('date'));
	
	var re=new RegExp("[\\-,\\:, ]","g");
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/getReservationTimes/1.3.2',  
		type : 'get',
		data : getFinalRequestObject({accessToken:getAccessToken(),dresserId:localStorage.getItem('dresserId')}),
		dataType : 'json',  
		success : function(data){
			if(data.code == 0){	
				for(var x = 0 ; x <data.data.length; x ++){
					//判断日期是哪天
					if(data.data[x].realDate == $('.resdateselect .ot-data').val().replace(re, "")){
						for(var timeIndex in data.data[x].reservationTimes){
							//判断预约状态
							if(data.data[x].reservationTimes[timeIndex].status == 0 && getResDate(data.data[x],timeIndex) != localStorage.getItem('time')){
								if(getResDate(data.data[x],timeIndex) == localStorage.getItem('time')){
									$('.restimeselect .right').append('<option selected="selected">'+getResDate(data.data[x],timeIndex)+'</option>');		
								}else{
									$('.restimeselect .right').append('<option>'+getResDate(data.data[x],timeIndex)+'</option>');	
								}
							}
						}
					}
				}
			}
			
			if(data.code == 1){
				alertFn(data.data.error);	
			}
		}
	});
	
	//加载数据
	$.ajax({
		url : remoteurl,  
		type : 'get',
		data : getFinalRequestObject({accessToken:getAccessToken(),workId:localStorage.getItem('workId')}),
		dataType : 'json',  
		success : function(data){
		//存储cityid
		$('.yue-address').attr('cityid',data.data.cityId);
		
		// 存储返回的数据
		$('body').data('data',data);
		$('.box-hzs').attr('workid',data.data.workId)
		//初始化页面
		if(data.data.dresserName.length>7){
			var strn=data.data.dresserName;
			strn= strn.substring(0,7)+"..." ; 
			$('.bh-name p').html(strn);
			}else{
			$('.bh-name p').html(data.data.dresserName);
			}
		$('.bl-photo').attr('src',data.data.dresserProfile);
		// 是否给化妆师加V
		if(data.data.isVDresser == 0){
			$('.img-vip').hide();
		}
		if(data.data.isVDresser == 1){
			$('.img-vip').show();
		}
		
		//判断性别
		if(data.data.sex == 1){
			$('.bh-name img').attr('src','images/girl.png');	
		}
		if(data.data.sex == 0){
			$('.bh-name img').attr('src','images/boy.png');	
		}
		
		// 星级评价
		for(var x = 0; x < data.data.starLevel; x ++){
			$('.bh-start').append('<img src="images/start_03.jpg" alt="" /> ');	
		}
		
		//封面
		$('.hzs-img').attr('src',data.data.cover);
		//装束类型
		$('.work-type').html(data.data.workType);
		//价格
		$('.work-price .cost').html(data.data.cost);
		//标签
		for(var x = 0; x <data.data.tags.length; x++){
			$('.hr-bottom').append('<span>'+data.data.tags[x]+'</span>');	
		}
		//费用
		$('.price-yuan').html('¥'+data.data.cost);
		//判断是否为首单五折
		if(data.data.hasDiscount == 1 && data.data.discount.allow == 1){
			//获取折后价
			$('.xianjia').html('¥'+data.data.discount.cost);
			//获取现价
			$('.price-yuan').html('¥'+data.data.cost);
			$('.price-yuan').css('text-decoration','line-through');
		};
	}});	
	
	//获取当前预约时间
	$('.resdateselect #USER_AGE').change(function(e) {
		$('.gray_box_load').show();	
		var re=new RegExp("[\\-,\\:, ]","g");
		$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/getReservationTimes/1.3.2',  
			type : 'get',
			data : getFinalRequestObject({accessToken:getAccessToken(),dresserId:localStorage.getItem('dresserId')}),
			dataType : 'json',  
			success : function(data){
				if(data.code == 0){	
					$('.restimeselect .right option').remove();	
					$('.restimeselect .right').append('<option>选择预约时间</option>');		
					for(var x = 0 ; x <data.data.length; x ++){
						//判断日期是哪天
						if(data.data[x].realDate == $('.resdateselect .ot-data').val().replace(re, "")){
							for(var timeIndex in data.data[x].reservationTimes){
								//判断预约状态
								if(data.data[x].reservationTimes[timeIndex].status == 0 && getResDate(data.data[x],timeIndex) != localStorage.getItem('time')){
									$('.restimeselect .right').append('<option>'+getResDate(data.data[x],timeIndex)+'</option>');	
								}
							}
						}
					}
					$('.gray_box_load').hide();
				}
				if(data.code == 1){
					alertFn(data.data.error);	
				}
			}
		});
    });
	
	function getResDate(res,timeIndex){
		return res.reservationTimes[timeIndex].name;
	}
	
	//判断当前是否选择预约日期
	$('.restimeselect').click(function(e) {
        if($.trim($('.resdateselect #USER_AGE').val()) == ""){
			alertFn('请先选择预约日期');
		};
		
		//判断当前选中的日期是否是可约日期
		var starttime = new Date();
		var str = starttime.getFullYear()+'/'+parseInt(starttime.getMonth()+1)+'/'+starttime.getDate();
		var start = new Date(str.toLocaleString().replace("-", "/").replace("-", "/"));
		var end = new Date($('.resdateselect #USER_AGE').val().replace("-", "/").replace("-", "/"));
		if(end < start){
			alertFn('预约日期不能小于当前日期！！');	
		}
    });
	
	//点击选择服务地址
	$('.yue-address').click(function(e) {
		localStorage.setItem('time',$('.right option:selected').html());
		localStorage.setItem('date',$('#USER_AGE').val());
		//判断是否已经选择过服务地址
		if(getParam('cityId') != ''){//已选过
			window.location.href = "addressServiceAddress.html?dresserId=" +localStorage.getItem('dresserId')+'&selectedBizarea='+getParam('selectedBizarea')+'&addressId='+getParam('addressId')+'&v=<%= VERSION %>'; 
		}else{
			localStorage.setItem('wantorder_cityid',$('.yue-address').attr('cityid'));
			window.location.href = "addressServiceAddress.html?dresserId=" +localStorage.getItem('dresserId')+'&v=<%= VERSION %>'; 
		}
    });
	
	//点击弹框的确定按钮关闭弹框
	$('.alert-box .ab-ok').unbind();
	$('.alert-box .ab-ok').click(function(e) {
        $('.alert-window').fadeOut();
    });
		
	//点击立即预约
	yueFn();
	
	//获取当前用户手机号
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/personalInfo/getUserInfo/2.1.0',getFinalRequestObject({accessToken : localStorage.getItem('accessToken')}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			$('#phoneNum').val(data.data.phoneNum).attr('tel',data.data.phoneNum);
			if(data.data.phoneNum == '' || isPhoneNum($.trim($('#phoneNum').val()))){
				$('.yzm').hide();	
			}else{
				$('.yzm').show();	
			}
		}else{
			window.location.href="login_new.html?v=<%= VERSION %> ";
		}
	});
	
	//判断是否显示验证手机号
	$('#phoneNum').keyup(function(){
		if(isPhoneNum($.trim($('#phoneNum').val())) && $('#phoneNum').attr('tel') != $.trim($('#phoneNum').val())){
			$('.yzm').show();
		}else{
			$('.yzm').hide();
		}
	})
});
	
function isIphone(){
	var uAgent = navigator.userAgent;
	return uAgent.indexOf('iPhone') > -1 || uAgent.indexOf('Mac') > -1 || uAgent.indexOf('iPad') > -1;
}

function yueFn(){
	/* 预约并支付*/
	$('.btn-ok').live('click',function(e) {
		
		//检查accessToken,如果无效就登录
		checkAccessTokenLogin(function(){
			if (/iphone|ipad|ipod/.test(ua)) {
				_czc.push(['_trackEvent','jiaoxue','phoneType=iOS','click','pay-btn']);   
			} else if (/android/.test(ua)) {
				 _czc.push(['_trackEvent','jiaoxue','phoneType=and','click','pay-btn']);
			};
			var coursetypeId = $('body').data('currentCoursetypeId');
			var workType = $('body').data('currentworkType');
			if($('.resdateselect #USER_AGE').val() == '' || $('.resdateselect #USER_AGE').val() == '选择预约日期'){
				alertFn('请选择预约日期');
			}else if($('.restimeselect .right option:selected').text() == '' || $('.restimeselect .right option:selected').text() == '选择预约时间'){
				alertFn('请选择预约时间');
			}else if($('.detail').html() == '请选择服务地址'){
				alertFn('请选择服务地址!!');
			}else if($.trim($('#phoneNum').val()) == ''){
				alertFn('请输入电话号码');
			}else if(isPhoneNum($.trim($('#phoneNum').val())) == false){
				alertFn('请输入正确手机号！');
			}else{
				if($('#phoneNum').val() == $('#phoneNum').attr('tel')){//手机号相等
					
					$(this).unbind('click');
					var resurl = '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/getReservation/1.5.0';
					$('.alert-window').fadeOut();
					var re=new RegExp("[\\-,\\:, ]","g");
					var data = {
						accessToken:getAccessToken(),
						workId:$('.box-hzs').attr('workid'),
						reservationDate:$('.resdateselect .ot-data').val().replace(re, ""),
						reservationTime:$('.restimeselect select option:selected').html().replace('\&nbsp;',' '),
						addressId:getParam('addressId'),
						reservationAddress:getParam('reservationAddress'),
						phoneNum:$('#phoneNum').val()
					};
					data = getFinalRequestObject(data);
					$.ajax({
						url : resurl,
						type : 'post',
						data : data,
						dataType : 'json',
						success : function(data){
							//绑定单击事件
							$('.btn-ok').bind('click',yueFn);
							if(data.code == 0){
								
								$('.order-details').attr('reservationId',data.data.reservationId);//获取订单id
								window.location.href = "successfulorder.html?dresserId=" + localStorage.getItem('dresserId')+"&reservationId=" + data.data.reservationId+'&v=<%= VERSION %>';
							}
							if(data.code == 1){
								alertFn(data.data.error);
							}
						}
					});
				}else if($('#phoneNum').val() != $('#phoneNum').attr('tel') && typeof($('.yzm').attr('code')) == "undefined"){
					alertFn('由于您更改了手机号，请重新验证！！');		
				}else if($('#phoneNum').val() != $('#phoneNum').attr('tel') && $('#phoneNum').val() != $('.yzm').attr('yzm_tel')){
					alertFn('由于您更改了手机号，请重新验证！！');		
				}else if($('#phoneNum').val() != $('#phoneNum').attr('tel') && $('#phoneNum').val() == $('.yzm').attr('yzm_tel')){
					//判断验证码
					if($('.yzm').attr('code') == $('.mine_yzm').val()){
					$(this).unbind('click');
					var resurl = '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/getReservation/1.5.0';
					$('.alert-window').fadeOut();
					var re=new RegExp("[\\-,\\:, ]","g");
					var data = {
						accessToken:getAccessToken(),
						workId:$('.box-hzs').attr('workid'),
						reservationDate:$('.resdateselect .ot-data').val().replace(re, ""),
						reservationTime:$('.restimeselect select option:selected').html().replace('\&nbsp;',' '),
						addressId:getParam('addressId'),
						reservationAddress:getParam('reservationAddress'),
						phoneNum:$('#phoneNum').val()
					};
					data = getFinalRequestObject(data);
					$.ajax({
						url : resurl,
						type : 'post',
						data : data,
						dataType : 'json',
						success : function(data){
							//绑定单击事件
							$('.btn-ok').bind('click',yueFn);
							if(data.code == 0){
								$('.order-details').attr('reservationId',data.data.reservationId);//获取订单id
								window.location.href = "successfulorder.html?dresserId=" + localStorage.getItem('dresserId')+"&reservationId=" + data.data.reservationId+'&v=<%= VERSION %>';
							}
							if(data.code == 1){
								alertFn(data.data.error);
							}
						}
					});
					}else{
						alertFn('验证码错误！！');		
					}
				}
			}
		},'wantOrder.html'+window.location.search);
	});
}
//获取验证码
function getYzmFn(){
	$('.mine_yzm_btn').unbind();
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/phoneUser/getPhoneCode/2.3.0',getFinalRequestObject({phoneNum:$('#phoneNum').val()}),function(data){
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

