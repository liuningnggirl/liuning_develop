$(function(){
	var pageSize = 20;
	$(function() {
		//加载第一页
		//如果localstorage里面有就从localstorage里取值，否则默认定位到北京
		if(localStorage.getItem('localCityName') == null){
			loadDressers(0,20,'北京');
		}else{
			$('.select_city .city_name').html(localStorage.getItem('localCityName'));
			loadDressers(0,20,localStorage.getItem('localCityName'));
		}
	});
	$(".workdetail").live("click",function(){
		window.location.href="home_page.html?v=<%= VERSION %>";
	});
	$(".beautylist").live("click",function(){
		window.location.href="beautylist.html?v=<%= VERSION %>";
	});
	//获取支持的城市V2.0.0：
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/supportedCity/2.0.0',getFinalRequestObject({accessToken:getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.length > 0){
				for(var x = 0 ; x< data.data.length; x ++){
					if(x == 0){
						$('.city_box ul').append('<li><div class="city_caps">'+data.data[x].key+'</div><div class="city_name">'+data.data[x].name+'</div></li>');	
					}else{
						if(data.data[x].key == data.data[x-1].key){
							$('.city_box ul li:eq('+($('.city_box ul li').length-1)+')').append('<div class="city_name" style="border-top:none;">'+data.data[x].name+'</div>');
						}else{
							$('.city_box ul').append('<li><div class="city_caps">'+data.data[x].key+'</div><div class="city_name">'+data.data[x].name+'</div></li>');		
						}
					}
				}
			};
		}else{
			alert(data.data.error);	
		}
	});
	
	//切换城市
	$('.select_city').click(function(e) {
        $('.bg').hide();
		$('.city_box').show();
    });
	
	//选择城市
	$('.city_box ul').delegate('li .city_name','click',function(e) {
		$(".listmain").children('a').remove();
        $('.bg').show();
		$('.city_box').hide();
		loadDressers(0,20,$(this).html())
		$('.select_city .city_name').html($(this).html());
		localStorage.setItem('localCityName',$(this).html());
    });
	
	function loadDressers(pageNum,pageSize,city){
		$.ajax({
			type: "post",
			url:'<%= CLI_HOST_API_URL %>/nggirl/app/cli/salon/works/listSalonProducts/1.4.0',
			data:getFinalRequestObject({page:pageNum,num:pageSize,city:city}),
			dataType:"json",
			async: false,
			success: function (data) {
				$('.s_btn').remove();
				for(var x = 0; x <data.data.length; x ++){
					$('.listmain').append('<a href="beautySalonWorkDetails.html?unionProductId='+data.data[x].unionProductId+'&productType='+data.data[x].productType+'&v=<%= VERSION %>" class="listbox listbox'+pageNum+'"><img data-original="'+data.data[x].cover+'@80Q" class="lazy imgw " alt=""/><div class="delist"><div class="de-left"><p class="b-title">'+data.data[x].title+'</p><p class="b-desc">'+data.data[x].descr+'</p></div><div class="de-right"><div class="simgbox"><img src="'+data.data[x].dresserProfile+"@80Q"+'" alt=""/></div></div></div><div class="listbot"><p class="timebg">'+data.data[x].holdTime+'</p><p class="adressbg">'+data.data[x].holdPlace+'</p><p class="botright"><b>'+data.data[x].price+'</b>元/位</p></div></a>');	
					$(".listbox .imgw").css("height",$('.listbox').width()*2/3);
					$(".listbox"+pageNum+" img.lazy").lazyload({effect : "fadeIn",threshold : 200});
				}
				
				if( data.data.length >= pageSize){
					$(".bg").append('<div class="s_btn" id="s_click_btn">查看更多</div>');
				}
				
				$(".s_btn").unbind('click');
				$(".s_btn").on("click", getMoreDressers);
			},
		});
		function getMoreDressers(){
			var pageNum = $('body').data('pageNum');
			if(pageNum == undefined || parseInt(pageNum) == NaN){
				pageNum = 0;
			}
			pageNum = pageNum + 1;
			$('body').data('pageNum',pageNum);
			loadDressers(pageNum,pageSize,'北京');
		}	
	}
});

