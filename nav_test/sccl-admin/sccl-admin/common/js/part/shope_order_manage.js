$(function(){	
	//导入
	$('#import_into_danhao').fileupload({
		dataType: 'json',
		done: function (e, data) {
			var orderIds = '';
			$('.shope_order_manage_fahuo .shope_order_manage_fahuo_table tbody tr').each(function(index, element) {
				if(typeof($(this).children('td:eq(0)').children("input[type='checkbox']").attr('checked')) !='undefined'){
					orderIds += $(this).attr('orderId')+',';
				};
			});
			orderIds = '['+orderIds.substring(0,orderIds.length -1)+']';
			if(orderIds == '[]'){
				alert('请选择要导入的订单！！');
			}else{
				if(data.result.code == 0){
					for(var x = 0; x< data.result.data.length;x ++){
						danhaoReturnFn(data.result.data[x]);	
					}
				}else{
					alert(data.result.data.error);	
				}
			}
		}
	});
	
	//把单号回填
	function danhaoReturnFn(str){
		$('.shope_order_manage_fahuo .shope_order_manage_fahuo_table tbody tr').each(function(index, element) {
			if($(this).attr('orderId') == str.orderId && typeof($(this).children('td:eq(0)').children("input[type='checkbox']").attr('checked')) !='undefined'){
				$(this).children('td:eq(10)').children('input').attr('value',str.exporessNum);   
				$(this).children('td:eq(9)').children('select').html(wuliushangReturnFn(str.expressCompanyName));
			};
		});
	}
	
	//把物流商回填
	function wuliushangReturnFn(status){
		var data = $('body').data('wuliu');
		var str = '';
		for(var x = 0;x < data.length; x ++){
			if(status == data[x].name){
				str += '<option code='+data[x].code+' selected="selected">'+data[x].name+'</option>';
			}else{
				str += '<option code='+data[x].code+'>'+data[x].name+'</option>';
			}
		}	
		return str;
	}
	
	$('.import_into_danhao').click(function(e) {
		$('#import_into_danhao').click();
	});
	
	//跳转指定页面按钮
	$('#shope_order_manage .goto_page_box .goto_page_ok').click(function(){
		if($("#shope_order_manage .goto_page_box .goto_redirect_page_num").val() > $("#shope_order_manage .goto_page_box").attr("totnum")){
			alert("没有此页!!");
		}else{
			loadShopeGetOrderPage($("#shope_order_manage .goto_page_box .goto_redirect_page_num").val());
		}
	});
	
	//全部取消按钮
	$('#shope_order_manage .shope_order_manage_content .cancle_all_btn').click(function(e) {
        $('#shope_order_manage .shope_order_manage_content').children('input[type="text"]').val('');
        $('#shope_order_manage .shope_order_manage_content .pay_way option:eq(0)').attr('selected','selected');
        $('#shope_order_manage .shope_order_manage_content .apply_tuikuan_status option:eq(0)').attr('selected','selected');
		loadShopeGetOrderPage();
    });
	
	//根据订单状态检索数据
	$('#shope_order_manage .shope_order_manage_order_status>span').click(function(e) {
		$(this).css('color','#000').siblings().css('color','#ccc');
		$(this).addClass('on').siblings().removeClass('on');
        loadShopeGetOrderPage(1,1,$(this).attr('chooseStatus'));
		if($(this).hasClass('lock_order')){
			$('#shope_order_manage .shope_order_manage_content_li .shope_order_manage_content_li_suoding').hide();
			$('#shope_order_manage .shope_order_manage_content_li .shope_order_manage_content_li_shifang').show();
		}else if($(this).hasClass('allready_shouhuo')){
			$('#shope_order_manage .shope_order_manage_table thead .hidden.revice_time').removeClass('hidden');		
			$('#shope_order_manage .shope_order_manage_table thead .apply_time').addClass('hidden');
			setTimeout(function(){
				$('#shope_order_manage .shope_order_manage_table tbody tr').each(function(index, element) {
					$(this).children('td:eq(7)').removeClass('hidden');
					$(this).children('td:eq(8)').addClass('hidden');
				});
			},3000)
		}else if($(this).hasClass('apply_tuikuan')){
			$('#shope_order_manage .shope_order_manage_table thead .hidden.apply_time').removeClass('hidden');	
			$('#shope_order_manage .shope_order_manage_table thead .revice_time').addClass('hidden');
			setTimeout(function(){
				$('#shope_order_manage .shope_order_manage_table tbody tr').each(function(index, element) {
					$(this).children('td:eq(8)').removeClass('hidden');
					$(this).children('td:eq(7)').addClass('hidden');
				});
			},3000)
		}else{
			$('#shope_order_manage .shope_order_manage_table thead .revice_time').addClass('hidden');
			$('#shope_order_manage .shope_order_manage_table thead .apply_time').addClass('hidden');			
			$('#shope_order_manage .shope_order_manage_content_li .shope_order_manage_content_li_suoding').show();
			$('#shope_order_manage .shope_order_manage_content_li .shope_order_manage_content_li_shifang').hide();
			$('#shope_order_manage .shope_order_manage_table tbody tr').each(function(index, element) {
                $(this).children('td:eq(7)').addClass('hidden');
                $(this).children('td:eq(8)').addClass('hidden');
            });
		}
    });
	
	//降序
	$('#shope_order_manage .shope_order_manage_table .down_arr_btn').click(function(e) {
        loadShopeGetOrderPage(1,$(this).attr('value'));
    });
	
	//升序
	$('#shope_order_manage .shope_order_manage_table .up_arr_btn').click(function(e) {
        loadShopeGetOrderPage(1,$(this).attr('value'));
    });
	
	//查看订单信息
	$('.table-message.shope_order_manage_table .look_details').live('click',function(e) {
		var btn = $(this);
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/order/getOrderDetail/3.1.0',{orderId:btn.parent().parent().attr('orderId')},function(data){
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

				$('.shope_order_manage_look_order_message').show().css('top',$(window).scrollTop()).attr('orderId',btn.parent().parent().attr('orderId'));
				$('.shope_order_manage_look_order_message .order_id').html(data.data.orderCode);
				$('.shope_order_manage_look_order_message .wuliu_id').html(data.data.transCode);
				$('.shope_order_manage_look_order_message .xiadan_time').html(data.data.createTime);
				$('.shope_order_manage_look_order_message .user_name').val(data.data.customerName);
				$('.shope_order_manage_look_order_message .user_tel').val(data.data.customerPhone);
				$('.shope_order_manage_look_order_message .user_address').val(data.data.customerAddress);
				$('.shope_order_manage_look_order_message .order_money').val(data.data.orderAmount);
				$('.shope_order_manage_look_order_message .yunfei_money').val(data.data.transAmount);
			}else{
				alert(data.data.error);	
			}
		});		
    });
	
	//点击取消按钮，关闭查看订单信息弹框
	$('.shope_order_manage_look_order_message .shope_order_manage_look_order_message_cancle_btn').click(function(e) {
        $('.shope_order_manage_look_order_message').hide().removeAttr('orderId');
		$('.shope_order_manage_look_order_message').children('input[type="text"]').removeAttr('disabled');
		$('.shope_order_manage_look_order_message .shope_order_manage_look_order_message_save_btn').show();
    });
	
	//点击确认按钮，关闭查看订单信息弹框
	//查看详情保存V3.1.0
	$('.shope_order_manage_look_order_message .shope_order_manage_look_order_message_save_btn').click(function(e) {
		var btn = $(this);
		var r = confirm('确认要更新？？');
		var paramData = {
			orderId:btn.parent().attr('orderId'),
			customerName:$.trim($('.shope_order_manage_look_order_message .user_name').val()),
			customerPhone:$.trim($('.shope_order_manage_look_order_message .user_tel').val()),
			customerAddress:$.trim($('.shope_order_manage_look_order_message .user_address').val()),
			orderAmount:$.trim($('.shope_order_manage_look_order_message .order_money').val()),
			transAmount:$.trim($('.shope_order_manage_look_order_message .yunfei_money').val()),
			//payAmount:$.trim($('.shope_order_manage_look_order_message .zhifu_money').val())	
		};
		if(r == true){
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/order/saveOrder/3.1.0',paramData,function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.shope_order_manage_look_order_message').hide();
				}else{
					alert(data.data.error);	
				}
			});		
		};
    });
	
	//点击发货弹框里的返回按钮
	$('.shope_order_manage_fahuo .shope_order_manage_fahuo_return').click(function(e) {
        $('.shope_order_manage_fahuo').hide();
		$('#shope_order_manage').show();
		loadShopeGetOrderPage();
    });
	
	//点击退款图标
	//退款管理展示信息V3.1.0
	$('.shope_order_manage_table .reimburse').live('click',function(e) {
		$('.shope_order_manage_tuikuan_content .shope_order_manage_tuikuan_content_reason input[type="checkbox"]').removeAttr('checked');
		var btn = $(this);
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/order/getRefundOrder/3.1.0',{orderId:btn.parent().parent().attr('orderId')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.shope_order_manage_tuikuan_content').show().attr('orderId',btn.parent().parent().attr('orderId'));
				$('#shope_order_manage').hide();
				$('.shope_order_manage_tuikuan_content .shope_order_manage_tuikuan_content_table tbody').html('<tr><td>'+data.data.orderCode+'</td><td>'+data.data.transCode+'</td><td>'+data.data.createTime+'</td><td>'+data.data.customerName+'</td><td>'+data.data.customerPhone+'</td><td>'+data.data.address+'</td><td>'+data.data.paySource+'</td><td>'+data.data.orderAmount+'</td><td>'+data.data.transAmount+'</td><td>'+data.data.payAmount+'</td><td>'+data.data.refundAmount+'</td></tr>');
				$('.shope_order_manage_tuikuan_content_reason textarea').val(data.data.refundReason);
				$('.shope_order_manage_tuikuan_content .pass .order_money').html(data.data.orderAmount);
				$('.shope_order_manage_tuikuan_content .pass .yunfei_money').html(data.data.transAmount);
				$('.shope_order_manage_tuikuan_content .pass .pay_money').html(data.data.payAmount);
			}else{
				alert(data.data.error);	
			}
		});		
    });
	
	//点击退款理由里面的取消按钮
	$('.shope_order_manage_tuikuan_content_reason .cancle_btn').click(function(e) {
        $('.shope_order_manage_tuikuan_content').hide();
		$('#shope_order_manage').show();
		$('.shope_order_manage_tuikuan_content .pass').hide();
    });
	
	//点击退款理由里面的保存按钮
	$('.shope_order_manage_tuikuan_content_reason .save_btn').click(function(e) {
        $('.shope_order_manage_tuikuan_content').hide();
		$('#shope_order_manage').show();
    });
	
	//点击退款理由里的给通过理由
	$('.shope_order_manage_tuikuan_content_reason #check_open').click(function(e) {
		var r = confirm('确认给予退款处理？？');
		if(r == true){
			$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/order/confirmRefund/3.1.0',{orderId:$('.shope_order_manage_tuikuan_content').attr('orderId')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.shope_order_manage_tuikuan_content .pass').show();	
					$('.shope_order_manage_tuikuan_content .un_pass').hide();
					$('.shope_order_manage_tuikuan_content .pass .tuikuan_money').val('');	
				}else{
					alert(data.data.error);	
				}
			});
		};
    });
	
	//点击退款理由里的不给通过理由
	$('.shope_order_manage_tuikuan_content_reason #check_close').click(function(e) {
		$('.shope_order_manage_business_note textarea').val('');
        $('.shope_order_manage_tuikuan_content .un_pass').show().css('top',($(window).height()+$(window).scrollTop())/2);
		$('.shope_order_manage_tuikuan_content .pass').hide();
    });
	//退款理由弹框跟随滚动条移动
	$(window).scroll(function () {
		$('.shope_order_manage_tuikuan_content .un_pass').animate({'top': $(window).scrollTop() + 50 }, 10); 
		$('.shope_order_manage_tuikuan_content .pass').animate({'top': $(window).scrollTop() + 50 }, 10); 
		$('.shope_order_manage_business_note').animate({'top': $(window).scrollTop() + 50 }, 10); 
	});	
	
	//商家备注
	$('#shope_order_manage .shope_order_manage_table .seller_note').live('click',function(e) {
        $('.shope_order_manage_business_note').show().css('top',($(window).height()+$(window).scrollTop())/2).attr('orderId',$(this).parent().parent().attr('orderId'));
    });
	
	//添加备注V3.1.0--保存按钮
	$('.shope_order_manage_business_note .save_btn').click(function(e) {
        if($.trim($('.shope_order_manage_business_note textarea').val()) == ''){
			alert('请填写备注内容！！');
		}else{
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/order/sellerNote/3.1.0',{orderId:$('.shope_order_manage_business_note').attr('orderId'),descrip:$.trim($('.shope_order_manage_business_note textarea').val())},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.shope_order_manage_business_note').hide();
					loadShopeGetOrderPage();
				}else{
					alert(data.data.error);	
				}
			});
		}
    });
	
	//商家备注--取消按钮
	$('.shope_order_manage_business_note .cancle_btn').click(function(e) {
        $('.shope_order_manage_business_note').hide();
		$('.shope_order_manage_business_note textarea').val('');
    });
	
	
	//点击不通过理由弹框里的取消按钮
	$('.shope_order_manage_tuikuan_content .un_pass .cancle_btn').click(function(e) {
        $('.shope_order_manage_tuikuan_content .un_pass').hide();
    });
	
	//点击不通过理由弹框里的发送按钮
	$('.shope_order_manage_tuikuan_content .un_pass .send_btn').click(function(e) {
        $('.shope_order_manage_tuikuan_content .un_pass').hide();
		if($.trim($('.shope_order_manage_business_note textarea').val()) == ''){
			alert('请填写不通过理由！！');
		}else{
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/order/confirmNoRefund/3.1.0',{orderId:$('.shope_order_manage_tuikuan_content').attr('orderId'),descrip:$.trim($('.shope_order_manage_business_note textarea').val())},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.shope_order_manage_business_note').hide();
					loadShopeGetOrderPage();
				}else{
					alert(data.data.error);	
				}
			});
		}
    });
	
	//点击通过退款理由弹框里的取消按钮
	$('.shope_order_manage_tuikuan_content .pass .cancle_btn').click(function(e) {
        $('.shope_order_manage_tuikuan_content .pass').hide();
    });
	
	//点击通过退款理由弹框里的保存按钮
	$('.shope_order_manage_tuikuan_content .pass .sure_btn').click(function(e) {
		var btn = $(this);
		var r = confirm('确认要退款？？');
		if(r == true){
			if($.trim($('.shope_order_manage_tuikuan_content .pass .tuikuan_money').val()) == ''){
				alert('请填写退款金额！！');	
			}else{
				btn.attr('disabled','disabled');
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/order/refund/3.1.0',{orderId:$('.shope_order_manage_tuikuan_content').attr('orderId'),refundAmount:$.trim($('.shope_order_manage_tuikuan_content .pass .tuikuan_money').val())},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						btn.removeAttr('disabled');
						$('.shope_order_manage_tuikuan_content .pass,.shope_order_manage_tuikuan_content_reason,.shope_order_manage_tuikuan_content').hide();
						loadShopeGetOrderPage();
						$('#shope_order_manage').show();
					}else{
						btn.removeAttr('disabled');
						alert(data.data.error);	
					}
				});		
			}
		};
    });
	
	//退款复选框
	$('.shope_order_manage_tuikuan_content_reason>input[type=checkbox]').click(function(e) {
        $(this).attr('checked','checked').siblings().removeAttr('checked');
    });
	
	//修改金额
	$('#shope_order_manage .shope_order_manage_table .shope_order_manage_table_modify_money').live('click',function(e) {
        var btn = $(this);
		var r = confirm('确认要修改该订单金额？？');
		if(r == true){
			if($.trim(btn.prev()) == ''){
				alert('修改金额不能为空！！');
			}else{
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/order/modifyOrder/3.1.0',{orderId:btn.parent().parent().attr('orderId'),price:$.trim(btn.prev().attr('value'))},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						alert('修改成功！！');
					}else{
						alert(data.data.error);	
					}
				});
			}
		};
    });
	
	//修改当前状态
	$('#shope_order_manage .shope_order_manage_table .shope_order_manage_table_modify_status').live('click',function(e) {
        var btn = $(this);
		var r = confirm('确认要修改当前订单状态？？');
		if(r == true){
			$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/order/changeOrderStatus/3.1.0',{orderId:btn.parent().parent().attr('orderId'),orderStatusId:btn.prev().children('option:selected').attr('value')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					alert('修改成功！！');
					loadShopeGetOrderPage();
				}else{
					alert(data.data.error);	
				}
			});
		}
    });
	
	//修改物流单号
	//修改物流信息V3.1.0
	$('#shope_order_manage .shope_order_manage_table .modify_wuliu_hao').live('click',function(e) {
        var btn = $(this);
		var r = confirm('确认要修改该物流信心？？');
		if(r == true){
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/order/modifyOrderTrans/3.1.0',{orderId:btn.parent().parent().attr('orderId'),expressNum:$.trim(btn.prev().val()),expressCode:btn.prev().prev().children('option:selected').attr('code')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					alert('修改成功！！');
				}else{
					alert(data.data.error);	
				}
			});
		};
    });
	
	//关闭订单
	$('#shope_order_manage .shope_order_manage_table .close_order').live('click',function(e) {
		var btn = $(this);
        var r = confirm('确认要关闭订单？？');
		if(r == true){
			$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/order/closeOrder/3.1.0',{orderId:btn.parent().parent().attr('orderId')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					loadShopeGetOrderPage();
				}else{
					alert(data.data.error);	
				}
			});
		};
    });
	
	//全选_全部订单
	$('#shope_order_manage .shope_order_manage_content_li #select_all_01').click(function(e) {
		if(typeof($(this).attr('checked')) != 'undefined'){
			$('#shope_order_manage .shope_order_manage_table tbody tr').each(function(index, element) {
				if($(this).children('td:eq(0)').children("input[type='checkbox']")){
					$(this).children('td:eq(0)').children("input[type='checkbox']").attr('checked','checked');
				}
			});
		}else{
			$('#shope_order_manage .shope_order_manage_table tbody tr').each(function(index, element) {
				if($(this).children('td:eq(0)').children("input[type='checkbox']")){
					$(this).children('td:eq(0)').children("input[type='checkbox']").removeAttr('checked');
				}
			});
		}
    });
	
	//全选_发货
	$('.shope_order_manage_fahuo #check').click(function(e) {
		if(typeof($(this).attr('checked')) != 'undefined'){
			$('.shope_order_manage_fahuo .shope_order_manage_fahuo_table tbody tr').each(function(index, element) {
				if($(this).children('td:eq(0)').children("input[type='checkbox']")){
					$(this).children('td:eq(0)').children("input[type='checkbox']").attr('checked','checked');
				}
			});
		}else{
			$('.shope_order_manage_fahuo .shope_order_manage_fahuo_table tbody tr').each(function(index, element) {
				if($(this).children('td:eq(0)').children("input[type='checkbox']")){
					$(this).children('td:eq(0)').children("input[type='checkbox']").removeAttr('checked');
				}
			});
		}
    });
	
	//导出
	$('.shope_order_manage .shope_order_manage_content_li .shope_order_manage_content_li_daochu').click(function(e) {
		var orderIds = '';
		$('.shope_order_manage .shope_order_manage_table tbody tr').each(function(index, element) {
			if(typeof($(this).children('td:eq(0)').children("input[type='checkbox']").attr('checked')) !='undefined'){
				orderIds += $(this).attr('orderId')+',';
			};
        });
		orderIds = '['+orderIds.substring(0,orderIds.length -1)+']';
		if(orderIds == '[]'){
			alert('请选择要导出的订单！！');
		}else{
			$('.shope_order_manage_fahuo #check').removeAttr('checked');
			window.location.href = "<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/order/exportOrderToExcel/3.1.0?orderIds=" + orderIds+'&v=<%= VERSION %>';
		}
    });
	
	//发货导出
	$('.shope_order_manage_fahuo .import_order_message').click(function(e) {
		var orderIds = '';
		$('.shope_order_manage_fahuo .shope_order_manage_fahuo_table tbody tr').each(function(index, element) {
			if(typeof($(this).children('td:eq(0)').children("input[type='checkbox']").attr('checked')) !='undefined'){
				orderIds += $(this).attr('orderId')+',';
			};
        });
		orderIds = '['+orderIds.substring(0,orderIds.length -1)+']';
		if(orderIds == '[]'){
			alert('请选择要导出的订单！！');
		}else{
			$('.shope_order_manage_fahuo #check').removeAttr('checked');
			window.location.href = "<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/order/exportOrderToExcel/3.1.0?orderIds=" + orderIds+'&v=<%= VERSION %>';
		}
    });
	
	//查询
	$('#shope_order_manage .shope_order_manage_content .search_btn').click(function(e) {
        loadShopeGetOrderPage();
    });
	
	//查看物流
	$('#shope_order_manage .shope_order_manage_table .look_wuliu').live('click',function(e) {
		var btn = $(this);
		$('.shope_after_sale_manage_wuliu_message').show().css('top',$(window).scrollTop()+100);
		$('.shope_after_sale_manage_wuliu_message ul li').remove();
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/service/getExpressTrace/3.1.0',{expressNum:$.trim(btn.parent().children('.text_padding').val()),companyCode:btn.parent().children('.wuliu_shang').children('option:selected').attr('code')},function(data){
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
	
	//删除订单V3.1.0
	$('#shope_order_manage .shope_order_manage_content_li .shope_order_manage_content_li_del').click(function(e) {
		var orderIds = '';
		$('.shope_order_manage .shope_order_manage_table tbody tr').each(function(index, element) {
			if(typeof($(this).children('td:eq(0)').children("input[type='checkbox']").attr('checked')) !='undefined'){
				orderIds += $(this).attr('orderId')+',';
			};
        });
		orderIds = '['+orderIds.substring(0,orderIds.length -1)+']';
		var btn = $(this);
		if(orderIds != '[]'){
			var r = confirm('确认要删除该订单信息？？');
			if(r == true){
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/order/deleteOrder/3.1.0',{orderIds:orderIds},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						loadShopeGetOrderPage();
					}else{
						alert(data.data.error);	
					}
				});
			};
		}else{
			alert('请勾选要删除的订单！！');	
		}
    });
	
	//锁定订单
	$('.shope_order_manage .shope_order_manage_content_li .shope_order_manage_content_li_suoding').click(function(e) {
		var orderIds = '';
		$('.shope_order_manage .shope_order_manage_table tbody tr').each(function(index, element) {
			if(typeof($(this).children('td:eq(0)').children("input[type='checkbox']").attr('checked')) !='undefined'){
				orderIds += $(this).attr('orderId')+',';
			};
        });
		orderIds = '['+orderIds.substring(0,orderIds.length -1)+']';
		var btn = $(this);
		if(orderIds != '[]'){
			var r = confirm('确认要锁定该订单信息？？');
			if(r == true){
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/order/lockOrder/3.1.0',{orderIds:orderIds},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						loadShopeGetOrderPage();
					}else{
						alert(data.data.error);	
					}
				});
			};
		}else{
			alert('请勾选要锁定的订单！！');	
		}
    });
	
	//释放订单
	$('.shope_order_manage .shope_order_manage_content_li .shope_order_manage_content_li_shifang').click(function(e) {
		var orderIds = '';
		$('.shope_order_manage .shope_order_manage_table tbody tr').each(function(index, element) {
			if(typeof($(this).children('td:eq(0)').children("input[type='checkbox']").attr('checked')) !='undefined'){
				orderIds += $(this).attr('orderId')+',';
			};
        });
		orderIds = '['+orderIds.substring(0,orderIds.length -1)+']';
		var btn = $(this);
		if(orderIds != '[]'){
			var r = confirm('确认要释放该订单信息？？');
			if(r == true){
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/order/unlockOrder/3.1.0',{orderIds:orderIds},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						loadShopeGetOrderPage();
					}else{
						alert(data.data.error);	
					}
				});
			};
		}else{
			alert('请勾选要释放的订单！！');	
		}
    });
	
	//点击发货按钮
	//发货展示列表V3.1.0
	$('.shope_order_manage_content_li .shope_order_manage_content_li_fahuo').click(function(e) {
		var orderIds = '';
		$('.shope_order_manage .shope_order_manage_table tbody tr').each(function(index, element) {
			if(typeof($(this).children('td:eq(0)').children("input[type='checkbox']").attr('checked')) !='undefined'){
				orderIds += $(this).attr('orderId')+',';
			};
        });
		orderIds = '['+orderIds.substring(0,orderIds.length -1)+']';
		var btn = $(this);
		if(orderIds != '[]'){
			var r = confirm('确认要发货？？');
			if(r == true){
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/order/getSendList/3.1.0',{orderIds:orderIds},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						$('.shope_order_manage_fahuo .shope_order_manage_fahuo_table tbody tr').remove();
						$('.shope_order_manage_fahuo').show();
						$('#shope_order_manage').hide();
						for(var x = 0 ; x < data.data.length ;x ++){
							//获取发货列表
							getSendListFn(data.data[x],data.data[x].skuList);
						}
					}else{
						alert(data.data.error);	
					}
				});
			};
		}else{
			alert('请勾选要发货的订单！！');	
		}
    });
	$('.shope_order_manage .shope_order_manage_table .ship').live('click',function(e) {
		var r = confirm('确认要发货？？');
		var orderIds = '['+$(this).parent().parent().attr('orderId')+']';
		if(r == true){
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/order/getSendList/3.1.0',{orderIds:orderIds},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.shope_order_manage_fahuo .shope_order_manage_fahuo_table tbody tr').remove();
					$('.shope_order_manage_fahuo').show();
					$('#shope_order_manage').hide();
					for(var x = 0 ; x < data.data.length ;x ++){
						//获取发货列表
						getSendListFn(data.data[x],data.data[x].skuList);
					}
				}else{
					alert(data.data.error);	
				}
			});
		};
    });
	
	
	
	//根据物流单号、物流商、订单编号--发货
	$('.shope_order_manage_fahuo .fahuo_btn').click(function(e) {
		var arr = new Array();
		$('.shope_order_manage_fahuo .shope_order_manage_fahuo_table tbody tr').each(function(index, element) {
			if(typeof($(this).attr('orderId')) != 'undefined' && typeof($(this).children('td:eq(0)').children('input').attr('checked')) != 'undefined' && $(this).children('td:eq(11)').children('input').hasClass('green')){
				var obj = new Object();
				obj.orderId = $(this).attr('orderId');
				obj.transCode = $(this).children('td:eq(9)').children('select').children('option:selected').attr('code');
				obj.transNum = $(this).children('td:eq(10)').children('input').val();
				arr.push(obj);
			};
		});
		var sendSelectGoods = JSON.stringify(arr);
		var r = confirm('确认要发货？？');
		if(r == true){
			if(sendSelectGoods == '[]'){
				alert('请选择要发货的订单！！');
			}else{
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/order/sendGoods/3.1.0',{sendSelectGoods:sendSelectGoods},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						$('.shope_order_manage_fahuo .shope_order_manage_fahuo_table tbody tr').each(function(index, element) {
							if(typeof($(this).attr('orderId')) != 'undefined' && typeof($(this).children('td:eq(0)').children('input').attr('checked')) != 'undefined'){
								$(this).children('td:eq(11)').children('input').removeClass('green');
								$(this).children('td:eq(0)').children('input').removeAttr('checked');
							};
						});
					}else{
						alert(data.data.error);	
					}
				});
			}
		};		
    });
	$('.shope_order_manage_fahuo .shope_order_manage_fahuo_table .shope_order_manage_fahuo_table_fahuo').live('click',function(e) {
		var btn = $(this);
        if(btn.hasClass('green')){
			var arr = new Array();
			var r = confirm('确认要发货？？');
			var obj = new Object();
			obj.orderId = btn.parent().parent().attr('orderId');
			obj.transCode = btn.parent().parent().children('td:eq(9)').children('select').children('option:selected').attr('code');
			obj.transNum = btn.parent().parent().children('td:eq(10)').children('input').val();
			arr.push(obj);
			var sendSelectGoods = JSON.stringify(arr);
			if(r == true){
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/order/sendGoods/3.1.0',{sendSelectGoods:sendSelectGoods},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						btn.removeClass('green');
					}else{
						alert(data.data.error);	
					}
				});
			};
		};
    });
	
	
});

