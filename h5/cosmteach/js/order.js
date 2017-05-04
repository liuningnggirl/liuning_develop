	function getParam(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r!=null) return unescape(r[2]); return null;
	}

	function strIsEmpty(str){
		if(str == undefined || str == null || $.trim(str).length == 0){
			return true;
		}
		return false;
	}	

	// 从地址栏和本地存储中获取accessToken，地址栏参数优先
	function getAccessToken(){
		var accessToken = '';
		var appAccessToken = localStorage.accessToken;
		var queryAccessToken = getParam("accessToken");
		if(!strIsEmpty(appAccessToken) || !strIsEmpty(queryAccessToken) ){
			accessToken = !strIsEmpty(queryAccessToken) ? queryAccessToken:appAccessToken;
		}
		
		// localStorage中始终存储最新的accessToken
		localStorage.accessToken = accessToken;
		return accessToken;
	}
	
	//*********************加载数据并初始化页面**开始*****************************
	$(function(){

		$('.content li:eq(1)').css('background','none');
		$('.content li:eq(5)').css('background','none');

		var remoteurl = '/nggirl/app/activity/cosmcourse/getcourseinfo';
		// 从地址栏中取得
		var dresserId = getParam('dresserId');
		var coursetypeId = getParam('coursetypeId');
		var data = getFinalRequestObject({dresserId:dresserId});
		
		//加载数据
		$.ajax({
			url : remoteurl,  
			type : 'get',
			data : data,
			dataType : 'json',  
			success : function(data){
			
			// 存储返回的数据
			$('body').data('data',data);
			
			//初始化页面
			$('.bh-name').html(data.data.dresserName);
			$('.bl-photo').attr('src',data.data.profile);
			// 是否给化妆师加V
			if(data.data.isVDresser == 0){
				$('.img-vip').hide();
			}
			if(data.data.isVDresser == 1){
				$('.img-vip').show();
			}
			
			// 星级评价
			for(var x = 0; x < data.data.starLevel; x ++){
				$('.bh-start').append('<img src="images/images-teach/order-star_03.png" alt="" /> ');	
			}
			
			// 默认时间型
			//$('.content li:eq(3) .right').html(data.data.allowDate);
			
			
			// 默认预约人数
			//$('.content li:eq(2) .right').html(data.data.peopleLow);
						
			// 默认选中指定的装束类型
			changeCourseType(coursetypeId);
			//$('body').data('currentRestime',data.data.allowTime[0]);
			//document.getElementById('time').innerHTML = data.data.allowDate + '&nbsp;' + data.data.allowTime[0];
		}});
		
		
		
		/* 设置地址选择事件 */	
		
	    AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){
	      var autoOptions = {
	        city: "北京" // 城市，默认全国
	      };
	      autocom= new AMap.Autocomplete(autoOptions);
	    });

	    $( "#addresscombo" ).autocomplete({
	      source: function( request, response ) {
	        autocom.search(request.term, function(status, result){
	                    response($.map(result.tips,function(item){
	                      return {
	                        label:item.district + item.name,
	                        value:item.district + item.name
	                      }
	                    }));
	                });
	      },
	      minLength: 2,
	      select: function( event, ui ) {

			$('#address').val(ui.item.value);
			if(isIphone()){
				$('body,html').animate({scrollTop:0},260);
			}else{
				$('#addressSelect').hide();
			}
			 
	      },
	      focus: function( event, ui ) {
	      	$('#address').value = '';
	      },
	      open: function() {
	        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
	      },
	      close: function() {
	        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
	      }
		});
	    
		$('#addresscombo').blur(function(){
			 $('#addressSelect').hide();
		});
		
		$('#address').click(function(){
            $('#addressSelect').show();
            $('#addresscombo').focus();
		});
		
		$('.classtypeselect').click(classtype);
		$('.resnumselect').click(num);
		$('.restimeselect').click(openBirthDate);
			

		
	});
	
	//*********************加载数据并初始化页面**结束*****************************
	
	//点击课程类型事件
	function classtype() {
		// 所有的课程类型数组
		var courseTypeArray = getCourseTypeArray();

		// 当前选中的课程类型索引
		console.log($('#result').html());
		var coursetypeIndex = getCurrentCourseTypeIndex(
				courseTypeArray, $('#result').html());
		
		$('.gray-box').show();
		SpinningWheel.addSlot(courseTypeArray,'center',coursetypeIndex);
		SpinningWheel.setCancelAction(cancel);
		SpinningWheel.setDoneAction(done);
		SpinningWheel.open();
	}
	
	// 获取所有的课程类型数组
	function getCourseTypeArray() {
		var coursetypes = $('body').data('data').data.coursetypes;
		var arr = new Array();
		for (var i = 0; i < coursetypes.length; i++) {
			arr[i] = coursetypes[i].courseTypeName;
		}
		return arr;
	}

	// 获取当前选中的课程类型的索引值
	function getCurrentCourseTypeIndex(courseArray, courseTypeName) {
		for (var i = 0; i < courseArray.length; i++) {
			if (courseArray[i] == courseTypeName) {
				return i;
			}
		}
	}
	
	// 完成课程类型选择，关闭选择框
	function done() {
		var results = SpinningWheel.getSelectedValues();
		document.getElementById('result').innerHTML = results.values.join('');
		
		var coursetype = getCourseTypeByName(results.values);  // 根据妆容名称选择妆容类别
		changeCourseType(coursetype.coursetypeId);
		
		$('.gray-box').hide();
	}
	
