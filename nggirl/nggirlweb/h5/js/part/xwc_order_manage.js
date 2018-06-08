$(function(){
	// 点击“美妆下午茶订单管理”--》搜索按钮
	$('.xwc-manage .search-btn').click(loadXwcOrderPage);

	//点击“美妆下午茶订单管理”--》全部取消按钮 
	$('.xwc-manage .all-cancle').click(function(e) {
		$('.xwc-manage .bianhao').val('');
		$('.xwc-manage .nicheng').val('');
		$('.xwc-manage .name').val('');
		$('.xwc-manage .tel').val('');
		$('.xwc-manage .qian').val('');
		$('.xwc-manage .hou').val('');
		$('.xwc-manage .order-status option:selected').attr('value','');
    });
	
	//点击退款弹框中的“取消”按钮
	$('.xwc-order-refund .xwc-or-btn-cancle').click(function(e) {
        $('.xwc-order-refund').hide();
		$('.xwc-order-refund-gray').hide();
		$('.xwc-order-refund .xwc-order-refund-money').val('');
    });
});

//加载美妆下午茶订单管理分页数据
function loadXwcOrderPage(){
	$('.xwc-table>tbody>tr:gt(0)').remove();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/salon/reservation/listReservations',
		type : 'get',
		dataType : 'json',
		data: getXwcOrderSearchParams(1),
		success : initXwcOrderPage,
	});
}

//获取查询参数
function getXwcOrderSearchParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	params.unionReservationId = $('.xwc-manage .bianhao').val();
	params.userNickName = $('.xwc-manage .nicheng').val();
	params.dresserName = $('.xwc-manage .name').val();
	params.userPhoneNum = $('.xwc-manage .tel').val();
	params.startCreateTime = $('.xwc-manage .qian').val();
	params.endCreateTime = $('.xwc-manage .hou').val();
	params.reservationStatus = $('.xwc-manage .order-status option:selected').attr('value');
	params.userId = $('.xwc-manage .userid').val();

    var re=new RegExp("[\\-,\\:, ]","g");  //正则格式化字符，解释：re=new RegExp("l","g")中的第一个参数是你要替换的字符串，第二个参数指替换所有的。
    if($('.xwc-manage .qian').length > 0){
        var startCreateTimeStr = $('.xwc-manage .qian').val().replace(re, "");
        params.startCreateTime = startCreateTimeStr;
    }
    if($('.xwc-manage .hou').length > 0){
        var endCreateTime = $('.xwc-manage .hou').val().replace(re, "");
        params.endCreateTime = endCreateTime;
    }
    return params;
}

//初始化美妆下午茶订单管理分页
function initXwcOrderPage(data){
	createXwcOrderPage(data);
	for (var x = 0; x < data.data.pageData.length; x++) {
        if(data.data.pageData[x].paidMoney == null){
			//判断退款金额
			if(data.data.pageData[x].refundMoney == null){
				$('.xwc-table').append('<tr><td unionReservationId='+data.data.pageData[x].unionReservationId+'>'+
				data.data.pageData[x].unionReservationId+'</td><td>'+data.data.pageData[x].createTime+'</td><td>'+
				data.data.pageData[x].userNickName+'</td><td>'+data.data.pageData[x].userPhoneNum+'</td><td>'+
				data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].reservationAddresss+'</td><td>'+
				data.data.pageData[x].reservationTime+'</td><td>'+data.data.pageData[x].totalCost+'</td><td>'+
				data.data.pageData[x].reservationStatus+'</td><td>'+
				0+'</td><td><a href="javascript:;"  class="tuikuan">退款</a></td><td>0</td></tr>');
			}else{
				$('.xwc-table').append('<tr><td unionReservationId='+data.data.pageData[x].unionReservationId+'>'+
				data.data.pageData[x].unionReservationId+'</td><td>'+data.data.pageData[x].createTime+'</td><td>'+
				data.data.pageData[x].userNickName+'</td><td>'+data.data.pageData[x].userPhoneNum+'</td><td>'+
				data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].reservationAddresss+'</td><td>'+
				data.data.pageData[x].reservationTime+'</td><td>'+data.data.pageData[x].totalCost+'</td><td>'+
				data.data.pageData[x].reservationStatus+'</td><td>'+
				0+'</td><td><a href="javascript:;"  class="tuikuan">退款</a></td><td>'+data.data.pageData[x].refundMoney+'</td></tr>');
			}
        }else{
			//判断退款金额
			if(data.data.pageData[x].refundMoney == null){
				$('.xwc-table').append('<tr><td unionReservationId='+data.data.pageData[x].unionReservationId+'>'+
				data.data.pageData[x].unionReservationId+'</td><td>'+data.data.pageData[x].createTime+'</td><td>'+
				data.data.pageData[x].userNickName+'</td><td>'+data.data.pageData[x].userPhoneNum+'</td><td>'+
				data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].reservationAddresss+'</td><td>'+
				data.data.pageData[x].reservationTime+'</td><td>'+data.data.pageData[x].totalCost+'</td><td>'+
				data.data.pageData[x].reservationStatus+'</td><td>'+
				data.data.pageData[x].paidMoney+'</td><td><a href="javascript:;"  class="tuikuan">退款</a></td><td>0</td></tr>');
			}else{
				$('.xwc-table').append('<tr><td unionReservationId='+data.data.pageData[x].unionReservationId+'>'+
				data.data.pageData[x].unionReservationId+'</td><td>'+data.data.pageData[x].createTime+'</td><td>'+
				data.data.pageData[x].userNickName+'</td><td>'+data.data.pageData[x].userPhoneNum+'</td><td>'+
				data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].reservationAddresss+'</td><td>'+
				data.data.pageData[x].reservationTime+'</td><td>'+data.data.pageData[x].totalCost+'</td><td>'+
				data.data.pageData[x].reservationStatus+'</td><td>'+
				data.data.pageData[x].paidMoney+'</td><td><a href="javascript:;"  class="tuikuan">退款</a></td><td>'+data.data.pageData[x].refundMoney+'</td></tr>');
			}
        }
	}
	initXwcOrderStatus(data);
	initXwcOrderAction(data);
}