//创建获取订单列表V3.1.0列表分页
function createShopeGetOrderPage(data){
	$("#shope_order_manage .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = searchShopeGetOrderParams();
			params.page = p;
			$('.shope_order_manage .shope_order_manage_table tbody tr').remove(); //清除原来的表格信息信息
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/order/getOrder/3.1.0',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initShopeGetOrderPage
			});			
		}
	});
}

//初始化获取订单列表V3.1.0分页
function initShopeGetOrderPage(data){
	$('.shope_order_manage .shope_order_manage_table tbody tr').remove(); //清除原来的表格信息
	createShopeGetOrderPage(data)
	if(data.data.userOrderDetailInfo.length > 0){
		$('#shope_order_manage .goto_page_box').attr("totnum",data.data.totalPageNum);
		$('#shope_order_manage .goto_page_box .totNum').text(data.data.totalNum).css("color","#f00");
		$('#shope_order_manage .shope_order_manage_order_status .all_order .font_color_red').html(data.data.allOrder);
		$('#shope_order_manage .shope_order_manage_order_status .wait_fahuo .font_color_red').html(data.data.waitSend);
		$('#shope_order_manage .shope_order_manage_order_status .allready_fahuo .font_color_red').html(data.data.haveSend);
		$('#shope_order_manage .shope_order_manage_order_status .allready_shouhuo .font_color_red').html(data.data.haveReceive);
		$('#shope_order_manage .shope_order_manage_order_status .apply_tuikuan .font_color_red').html(data.data.refundApply);
		$('#shope_order_manage .shope_order_manage_order_status .allready_del .font_color_red').html(data.data.haveDelete);
		$('#shope_order_manage .shope_order_manage_order_status .lock_order .font_color_red').html(data.data.lockOrder);
		$('#shope_order_manage .shope_order_manage_order_status .allready_close_order .font_color_red').html(data.data.closedOrder);
		$('#shope_order_manage .shope_order_manage_order_status .wait_fukuan .font_color_red').html(data.data.waitPay);
		$('#shope_order_manage .shope_order_manage_order_status .allready_tuikuan .font_color_red').html(data.data.havaRefund);
		for(var x = 0; x < data.data.userOrderDetailInfo.length; x ++){
			orderSkusFn(data.data.userOrderDetailInfo[x],data.data.userOrderDetailInfo[x].orderSkus);
		}
	};
}