//选择预约人数
	function num() {
		var low = $('body').data('data').data.peopleLow;
		var high = $('body').data('data').data.peopleHigh;
		var nums = new Array();
		for(var i=0;i<=high-low;i++){
			nums[i] = low + i;
		}
		
		var defaultNumIndex = 0;
		for(var i=0;i<nums.length;i++){
			if($('#resultnum').html() == nums[i]){
				defaultNumIndex = i;
				break;
			}
		}

		$('.gray-box').show();
		SpinningWheel.addSlot(nums,'center',defaultNumIndex);
		SpinningWheel.setCancelAction(cancel);
		SpinningWheel.setDoneAction(donenum);
		SpinningWheel.open();
	}
	
	function donenum() {
		var results = SpinningWheel.getSelectedValues();
		document.getElementById('resultnum').innerHTML =  results.values.join('');
		
		$('body').data('currentPeopleNum',results.values.join(''));
		changeCourseType($('body').data('currentCoursetypeId'));
		
		$('.gray-box').hide();
	}
	
	function cancel() {
		$('.gray-box').hide();
	}
	
	
	function openBirthDate() {
		$('.gray-box').show();
		var hours = $('body').data('data').data.allowTime;
		var defaultTimeIndex = 0;
		var defaultTimeValue = $('body').data('data').data.allowDate + '&nbsp;';
		for(var i=0;i<hours.length;i++){
			if((defaultTimeValue + hours[i]) == $('#time').html()){
				defaultTimeIndex = i;
				break;
			}
		}
		SpinningWheel.addSlot(hours, 'center',defaultTimeIndex);
		SpinningWheel.setCancelAction(cancel);
		SpinningWheel.setDoneAction(donetime);
		SpinningWheel.open();
	}
	
	function donetime() {
		var results = SpinningWheel.getSelectedValues();
		document.getElementById('time').innerHTML = $('body').data('data').data.allowDate + '&nbsp;' + results.values.join('');
		$('body').data('currentRestime',results.values.join(''));
		$('.gray-box').hide();
	}
	
	function cancel() {
		$('.gray-box').hide();
	}
	
	function changeCourseType(coursetypeId){
		var courseType = getTargetCourseType(coursetypeId);
		var peopleNum = $('body').data('currentPeopleNum');
		// 给初始化人数一个最最少人数1
		if(peopleNum == null || peopleNum == undefined || parseInt(peopleNum) == undefined ){
			peopleNum =$('body').data('data').data.peopleLow;
		}else{

		}
		console.log($('body').data('data'));
		document.getElementById('result').innerHTML = courseType.courseTypeName;
		document.getElementById('price').innerHTML = '￥' + courseType.price;
		console.log(peopleNum+'peopleNum');
		$('body').data('currentCoursetypeId',coursetypeId);
		$('body').data('currentPeopleNum',peopleNum);
		
	}

	function getTargetCourseType(coursetypeId){
		var coursetypes = $('body').data('data').data.coursetypes;
		for(var i=0;i<coursetypes.length;i++){
			if(coursetypes[i].coursetypeId == coursetypeId){
				return coursetypes[i];
			}
		}
		return null;
	}
	// 通过课程名称找到课程类型
	function getCourseTypeByName(courseTypeName){
		var coursetypes = $('body').data('data').data.coursetypes;
		for(var i=0;i<coursetypes.length;i++){
			if(coursetypes[i].courseTypeName == courseTypeName){
				return coursetypes[i];
			}
		}
		return null;
	}
	
	function isIphone(){
		var uAgent = navigator.userAgent;
		return uAgent.indexOf('iPhone') > -1 || uAgent.indexOf('Mac') > -1 || uAgent.indexOf('iPad') > -1;
	}

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
		}
		
		// 验证手机号是否正确
		function isPhoneNum(phoneNum){
				var reg = /^1(([3|8|7|5][0-9])|(5[^4|\D]))\d{8}$/;
				return reg.test(phoneNum);
		}
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','jiaoxue','phoneType=iOS','click','pay-btn']);   
		} else if (/android/.test(ua)) {
			 _czc.push(['_trackEvent','jiaoxue','phoneType=and','click','pay-btn']);
		};	
		
		var coursetypeId = $('body').data('currentCoursetypeId');

		// var resurl =
		// 'http://localhost:18080/nggirl/app/activity/cosmcourse/ordercourse';
		var resurl = '/nggirl/app/activity/cosmcourse/ordercourse';
		var payurl = '/nggirl/app/activity/cosmcourse/payCourseReservation';
		if($('#resultnum').html() == '' || $('#resultnum').html() == '请选择预约人数'){
			alert('请选择预约人数');
		}else if($('#time').html() == '' || $('#time').html() == '请选择预约时间'){
			alert('请选择预约时间');
		}else if($('#address').val() == ''){
			alert('请输入详细地址');	
		}else if($('#phoneNum').val() == ''){
			alert('请输入电话号码');	
		}else if(isPhoneNum($('#phoneNum').val())){
			var data = {
				accessToken:accessToken,
				coursetypeId:coursetypeId,
				reservationDate:$('body').data('data').data.allowDate,
				reservationTime:$('body').data('currentRestime'),
				reservationNum:$('body').data('currentPeopleNum'),
				reservationAddress:$('#address').val(),
				phoneNum:$('#phoneNum').val()
			};
			data = getFinalRequestObject(data);
			console.log(data);
			
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
					}
			}});
			}else{
				alert('请输入正确的手机号');
			}
	}
