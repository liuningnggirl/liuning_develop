/**
 * Created by zhanghaiwei on 15/11/3.
 */


//清理订单管理的搜索框
function clearListReservationSearchText(){
    $('.ddxqq .bianhao').val('');
    $('.ddxqq .nicheng').val('');
    $('.ddxqq .name').val('');
    $('.ddxqq .qian').val('');
    $('.ddxqq .hou').val('');
	$('.ddxqq .order-status option:selected').attr('value','');
}

//加载订单管理数据
function  loadListReservationsPage(page){
    var params = getListReservationsParams();
    if($.type(page) != 'number'){
        page = 1;
    }
    params.page = page;
    //加载订单管理页面
    $.ajax({
        url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/reservation/listReservations',
        type : 'get',
        dataType : 'json',
        data: params,
        success : initListReservationsPage
    });
}

//获取订单管理查询参数
function  getListReservationsParams(){
    var params = new Object();
    params.page = 1;
	params.reservationId = $('.ddxqq .bianhao').val();
	params.userNickName = $('.ddxqq .nicheng').val();
	params.dresserName = $('.ddxqq .name').val();
	params.startCreateTime = $('.ddxqq .qian').val();
	params.endCreateTime = $('.ddxqq .hou').val();
	params.reservationStatus = $('.ddxqq .order-status option:selected').attr('value');


    var re=new RegExp("[\\-,\\:, ]","g");  //正则格式化字符，解释：re=new RegExp("l","g")中的第一个参数是你要替换的字符串，第二个参数指替换所有的。
    if($('.ddxqq .qian').length > 0){
        var startCreateTimeStr = $('.ddxqq .qian').val().replace(re, "");
        params.startCreateTime = startCreateTimeStr;
    }
    if($('.ddxqq .hou').length > 0){
        var endCreateTime = $('.ddxqq .hou').val().replace(re, "");
        params.endCreateTime = endCreateTime;
    }
    return params;
}


//初始化订单管理页面
function initListReservationsPage(data){
    //清理原有列表中的数据
    $('.ddxq tr:gt(0)').remove();

    //点击查询按钮,加载数据,刷新页面
    $('.ddxqq .search-btn').unbind("click");
    $('.ddxqq .search-btn').click(loadListReservationsPage);

//点击清空按钮,清空‘订单管理’文本框内容
    $('.ddxqq .all-cancle').unbind("click");
    $('.ddxqq .all-cancle').click(clearListReservationSearchText);

    //创建分页
    $(".ddxqq .tcdPageCode").createPage({
        pageCount:parseInt(data.data.totalPageNum),
        current:parseInt(data.data.currnetPageNum),
        backFn:loadListReservationsPage
    });
    //初始化表格
    initReservationTable(data);
    //初始化订单状态
    initReservationStatus(data);
    //初始化退款功能
    initRefundAction(data);
}

//初始化预约表中的数据
function initReservationTable(data){
    for (var x = 0; x < data.data.pageData.length; x++) {
        $('.ddxq').append('<tr><td reservationId='+data.data.pageData[x].reservationId+'>'+
            data.data.pageData[x].reservationId+'</td><td>'+data.data.pageData[x].createTime+'</td><td>'+
            data.data.pageData[x].userNickName+'</td><td>'+data.data.pageData[x].userPhoneNum+'</td><td>'+
            data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].reservationAddresss+'</td><td>'+
            data.data.pageData[x].reservationTime+'</td><td>'+data.data.pageData[x].fee+'</td><td>'+
            data.data.pageData[x].reservationStatus+'</td><td>'+
			data.data.pageData[x].paidMoney+'</td><td><a href="javascript:;"  class="tuikuan">退款</a></td><td><input value="复制订单" type="button" class="copy-order" /></td></tr>');
    }
}


//初始化预约状态
function initReservationStatus(data) {
    for (var x = 0; x < data.data.pageData.length; x++) {
        if(data.data.pageData[x].reservationStatus == 0){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('等待化妆师确认');
        }
        if(data.data.pageData[x].reservationStatus == 1){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('订单已取消');
        }
        if(data.data.pageData[x].reservationStatus == 2){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('订单已取消');
        }
        if(data.data.pageData[x].reservationStatus == 3){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('化妆师未接受预约');
        }
        if(data.data.pageData[x].reservationStatus == 4){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('化妆师已确认，等待支付');
        }
        if(data.data.pageData[x].reservationStatus == 5){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('订单已取消');
        }
        if(data.data.pageData[x].reservationStatus == 6){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('支付成功，等待化妆师上门');
        }
        if(data.data.pageData[x].reservationStatus == 7){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('化妆进行中');
        }
        if(data.data.pageData[x].reservationStatus == 8){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('化妆结束，请确认完成');
        }
        if(data.data.pageData[x].reservationStatus == 9){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('美丽行程，圆满结束');
        }
        if(data.data.pageData[x].reservationStatus == 10){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('自动结束。美丽行程，圆满结束');
        }
        if(data.data.pageData[x].reservationStatus == 11){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('退款订单');
        }
    }
}


