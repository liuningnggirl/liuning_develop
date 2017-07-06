$(function(){
	//跳转指定页面按钮
	$('.shope_after_sale_manage .goto_page_box .goto_page_ok').click(function(){
		if($(".shope_after_sale_manage .goto_page_box .goto_redirect_page_num").val() > $(".shope_after_sale_manage .goto_page_box").attr("totnum")){
			alert("没有此页!!");
		}else{
			loadShopeAfterSalePage($(".shope_after_sale_manage .goto_page_box .goto_redirect_page_num").val());
		}
	});
	
	//降序
	$('.shope_after_sale_manage_table .apply_time .apply_time_down').click(function(e) {
        loadShopeAfterSalePage(1,$(this).attr('value'));
    });
	
	//升序
	$('.shope_after_sale_manage_table .apply_time .apply_time_up').click(function(e) {
        loadShopeAfterSalePage(1,$(this).attr('value'));
    });
	
	//搜索按钮
	$('.shope_after_sale_manage .shope_after_sale_manage_search .select_btn').click(function(){
		loadShopeAfterSalePage();
	});
	
	//查看物流详情
	$('.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_table .looks_wuliu_danhao').click(function(e) {
		var btn = $(this);
		$('.shope_after_sale_manage_wuliu_message').show().css('top',$(window).scrollTop()+50);
		$('.shope_after_sale_manage_wuliu_message ul li').remove();
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/service/getExpressTrace/3.1.0',{companyCode:btn.attr('clientExpressCompanyCode'),expressNum:$.trim($('.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_table .wuliu_danhao').val())},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				if(data.data.traces == null){
					$('.shope_after_sale_manage_wuliu_message ul').html(data.data.reason);
				}else{
					for(var x = 0 ;x < data.data.traces.length; x ++){
						$('.shope_after_sale_manage_wuliu_message ul').append('<li><div class="left">'+data.data.traces[x].acceptTime+'</div><div class="right">'+data.data.traces[x].acceptStation+'</div></li>');
					}
					$('.shope_after_sale_manage_wuliu_message .line').height($('.shope_after_sale_manage_wuliu_message ul').height()-30);
				}
			}else{
				alert(data.data.error);	
			}
		});
    });
	
	//物流详情--返回
	$('.shope_after_sale_manage_wuliu_message .return_btn').click(function(e) {
        $('.shope_after_sale_manage_wuliu_message').hide();
    });
	
	//全部取消
	$('.shope_after_sale_manage .shope_after_sale_manage_search .cancle_all_btn').click(function(){
		$('.shope_after_sale_manage .shope_after_sale_manage_search .service_id').val('');
		$('.shope_after_sale_manage .shope_after_sale_manage_search .order_id').val('');
		$('.shope_after_sale_manage .shope_after_sale_manage_search .Wdate.start').val('');
		$('.shope_after_sale_manage .shope_after_sale_manage_search .Wdate.end').val('');
		$('.shope_after_sale_manage .shope_after_sale_manage_search .user_name').val('');
		$('.shope_after_sale_manage .shope_after_sale_manage_search .user_tel').val('');
		$('.shope_after_sale_manage .shope_after_sale_manage_search .apply_type option:eq(0)').attr('selected','selected');
		$('.shope_after_sale_manage .shope_after_sale_manage_search .deal_with_status option:eq(0)').attr('selected','selected');
		loadShopeAfterSalePage();
	});
	
	//售后处理
	//点击售后处理接口V3.1.0
	$('#shope_after_sale_manage .shope_after_sale_manage_table .after_sale').live('click',function(e) {
		$('.shope_after_sale_manage_after_sale_shensu').children().hide();
		$('.shope_after_sale_manage_after_sale_pass input[type="checkbox"]').removeAttr('checked');
		$('.shope_after_sale_manage_after_sale_caozuo input[type="checkbox"]').removeAttr('checked');
		$('.shope_after_sale_manage_after_sale_pass input[type="checkbox"]').removeAttr('checked');
		$('.shope_after_sale_manage_after_sale .shope_after_sale_manage_after_sale_qian_table tbody tr').remove();
		$('.shope_after_sale_manage_after_sale .shope_after_sale_manage_after_sale_hou_table tbody tr').remove();
		var btn = $(this);
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/service/dealItemService/3.1.0',{serviceId:btn.attr('serviceId')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.shope_after_sale_manage_after_sale').show().attr('serviceId',btn.attr('serviceId'));
				$('#shope_after_sale_manage').hide();
				for(var x = 0; x < data.data.items.length ; x ++){
					if(x == 0){
						$('.shope_after_sale_manage_after_sale .shope_after_sale_manage_after_sale_qian_table tbody').append('<tr><td rowspan="'+data.data.items.length+'">'+btn.attr('itemOrderCode')+'</td><td rowspan="'+data.data.items.length+'">'+data.data.expressCompanyName+'</td><td>'+data.data.items[x].orderItemName+'(型号：'+data.data.items[x].skuName+')</td><td>'+data.data.items[x].quantity+'</td><td rowspan="'+data.data.items.length+'">'+btn.attr('userMessage')+'</td><td rowspan="'+data.data.items.length+'">'+data.data.orderCreateTime+'</td><td rowspan="'+data.data.items.length+'">'+btn.attr('payType')+'</td><td rowspan="'+data.data.items.length+'">'+data.data.goodsAmount+'</td><td rowspan="'+data.data.items.length+'">'+data.data.transAmount+'</td><td rowspan="'+data.data.items.length+'">'+data.data.payAmount+'</td></tr>');
					}else{
						$('.shope_after_sale_manage_after_sale .shope_after_sale_manage_after_sale_qian_table tbody').append('<tr><td>'+data.data.items[x].orderItemName+'(型号：'+data.data.items[x].skuName+')</td><td>'+data.data.items[x].quantity+'</td></tr>');
					}
					
				}
				$('.shope_after_sale_manage_after_sale .shope_after_sale_manage_after_sale_hou_table tbody').append('<tr><td>'+btn.attr('message')+'</td><td>'+btn.attr('quantity')+'</td><td>'+btn.attr('serviceAmount')+'</td><td>'+btn.attr('serviceTypes')+'</td><td>'+btn.parent().parent().children('.serContent').html()+'</td></tr>');
				$('.shope_after_sale_manage_after_sale_shensu_tuikuan_pass .money').html(btn.attr('serviceAmount')+'元');
				$('.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_table .kuaidi_name').val(data.data.clientExpressCompanyName);
				$('.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_table .wuliu_danhao').val(data.data.clientExpressNum);
				$('.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_table .looks_wuliu_danhao').attr('clientExpressCompanyCode',data.data.clientExpressCompanyCode);
				if(data.data.isCommit == 1){//操作员是否确认收货 0 未 1确认
					$('.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_table .sure_shouhuo_btn').removeClass('green').attr('value','已确认');
				}else{
					$('.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_table .sure_shouhuo_btn').addClass('green').attr('value','确认收货');
				}
			}else{
				alert(data.data.error);	
			}
		});

		if(btn.attr('serviceType') == 1 && btn.attr('operStatus') == 0){//serviceType=1(退货),serviceStatus=0(待处理)
			$('.shope_after_sale_manage_after_sale input[type="checkbox"]').removeAttr('checked').removeAttr('disabled');
			$('.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_tuikuan').show();
			$('.shope_after_sale_manage_after_sale_pass_liyou,.shope_after_sale_manage_after_sale_caozuo,.shope_after_sale_manage_after_sale_caozuo_tuikuan .shope_after_sale_manage_after_sale_caozuo_tuikuan_wuliushang').hide();
		}else if(btn.attr('serviceType') == 1 && btn.attr('operStatus') == 1){//serviceType=1(退货),serviceStatus=1(处理中)
			$('.shope_after_sale_manage_after_sale_pass_liyou,.shope_after_sale_manage_after_sale_caozuo_pass,.shope_after_sale_manage_after_sale_caozuo_tuikuan .shope_after_sale_manage_after_sale_caozuo_tuikuan_wuliushang,.shope_after_sale_manage_after_sale_caozuo_tuikuan_money').hide();
			//获取退换货详情V3.1.0
			$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/service/getfundOrExchangeItemInfo/3.1.0',{serviceId:btn.attr('serviceId')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.shope_after_sale_manage_after_sale .shope_after_sale_manage_after_sale_caozuo,.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_tuikuan,.shope_after_sale_manage_after_sale_caozuo_table').show();
					//isRecall，是否同意召回： 1-不同意 2-同意
					if(data.data.isRecall == 1){
						$('.shope_after_sale_manage_after_sale_pass #check_unpass').attr('checked','checked').attr('disabled','disabled');
						$('.shope_after_sale_manage_after_sale_pass #check_pass').attr('disabled','disabled');
					}else{
						$('.shope_after_sale_manage_after_sale_pass #check_pass').attr('checked','checked').attr('disabled','disabled');
						$('.shope_after_sale_manage_after_sale_pass #check_unpass').attr('disabled','disabled');
					}
					
					//isRefund,退款编号： 1-不同意 2-同意
					if(data.data.isRefund == 1){
						$('.shope_after_sale_manage_after_sale_caozuo_tuikuan #caozuo_check_tuikuan_unpass').attr('checked','checked');
					}else if(data.data.isRefund == undefined){
							
					}else{
						$('.shope_after_sale_manage_after_sale_caozuo_tuikuan #caozuo_check_tuikuan_pass').attr('checked','checked');
					}
				}else{
					alert(data.data.error);	
				}
			});
		}else if(btn.attr('serviceType') == 1 && btn.attr('operStatus') == 2){//serviceType=1(退货),serviceStatus=2(处理完成)
			//获取退换货详情V3.1.0
			$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/service/getfundOrExchangeItemInfo/3.1.0',{serviceId:btn.attr('serviceId')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.shope_after_sale_manage_after_sale_pass').children().attr('disabled','disabled');
					$('.shope_after_sale_manage_after_sale_caozuo_tuikuan').children().attr('disabled','disabled');
					$('.shope_after_sale_manage_after_sale .shope_after_sale_manage_after_sale_caozuo,.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_tuikuan').show();
					$('.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_table,.shope_after_sale_manage_after_sale_caozuo_tuikuan_money').hide();
					//isRecall，是否同意召回： 1-不同意 2-同意
					if(data.data.isRecall == 1){
						$('.shope_after_sale_manage_after_sale_pass #check_unpass').attr('checked','checked');
					}else{
						$('.shope_after_sale_manage_after_sale_pass #check_pass').attr('checked','checked');
					}
					
					//isRefund,退款编号： 1-不同意 2-同意
					if(data.data.isRefund == 1){
						$('.shope_after_sale_manage_after_sale_caozuo_tuikuan #caozuo_check_tuikuan_unpass').attr('checked','checked');
					}else if(data.data.isRefund== undefined){
						$('.shope_after_sale_manage_after_sale_pass_liyou').show().html('不给予商品召回的理由：'+data.data.fundRemark);
						$('.shope_after_sale_manage_after_sale_caozuo').hide();
						$('.shope_after_sale_manage_after_sale_caozuo_tuikuan input[type="checkbox"]').removeAttr('checked');
					}else{
						$('.shope_after_sale_manage_after_sale_caozuo_tuikuan #caozuo_check_tuikuan_pass').attr('checked','checked');
					}
					
					if(data.data.isRecall == 2 && data.data.isRefund == 1){//同意召回，不同意退款
						$('.shope_after_sale_manage_after_sale_caozuo_tuikuan .shope_after_sale_manage_after_sale_caozuo_tuikuan_wuliushang').show().html('<span style=" margin-right:20px;">召回商品物流商：'+data.data.exchangeExpressCompanyName+'</span><span>物流单号：'+data.data.exchangeExpressNo+'</span>');
						$('.shope_after_sale_manage_after_sale_pass_liyou,.shope_after_sale_manage_after_sale_caozuo_pass').hide();
						$('.shope_after_sale_manage_after_sale_caozuo_tuikuan_liyou').show().html('不给予商品退款处理的理由：'+data.data.fundRemark);
					}else if(data.data.isRecall == 2 && data.data.isRefund == 2){//同意召回，同意退款
						$('.shope_after_sale_manage_after_sale_caozuo_tuikuan .shope_after_sale_manage_after_sale_caozuo_tuikuan_wuliushang').show().html('<span style=" margin-right:20px;">召回商品物流商：'+data.data.exchangeExpressCompanyName+'</span><span>物流单号：'+data.data.exchangeExpressNo+'</span>');
						$('.shope_after_sale_manage_after_sale_caozuo_tuikuan_money').show().html('退还商品金额：'+btn.attr('serviceAmount')+'元     退款金额：'+data.data.fundAmount+'元'+'&nbsp;&nbsp;'+'退款说明：'+data.data.remark);
						$('.shope_after_sale_manage_after_sale_pass_liyou,.shope_after_sale_manage_after_sale_caozuo_tuikuan_liyou').hide();
					}
					
				}else{
					alert(data.data.error);	
				}
			});
		}else if(btn.attr('serviceType') == 2 && btn.attr('operStatus') == 0){//serviceType=2(换货),serviceStatus=0(待处理)
			$('.shope_after_sale_manage_after_sale_pass_liyou,.shope_after_sale_manage_after_sale_caozuo').hide();
			$('.shope_after_sale_manage_after_sale input[type="checkbox"]').removeAttr('checked').removeAttr('disabled');
			$('.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_pass').show();
		}else if(btn.attr('serviceType') == 2 && btn.attr('operStatus') == 1){//serviceType=2(换货),serviceStatus=1(处理中)
			//获取退换货详情V3.1.0
			$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/service/getfundOrExchangeItemInfo/3.1.0',{serviceId:btn.attr('serviceId')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.shope_after_sale_manage_after_sale_pass_liyou,.shope_after_sale_manage_after_sale_caozuo_tuikuan,.shope_after_sale_manage_after_sale_caozuo_pass_wuliushang,.shope_after_sale_manage_after_sale_caozuo_pass_modify_wuliushang').hide();
					$('.shope_after_sale_manage_after_sale .shope_after_sale_manage_after_sale_caozuo,.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_pass,.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_table').show();
					//isRecall，是否同意召回： 1-不同意 2-同意
					if(data.data.isRecall == 1){
						$('.shope_after_sale_manage_after_sale_pass #check_unpass').attr('checked','checked').attr('disabled','disabled');
						$('.shope_after_sale_manage_after_sale_pass #check_pass').attr('disabled','disabled');
					}else{
						$('.shope_after_sale_manage_after_sale_pass #check_pass').attr('checked','checked').attr('disabled','disabled');
						$('.shope_after_sale_manage_after_sale_pass #check_unpass').attr('disabled','disabled');
					}
					
					//isExchange,换货物流编号： 1-不同意 2-同意
					if(data.data.isExchange == 1){
						$('.shope_after_sale_manage_after_sale_caozuo_pass #caozuo_check_unpass').attr('checked','checked');
					}else if(data.data.isExchange == undefined){
						
					}else{
						$('.shope_after_sale_manage_after_sale_caozuo_pass #caozuo_check_pass').attr('checked','checked');
					}
					
					if(data.data.isRecall == 2 && data.data.isExchange == 1){//同意召回，不同意换货
						
					}else if(data.data.isRecall == 2 && data.data.isExchange == 2){//同意召回，同意换货
						
					}
				}else{
					alert(data.data.error);	
				}
			});
		}else if(btn.attr('serviceType') == 2 && btn.attr('operStatus') == 2){//serviceType=2(换货),serviceStatus=2(处理完成)
			//获取退换货详情V3.1.0
			$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/service/getfundOrExchangeItemInfo/3.1.0',{serviceId:btn.attr('serviceId')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.shope_after_sale_manage_after_sale_pass').children().attr('disabled','disabled');
					$('.shope_after_sale_manage_after_sale_caozuo_pass').children().attr('disabled','disabled');
					$('.shope_after_sale_manage_after_sale_caozuo_pass_wuliushang').show().html('<span>召回商品物流商：'+data.data.exchangeExpressCompanyName+'</span>　<span>物流单号：'+data.data.exchangeExpressNo+'</span>');
					$('.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_table,.shope_after_sale_manage_after_sale_caozuo_tuikuan').hide();
					$('.shope_after_sale_manage_after_sale .shope_after_sale_manage_after_sale_caozuo,.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_pass').show();
					//isRecall，是否同意召回： 1-不同意 2-同意
					if(data.data.isRecall == 1){
						$('.shope_after_sale_manage_after_sale_pass #check_unpass').attr('checked','checked');
						$('.shope_after_sale_manage_after_sale_caozuo').hide();
						$('.shope_after_sale_manage_after_sale_pass_liyou').html('不给予商品召回的理由：'+data.data.fundRemark).show();
					}else{
						$('.shope_after_sale_manage_after_sale_pass #check_pass').attr('checked','checked');
					}
					
					//isExchange,换货物流编号： 1-不同意 2-同意
					if(data.data.isExchange == 1){
						$('.shope_after_sale_manage_after_sale_caozuo_pass #caozuo_check_unpass').attr('checked','checked');
					}else if(data.data.isExchange == undefined){
						//$()
					}else{
						$('.shope_after_sale_manage_after_sale_caozuo_pass #caozuo_check_pass').attr('checked','checked');
					}
					
					if(data.data.isRecall == 2 && data.data.isExchange == 2){//同意召回，同意换货
						$('.shope_after_sale_manage_after_sale_caozuo_pass .shope_after_sale_manage_after_sale_caozuo_pass_modify_wuliushang').show();
						$('.shope_after_sale_manage_after_sale_caozuo_pass .shope_after_sale_manage_after_sale_caozuo_pass_modify_wuliushang .wuliu_shang option').each(function(index, element) {
                            if($(this).attr('code') == data.data.merchartExchangeExpressCompanyCode){
								$(this).attr('selected','selected');	
							};
                        });
						$('.shope_after_sale_manage_after_sale_caozuo_pass .shope_after_sale_manage_after_sale_caozuo_pass_modify_wuliushang .wuliu_danhao').val(data.data.merchartExchangeExpressNo);
					}else if(data.data.isRecall == 2 && data.data.isExchange == 1){//同意召回，不同意换货
						$('.shope_after_sale_manage_after_sale_pass_liyou,.shope_after_sale_manage_after_sale_caozuo_pass_modify_wuliushang').hide();
						$('.shope_after_sale_manage_after_sale_caozuo_pass .shope_after_sale_manage_after_sale_caozuo_pass_liyou').show().html('不做换货的理由：'+data.data.fundRemark);
					}
				}else{
					alert(data.data.error);	
				}
			});
		}
		
    });
	
	//返回到售后管理列表
	$('.shope_after_sale_manage_after_sale .return_btn').click(function(e) {
        $('.shope_after_sale_manage_after_sale').hide();
		$('#shope_after_sale_manage').show();
		loadShopeAfterSalePage();
		$('.shope_after_sale_manage_after_sale_pass').children().removeAttr('disabled');
		$('.shope_after_sale_manage_after_sale_caozuo_pass').children().removeAttr('disabled');
    });
	
	//给予处理/同意召回
	$('.shope_after_sale_manage_after_sale .shope_after_sale_manage_after_sale_pass #check_pass').click(function(e) {
        $('.shope_after_sale_manage_after_sale .shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_pass').show().css('top',$(window).scrollTop()).siblings().hide();
		$('.shope_after_sale_manage_after_sale_shensu_pass .name').val('');
		$('.shope_after_sale_manage_after_sale_shensu_pass .tel').val('');
		$('.shope_after_sale_manage_after_sale_shensu_pass .address').val('');
    });
	$(window).scroll(function(e) {
        $('.shope_after_sale_manage_wuliu_message,.shope_after_sale_manage_after_sale .shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_pass,.shope_after_sale_manage_after_sale .shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_unpass').animate({'top':$(window).scrollTop() + 50},1);
    });
	//给予处理/同意召回，取消
	$('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_pass .cancle_btn').click(function(e) {
        $('.shope_after_sale_manage_after_sale .shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_pass').hide();
    });
	
	//不给予处理/不同意召回
	$('.shope_after_sale_manage_after_sale .shope_after_sale_manage_after_sale_pass #check_unpass').click(function(e) {
        $('.shope_after_sale_manage_after_sale .shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_unpass').show().css('top',$(window).scrollTop()).siblings().hide();
		$('.shope_after_sale_manage_after_sale_shensu_unpass .liyou').val('');
    });
	//不给予处理/不同意召回，取消
	$('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_unpass .cancle_btn').click(function(e) {
        $('.shope_after_sale_manage_after_sale .shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_unpass').hide();
    });
	
	//商品召回，换货处理
	$('.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_pass #caozuo_check_pass').click(function(e) {
		if($('.shope_after_sale_manage_after_sale .shope_after_sale_manage_after_sale_caozuo_table .sure_shouhuo_btn').hasClass('green')){
			alert('请先做收货处理！！');
		}else{
			$('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_changeShope_pass').show().css('top',$(window).scrollTop()).siblings().hide();
			$('.shope_after_sale_manage_after_sale_shensu_changeShope_pass select option:eq(0)').attr('selected','selected');
			$('.shope_after_sale_manage_after_sale_shensu_changeShope_pass .wuliu_hao').val('');
		}
    });
	$(window).scroll(function(e) {
        $('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_changeShope_pass,.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_changeShope_unpass,.shope_order_manage_look_order_message').animate({'top':$(window).scrollTop() + 10},1);
    });
	//商品召回，换货处理,取消按钮
	$('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_changeShope_pass .cancle_btn').click(function(e) {
        $('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_changeShope_pass').hide();
    });
	
	//商品召回，不做换货处理
	$('.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_pass #caozuo_check_unpass').click(function(e) {
		if($('.shope_after_sale_manage_after_sale .shope_after_sale_manage_after_sale_caozuo_table .sure_shouhuo_btn').hasClass('green')){
			alert('请先做收货处理！！');
		}else{
			$('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_changeShope_unpass').show().css('top',$(window).scrollTop()).siblings().hide();
			$('.shope_after_sale_manage_after_sale_shensu_changeShope_unpass .liyou').val('');
		}
    });
	//商品召回，不做换货处理，取消按钮
	$('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_changeShope_unpass .cancle_btn').click(function(e) {
        $('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_changeShope_unpass').hide();
    });
	
	//商品召回，给予处理
	$('.shope_after_sale_manage_after_sale .shope_after_sale_manage_after_sale_pass>input[type=checkbox],.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_pass>input[type=checkbox]').click(function(e) {
        $(this).attr('checked','checked').siblings().removeAttr('checked');
    });
	
	//商品召回，退款处理
	$('.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_tuikuan #caozuo_check_tuikuan_pass').click(function(e) {
		if($('.shope_after_sale_manage_after_sale .shope_after_sale_manage_after_sale_caozuo_table .sure_shouhuo_btn').hasClass('green')){
			alert('请先做收货操作！！');
		}else{
			$('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_tuikuan_pass').show().css('top',$(window).scrollTop()).siblings().hide();
			$('.shope_after_sale_manage_after_sale_shensu_tuikuan_pass input[type="text"]').val('');
		}
    });
	$(window).scroll(function(e) {
        $('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_tuikuan_pass,.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_tuikuan_unpass').animate({'top':$(window).scrollTop() + 50},1);
    });
	//商品召回，退款处理,取消按钮
	$('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_tuikuan_pass .cancle_btn').click(function(e) {
        $('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_tuikuan_pass').hide();
    });
	
	//商品召回，不做退款处理
	$('.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_tuikuan #caozuo_check_tuikuan_unpass').click(function(e) {
		if($('.shope_after_sale_manage_after_sale .shope_after_sale_manage_after_sale_caozuo_table .sure_shouhuo_btn').hasClass('green')){
			alert('请先做收货操作！！');
		}else{
			$('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_tuikuan_unpass').show().css('top',$(window).scrollTop()).siblings().hide();
			$('.shope_after_sale_manage_after_sale_shensu_tuikuan_unpass textarea').val('');
		}
    });
	//商品召回，退款处理,取消按钮
	$('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_tuikuan_unpass .cancle_btn').click(function(e) {
        $('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_tuikuan_unpass').hide();
    });
	
	//商品召回，给予退款
	$('.shope_after_sale_manage_after_sale .shope_after_sale_manage_after_sale_caozuo_tuikuan>input[type=checkbox],.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_tuikuan>input[type=checkbox]').click(function(e) {
        $(this).attr('checked','checked').siblings().removeAttr('checked');
    });
	
	//确认收货
	//商家召回（确认收货）V3.1.0
	$('.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_table .sure_shouhuo_btn').click(function(e) {
		var btn = $(this);
		if(btn.hasClass('green')){
			var r = confirm('确认收货？？');
			if(r == true){
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/service/receiceItem/3.1.0',{serviceId:$('.shope_after_sale_manage_after_sale').attr('serviceId'),expressNum:$.trim($('.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_table .wuliu_danhao').val()),expressCompanyCode:$('.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_table .kuaidi_name option:selected').attr('code')},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						btn.removeClass('green').attr('value','已确认');
					}else{
						alert(data.data.error);	
					}	
				});
			};
		};
    });
	
	//查看订单详情
	$('.shope_after_sale_manage .shope_after_sale_manage_table .order_details').live('click',function(e) {
		var btn = $(this);
        $('.shope_order_manage_look_order_message').show().css('top',$(window).scrollTop());
		$('.shope_order_manage_look_order_message').children('input[type="text"]').attr('disabled','disabled');
		$('.shope_order_manage_look_order_message .shope_order_manage_look_order_message_save_btn').hide();
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/order/getOrderDetail/3.1.0',{orderId:$(this).attr('orderId')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				if(data.data.strings.length >0){
					var str = '';
					for(var x = 0; x < data.data.strings.length; x ++){
						str += data.data.strings[x]+',';
					}
					str = str.substring(0,str.length -1);
					$('.shope_order_manage_look_order_message .shope_name').html(str);
				}else{
					$('.shope_order_manage_look_order_message .shope_name').html('');
				}
				$('.shope_order_manage_look_order_message').show().css('top',$(window).scrollTop());
				$('.shope_order_manage_look_order_message .order_id').html(data.data.orderCode);
				$('.shope_order_manage_look_order_message .wuliu_id').html(data.data.transCode);
				$('.shope_order_manage_look_order_message .xiadan_time').html(data.data.createTime);
				$('.shope_order_manage_look_order_message .user_name').val(data.data.customerName);
				$('.shope_order_manage_look_order_message .user_tel').val(data.data.customerPhone);
				$('.shope_order_manage_look_order_message .user_address').val(data.data.customerAddress);
				$('.shope_order_manage_look_order_message .order_money').val(data.data.orderAmount);
				$('.shope_order_manage_look_order_message .yunfei_money').val(data.data.transAmount);
				$('.shope_order_manage_look_order_message .zhifu_money').val(data.data.payAmount);
			}else{
				alert(data.data.error);	
			}
		});		
    });
	
	//修改用户填写物流信息
	$('.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_table .modify_wuliu_shang,.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_table .modify_wuliu_danhao').click(function(e) {
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/service/updateExpressInfo/3.1.0',{serviceId:$('.shope_after_sale_manage_after_sale').attr('serviceId'),expressCompanyCode:$('.shope_after_sale_manage_after_sale_caozuo_pass_modify_wuliushang .wuliu_shang option:selected').attr('code'),expressNum:$.trim($('.shope_after_sale_manage_after_sale_caozuo_pass_modify_wuliushang .wuliu_danhao').val())},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				alert('修改成功！！');
			}else{
				alert(data.data.error);	
			}
		});
    });
	
	//修改卖家填写物流信息
	$('.shope_after_sale_manage_after_sale_caozuo_pass_modify_wuliushang .modify_wuliu_shang,.shope_after_sale_manage_after_sale_caozuo_pass_modify_wuliushang .modify_wuliu_danhao').click(function(e) {
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/service/fillMerchantExpressInfo/3.1.0',{serviceId:$('.shope_after_sale_manage_after_sale').attr('serviceId'),expressCompanyCode:$('.shope_after_sale_manage_after_sale_caozuo_pass_modify_wuliushang .wuliu_shang option:selected').attr('code'),expressNum:$.trim($('.shope_after_sale_manage_after_sale_caozuo_pass_modify_wuliushang .wuliu_danhao').val())},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				alert('修改成功！！');
			}else{
				alert(data.data.error);	
			}
		});
    });	
		
	//获取全部物流商信息V3.1.0
	$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/service/getAllExpressInfo/3.1.0',function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			$('body').data('wuliu', data.data);
			for(var x = 0; x < data.data.length ;x ++){
				$('.shope_after_sale_manage_after_sale_shensu_changeShope_pass select').append('<option code='+data.data[x].code+'>'+data.data[x].name+'</option>');
				$('.shope_after_sale_manage_after_sale_caozuo_pass .shope_after_sale_manage_after_sale_caozuo_pass_modify_wuliushang .wuliu_shang').append('<option code='+data.data[x].code+'>'+data.data[x].name+'</option>');
				$('.shope_after_sale_manage_after_sale_caozuo .shope_after_sale_manage_after_sale_caozuo_table .kuaidi_name').append('<option code='+data.data[x].code+'>'+data.data[x].name+'</option>');
			};
		}else{
			alert(data.data.error);	
		}	
	});
	
	//退换货申诉保存接口V3.1.0(否同意召回： 1-不同意 2-同意)
	$('.shope_after_sale_manage_after_sale_shensu_pass .send_btn').click(function(e) {
		var btn = $(this);
		if($.trim($('.shope_after_sale_manage_after_sale_shensu_pass .name').val()) == ''){
			alert('请填写姓名！！');
		}else if($.trim($('.shope_after_sale_manage_after_sale_shensu_pass .tel').val()) == ''){
			alert('请填写电话！！');
		}else if($.trim($('.shope_after_sale_manage_after_sale_shensu_pass .address').val()) == ''){
			alert('请填写地址！！');
		}else{
			var r = confirm('确认同意召回？？');
			if(r == true){
				btn.attr('disabled','disabled');
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/service/saveFundService/3.1.0',changeSaveFundServiceFn(2,''),function(data){
					var data  = $.parseJSON(data);
					if(data.code == 0){
						btn.removeAttr('disabled');
						$('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_pass').hide();
						$('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_unpass,.shope_after_sale_manage_after_sale').hide();
						$('#shope_after_sale_manage').show();
						loadShopeAfterSalePage();
					}else{
						alert(data.data.error);	
					}
				});
			};
		}
    });
	$('.shope_after_sale_manage_after_sale_shensu_unpass .sure_btn').click(function(e) {
		var btn = $(this);
		if($.trim($('.shope_after_sale_manage_after_sale_shensu_unpass .liyou').val()) == ''){
			alert('请填写不予召回理由！！');
		}else{
			var r = confirm('确认不同意召回？？');
			if(r == true){
				btn.attr('disabled','disabled');
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/service/saveFundService/3.1.0',changeSaveFundServiceFn(1,$.trim($('.shope_after_sale_manage_after_sale_shensu_unpass .liyou').val())),function(data){
					var data  = $.parseJSON(data);
					if(data.code == 0){
						btn.removeAttr('disabled');
						$('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_unpass,.shope_after_sale_manage_after_sale').hide();
						$('#shope_after_sale_manage').show();
						loadShopeAfterSalePage();
					}else{
						alert(data.data.error);	
					}
				});
			};
		}
    });
	
	//同意召回（同意/不同意）换货V3.1.0(是否同意换货： 1-不同意 2-同意)
	$('.shope_after_sale_manage_after_sale_shensu_changeShope_pass .sure_btn').click(function(e) {
		var btn = $(this);
		if($.trim($('.shope_after_sale_manage_after_sale_shensu_changeShope_pass .wuliu_hao').val()) == ''){
			alert('请填写物流单号！！');
		}else{
			var r = confirm('确认同意换货？？');
			if(r == true){
				btn.attr('disabled','disabled');
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/service/isExchangeItem/3.1.0',changeExchangeItemFn(2,''),function(data){
					var data  = $.parseJSON(data);
					if(data.code == 0){
						btn.removeAttr('disabled');
						$('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_changeShope_pass').hide();
						$('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_unpass,.shope_after_sale_manage_after_sale').hide();
						$('#shope_after_sale_manage').show();
						loadShopeAfterSalePage();
					}else{
						alert(data.data.error);	
					}
				});
			};
		}
    });
	$('.shope_after_sale_manage_after_sale_shensu_changeShope_unpass .sure_btn').click(function(e) {
		var btn = $(this);
		if($.trim($('.shope_after_sale_manage_after_sale_shensu_changeShope_unpass .liyou').val()) == ''){
			alert('请填写不做换货处理理由！！');
		}else{
			var r = confirm('确认不同意换货？？');
			if(r == true){
				btn.attr('disabled','disabled');
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/service/isExchangeItem/3.1.0',changeExchangeItemFn(1,$.trim($('.shope_after_sale_manage_after_sale_shensu_changeShope_unpass .liyou').val()),''),function(data){
					var data  = $.parseJSON(data);
					if(data.code == 0){
						btn.removeAttr('disabled');
						$('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_changeShope_unpass').hide();
						$('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_unpass,.shope_after_sale_manage_after_sale').hide();
						$('#shope_after_sale_manage').show();
						loadShopeAfterSalePage();
					}else{
						alert(data.data.error);	
					}
				});
			};
		}
    });
	
	//同意召回（同意/不同意）退款V3.1.0(是否同意退款： 1-不同意 2-同意)
	$('.shope_after_sale_manage_after_sale_shensu_tuikuan_pass .sure_btn').click(function(e) {
		var btn = $(this);
		if($.trim($('.shope_after_sale_manage_after_sale_shensu_tuikuan_pass .tuikuan_money').val()) == ''){
			alert('请填写退款金额！！');
		}else{
			var r = confirm('确认同意退款？？');
			if(r == true){
				btn.attr('disabled','disabled');
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/service/isFundItem/4.0.6',changeFundItemFn(2,'',$.trim($('.shope_after_sale_manage_after_sale_shensu_tuikuan_pass .tuikuan_remark').val())),function(data){
					var data  = $.parseJSON(data);
					if(data.code == 0){
						btn.removeAttr('disabled');
						$('.shope_after_sale_manage_after_sale_shensu_tuikuan_pass,.shope_after_sale_manage_after_sale').hide();
						$('#shope_after_sale_manage').show();
						loadShopeAfterSalePage();
					}else{
						btn.removeAttr('disabled');
						alert(data.data.error);	
					}
				});
			};
		}
    });
	
	$('.shope_after_sale_manage_after_sale_shensu_tuikuan_unpass .sure_btn').click(function(e) {
		var btn = $(this);
		if($.trim($('.shope_after_sale_manage_after_sale_shensu_tuikuan_unpass .liyou').val()) == ''){
			alert('请填写不做退款处理理由！！');
		}else{
			var r = confirm('不同意退款？？');
			if(r == true){
				btn.attr('disabled','disabled');
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/service/isFundItem/4.0.6',changeFundItemFn(1,$.trim($('.shope_after_sale_manage_after_sale_shensu_tuikuan_unpass .liyou').val())),function(data){
					var data  = $.parseJSON(data);
					if(data.code == 0){
						btn.removeAttr('disabled');
						$('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_tuikuan_pass').hide();
						$('.shope_after_sale_manage_after_sale_shensu .shope_after_sale_manage_after_sale_shensu_unpass,.shope_after_sale_manage_after_sale').hide();
						$('#shope_after_sale_manage').show();
						loadShopeAfterSalePage();
					}else{
						alert(data.data.error);	
					}
				});
			};
		}
    });
});


