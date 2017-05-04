$(function(){
	//设置图片高度为图片宽度的二分之一
	$('.cover').height($('.cover').width() /2);
	
	//获取申请状态
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/cosmetic/getCosmeticTrialDetail/2.1.0',getFinalRequestObject({cosmeticId:getParam('cosmeticId'),accessToken: getAccessToken(),}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			//申请时间
			$('.time').html(data.data.applyTime);
			//判断申请状态
			
			//试用妆品图
			$('.cover').attr('src',data.data.cosmeticImg);
			
			//试用妆品名称
			$('.bc_content').html(data.data.title);
			if(data.data.cosmeticStatus == 0 && data.data.applyStatus == 1){//申请中
				$('.bc_status').html('申请审核中，请耐心等待！');
				$('.apply_status').html('申请中');
			}
			if(data.data.cosmeticStatus == 2 || data.data.cosmeticStatus == 3 && data.data.applyStatus == 1 && data.data.applyResult == 0){//申请失败
				$('.bc_status').html('好可惜哦，下次继续努力~');
				$('.apply_status').html('申请失败');
			}
			if(data.data.cosmeticStatus == 2 || data.data.cosmeticStatus == 3 && data.data.applyStatus == 1 && data.data.applyResult == 1){//申请成功
				$('.bc_status').html('恭喜您，申请成功，可免费领取试用！');
				$('.apply_status').html('申请成功');
			}
		}else{
			alert(data.data.error);	
		}
	});
	
	//点击返回首页
	$('.return_details_ok').click(function(e) {
        window.location.href = "freeTrial.html?v=<%= VERSION %>";
    });
});