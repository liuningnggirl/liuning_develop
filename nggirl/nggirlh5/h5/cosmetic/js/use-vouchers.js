
var accessToken = getAccessToken();
var requestData = getFinalRequestObject({accessToken:accessToken});
var workId = getParam('workId');

$(function(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl/app/cli/personalInfo/listCouponUse/1.0',
		type : 'get',
		data : getFinalRequestObject({accessToken:accessToken,workId:workId}),
		dataType : 'json',
		success : function(data){
			if(data.code == 0){
				for(var x = 0; x < data.data.length; x ++){
					
					//判断是否是永久使用,0为在规定时间内使用
					if(data.data[x].isForever == 0){
						$('.box').append('<div class="voucher"><div class="tips"><p class="quan">'+data.data[x].money+'元代金券</p><p class="quan-txt">'+
						data.data[x].title+'<br>使用期限：<span>'+
						data.data[x].deadLine+'</span></p></div><div><p class="quan-bianhao">优惠券编号：<span>'+
						data.data[x].couponCode+'</span></p></div></div>');	
					}
					
					//1为永久有效
					if(data.data[x].isForever == 1){
						$('.box').append('<div class="voucher"><div class="tips"><p class="quan">'+data.data[x].money+'元代金券</p><p class="quan-txt">'+data.data[x].title+'<br>使用期限：<span>'+data.data[x].startTime+'</span>到<span>'+data.data[x].deadlineTime+'</span></p></div><div><p class="quan-bianhao">优惠券编号：<span>'+data.data[x].couponCode+'</span></p></div></div>');	
					}
				}
			}
	}});
});	
