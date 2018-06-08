$(function(){
	var str = window.location.href ;
	console.log(str.substring(0,str.length -14));
	/*getUserAddress();*/
	//点击知道了按钮关闭第三方优惠券弹窗
	$('.sm_ok,.close,.gray_three').click(function(e) {
        $('.gray_three').fadeOut();
		var str = window.location.href.replace(/details/,"list")+'&orderId='+$('.content').attr('orderId');
		window.location.href = str;
    });
		
	$('.content_cover').height($(window).width() * 2/3);
	
	//如果是第三方兑换码
	if(getParam('goodsType') == 2){
		$('.yunfei').hide();	
	}else{
		$('.yunfei').show();	
	}
							
	//判断页面入口
	if(getParam('pageType') == "list"){
		if(getParam('goodsType') == 2){
			$('.voucher,.details_use').show();
			//设置邀请码行高
			$('.voucher_code').css('line-height',$('.voucher_back').height()+'px');
			//设置邀请码左边距离
			$('.voucher_code').width($('.voucher_back').width()).css({'left':'50%','margin-left':-$('.voucher_back').width()/2});
			$('.btn').addClass('gray_btn').html('已兑换').hide();
		}else{
			$('.voucher,.details_use').hide();	
			$('.btn').addClass('gray_btn').html('已兑换');
		}
		//获取兑换详情V2.5.3
		$.get('<%= UGC_HOST_API_URL %>/nggirl/app/cli/scoreshop/getGoodsDetail/2.5.6',getFinalRequestObject({accessToken:getAccessToken(),goodsId:getParam('goodsId'),goodsType:getParam('goodsType'),orderId:getParam('orderId')}),function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.content_cover img').attr('src',data.data.headImg);//商品详情头
				$('.content_cover img').attr('goodsimg',data.data.shareImg);//商品图
				$('.cm_txt').html(data.data.name);//商品名称
				$('title').html(data.data.name);
				//判断是否有折扣
				if(data.data.isDiscount == 0){//0没折扣
					$('.integral_num').html(data.data.costScore);//需要花费积分
				};
				if(data.data.isDiscount == 1){//1有折扣
					$('.integral_num').html(data.data.costScore);//需要花费积分
					$('.integral_del_num').html(data.data.originCostScore);
				};
				$('.right .num span').html(data.data.storeNum);//库存数量
				//判断运费是否为包邮
				if(data.data.freight == 0){
					$('.right .type').html('包邮').attr('freight',data.data.freight);
				}else{
					$('.right .type').html(data.data.freight+'元').attr('freight',data.data.freight);	
				}
				$('.time .start').html(getLocalTime1(data.data.startTime)+'至');
				$('.time .end').html(getLocalTime1(data.data.endTime));
				$('.voucher_code').html(data.data.thirdCode);
				
				//礼品详情说明判断是段落还是图片
				for(var x = 0; x < data.data.goodsDetail.length; x ++){
					if(data.data.goodsDetail[x].type == 2){//段落
						//如果段落为空则不添加
						if(data.data.goodsDetail[x].content != ''){
							$('.details .details_content').append('<p class="dc_message">'+data.data.goodsDetail[x].content+'</p>');
						};
					};
					if(data.data.goodsDetail[x].type == 3){//图片
						$('.details .details_content').append('<img data-original="'+data.data.goodsDetail[x].content+'" class="dc_cover lazy" alt="" />');
					};
				}
				
				//使用说明判断是段落还是图片
				for(var x = 0; x < data.data.instructions.length; x ++){
					if(data.data.instructions[x].type == 2){//段落
						//如果段落为空则不添加
						if(data.data.instructions[x].content != ''){
							$('.details_use .details_content').append('<p class="dc_message">'+data.data.instructions[x].content+'</p>');
						};
					};
					if(data.data.instructions[x].type == 3){//图片
						$('.details_use .details_content').append('<img data-original="'+data.data.instructions[x].content+'" class="dc_cover lazy" alt="" />');
					};
				}
				$("img.lazy").lazyload({effect : "fadeIn"});
				
				$('.content').attr('exchangeTime',data.data.exchangeTime);//可兑换次数
				$('.content').attr('fitUserRole',data.data.fitUserRole);//适用人群（所有用户，南瓜小编，客座小编，南瓜CEO）
				$('.content').attr('fitType',data.data.fitType);//适用类型：0或，1与
				$('.content').attr('costScore',data.data.costScore);//需要花费积分
				$('.content').attr('userScore',data.data.userScore);//获取当前用户积分
				$('.content').attr('fitUserLevel',data.data.fitUserLevel);//试用用户等级
				$('.content').attr('userLevel',data.data.userLevel);//用户等级
				$('.content').attr('isExchanged',data.data.isExchanged);//该用户是否已兑换此商品：0未兑换，1已兑换
				$('.content').attr('isFitUserRole',data.data.isFitUserRole);//该用户角色是否适用于此商品：0不适用，1适用
				$('.content').attr('isLeverHigh',data.data.isLeverHigh);//用户等级是否足够高兑换此商品：0不足，1足够
				$('.content').attr('unionGoodsId',data.data.unionGoodsId);//商品联合id
				$('.content').attr('goodsId',data.data.goodsId);//商品编号
				$('.content').attr('goodsType',data.data.goodsType);//商品类型：0普通商品，1补签卡
				$('.content').attr('freight',data.data.freight);//邮费
							
				//判断页面入口
				if(getParam('pageType') == "list"){
					$('.btn').addClass('gray_btn').html('已兑换');
				}else{
					//判断当前商品兑换状态  1还未开始兑换,2库存不足,3可兑换,4兑换活动时间结束
					if(data.data.status == 1){
						$('.btn').addClass('gray_btn gray_btn_1').html(getLocalTime(data.data.startTime)+'&nbsp;&nbsp;&nbsp;开始兑换');
						$(".cm_activity,.cm_activity .start,.cm_activity .end").addClass("greyColor");
					}else if(data.data.status == 2){
						$('.btn').addClass('gray_btn gray_btn_2').html('礼品已经木有了');
					}else if(data.data.status == 3){
						$('.btn').addClass('gray_btn_3').html('立即兑换');
					}else if(data.data.status == 4){
						$('.btn').addClass('gray_btn gray_btn_4').html('兑换活动时间已结束');
						$(".cm_activity,.cm_activity .start,.cm_activity .end").addClass("greyColor");
					}else{
						$('.btn').hide();	
					};
				}
				
				
				//微信分享
				if(isInWeixin()){
					var str = window.location.href;
					var title = '【南瓜姑娘】'+ data.data.name;
					var desc = '我在南瓜姑娘，用积分换好礼，心动了嘛~？';
					var link = str.substring(0,str.length -14);
					var imgUrl = data.data.shareImg;
					var from = getParam('apptype');
					if(!strIsEmpty(from) && from == 'appb'){
						desc = '我在南瓜姑娘，用积分换好礼，心动了嘛~？';
					}
					weixinConfig(title,desc,link,imgUrl);
				}
				
				var href = window.location.href;
				href = href.substring(0,href.length -14);
				//h5,app同步分享内容
				if(isInApp()){
					window.shareTitle = '【南瓜姑娘】'+ data.data.name;
					window.shareContent = '我在南瓜姑娘，用积分换好礼，心动了嘛~？';
					window.sharePicture = data.data.shareImg;
					window.shareUrl = href;
				};	
				//给安卓传值
				if(typeof(window.ngjsInterface)!="undefined" && typeof(window.ngjsInterface.conFigShareInfo)!="undefined"){
					window.ngjsInterface.conFigShareInfo('【南瓜姑娘】'+ data.data.name, '我在南瓜姑娘，用积分换好礼，心动了嘛~？',data.data.shareImg,href);
				};
			}else{
				alert(data.data.error);	
			}
		});
	}else{
		//获取商品详情V2.5.2
		$.get('<%= UGC_HOST_API_URL %>/nggirl/app/cli/scoreshop/getGoodsDetail/2.5.6',getFinalRequestObject({accessToken:getAccessToken(),goodsId:getParam('goodsId'),goodsType:getParam('goodsType')}),function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.content_cover img').attr('src',data.data.headImg);//商品详情头
				$('.content_cover img').attr('goodsimg',data.data.shareImg);//商品图
				$('.cm_txt').html(data.data.name);//商品名称
				$('title').html(data.data.name);
				//判断是否有折扣
				if(data.data.isDiscount == 0){//0没折扣
					$('.integral_num').html(data.data.costScore);//需要花费积分
				};
				if(data.data.isDiscount == 1){//1有折扣
					$('.integral_num').html(data.data.costScore);//需要花费积分
					$('.integral_del_num').html(data.data.originCostScore);
				};
				$('.right .num span').html(data.data.storeNum);//库存数量
				//判断运费是否为包邮
				if(data.data.freight == 0){
					$('.right .type').html('包邮').attr('freight',data.data.freight);
				}else{
					$('.right .type').html(data.data.freight+'元').attr('freight',data.data.freight);	
				}
				$('.time .start').html(getLocalTime1(data.data.startTime)+'至');
				$('.time .end').html(getLocalTime1(data.data.endTime));
				
				//判断是段落还是图片
				for(var x = 0; x < data.data.goodsDetail.length; x ++){
					if(data.data.goodsDetail[x].type == 2){//段落
						//如果段落为空则不添加
						if(data.data.goodsDetail[x].content != ''){
							$('.details .details_content').append('<p class="dc_message">'+data.data.goodsDetail[x].content+'</p>');
						};
					};
					if(data.data.goodsDetail[x].type == 3){//图片
						$('.details .details_content').append('<img data-original="'+data.data.goodsDetail[x].content+'" class="dc_cover lazy" alt="" />');
					};
				}
				$("img.lazy").lazyload({effect : "fadeIn"});
				
				$('.content').attr('exchangeTime',data.data.exchangeTime);//可兑换次数
				$('.content').attr('fitUserRole',data.data.fitUserRole);//适用人群（所有用户，南瓜小编，客座小编，南瓜CEO）
				$('.content').attr('fitType',data.data.fitType);//适用类型：0或，1与
				$('.content').attr('costScore',data.data.costScore);//需要花费积分
				$('.content').attr('userScore',data.data.userScore);//获取当前用户积分
				$('.content').attr('fitUserLevel',data.data.fitUserLevel);//试用用户等级
				$('.content').attr('userLevel',data.data.userLevel);//用户等级
				$('.content').attr('isExchanged',data.data.isExchanged);//该用户是否已兑换此商品：0未兑换，1已兑换
				$('.content').attr('isFitUserRole',data.data.isFitUserRole);//该用户角色是否适用于此商品：0不适用，1适用
				$('.content').attr('isLeverHigh',data.data.isLeverHigh);//用户等级是否足够高兑换此商品：0不足，1足够
				$('.content').attr('unionGoodsId',data.data.unionGoodsId);//商品联合id
				$('.content').attr('goodsId',data.data.goodsId);//商品编号
				$('.content').attr('goodsType',data.data.goodsType);//商品类型：0普通商品，1补签卡
				$('.content').attr('name',data.data.name);//商品名
		
				//判断当前商品兑换状态  1还未开始兑换,2库存不足,3可兑换,4兑换活动时间结束
				if(data.data.status == 1){
					$('.btn').addClass('gray_btn gray_btn_1').html(getLocalTime(data.data.startTime)+'&nbsp;&nbsp;&nbsp;开始兑换');
					$(".cm_activity,.cm_activity .start,.cm_activity .end").addClass("greyColor");
				}else if(data.data.status == 2){
					$('.btn').addClass('gray_btn gray_btn_2').html('礼品已经木有了');
				}else if(data.data.status == 3){
					$('.btn').addClass('gray_btn_3').html('立即兑换');
				}else if(data.data.status == 4){
					$('.btn').addClass('gray_btn gray_btn_4').html('兑换活动时间已结束');
					$(".cm_activity,.cm_activity .start,.cm_activity .end").addClass("greyColor");
				}else{
					$('.btn').hide();	
				};
				//微信分享
				if(isInWeixin()){
					var str = window.location.href;
					var title = '【南瓜姑娘】'+ data.data.name;
					var desc = '我在南瓜姑娘，用积分换好礼，心动了嘛~？';
					var link = str.substring(0,str.length -14);
					var imgUrl = data.data.shareImg;
					var from = getParam('apptype');
					if(!strIsEmpty(from) && from == 'appb'){
						desc = '我在南瓜姑娘，用积分换好礼，心动了嘛~？';
					}
					weixinConfig(title,desc,link,imgUrl);
				}	
				var href = window.location.href;
				href = href.substring(0,href.length -14);
				//h5,app同步分享内容
				if(isInApp()){
					window.shareTitle = '【南瓜姑娘】'+ data.data.name;
					window.shareContent = '我在南瓜姑娘，用积分换好礼，心动了嘛~？';
					window.sharePicture = data.data.picture;
					window.shareUrl = href;
				};	
				//给安卓传值
				if(typeof(window.ngjsInterface)!="undefined" && typeof(window.ngjsInterface.conFigShareInfo)!="undefined"){
					window.ngjsInterface.conFigShareInfo('【南瓜姑娘】'+ data.data.name, '我在南瓜姑娘，用积分换好礼，心动了嘛~？',data.data.shareImg,href);
				};
			}else{
				alert(data.data.error);	
			}
		});
	}
	
	//点击弹框里面的知道了
	$('.btn_ok,.gray').click(function(e) {
        $('.gray').fadeOut();
		$('body').css('overflow','auto');
    });
	
	//确认兑换V2.5.2
	$('.btn').click(function(e) {
		var isFitUserRole= $('.content').attr('isFitUserRole');
		var isLeverHigh = $('.content').attr('isLeverHigh');
        if($(this).hasClass('gray_btn_3') > 0){
			//判断是否登录
			checkAccessTokenLogin(function () {
				//判断是否兑换过该礼品
				if($('.content').attr('isExchanged') == 0){//未兑换
					//判断适用类型：0或，1与
					if($('.content').attr('fitType') == 0){
						if(isFitUserRole == 0 && isLeverHigh == 0){
							$('.gray_btn_double .integral_window .iw_content').html('您当前等级为LV'+$('.content').attr('userLevel')+'，暂时还不可以兑换等级为LV'+$('.content').attr('fitUserLevel')+'的礼品哦，赶快去赚取积分吧~');
							$('.gray_btn_double').show();
							$('.gray_btn_double .integral_window').css('margin-top',($(window).height() - $('.gray_btn_double .integral_window').height())/2);	
						}else{
							//判断用户当前积分是否够兑换该商品
							if(($('.content').attr('userScore') - $('.content').attr('costScore')) > 0){
								var total = $('.content').attr('costScore');
								$('.gray_btn_double_ok .integral_window .iw_content').html('您当前积分'+$('.content').attr('userScore')+'，兑换礼品需要消耗'+total+'积分，确认兑换？');
								$('.gray_btn_double_ok').show();
								$('.gray_btn_double_ok .integral_window').css('margin-top',($(window).height() - $('.gray_btn_double_ok .integral_window').height())/2);
							}else{
								$('.gray_btn_double .integral_window .iw_content').html('您当前积分只有'+$('.content').attr('userScore')+'，兑换商品尚且不足，赶快去赚取积分吧~');
								$('.gray_btn_double').show();
								$('.gray_btn_double .integral_window').css('margin-top',($(window).height() - $('.gray_btn_double .integral_window').height())/2);
							}
						}
					};
					if($('.content').attr('fitType') == 1){
						if(isFitUserRole == 1 && isLeverHigh == 1){
							//判断用户当前积分是否够兑换该商品
							if(($('.content').attr('userScore') - $('.content').attr('costScore')) > 0){
								var total =$('.content').attr('costScore');
								$('.gray_btn_double_ok .integral_window .iw_content').html('您当前积分'+$('.content').attr('userScore')+'，兑换礼品需要消耗'+total+'积分，确认兑换？');
								$('.gray_btn_double_ok').show();
								$('.gray_btn_double_ok .integral_window').css('margin-top',($(window).height() - $('.gray_btn_double_ok .integral_window').height())/2);
							}else{
								$('.gray_btn_double .integral_window .iw_content').html('您当前积分只有'+$('.content').attr('userScore')+'，兑换商品尚且不足，赶快去赚取积分吧~');
								$('.gray_btn_double').show();
								$('.gray_btn_double .integral_window').css('margin-top',($(window).height() - $('.gray_btn_double .integral_window').height())/2);
							}
						}else{
							if( isLeverHigh == 0){
								$('.gray_btn_double .integral_window .iw_content').html('您当前等级为LV'+$('.content').attr('userLevel')+'，暂时还不可以兑换等级为LV'+$('.content').attr('fitUserLevel')+'的礼品哦，赶快去赚取积分吧~');
								$('.gray_btn_double').show();
								$('.gray_btn_double .integral_window').css('margin-top',($(window).height() - $('.gray_btn_double .integral_window').height())/2);
							}else if( isFitUserRole == 0){
								$('.gray .integral_window .iw_content').html('好可惜哦，此礼品只对'+$('.content').attr('fitUserRole')+'开放兑换，您可以向我们投稿，投稿成功后便可专享兑换礼品权限呢~');
								$('.gray').show();
								$('.gray .integral_window').css('margin-top',($(window).height() - $('.gray .integral_window').height())/2);
							}
						}
					};
				};
				if($('.content').attr('isExchanged') == 1){//已兑换
					$('.gray .integral_window .iw_content').html('礼物虽好但每个人也只能兑换'+$('.content').attr('exchangeTime')+'次的，再看看其它礼物吧~');
					$('.gray').show();
					$('.gray .integral_window').css('margin-top',($(window).height() - $('.gray .integral_window').height())/2);
				};
			},'integralMallIndexDetails.html?v=<%= VERSION %>&goodsType='+getParam('goodsType')+'&goodsId='+getParam('goodsId')+'&pageType=details');
		}
    });
	
	//点击暂时不去按钮
	$('.gray_btn_double .integral_btn .btn_left,.gray_btn_double').click(function(e) {
        $('.gray_btn_double').fadeOut();
    });
	
	//点击弹框取消按钮
	$('.gray_btn_double_ok .integral_btn .btn_left,.gray_btn_double_ok').click(function(e) {
        $('.gray_btn_double_ok').fadeOut();
    });
	
	//点击礼品头图查看大图
	$('.content_cover').click(function(e) {
        $('.gray_big_img img').attr('src',$(this).children('img').attr('src'));
		$('.gray_big_img').fadeIn();
		$('.gray_big_img img').css('margin-top',($(window).height()- $('.gray_big_img img').height())/2);
    });
	
	//点击礼品头图弹框消失
	$('.gray_big_img,.gray_big_img img').click(function(e) {
        $('.gray_big_img').fadeOut();
    });
	
	//点击去赚取
	$('.gray_btn_double .integral_window .btn_right').click(function(e) {
        window.location.href= "index.html?v=<%= VERSION %>";
    });
	
	//点击确定按钮，确认兑换
	$('.gray_btn_double_ok .integral_btn .btn_right').click(function(e) {
		//判断是普通商品还是第三方优惠券
		if(getParam('goodsType') == 0){//普通商品
			window.location.href = "integralMallOrder.html?headImg="+
			$('.content_cover img').attr('goodsimg') +
			'&costScore='+ $('.integral_num').html() +
			'&name=' + $('.cm_txt').html() +
			'&freight=' +$('.cm_integral .right .type').attr('freight')+
			'&unionGoodsId='+ $('.content').attr('unionGoodsId')+
			'&goodsId='+ $('.content').attr('goodsId')+
			'&goodsType='+ $('.content').attr('goodsType')+
			'&exchangeTime='+ $('.content').attr('exchangeTime')+
			'&v=<%= VERSION %>';
		};
		if(getParam('goodsType') == 2){//第三方优惠券
			var param = getFinalRequestObject({
				accessToken:getAccessToken(),
				unionGoodsId:$('.content').attr('unionGoodsId'),//商品联合id
				goodsId:getParam('goodsId'),//商品编号
				goodsType:getParam('goodsType'),//商品类型：0普通商品，1补签卡
				costScore:$('.content').attr('costScore'),
				freight:$('.content').attr('freight'),
				exchangeTime:$('.content').attr('exchangeTime'),//每人允许兑换次数
				realName:$('.btn').attr('realName'),
				address:$('.btn').attr('address'),
				phoneNum:$('.btn').attr('phoneNum'),
				remark:''
			});
			$.post('<%= UGC_HOST_API_URL %>/nggirl/app/cli/scoreshop/commitExchange/2.5.3',param,function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					if (/iphone|ipad|ipod/.test(ua)) {
						_czc.push(['_trackEvent','nggirl_scoreshop_change','phoneType=iOS','兑换商品成功','goodId',getParam('goodsId')]);	
					} else if (/android/.test(ua)) {
						_czc.push(['_trackEvent','nggirl_scoreshop_change','phoneType=and','兑换商品成功','goodId',getParam('goodsId')]);
					};
					$('.gray_three,.voucher').show();
					$('.gt_img').css('margin-top',($('.gray_three').height()- $('.gt_img').height())/2);
					$('.gray_three .success_message').css('bottom',($(window).height() - $('.gray_three .success_message').height())/2 -120);
					$('.gray_gift_name').html($('.content').attr('name'));
					$('body').addClass('hiddenClass');
					/*$('.voucher_code').html(data.data.thirdCode);
					$('.btn').hide();
					//设置邀请码行高
					$('.voucher_code').css('line-height',$('.voucher_back').height()+'px');
					//设置邀请码左边距离
					$('.voucher_code').width($('.voucher_back').width()).css({'left':'50%','margin-left':-$('.voucher_back').width()/2});
					
					//使用说明判断是段落还是图片
					for(var x = 0; x < data.data.instructions.length; x ++){
						if(data.data.instructions.length > 0){
							if(data.data.goodsDetail[x].type == 2){//段落
								//如果段落为空则不添加
								if(data.data.goodsDetail[x].content != ''){
									$('.details_use .details_content').append('<p class="dc_message">'+data.data.goodsDetail[x].content+'</p>');
								};
							};
							if(data.data.goodsDetail[x].type == 3){//图片
								$('.details_use .details_content').append('<img data-original="'+data.data.goodsDetail[x].content+'" class="dc_cover lazy" alt="" />');
							};
						};
					}
					$("img.lazy").lazyload({effect : "fadeIn"});*/
					$('.content').attr('orderId',data.data.orderId);
					}else{
						alert(data.data.error);	
					}
			});	
		};
    });	
})

