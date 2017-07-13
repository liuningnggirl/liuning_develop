var testUrl = 'https://testcli.nggirl.com.cn';
$(function(){	
	loadListReservationsPage();
	$(window).scroll(function(e) {
        $('.order-refund').animate({'top':$(window).scrollTop()+100},1);
    });

	//获取城市列表
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/common/getCitys',  
		type : 'get',
		dataType : 'json',  
		success : function(data){
			if(data.code == 0){
				for(var x = 0; x < data.data.length; x ++){
					$('.order-create .mine-city').append('<option cityId='+data.data[x].cityId+'>'+data.data[x].cityName+'</option>');
				}
			}else{
				alert(data.data.error);	
			}
		}
	});
	
	//改变城市获取对应的地区列表
	$('.order-create #province').change(function(){
		//获取地区列表
		$.ajax({
			url : testUrl+'/nggirl-web/web/admin/common/getCountys',
			type : 'get',
			data : ({cityId:$('.order-create .mine-city option:selected').attr('cityId')}),
			dataType : 'json',  
			success : function(data){
				if(data.code == 0){
					$('.city option:gt(0)').remove();
					$('.city option:eq(0)').html('请选择所在地区');
					for(var x = 0; x < data.data.length; x ++){
						$('.order-create .mine-area').append('<option areaId="'+data.data[x].areaId+'">'+data.data[x].areaName+'</option>');
					}
				}else{
					alert(data.data.error);	
				}
			}
		});
	});

	//点击“订单管理”--》“创建订单”按钮--》打开“创建订单”页面
	$('.order-num .create-order').click(function(e) {
		//清空“创建订单”页面数据
		$('.order-create .order-user').val('');
		$('.order-create .order-pro').val('');
		$('.order-create .order-year option:gt(0)').remove();
		$('.order-create .order-area').val('');
		$('.order-create .order-user-tel').val('');
		$('.order-create .order-price').val('');
		$('.order-create .order-qian').val('');
		$('.order-create .mine-city option:eq(0)').attr('selected','selected');
		$('.order-create .mine-area option:eq(0)').attr('selected','selected');
		
		//隐藏订单详情页面
        $('.ddxq-list').hide();
		//显示创建订单页面
		$('.order-create').show();
		//判断是在用户管理下创建订单还是其他
		if(typeof($('.user_order_information').attr('userid')) == "undefined"){
			$('.order-create .order-user').removeAttr('disabled');
		}else{
			$('.order-create .order-user').attr('disabled','disabled');	
			$('.order-create .order-user').val($('.user_order_information').attr('nickName'));
		}
    });

//点击“创建订单”按钮,发送请求，生成订单
	$('.order-create .create-order').click(function(e) {
		$('.ddxqq .userid').val('');
		if($('.order-create .order-user').val() == ''){
			alert('请选择下单用户');	
		}else if($('.order-create .order-pro').val() == ''){
			alert('请选择作品');	
		}else if($('.order-create .order-qian').val() == ''){
			alert('请选择预约日期');	
		}else if($('.order-create .order-year option:selected').text() == '请选择预约时间'){
			alert('请选择预约时间');	
		}else if($('.order-create .mine-city option:selected').text() == '请选择省份'){
			alert('请选择省份!!');	
		}else if($('.order-create .mine-area option:selected').text() == '请选择所在地区'){
			alert('请选择所在地区!!');	
		}else if($('.order-create .order-area').val() == ''){
			alert('请输入预约地点');	
		}else if($('.order-create .order-user-tel').val() == ''){
			alert('请输入用户手机号');	
		}else if($('.order-create .order-price').val() == ''){
			alert('请输入预约价格');	
		}else{
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/reservation/createReservation/1.3.3',
				type : 'post',
				dataType : 'json',
				data: {userId:$('.order-create .order-user').attr('userId'),workId:$('.order-create .order-pro').attr('workId'),resDate:$('.order-year option:selected').attr('resDate'),resTime:$('.order-year option:selected').attr('resTimes'),resAddress:$('.order-create .order-area').val(),userPhoneNum:$('.order-create .order-user-tel').val(),price:$('.order-create .order-price').val(),resDate:$('.order-create .order-qian').val(),resTime:$('.order-create .order-year option:selected').html(),cityId:$('.order-create .mine-city option:selected').attr('cityId'),areaId:$('.order-create .mine-area option:selected').attr('areaId')},
				success : function(data){
					if(data.code == 0){
						$('.order-create').hide();
						$('.order-txt .dd-num').html(data.data.reservationId);
						$('.order-txt .dd-name').html(data.data.userName);
						$('.order-txt .dd-user-tel').html(data.data.userPhoneNum);
						$('.order-txt .dd-hzs').html(data.data.dresserName);
						$('.order-txt .dd-hzs-tel').html(data.data.dresserPhoneNum);
						$('.order-txt .dd-dresstype').html(data.data.workType);
						$('.order-txt .dd-price').html(data.data.price);
						$('.order-txt .dd-time').html(data.data.resDate+'&nbsp;'+data.data.resTime);
						$('.order-success').show();
						loadListReservationsPage();
					}else{
						alert(data.data.error);	
					}
				},
			});		
		}
    });
	