//创建获取品牌列表V3.1.0列表分页
function createShopeAfterSalePage(data){
	$("#shope_after_sale_manage .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = searchShopeAfterSaleParams();
			params.page = p;
			$('.shope_after_sale_manage .shope_after_sale_manage_table tbody tr').remove(); //清除原来的表格信息
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/service/getItemServices/3.1.0',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initShopeAfterSalePage
			});			
		}
	});
}

//初始化获取品牌列表V3.1.0分页
function initShopeAfterSalePage(data){
	$('.shope_after_sale_manage .shope_after_sale_manage_table tbody tr').remove(); //清除原来的表格信息
	createShopeAfterSalePage(data)
	$('.shope_after_sale_manage .goto_page_box').attr("totnum",data.data.totalPageNum);
	$('.shope_after_sale_manage .goto_page_box .totNum').text(data.data.totalNum).css("color","#f00");
	$('.shope_after_sale_manage_status .status_dai').html(data.data.mapView.prendCount);
	$('.shope_after_sale_manage_status .status_ing').html(data.data.mapView.prendingCount);
	$('.shope_after_sale_manage_status .status_success').html(data.data.mapView.handledCount);
	for(var x = 0; x < data.data.pageData.length ; x ++){
		//判断处理状态 0-待处理，1-处理中，2-处理完成
		if(data.data.pageData[x].operStatus == 2){
			$('.shope_after_sale_manage .shope_after_sale_manage_table tbody').append('<tr><td>'+data.data.pageData[x].serviceId+'</td><td><p>订单编号：'+data.data.pageData[x].itemOrderCode+'</p><p>支付来源：'+getShopeAfterSalePayType(data.data.pageData[x].payType)+'</p></td><td><p>姓名：'+data.data.pageData[x].userName+'</p><p>电话：'+data.data.pageData[x].phoneNum+'</p><p>地址：'+data.data.pageData[x].address+'</p></td><td>'+data.data.pageData[x].itemName+'（型号：'+data.data.pageData[x].skuName+'）</td><td>'+data.data.pageData[x].quantity+'</td><td>'+data.data.pageData[x].serviceAmount+'</td><td class="serContent"><p>'+data.data.pageData[x].serviceContent+'</p>'+getShopeAfterSaleImg(data.data.pageData[x].imgs)+'</td><td>'+data.data.pageData[x].serviceTime+'</td><td>'+getShopeAfterSaleServiceType(data.data.pageData[x].serviceType)+'</td><td>'+getShopeAfterSaleServiceStatus(data.data.pageData[x].serviceStatus)+'</td><td><input type="button" orderId='+data.data.pageData[x].orderId+' value="订单详情" class="green order_details" id="order_details" /><input operStatus='+data.data.pageData[x].operStatus+' serviceStatus='+data.data.pageData[x].serviceStatus+' serviceType='+data.data.pageData[x].serviceType+' type="button" operStatus='+data.data.pageData[x].operStatus+' quantity='+data.data.pageData[x].quantity+' message="'+data.data.pageData[x].itemName+'（型号：'+data.data.pageData[x].skuName+'）" value="售后处理" itemOrderCode='+data.data.pageData[x].itemOrderCode+' class="after_sale" serviceId='+data.data.pageData[x].serviceId+' userMessage="<p>姓名：'+data.data.pageData[x].userName+'</p><p>电话：'+data.data.pageData[x].phoneNum+'</p><p>地址：'+data.data.pageData[x].address+'</p>" payType='+getShopeAfterSalePayType(data.data.pageData[x].payType)+' serviceAmount='+data.data.pageData[x].serviceAmount+' serviceTypes='+getShopeAfterSaleServiceType(data.data.pageData[x].serviceType)+' ></td><td>'+data.data.pageData[x].operName+'</td></tr>');
		}else{
			$('.shope_after_sale_manage .shope_after_sale_manage_table tbody').append('<tr><td>'+data.data.pageData[x].serviceId+'</td><td><p>订单编号：'+data.data.pageData[x].itemOrderCode+'</p><p>支付来源：'+getShopeAfterSalePayType(data.data.pageData[x].payType)+'</p></td><td><p>姓名：'+data.data.pageData[x].userName+'</p><p>电话：'+data.data.pageData[x].phoneNum+'</p><p>地址：'+data.data.pageData[x].address+'</p></td><td>'+data.data.pageData[x].itemName+'（型号：'+data.data.pageData[x].skuName+'）</td><td>'+data.data.pageData[x].quantity+'</td><td>'+data.data.pageData[x].serviceAmount+'</td><td class="serContent"><p>'+data.data.pageData[x].serviceContent+'</p>'+getShopeAfterSaleImg(data.data.pageData[x].imgs)+'</td><td>'+data.data.pageData[x].serviceTime+'</td><td>'+getShopeAfterSaleServiceType(data.data.pageData[x].serviceType)+'</td><td>'+getShopeAfterSaleServiceStatus(data.data.pageData[x].serviceStatus)+'</td><td><input type="button" orderId='+data.data.pageData[x].orderId+' value="订单详情" class="green order_details" id="order_details" /><input serviceStatus='+data.data.pageData[x].serviceStatus+' serviceType='+data.data.pageData[x].serviceType+' type="button" value="售后处理" itemOrderCode='+data.data.pageData[x].itemOrderCode+' quantity='+data.data.pageData[x].quantity+' message="'+data.data.pageData[x].itemName+'（型号：'+data.data.pageData[x].skuName+'）" operStatus='+data.data.pageData[x].operStatus+' operStatus='+data.data.pageData[x].operStatus+' class="red after_sale" serviceId='+data.data.pageData[x].serviceId+' userMessage="<p>姓名：'+data.data.pageData[x].userName+'</p><p>电话：'+data.data.pageData[x].phoneNum+'</p><p>地址：'+data.data.pageData[x].address+'</p>" payType='+getShopeAfterSalePayType(data.data.pageData[x].payType)+'  serviceAmount='+data.data.pageData[x].serviceAmount+' serviceTypes='+getShopeAfterSaleServiceType(data.data.pageData[x].serviceType)+'></td><td>'+data.data.pageData[x].operName+'</td></tr>');
		}
	}
}

