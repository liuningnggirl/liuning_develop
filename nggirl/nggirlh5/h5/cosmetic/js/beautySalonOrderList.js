$(function(){
	//tab切换
	$('.box-title>span').click(function(e) {
		$('.box-content>div').eq($(this).index()).show().siblings().hide();
		$(this).addClass('current').siblings().removeClass('current');
    });
	
	//点击“进行中”切换tab
	$('.bt-ing').click(function(e) {
		getMessageFn($('.bc-left ul'),1);
    });
	
	//点击“待评价”切换tab
	$('.bt-ping').click(function(e) {
		getMessageFn($('.bc-center ul'),2);
    });
	
	//点击“已完成”切换tab
	$('.bt-success').click(function(e) {
		getMessageFn($('.bc-right ul'),3);
    });
	
	//获取“进行中”数据
	getMessageFn($('.bc-left ul'),1);
	
	//获取美妆沙龙中进行中和待评价数目
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/salon/reservation/getReservationNum/1.3',getFinalRequestObject({accessToken: getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.notEvaluated == 0){
				$('.bt-ping .bc-num').hide();
			}else{
				$('.bt-ping .bc-num').html(data.data.notEvaluated);
			}
			if(data.data.running == 0){
				$('.bt-ing .bc-num').hide();
			}else{
				$('.bt-ing .bc-num').html(data.data.running);
			}
		};
		if(data.code == 1){
			alert(data.data.error);
		};
	});
	
	//点击“我的订单”里面的每个订单信息
	$('.box-content ul').delegate("li","click",function(){
        window.location.href="beautySalonOrderInformation.html?unionResId="+$(this).attr('unionResId')+'&resType='+$(this).attr('resType')+'&v=<%= VERSION %>';
    });
});

function getMessageFn(box,reservationStatus){
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/salon/reservation/list/1.3.2',getFinalRequestObject({accessToken: getAccessToken(), reservationStatus:reservationStatus}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			//判断是否加载到数据
			if(data.data.length == 0){
				box.parent().children('.bc-no-message').show();
			};
			//清空之前加载的项
			box.children('li').remove();
			for(var x = 0; x < data.data.length; x ++){
				//判断订单状态7时时灰色title
				if(data.data[x].resStatus == 7){
					box.append('<li unionResId="'+data.data[x].unionResId+'" resType="'+data.data[x].resType+'"><div class="bl-title bl-gray">'+data.data[x].statusDesc+'</div><div class="bl-content"><div class="left"><img src="'+data.data[x].productCover+'" alt="" /></div><div class="right"><div class="right-title">'+data.data[x].productTitle+'</div><span class="rt-cost">活动费用：</span><span class="rt-yuan">'+data.data[x].price+'</span><span class="rt-str">元</span><div class="rt-date">'+data.data[x].resTime+'</div></div></div></li>');
				}else if(data.data[x].resStatus == 6){
					box.append('<li unionResId="'+data.data[x].unionResId+'" resType="'+data.data[x].resType+'"><div class="bl-title">'+data.data[x].statusDesc+'</div><div class="bl-content"><div class="left"><img src="'+data.data[x].productCover+'" alt="" /></div><div class="right"><div class="right-title">'+data.data[x].productTitle+'</div><span class="rt-cost">活动费用：</span><span class="rt-yuan">'+data.data[x].price+'</span><span class="rt-str">元</span><div class="rt-date">'+data.data[x].resTime+'</div></div></div><img src="images/order_img01.png" class="status-img" alt="" /></li>');
				}else if(data.data[x].resStatus == 8){
					box.append('<li unionResId="'+data.data[x].unionResId+'" resType="'+data.data[x].resType+'"><div class="bl-title bl-gray">'+data.data[x].statusDesc+'</div><div class="bl-content"><div class="left"><img src="'+data.data[x].productCover+'" alt="" /></div><div class="right"><div class="right-title">'+data.data[x].productTitle+'</div><span class="rt-cost">活动费用：</span><span class="rt-yuan">'+data.data[x].price+'</span><span class="rt-str">元</span><div class="rt-date">'+data.data[x].resTime+'</div></div></div><img src="images/order-tui_03.png" class="status-img" alt="" /></li>');
				}else{
					box.append('<li unionResId="'+data.data[x].unionResId+'" resType="'+data.data[x].resType+'"><div class="bl-title">'+data.data[x].statusDesc+'</div><div class="bl-content"><div class="left"><img src="'+data.data[x].productCover+'" alt="" /></div><div class="right"><div class="right-title">'+data.data[x].productTitle+'</div><span class="rt-cost">活动费用：</span><span class="rt-yuan">'+data.data[x].price+'</span><span class="rt-str">元</span><div class="rt-date">'+data.data[x].resTime+'</div></div></div></li>');
				}
			}
		};
		if(data.code == 1){
			alert(data.data.error);
		};
	});
}