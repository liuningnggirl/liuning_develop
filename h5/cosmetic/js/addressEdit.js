$(function(){
	$('.box-city .bc_address').html(getParam('provinceName')+' '+getParam('cityname'));
	$('.bc_address').attr('provinceId',getParam('provinceId'));
	$('.bc_address').attr('cityId',getParam('cityId'));
	$('.bc_address').attr('sheng',getParam('provinceName'));
	$('.bc_address').attr('shi',getParam('cityname'));
	$('.bc_address').attr('cityCode',getParam('cityCode'));
	$('.select-street .select-href').html(getParam('address'));	
	$('.select-message .select-href').val(getParam('detail'));
	var shengshiStr = $('.bc_address').html().split(' ');
	//保存按钮状态
	adjFn();
	//获取灰色背景高度，与当前窗体同高
	$('.window-aler').height($(window).height());
	
	var district = getParam('areaName');//城区
	var endStr = getParam('bizname');//商圈
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
		$('.box .address .select-street .select-href').html($('.address_search .title-btn #keyword').val());
		$('.address_search').hide();
		$('.box').show();
    });
	
	//获取小区/大厦/街道
	var autocomplete = null;
	$('.select-street').click(function(e) {
		if($('.select-street .select-href').html() == '请选择'){
			$('#keyword').val('');
		}else{
			$('#keyword').val($('.select-street .select-href').html());
		}
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
			city: $('.box-city .bc_address').attr('shi'), //城市，默认全国
			input: "keyword",//使用联想输入的input的id
			citylimit:true
		  };
		  if(autocomplete == null){
		  	autocomplete= new AMap.Autocomplete(autoOptions);
		  }else{
			autocomplete.setCity($('.box-city .bc_address').attr('shi'));
		  }
		  var placeSearch = new AMap.PlaceSearch({
				city:$('.bc_address').attr('shi'),
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
				}
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
		$('.address_search').show();
		$('.box').hide();
		$('.search').click().focus();
    });
	
	//点击叉号，清空文本框
	$('.select-message .close').click(function(e) {
        $('.select-message .select-href').val('');
		$(this).hide();	
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
		id:getParam('areaid'),
		areaName:district,
		address:$.trim($('.select-street .select-href').html()),
		detail:$.trim($('.select-message .select-href').val()),
		bizName:endStr,
		provinceId:$('.bc_address').attr('provinceid')
		});
		if($('.box-city span').html() != '' && $('.box-city span').html() != '请选择地址' && $('.select-street .select-href').html() != '' && $('.select-message .select-href').val() != ''){
			$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/address/updateAddress/2.5.0',genData,function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					alert('修改成功!');
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
	
	$('.sheng,.shi').height($(window).height() - 110);
	//获取全国城市列表V2.4.2
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/allCommonCity/2.4.2',getFinalRequestObject({accessToken: getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			for(var x = 0; x < data.data.length; x ++){
				if(shengshiStr[0] == data.data[x].provinceName){
					$('.sheng').append('<li provinceId="'+data.data[x].provinceId+'" class="current_sheng">'+data.data[x].provinceName+'</li>');
					$.get('<%= CLI_HOST_API_URL %>/nggirl/app/allCommonCity/2.4.2',getFinalRequestObject({accessToken: getAccessToken()}),function(data){
						var data = $.parseJSON(data);
						if(data.code == 0){
							for(var x = 0; x < data.data.length; x ++){
								if(data.data[x].provinceName == shengshiStr[0]){
									$('.shi').append(getShiFn(data.data[x].cities));	
								}
							}
						}else{
							alert(data.data.error);	
						}
					});
				}else{
					$('.sheng').append('<li provinceId="'+data.data[x].provinceId+'">'+data.data[x].provinceName+'</li>');
				}
			}
		}else{
			alert(data.data.error);	
		}
	});
	
	//选中省
	$('.sheng').delegate("li","click",function(){
		$('.tba_ok').removeClass('tba_ok_blue');
		$('.shi li').remove();
		var btn = $(this);
		btn.addClass('current_sheng').siblings().removeClass('current_sheng');
		$.get('<%= CLI_HOST_API_URL %>/nggirl/app/allCommonCity/2.4.2',getFinalRequestObject({accessToken: getAccessToken()}),function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				for(var x = 0; x < data.data.length; x ++){
					if(data.data[x].provinceName == btn.html()){
						$('.shi').append(getShiFn(data.data[x].cities));	
					}
				}
			}else{
				alert(data.data.error);	
			}
		});
	})
	
	//选中市
	$('.shi').delegate("li","click",function(){
		$(this).addClass('current_shi').siblings().removeClass('current_shi');
		$('.tba_ok').addClass('tba_ok_blue');
	});
	
	//选中城市
	$('.tba_ok').click(function(e) {
		var str = '';
		var sheng = '';
		var shi = '';
		var shengshi =$('.bc_address').html();
        $('.sheng li').each(function(index, element) {
            if($(this).hasClass('current_sheng')){
				sheng = $(this).html();
				$('.bc_address').attr('provinceId',$(this).attr('provinceId'));
				$('.bc_address').attr('sheng',$(this).html());
			}
        });
        $('.shi li').each(function(index, element) {
            if($(this).hasClass('current_shi')){
				shi = $(this).html();
				$('.box').show();
				$('.box_area').hide();
				$('.bc_address').attr('cityId',$(this).attr('cityId'));
				$('.bc_address').attr('shi',$(this).html());
				$('.bc_address').attr('cityCode',$(this).attr('cityCode'));
				if(shengshi != sheng+' '+shi && shengshi !='请选择地址'){
					$('.select-street .select-href').html('请选择').css('color','#9a9a9a');
					adjFn();
				}else{
					
				}
				$('.bc_address').html(sheng+' '+shi).css('color','#3a3a3a');
			}
        });
    });
	
	//点击返回箭头
	$('.title-btn-arr img').click(function(e) {
		$('.box_area').hide();
		$('.box').show();
    });
			
	//获取城市对应的市
	function getShiFn(shi){
		var str = '';
		if(shi.length > 0){
			for(var x = 0; x < shi.length; x ++){
				if(shengshiStr[1] == shi[x].cityName){
					str += '<li cityCode="'+shi[x].cityCode+'" cityId="'+shi[x].cityId+'" class="current_shi">'+shi[x].cityName+'</li>';	
					$('.tba_ok').addClass('tba_ok_blue');
				}else{
					str += '<li cityCode="'+shi[x].cityCode+'" cityId="'+shi[x].cityId+'">'+shi[x].cityName+'</li>';	
				}
			}	
		}else{
			str = '';	
		}
		return str;
	}
	
});

//判断按钮保存状态
function adjFn(){
	if($('.box-city span').html() != '请选择地址'){
		$('.btn-ok').css('background','#51c8b4');	
	}else{
		$('.btn-ok').css('background','#b3b3b3');
		return;
	}
	if($('.select-street .select-href').html() != '请选择'){
		$('.btn-ok').css('background','#51c8b4');
	}else{
		$('.btn-ok').css('background','#b3b3b3');	
		return;
	}
	if($('.select-message .select-href').val() != ''){
		$('.btn-ok').css('background','#51c8b4');
	}else{
		$('.btn-ok').css('background','#b3b3b3');	
		return;
	}
}
