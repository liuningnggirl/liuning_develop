$(function(){
	//获取城市列表
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/supportedCity',getFinalRequestObject({accessToken: getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			for(var x = 0; x < data.data.length; x ++){
				$('.box_ul').append('<li cityid="'+data.data[x].id+'"><div class="city-s">'+data.data[x].key+'</div><div class="city">'+data.data[x].name+'</div></li>');	
			}	
		}else{
			alert(data.data.error);	
		}
	});
	
	//点击左侧箭头
	$('.title-btn img').click(function(e) {
		//通过判断tags标签来跳转页面
		if(getParam('tags') == 'edit'){
			window.location.href="addressEdit.html?cityname=" + getParam('cityname') + '&cityid=' + getParam('cityid') +'&detail=' + getParam('detail') +'&areaid=' +getParam('areaid')+'&v=<%= VERSION %>';
		}
		if(getParam('tags') == 'add'){
			//通过判断flag标签来跳转到相应页面
			if(getParam('flag') == 'ser'){
				window.location.href="addressAdd.html?cityname=" + getParam('cityname') + '&cityid=' + getParam('cityid')+'&flag=ser'+'&v=<%= VERSION %>';
			}
			if(getParam('flag') == 'common'){
				window.location.href="addressAdd.html?cityname=" + getParam('cityname') + '&cityid=' + getParam('cityid')+'&flag=common'+'&v=<%= VERSION %>';
			}
		}
    });
	
	//选中当前的城市带到上一个页面
	$('.box_ul').delegate('li','click',function(){ 
		//通过判断tags标签来跳转页面
		if(getParam('tags') == 'edit'){
			window.location.href="addressEdit.html?cityname=" + $(this).children('.city').html()+'&cityid=' + $(this).attr('cityid') +'&detail=' + getParam('detail') +'&areaid=' +getParam('areaid')+'&v=<%= VERSION %>';
		}
		if(getParam('tags') == 'add'){
			//通过判断flag标签来跳转到相应页面
			if(getParam('flag') == 'ser'){
				window.location.href="addressAdd.html?cityname=" + $(this).children('.city').html()+'&cityid=' + $(this).attr('cityid')+'&flag=ser'+'&v=<%= VERSION %>';
			}
			if(getParam('flag') == 'common'){
				window.location.href="addressAdd.html?cityname=" + $(this).children('.city').html()+'&cityid=' + $(this).attr('cityid')+'&flag=common'+'&v=<%= VERSION %>';
			}
		}
	}); 
});