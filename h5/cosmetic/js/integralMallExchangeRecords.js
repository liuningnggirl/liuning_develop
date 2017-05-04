var page = 0;
$(function(){	
	//获取兑换记录列表
	getNextPage(page);
	
	//点击某条兑换记录跳转到对应的礼品详情
	$('.content ul').delegate('li','click',function(){
		window.location.href = "integralMallIndexDetails.html?v=<%= VERSION %>&goodsType="+$(this).attr('goodsType')+'&orderId='+$(this).attr('orderId')+'&goodsId='+$(this).attr('goodsId')+'&pageType=list';
	});
	
	//去挑选
	$('.btn_ok').click(function(e) {
        window.location.href = "integralMallIndex.html?v=<%= VERSION %>";
    });
})

//获取兑换记录列表
function getNextPage(page){
	$.get('<%= UGC_HOST_API_URL %>/nggirl/app/cli/scoreshop/getExchangeRecord/2.5.3',getFinalRequestObject({accessToken:getAccessToken(),pageNum:page,pageSize:10}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.length > 0){
				if( data.data.length == 10 ){
					$(".pullUpIcon").show();
					var tur = true;	
					$(window).scroll(function(){
						var winH = $(window).height(); //浏览器当前窗口可视区域高度  
						var pageH = $(document.body).height(); //浏览器当前窗口文档body的高度 
						var scrollT = $(window).scrollTop(); //滚动条top  
						var lastPersentH = (pageH - winH - scrollT) / winH;  
						if(tur && lastPersentH < 0.02){ 
						setTimeout(function(){
						  PageNumPP();
						  },500);
					   }
				   });
				}else if( data.data.length == 0){
					$('.no_message').show();
				}else{
					$(".pullUpIcon").hide();
				}
			}
			if(data.data.length > 0){
				for(var x = 0; x < data.data.length; x ++){
					$('.content ul').append('<li orderId="'+data.data[x].orderId+'" goodsId="'+data.data[x].goodsId+'" goodsType="'+data.data[x].goodsType+'"><div class="left"><img src="'+data.data[x].picture+'" class="gift_img lazy" alt="" /></div><div class="right"><p class="gift_title">'+data.data[x].name+'</p><div class="gift_price"><img src="images/integral_small_icon.png" class="gift_price_icon" alt="" /> <span class="gift_price_num">'+data.data[x].costScore+'</span></div></div><img src="images/black_right.png" class="gift_arr" alt="" /></li>');
				}
			}else{
				$(".pullUpIcon").hide();	
			}
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
