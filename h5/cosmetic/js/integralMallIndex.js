var page = 0;
$(function(){
	
	//获取轮播图
	$.get('<%= UGC_HOST_API_URL %>/nggirl/app/cli/scoreshop/listHeadScroll/2.5.2',getFinalRequestObject({accessToken:getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			var str = '';
			for(var x = 0; x < data.data.length; x ++){
				if(x==0){
					$('.slider ul').append('<li><a href="'+data.data[x].webpageUrl+'" headScrollId="'+data.data[x].headScrollId+'" target="_blank"><img src="'+data.data[x].photoUrl+'" ></a></li>');	
				}else{
					$('.slider ul').append('<li><a href="'+data.data[x].webpageUrl+'" headScrollId="'+data.data[x].headScrollId+'" target="_blank"><img data-original="'+data.data[x].photoUrl+'" class="lazys"></a></li>');	

				}
			}
			$('.slider').yxMobileSlider({during:3000});
			$(window).resize();
		}else{
			alert(data.data.error);	
		}
	});
	//点击banner添加得友盟统计
	$('.slider ul li a').live('click',function(e) {
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_scoreshop_bannerclick','phoneType=iOS','积分商城banner点击','bannerId',$(this).attr('headScrollId')]);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_scoreshop_bannerclick','phoneType=and','积分商城banner点击','bannerId',$(this).attr('headScrollId')]);
		};
    });
	//获取商品列表V2.5.2
	getNextPage(page);
	
	//点击活动规则里面的知道了
	$('.btn_ok,.gray').click(function(e) {
        $('.gray').fadeOut();
		$('body').css('overflow','auto').removeClass('fixed');
    });
	
	//查看活动规则
	$('.integral_exchange .right').click(function(e) {
        $('.gray').fadeIn();
		$('body').css('overflow','hidden').addClass('fixed');
		$('.integral_window').css('margin-top',($(window).height() - $('.integral_window').height())/2);
    });
	
	//获取某个礼品的详情
	$('.integral_list').delegate('li','click',function(e) {
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_scoreshop_goods_detail','phoneType=iOS','进入商品详情','goodId',$(this).attr('goodsId')]);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_scoreshop_goods_detail','phoneType=and','进入商品详情','goodId',$(this).attr('goodsId')]);
		};
		window.location.href="integralMallIndexDetails.html?v=<%= VERSION %>&goodsType="+$(this).attr('goodsType')+'&goodsId='+$(this).attr('goodsId')+'&pageType=details';
    });
	
	//点击赚取积分
	$('.integral_tab .left').click(function(e) {
        window.location.href = "pointsInstruction.html?v=<%= VERSION %>";
    });
	
	//点击兑换记录
	$('.integral_tab .right').click(function(e) {
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_scoreshop_record','phoneType=iOS','进入兑换记录','true','']);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_scoreshop_record','phoneType=and','进入兑换记录','true','']);
		};
        window.location.href = "integralMallExchangeRecords.html?v=<%= VERSION %>";
    });

})

//获取用户等级
function fitUserLevel(fitUserLevel){
	return 'LV'+fitUserLevel+'以上专享';
}

//获取商品列表
function getNextPage(page){
	$.get('<%= UGC_HOST_API_URL %>/nggirl/app/cli/scoreshop/getGoodsList/2.5.6',getFinalRequestObject({accessToken:getAccessToken(),pageNum:page}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.goodsList.length > 0){
				if( data.data.goodsList.length == 10 ){
					$(".pullUpIcon").show();
					var tur = true;	
					$(window).scroll(function(){
						var winH = $(window).height(); //浏览器当前窗口可视区域高度  
						var pageH = $(document.body).height(); //浏览器当前窗口文档body的高度 
						var scrollT = $(window).scrollTop(); //滚动条top  
						var lastPersentH = (pageH - winH - scrollT) / winH;  
						if(tur && lastPersentH < 1){ 
						tur = false;
						setTimeout(function(){
						  PageNumPP();
						  },500);
					   }
				   });
				}else{
					$(".pullUpIcon").hide();
				}
			}else{
				$(".pullUpIcon").hide();
			}
			//用户当前积分
			$('.mine_integral span').html(data.data.userScore);
			for(var x = 0; x < data.data.goodsList.length; x ++){
				//判断当前等级
				if(data.data.goodsList[x].fitUserLevel == 0){
					//判断是否有折扣
					if(data.data.goodsList[x].isDiscount == 0){//没有折扣
						$('.integral_list').append('<li goodsType="'+data.data.goodsList[x].goodsType+'" goodsId="'+data.data.goodsList[x].goodsId+'"><img class="img lazy" data-original="'+data.data.goodsList[x].picture+'" alt="" /><p class="integral_name">'+data.data.goodsList[x].name+'</p><div class="integral_message"><img class="integral_small_icon" src="images/integral_small_icon.png" alt="" /> <span class="integral_num">'+data.data.goodsList[x].costScore+'</span></div></li>');	
					};
					if(data.data.goodsList[x].isDiscount == 1){//有折扣
						$('.integral_list').append('<li goodsType="'+data.data.goodsList[x].goodsType+'" goodsId="'+data.data.goodsList[x].goodsId+'"><img class="img lazy" data-original="'+data.data.goodsList[x].picture+'" alt="" /><p class="integral_name">'+data.data.goodsList[x].name+'</p><div class="integral_message"><img class="integral_small_icon" src="images/integral_small_icon.png" alt="" /> <span class="integral_num">'+data.data.goodsList[x].costScore+'</span> <del class="integral_half">'+data.data.goodsList[x].originCostScore+'</del></div></li>');	
					};
				}else{
					//判断是否有折扣
					if(data.data.goodsList[x].isDiscount == 0){//没有折扣
						$('.integral_list').append('<li goodsType="'+data.data.goodsList[x].goodsType+'" goodsId="'+data.data.goodsList[x].goodsId+'"><img class="img lazy" data-original="'+data.data.goodsList[x].picture+'" alt="" /><p class="integral_name">'+data.data.goodsList[x].name+'</p><div class="integral_message"><img class="integral_small_icon" src="images/integral_small_icon.png" alt="" /> <span class="integral_num">'+data.data.goodsList[x].costScore+'</span></div><div class="leve">'+fitUserLevel(data.data.goodsList[x].fitUserLevel)+'</div></li>');	
					};
					if(data.data.goodsList[x].isDiscount == 1){//有折扣
						$('.integral_list').append('<li goodsType="'+data.data.goodsList[x].goodsType+'" goodsId="'+data.data.goodsList[x].goodsId+'"><img class="img lazy" data-original="'+data.data.goodsList[x].picture+'" alt="" /><p class="integral_name">'+data.data.goodsList[x].name+'</p><div class="integral_message"><img class="integral_small_icon" src="images/integral_small_icon.png" alt="" /> <span class="integral_num">'+data.data.goodsList[x].costScore+'</span> <del class="integral_half">'+data.data.goodsList[x].originCostScore+'</del></div><div class="leve">'+fitUserLevel(data.data.goodsList[x].fitUserLevel)+'</div></li>');	
					};
				}
			}	
			$("img.lazy").lazyload({effect : "show"});
		}else{
			alert(data.data.error);	
		}
	});
}

//页数++
function PageNumPP(){
	var pageNum = $('body').data('pageNum');//在body里面存储page
	if(page == undefined || parseInt(page) == NaN){
		page = 0;
	}
	page = page + 1;
	$('body').data('page',page);
	getNextPage(page);
}
