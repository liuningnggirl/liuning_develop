$(function(){
	//打开客服窗口
	$('.box_solve_quesiont .right').click(function(e) {
		window.location.href = "//kefu.easemob.com/webim/im.html?tenantId=20722";
    });
	
	//获取当前窗体信息
	$('.box_content_header').html(getParam('problem'));
	$('.box_content_p').append('<p class="bcp_para">'+getParam('answer')+'</p>');
	
	//判断问题是否对用户有帮助
	//0无用，1有用，2还没有状态
	if(getParam('isUseful') == 0){
		$('.wu').addClass('on');
		$('.wu').children('img').attr('src','images/kefu_wuyong_true.png');
	}else if(getParam('isUseful') == 1){
		$('.you').addClass('on');
		$('.you').children('span').addClass('blue');
		$('.you').children('img').attr('src','images/kefu_youyong_true.png');
	}else if(getParam('isUseful') == 2){
		$('.wu,.you').removeClass('on');
		$('.wu').children('img').attr('src','images/kefu_wuyong_false.png');
		$('.you').children('span').removeClass('blue');
		$('.you').children('img').attr('src','images/kefu_youyong_false.png');
	};
	
	//点击有用
	$('.you').click(function(e) {
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_scoreshop','phoneType=iOS','有用','true','']);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_scoreshop','phoneType=and','有用','true','']);
		};
		var btn = $(this);
		//判断无用按钮是否有被选中过
		if($('.wu').hasClass('on')){
			$('.wu').removeClass('on');
			$('.wu').children('img').attr('src','images/kefu_wuyong_false.png');
			$('.you').click();
		}else{
			$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/callCenter/clickOpr/2.5.4',getFinalRequestObject({accessToken:getAccessToken(),problemId:getParam('problemId'),isUseful:1}),function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					btn.addClass('on');
					btn.children('span').addClass('blue');
					btn.children('img').attr('src','images/kefu_youyong_true.png');
				}else{
					alert(data.data.error);	
				}	
			});
		}
    });
	
	//点击无用
	$('.wu').click(function(e) {
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_scoreshop','phoneType=iOS','无用','true','']);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_scoreshop','phoneType=and','无用','true','']);
		};
		var btn = $(this);
		//判断无用按钮是否有被选中过
		if($('.you').hasClass('on')){
			$('.you').removeClass('on');
			$('.you').children('img').attr('src','images/kefu_youyong_false.png');
			$('.wu').click();
		}else{
			$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/callCenter/clickOpr/2.5.4',getFinalRequestObject({accessToken:getAccessToken(),problemId:getParam('problemId'),isUseful:0}),function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					btn.addClass('on');
					btn.children('img').attr('src','images/kefu_wuyong_true.png');
				}else{
					alert(data.data.error);	
				}	
			});
		}
    });
	
	
})