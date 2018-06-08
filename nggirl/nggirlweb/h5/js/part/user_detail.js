$(function(){
	//获取系统中的全部用户身份
	$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/common/getUserRoles',function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			for(var x = 0; x < data.data.length ;x ++){
				$('.yhxqq .yhxqq_user_role').append('<option value='+data.data[x].userRoleId+' typeName='+data.data[x].userRole+'>'+data.data[x].userRole+'</option>');
			}
		}else{
			alert(data.data.error);	
		}
	});
	
	// 点击“用户管理”--》搜索按钮
	$('.yhxqq .search-btn').click(loadUserPage);

	//点击“用户管理”--》全部取消按钮 
	$('.yhxqq .cancle-btn').click(function(e) {
        $('.yhxqq .search').val('');
		$('.yhxqq .search-tel').val('');
		loadUserPage();
    });
	
	//查看用户所有评论
	$('.user_competence_manage .ucm_del_all_ping').click(function(e) {
		$('.user_competence_manage').hide();
		$('.ac-list').attr('userId',$(this).attr('userId'));
		$('.ac-list .searchad-btn').click();
		$('.all_commonts_redirect_page .all_commonts_redirect_page_num').val('');
		$('.everyone_commonts_redirect_page .everyone_commonts_redirect_page_num').val('');
		$('.ac-list .topbtn.return_btn').show();
		$('#ac_manage').show();
    });
	
	//点击编辑按钮弹出用户身份编辑框
	$('.table_user_competence .tuc_edit_btn').live('click',function(e) {
		var btn = $(this);
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/common/getUserRoles',function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.ucm_edit_user_message .ueum_text option:gt(0)').remove();
				for(var x = 0; x < data.data.length ;x ++){
					if(btn.prev().html() == data.data[x].userRole){
						$('.ucm_edit_user_message .ueum_text').append('<option value='+data.data[x].userRoleId+' selected="selected">'+data.data[x].userRole+'</option>');
					}else{
						$('.ucm_edit_user_message .ueum_text').append('<option value='+data.data[x].userRoleId+'>'+data.data[x].userRole+'</option>');
					}
				}
			}else{
				alert(data.data.error);	
			}
		});
        $('.ucm_edit_user_message').show();
		$('.ucm_edit_user_message .ueum_text').val(btn.prev().html());
    });
	
	//编辑用户身份,确定按钮
	$('.ucm_edit_user_message .ueum_ok_btn').click(function(e) {
		var originalUserRoleId='';
		if($('.table_user_competence .tuc_edit_btn').siblings().text()=="南瓜用户" || $('.table_user_competence .tuc_edit_btn').siblings().text()=="普通用户" || $('.table_user_competence .tuc_edit_btn').siblings().text()==""){
			originalUserRoleId=0;
		}else if($('.table_user_competence .tuc_edit_btn').siblings().text()=="南瓜CEO"){
			originalUserRoleId=1;
		}else if($('.table_user_competence .tuc_edit_btn').siblings().text()=="南瓜小编"){
			originalUserRoleId=2;
		}else if($('.table_user_competence .tuc_edit_btn').siblings().text()=="南瓜达人"){
			originalUserRoleId=3;
		}else if($('.table_user_competence .tuc_edit_btn').siblings().text()=="化妆师"){
			originalUserRoleId=4;
		}else if($('.table_user_competence .tuc_edit_btn').siblings().text()=="配方师"){
			originalUserRoleId=5;
		}
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/user/updateUseRole/3.0.0',{userId:$('.user_competence_manage .ucm_del_all_ping').attr('userId'),originalUserRoleId:originalUserRoleId,currentUserRoleId:$('.ucm_edit_user_message .ueum_text').val()},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.ucm_edit_user_message').hide();
				getUserManageMessageFn($('.user_competence_manage .ucm_del_all_ping'));
			}else{
				alert(data.data.error);	
			}	
		});
    });
	
	//编辑用户身份,取消按钮
	$('.ucm_edit_user_message .ueum_cancle_btn').click(function(e) {
        $('.ucm_edit_user_message').hide();
		$('.ucm_edit_user_message .ueum_text').val('');
    });
	
	//禁言操作
	$('.table_user_competence .tuc_jin_btn').live('click',function(e) {
		var r = confirm('确定要禁言？');
		if(r == true){
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/user/makeUserSilent/2.2.0',{userId:$('.user_competence_manage .ucm_del_all_ping').attr('userId')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					getUserManageMessageFn($('.user_competence_manage .ucm_del_all_ping'));
				}else{
					alert(data.data.error);	
				}	
			});
		}
    });
	
	//取消禁言操作
	$('.table_user_competence .tuc_jin_cancle_btn').live('click',function(e) {
		var r = confirm('确定要取消禁言？');
		if(r == true){
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/user/makeUserSpeak/2.2.0',{userId:$('.user_competence_manage .ucm_del_all_ping').attr('userId')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					getUserManageMessageFn($('.user_competence_manage .ucm_del_all_ping'));
				}else{
					alert(data.data.error);	
				}	
			});
		}
    });
	
	//封号操作
	$('.table_user_competence .tuc_feng_btn').live('click',function(e) {
		var r = confirm('确定要封号？');
		if(r == true){
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/user/forbidUserAccount/2.2.0',{userId:$('.user_competence_manage .ucm_del_all_ping').attr('userId')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					getUserManageMessageFn($('.user_competence_manage .ucm_del_all_ping'));
				}else{
					alert(data.data.error);	
				}	
			});
		}
    });
	
	//取消封号操作
	$('.table_user_competence .tuc_feng_cancle_btn').live('click',function(e) {
		var r = confirm('确定要取消封号？');
		if(r == true){
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/user/openUserAccount/2.2.0',{userId:$('.user_competence_manage .ucm_del_all_ping').attr('userId')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					getUserManageMessageFn($('.user_competence_manage .ucm_del_all_ping'));
				}else{
					alert(data.data.error);	
				}	
			});
		}
    });
	
	//查看该用户下的所有的上门美妆订单
	$('.yhxq .user_order,.user_order_information .uoi_zhuang_btn').live('click',function(e) {
		$('.user_order_information').attr('userid',$(this).attr('userid'));
		$(this).removeClass('uoi_gray_btn');
		$('.uoi_salon_btn').addClass('uoi_gray_btn');
		$('.ddxqq .userid').val($(this).attr('userid'));
		$('.user_order_information .uoi_salon_btn').attr('userid',$(this).attr('userid'));
		$('.user_order_information .uoi_zhuang_btn').attr('userid',$(this).attr('userid')).removeClass('uoi_gray_btn');
		loadListReservationsPage();
		$('.yhxqq,#xwc_order_manage').hide();
		$('.user_order_information,#reservation_manage').show();
		$('.user_order_information').attr('phoneNum',$(this).attr('phoneNum'));
		$('.user_order_information').attr('nickName',$(this).attr('nickName'));
    });
	
	//查看该用户下的所有的沙龙订单
	$('.user_order_information .uoi_salon_btn').live('click',function(e) {
		$(this).removeClass('uoi_gray_btn');
		$('.uoi_zhuang_btn').addClass('uoi_gray_btn');
		$('.xwc-manage .userid').val($(this).attr('userid'));
		loadXwcOrderPage();
		$('.ddxqq').hide();
		$('#xwc_order_manage').show();
    });
	
	//点击用户管理里面的返回按钮
	$('.uoi_return_btn').click(function(e) {
        $('#user_manage').show();
		$('#reservation_manage,.user_order_information,.new-ca,.nc-history-message,#xwc_order_manage').hide();
		$('.user_order_information').removeAttr('userid');
    });
	$(".look_user_points_btn").live('click',function(){
		$("#user_manage").hide();
		$(".points_statistics_list").show();
	});
	$(".searchups_btn").live('click',function(){
		loadUserPointsStatistics();	
	});
	$(".upsBack_btn").live('click',function(){
		$("#user_manage").show();
		$(".points_statistics_list").hide();
	});
	
	//点击输入积分按钮
	$('.table_user_competence .tuc_input_fen').live('click',function(e) {
        $('.user_another_window,.graybox').show();
    });

	//点击输入积分弹框里面的确认按钮
	$('.user_another_window .user_another_btn_ok').click(function(e) {
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/user/userGetAdditionalScore/2.5.6',{userId:$('.user_competence_manage .ucm_del_all_ping').attr('userId'),score:$('.user_another_window .user_another_window_txt').val()},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.user_another_window,.graybox').hide();
				$('.user_another_window .user_another_window_txt').val('');
				alert('成功!');
			}else{
				alert(data.data.error);
				$('.user_another_window,.graybox').hide();
				$('.user_another_window .user_another_window_txt').val('');
			}
		});
    });
	
	//点击输入积分弹框里面的取消按钮
	$('.user_another_window .user_another_btn_cancle').click(function(e) {
        $('.user_another_window,.graybox').hide();
		$('.user_another_window .user_another_window_txt').val('');
    });
	
});