//点击“订单管理”--》创建订单--》“返回”按钮
	$('.return-order').click(function(e) {
		returnSuccessFn();
		//显示订单管理列表
		$('.order-create').hide();
		$('.ddxq-list').show();
    });

//创建订单成功之后--》点击“继续创建”--》页面转到“创建订单”
	$('.osbtn-create').click(function(e) {
        returnSuccessFn();
		//显示创建订单页面
		$('.order-create').show();
    });

//订单创建成功之后返回页面可复用部分
	function returnSuccessFn(){
        $('.order-success').hide();
		//清空订单成功页面信息
		$('.order-txt .dd-num').html('');
		$('.order-txt .dd-name').html('');
		$('.order-txt .dd-user-tel').html('');
		$('.order-txt .dd-hzs').html('');
		$('.order-txt .dd-hzs-tel').html('');
		$('.order-txt .dd-dresstype').html('');
		$('.order-txt .dd-price').html('');
		$('.order-txt .dd-time').html('');
	}	
	
//创建订单成功之后--》点击“返回列表”--》返回到“订单管理”列表
	$('.osbtn-return').click(function(e) {
        returnSuccessFn();
		//显示订单管理列表
		$('.ddxq-list').show();
    });

//复制订单
	$('.copy-order').live('click',function(e){
		$('.order-create .order-year option:gt(0)').remove();
		$('.ddxq-list').hide();
		$('.order-qian').removeAttr('disabled');
		//判断是在用户管理下复制订单还是其他
		if(typeof($('.user_order_information').attr('userid')) == "undefined"){
			$('.order-create .order-user').removeAttr('disabled');
		}else{
			$('.order-create .order-user').attr('disabled','disabled');	
			$('.order-create .order-user').val($('.user_order_information').attr('nickName'));
		}
		$.ajax({
			url : testUrl+'/nggirl-web/web/admin/reservation/reservationDetail/1.3.3',
			type : 'get',
			dataType : 'json',
			data: {reservationId:$(this).parent().parent().children('td:eq(0)').html()},
			success : function(data){
				$('.order-create .order-user').val(data.data.userName+''+data.data.userPhoneNum);
				$('.order-create .order-pro').val(data.data.dresserName+','+data.data.workType+','+data.data.price+'元');
				$('.order-create .order-year').append('<option resDate="'+data.data.resDate+'" resTimes="'+data.data.resTime+'">'+data.data.resDate +'&nbsp;'+ data.data.resTime+'</option>');
				$('.order-create .order-area').val(data.data.resAddress);
				$('.order-create .order-user-tel').val(data.data.userPhoneNum);
				$('.order-create .order-price').val(data.data.price);
				$('.order-create .order-user').attr('userId',data.data.userId);
				$('.order-create .order-pro').attr('workId',data.data.workId);
				$('.order-create .order-qian').val(data.data.resDate);
				$('.order-create .order-pro').attr('dresserId',data.data.dresserId);
				var resTime =data.data.resTime;
				//回显预约时间
				$.ajax({
					url : testUrl+'/nggirl-web/web/admin/reservation/resDateAndTimes/1.3.3',
					type : 'get',
					dataType : 'json',
					data: {dresserId:$('.order-create .order-pro').attr('dresserId')},
					success : function(data){
						if(data.code == 0){
							for(var x = 0 ; x <data.data.length; x ++){
								$('.graybox,.loading').hide();
								for(var timeIndex in data.data[x].resTimes){
									if(data.data[x].resDate == $('.order-create .order-qian').val()){
										if(resTime == data.data[x].resTimes[timeIndex]){
											$('.order-create .order-year').append('<option selected="selected" resDate="'+data.data[x].resDate+'" resTimes="'+data.data[x].resTimes[timeIndex]+'">'+ data.data[x].resTimes[timeIndex]+'</option>');	
										}else{
											$('.order-create .order-year').append('<option resDate="'+data.data[x].resDate+'" resTimes="'+data.data[x].resTimes[timeIndex]+'">'+ data.data[x].resTimes[timeIndex]+'</option>');	
										}
									};
								}
							}
						}else{
							alert(data.data.error);		
						}
					},
				});
				
				//回显所在城市
				$('.order-create .mine-city option').each(function(index, element) {
					if($(this).html() == data.data.cityName){
						$(this).attr('selected','selected');	
					};
				});
				
				var areaname = data.data.areaName;
				//回显所在城区
				$.ajax({
					url : testUrl+'/nggirl-web/web/admin/common/getCountys',
					type : 'get',
					data : ({cityId:$('.order-create .mine-city option:selected').attr('cityId')}),
					dataType : 'json',  
					success : function(data){
						$('.city option:gt(0)').remove();
						for(var x = 0; x < data.data.length; x ++){
							if(areaname == data.data[x].areaName){
								$('.order-create .mine-area').append('<option selected="selected" areaId="'+data.data[x].areaId+'" >'+data.data[x].areaName+'</option>');
							}else{
								$('.order-create .mine-area').append('<option areaId="'+data.data[x].areaId+'">'+data.data[x].areaName+'</option>');
							}
						}
					}
				});
			},
		});	
		$('.order-create').show();
	});
	
	//获取作品查询--》作品类型
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/invitecode/getSysWorkType',
		type : 'get',
		dataType : 'json',
		data: {},
		success : function(data){
			for(var x = 0 ; x < data.data.length; x ++){
				$('.ws-search .ws-kinds').append('<option>'+data.data[x].typeName+'</option>');
			}
		},
	});

