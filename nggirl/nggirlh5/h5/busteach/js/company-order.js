
	function getParam(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r!=null) return unescape(r[2]); return null;
	};

	function strIsEmpty(str){
		if(str == undefined || str == null || $.trim(str).length == 0){
			return true;
		}
		return false;
	};

	// 从地址栏和本地存储中获取accessToken，地址栏参数优先
	function getAccessToken(){
		var accessToken = '';
		var appAccessToken = localStorage.accessToken;
		var queryAccessToken = getParam("accessToken");
		if(!strIsEmpty(appAccessToken) || !strIsEmpty(queryAccessToken) ){
			accessToken = !strIsEmpty(queryAccessToken) ? queryAccessToken:appAccessToken;
		};
		
		// localStorage中始终存储最新的accessToken
		localStorage.accessToken = accessToken;
		return accessToken;
	};
	
	//*********************加载数据并初始化页面**开始*****************************
	$(function(){

	$('.btn-yue').click(function(e) {
        
    });
		var remoteurl = '<%= CLI_HOST_API_URL %>/nggirl/app/activity/buscourse/getcourseinfo';
		// 从地址栏中取得
		var courseTypeId = getParam('courseTypeId');
		var data = getFinalRequestObject({courseTypeId:courseTypeId});
		
		//加载数据
		$.ajax({
			url : remoteurl,  
			type : 'get',
			data : data,
			dataType : 'json',  
			success : function(data){
			
			// 存储返回的数据
			$('body').data('data',data);
			console.log(data);
						
			// 默认选中指定的装束类型
			changeCourseType(courseTypeId);
		}});
		
		

		
		$('.classtypeselect').click(classtype);
		$('.restimeselect').click(openBirthDate);
			

		
	});
	
	//*********************加载数据并初始化页面**结束*****************************
	
	//点击课程类型事件
	function classtype() {
		// 所有的课程类型数组
		var courseTypeArray = getCourseTypeArray();

		// 当前选中的课程类型索引
		var coursetypeIndex = getCurrentCourseTypeIndex(
				courseTypeArray, $('#result').html());
		
		$('.gray-box').show();
		SpinningWheel.addSlot(courseTypeArray,'center',coursetypeIndex);
		SpinningWheel.setCancelAction(cancel);
		SpinningWheel.setDoneAction(done);
		SpinningWheel.open();
	};
	
	// 获取所有的课程类型数组
	function getCourseTypeArray() {
		var coursetypes = $('body').data('data').data;
		var arr = new Array();
		for (var i = 0; i < coursetypes.length; i++) {
			arr[i] = coursetypes[i].courseTypeName;
		}
		return arr;
	};

	// 获取当前选中的课程类型的索引值
	function getCurrentCourseTypeIndex(courseArray, courseTypeName) {
		for (var i = 0; i < courseArray.length; i++) {
			if (courseArray[i] == courseTypeName) {
				return i;
			};
		};
	};
	
	// 完成课程类型选择，关闭选择框
	function done() {
		var results = SpinningWheel.getSelectedValues();
		document.getElementById('result').innerHTML = results.values.join('');
		
		var coursetype = getCourseTypeByName(results.values);  // 根据妆容名称选择妆容类别
		changeCourseType(coursetype.courseTypeId);
		
		$('.gray-box').hide();
	};
	
	
	
	function cancel() {
		$('.gray-box').hide();
	};
	
	
	function openBirthDate() {
		$('.gray-box').show();
		var hours = $('body').data('data').data.allowTime;
		var defaultTimeIndex = 0;
		var defaultTimeValue = $('body').data('data').data.allowDate + '&nbsp;';
		for(var i=0;i<hours.length;i++){
			if((defaultTimeValue + hours[i]) == $('#time').html()){
				defaultTimeIndex = i;
				break;
			};
		};
		SpinningWheel.addSlot(hours, 'center',defaultTimeIndex);
		SpinningWheel.setCancelAction(cancel);
		SpinningWheel.setDoneAction(donetime);
		SpinningWheel.open();
	};
		
	function cancel() {
		$('.gray-box').hide();
	};
	
	function changeCourseType(coursetypeId){
		var courseType = getTargetCourseType(coursetypeId);
		document.getElementById('result').innerHTML = courseType.courseTypeName;
		document.getElementById('price').innerHTML = '￥' + courseType.price;
		document.getElementById('resultnum').innerHTML = courseType.allowPeopleNum;
		$('body').data('currentCoursetypeId',coursetypeId);
		$('body').data('currentPeopleNum',courseType.allowPeopleNum);
		
	};

	function getTargetCourseType(coursetypeId){
		var coursetypes = $('body').data('data').data;
		for(var i=0;i<coursetypes.length;i++){
			if(coursetypes[i].courseTypeId == coursetypeId){
				return coursetypes[i];
			};
		};
		return null;
	};
	
	// 通过课程名称找到课程类型
	function getCourseTypeByName(courseTypeName){
		var coursetypes = $('body').data('data').data;
		for(var i=0;i<coursetypes.length;i++){
			if(coursetypes[i].courseTypeName == courseTypeName){
				return coursetypes[i];
			};
		};
		return null;
	};
	
	function isIphone(){
		var uAgent = navigator.userAgent;
		return uAgent.indexOf('iPhone') > -1 || uAgent.indexOf('Mac') > -1 || uAgent.indexOf('iPad') > -1;
	};

	/*
	 * 预约并支付
	 */
	function reservationAndPay(){
		var accessToken = getAccessToken();
		if(!strIsEmpty(accessToken)){
			// accessToken = !strIsEmpty(queryAccessToken) ?
			// queryAccessToken:appAccessToken;
		}else{
			
			location.href = 'login.html?v=<%= VERSION %>';
			return;
		};
		
		// 验证手机号是否正确
		function isPhoneNum(phoneNum){
				var reg = /^1(([3|8|7|5][0-9])|(5[^4|\D]))\d{8}$/;
				return reg.test(phoneNum);
		};
		if (/iphone|ipad|ipod/.test(ua)) {
				_czc.push(['_trackEvent','qyjiaoxue','phoneType=iOS','btn-pay','']);	
			} else if (/android/.test(ua)) {
				_czc.push(['_trackEvent','qyjiaoxue','phoneType=and','btn-pay','']);
			};	

		
		var courseTypeId = $('body').data('currentCoursetypeId');

		var resurl = '<%= CLI_HOST_API_URL %>/nggirl/app/activity/buscourse/ordercourse';
		var payurl ='<%= CLI_HOST_API_URL %>/nggirl/app/activity/buscourse/payCourseReservation';
		if($('#resultnum').html() == '请选择预约人数'){
			alert('请选择预约人数');
		}else if($('.data-txt').val() == ''){
			alert('请选择预约时间');
		}else if( $('#address').val() == ''){
			alert('请输入详细地址');	
		}else if($('#phoneNum').val() == ''){
			alert('请输入电话号码');	
		}else if(isPhoneNum($('#phoneNum').val())){
			var re=new RegExp("[\\-,\\:, ]","g");  //正则格式化字符，解释：re=new RegExp("l","g")中的第一个参数是你要替换的字符串，第二个参数指替换所有的。
			var reservationDate = $('.data-txt').val().replace(re, "");
			var data = {
				accessToken:accessToken,
				courseTypeId:courseTypeId,
				reservationDate:reservationDate,
				reservationAddress:$('#address').val(),
				phoneNum:$('#phoneNum').val()
			};
			data = getFinalRequestObject(data);
			console.log('data'+data);
			
			//确定预约并支付
			$.ajax({
				url : resurl,
				type : 'post',
				data : data,
				dataType : 'json',
				success : function(data){
					console.log(data);
					if(data.data.reservationId != undefined){
						var queryStringData = getFinalRequestObject({'reservationId':data.data.reservationId});
						var queryString;
						for(var prop in queryStringData){
							queryString += (prop + '=' + queryStringData[prop]+'&');						
						}
						window.location.href = payurl + '?' +queryString+'&v=<%= VERSION %>';
					};
			}});
			}else{
				alert('请输入正确的手机号');
			};
	};