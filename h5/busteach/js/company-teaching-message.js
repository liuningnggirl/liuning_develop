
function strIsEmpty(str) {
	if (str == undefined || str == null || $.trim(str).length == 0) {
		return true;
	};
	return false;
};

function getParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null){
		return unescape(r[2]);
	}
	return null;
};

// 从地址栏和本地存储中获取accessToken，地址栏参数优先
function getAccessToken() {
	var accessToken = '';
	var appAccessToken = localStorage.accessToken;
	var queryAccessToken = getParam("accessToken");
	if (!strIsEmpty(appAccessToken) || !strIsEmpty(queryAccessToken)) {
		accessToken = !strIsEmpty(queryAccessToken) ? queryAccessToken
				: appAccessToken;
	};

	// localStorage中始终存储最新的accessToken
	localStorage.accessToken = accessToken;
	return accessToken;
};

// 点击课程类型，弹出课程选择框
function classtype() {
	// 所有的课程类型数组
	var courseTypeArray = getCourseTypeArray();

	// 当前选中的课程类型索引
	var coursetypeIndex = getCurrentCourseTypeIndex(courseTypeArray, $('#result').html());

	$('.gray-box').show();
	// 初始化SpinningWheel
	SpinningWheel.addSlot(courseTypeArray, 'center', coursetypeIndex);
	SpinningWheel.setDoneAction(done);
	SpinningWheel.setCancelAction(cancel);
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
		}
	}
	return 0;
};

// 完成课程类型选择，关闭选择框
function done() {
	$('.gray-box').hide();
	SpinningWheel.close();
	var results = SpinningWheel.getSelectedValues();
	document.getElementById('result').innerHTML = results.values.join('');

	// 根据妆容名称选择妆容类别
	var coursetype = getCourseTypeByName(results.values);
	console.log(coursetype.courseTypeId);
	changeCourseType(coursetype.courseTypeId);
	
};

// 取消课程选择，关闭选择框
function cancel() {
	SpinningWheel.close();
	$('.gray-box').hide();
};

//改变课程类别，设置页面中的关联字段，并存储改变结果
function changeCourseType(coursetypeId) {
	var courseType = getTargetCourseType(coursetypeId);
	console.log(courseType);
	$('.left-num').html(courseType.price);
	$('.pr-minite .blue').html(courseType.time);
	$('.pr-yue .blue').html(courseType.allowPeopleNum);
	$('.hzs-message').html(courseType.dresserDesc);
	createBanner(courseType.courseTypeName);
};


//*********************加载数据并初始化页面**开始*****************************
$(function() {

	// 获取dresserId
	var dresserId = getParam('dresserId');
	//构造请求数据
	var orderInfoRequest = getFinalRequestObject({
		dresserId : dresserId,
		accessToken : getAccessToken()
	});
	
	//加载页面数据
	$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl/app/activity/buscourse/getcourseinfo',
				type : 'get',
				dataType : 'json',
				data : orderInfoRequest,
				success : function(data) {
					//alert(data.data[0].courseTypeName);
					//存储加载的数据
					$('body').data('data', data);

					//课程分类选择事件
					$('.classtypeselect').click(classtype);

					//创建轮播图片
					createBanner(data.data[0].courseTypeName);
					
					//初始化各个页面中的元素值
					$('.hzs-message').html(data.data[0].dresserDesc);
					$('.pr-yue .blue').html(data.data[0].allowPeopleNum);
					$('.classtypeselect .right').html(data.data[0].courseTypeName);
				}
			});

	//点击预约按钮
	$('.hzs .btn-ok').click(
		function(e) {
			// 验证accessToken是否有效
			var accessToken = getAccessToken();
			if (!strIsEmpty(accessToken)) {
				// accessToken = !strIsEmpty(queryAccessToken) ?
				// queryAccessToken:appAccessToken;
			} else {
				location.href = 'login.html?v=<%= VERSION %>';
				return;
			}
			if (/iphone|ipad|ipod/.test(ua)) {
				_czc.push(['_trackEvent','qyjiaoxue','phoneType=iOS','btn-sencondpage-yue','']);	
			} else if (/android/.test(ua)) {
				_czc.push(['_trackEvent','qyjiaoxue','phoneType=and','btn-sencondpage-yue','']);
			};


			var data = getFinalRequestObject({
				accessToken : accessToken
			});
			$.ajax({
				type : 'GET',
				url : '<%= CLI_HOST_API_URL %>/nggirl/app/cli/checkAccessToken',
				data : data,
				success : function(result) {
					result = $.parseJSON(result);
					if (result.code == '1') {
						location.href = 'login.html?v=<%= VERSION %>';
					} else {
						// 授权令牌有效
						location.href = 'company-order.html?accessToken='
								+ accessToken + "&courseTypeId="
								+ selectedCourseType.courseTypeId+'&v=<%= VERSION %>';
					};
				}
			});

		});
});

//*********************加载数据并初始化页面**结束*****************************

var selectedCourseType;
function createBanner(courseTypeName) {
	// 选中了哪个
	var coursetype = getCourseTypeByName(courseTypeName);
	selectedCourseType = coursetype;

	// 构造banner需要的结构
	$('#slideBox').children().remove();
	var strFirst = '<div class="top bd"><ul class="imgw">';

	var images = coursetype.images;
	var middle = '';
	for (var i = 0; i < images.length; i++) {
		middle += '<li><div><img src="' + images[i] + '" alt="'
				+ courseTypeName + '" /></div></li>';
	};
	console.log($('#slideBox'));

	$('#slideBox').append(strFirst+ middle+ '</ul></div><div class="bot hd"> <ul class="clear"></ul><div class="z-kinds">'+ courseTypeName + '</div></div>');

	// 修改价格
	$('.price-info .left-num').html(coursetype.price);
	$('.pr-minite .blue').html(coursetype.time);
	$('.p-content').html(coursetype.description);

	// 创建banner
	TouchSlide({
		slideCell : "#slideBox",
		titCell : ".hd ul", // 开启自动分页 autoPage:true ,此时设置 titCell 为导航元素包裹层
		mainCell : ".bd ul",
		effect : "left",
		autoPage : true, // 自动分页
		autoPlay : true, // 自动播放
		interTime : 3000,
	});
};

//根据课程类别名称，找出指定的课程类别信息
function getCourseTypeByName(courseTypeName) {
	var coursetypes = $('body').data('data').data;
	for (var i = 0; i < coursetypes.length; i++) {
		if (coursetypes[i].courseTypeName == courseTypeName) {
			return coursetypes[i];
		}
	}
}

//根据课程类别id，找出指定的课程类别信息
function getTargetCourseType(coursetypeId) {
	var coursetypes = $('body').data('data').data;
	for (var i = 0; i < coursetypes.length; i++) {
		if (coursetypes[i].courseTypeId == coursetypeId) {
			return coursetypes[i];
		}
	}
	return null;
}