//作品查询--》搜索
$('.ws-search .ws-btn-search').click(loadWorksQueryPage);

//作品查询--》全部取消按钮变成返回按钮
$('.ws-search .ws-cancle-btn').click(function(e) {
    $('.works-select').hide();
	$('.order-create').show();
});

//作品查询--》"选中"某个作品的信息
$('.works-slected-btn').live('click',function(e) {
   $('.order-year option:gt(0)').remove();
   $('.order-create .order-pro').attr('workId',$(this).parent().parent().children('td:eq(3)').html());
   $('.works-select').hide();
   $('.order-create').show();
   $('.order-create .order-pro').val($(this).parent().parent().children('td:eq(1)').html()+ ','+ $(this).parent().parent().children('td:eq(4)').html() + ',' + $(this).parent().parent().children('td:eq(5)').html()+'元');
   $('.order-create .order-pro').attr('dresserId',$(this).parent().parent().children('td:eq(0)').html());
});

//获取日期对应的时间
$('.order-create .order-qian').blur(function(e) {
});

//"下单用户"文本框获得焦点请求，拿到“用户名”，“手机号”
	$('.order-create .order-user').focus(function(e) {
		$('.order-create').hide();
		loadUserQueryPage();
		$('.user-select').show();
	});

//"作品"文本框获得焦点请求，拿到“化妆师名称”，“作品类型”，“作品单价”
	$('.order-create .order-pro').focus(function(e) {
		$('.order-qian').removeAttr('disabled');
		$('.ws-search .ws-city option:gt(0)').remove();
		$('.ws-search .ws-time option:gt(0)').remove();
		//获取城市列表
		$.ajax({
			url : testUrl+'/nggirl-web/web/admin/common/getCitys',
			type : 'get',
			dataType : 'json',  
			success : function(data){
				if(data.code == 0){
					for(var x = 0; x < data.data.length; x ++){
						$('.ws-search .ws-city').append('<option cityId='+data.data[x].cityId+'>'+data.data[x].cityName+'</option>');
					}
				}else{
					alert(data.data.error);	
				}
			}
		});
		
		//获取可预约时段
		$.get(testUrl+'/nggirl-web/web/admin/reservation/getAllTimeRanges/2.1.0',function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				for(var x = 0; x < data.data.length; x ++){
					$('.ws-search .ws-time').append('<option time="'+data.data[x]+'">'+data.data[x]+'</option>');
				}
			}else{
				alert(data.data.error);	
			}
		});
		
		$('.order-create').hide();
		loadWorksQueryPage();
		$('.works-select').show();
	});


