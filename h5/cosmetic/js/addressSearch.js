$(function(){
	var lnglatXY = '';
    var windowsArr = [];
    var marker = [];
	var district = '';
	var endStr = '';
    var map = new AMap.Map("mapContainer", {
            resizeEnable: true,
            center: [116.397428, 39.90923],//地图中心点
            zoom: 13,//地图显示的缩放级别
            keyboardEnable: false
    });
    AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){
      var autoOptions = {
        city: getParam('cityname'), //城市，默认全国
        input: "keyword"//使用联想输入的input的id
      };
      autocomplete= new AMap.Autocomplete(autoOptions);
      var placeSearch = new AMap.PlaceSearch({
            city:getParam('cityname'),
            map:map
      })
      AMap.event.addListener(autocomplete, "select", function(e){
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
        var marker = new AMap.Marker({  //加点
            map: map,
            position: lnglatXY
        });
        map.setFitView();
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
		//获取城区
		district = data.regeocode.addressComponent.district;
    }
	
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
	$('.close').click(function(e) {
		$(this).hide();
        $('.search').val('');
		$('.amap-container').hide();
    });
	
	//点击左侧箭头把数据带回到上一个页面
	$('.title-btn .arr').click(function(e) {
		//通过标签判断跳转页面
		if(getParam('tags') == 'add'){
			//通过判断flag标签跳转页面
			if(getParam('flag') == 'ser'){
				window.location.href ="addressAdd.html?cityname=" + getParam('cityname') + '&cityid=' + getParam('cityid') + '&address=' + $('.search').val() +'&areaName='+district +'&bizname='+endStr +'&detail=' + getParam('detail')+'&flag=ser'+'&v=<%= VERSION %>';
			}
			if(getParam('flag') == 'common'){
				window.location.href ="addressAdd.html?cityname=" + getParam('cityname') + '&cityid=' + getParam('cityid') + '&address=' + $('.search').val() +'&areaName='+district +'&bizname='+endStr +'&detail=' + getParam('detail')+'&flag=common'+'&v=<%= VERSION %>';
			}
		}
		if(getParam('tags') == 'edit'){
			window.location.href ="addressEdit.html?cityname=" + getParam('cityname') + '&cityid=' + getParam('cityid') + '&address=' + $('.search').val() +'&areaName='+district +'&bizname='+endStr +'&detail=' + getParam('detail') +'&areaid=' +getParam('areaid') +'&bizname=' +getParam('bizname')+'&v=<%= VERSION %>';
		}
    });
	
	//判断上级页面有没有带过来数据
	if(getParam('address') != ''){
		$('.search').val(getParam('address'));
	}
});