//获取查询参数
function searchShopeAfterSaleParams(page,serviceTimeSign){
	var params = new Object();
	if(page == undefined){
		page =1;
	};
	if(serviceTimeSign == undefined){
		serviceTimeSign ='';
	};
	params.page = page;
	params.serviceId = $.trim($('.shope_after_sale_manage .shope_after_sale_manage_search .service_id').val());
	params.orderCode = $.trim($('.shope_after_sale_manage .shope_after_sale_manage_search .order_id').val());
	params.beginServiceTime = $.trim($('.shope_after_sale_manage .shope_after_sale_manage_search .Wdate.start').val());
	params.endServiceTime = $.trim($('.shope_after_sale_manage .shope_after_sale_manage_search .Wdate.end').val());
	params.userName = $.trim($('.shope_after_sale_manage .shope_after_sale_manage_search .user_name').val());
	params.phoneNum = $.trim($('.shope_after_sale_manage .shope_after_sale_manage_search .user_tel').val());
	params.serviceType = $('.shope_after_sale_manage .shope_after_sale_manage_search .apply_type option:selected').attr('value');
	params.serviceStatus = $('.shope_after_sale_manage .shope_after_sale_manage_search .deal_with_status option:selected').attr('value');
	params.serviceTimeSign = serviceTimeSign;
	return params;
}
        