//时间格式化
function getLocalTime1(publishTime) {
    s = new Date(publishTime);
	var m=parseInt(s.getMonth() + 1);
	if(m<10){
		m="0"+m;
	}
	var day=parseInt(s.getDate());
	if(day<10){
		day="0"+day;
	};
    return (s.getFullYear() + "-" + m) + "-" +day ;
}

//时间格式化(获取分钟)
function getLocalTime(publishTime) {
    var d_minutes, d_hours, d_days;
    var timeNow = parseInt(new Date().getTime() / 1000);
    var d;
    d = timeNow - publishTime/1000;
    d_days = parseInt(d / 86400);
    d_hours = parseInt(d / 3600);
    d_minutes = parseInt(d / 60);
	var s = 0;
    s = new Date(publishTime);
    var sthours=parseInt(s.getHours());
	var nohours=parseInt(new Date().getHours());
	var m=parseInt(s.getMonth() + 1);
		if(m<10){
			m="0"+m;
			}
		var day=parseInt(s.getDate());
		if(day<10){
			day="0"+day;
			}
		 var hours=parseInt(s.getHours());
		if(hours<10){
			hours="0"+hours;
			}
		var minutes=parseInt(s.getMinutes());
		if(minutes<10){
			minutes="0"+minutes;
			}
    if (d_days <= 0 && d_hours >= 0 && nohours>=sthours) {
		if(nohours=sthours && d_hours>10){
			return (s.getFullYear() + "-" + m) + "-" +day ;
		}
		return (hours + ":" +  minutes) ;
    } else {
     return (s.getFullYear() + "-" + m) + "-" +day +' '+hours + ":" +  minutes;
    }
}