//创建用户列表分页
function createUserPage(data){
	$(".yhxqq .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getUserSearchParams();
			params.page = p;
			$('.yhxq>tbody>tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/user/listUsers/2.5.6',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initUserPage
			});			
		}
	});
}

//初始化用户分页
function initUserPage(data){
	createUserPage(data);
	if(data.data.androidNum == 0){
		$('.yhxqq .order-num .user_android').html(0);
	}else{
		$('.yhxqq .order-num .user_android').html(data.data.androidNum);
	};
	if(data.data.user_ios == 0){
		$('.yhxqq .order-num .user_ios').html(0);
	}else{
		$('.yhxqq .order-num .user_ios').html(data.data.iosNum);
	};
	if(data.data.h5Num == 0){
		$('.yhxqq .order-num .user_h5').html(0);
	}else{
		$('.yhxqq .order-num .user_h5').html(data.data.h5Num);
	};
	for(var x = 0; x < data.data.pageData.length ; x ++){
		$('.yhxq').append('<tr><td>'+data.data.pageData[x].userId+'</td><td>'+data.data.pageData[x].registerTime+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+data.data.pageData[x].userRole+'</td><td>'+data.data.pageData[x].channelResource+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].userInfoPhone+'</td><td>'+data.data.pageData[x].reservationNum+'</td><td>'+data.data.pageData[x].consumeFee+'</td><td>'+data.data.pageData[x].address+'</td><td><input type="button" value="权限管理" class="user_competence" userId="'+data.data.pageData[x].userId+'" /> <input type="button" value="订单管理" class="user_order" phoneNum="'+data.data.pageData[x].phoneNum+'" nickName ="'+data.data.pageData[x].nickName+'" userId="'+data.data.pageData[x].userId+'" /></td></tr>');
	}
}

