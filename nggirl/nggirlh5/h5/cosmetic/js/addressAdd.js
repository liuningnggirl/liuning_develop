$(function(){
	//获取弹框高度与窗体同高
	$('.window_alert').height($(window).height());
	var district = '';
	var endStr = '';
	
	//获取灰色背景高度，与当前窗体同高
	$('.window-aler').height($(window).height());
	
	//获取城市
	$('.box-city').click(function(e) {
		$('.box_area').show();
		$('.box').hide();
    });
	
	//点击选择城市页面左侧箭头
	$('.address_select_city .title-btn-arr img').click(function(e) {
		$('.box').show();
    });
	
	//点击选择街道页面左侧箭头
	$('.address_search .title-btn .arr').click(function(e) {
		if($('.search').val() == ''){
			$('.box .address .select-street .select-href').html('请选择').css('color','#9a9a9a');
		}else{
			$('.box .address .select-street .select-href').html($('.address_search .title-btn #keyword').val());
		}
		$('.address_search').hide();
		$('.box').show();
    });
	
	//获取小区/大厦/街道
	var autocomplete = null;
	$('.select-street').click(function(e) {
		$('.address_search').show();
		$('.box').hide();
		$('.search').click().focus();
		
		var lnglatXY = '';
		var windowsArr = [];
		var marker = [];
		var map = new AMap.Map("mapContainer", {
			resizeEnable: true,
			center: [116.397428, 39.90923],//地图中心点
			zoom: 13,//地图显示的缩放级别
			keyboardEnable: false,
			citylimit:true
		});
		AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){
		  var autoOptions = {
			city: $('.box-city .bc_address').attr('citycode'), //城市，默认全国
			input: "keyword",//使用联想输入的input的id
			citylimit:true
		  };
		  if(autocomplete == null){
		  	autocomplete= new AMap.Autocomplete(autoOptions);
		  }else{
			autocomplete.setCity($('.box-city .bc_address').attr('cityCode'));
		  }
		  var placeSearch = new AMap.PlaceSearch({
				city:$('.bc_address').attr('cityCode'),
				map:map
		  });

		  aoutoCompleteListener = AMap.event.addListener(autocomplete, "select", function(e){
			 //TODO 针对选中的poi实现自己的功能
			 placeSearch.search(e.poi.name)
			 placeSearch.search(e.poi.location);
			 lnglatXY = e.poi.location;
			 //获取商圈信息
			  regeocoder();
		  });
		});
		
		function regeocoder() {  //逆地理编码
			var geocoder = new AMap.Geocoder({
				radius: 1000,
				extensions: "all"
			});        
			geocoder.getAddress(lnglatXY, function(status, result) {
				if (status === 'complete' && result.info === 'OK') {
					geocoder_CallBack(result);
				};
			});        
		}
		function geocoder_CallBack(data) {
			var address = data.regeocode.formattedAddress; //返回地址描述
			var bus = data.regeocode.addressComponent.businessAreas;
			var str = '';
			//获取商区
			for(var x = 0; x < bus.length; x ++){
				str += bus[x].name +',';
			}
			endStr =str.substring(0,str.length-1);
			/*//判断是否有商圈
			if(endStr == ''){//没有
				$('.window_alert').show();
			}else{
				//获取城区
				district = data.regeocode.addressComponent.district;
				$('.box .address .select-street .select-href').html($('.address_search .title-btn #keyword').val());
				$('.address_search').hide();
				$('.box').show();
				adjFn();
			}*/
			//获取城区
			district = data.regeocode.addressComponent.district;
			$('.box .address .select-street .select-href').html($('.address_search .title-btn #keyword').val());
			$('.address_search').hide();
			$('.box').show();
			adjFn();
		}
    });
	
	//点击叉号，清空文本框
	$('.select-message .close').click(function(e) {
        $('.select-message .select-href').val('');
		$(this).hide();	
    });
	
	//点击弹窗确定按钮
	$('.window_alert,.ab_ok').click(function(e) {
        $('.window_alert').hide();
		$('.search').val('');
    });
	
	//文本框获得焦点，显示叉号
	$('.select-message .select-href').focus(function(e) {
        $('.select-message .close').show();
    });
		
	//让当前查询内容的容器高度与窗体同高
	$('#keyword').change(function(e){
		$('.amap-sug-result').height($(window).height());
	});
	
	//文本框失去焦点
	$('.search').blur(function(e) {
		if($('.amap-sug-result .auto-item').length == 0){
			$('.search-message').show();
		}else{
			$('.search-message').hide();	
		}
    });
	
	//点击小叉号删除文本框内容
	$('.address_search .close').click(function(e) {
		$(this).hide();
        $('.search').val('');
		$('.amap-container').hide();
    });
	//按下键盘搜索
	$('.search').keyup(function(e) {
		//判断当前文本框是否有内容
		if($(this).val().length == 0){
			$('.close').hide();	
		}else{
			$('.close').show();	
		}
		
		//判断是否拿到数据
		if($('.amap-sug-result>div').length == 0){
			$('.search-message').show();	
		}else{
			$('.search-message').hide();		
		}
    });
	
	//点击保存按钮，保存地址
	$('.btn-ok').click(function(e) {
		var genData = getFinalRequestObject({
		accessToken: getAccessToken(),
		cityId:$('.bc_address').attr('cityid'),
		provinceId:$('.bc_address').attr('provinceid'),
		areaName:district,
		address:$.trim($('.select-street .select-href').html()),
		detail:$.trim($('.select-message .select-href').val()),
		bizName:endStr
		});
		if($('.box-city span').html() != '' && $('.box-city span').html() != '请选择地址' && $('.select-street .select-href').html() != '' && $('.select-message .select-href').val() != ''){
			$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/address/addAddress/2.5.0',genData,function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					alert('保存成功!');
					//通过判断flag值跳转不同页面
					if(getParam('flag') == 'ser'){
						window.location.href="addressServiceAddress.html?v=<%= VERSION %>";	
					}
					if(getParam('flag') == 'common'){
						window.location.href="addressCommonAddress.html?v=<%= VERSION %>";	
					}
				}else{
					alert(data.data.error);	
				}
			});
		}
    });
	
	//点击取消，返回到常用地址页面
	$('.cancle-btn').click(function(e) {
		var r = confirm('确定要取消？？');
		if(r == true){
			//通过判断flag值跳转不同页面
			if(getParam('flag') == 'ser'){
				window.location.href="addressServiceAddress.html?v=<%= VERSION %>";	
			}
			if(getParam('flag') == 'common'){
				window.location.href="addressCommonAddress.html?v=<%= VERSION %>";	
			}
		}
    });
	
	//详细地址变化时判断保存状态
	$('.select-message .select-href').keyup(function(e) {
        adjFn();
    });
});

//判断按钮保存状态
function adjFn(){
	if($('.box-city span').html() != '请选择地址'){
		$('.btn-ok').css('background','#51c8b4');	
		$('.select-href').css('color','#4c4c4c');
	}else{
		$('.btn-ok').css('background','#b3b3b3');
		$('.select-href').css('color','#9a9a9a');
		return;
	}
	if($('.select-street .select-href').html() != '请选择'){
		$('.btn-ok').css('background','#51c8b4');
		$('.select-href').css('color','#4c4c4c');
	}else{
		$('.btn-ok').css('background','#b3b3b3');	
		$('.select-href').css('color','#9a9a9a');
		return;
	}
	if($('.select-message .select-href').val() != ''){
		$('.btn-ok').css('background','#51c8b4');
	}else{
		$('.btn-ok').css('background','#b3b3b3');	
		return;
	}
}