//用户查询--》搜索
	$('.user-select .us-btn-search').click(loadUserQueryPage);	

//用户查询--》全部取消
	$('.user-select .us-cancle-btn').click(function(e) {
		$('.order-create').show();
		$('.user-select').hide();
	});	

//用户查询--》"选中"某个用户的信息
	$('.slected-btn').live('click',function(e) {
	   $('.order-create .order-user').val($(this).parent().parent().children('td:eq(1)').html() + ',' + $(this).parent().parent().children('td:eq(2)').html());
	   $('.order-create .order-user').attr('userId',$(this).parent().parent().children('td:eq(0)').html());
	   $('.user-select').hide();
	   $('.order-create').show();
	});
});

//--------------------------------------------------------订单管理页面--------------------------------------------
//清理订单管理的搜索框
function clearListReservationSearchText(){
    $('.ddxqq .bianhao').val('');
    $('.ddxqq .nicheng').val('');
    $('.ddxqq .name').val('');
    $('.ddxqq .qian').val('');
    $('.ddxqq .hou').val('');
    $('.ddxqq .tel').val('');
	$('.ddxqq .order-status option:selected').attr('value','');
}

//加载订单管理数据
function  loadListReservationsPage(){
	$('.ddxq>tbody>tr:gt(0)').remove();
    //加载订单管理页面
    $.ajax({
        url : testUrl+'/nggirl-web/web/admin/reservation/listReservations/1.4.2',
        type : 'get',
        dataType : 'json',
        data: getListReservationsParams(),
        success : initListReservationsPage
    });
}

//获取订单管理查询参数
function  getListReservationsParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
    params.page = page;
	params.reservationId = $('.ddxqq .bianhao').val();
	params.userPhoneNum = $('.ddxqq .tel').val();
	params.userNickName = $('.ddxqq .nicheng').val();
	params.dresserName = $('.ddxqq .name').val();
	params.startCreateTime = $('.ddxqq .qian').val();
	params.endCreateTime = $('.ddxqq .hou').val();
	params.reservationStatus = $('.ddxqq .order-status option:selected').attr('value');
	params.userId = $('.ddxqq .userid').val();


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
    $('.ddxqq .all-cancle').click(function(){
		clearListReservationSearchText();
		loadListReservationsPage();	
	});

    //创建分页
    $(".ddxqq .tcdPageCode").createPage({
        pageCount:parseInt(data.data.totalPageNum),
        current:parseInt(data.data.currnetPageNum),
        backFn:function(p){
			var params = getListReservationsParams();
			params.page = p;
			$('.ddxq>tbody>tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/reservation/listReservations/1.4.2',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initListReservationsPage
			});			
		}
    });
    //初始化表格
    initReservationTable(data);
    //初始化订单状态
    initReservationStatus(data);
    //初始化退款功能
    initAction(data);
	
	//点击退款弹框中的“取消”按钮
	$('.order-refund .or-btn-cancle').click(function(e) {
        $('.order-refund').hide();
		$('.order-refund-gray').hide();
		$('.order-refund .order-refund-money').val('');
    });
}