function orderSkusFn(data,sku){
	if(sku.length > 0){
		for(var x = 0; x < sku.length ; x ++){
			if(x == 0){
				//判断该订单是否申请过售后
				if(data.isRefund == 0){//未做过退款申请
					//判断当前状态是否为已发货状态，代发货状态 canModify  0-可以修改，1-不能修改
					if(data.canModify == 0){
						//仅待付款状态可修改金额
						if(data.orderStatus[0].num == 1){
							$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td rowspan='+sku.length+'><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td><p>'+sku[x].title+'</p></td><td>'+sku[x].num+'</td><td rowspan='+sku.length+'>'+data.createTime+'</td><td rowspan='+sku.length+'><input type="text" value="'+data.payAcount+'" style=" width:50px; text-align:center;" class="text_padding" /><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_money" /></td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td rowspan='+sku.length+'><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td rowspan='+sku.length+'><select name="" id="" style="padding:7px; border:1px solid #ccc;" class="wuliu_shang">'+getWuLiuMessageFn(data.transCompanyName)+'</select><input type="text" value="'+data.transNum+'" class="text_padding" style="width:100px; padding: 8px;vertical-align: bottom;"/><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="modify_wuliu_hao" /><br /><br /><div class="look_wuliu"><img src="images/look_icon.jpg" style="width:20px; vertical-align:bottom;" alt="" /><span>查看物流</span></div></td><td rowspan='+sku.length+'>'+data.customerNote+'</td><td rowspan='+sku.length+'>'+data.sellerNote+'</td><td rowspan='+sku.length+'>无</td><td rowspan='+sku.length+'>'+getMenuStatusFn(data.strings)+'</td><td rowspan='+sku.length+'>'+data.modifyer+'</td><td rowspan='+sku.length+'>'+data.customerName+'</td><td rowspan='+sku.length+'>'+data.customerPhone+'</td><td rowspan='+sku.length+'>'+data.customerAddress+'</td></tr>');
						}else{
							$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td rowspan='+sku.length+'><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td><p>'+sku[x].title+'</p></td><td>'+sku[x].num+'</td><td rowspan='+sku.length+'>'+data.createTime+'</td><td rowspan='+sku.length+'>'+data.payAcount+'</td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td rowspan='+sku.length+'><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td rowspan='+sku.length+'><select name="" id="" style="padding:7px; border:1px solid #ccc;" class="wuliu_shang">'+getWuLiuMessageFn(data.transCompanyName)+'</select><input type="text" value="'+data.transNum+'" class="text_padding" style="width:100px; padding: 8px;vertical-align: bottom;"/><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="modify_wuliu_hao" /><br /><br /><div class="look_wuliu"><img src="images/look_icon.jpg" style="width:20px; vertical-align:bottom;" alt="" /><span>查看物流</span></div></td><td rowspan='+sku.length+'>'+data.customerNote+'</td><td rowspan='+sku.length+'>'+data.sellerNote+'</td><td rowspan='+sku.length+'>无</td><td rowspan='+sku.length+'>'+getMenuStatusFn(data.strings)+'</td><td rowspan='+sku.length+'>'+data.modifyer+'</td><td rowspan='+sku.length+'>'+data.customerName+'</td><td rowspan='+sku.length+'>'+data.customerPhone+'</td><td rowspan='+sku.length+'>'+data.customerAddress+'</td></tr>');
						}
					}else{
						//仅待付款状态可修改金额
						if(data.orderStatus[0].num == 1){
							$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td rowspan='+sku.length+'><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td><p>'+sku[x].title+'</p></td><td>'+sku[x].num+'</td><td rowspan='+sku.length+'>'+data.createTime+'</td><td rowspan='+sku.length+'><input type="text" value="'+data.payAcount+'" style=" width:50px; text-align:center;" class="text_padding" /><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_money" /></td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td rowspan='+sku.length+'><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td rowspan='+sku.length+'>物流单号：'+data.transNum+'</td><td rowspan='+sku.length+'>'+data.customerNote+'</td><td rowspan='+sku.length+'>'+data.sellerNote+'</td><td rowspan='+sku.length+'>无</td><td rowspan='+sku.length+'>'+getMenuStatusFn(data.strings)+'</td><td rowspan='+sku.length+'>'+data.modifyer+'</td><td rowspan='+sku.length+'>'+data.customerName+'</td><td rowspan='+sku.length+'>'+data.customerPhone+'</td><td rowspan='+sku.length+'>'+data.customerAddress+'</td></tr>');
						}else{
							$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td rowspan='+sku.length+'><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td><p>'+sku[x].title+'</p></td><td>'+sku[x].num+'</td><td rowspan='+sku.length+'>'+data.createTime+'</td><td rowspan='+sku.length+'>'+data.payAcount+'</td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td rowspan='+sku.length+'><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td rowspan='+sku.length+'>物流单号：'+data.transNum+'</td><td rowspan='+sku.length+'>'+data.customerNote+'</td><td rowspan='+sku.length+'>'+data.sellerNote+'</td><td rowspan='+sku.length+'>无</td><td rowspan='+sku.length+'>'+getMenuStatusFn(data.strings)+'</td><td rowspan='+sku.length+'>'+data.modifyer+'</td><td rowspan='+sku.length+'>'+data.customerName+'</td><td rowspan='+sku.length+'>'+data.customerPhone+'</td><td rowspan='+sku.length+'>'+data.customerAddress+'</td></tr>');
						}
					}
				}else{
					//判断该订单退款申请状态
					if(data.refundStatus == 0){//退款申请状态,[0-未处理,1-已处理]
						//判断当前状态是否为已发货状态，代发货状态 canModify  0-可以修改，1-不能修改
						if(data.canModify == 0){
							//仅待付款状态可修改金额
							if(data.orderStatus[0].num == 1){
								$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td rowspan='+sku.length+'><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td><p>'+sku[x].title+'</p></td><td>'+sku[x].num+'</td><td rowspan='+sku.length+'>'+data.createTime+'</td><td rowspan='+sku.length+'><input type="text" value="'+data.payAcount+'" style=" width:50px; text-align:center;" class="text_padding" /><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_money" /></td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td rowspan='+sku.length+'><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td rowspan='+sku.length+'><select name="" id="" style="padding:7px; border:1px solid #ccc;" class="wuliu_shang">'+getWuLiuMessageFn(data.transCompanyName)+'</select><input type="text" value="'+data.transNum+'" class="text_padding" style="width:100px; padding: 8px;vertical-align: bottom;"/><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="modify_wuliu_hao" /><br /><br /><div class="look_wuliu"><img src="images/look_icon.jpg" style="width:20px; vertical-align:bottom;" alt="" /><span>查看物流</span></div></td><td rowspan='+sku.length+'>'+data.customerNote+'</td><td rowspan='+sku.length+'>'+data.sellerNote+'</td><td rowspan='+sku.length+'>'+data.refundReason+'<p class="font_color_red">（未处理）</p></td><td rowspan='+sku.length+'>'+getMenuStatusFn(data.strings)+'</td><td rowspan='+sku.length+'>'+data.modifyer+'</td><td rowspan='+sku.length+'>'+data.customerName+'</td><td rowspan='+sku.length+'>'+data.customerPhone+'</td><td rowspan='+sku.length+'>'+data.customerAddress+'</td></tr>');
							}else{
								$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td rowspan='+sku.length+'><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td><p>'+sku[x].title+'</p></td><td>'+sku[x].num+'</td><td rowspan='+sku.length+'>'+data.createTime+'</td><td rowspan='+sku.length+'>'+data.payAcount+'</td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td rowspan='+sku.length+'><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td rowspan='+sku.length+'><select name="" id="" style="padding:7px; border:1px solid #ccc;" class="wuliu_shang">'+getWuLiuMessageFn(data.transCompanyName)+'</select><input type="text" value="'+data.transNum+'" class="text_padding" style="width:100px; padding: 8px;vertical-align: bottom;"/><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="modify_wuliu_hao" /><br /><br /><div class="look_wuliu"><img src="images/look_icon.jpg" style="width:20px; vertical-align:bottom;" alt="" /><span>查看物流</span></div></td><td rowspan='+sku.length+'>'+data.customerNote+'</td><td rowspan='+sku.length+'>'+data.sellerNote+'</td><td rowspan='+sku.length+'>'+data.refundReason+'<p class="font_color_red">（未处理）</p></td><td rowspan='+sku.length+'>'+getMenuStatusFn(data.strings)+'</td><td rowspan='+sku.length+'>'+data.modifyer+'</td><td rowspan='+sku.length+'>'+data.customerName+'</td><td rowspan='+sku.length+'>'+data.customerPhone+'</td><td rowspan='+sku.length+'>'+data.customerAddress+'</td></tr>');
							}
						}else{
							//仅待付款状态可修改金额
							if(data.orderStatus[0].num == 1){
								$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td rowspan='+sku.length+'><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td><p>'+sku[x].title+'</p></td><td>'+sku[x].num+'</td><td rowspan='+sku.length+'>'+data.createTime+'</td><td rowspan='+sku.length+'><input type="text" value="'+data.payAcount+'" style=" width:50px; text-align:center;" class="text_padding" /><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_money" /></td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td rowspan='+sku.length+'><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td rowspan='+sku.length+'>物流单号：'+data.transNum+'</td><td rowspan='+sku.length+'>'+data.customerNote+'</td><td rowspan='+sku.length+'>'+data.sellerNote+'</td><td rowspan='+sku.length+'>'+data.refundReason+'<p class="font_color_red">（未处理）</p></td><td rowspan='+sku.length+'>'+getMenuStatusFn(data.strings)+'</td><td rowspan='+sku.length+'>'+data.modifyer+'</td><td rowspan='+sku.length+'>'+data.customerName+'</td><td rowspan='+sku.length+'>'+data.customerPhone+'</td><td rowspan='+sku.length+'>'+data.customerAddress+'</td></tr>');
							}else{
								$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td rowspan='+sku.length+'><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td><p>'+sku[x].title+'</p></td><td>'+sku[x].num+'</td><td rowspan='+sku.length+'>'+data.createTime+'</td><td rowspan='+sku.length+'>'+data.payAcount+'</td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td rowspan='+sku.length+'><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td rowspan='+sku.length+'>物流单号：'+data.transNum+'</td><td rowspan='+sku.length+'>'+data.customerNote+'</td><td rowspan='+sku.length+'>'+data.sellerNote+'</td><td rowspan='+sku.length+'>'+data.refundReason+'<p class="font_color_red">（未处理）</p></td><td rowspan='+sku.length+'>'+getMenuStatusFn(data.strings)+'</td><td rowspan='+sku.length+'>'+data.modifyer+'</td><td rowspan='+sku.length+'>'+data.customerName+'</td><td rowspan='+sku.length+'>'+data.customerPhone+'</td><td rowspan='+sku.length+'>'+data.customerAddress+'</td></tr>');
							}
						}
					}else{
						//判断当前状态是否为已发货状态，代发货状态 canModify  0-可以修改，1-不能修改
						if(data.canModify == 0){
							//仅待付款状态可修改金额
							if(data.orderStatus[0].num == 1){
								$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td rowspan='+sku.length+'><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td><p>'+sku[x].title+'</p></td><td>'+sku[x].num+'</td><td rowspan='+sku.length+'>'+data.createTime+'</td><td rowspan='+sku.length+'><input type="text" value="'+data.payAcount+'" style=" width:50px; text-align:center;" class="text_padding" /><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_money" /></td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td rowspan='+sku.length+'><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td rowspan='+sku.length+'><select name="" id="" style="padding:7px; border:1px solid #ccc;" class="wuliu_shang">'+getWuLiuMessageFn(data.transCompanyName)+'</select><input type="text" value="'+data.transNum+'" class="text_padding" style="width:100px; padding: 8px;vertical-align: bottom;"/><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="modify_wuliu_hao" /><br /><br /><div class="look_wuliu"><img src="images/look_icon.jpg" style="width:20px; vertical-align:bottom;" alt="" /><span>查看物流</span></div></td><td rowspan='+sku.length+'>'+data.customerNote+'</td><td rowspan='+sku.length+'>'+data.sellerNote+'</td><td rowspan='+sku.length+'>'+data.refundReason+'<p class="font_color_red">（已处理）</p></td><td rowspan='+sku.length+'>'+getMenuStatusFn(data.strings)+'</td><td rowspan='+sku.length+'>'+data.modifyer+'</td><td rowspan='+sku.length+'>'+data.customerName+'</td><td rowspan='+sku.length+'>'+data.customerPhone+'</td><td rowspan='+sku.length+'>'+data.customerAddress+'</td></tr>');
							}else{
								$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td rowspan='+sku.length+'><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td><p>'+sku[x].title+'</p></td><td>'+sku[x].num+'</td><td rowspan='+sku.length+'>'+data.createTime+'</td><td rowspan='+sku.length+'>'+data.payAcount+'</td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td rowspan='+sku.length+'><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td rowspan='+sku.length+'><select name="" id="" style="padding:7px; border:1px solid #ccc;" class="wuliu_shang">'+getWuLiuMessageFn(data.transCompanyName)+'</select><input type="text" value="'+data.transNum+'" class="text_padding" style="width:100px; padding: 8px;vertical-align: bottom;"/><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="modify_wuliu_hao" /><br /><br /><div class="look_wuliu"><img src="images/look_icon.jpg" style="width:20px; vertical-align:bottom;" alt="" /><span>查看物流</span></div></td><td rowspan='+sku.length+'>'+data.customerNote+'</td><td rowspan='+sku.length+'>'+data.sellerNote+'</td><td rowspan='+sku.length+'>'+data.refundReason+'<p class="font_color_red">（已处理）</p></td><td rowspan='+sku.length+'>'+getMenuStatusFn(data.strings)+'</td><td rowspan='+sku.length+'>'+data.modifyer+'</td><td rowspan='+sku.length+'>'+data.customerName+'</td><td rowspan='+sku.length+'>'+data.customerPhone+'</td><td rowspan='+sku.length+'>'+data.customerAddress+'</td></tr>');
							}
						}else{
							//仅待付款状态可修改金额
							if(data.orderStatus[0].num == 1){
								$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td rowspan='+sku.length+'><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td><p>'+sku[x].title+'</p></td><td>'+sku[x].num+'</td><td rowspan='+sku.length+'>'+data.createTime+'</td><td rowspan='+sku.length+'><input type="text" value="'+data.payAcount+'" style=" width:50px; text-align:center;" class="text_padding" /><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_money" /></td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td rowspan='+sku.length+'><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td rowspan='+sku.length+'>物流单号：'+data.transNum+'</td><td rowspan='+sku.length+'>'+data.customerNote+'</td><td rowspan='+sku.length+'>'+data.sellerNote+'</td><td rowspan='+sku.length+'>'+data.refundReason+'<p class="font_color_red">（已处理）</p></td><td rowspan='+sku.length+'>'+getMenuStatusFn(data.strings)+'</td><td rowspan='+sku.length+'>'+data.modifyer+'</td><td rowspan='+sku.length+'>'+data.customerName+'</td><td rowspan='+sku.length+'>'+data.customerPhone+'</td><td rowspan='+sku.length+'>'+data.customerAddress+'</td></tr>');
							}else{
								$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td rowspan='+sku.length+'><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td><p>'+sku[x].title+'</p></td><td>'+sku[x].num+'</td><td rowspan='+sku.length+'>'+data.createTime+'</td><td rowspan='+sku.length+'>'+data.payAcount+'</td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td rowspan='+sku.length+'><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td rowspan='+sku.length+'>物流单号：'+data.transNum+'</td><td rowspan='+sku.length+'>'+data.customerNote+'</td><td rowspan='+sku.length+'>'+data.sellerNote+'</td><td rowspan='+sku.length+'>'+data.refundReason+'<p class="font_color_red">（已处理）</p></td><td rowspan='+sku.length+'>'+getMenuStatusFn(data.strings)+'</td><td rowspan='+sku.length+'>'+data.modifyer+'</td><td rowspan='+sku.length+'>'+data.customerName+'</td><td rowspan='+sku.length+'>'+data.customerPhone+'</td><td rowspan='+sku.length+'>'+data.customerAddress+'</td></tr>');
							}
						}
					}
				}
			}else{
				$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td><p>'+sku[x].title+'</p></td><td>'+sku[x].num+'</td></tr>');
			}
		}
	}else{
		//判断该订单是否申请过售后
		if(data.isRefund == 0){//未做过退款申请
			//判断当前状态是否为已发货状态，代发货状态 canModify  0-可以修改，1-不能修改
			if(data.canModify == 0){
				//仅待付款状态可修改金额
				if(data.orderStatus[0].num == 1){
					$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td></td><td></td><td>'+data.createTime+'</td><td><input type="text" value="'+data.payAcount+'" style=" width:50px; text-align:center;" class="text_padding" /><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_money" /></td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td><select name="" id="" style="padding:7px; border:1px solid #ccc;" class="wuliu_shang">'+getWuLiuMessageFn(data.transCompanyName)+'</select><input type="text" value="'+data.transNum+'" class="text_padding" style="width:100px; padding: 8px;vertical-align: bottom;"/><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="modify_wuliu_hao" /><br /><br /><div class="look_wuliu"><img src="images/look_icon.jpg" style="width:20px; vertical-align:bottom;" alt="" /><span>查看物流</span></div></td><td>'+data.customerNote+'</td><td>'+data.sellerNote+'</td><td>无</td><td>'+getMenuStatusFn(data.strings)+'</td><td>'+data.modifyer+'</td><td>'+data.customerName+'</td><td>'+data.customerPhone+'</td><td>'+data.customerAddress+'</td></tr>');
				}else{
					$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td></td><td></td><td>'+data.createTime+'</td><td>'+data.payAcount+'</td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td><select name="" id="" style="padding:7px; border:1px solid #ccc;" class="wuliu_shang">'+getWuLiuMessageFn(data.transCompanyName)+'</select><input type="text" value="'+data.transNum+'" class="text_padding" style="width:100px; padding: 8px;vertical-align: bottom;"/><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="modify_wuliu_hao" /><br /><br /><div class="look_wuliu"><img src="images/look_icon.jpg" style="width:20px; vertical-align:bottom;" alt="" /><span>查看物流</span></div></td><td>'+data.customerNote+'</td><td>'+data.sellerNote+'</td><td>无</td><td>'+getMenuStatusFn(data.strings)+'</td><td>'+data.modifyer+'</td><td>'+data.customerName+'</td><td>'+data.customerPhone+'</td><td>'+data.customerAddress+'</td></tr>');
				}
			}else{
				//仅待付款状态可修改金额
				if(data.orderStatus[0].num == 1){
					$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td></td><td></td><td>'+data.createTime+'</td><td><input type="text" value="'+data.payAcount+'" style=" width:50px; text-align:center;" class="text_padding" /><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_money" /></td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td>物流单号：'+data.transNum+'</td><td>'+data.customerNote+'</td><td>'+data.sellerNote+'</td><td>无</td><td>'+getMenuStatusFn(data.strings)+'</td><td>'+data.modifyer+'</td><td>'+data.customerName+'</td><td>'+data.customerPhone+'</td><td>'+data.customerAddress+'</td></tr>');
				}else{
					$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td></td><td></td><td>'+data.createTime+'</td><td>'+data.payAcount+'</td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td>物流单号：'+data.transNum+'</td><td>'+data.customerNote+'</td><td>'+data.sellerNote+'</td><td>无</td><td>'+getMenuStatusFn(data.strings)+'</td><td>'+data.modifyer+'</td><td>'+data.customerName+'</td><td>'+data.customerPhone+'</td><td>'+data.customerAddress+'</td></tr>');
				}
			}
		}else{
			//判断该订单退款申请状态
			if(data.refundStatus == 0){//退款申请状态,[0-未处理,1-已处理]
				//判断当前状态是否为已发货状态，代发货状态 canModify  0-可以修改，1-不能修改
				if(data.canModify == 0){
					//仅待付款状态可修改金额
					if(data.orderStatus[0].num == 1){
						$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td></td><td></td><td>'+data.createTime+'</td><td><input type="text" value="'+data.payAcount+'" style=" width:50px; text-align:center;" class="text_padding" /><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_money" /></td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td><select name="" id="" style="padding:7px; border:1px solid #ccc;" class="wuliu_shang">'+getWuLiuMessageFn(data.transCompanyName)+'</select><input type="text" value="'+data.transNum+'" class="text_padding" style="width:100px; padding: 8px;vertical-align: bottom;"/><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="modify_wuliu_hao" /><br /><br /><div class="look_wuliu"><img src="images/look_icon.jpg" style="width:20px; vertical-align:bottom;" alt="" /><span>查看物流</span></div></td><td>'+data.customerNote+'</td><td>'+data.sellerNote+'</td><td>'+data.refundReason+'<p class="font_color_red">（已处理）</p></td><td>'+getMenuStatusFn(data.strings)+'</td><td>'+data.modifyer+'</td><td>'+data.customerName+'</td><td>'+data.customerPhone+'</td><td>'+data.customerAddress+'</td></tr>');
					}else{
						$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td></td><td></td><td>'+data.createTime+'</td><td>'+data.payAcount+'</td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td><select name="" id="" style="padding:7px; border:1px solid #ccc;" class="wuliu_shang">'+getWuLiuMessageFn(data.transCompanyName)+'</select><input type="text" value="'+data.transNum+'" class="text_padding" style="width:100px; padding: 8px;vertical-align: bottom;"/><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="modify_wuliu_hao" /><br /><br /><div class="look_wuliu"><img src="images/look_icon.jpg" style="width:20px; vertical-align:bottom;" alt="" /><span>查看物流</span></div></td><td>'+data.customerNote+'</td><td>'+data.sellerNote+'</td><td>'+data.refundReason+'<p class="font_color_red">（已处理）</p></td><td>'+getMenuStatusFn(data.strings)+'</td><td>'+data.modifyer+'</td><td>'+data.customerName+'</td><td>'+data.customerPhone+'</td><td>'+data.customerAddress+'</td></tr>');
					}
				}else{
					//仅待付款状态可修改金额
					if(data.orderStatus[0].num == 1){
						$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td></td><td></td><td>'+data.createTime+'</td><td><input type="text" value="'+data.payAcount+'" style=" width:50px; text-align:center;" class="text_padding" /><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_money" /></td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td>物流单号：'+data.transNum+'</td><td>'+data.customerNote+'</td><td>'+data.sellerNote+'</td><td>'+data.refundReason+'<p class="font_color_red">（已处理）</p></td><td>'+getMenuStatusFn(data.strings)+'</td><td>'+data.modifyer+'</td><td>'+data.customerName+'</td><td>'+data.customerPhone+'</td><td>'+data.customerAddress+'</td></tr>');
					}else{
						$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td></td><td></td><td>'+data.createTime+'</td><td>'+data.payAcount+'</td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td>物流单号：'+data.transNum+'</td><td>'+data.customerNote+'</td><td>'+data.sellerNote+'</td><td>'+data.refundReason+'<p class="font_color_red">（已处理）</p></td><td>'+getMenuStatusFn(data.strings)+'</td><td>'+data.modifyer+'</td><td>'+data.customerName+'</td><td>'+data.customerPhone+'</td><td>'+data.customerAddress+'</td></tr>');
					}
				}
			}else{
				//判断当前状态是否为已发货状态，代发货状态 canModify  0-可以修改，1-不能修改
				if(data.canModify == 0){
					//仅待付款状态可修改金额
					if(data.orderStatus[0].num == 1){
						$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td></td><td></td><td>'+data.createTime+'</td><td><input type="text" value="'+data.payAcount+'" style=" width:50px; text-align:center;" class="text_padding" /><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_money" /></td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td><select name="" id="" style="padding:7px; border:1px solid #ccc;" class="wuliu_shang">'+getWuLiuMessageFn(data.transCompanyName)+'</select><input type="text" value="'+data.transNum+'" class="text_padding" style="width:100px; padding: 8px;vertical-align: bottom;"/><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="modify_wuliu_hao" /><br /><br /><div class="look_wuliu"><img src="images/look_icon.jpg" style="width:20px; vertical-align:bottom;" alt="" /><span>查看物流</span></div></td><td>'+data.customerNote+'</td><td>'+data.sellerNote+'</td><td>'+data.refundReason+'<p class="font_color_red">（已处理）</p></td><td>'+getMenuStatusFn(data.strings)+'</td><td>'+data.modifyer+'</td><td>'+data.customerName+'</td><td>'+data.customerPhone+'</td><td>'+data.customerAddress+'</td></tr>');
					}else{
						$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td></td><td></td><td>'+data.createTime+'</td><td>'+data.payAcount+'</td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td><select name="" id="" style="padding:7px; border:1px solid #ccc;" class="wuliu_shang">'+getWuLiuMessageFn(data.transCompanyName)+'</select><input type="text" value="'+data.transNum+'" class="text_padding" style="width:100px; padding: 8px;vertical-align: bottom;"/><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="modify_wuliu_hao" /><br /><br /><div class="look_wuliu"><img src="images/look_icon.jpg" style="width:20px; vertical-align:bottom;" alt="" /><span>查看物流</span></div></td><td>'+data.customerNote+'</td><td>'+data.sellerNote+'</td><td>'+data.refundReason+'<p class="font_color_red">（已处理）</p></td><td>'+getMenuStatusFn(data.strings)+'</td><td>'+data.modifyer+'</td><td>'+data.customerName+'</td><td>'+data.customerPhone+'</td><td>'+data.customerAddress+'</td></tr>');
					}
				}else{
					//仅待付款状态可修改金额
					if(data.orderStatus[0].num == 1){
						$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td></td><td></td><td>'+data.createTime+'</td><td><input type="text" value="'+data.payAcount+'" style=" width:50px; text-align:center;" class="text_padding" /><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_money" /></td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td>物流单号'+data.transNum+'</td><td>'+data.customerNote+'</td><td>'+data.sellerNote+'</td><td>'+data.refundReason+'<p class="font_color_red">（已处理）</p></td><td>'+getMenuStatusFn(data.strings)+'</td><td>'+data.modifyer+'</td><td>'+data.customerName+'</td><td>'+data.customerPhone+'</td><td>'+data.customerAddress+'</td></tr>');
					}else{
						$('.shope_order_manage .shope_order_manage_table tbody').append('<tr orderId='+data.orderId+'><td><input type="checkbox" /><span>订单编号:'+data.orderCode+'</span><br /><span>支付来源：'+data.paySource+'</span></td><td></td><td></td><td>'+data.createTime+'</td><td>'+data.payAcount+'</td><td>'+data.pumpkinCoin+'南瓜币/'+data.discountMoney+'元'+'</td><td><select name="" id="" style=" padding:7px; border:1px solid #ccc;">'+getWuLiuOrderStatusMessage(data.orderStatus)+'</select><img src="images/u84.png" style="width:20px; vertical-align: middle;" alt="" class="shope_order_manage_table_modify_status" /></td><td class="hidden" rowspan='+sku.length+'>'+data.reciveTime+'</td><td class="hidden" rowspan='+sku.length+'>'+data.applyRefundTime+'</td><td>物流单号'+data.transNum+'</td><td>'+data.customerNote+'</td><td>'+data.sellerNote+'</td><td>'+data.refundReason+'<p class="font_color_red">（已处理）</p></td><td>'+getMenuStatusFn(data.strings)+'</td><td>'+data.modifyer+'</td><td>'+data.customerName+'</td><td>'+data.customerPhone+'</td><td>'+data.customerAddress+'</td></tr>');
					}
				}
			}
		}
	}
	
}