//加载品牌列表V3.1.0分页数据
function loadShopeAfterSalePage(page,serviceTimeSign){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/service/getItemServices/3.1.0',
		type : 'get',
		dataType : 'json',
		data: searchShopeAfterSaleParams(page,serviceTimeSign),
		success : initShopeAfterSalePage,
	});
}

//商品图片
function getShopeAfterSaleImg(src){
	var str = '';
	if(src.length == 0){
		str = '';
	}else{
		for(var x = 0; x < src.length;x ++){
			str += '<img src='+src[x]+' style="width:50px;" alt="" />';	
		}
	}
	return str;
}

//申诉类型
function getShopeAfterSaleServiceType(type){
	if(type == 1){
		return '退货';	
	}else if(type == 2){
		return '换货';
	}else{
		return '';	
	}
}

//处理状态
function getShopeAfterSaleServiceStatus(status){
	if(status == 0){
		return '待处理';	
	}else if(status == 1){
		return '处理中';
	}else if(status == 2){
		return '处理完成';
	}else{
		return '';	
	}
}

//支付来源
function getShopeAfterSalePayType(type){//1-微信,2-支付宝
	if(type == 1){
		return '微信';	
	}else if(type == 2){
		return '支付宝';
	}else{
		return '';	
	}
}

//退换货申诉保存接口V3.1.0(否同意召回： 1-不同意 2-同意)
function changeSaveFundServiceFn(isAgree,refundContent){
	var dataParam = {
		serviceId :$('.shope_after_sale_manage_after_sale').attr('serviceId'),
		isAgree :isAgree,
		name:$.trim($('.shope_after_sale_manage_after_sale_shensu_pass .name').val()),
		phoneNum:$.trim($('.shope_after_sale_manage_after_sale_shensu_pass .tel').val()),
		address:$.trim($('.shope_after_sale_manage_after_sale_shensu_pass .address').val()),
		refundContent:refundContent	
	}
	return dataParam;
}