//初始化退款动作
function initRefundAction(data){
    for(var x = 0; x < data.data.pageData.length ; x ++){
        //微信退款或者优惠券退款
        if(data.data.pageData[x].payType == 1 || data.data.pageData[x].payType == 1){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(10)').children('.tuikuan').click(function(e) {
                var r=confirm('确认退款？？');
                var tuikuan = $(this);
                if (r==true){
                    //微信退款
                    $.ajax({
                        url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/charge/weixinpay/refund',
                        type : 'post',
                        dataType : 'json',
                        data: {reservationId:$('.ddxq tbody>tr:eq('+$(this).parent().parent().index()+')').children('td:eq(0)').attr('reservationId')},
                        success : function(data){
                            if(data.code == 0){
                                alert('退款成功！');
                                tuikuan.hide();
                            }else{
                                alert(data.data.error);
                            }
                        },
                    });
                }
            });
        }

        //如果是支付宝退款
        else if(data.data.pageData[x].payType == 2){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(10)').children('.tuikuan').attr('url',data.data.pageData[x].refundLink);
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(10)').children('.tuikuan').click(function(e) {
                var r=confirm('确认退款？？');
                var tuikuan = $(this);
                if (r==true){
                    window.open($(this).attr('url'),'_blannk');
                }
            });
        }

        //判断是否可以“退款”
        if(data.data.pageData[x].canRefund == true){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(10)').children('.tuikuan').show();
            if(data.data.pageData[x].payType == 1){
                $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(10)').append('<label>微信</label>');
            }
            if(data.data.pageData[x].payType == 2){
                $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(10)').append('<label>支付宝</label>');
            }
            if(data.data.pageData[x].payType == 3){
                $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(10)').append('<label>优惠券</label>');
            }
        }else{
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(10)').children('.tuikuan').hide();
        }


    }
}

//--------------------------------------------------------用户查询--------------------------------------------
//初始化用户查询页面
function initUserQueryPage(data){
	for( var x = 0 ; x <data.data.pageData.length; x ++){
		$('.user-select table').append('<tr><td>'+data.data.pageData[x].userId+'</td><td>'+data.data.pageData[x].userName+'</td><td>'+data.data.pageData[x].userPhoneNum+'</td><td>'+data.data.pageData[x].registerTime+'</td><td>'+data.data.pageData[x].address+'</td><td><input type="button" value="选中" class="slected-btn" /></td></tr>');
	}
}

//获取用户查询参数
function getUserQueryParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	params.userName = $('.us-search .us-name').val();
	params.userPhoneNum = $('.us-search .us-tel').val();
	return params;
}

//用户查询加载页面
function  loadUserQueryPage(){
	var params = getUserQueryParams();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/reservation/listUsers',
		type : 'get',
		dataType : 'json',
		data: params,
		success : function(data){
			$('.user-select table tbody tr:gt(0)').remove(); //清除原来的表格信息
			createUserQueryPage(data);
			initUserQueryPage(data);
		},
	});
}

//创建用户查询分页
function  createUserQueryPage(data){
	$(".user-select .tcdPageCode").createPage({
		pageCount:data.data.totalPageNum,
		current:data.data.currnetPageNum,
		backFn:function(p){
			var params = getUserQueryParams();
			params.page = p;
			$('.user-select table tbody tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/reservation/listUsers',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initUserQueryPage
			});			
		}
	});
}

//------------------------------------------------作品查询------------------------------
//初始化作品查询页面
function initWorksQueryPage(data){
	for( var x = 0 ; x <data.data.pageData.length; x ++){
		$('.works-select table').append('<tr><td>'+
		data.data.pageData[x].dresserId+'</td><td>'+
		data.data.pageData[x].dresserName+'</td><td>'+
		data.data.pageData[x].dresserPhoneNum+'</td><td>'+
		data.data.pageData[x].workId+'</td><td>'+
		data.data.pageData[x].workType+'</td><td>'+
		data.data.pageData[x].price+'</td><td>'+
		data.data.pageData[x].description+'</td><td><input type="button" value="选中" class="works-slected-btn" /></td></tr>');}
}