//获取查询参数
function searchShopeGetOrderParams(page,sorts,chooseStatus){
	var params = new Object();
	if(page == undefined){
		page =1;
	};
	if(sorts == undefined){
		sorts =1;
	};
	$('#shope_order_manage .shope_order_manage_order_status>span').each(function(index, element) {
        if($(this).hasClass('on')){
			chooseStatus = $(this).attr('chooseStatus');
		};
    });
	params.page = page;
	params.sorts = sorts;
	params.orderCode = $.trim($('.shope_order_manage .shope_order_manage_content .order_num').val());
	params.orderStart = $.trim($('#shope_order_manage .shope_order_manage_content .qian').val());
	params.orderEnd = $.trim($('#shope_order_manage .shope_order_manage_content .hou').val());
	params.payWay = $('#shope_order_manage .shope_order_manage_content .pay_way option:selected').attr('value');
	params.chooseStatus = chooseStatus;
	params.customerName = $.trim($('#shope_order_manage .shope_order_manage_content .user_name').val());
	params.customerPhone = $.trim($('#shope_order_manage .shope_order_manage_content .user_tel').val());
	params.chooseApply = $('#shope_order_manage .shope_order_manage_content .apply_tuikuan_status option:selected').attr('value');
    var re=new RegExp("[\\-,\\:, ]","g");  //正则格式化字符，解释：re=new RegExp("l","g")中的第一个参数是你要替换的字符串，第二个参数指替换所有的。
    if($('#shope_order_manage .shope_order_manage_content .qian').length > 0){
        var orderStart = $('#shope_order_manage .shope_order_manage_content .qian').val().replace(re, "");
        params.orderStart = orderStart;
    }
    if($('#shope_order_manage .shope_order_manage_content .hou').length > 0){
        var orderEnd = $('#shope_order_manage .shope_order_manage_content .hou').val().replace(re, "");
        params.orderEnd = orderEnd;
    }
	return params;
}
        
