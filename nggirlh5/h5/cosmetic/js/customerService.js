$(function(){
	$('.ch_kuang_txt').width($('.ch_kuang').width());
	$('.tel_hidden').width($('.ck_right').width());
	
	//获取活动列表
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/callCenter/getProblems/2.5.4',getFinalRequestObject({accessToken:getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.length > 0){
				$('.content_p').show();	
				for(var x = 0; x < data.data.length; x ++){
					$('.content_question .cc_list').append('<li problemId="'+data.data[x].problemId+'" isUseful="'+data.data[x].isUseful+'" problem="'+data.data[x].problem+'" answer="'+data.data[x].answer+'"><div class="li_div">'+data.data[x].problem+'</div></li>');	
				}
		
				//如果问题大于4条
				if($('.content_question .cc_list>li').length >4){
					$('.content_question .cq_content .cc_list_arr').show();	
				}else{
					$('.content_question .cc_list>li:last').css('border-bottom','none');
					$('.content_question .cq_content .cc_list_arr').hide();	
				}
				
				//常见问题大于四条之外的隐藏
				$('.content_question .cc_list>li:gt(3)').hide();
				$('.content_question .cc_list li').each(function(index, element) {
					if($(this).height() >= 50){
						$(this).css('line-height','20px');
					}else{
						//$(this).css('line-height','34px');	
					}
				});
			}else{
				$('.content_question').hide();
				/*if($('.content_gonggao .cc_list>li').length == 0){
					$('.content_p').hide();	
				};*/
			}
		}else{
			alert(data.data.error);	
		}
	});
	
	//获取活动通知
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/callCenter/getNotices/2.5.4',getFinalRequestObject({accessToken:getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.length >0){
				$('.content_p').show();	
				for(var x = 0; x < data.data.length; x ++){
					$('.content_gonggao .cc_list').append('<li problemId="'+data.data[x].problemId+'" isUseful="'+data.data[x].isUseful+'" problem="'+data.data[x].problem+'" answer="'+data.data[x].answer+'"><div class="li_div">'+data.data[x].problem+'</div></li>');	
				}
				
				//如果活动公告大于4条
				if($('.content_gonggao .cc_list>li').length >4){
					$('.content_gonggao .cq_content .cc_list_arr').show();	
				}else{
					$('.content_gonggao .cq_content .cc_list_arr').hide();	
					$('.content_gonggao .cc_list>li:last').css('border-bottom','none');
				}
				
				//活动公告大于四条之外的隐藏
				$('.content_gonggao .cc_list>li:gt(3)').hide();
				$('.content_gonggao .cc_list').each(function(index, element) {
					if($(this).height() >= 50){
						$(this).css('line-height','20px');
					}else{
						//$(this).css('line-height','34px');	
					}
				});
			}else{
				$('.content_gonggao').hide();
				/*if($('.content_question .cc_list>li').length == 0){
					$('.content_p').hide();	
				};*/
			}
		}else{
			alert(data.data.error);	
		}
	});
	
	//展开大于四条以外的问题
	$('.content_question .cq_content .cc_list_arr').click(function(e) {
		if($(this).hasClass('on')){
			$(this).removeClass('on');
			$('.content_question .cq_content .cc_list_arr .arr').attr('src','images/index_search_arr_down.png');
			$('.content_question .cc_list>li:gt(3)').hide();
		}else{
			$('.content_question .cq_content .cc_list_arr .arr').attr('src','images/order-arr-up_03_03.png');
			$('.content_question .cc_list>li').show();
			$(this).addClass('on');
		}
    });
	
	//展开大于四条以外的活动公告
	$('.content_gonggao .cq_content .cc_list_arr').click(function(e) {
		if($(this).hasClass('on')){
			$(this).removeClass('on');
			$('.content_gonggao .cq_content .cc_list_arr .arr').attr('src','images/index_search_arr_down.png');
			$('.content_gonggao .cc_list>li:gt(3)').hide();
		}else{
			$('.content_gonggao .cq_content .cc_list_arr .arr').attr('src','images/order-arr-up_03_03.png');
			$('.content_gonggao .cc_list>li').show();
			$(this).addClass('on');
		}
    });
	
	//点击在线客服
	$('.ck_left.online,.ch_icon').click(function(e) {
		window.location.href = "//kefu.easemob.com/webim/im.html?tenantId=20722";
    });
	
	//跳转到问题详情页面
	$('.cc_list').delegate('li','click',function(){
		window.location.href = "customerServiceDetails.html?isUseful=" +$(this).attr('isUseful')+'&problem='+$(this).attr('problem')+'&answer='+$(this).attr('answer')+'&problemId='+$(this).attr('problemId') +'&v=<%= VERSION %>' ;
	});
})