//创建用户列表分页
function createXwcOrderPage(data){
	$(".xwc-list .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getXwcOrderSearchParams();
			params.page = p;
			$('.xwc-table>tbody>tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/salon/reservation/listReservations',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initXwcOrderPage
			});			
		}
	});
}

//初始化预约状态
function initXwcOrderStatus(data) {
    for (var x = 0; x < data.data.pageData.length; x++) {
        if(data.data.pageData[x].reservationStatus == 0){
            $('.xwc-table tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('');
        }
        if(data.data.pageData[x].reservationStatus == 1){
            $('.xwc-table tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('谢小主的赏金，请等待活动成团');
        }
        if(data.data.pageData[x].reservationStatus == 2){
            $('.xwc-table tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('活动已成团，请小主准时参加活动');
        }
        if(data.data.pageData[x].reservationStatus == 3){
            $('.xwc-table tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('活动中，小主要记得拍照留念');
        }
        if(data.data.pageData[x].reservationStatus == 4){
            $('.xwc-table tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('活动结束，请小主确认完成');
        }
        if(data.data.pageData[x].reservationStatus == 5){
            $('.xwc-table tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('请美丽的小主为本次活动点评');
        }
        if(data.data.pageData[x].reservationStatus == 6){
            $('.xwc-table tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('谢小主评价，期待与小主再次相遇');
        }
        if(data.data.pageData[x].reservationStatus == 7){
            $('.xwc-table tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('本次活动未成团，正在为小主退款');
        }
        if(data.data.pageData[x].reservationStatus == 8){
            $('.xwc-table tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('退款成功，南瓜姑娘会不断努力');
        }
    }
}

//初始化退款动作
function initXwcOrderAction(data){
    for(var x = 0; x < data.data.pageData.length ; x ++){
        //微信退款或者优惠券退款
        if(data.data.pageData[x].payType == 1 || data.data.pageData[x].payType == 1){
            $('.xwc-table tbody>tr:eq('+(x+1)+')').children('td:eq(10)').children('.tuikuan').click(function(e) {
				var tuikuan = $(this);
				//显示退款弹框
				$('.xwc-order-refund').show();
				$('.xwc-order-refund-gray').show();
				
				$('.xwc-order-refund .xwc-or-btn-ok').unbind('click');
				$('.xwc-order-refund .xwc-or-btn-ok').click(function(e) {
					//微信退款
					$.ajax({
						url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/charge/weixinpay/salon/refund',
						type : 'post',
						dataType : 'json',
						data: {unionReservationId:tuikuan.parent().parent().children('td:eq(0)').attr('unionReservationId'),refundMoney:$('.xwc-order-refund .xwc-order-refund-money').val()},
						success : function(data){
							if(data.code == 0){
								alert('退款成功！');
								//隐藏退款弹框
								$('.xwc-order-refund').hide();
								$('.xwc-order-refund-gray').hide();
								tuikuan.hide();
							}
							if(data.code == 1){
								alert(data.data.error);	
							}
						},
					});
                });
            });
        }

        //如果是支付宝退款
        else if(data.data.pageData[x].payType == 2){
            $('.xwc-table tbody>tr:eq('+(x+1)+')').children('td:eq(10)').children('.tuikuan').attr('url',data.data.pageData[x].refundLink);
            $('.xwc-table tbody>tr:eq('+(x+1)+')').children('td:eq(10)').children('.tuikuan').click(function(e) {
                var tuikuan = $(this);
				//显示退款弹框
				$('.xwc-order-refund').show();
				$('.xwc-order-refund-gray').show();
				$('.xwc-order-refund .xwc-or-btn-ok').unbind('click');
				$('.xwc-order-refund .xwc-or-btn-ok').click(function(e) {
					$.ajax({
						url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/charge/alipay/salon/refund/nopwd',
						type : 'post',
						dataType : 'json',
						data: {unionReservationId:tuikuan.parent().parent().children('td:eq(0)').attr('unionReservationId'),refundMoney:$('.xwc-order-refund .xwc-order-refund-money').val()},
						success : function(data){
							if(data.code == 0){
								alert('退款成功！');
								//隐藏退款弹框
								$('.xwc-order-refund').hide();
								$('.xwc-order-refund-gray').hide();
								tuikuan.hide();
							}
							if(data.code == 1){
								alert(data.data.error);	
							}
						},
					});
                });
            });
        }

        //判断是否可以“退款”
        if(data.data.pageData[x].canRefund == true){
            $('.xwc-table tbody>tr:eq('+(x+1)+')').children('td:eq(10)').children('.tuikuan').show();
            if(data.data.pageData[x].payType == 1){
                $('.xwc-table tbody>tr:eq('+(x+1)+')').children('td:eq(10)').append('<label>微信</label>');
            }
            if(data.data.pageData[x].payType == 2){
                $('.xwc-table tbody>tr:eq('+(x+1)+')').children('td:eq(10)').append('<label>支付宝</label>');
            }
            if(data.data.pageData[x].payType == 3){
                $('.xwc-table tbody>tr:eq('+(x+1)+')').children('td:eq(10)').append('<label>优惠券</label>');
            }
        }else{
            $('.xwc-table tbody>tr:eq('+(x+1)+')').children('td:eq(10)').children('.tuikuan').hide();
        }
    }
}