//加载订单列表V3.1.0分页数据
function loadShopeGetOrderPage(page,sorts,chooseStatus){
	$('#shope_order_manage .shope_order_manage_content_li #select_all_01').removeAttr('checked');
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/order/getOrder/3.1.0',
		type : 'get',
		dataType : 'json',
		data: searchShopeGetOrderParams(page,sorts,chooseStatus),
		success : initShopeGetOrderPage,
	});
}

//获取物流商
function getWuLiuMessageFn(status){
	var data = $('body').data('wuliu');
	var str = '';
	for(var x = 0;x < data.length; x ++){
		if(status == data[x].name){
			str += '<option code='+data[x].code+' selected="selected">'+data[x].name+'</option>';
		}else{
			str += '<option code='+data[x].code+'>'+data[x].name+'</option>';
		}
	}	
	return str;
}

//获取每条订单状态
function getWuLiuOrderStatusMessage(status){
	var str = '';
	for(var x = 0;x < status.length ; x ++){
		str +='<option value="'+status[x].num+'">'+status[x].name+'</option>';	
	}
	return str;	
}

//按钮根据状态显示
function getMenuStatusFn(menu){
	var str = '';
	for(var x = 0; x < menu.length; x ++){
		if(menu[x] == '退款管理'){
			str += '<div class="reimburse" style="text-align:left;"><img src="images/tuikuan_icon.png" style="width:20px; vertical-align:bottom;" alt="" /> <span>退款管理</span></div>';
		}else if(menu[x] == '发货'){
			str += '<div class="ship" style="text-align:left;"><img src="images/huoche_icon.png" style="width:20px; vertical-align:bottom;" alt="" /> <span>发货</span></div>';
		}else if(menu[x] == '查看详情'){
			str += '<div class="look_details" style="text-align:left;"><img src="images/look_icon.jpg" style="width:20px; vertical-align:bottom;" alt="" /> <span>查看详情</span></div>';
		}else if(menu[x] == '商家备注'){
			str += '<div class="seller_note" style="text-align:left;"><img src="images/modify_icon.png" style="width:17px; vertical-align:bottom;" alt="" /> <span>商家备注</span></div>';
		}else if(menu[x] == '关闭订单'){
			str += '<div class="close_order" style="text-align:left;"><img src="images/close_icon.png" style="width:16px; vertical-align:sub;" alt="" /> <span>关闭订单</span></div>';
		}else{
			//str += '<div class="complaints_advisory" style="text-align:left; display:none;"><img src="images/tousu_icon.png" style="width:20px; vertical-align:bottom;" alt="" /> <span>投诉咨询</span></div>';	
		}
	}
	return str;
}