//获取作品查询参数
function getWorksQueryParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	params.dresserName = $('.ws-search .ws-name').val();
	params.workType = $('.ws-search .ws-kinds option:selected').val();
	return params;
}

//创建作品查询分页
function  createWorksQueryPage(data){
	$(".works-select .tcdPageCode").createPage({
		pageCount:data.data.totalPageNum,
		current:data.data.currnetPageNum,
		backFn:function(p){
			var params = getWorksQueryParams();
			params.page = p;
			$('.works-select table tbody tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/reservation/listWorks',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initWorksQueryPage
			});			
		}
	});
}


//作品查询加载页面
function  loadWorksQueryPage(){
	var params = getWorksQueryParams();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/reservation/listWorks',
		type : 'get',
		dataType : 'json',
		data: params,
		success : function(data){
			$('.works-select table tbody tr:gt(0)').remove(); //清除原来的表格信息
			createWorksQueryPage(data);
			initWorksQueryPage(data);
		},
	});
}

//初始化资讯管理页面
function initZiXunPage(data){
	$('.zxgl tbody tr:gt(0)').remove(); //清除原来的表格信息
	createZiXunPage(data);
	for(var x = 0; x < data.data.pageData.length; x ++){
		$('.zxgl tbody').append('<tr><td>'+data.data.pageData[x].id+'</td><td>'+data.data.pageData[x].title+'</td><td>'+data.data.pageData[x].description+'</td><td>'+data.data.pageData[x].contentUrl+'</td><td>'+getLocalTime(data.data.pageData[x].createTime)+'</td><td><input type="button" value="删除" class="zxgl-del-btn" /></td><td><input type="button" value="发布" class="zxgl-status-btn0" /><input type="button" value="取消发布" class="zxgl-status-btn1" /></td></tr>');
		if(data.data.pageData[x].published == 0){
			$('.zxgl tbody>tr:eq('+(x+1)+') td:eq(6)>.zxgl-status-btn0').show();
			$('.zxgl tbody>tr:eq('+(x+1)+') td:eq(6)>.zxgl-status-btn1').hide();
		}
		if(data.data.pageData[x].published == 1){
			$('.zxgl tbody>tr:eq('+(x+1)+') td:eq(6)>.zxgl-status-btn0').hide();
			$('.zxgl tbody>tr:eq('+(x+1)+') td:eq(6)>.zxgl-status-btn1').show();
		}
	}
}


//资讯加载页面
function  loadZiXunPage(){
	var params = getZiXunParams();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/focuscontent/list',
		type : 'get',
		dataType : 'json',
		data: params,
		success : function(data){
			$('.zxgl tbody tr:gt(0)').remove(); //清除原来的表格信息
			createZiXunPage(data);
			initZiXunPage(data);
		},
	});
}

//获取资讯管理参数
function getZiXunParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	params.startTime = $('.zxgll .qian').val()
	params.endTime = $('.zxgll .hou').val();
	return params;
}

//创建资讯分页
function  createZiXunPage(data){
	$(".zxgll .tcdPageCode").createPage({
		pageCount:data.data.totalPageNum,
		current:data.data.currnetPageNum,
		backFn:function(p){
			var params = getZiXunParams();
			params.page = p;
			$('.zxgl tbody tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/focuscontent/list',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initZiXunPage
			});			
		}
	});
}

//时间格式化
function getLocalTime(publishTime) {
	 var d_minutes,d_hours,d_days;       
		var timeNow = parseInt(new Date().getTime()/1000);       
		var d;       
		d = timeNow - publishTime;       
		d_days = parseInt(d/86400);       
		d_hours = parseInt(d/3600);       
		d_minutes = parseInt(d/60);       
		if(d_days>0 && d_days<4){       
			return d_days+"天前";       
		}else if(d_days<=0 && d_hours>0){       
			return d_hours+"小时前";       
		}else if(d_hours<=0 && d_minutes>0){       
			return d_minutes+"分钟前";       
		}else{       
			var s = 0;
			s = new Date(publishTime);       
			return (s.getFullYear()+"年"+parseInt(s.getMonth()+1))+"月"+parseInt(s.getDate())+"日";       
		}  
}
