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
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/getReservationNum/1.4.2',getFinalRequestObject({accessToken: getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.reservationNum.notEvaluated == 0){
				$('.bt-ping .bc-num').hide();
			}else{
				$('.bt-ping .bc-num').html(data.data.reservationNum.notEvaluated);
				$('.bt-ping .bc-num').width($('.bt-ping .bc-num').height());
			}
			if(data.data.reservationNum.running == 0){
				$('.bt-ing .bc-num').hide();
			}else{
				$('.bt-ing .bc-num').html(data.data.reservationNum.running);
				$('.bt-ing .bc-num').width($('.bt-ing .bc-num').height());
			}
		};
		if(data.code == 1){
			alert(data.data.error);
		};
	});
	
	//点击“我的订单”里面的每个订单信息
	$('.box-content ul').delegate("li","click",function(){
		var redirectUrl;
		var reservationId = $(this).attr('reservationId')
		if(isInWeixin()){
			redirectUrl = getWeixinLinkUrl(reservationId);
			window.location.href=redirectUrl;
		}else{
			redirectUrl =  getZhifuBaoLinkUrl(reservationId);
			window.location.href=redirectUrl;
		}
       
    });
	function getWeixinLinkUrl(reservationId){
		var redirectUri = encodeURIComponent(getZhifuBaoLinkUrl(reservationId));
		var scope = 'snsapi_base';
		var state = "weixinpay";
		var appid = getFwhAppId();//由param.js初始化
		return "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri="
			+redirectUri+"&response_type=code&scope="+scope+"&state="+state+"#wechat_redirect";
	}
	
	function getZhifuBaoLinkUrl(reservationId){
		var str = "<%= WEIXIN_BOUND_DOMAIN_URL %>/nggirl/h5/cosmetic/orderInformation.html?reservationId="
		+ reservationId+'&v=<%= VERSION %>';
		if(window.location.protocol == 'https:'){
			return str;
		}else{
			return 'http:' + str.substring(6)	
		}
	}
});