//初始化预约表中的数据
function initReservationTable(data){
    for (var x = 0; x < data.data.pageData.length; x++) {
		//判断是否投诉/咨询过(0为没有)
		if(data.data.pageData[x].isComplained == 0){
			$('.ddxq').append('<tr><td reservationId='+data.data.pageData[x].reservationId+'>'+
				data.data.pageData[x].reservationId+'</td><td>'+data.data.pageData[x].createTime+'</td><td>'+
				data.data.pageData[x].userNickName+'</td><td>'+data.data.pageData[x].userPhoneNum+'</td><td>'+
				data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].reservationAddresss+'</td><td>'+
				data.data.pageData[x].reservationTime+'</td><td>'+data.data.pageData[x].fee+'</td><td>'+
				data.data.pageData[x].reservationStatus+'</td><td>'+
				data.data.pageData[x].paidMoney+'</td><td><a href="javascript:;"  class="tuikuan">退款</a></td><td>'+
				data.data.pageData[x].refReason+'</td><td>'+data.data.pageData[x].thirdChannel+'</td><td>'+data.data.pageData[x].refundMoney+'</td><td><input value="复制订单" type="button" class="copy-order" /></td><td><div><input type="button" value="新建" class="create-btn" /></div></td></tr>');
		};
		//判断是否投诉/咨询过(1为有)
		if(data.data.pageData[x].isComplained == 1){
			$('.ddxq').append('<tr><td reservationId='+data.data.pageData[x].reservationId+'>'+
				data.data.pageData[x].reservationId+'</td><td>'+data.data.pageData[x].createTime+'</td><td>'+
				data.data.pageData[x].userNickName+'</td><td>'+data.data.pageData[x].userPhoneNum+'</td><td>'+
				data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].reservationAddresss+'</td><td>'+
				data.data.pageData[x].reservationTime+'</td><td>'+data.data.pageData[x].fee+'</td><td>'+
				data.data.pageData[x].reservationStatus+'</td><td>'+
				data.data.pageData[x].paidMoney+'</td><td><a href="javascript:;"  class="tuikuan">退款</a></td><td>'+
				data.data.pageData[x].refReason+'</td><td>'+data.data.pageData[x].thirdChannel+'</td><td>'+data.data.pageData[x].refundMoney+'</td><td><input value="复制订单" type="button" class="copy-order" /></td><td><div style=" width:110px;"><input type="button" value="新建" class="create-btn" /> <input type="button" value="查看记录" class="look-message-btn" /></div></td></tr>');
		};
    }
}

//初始化预约状态
function initReservationStatus(data) {
    for (var x = 0; x < data.data.pageData.length; x++) {
        if(data.data.pageData[x].reservationStatus == 0){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('等待化妆师接单');
        }
        if(data.data.pageData[x].reservationStatus == 1){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('用户取消预约');
        }
        if(data.data.pageData[x].reservationStatus == 2){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('超时未接单');
        }
        if(data.data.pageData[x].reservationStatus == 3){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('化妆师拒单');
        }
        if(data.data.pageData[x].reservationStatus == 4){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('已接单待支付');
        }
        if(data.data.pageData[x].reservationStatus == 5){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('超时未支付');
        }
        if(data.data.pageData[x].reservationStatus == 6){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('支付成功等待上门');
        }
        if(data.data.pageData[x].reservationStatus == 7){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('化妆进行中');
        }
        if(data.data.pageData[x].reservationStatus == 8){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('化妆结束');
        }
        if(data.data.pageData[x].reservationStatus == 9){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('用户点击结束');
        }
        if(data.data.pageData[x].reservationStatus == 10){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('系统自动结束');
        }
        if(data.data.pageData[x].reservationStatus == 11){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('退款中');
        }
        if(data.data.pageData[x].reservationStatus == 12){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(8)').html('退款完成');
        }
    }
}


