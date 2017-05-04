
var accessToken = getAccessToken();
var requestData = getFinalRequestObject({accessToken:accessToken});

$(function(){
	//获取我的优惠券列表
	vouchers();
	
	//领取优惠券
	$('.bt-btn').click(function(e) {
		$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl/app/cli/personalInfo/receiveCoupon/1.4.2',  
			type : 'post',
			data : getFinalRequestObject({accessToken:accessToken,couponNum:$('.bt-txt').val()}),
			dataType : 'json',  
			success : function(data){
				if(data.code == 1){
					alert(data.data.error);
				}else{
					$('.quan-box').children('div').remove();
					alert('领取成功！！');
					//获取我的优惠券列表
					vouchers();
				}
			}
		});
    });
});

function vouchers(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl/app/cli/personalInfo/listCoupon/1.3.2',  
		type : 'get',
		data : requestData,
		dataType : 'json',  
		success : function(data){
			//如果返回数据长度为0
			if(data.data.length == 0){
				$('.vouchers-none').show();
			}else{
				$('.vouchers-none').hide();
			}
			//生成优惠券
			for(var x = 0; x <data.data.length; x ++){
				//优惠券状态，0（未使用）
				if(data.data[x].useStatus == 0){											
					$('.quan-box').append('<div class="voucher"><div class="voucher-top"><div class="vt-left"><p class="vl-top">'+(data.data[x].saleInfo).substring(0,data.data[x].saleInfo.length-1)+'<span style="font-size:1rem;">'+(data.data[x].saleInfo).substr((data.data[x].saleInfo).length-1,(data.data[x].saleInfo).length-1)+' </span></p><p class="vl-bottom">满'+data.data[x].lowPrice+'元可用</p></div><div class="vt-right"><p class="vr-top">'+data.data[x].fromChannel+'</p><p class="vr-bottom">'+data.data[x].fitProductName+'</p></div></div><div class="voucher-bottom"><p class="use-status">未使用</p><p class="use-date">'+data.data[x].deadLine+'</p></div></div>');
				}
				
				//优惠券状态，1（已使用）
				if(data.data[x].useStatus == 1){
					$('.quan-box').append('<div class="voucher-no"><div class="voucher-top"><div class="vt-left"><p class="vl-top gray">'+(data.data[x].saleInfo).substring(0,data.data[x].saleInfo.length-1)+'<span style="font-size:1rem;">'+(data.data[x].saleInfo).substr((data.data[x].saleInfo).length-1,(data.data[x].saleInfo).length-1)+' </span></p><p class="vl-bottom gray">满'+data.data[x].lowPrice+'元可用</p></div><div class="vt-right"><p class="vr-top">'+data.data[x].fromChannel+'</p><p class="vr-bottom">'+data.data[x].fitProductName+'</p></div></div><div class="voucher-bottom"><p class="use-status">已使用</p><p class="use-date">'+data.data[x].deadLine+'</p></div></div>');
				}
				
				//优惠券状态，2（已过期）
				if(data.data[x].useStatus == 2){
					$('.quan-box').append('<div class="voucher-no"><div class="voucher-top"><div class="vt-left"><p class="vl-top gray">'+(data.data[x].saleInfo).substring(0,data.data[x].saleInfo.length-1)+'<span style="font-size:1rem;">'+(data.data[x].saleInfo).substr((data.data[x].saleInfo).length-1,(data.data[x].saleInfo).length-1)+' </span></p><p class="vl-bottom gray">满'+data.data[x].lowPrice+'元可用</p></div><div class="vt-right"><p class="vr-top">'+data.data[x].fromChannel+'</p><p class="vr-bottom">'+data.data[x].fitProductName+'</p></div></div><div class="voucher-bottom"><p class="use-status">已过期</p><p class="use-date">'+data.data[x].deadLine+'</p></div></div>');
				}
			}
		}
	});
}