function getMessageFn(box,reservationType){
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/listReservation/1.4.2',getFinalRequestObject({accessToken: getAccessToken(), reservationType:reservationType}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			var reservations = data.data.reservations;
			//判断是否加载到数据
			if(reservations.length == 0){
				box.parent().children('.bc-no-message').show();
			};
			//清空之前加载的项
			box.children('li').remove();
			for(var x = 0; x < reservations.length; x ++){
				if(reservations[x].status == 1 || reservations[x].status == 5){
					box.append('<li reservationId="'+reservations[x].reservationId+'" status="'+reservations[x].status+'"><div class="bl-title bl-gray">'+getStatusDesc(reservations[x].status,reservations[x].praised)+'</div><div class="bl-content"><div class="left"><img src="'+reservations[x].cover+'" alt="" /></div><div class="right"><div class="right-title">预约<span>'+reservations[x].name+'</span>化妆师的<span>'+reservations[x].workType+'</span></div><span class="rt-cost">化妆费用：</span><span class="rt-yuan">¥'+reservations[x].cost+'</span><span class="rt-str">元</span><div class="rt-date">'+reservations[x].reservationTime+'</div></div></div><img src="images/order_img03.png" class="status-img" alt="" /></li>');
				}else if(reservations[x].status == 2 || reservations[x].status == 3){
					box.append('<li reservationId="'+reservations[x].reservationId+'" status="'+reservations[x].status+'"><div class="bl-title bl-gray">'+getStatusDesc(reservations[x].status,reservations[x].praised)+'</div><div class="bl-content"><div class="left"><img src="'+reservations[x].cover+'" alt="" /></div><div class="right"><div class="right-title">预约<span>'+reservations[x].name+'</span>化妆师的<span>'+reservations[x].workType+'</span></div><span class="rt-cost">化妆费用：</span><span class="rt-yuan">¥'+reservations[x].cost+'</span><span class="rt-str">元</span><div class="rt-date">'+reservations[x].reservationTime+'</div></div></div><img src="images/order_img02.png" class="status-img" alt="" /></li>');
				}else if(reservations[x].status == 4){
					box.append('<li reservationId="'+reservations[x].reservationId+'" status="'+reservations[x].status+'"><div class="bl-title">'+getStatusDesc(reservations[x].status,reservations[x].praised)+'</div><div class="bl-content"><div class="left"><img src="'+reservations[x].cover+'" alt="" /></div><div class="right"><div class="right-title">预约<span>'+reservations[x].name+'</span>化妆师的<span>'+reservations[x].workType+'</span></div><span class="rt-cost">化妆费用：</span><span class="rt-yuan">¥'+reservations[x].cost+'</span><span class="rt-str">元</span><div class="rt-date">'+reservations[x].reservationTime+'</div></div></div></li>');
				}else if(reservations[x].status == 6){
					box.append('<li reservationId="'+reservations[x].reservationId+'" status="'+reservations[x].status+'"><div class="bl-title">'+getStatusDesc(reservations[x].status,reservations[x].praised)+'</div><div class="bl-content"><div class="left"><img src="'+reservations[x].cover+'" alt="" /></div><div class="right"><div class="right-title">预约<span>'+reservations[x].name+'</span>化妆师的<span>'+reservations[x].workType+'</span></div><span class="rt-cost">化妆费用：</span><span class="rt-yuan">¥'+reservations[x].cost+'</span><span class="rt-str">元</span><div class="rt-date">'+reservations[x].reservationTime+'</div></div></div></li>');
				}else if(reservations[x].status == 7){
					box.append('<li reservationId="'+reservations[x].reservationId+'" status="'+reservations[x].status+'"><div class="bl-title ">'+getStatusDesc(reservations[x].status,reservations[x].praised)+'</div><div class="bl-content"><div class="left"><img src="'+reservations[x].cover+'" alt="" /></div><div class="right"><div class="right-title">预约<span>'+reservations[x].name+'</span>化妆师的<span>'+reservations[x].workType+'</span></div><span class="rt-cost">化妆费用：</span><span class="rt-yuan">¥'+reservations[x].cost+'</span><span class="rt-str">元</span><div class="rt-date">'+reservations[x].reservationTime+'</div></div></div></li>');
				}else if(reservations[x].status == 8){
					box.append('<li reservationId="'+reservations[x].reservationId+'" status="'+reservations[x].status+'"><div class="bl-title ">'+getStatusDesc(reservations[x].status,reservations[x].praised)+'</div><div class="bl-content"><div class="left"><img src="'+reservations[x].cover+'" alt="" /></div><div class="right"><div class="right-title">预约<span>'+reservations[x].name+'</span>化妆师的<span>'+reservations[x].workType+'</span></div><span class="rt-cost">化妆费用：</span><span class="rt-yuan">¥'+reservations[x].cost+'</span><span class="rt-str">元</span><div class="rt-date">'+reservations[x].reservationTime+'</div></div></div></li>');
				}else if(reservations[x].status == 9 && reservations[x].praised == 0){
					box.append('<li reservationId="'+reservations[x].reservationId+'" status="'+reservations[x].status+'"><div class="bl-title ">'+getStatusDesc(reservations[x].status,reservations[x].praised)+'</div><div class="bl-content"><div class="left"><img src="'+reservations[x].cover+'" alt="" /></div><div class="right"><div class="right-title">预约<span>'+reservations[x].name+'</span>化妆师的<span>'+reservations[x].workType+'</span></div><span class="rt-cost">化妆费用：</span><span class="rt-yuan">¥'+reservations[x].cost+'</span><span class="rt-str">元</span><div class="rt-date">'+reservations[x].reservationTime+'</div></div></div></li>');
				}else if(reservations[x].status == 9 && reservations[x].praised == 1){
					box.append('<li reservationId="'+reservations[x].reservationId+'" status="'+reservations[x].status+'"><div class="bl-title ">'+getStatusDesc(reservations[x].status,reservations[x].praised)+'</div><div class="bl-content"><div class="left"><img src="'+reservations[x].cover+'" alt="" /></div><div class="right"><div class="right-title">预约<span>'+reservations[x].name+'</span>化妆师的<span>'+reservations[x].workType+'</span></div><span class="rt-cost">化妆费用：</span><span class="rt-yuan">¥'+reservations[x].cost+'</span><span class="rt-str">元</span><div class="rt-date">'+reservations[x].reservationTime+'</div></div></div><img src="images/order_img01.png" class="status-img" alt="" /></li>');
				}else if(reservations[x].status == 10 && reservations[x].praised == 0){
					box.append('<li reservationId="'+reservations[x].reservationId+'" status="'+reservations[x].status+'"><div class="bl-title ">'+getStatusDesc(reservations[x].status,reservations[x].praised)+'</div><div class="bl-content"><div class="left"><img src="'+reservations[x].cover+'" alt="" /></div><div class="right"><div class="right-title">预约<span>'+reservations[x].name+'</span>化妆师的<span>'+reservations[x].workType+'</span></div><span class="rt-cost">化妆费用：</span><span class="rt-yuan">¥'+reservations[x].cost+'</span><span class="rt-str">元</span><div class="rt-date">'+reservations[x].reservationTime+'</div></div></div></li>');
				}else if(reservations[x].status == 10 && reservations[x].praised == 1){
					box.append('<li reservationId="'+reservations[x].reservationId+'" status="'+reservations[x].status+'"><div class="bl-title ">'+getStatusDesc(reservations[x].status,reservations[x].praised)+'</div><div class="bl-content"><div class="left"><img src="'+reservations[x].cover+'" alt="" /></div><div class="right"><div class="right-title">预约<span>'+reservations[x].name+'</span>化妆师的<span>'+reservations[x].workType+'</span></div><span class="rt-cost">化妆费用：</span><span class="rt-yuan">¥'+reservations[x].cost+'</span><span class="rt-str">元</span><div class="rt-date">'+reservations[x].reservationTime+'</div></div></div><img src="images/order_img01.png" class="status-img" alt="" /></li>');
				}else if(reservations[x].status == 11){
					box.append('<li reservationId="'+reservations[x].reservationId+'" status="'+reservations[x].status+'"><div class="bl-title ">'+getStatusDesc(reservations[x].status,reservations[x].praised)+'</div><div class="bl-content"><div class="left"><img src="'+reservations[x].cover+'" alt="" /></div><div class="right"><div class="right-title">预约<span>'+reservations[x].name+'</span>化妆师的<span>'+reservations[x].workType+'</span></div><span class="rt-cost">化妆费用：</span><span class="rt-yuan">¥'+reservations[x].cost+'</span><span class="rt-str">元</span><div class="rt-date">'+reservations[x].reservationTime+'</div></div></div></li>');
				}else if(reservations[x].status == 12){
					box.append('<li reservationId="'+reservations[x].reservationId+'" status="'+reservations[x].status+'"><div class="bl-title bl-gray">'+getStatusDesc(reservations[x].status,reservations[x].praised)+'</div><div class="bl-content"><div class="left"><img src="'+reservations[x].cover+'" alt="" /></div><div class="right"><div class="right-title">预约<span>'+reservations[x].name+'</span>化妆师的<span>'+reservations[x].workType+'</span></div><span class="rt-cost">化妆费用：</span><span class="rt-yuan">¥'+reservations[x].cost+'</span><span class="rt-str">元</span><div class="rt-date">'+reservations[x].reservationTime+'</div></div></div><img src="images/order-tui_03.png" class="status-img" alt="" /></li>');
				}else{
					box.append('<li reservationId="'+reservations[x].reservationId+'" status="'+reservations[x].status+'"><div class="bl-title bl-red">'+getStatusDesc(reservations[x].status,reservations[x].praised)+'</div><div class="bl-content"><div class="left"><img src="'+reservations[x].cover+'" alt="" /></div><div class="right"><div class="right-title">预约<span>'+reservations[x].name+'</span>化妆师的<span>'+reservations[x].workType+'</span></div><span class="rt-cost">化妆费用：</span><span class="rt-yuan">¥'+reservations[x].cost+'</span><span class="rt-str">元</span><div class="rt-date">'+reservations[x].reservationTime+'</div></div></div></li>');
				}
			}
		};
		if(data.code == 1){
			alert(data.data.error);
		};
	});
}

//状态提示信息
function getStatusDesc(status,praised){
	var desc = '';
	if(status == 0){
		desc = '化妆师确认中，请小主耐心等待';
	}else if(status == 1 || status == 5){
		desc = '小主已取消订单，不再看看了么？';
	}else if(status == 2 || status == 3){
		desc = '化妆师未能接单，请小主重新挑选';
	}else if(status == 4){
		desc = '化妆师已接单，请小主付费打赏';	
	}else if(status == 6){
		desc = '谢小主的赏金，请等待化妆师上门';	
	}else if(status == 7){
		desc = '请小主安心享用美丽服务';	
	}else if(status == 8){
		desc = '服务结束，请小主确认完成';	
	}else if(status == 9){
		if(praised == 0)
		desc = '请美丽的小主为本次服务点评';
		else
		desc = '谢小主评价，期待与小主再次相遇';
	}else if(status == 10){
		if(praised == 0)
		desc = '请美丽的小主为本次服务点评';
		else
		desc = '谢小主评价，期待与小主再次相遇';
	}else if(status == 11){
		desc = '退款中，请小主耐心等待';	
	}else if(status == 12){
		desc = '退款成功，南瓜姑娘会不断努力';	
	}
	return desc;
}