//同意召回（同意/不同意）换货V3.1.0(是否同意换货： 1-不同意 2-同意)
function changeExchangeItemFn(isAgree,refundContent){
	var dataParam = {
		serviceId :$('.shope_after_sale_manage_after_sale').attr('serviceId'),
		isAgree :isAgree,
		refundContent:refundContent,
		exchangeExpressCompanyCode:$('.shope_after_sale_manage_after_sale_shensu_changeShope_pass select option:selected').attr('code'),
		exchangeExpressCompanyName:$('.shope_after_sale_manage_after_sale_shensu_changeShope_pass select option:selected').html(),
		exchangeExpressNo:$.trim($('.shope_after_sale_manage_after_sale_shensu_changeShope_pass .wuliu_hao').val())
	}
	return dataParam;
}

//同意召回（同意/不同意）退款V3.1.0(是否同意退款： 1-不同意 2-同意)
function changeFundItemFn(isAgree,refundContent,remark){
	var dataParam = {
		serviceId :$('.shope_after_sale_manage_after_sale').attr('serviceId'),
		isAgree :isAgree,
		refundContent:$.trim($('.shope_after_sale_manage_after_sale_shensu_tuikuan_unpass .liyou').val()),
		fundExpressAmount:$.trim($('.shope_after_sale_manage_after_sale_shensu_tuikuan_pass .yunfei_money').val()),
		fundAmount:$.trim($('.shope_after_sale_manage_after_sale_shensu_tuikuan_pass .tuikuan_money').val()),
		remark:remark
	}
	return dataParam;
}