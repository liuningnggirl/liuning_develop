$(function(){
	//设置图片高度为图片宽度的二分之一
	$('.cover').height($('.cover').width() /2);
	
	//获取申请状态
	//申请时间
	$('.time').html(getParam('applyTime'));

	//试用妆品图
	$('.cover').attr('src',getParam('cosmeticImg'));

	//点击返回首页
	$('.return_details').click(function(e) {
        window.location.href = "freeTrial.html?v=<%= VERSION %>";
    });
	
	//点击返回申请详情
	$('.return_applay_details').click(function(e) {
        window.location.href = "applyForTrialDetails.html?cosmeticId="+getParam('cosmeticId')+'&v=<%= VERSION %>';
    });
});