//初始化退款动作
function initAction(data){
    for(var x = 0; x < data.data.pageData.length ; x ++){
        //微信退款或者优惠券退款
        if(data.data.pageData[x].payType == 1 || data.data.pageData[x].payType == 1){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(10)').children('.tuikuan').click(function(e) {
				var tuikuan = $(this); //获取退款按钮
				//显示退款弹框
				$('.order-refund').show().css('top',$(window).scrollTop());
				$('.order-refund').css('left',($(window).width()-300)/2);
				$('.order-refund-gray').show();
				
				//在退款弹框中输入金额，点击确定退款!!
				$('.order-refund .or-btn-ok').unbind('click');
				$('.order-refund .or-btn-ok').click(function(e) {
                    //微信退款
                    $.ajax({
                        url : testUrl+'/nggirl-web/web/admin/charge/weixinpay/refund',
                        type : 'post',
                        dataType : 'json',
                        data: {reservationId:tuikuan.parent().parent().children('td:eq(0)').html(),refundMoney:$.trim($('.order-refund .order-refund-money').val())},
                        success : function(data){
                            if(data.code == 0){
                                alert('退款成功！');
								//隐藏退款弹框
								$('.order-refund').hide();
								$('.order-refund-gray').hide();
                                tuikuan.hide();
                            }else{
								alert(data.data.error);
							}
                        },
                    });
                });
            });
        }

        //如果是支付宝退款
        else if(data.data.pageData[x].payType == 2){
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(10)').children('.tuikuan').attr('url',data.data.pageData[x].refundLink);
            $('.ddxq tbody>tr:eq('+(x+1)+')').children('td:eq(10)').children('.tuikuan').click(function(e) {
				var tuikuan = $(this);
				//显示退款弹框
				$('.order-refund').show().css('top',($(window).height()-150)/2);
				$('.order-refund').css('left',($(window).width()-300)/2);
				$('html, body').animate({scrollTop:0}, 'slow');
				$('.order-refund-gray').show();
				$('.order-refund .or-btn-ok').unbind('click');
				$('.order-refund .or-btn-ok').click(function(e) {
                    $.ajax({
                        url : testUrl+'/nggirl-web/web/admin/charge/alipay/refund/nopwd',
                        type : 'post',
                        dataType : 'json',
                        data: {reservationId:tuikuan.parent().parent().children('td:eq(0)').html(),refundMoney:$.trim($('.order-refund .order-refund-money').val())},
                        success : function(data){
                            if(data.code == 0){
                                alert('退款成功！');
								//隐藏退款弹框
								$('.order-refund').hide();
								$('.order-refund-gray').hide();
                                tuikuan.hide();
                            }else{
								alert(data.data.error);	
							}
                        },
                    });
                });
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

//------------------------------------------------复制创建订单页面的作品查询------------------------------
//初始化作品查询页面
function initWorksQueryPage(data){
	if(data.data.pageData.length > 0){
		for( var x = 0 ; x <data.data.pageData.length; x ++){
			$('.works-select table').append('<tr><td>'+
			data.data.pageData[x].dresserId+'</td><td>'+
			data.data.pageData[x].dresserName+'</td><td>'+
			data.data.pageData[x].dresserPhoneNum+'</td><td>'+
			data.data.pageData[x].workId+'</td><td>'+
			data.data.pageData[x].workType+'</td><td>'+
			data.data.pageData[x].price+'</td><td>'+
			data.data.pageData[x].discountPrice+'</td><td>'+
			data.data.pageData[x].description+'</td><td><input type="button" value="选中" class="works-slected-btn" /></td></tr>');
		}
	}
}

//获取作品查询参数
function getWorksQueryParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	params.dresserName = $('.ws-search .ws-name').val();
	params.workId = $('.ws-search .ws-workid').val();
	params.lowPrice = $('.ws-search .ws-lowPrice').val();
	params.highPrice = $('.ws-search .ws-highPrice').val();
	params.workType = $('.ws-search .ws-kinds option:selected').val();
	params.cityId =$('.ws-search .ws-city option:selected').attr('cityid');
	params.reservationDate = $('.ws-search .ws_order').val();
	params.reservationTime = $('.ws-search .ws-time option:selected').attr('time');
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
				url : testUrl+'/nggirl-web/web/admin/reservation/listWorks/2.2.0',
				type : 'post',
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
		url : testUrl+'/nggirl-web/web/admin/reservation/listWorks/2.2.0',
		type : 'post',
		dataType : 'json',
		data: params,
		success : function(data){
			$('.works-select table tbody tr:gt(0)').remove(); //清除原来的表格信息
			createWorksQueryPage(data);
			initWorksQueryPage(data);
		},
	});
}

//--------------------------------------------------------复制创建订单页面的用户查询--------------------------------------------
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
		url : testUrl+'/nggirl-web/web/admin/reservation/listUsers',
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
				url : testUrl+'/nggirl-web/web/admin/reservation/listUsers',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initUserQueryPage
			});			
		}
	});
}

//日期控件失去焦点后获取日期对应的时间
function getMonday(){
	$('.order-create .order-year option:gt(0)').remove();
	//判断是否有dresserid
	if($('.order-create .order-pro').val() != ''){
		$('.order-qian').removeAttr('disabled');
		if($('.order-create .order-qian').val() != ''){
		   //预约时间查询
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/reservation/resDateAndTimes/1.3.3',
				type : 'get',
				dataType : 'json',
				data: {dresserId:$('.order-create .order-pro').attr('dresserId')},
				success : function(data){
					if(data.code == 0){
						for(var x = 0 ; x <data.data.length; x ++){
							for(var timeIndex in data.data[x].resTimes){
								if(data.data[x].resDate == $('.order-create .order-qian').val()){
									$('.order-create .order-year').append('<option resDate="'+data.data[x].resDate+'" resTimes="'+data.data[x].resTimes[timeIndex]+'">'+ data.data[x].resTimes[timeIndex]+'</option>');	
								};
							}
						}
					}else{
						alert(data.data.error);	
					}
				},
			});		
		}
	}else{
		$('.order-qian').attr('disabled','disabled');	
	}
}