//获取查询参数
function getUserSearchParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	params.nickName = $('.yhxqq .search').val();
	params.phoneNum = $('.yhxqq .search-tel').val();
	params.userRole = $('.yhxqq .yhxqq_user_role option:selected').attr('typeName');
	return params;
}

//加载用户分页数据
function loadUserPage(){
	$('.yhxq>tbody>tr:gt(0)').remove();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/user/listUsers/2.5.6',
		type : 'get',
		dataType : 'json',
		data: getUserSearchParams(1),
		success : initUserPage,
	});
}

//获取用户权限管理信息
function getUserManageMessageFn(btn){
	$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/user/getUserPrivilegeInfo/2.2.0',{userId:btn.attr('userId')},function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			$('.table_user_competence tbody tr:gt(0)').remove();
			$('.user_competence_manage').show();
			$('.yhxqq').hide();
			$('.user_competence_manage .ucm_del_all_ping').attr('userId',data.data.userId);
			$('.user_competence_manage .ucm_del_all_ping').attr('nickName',data.data.nickName);
			
			//判断禁言状态
			if(data.data.isNoTalk == 0){//未禁言
				//判断封号状态
				if(data.data.enabled == 0){//已封号
					$('.table_user_competence').append('<tr><td>'+data.data.nickName+'</td><td><span>'+data.data.userRole+'</span><input type="button" value="编辑" class="tuc_edit_btn" /></td><td>'+data.data.denyTimes+'</td><td>'+data.data.reportedTimes+'</td><td>'+data.data.badReportTimes+'</td><td><input type="button" value="禁言24小时" class="tuc_jin_btn" /></td><td><span class="tuc_feng_time">'+data.data.disabledTime+'</span><input type="button" value="取消" class="tuc_feng_cancle_btn" /></td><td><input type="button" class="tuc_input_fen" value="输入积分" style=" padding:7px; background:#51a351; color:#fff " /></td></tr>');
				}
				if(data.data.enabled == 1){//未封号
					$('.table_user_competence').append('<tr><td>'+data.data.nickName+'</td><td><span>'+data.data.userRole+'</span><input type="button" value="编辑" class="tuc_edit_btn" /></td><td>'+data.data.denyTimes+'</td><td>'+data.data.reportedTimes+'</td><td>'+data.data.badReportTimes+'</td><td><input type="button" value="禁言24小时" class="tuc_jin_btn" /></td><td><input type="button" value="封号" class="tuc_feng_btn" /></td><td><input type="button" class="tuc_input_fen" value="输入积分" style=" padding:7px; background:#51a351; color:#fff " /></td></tr>');
				}
			}
			if(data.data.isNoTalk == 1){//已禁言
				//判断封号状态
				if(data.data.enabled == 0){//已封号
					$('.table_user_competence').append('<tr><td>'+data.data.nickName+'</td><td><span>'+data.data.userRole+'</span><input type="button" value="编辑" class="tuc_edit_btn" /></td><td>'+data.data.denyTimes+'</td><td>'+data.data.reportedTimes+'</td><td>'+data.data.badReportTimes+'</td><td><span class="tuc_jin_time">'+data.data.noTalkTime+'</span><input type="button" value="取消" class="tuc_jin_cancle_btn" /></td><td><span class="tuc_feng_time">'+data.data.disabledTime+'</span><input type="button" value="取消" class="tuc_feng_cancle_btn" /></td><td><input type="button" class="tuc_input_fen" value="输入积分" style=" padding:7px; background:#51a351; color:#fff " /></td></tr>');
				}
				if(data.data.enabled == 1){//未封号
					$('.table_user_competence').append('<tr><td>'+data.data.nickName+'</td><td><span>'+data.data.userRole+'</span><input type="button" value="编辑" class="tuc_edit_btn" /></td><td>'+data.data.denyTimes+'</td><td>'+data.data.reportedTimes+'</td><td>'+data.data.badReportTimes+'</td><td><span class="tuc_jin_time">'+data.data.noTalkTime+'</span><input type="button" value="取消" class="tuc_jin_cancle_btn" /></td><td><input type="button" value="封号" class="tuc_feng_btn" /></td><td><input type="button" class="tuc_input_fen" value="输入积分" style=" padding:7px; background:#51a351; color:#fff " /></td></tr>');
				}
			}
		}else{
			alert(data.data.error);	
		}
	});
};
//获取帖子或日签种草人名单
function loadUserPointsStatistics(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/stat/userScoreStat/3.0.0',
		type : 'get',
		dataType : 'json',
		data: {startTime:$(".points_statistics_search .upStartTime").val().replace(/\D/g,''),endTime:$(".points_statistics_search .upEndTime").val().replace(/\D/g,'')},
		success : function(data){
			if(data.code == 0){
				$('.points_ios tbody tr,.points_and tbody tr,.points_distribution tbody tr').remove();
				var iosPoints = data.data.iosUserScore;
				var andPoints = data.data.androidUserScore;
				var userLevels = data.data.userLevels;
				$('.points_ios tbody').append('<tr><td>'+iosPoints.allUserTotalScore+'</td><td>'+iosPoints.userGainScoreToday+'</td><td>'+iosPoints.userConsumeScoreToday+'</td><td>'+iosPoints.checkin+'</td><td>'+iosPoints.comment+'</td><td>'+iosPoints.like+'</td><td>'+iosPoints.praise+'</td><td>'+iosPoints.collect+'</td><td>'+iosPoints.share+'</td><td>'+iosPoints.scorelottery+'</td><td>'+iosPoints.goodsshop+'</td><td>'+iosPoints.regist+'</td></tr>');
	
				$('.points_and tbody').append('<tr><td>'+andPoints.allUserTotalScore+'</td><td>'+andPoints.userGainScoreToday+'</td><td>'+andPoints.userConsumeScoreToday+'</td><td>'+andPoints.checkin+'</td><td>'+andPoints.comment+'</td><td>'+andPoints.like+'</td><td>'+andPoints.praise+'</td><td>'+andPoints.collect+'</td><td>'+andPoints.share+'</td><td>'+andPoints.scorelottery+'</td><td>'+andPoints.goodsshop+'</td><td>'+andPoints.regist+'</td></tr>');
			
				$('.points_distribution tbody').append('<tr><td>人数</td><td>'+userLevels.lv0+'</td><td>'+userLevels.lv1+'</td><td>'+userLevels.lv2+'</td><td>'+userLevels.lv3+'</td><td>'+userLevels.lv4+'</td><td>'+userLevels.lv5+'</td><td>'+userLevels.lv6+'</td><td>'+userLevels.lv7+'</td></tr>');
		
			}else{
				alert(data.data.error);
			}
		},
	});
};