//获取发货列表
function getSendListFn(data,sku){
	if(sku.length > 0){
		for(var x = 0; x < sku.length ; x ++){
			if(x == 0){
				$('.shope_order_manage_fahuo .shope_order_manage_fahuo_table tbody').append('<tr orderId='+data.orderId+'><td rowspan='+sku.length+'><input type="checkbox" /><span>'+data.orderCode+'</span></td><td>'+sku[x].title+'</td><td>'+sku[x].num+'</td><td rowspan='+sku.length+'>'+data.customerName+'</td><td rowspan='+sku.length+'>'+data.customerPhone+'</td><td rowspan='+sku.length+'>'+data.customerAddress+'</td><td rowspan='+sku.length+'>'+data.orderAmount+'</td><td rowspan='+sku.length+'>'+data.transAmount+'</td><td rowspan='+sku.length+'>'+data.payAmount+'</td><td rowspan='+sku.length+'><select name="" id="" style="padding:7px; border:1px solid #ccc;">'+getWuLiuMessageFn()+'</select></td><td rowspan='+sku.length+'><input type="text" value="" class="text_padding" /></td><td rowspan='+sku.length+'><input type="button" value="发货" class="shope_order_manage_fahuo_table_fahuo green" /></td></tr>');
			}else{
				$('.shope_order_manage_fahuo .shope_order_manage_fahuo_table tbody').append('<tr><td>'+sku[x].title+'</td><td>'+sku[x].num+'</td></tr>');
			}
		}
	}else{
		$('.shope_order_manage_fahuo .shope_order_manage_fahuo_table tbody').append('<tr orderId='+data.orderId+'><td><input type="checkbox" /><span>'+data.orderCode+'</span></td><td></td><td></td><td>'+data.customerName+'</td><td>'+data.customerPhone+'</td><td>'+data.customerAddress+'</td><td>'+data.orderAmount+'</td><td>'+data.transAmount+'</td><td>'+data.payAmount+'</td><td><select name="" id="" style="padding:7px; border:1px solid #ccc;">'+getWuLiuMessageFn()+'</select></td><td><input type="text" value="" class="text_padding" /></td><td><input type="button" value="发货" class="shope_order_manage_fahuo_table_fahuo green" /></td></tr>');
	}
}