//获取用户收货地址V2.5.2
function getUserAddress(){
	$.get('<%= UGC_HOST_API_URL %>/nggirl/app/cli/scoreshop/getUserReciveAddess/2.5.2',getFinalRequestObject({accessToken:getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			$('.btn').attr({'address':data.data.address,'phoneNum':data.data.phoneNum,'realName':data.data.realName,'userId':data.data.userId});
		}else{
			alert(data.data.error);	
		}
	});
}



//微信分享
function weixinConfig(title,desc,link,imgUrl) {
    wx.ready(function(){
        //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
        wx.onMenuShareTimeline({
            title: title, // 分享标题
            link: link, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });


        //获取“分享给朋友”按钮点击状态及自定义分享内容接口
        wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: link, // 分享链接
            imgUrl: imgUrl, // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
    });
    var currenturl =window.location.href;
    //初始化配置信息
    $.ajax({
        url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/weixinjs/config',
        type: 'post',
        dataType: 'json',
        data: getFinalRequestObject({url: currenturl, accessToken: getAccessToken()}),
        success: function (data) {
            //初始化配置
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.data.appId, // 必填，公众号的唯一标识
                timestamp: data.data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.data.noncestr, // 必填，生成签名的随机串
                signature: data.data.signature,// 必填，签名，见附录1
                jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        }
    });
}


