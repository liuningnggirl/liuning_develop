$(function(){
	//alert(getParam("resTime"));
	//获取价格区间
	$('.bb-one').val(getParam("lowPrice"));
	$('.bb-two').val(getParam("highPrice"));
	
	//回显价格
	$('.ss-bottom .price').each(function(index, element) {
        if($(this).html()== getParam("lowPrice")+'-'+getParam("highPrice")){
			$(this).addClass('current-blue');
		}
		
		if(getParam("lowPrice") == '1000'){
			$('.ss-bottom>.price').eq(3).addClass('current-blue');
		}
    });
	
	//筛选里面的价格区间
	$('.ss-bottom>.price').click(function(e) {
		if($(this).html() == '1000+'){
			$('.bb-one').val('1000');
			$('.bb-two').val('');
			$(this).addClass('current-blue').siblings().removeClass('current-blue');
		}else{
			$(this).addClass('current-blue').siblings().removeClass('current-blue');
			var arr = $(this).html().split('-');
			$('.bb-one').val(arr[0]);
			$('.bb-two').val(arr[1]);
		}
	});
	
	//点击筛选里面的“重置”按钮
	$('.reset-btn').click(function(e) {
		$('.ss-bottom>.price').removeClass('current-blue');
		$('.bb-one').val('');
		$('.bb-two').val('');
		$('.limit-date').html('不限日期');
		$('.limit-time').html('不限时间');
		$('.od-left option').each(function(index, element) {
            if($(this).html() == '不限日期'){
				$(this).attr('selected','selected');	
			}
        });
		$('.od-right option:selected').html('不限时间');
		$('.limit-date').removeAttr('realdate');
	});
	
	//获取预约日期
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/getAllReservationTimes/1.4.0',getFinalRequestObject({accessToken: getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			for(var x = 0; x < data.data.length ; x ++){
				if(data.data[x].realDate == getParam("resDate")){
					$('.od-left').append('<option realDate="'+data.data[x].realDate+'" selected="selected">'+data.data[x].reservationDate+'</option>');
					$('.limit-date').html(data.data[x].reservationDate);	
				}else{
					$('.od-left').append('<option realDate="'+data.data[x].realDate+'">'+data.data[x].reservationDate+'</option>');	
				}
			}
		};
		if(data.code == 1){
			alert(data.data.error);
		};
	});
	
	//预约时间
	if(getParam("resTime") != ''){
		$('.od-right').children('option').remove();
	}
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/getAllReservationTimes/1.4.0',getFinalRequestObject({accessToken: getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			for(var x = 0; x < data.data.length ; x ++){
				if($('.od-left option:selected').html() == data.data[x].reservationDate){
					$('.od-right').append(getTimeFn(data.data[x].reservationTimes,getParam("resTime")));	
				}
			}
		};
		if(data.code == 1){
			alert(data.data.error);
		};
	});
	
	//回显时间
	if(getParam("resTime") != ''){
		$('.limit-time').html(getParam("resTime"));
	}
	
	//改变日期对应的加载时间
	$('.od-left').change(function(e) {
		$('.od-right').children('option').remove();
		$('.limit-date').html($('.od-left option:selected').html());
		$('.limit-date').attr('realdate',$('.od-left option:selected').attr('realdate'));
		$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/getAllReservationTimes/1.4.0',getFinalRequestObject({accessToken: getAccessToken()}),function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				for(var x = 0; x < data.data.length ; x ++){
					if($('.od-left option:selected').html() == data.data[x].reservationDate){
						$('.od-right').append(getTimeFn(data.data[x].reservationTimes));	
					}
				}
			};
			if(data.code == 1){
				alert(data.data.error);
			};
		});
    });
	
	//改变时间
	$('.od-right').change(function(e) {
        $('.limit-time').html($('.od-right option:selected').html());
    });
	
	$('.ok-btn').click(function(e) {
		//生成数据
		window.location.href="cosmeticSpecial-share.html?specialId="+localStorage.getItem('specialId')+'&lowPrice='+$('.bb-one').val()+'&highPrice='+$('.bb-two').val()+'&resDate='+$('.limit-date').attr('realdate')+'&resTime='+$('.limit-time').html()+'&v=<%= VERSION %>';
    });
		
});

//获取时间
function getTimeFn(arr,time){
	var str = '';
	for(var x = 0; x < arr.length; x ++){
		if(arr[x].name == time){
			str = str + '<option selected="selected">'+arr[x].name+'</option>';
		}else{
			str = str + '<option>'+arr[x].name+'</option>';
		}
	}
	return str;
}

//获取入参
function paraFn(specialId,orderBy,lowPrice,highPrice,resDate,resTime){
	var genData = getFinalRequestObject({
		specialId:specialId,
		orderBy:orderBy,
		lowPrice:lowPrice,
		highPrice:highPrice,
		resDate:resDate,
		resTime:resTime});
	return genData;
}

//获取某一专题作品列表
function loadData(genData){
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/special/listWorks/1.4.0',genData,function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			for(var x = 0; x < data.data.length; x ++){
				//判断专题是否有折扣(0:没有折扣)
				if(data.data[x].hasDiscount == 0){
					$('.box-content').append('<li workid="'+data.data[x].workId+'"><div class="bc-left"><div class="bl-top"><img src="'+data.data[x].cover+'" alt="" /></div><div class="bl-bottom"><div class="bb-left"><img src="images/Rectangle 18 Copy@640.png" class="like-people" alt="" /><span class="num"> '+data.data[x].likeNum+'</span><span class="like">人喜欢 |</span></div><div class="bb-right"><span class="order-num">'+data.data[x].resNum+'</span>人预约</div></div></div><div class="bc-right"><img src="'+data.data[x].ornament+'" class="br-img" alt="" /><p class="br-txt">'+data.data[x].content+'</p><del class="yuan-price">'+'¥'+data.data[x].cost+'</del><span class="xian-price">'+'¥'+data.data[x].discount.cost+'</span></div></li>');
				}
				//有折扣
				if(data.data[x].hasDiscount == 1){
					$('.box-content').append('<li workid="'+data.data[x].workId+'"><div class="bc-left"><div class="bl-top"><img src="'+data.data[x].cover+'" alt="" /><img class="half" src="'+data.data[x].discount.icon+'" /></div><div class="bl-bottom"><div class="bb-left"><img src="images/Rectangle 18 Copy@640.png" class="like-people" alt="" /><span class="num"> '+data.data[x].likeNum+'</span><span class="like">人喜欢 |</span></div><div class="bb-right"><span class="order-num">'+data.data[x].resNum+'</span>人预约</div></div></div><div class="bc-right"><img src="'+data.data[x].ornament+'" class="br-img" alt="" /><p class="br-txt">'+data.data[x].content+'</p><del class="yuan-price">'+'¥'+data.data[x].cost+'</del><span class="xian-price">'+'¥'+data.data[x].discount.cost+'</span></div></li>');
				}
			}
		};
		if(data.code == 1){
			alert(data.data.error);	
		}
	});
}
