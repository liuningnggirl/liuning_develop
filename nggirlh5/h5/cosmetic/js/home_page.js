$(function(){	
	//搜索按钮
	$('form.form1').on('submit', function(e){
		window.location.href = "search_one.html?search="+$(".sy_search").val()+'&v=<%= VERSION %>';
		return false;
	});
	//婚博会专场妆型 
	
	$.ajax({
		type: "post",
		url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/getPromotionWorks/1.2',
		data:getFinalRequestObject({accessToken:getAccessToken(),promotionName:'婚博会专场',num:4}),
		dataType:"json",
		success: function (data) {
			for(var x = 0; x <data.data.length; x ++){
				if(x % 2 ==0){
					$('.hbh-content').append('<a href="workDetails-hbh.html?workId='+data.data[x].workId+'&v=<%= VERSION %>" class="hc-box"><img src="'+data.data[x].cover+'" alt="" /><div class="tags"><div class="tags-left">'+tags(data.data[x].tags)+'</div><div class="tags-price">'+'¥<b>'+data.data[x].discount.cost+'</b></div></div></a>');	
				}else{
					$('.hbh-content').append('<a href="workDetails-hbh.html?workId='+data.data[x].workId+'&v=<%= VERSION %>" class="hc-box hbh-right"><img src="'+data.data[x].cover+'" alt="" /><div class="tags"><div class="tags-left">'+tags(data.data[x].tags)+'</div><div class="tags-price">'+'¥<b>'+data.data[x].discount.cost+'</b></div></div></a>');	
				}
			}
		}
	});
	$(".workdetail").live("click",function(){
		window.location.href="home_page.html?v=<%= VERSION %>";
	});
	$(".beautylist").live("click",function(){
		window.location.href="beautylist.html?v=<%= VERSION %>";
	});
	//获取tags
	function tags(t){
		var str ='';
		for(var x =0; x < 2; x ++){
			if(t.length < 2){
				str = '<span>'+t[0]+'</span> ';	
			}else{
				str = str + '<span>'+t[x]+'</span> ';	
			}
			
		}	
		return str;
	}
	
	//如果localstorage里面有就从localstorage里取值，否则默认定位到北京
	if(localStorage.getItem('localCityName') == null){
		getListFn('北京');
	}else{
		$('.select_city .city_name').html(localStorage.getItem('localCityName'));
		getListFn(localStorage.getItem('localCityName'));
	}
	
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
        $('.box').hide();
		$('.city_box').show();
    });
	
	//选择城市
	$('.city_box ul').delegate('li .city_name','click',function(e) {
		$(".sy_main").children('.list_con').remove();
        $('.box').show();
		$('.city_box').hide();
		getListFn($(this).html())
		$('.select_city .city_name').html($(this).html());
		localStorage.setItem('localCityName',$(this).html());
    });
	$(".s_main_cone").live('click',function(){
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_ClickWorks','phoneType=iOS','点击作品','true','']);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_ClickWorks','phoneType=and','点击作品','true','']);
		};
	});
});
function is_weixn(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
    	$('.s_nav').css('display','block');
        return;
    } else {
       $('.s_nav').css('display','none');
       return;
    }
}

//根据城市筛选妆形
function getListFn(cityName){
	$.ajax({
		type: "post",
		url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/weixin/listWorksAtWxHome/1.4.1',
		data:getFinalRequestObject({accessToken:getAccessToken(),cityName:cityName}),
		dataType:"json",
		async: false,
		success: function (data) {
			var res=data.data;
			var str = "";
			 for (var i in res){
			 	var workType = encodeURI(i);
			 	str += '<div class="list_con"><div class="s_title">'+i+'<a href="more.html?workType='+workType+'&v=<%= VERSION %>">更多&nbsp;<img src="images/back_right.png"></a></div><div class="s_main">';
			 	for(var j = 0; j <res[i].length ; j++) {
					//判断是否为首单五折妆容
					if(res[i][j].hasDiscount == 1){
						if(res[i].length < 2){
							str = '<div class="s_main_center"><a href="workDetails.html?workId='+res[i][j].workId+'&v=<%= VERSION %>"><div class="s_main_cone"><img class="lazy" data-original="' + res[i][j].cover + '@80Q"/></a></div><div class="s_main_ctwos"><p>' + res[i][j].workName + '</p> <span>¥<b>' + res[i][j].cost + '</b></span></div></a><img src="'+res[i][j].discount.icon+'" class="img-icon" /></div>';
						}else{
							str += '<div class="s_main_center"><a href="workDetails.html?workId='+res[i][j].workId+'&v=<%= VERSION %>"><div class="s_main_cone"><img class="lazy" data-original="' + res[i][j].cover + '@80Q"/></a></div><div class="s_main_ctwos"><p>' + res[i][j].workName + '</p> <span>¥<b>' + res[i][j].cost + '</b></span></div></a><img src="'+res[i][j].discount.icon+'" class="img-icon"  /></div>';
						}
					}else{
						if(res[i].length < 2){
							str = '<div class="s_main_center"><a href="workDetails.html?workId='+res[i][j].workId+'&v=<%= VERSION %>"><div class="s_main_cone"><img class="lazy" data-original="' + res[i][j].cover + '@80Q"/></a></div><div class="s_main_ctwos"><p>' + res[i][j].workName + '</p> <span>¥<b>' + res[i][j].cost + '</b></span></div></a></div>';
						}else{
							str += '<div class="s_main_center"><a href="workDetails.html?workId='+res[i][j].workId+'&v=<%= VERSION %>"><div class="s_main_cone"><img class="lazy" data-original="' + res[i][j].cover + '@80Q"/></a></div><div class="s_main_ctwos"><p>' + res[i][j].workName + '</p> <span>¥<b>' + res[i][j].cost + '</b></span></div></a></div>';
						}
					}
			 	}
			 	str += '</div></div>';
			 }
			 $(".sy_main").append(str);
			 $("img.lazy").lazyload({effect : "fadeIn"});//由于更多部分的作品处于隐藏状态，添加threshold后会导致，隐藏的作品提前加载，而没有了渐入效果
		},
	});
}