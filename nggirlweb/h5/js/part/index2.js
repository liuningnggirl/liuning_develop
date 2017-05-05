var prevurl = '/nggirl-web';
var updateStr = '';
//加载统计数据
function loadStat(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/stat/detail',
		type : 'get',
		dataType : 'json',
		data: {},
		success : function(data){
			$('.total-message>li:eq(0) .total-page .f32').html(data.data.todayReservationNum);//今日订单
			$('.total-message>li:eq(1) .total-page .f32').html(data.data.todayWorkNum);		  //今日作品
			$('.total-message>li:eq(2) .total-page .f32').html(data.data.reservationNum);     //总订单数
			$('.total-message>li:eq(3) .total-page .f32').html(data.data.dresserNum);         //化妆师总数
			$('.total-message>li:eq(4) .total-page .f32').html(data.data.userNum);            //总注册用户数
			$('.total-message>li:eq(5) .total-page .f32').html(data.data.amount);             //总交易金额

			$('.content-right ul>li>.total-page').eq(0).css('background','#08c');
			$('.content-right ul>li>.total-page').eq(1).css('background','#ffb848');
			$('.content-right ul>li>.total-page').eq(2).css('background','#28b779');
			$('.content-right ul>li>.total-page').eq(3).css('background','#da542e');
			$('.content-right ul>li>.total-page').eq(4).css('background','#f74d4d');
			$('.content-right ul>li>.total-page').eq(5).css('background','#2255a4');

			$('.content-right ul>li>.total-page').hover(function(){
				$(this).css('background','#2E363F');
			},function(){
				$('.content-right ul>li>.total-page').eq(0).css('background','#08c');
				$('.content-right ul>li>.total-page').eq(1).css('background','#ffb848');
				$('.content-right ul>li>.total-page').eq(2).css('background','#28b779');
				$('.content-right ul>li>.total-page').eq(3).css('background','#da542e');
				$('.content-right ul>li>.total-page').eq(4).css('background','#f74d4d');
				$('.content-right ul>li>.total-page').eq(5).css('background','#2255a4');
			});
		},
	});
}

function getPersonInFn(){
	$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/personal/getPersonalInfo',function(data){
		var data = $.parseJSON(data);
		//登录名
		$('.login-name').html(data.data.username);
		//姓名
		$('.login-name-pin').html(data.data.employeeName);
		//手机号
		$('.login-tel').html(data.data.phoneNum);
		//邮箱
		$('.login-email').html(data.data.email);
		//详细地址
		$('.login-address').html(data.data.address);
		//所在城市
		$('.login-city').html(data.data.cityName);
		//角色名称
		$('.login-js-name').html(data.data.roleName);
		//角色描述
		$('.login-js-desc').html(data.data.roleDesc);
	});
}

//加载用户菜单
function loadMenu(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/getMenus',
		type : 'get',
		dataType : 'json',
		data: {},
		success : function(data){
			$('.content .content-left ul li>a').each(function(){
				var url = $(this).attr('url');
				
				if(!isInMenu(url,data)){
					$(this).parent().remove();
				}
			});
			
			//判断是否隐藏统计信息栏
			var statUrl ='/admin/stat/detail/1.3.2';
			if(!isInMenu(statUrl,data)){
				//隐藏统计信息栏中相关的页面元素
				$('.total-message').hide();
				$('.order-count').hide();
			}

/*			$('.content .content-left ul li:eq(0) a').css('background','#08c url(images/menu-active.png) no-repeat right').siblings().css('background','#2E363F');
*/			/*$('.content .content-left ul li:eq(0) a').click();*/
			$('.content .content-left ul>li>a').click(function(e) {	
				$('.wb>#'+$(this).attr('tag')).show().siblings().hide();
				$('.order-magement').children('span').html($(this).children('span').html());
				$(this).css({'background':'#08c url(images/menu-active.png) no-repeat right'}).siblings().css('background','#2E363F');
				$(this).parent().siblings().children().css('background','#2E363F');
				$('.user_order_information').hide().removeAttr('userid');
				$('.ddxqq .userid').val('');
				
			});

			$('.wb>.weight-box:eq(0)>.page-num>a').click(function(e) {
				$(this).addClass('blue').siblings().removeClass('blue');
			});
		},
	});
	
	//获取当前登录的是谁
	$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/personal/getPersonalInfo',function(data){
		var data = $.parseJSON(data);
		$('.mine-username').html(data.data.employeeName);
	});
}

//获取url和对应的数据
function isInMenu(url,data){
	for(var i=0;i<data.data.length;i++){
		if(url == data.data[i].url){
			return true;
		}
	}
	return false;
}

$(function(){
	//展开首页菜单
	$('.content-right .total-message .total-message_slide_btn').click(function(){
		if($(this).hasClass('on')){
			$(this).attr('src','images/slide_down_arr.png').removeClass('on');
			$('.total-message .total-message_shope,.total-message .total-message_zhuang').addClass('hidden');
		}else{
			$(this).attr('src','images/slide_up_arr.png').addClass('on');
			$('.total-message .total-message_shope,.total-message .total-message_zhuang').removeClass('hidden');
			//电商相关统计信息V3.1.0
			$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/stat/getItemStatInfo/3.1.0',function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.content-right .total-message .total-message_shope ul li .orderNum').html(data.data.orderNum);
					$('.content-right .total-message .total-message_shope ul li .orderNumT').html(data.data.orderNumT);
					$('.content-right .total-message .total-message_shope ul li .tradingVolume').html(data.data.tradingVolume);
					$('.content-right .total-message .total-message_shope ul li .tradingVolumeT').html(data.data.tradingVolumeT);
					$('.content-right .total-message .total-message_shope ul li .itemNum').html(data.data.itemNum);
					$('.content-right .total-message .total-message_shope ul li .onSaleNum').html(data.data.onSaleNum);
					$('.content-right .total-message .total-message_shope ul li .succOrderPer').html(data.data.succOrderPer);
					$('.content-right .total-message .total-message_shope ul li .succOrderPerT').html(data.data.succOrderPerT);
				}else{
					alert(data.data.error);	
				}
			});
			//美妆相关统计信息V3.1.0
			$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/stat/getCosmeticStatInfo/3.1.0',function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.content-right .total-message .total-message_zhuang ul li .orderNum').html(data.data.orderNum);
					$('.content-right .total-message .total-message_zhuang ul li .orderNumT').html(data.data.orderNumT);
					$('.content-right .total-message .total-message_zhuang ul li .tradingVolume').html(data.data.tradingVolume);
					$('.content-right .total-message .total-message_zhuang ul li .tradingVolumeT').html(data.data.tradingVolumeT);
					$('.content-right .total-message .total-message_zhuang ul li .dresserNum').html(data.data.dresserNum);
					$('.content-right .total-message .total-message_zhuang ul li .workNum').html(data.data.workNum);
					$('.content-right .total-message .total-message_zhuang ul li .succOrderPer').html(data.data.succOrderPer);
					$('.content-right .total-message .total-message_zhuang ul li .succOrderPerT').html(data.data.succOrderPerT);
				}else{
					alert(data.data.error);	
				}
			});
		}
	});
	
	//用户相关统计信息V3.1.0
	$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/stat/getUserStatInfo/3.1.0',function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			$('.content-right .total-message .total-message_user ul li .totalUserNum').html(data.data.totalUserNum);
			$('.content-right .total-message .total-message_user ul li .iosUserNum').html(data.data.iosUserNum);
			$('.content-right .total-message .total-message_user ul li .androidUserNum').html(data.data.androidUserNum);
			$('.content-right .total-message .total-message_user ul li .h5UserNum').html(data.data.h5UserNum);
			$('.content-right .total-message .total-message_user ul li .totalUserNumT').html(data.data.totalUserNumT);
			$('.content-right .total-message .total-message_user ul li .iosUserNumT').html(data.data.iosUserNumT);
			$('.content-right .total-message .total-message_user ul li .androidUserNumT').html(data.data.androidUserNumT);
			$('.content-right .total-message .total-message_user ul li .h5UserNumT').html(data.data.h5UserNumT);
		}else{
			alert(data.data.error);	
		}
	});

	//添加ajax请求的全局事件处理
	$(document).ajaxSuccess(function(event, XMLHttpRequest, ajaxOptions) {
		var result = $.parseJSON(XMLHttpRequest.responseText);
		if(result.code == '3'){
			window.location.href="login.html?v=<%= VERSION %>";
		}else if(result.code == '4'){
			alert(data.data.error);
		}    
    });
	
	$('.invitecode .code').click(function(e) {
		if(typeof($(this).attr('check')) == "undefined"){
			$(this).parent().children('a').slideDown();
			$(this).attr('check','check');
		}else{
			$(this).parent().children('a').slideUp();
			$(this).removeAttr('check');
		}
    });
	$('.message_manages .sendmessage').click(function(e) {
		if(typeof($(this).attr('check')) == "undefined"){
			$(this).parent().children('a').slideDown();
			$(this).attr('check','check');
		}else{
			$(this).parent().children('a').slideUp();
			$(this).removeAttr('check');
		}
    });
	//首页控制点击展开子菜单
	$('.h5_index_manages .h5_index_control').click(function(e) {
		if(typeof($(this).attr('check')) == "undefined"){
			$(this).parent().children('a').slideDown();
			$(this).attr('check','check');
		}else{
			$(this).parent().children('a').slideUp();
			$(this).removeAttr('check');
		}
    });
	//南瓜社团点击展开子菜单
	$('.pumpkin_community_manage .pumpkin_community_control').click(function(e) {
		if(typeof($(this).attr('check')) == "undefined"){
			$(this).parent().children('a').slideDown();
			$(this).attr('check','check');
		}else{
			$(this).parent().children('a').slideUp();
			$(this).removeAttr('check');
		}
    });
	//美妆线下服务管理点击展开子菜单
	$('.beauty_line_service_manages .beauty_line_service_manages_control').click(function(e) {
		if(typeof($(this).attr('check')) == "undefined"){
			$(this).parent().children('a').slideDown();
			$(this).attr('check','check');
		}else{
			$(this).parent().children('a').slideUp();
			$(this).removeAttr('check');
		}
    });
    //电商商城点击展开子菜单
	$('.electricity_supplier_mall_manages .electricity_supplier_manages_control').click(function(e) {
		if(typeof($(this).attr('check')) == "undefined"){
			$(this).parent().children('a').slideDown();
			$(this).attr('check','check');
		}else{
			$(this).parent().children('a').slideUp();
			$(this).removeAttr('check');
		}
    });
	//判断是否为超级管理员
	$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/personal/getPersonalInfo',function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.isSuper == 1){
				$('.systemMangement').show();	
			};
		};
		if(data.code == 1){
			alert(data.data.error);
		};
	});
	
	//获取统计信息
	$('.oc-search-btn').click(function(e) {
        $.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/stat/detail/1.3.2',{startDate:$('.order-count .oc-qian').val(),endDate:$('.order-count .oc-hou').val(),type:$('.order-count .oc-select option:selected').attr('value')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.order-count-table').show();
				//清掉原有加载数据
				$('.order-count-table tbody tr:gt(0)').remove();
				//隐藏其它表格
				$('.wb').hide();
				$('.order-count-table tbody').append('<tr><td>'+data.data.reservationNum+'</td><td>'+data.data.amount+'</td><td>'+data.data.dresserNum+'</td><td>'+data.data.userNum+'</td><td>'+data.data.todayReservationNum+'</td><td>'+data.data.todayWorkNum+'</td></tr>');	
			}
			if(data.code == 1){
				alert(data.data.error);	
			}
		});
    });
	
	//设置灰色弹窗高度与当前窗口同高
	$('.graybox,.graybox_ping_list').height($(window).height());
	
	//加载统计信息
	loadStat();

	//获取用户权限菜单(左侧列表)
	loadMenu();

	//清理订单管理的搜索框
	clearListReservationSearchText();

	//加载订单管理列表页面
	//loadListReservationsPage();
	$('.wb>.weight-box:eq(0)').show();

	//点击左侧订单管理菜单
	$('.content-left ul>li.reservation_manage a').click(function(){
	

		$('#reservation_manage .userid').val('');
		loadListReservationsPage();
		$('.order-create').hide();
		$('.ddxq-list').show();	
		$('.works-select').hide();
		$('.user-select,.user_order_information').hide();
		$('.user_order_information').removeAttr('userid');
		location.hash='order_management';
		
	});

	//点击左侧用户管理菜单
	$('.content-left ul>li:eq(1) a').click(function(){
		loadUserPage();
		location.hash='user_management';
	});

	//点击左侧化妆师管理列表
	$('.content-left ul>li:eq(2) a').click(function(){
		loadDresserPage();	
		location.hash='dresser_management';
	});

	//点击左侧的作品管理
	$('.content-left ul>li:eq(3) a').click(function(){
		loadWorkPage();	
		location.hash='work_management';
	});
	
	//点击左侧的Banner管理
	$('.content-left ul>li:eq(4) a').click(function(){
		loadBannerPage();
		location.hash='banner_management';	
	});
	
	//点击左侧的官方推送
	$('.content-left ul>li a[tag=sysmessage_manage]').click(function(){
		loadMessagePush();
		location.hash='push_management';	
	});
	//点击左侧的官方推送
	$('.content-left ul>li a[tag=single_message_manage]').click(function(){
		getSingleFn();
		location.hash='single_message_manage';	
	});
	//点击左侧的官方推送
	$('.content-left ul>li a[tag=other_message_manage]').click(function(){
		
		location.hash='other_message_manage';	
	});
	//点击左侧的提现管理
	$('.content-left ul>li:eq(6) a').click(function(){
		loadWithdrawDetail();
		location.hash='cash_management';	
	});
	
	//点击左侧的投诉管理
	$('.content-left ul>li:eq(7) a').click(function(){
		loadReservationComplaint();
		location.hash='complaints_management';	
	});
	
	//点击左侧的用户反馈
	$('.content-left ul>li:eq(8) a').click(function(){
		loadFeedback();
		location.hash='feedback_management';	
	});
	
	//点击左侧的邀请码管理
	$('.content-left ul>li a[tag=normal_invite_manage]').click(function(){
		listInviteCodes();
		location.hash='normal_management';	
	});
	
	//点击左侧的超级邀请码管理
	$('.content-left ul>li a[tag=super_invite_manage]').click(function(){
		listInviteCodess();
		location.hash='superInvite_management';	
	});
	
	//点击左侧的随机邀请码管理
	$('.content-left ul>li a[tag=random_invite_manage]').click(function(){
		listInviteCodes2();	
		location.hash='randomInvite_management';	
	});

	//资讯管理
	$('.content-left ul>li:eq(10) a').click(function(){
		loadZiXunPage();	
		location.hash='ziXun_management';	
	});

	//美妆下午茶管理
	$('.content-left ul>li:eq(11) a').click(function(){
		clearFn();
		loadXwcPage();
		$('.mzxwc-activity-content').hide();
		$('.xwc_active_detail').show();
		location.hash='xwc_management';	
	});

	//美妆下午茶订单管理
	$('.content-left ul>li:eq(12) a').click(function(){
		$('.xwc-manage .userid').val('');
		loadXwcOrderPage();
		location.hash='xwcOrder_management';	
	});
	
	//投诉/咨询管理
	$('.content-left ul>li:eq(13) a').click(function(){
		$('.complaintsMangement').show();	
		loadCaPage();
		location.hash='complaintZixun_management';	
	});
	
	//上门美妆推荐专题管理
	$('.content-left ul>li:eq(14) a').click(function(){
		loadTopicsPage();
		location.hash='smmzTopics_management';	
	});
	
	//广告管理
	$('.content-left ul>li:eq(15) a').click(function(){
		clearAdSearch();
		listInviteCodes3();
		location.hash='ad_management';	
		$('.ad-list').show();
		$('.ad-create').hide();
		
	});
	
	//全部评论管理
	$('.content-left ul>li:eq(16) a').click(function(){
		$('.ac-list').removeAttr('userId');
		loadAllCommentsPage();
		$('.all_commonts_redirect_page .all_commonts_redirect_page_num').val('');
		$('.everyone_commonts_redirect_page .everyone_commonts_redirect_page_num').val('');
		$('.ac-list').show();
		$('.video_add_or_edit,.ac-list .topbtn.return_btn,.ju_bao_box,.ac_everyOne_list').hide();
		location.hash='allCommends_management';	
	});
	
	//帖子管理
	$('.content-left ul>li.column_manage a').click(function(){
		loadColumnPage();
		$(".column-table").show();
		$(".addcolumn").removeAttr("id");
		location.hash='tie_management';	
	});
	
	//商品管理
	$('.content-left ul>li.goods_manage a').click(function(){
		$(".goods_list .goods_search input[type='text']").val("");
		$(".branch_list .goodsLook ").removeClass("lookThisBranch");
		goodsInfo();
		clearGoodsList();
		$(".goods_list,.goods_list .comodityBrand,.goods_list .comodityCountry,.tab_goods").show();
		$(".goods_list").siblings().hide();
		$(".weight-title").show();
		$(".goods_create").removeAttr("comodityId");
		location.hash='goods_management';	
	});

	//日签管理
	$('.content-left ul>li.riqian_manage a').click(function(){
		riqianInfo();
		getRiQianAlert();
		$(".riqian_list").show();
		$(".riqian_create,.check_all_month_user_list").hide();
		$(".riqian_create").removeAttr("id");
		location.hash='riqian_management';	
	});

	
	//妆品试用活动管理
	$('.content-left ul>li.free_trial_manage a').click(function(){
		loadFreeTrialPage();
		$('.add_free_trial,.look_free_trial_list').hide();
		$('.free_trial_list').show();
		location.hash='free_trial_manage';	
	});
	//积分商城管理
	$('.content-left ul>li.points_mall_manage a').click(function(){
		loadGoodsListPage();
		location.hash='points_mall_management';	
		$(".porder_list,.points_create").hide();
		$(".points_list").show();
	});
	
	//抽奖活动管理
	$('.content-left ul>li.lottery_activity_manage a').click(function(e) {
        $('.lottery_activity_manage,.lottery_activity_manage .lottery_activity').show();
		location.hash='lottery_activity_manage';
		loadLotteryListPage();
		$(".add_lottery_activity,.gift_manage,.lottery_add_commodity").hide();	
    });
	//商品专栏管理
	$('.content-left ul>li.goods_column_manage a').click(function(e) {
		location.hash='goods_column_manage';
		loadGoodsColumnListPage();
		$('.goods_column_create').hide();
		$('.goods_column_list').show();
    });
	//客座小编帖子录入
	$('.content-left ul>li.guest_column_manage a').click(function(e) {
		location.hash='guest_column_manage';
		$('.going_column_list,.guest_column_create,.look_guest_column,.ddxqq-search,.order-magement,.total-message').hide();
		$('.guest_column_manage,.guest_column_list').show();
		guestColumnNameInfo();
		clearGuestArtical();
		guestColumnInfo();
		clearGuestArtDet();
    });
	//首页控制-导航控制
	$('.content-left ul>li.h5_index_manages a[tag=index_nav_manage]').click(function(e) {
		location.hash='index_nav_manage';
		$('.index_nav_lan').children('div').remove();
		getKindsListFn();
    });
	//首页控制-列表控制
	$('.content-left ul>li.h5_index_manages a[tag=index_list_manage]').click(function(e) {
		location.hash='index_list_manage';
		loadHistoryListPage();
		getTodayRecommendsFn();
		$('.index_list_manage .index_list_manage_box').show();
    });
	//南瓜社团-免费试用管理
	$('.content-left ul>li.pumpkin_community_manage a[tag=community_freetrail_manage_a]').click(function(e) {
		location.hash='community_freetrail_manage_a';
		getRecommendListFn();
    });
	//南瓜社团-社团活动管理
	$('.content-left ul>li.pumpkin_community_manage a[tag=community_activity_manage_a]').click(function(e) {
		location.hash='community_activity_manage_a';
		getRecommendListTuanFn();
    });
	//南瓜社团-热门话题管理
	$('.content-left ul>li.pumpkin_community_manage a[tag=community_hottopic_manage]').click(function(e) {
		$('.chmc_hot_sort .community_hottopic_table tbody>tr:gt(0)').remove();
		location.hash='community_hottopic_manage';
		hotTopicFn();
		loadHotTopicListPage();
		$('.community_hottopic_manage .community_hottopic_manage_content').show();
    });
	//南瓜社团-帖子标签管理
	$('.content-left ul>li.pumpkin_community_manage a[tag=community_label_manage]').click(function(e) {
		getLabelList();
		
		location.hash='community_label_manage';
		$(".cantedit").attr("disabled","disabled");
    });
	//新增的帖子管理
	$('.content-left ul>li.post_manage a[tag=post_manage]').click(function(e) {
		location.hash='post_manage';
		$(".post_manage_box").show();
		$(".wait_pass_box").hide();
		getwaitTieNum();
		getColumnTieNum();//获取专栏帖子数
		$(".post_search input").val("");
		$(".allColumnNum ").removeClass("on");
		$(".post_search  .choose_post .on").removeClass("on");
		postInfo();
    });
	//热度权重比配置
	$('.content-left ul>li.heat_weight_manage a').click(function(e) {
		getWeightChange();
		location.hash='heat_weight_manage';
		$(".heat_weight_box .editable").attr("contenteditable",false);
		$(".heat_weight_box .edit_over").val("编辑").removeClass("edit_over");
    });
	//南瓜达人认证管理
	$('.content-left ul>li.pumpkin_person_approve_manage a').click(function(e) {
		location.hash='pumpkin_person_approve_manage';
		loadTestListPage();
    });
	//美妆线下服务管理——企业上门美妆服务
	$('.content-left ul>li.beauty_line_service_manages a[tag=beauty_line_service_company_manage]').click(function(e) {
		location.hash='beauty_line_service_company_manage';
		clearEnterpriseSearch();
		loadOfflineServerPage();
		$('.beauty_line_service_company_manage').show();
		
    });
	//美妆线下服务管理——校园美妆课堂
	$('.content-left ul>li.beauty_line_service_manages a[tag=beauty_line_service_school_manage]').click(function(e) {
		location.hash='beauty_line_service_school_manage';
		clearUniversitySearch();
		loadSchollPage();
		$('.beauty_line_service_school_manage').show();
    });
	//电商商品管理
	$('.content-left ul>li.electricity_supplier_mall_manages a[tag=electricity_supplier_goods_manage]').click(function(e) {
		location.hash='electricity_supplier_goods_manage2';
		All_cancel_Fn();
		getItemStatInfo();
		comming_write();
		$('.electricity_supplier_goods_manage,.electricity_father_zong').show();
		$('.electricity_supplier_goods_manage .goods_newCrease_edit').hide();
		getOptionalLabelAndBuyerReading1();
		
    });
	//电商品牌管理
	$('.content-left ul>li.electricity_supplier_mall_manages a[tag=electricity_supplier_branch_manage]').click(function(e) {
		location.hash='electricity_supplier_branch_manage';
		clearesbSearch();
		esbPageDetail();
		$('.electricity_supplier_branch_manage').show();
    });
    //电商物流管理
	$('.content-left ul>li.electricity_supplier_mall_manages a[tag=electricity_goods_delivery_manage]').click(function(e) {
		location.hash='electricity_goods_delivery_manage';
		$('#electricity_goods_delivery_manage').show();
		deliveryDetail();
    });
	//电商购买须知管理
	$('.content-left ul>li.electricity_supplier_mall_manages a[tag=electricity_buy_know_manage]').click(function(e) {
		location.hash='electricity_buy_know_manage';
		$('#electricity_buy_know_manage').show();
		getOptionalLabelAndBuyerReading();
    });
	
	//商品订单管理
	$('.content-left ul>li.electricity_supplier_mall_manages a[tag=shope_order_manage]').click(function(e) {
		location.hash='shope_order_manage';
		$('#shope_order_manage').show();
		loadShopeGetOrderPage();
    });
	
	//商品售后管理
	$('.content-left ul>li.electricity_supplier_mall_manages a[tag=shope_after_sale_manage]').click(function(e) {
		location.hash='shope_after_sale_manage';
		$('#shope_after_sale_manage').show();
		loadShopeAfterSalePage();
    });
	
	//商品评价管理
	$('.content-left ul>li.electricity_supplier_mall_manages a[tag=shope_evaluate_manage]').click(function(e) {
		location.hash='shope_evaluate_manage';
		clearComments();
		getItemComments();
		$('#shope_evaluate_manage').show();
		$('.singleShopComments').hide();
		$('.allShopComments').show();
		$('.lookAll_someManagement').hide();
    });
	//商品参数管理
	$('.content-left ul>li.electricity_supplier_mall_manages a[tag=goods_parameter_management]').click(function(e) {
		location.hash='goods_parameter_management';
		$('#goods_parameter_management').show();
		wefhwihfeu()
    });
	$('.content-left ul>li').not(".guest_column_manage").children("a").click(function(e) {
		$('.order-magement,.total-message').show();
		$('.wb>#'+$(this).attr('tag')).show().siblings().hide();
		$('.order-magement').children('span').html($(this).children('span').html());
		$(this).css({'background':'#08c url(images/menu-active.png) no-repeat right'}).siblings().css('background','#2E363F');
		$(this).parent().siblings().children().css('background','#2E363F');
		$('.user_order_information').hide().removeAttr('userid');
		$('.ddxqq .userid').val('');
    });
	//退出登录
	$('.exit').click('click',function(e) {
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/loginOut',function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				window.location.href = "login.html?v=<%= VERSION %>";
			}else{
				alert(data.data.error);	
			}
		});
    });
	
	//点击添加账户
	$('.spm-add-btn').click(function(e) {
		//清空页面信息
		clearAddUserFn();
		
		$('.spm-add-user').show();
		$('.update-hidden').show();
		$('.systemPersonMangement').hide();
		$('.spm-add-user .spm_related_box').hide();
	});
	
	//点击添加账户里面的”取消“
	$('.spm-add-user .spm-cancle').click(function(e) {
		var r = confirm('确定要取消？？');
		if(r == true){
			//清除systemId
			$('.spm-add-user').removeAttr('sysUserId')
			//清空页面信息
			clearAddUserFn();
			$('.spm-add-user').hide();
			$('.update-hidden').hide();
			$('.systemPersonMangement').show();
		};
	});
	
	function clearAddUserFn(){
		//清空页面信息
		$('.spm-add-user .spm-login-name').val('');
		$('.spm-add-user .spm-login-pwd').val('');
		$('.spm-add-user .spm-login-username').val('');
		$('.spm-add-user .spm-login-tel').val('');
		$('.spm-add-user .spm-login-email').val('');
		$('.spm-add-user .spm-login-address').val('');
		$('.spm-add-user .on-select option:eq(0)').attr('selected','selected');
		$('.spm-add-user .spm-role option:eq(0)').attr('selected','selected');
		$('.message-type input').removeAttr('checked');
		$('.spm-add-user .spm-relatedUserId').val('');
		$('.spm-add-user .spm-relatedNickName').val('');
		$('.spm-add-user .spm-relatedUserRole').val('');
		
	}
	
	var strNum = 0;
	$('.message-type input:eq(0)').live('click',function(e) {
		if(strNum % 2 == 0 && typeof($(this).attr('checked')) != "undefined"){
			$(this).siblings('input').attr('checked','checked');
		}else if(typeof($(this).attr('checked')) != "undefined" && strNum % 2 != 0){//typeof($("#aid").attr("rel"))=="undefined"
			$(this).siblings('input').attr('checked','checked');
		}else{
			$(this).siblings('input').removeAttr('checked');
		}
		strNum ++;
    });
	
	//点击除了“全部通知”以外的其它通知类型，取消全部通知选中状态
	$('.message-type input:gt(0)').live('click',function(e) {
        $('.message-type input:eq(0)').removeAttr('checked');
    });
	
	//判断，点击“保存”按钮是“添加账户”，还是更新账户
	$('.spm-add-user .spm-save').click(function(e) {
		console.log('updateStr++++++++'+updateStr);
		//获取所有被选中的短信接收类型
		var str = '';
		$('.message-type input:checked').each(function() {
			if($(this).attr('smsTypeId') == 1){
				str = 1+' ';	
				return false;
			}else{
				str += $(this).attr('smsTypeId')+',';
			}
        });
		var strEnd = str.substring(0,str.length-1);
		
		//拆分原有的短信接收类型
		var oldArr='';
		if(updateStr != null){
			oldArr = updateStr.split(',');
		}else{
			oldArr = '';
		}
		var newArr = strEnd.split(',');
		console.log('oldArr+++++++++'+oldArr);
		console.log('newArr+++++++++'+newArr);
		
		//获取删除的短信接收类型
		var oldStr = '';
		for(var x =0; x < oldArr.length; x ++){
			if(newArr.indexOf(oldArr[x]) == -1){
				oldStr += oldArr[x] + ',';
			}	
		}
		var deleteSmsTypeIds = oldStr.substring(0,oldStr.length -1);
		
		//获取新增的短信接收类型
		var newStr = '';
		for(var x =0; x < newArr.length; x ++){
			if(oldArr.indexOf(newArr[x]) == -1){
				newStr += newArr[x] + ',';
			}	
		}
		var addSmsTypeIds = newStr.substring(0,newStr.length -1);
		
		var dataContent = {
			username:$.trim($('.spm-add-user .spm-login-name').val()),
			password:$.trim($('.spm-add-user .spm-login-pwd').val()),
			employeeName:$.trim($('.spm-add-user .spm-login-username').val()),
			phoneNum:$.trim($('.spm-add-user .spm-login-tel').val()),
			email:$.trim($('.spm-add-user .spm-login-email').val()),
			address:$.trim($('.spm-add-user .spm-login-address').val()),
			enable:$(".spm-add-user input[name='status']:checked").val(),
			cityId:$('.spm-add-user .on-select option:selected').attr('cityid'),
			roleId:$('.spm-add-user .spm-role option:selected').attr('roleid'),
			sysUserId:$('.spm-add-user').attr('sysUserId'),
			addSmsTypeIds:addSmsTypeIds,
			deleteSmsTypeIds:deleteSmsTypeIds,
			relatedUserId:$(".spm-add-user .spm-relatedUserId").val()
		}
		if($.trim($('.spm-add-user .spm-login-name').val()).length == 0){
			alert('请填写登录名!!');
		}else if($.trim($('.spm-add-user .spm-login-name').val()).length < 6 && $.trim($('.spm-add-user .spm-login-name').val()).length < 50){
			alert('登录名要控制在6~50个字符!!');	
		}else if($.trim($('.spm-add-user .spm-login-username').val()).length == 0){
			alert('请填写用户姓名!!');	
		}else if($.trim($('.spm-add-user .spm-login-username').val()).length > 20){
			alert('填写的用户姓名长度要限制在1~20个字符内!!');	
		}else{
			if(typeof($('.spm-add-user').attr('sysUserId')) != "undefined"){
				//更新人员
				var r = confirm('确定要保存？？');
				if(r == true){
					$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysuser/updateUser/2.5.6',dataContent,function(data){
						var data = $.parseJSON(data);
						if(data.code == 0){
							alert('更新成功！！');	
							//清除systemId
							$('.spm-add-user').removeAttr('sysUserId')
							$('.spm-add-user').hide();
							loadPersonManagementPage();
							$('.systemPersonMangement').show();
						}
						if(data.code == 1){
							alert(data.data.error);
						}
					});
				}
			}else{
				if($.trim($('.spm-add-user .spm-login-pwd').val()).length == 0){
					alert('请输入初始化密码!!');
				}else if($.trim($('.spm-add-user .spm-login-pwd').val()).length < 6 && $.trim($('.spm-add-user .spm-login-pwd').val()).length < 50){
					alert('初始化密码要控制在6~50个字符!!');	
				}else{
					//添加人员
					var r = confirm('确定要保存？？');
					if(r == true){
						$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysuser/addUser/2.5.6',dataContent,function(data){
							var data = $.parseJSON(data);
							if(data.code == 0){
								alert('添加成功！！');
								$('.spm-add-user').hide();
								loadPersonManagementPage();
								$('.systemPersonMangement').show();
							}
							if(data.code == 1){
								alert(data.data.error);
							}
						});	
					}
				}			
			}
		}
	});
	
	//点击“人员管理”里面的“编辑”按钮
	$('.spm-table .spm-edit').unbind('click');
	$('.spm-table .spm-edit').live('click',function(){
		//清空页面信息
		clearAddUserFn();
		$('.spm-add-user').show();
		$('.update-hidden').hide();
		$('.systemPersonMangement').hide();
		$('.spm-add-user .spm_related_box').show();
		//数据回显
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysuser/getUserInfo/2.5.6',{sysUserId:$(this).parent().parent().children('td:eq(0)').html()},function(data){
			var data = $.parseJSON(data);
			$('.spm-add-user').attr('sysUserId',data.data.sysUserId);       //把人员id添加到回显的窗体内
			$('.spm-add-user .spm-login-name').val(data.data.username);    //登录名
			$('.spm-add-user .spm-login-username').val(data.data.employeeName);//用户名
			$('.spm-add-user .spm-login-tel').val(data.data.phoneNum);     //电话
			$('.spm-add-user .spm-login-email').val(data.data.email);   //邮箱
			$('.spm-add-user .spm-login-address').val(data.data.address); //地址
			
			$('.spm-add-user .spm-relatedUserId').val(data.data.relatedUserId);     //电话
			$('.spm-add-user .spm-relatedNickName').val(data.data.relatedNickName);   //邮箱
			$('.spm-add-user .spm-relatedUserRole').val(data.data.relatedUserRole); //地址
			console.log(data.data.smsTypeIds);
			updateStr = data.data.smsTypeIds;
			
			//回显运营短信接收类型
			//获取选中的运营短信接收类型编号
			if(data.data.smsTypeIds != null){
				var array = data.data.smsTypeIds.split(',');
				for(var x = 0; x < array.length; x ++){
					getArrayFn(array[x]);	
				}
			};
			
			//获取每个被选中的值
			function getArrayFn(arr){
				$('.message-type input').each(function(e){
					if($(this).attr('smsTypeId') == arr){
						$(this).attr('checked','checked');
				    }else if(arr == 1){
						$(this).attr('checked','checked');	
					}
				});
			}
		});
		//回显禁用状态
		var enabled = $(this).parent().parent().children('td:eq(8)').attr('enable'); 
		$('.spm-add-user input:radio').each(function(e){
			if($(this).val() == enabled){
			  $(this).attr('checked','checked');
		   }
	    });
		//回显城市
	    var cityname =$(this).parent().parent().children('td:eq(6)').attr('cityname');	
		$('.spm-add-user .on-select option').each(function() {
			if($(this).html() == cityname){
				$(this).attr('selected','selected');
			}
		});
		//角色回显
	    var rolename =$(this).parent().parent().children('td:eq(7)').html();	
		$('.spm-add-user .spm-role option').each(function() {
			if($(this).html() == rolename){
				$(this).attr('selected','selected');
			}
		});
	});
	
	// 点击“人员管理”里面的“搜索"按钮
	$('.systemPersonMangement .spm-search-btn').click(loadPersonManagementPage);
	
	//点击“人员管理”里面的“全部取消”按钮
	$('.systemPersonMangement .spm-cancle-btn').click(function(e) {
        $('.systemPersonMangement .spm-name').val('');
        $('.systemPersonMangement .spm-username').val('');
    });
		
	//点击”系统管理“
	$('.systemMangement[name=system-mangement]').change(function(e) {
		//改变系统管理里面的选项对应的右侧选项变更
		$('.mine-message option:first').attr('selected','selected');
		
		//人员管理
		if($(this).val() == 1){
			$('.systemPersonMangement').show();
			$('.systemRoleManagement').hide();
			$('.weight-box').hide();
			$('.edit-mine-message').hide();
			$('.modify-mine-message').hide();
			$('.modify-pwd').hide();
			$('.srm-select-competence').hide();
			$('.srm-select-menu').hide();
			$('.order-magement span').html('人员管理');
			
			//获取运营短信接收类型
			$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/common/getSmsTypes',function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					//清空原有数据
					$('.message-type').children().remove();
					for(var x = 0; x < data.data.length; x ++){
						$('.message-type').append('<input type="checkbox" smsTypeId="'+data.data[x].smsTypeId+'" /><label for="">'+data.data[x].typeDesc+'</label><br /><br />');
					}
				}
				if(data.code == 1){
					alert(data.data.error);	
				}
			});
			
			//获取人员管理数据
			loadPersonManagementPage();
			
			//获取“人员管理”里面的“城市”
			$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/common/getCitys',function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					//清空原有的
					$('.systemPersonMangement .on-select option:gt(0)').remove();
					$('.spm-add-user .on-select option:gt(0)').remove();
					
					for(var x = 0; x < data.data.length; x ++){
						$('.systemPersonMangement .on-select').append('<option cityid='+data.data[x].cityId+'>'+data.data[x].cityName+'</option>');	
						$('.spm-add-user .on-select').append('<option cityid='+data.data[x].cityId+'>'+data.data[x].cityName+'</option>');	
					}
				};
				if(data.code == 1){
					alert(data.data.error);	
				}
			});
			
			//获取“人员管理”里面的“角色”
			$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/common/getRoles',function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					//清空原有的
					$('.systemPersonMangement .role-select option:gt(0)').remove();
					$('.spm-add-user .spm-role option:gt(0)').remove();
					
					for(var x = 0; x < data.data.length; x ++){
						$('.systemPersonMangement .role-select').append('<option role='+data.data[x].roleId+'>'+data.data[x].roleName+'</option>');	
						$('.spm-add-user .spm-role').append('<option roleid='+data.data[x].roleId+'>'+data.data[x].roleName+'</option>');	
					}
				};
				if(data.code == 1){
					alert(data.data.error);	
				}
			});
		}		
		
		//角色管理
		if($(this).val() == 2){
			$('.systemPersonMangement').hide();
			$('.systemRoleManagement').show();
			$('.weight-box').hide();
			$('.edit-mine-message').hide();
			$('.modify-mine-message').hide();
			$('.modify-pwd').hide();
			$('.srm-select-menu').hide();
			$('.order-magement span').html('角色管理');
			$('.spm-add-user').hide();
			//初始化角色管理数据
			getRolerList();
		}
	});
	//获得角色管理列表
	function getRolerList(){
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysrole/getRoles',function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					var usestatus='';
					$('.srm-table tbody tr:gt(0)').remove();
					for(var x = 0; x < data.data.length; x ++){
						if(data.data[x].enable == 1){
							usestatus='<input type="button" value="禁用" class="redbtn1 weatherUse" status="0" roleId='+data.data[x].id+'>';
						}else{
							usestatus='<input type="button" value="启动" class="bluebtn1 weatherUse" status="1" roleId='+data.data[x].id+'>';
						}
						$('.srm-table tbody').append('<tr><td>'+data.data[x].id+'</td><td>'+data.data[x].roleName+'</td><td>'+data.data[x].roleDesc+'</td><td>'+usestatus+'<input type="button" value="编辑" class="bluebtn1 editRoler" roleId='+data.data[x].id+'></td><td><a href="javascript:;" style="text-decoration:underline;" class="srm-set-competence" isSuper='+data.data[x].isSuper+' roleId='+data.data[x].id+'>设置权限</a></td><td><a href="javascript:;" style="text-decoration:underline;" class="srm-set-menu" isSuper='+data.data[x].isSuper+' menuid='+data.data[x].id+'>设置菜单</a></td></tr>');	
					}
				};
				if(data.code == 1){
					alert(data.data.error);
				};
			});
	}
	//点击“角色管理”里面的”添加
	$('.systemRoleManagement .addNewRoler').unbind('click');
	$('.systemRoleManagement .addNewRoler').live('click',function(){
		clearRolerBoxMessage();
		$(".systemRoleManagement").hide();
		$(".roler_create").show();		
	});
	//点击“角色管理”里面的”编辑
	$('.srm-table .editRoler').unbind('click');
	$('.srm-table .editRoler').live('click',function(){
		var sysUserId = $(this).attr("roleId");
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysrole/getRoleInfo/2.5.4',{roleId:sysUserId},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				clearRolerBoxMessage();
				$(".systemRoleManagement").hide();
				$(".roler_create").show();
				$(".roler_create").attr("roleId",data.data.id);
				$(".roler_create .roleCode").val(data.data.roleCode);
				$(".roler_create .roleName").val(data.data.roleName);
				$(".roler_create .roleDesc").val(data.data.roleDesc);
			};
			if(data.code == 1){
				alert(data.data.error);
			};
		});
	});
	//清除数据
	function clearRolerBoxMessage(){
		$(".roler_create .roleCode").val("");
		$(".roler_create .roleName").val("");
		$(".roler_create .roleDesc").val("");
		$(".roler_create").removeAttr("roleId");
	};
	//点击“角色管理”里面的”保存
	$('.roler_create .rolerSave').unbind('click');
	$('.roler_create .rolerSave').live('click',function(){
		var sysUserId = $(".roler_create").attr("roleId");
		var r = confirm('确定要保存？？？');
		if(r == true){
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysrole/saveRole/2.5.4',{roleId:sysUserId,roleCode:$('.roler_create .roleCode').val(),roleName:$('.roler_create .roleName').val(),roleDesc:$('.roler_create .roleDesc').val()},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$(".systemRoleManagement").show();
				$(".roler_create").hide();
				getRolerList();
			};
			if(data.code == 1){
				alert(data.data.error);
			};
		});
	}
	});
	//点击“角色管理”里面的”返回
	$('.roler_create .rolerBack').unbind('click');
	$('.roler_create .rolerBack').live('click',function(){
		$(".systemRoleManagement").show();
		$(".roler_create").hide();
		getRolerList();	
	});
	//点击“角色管理”里面的”禁用启动
	$('.srm-table .weatherUse').unbind('click');
	$('.srm-table .weatherUse').live('click',function(){
		if($(this).hasClass("redbtn1")){
			var r = confirm('确定要禁用??');
		}else{
			var r = confirm('确定要启动??');
		}
		if(r == true){
			var jinyong = $(this);
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysrole/changeRoleStatus/2.5.4',{roleId:$(this).attr("roleId"),status:$(this).attr('status')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					if(jinyong.hasClass("redbtn1")){
						jinyong.val("启动");
						jinyong.removeClass("redbtn1").addClass("bluebtn1");
						jinyong.attr('status',"1");
					}else{
						jinyong.val("禁用");
						jinyong.removeClass("bluebtn1").addClass("redbtn1");
						jinyong.attr('status',"0")
					}
				};
				if(data.code == 1){
					alert(data.data.error);
				};
			});
		};
	});
	//点击“人员管理”里面的”禁用
	$('.spm-table .spm-disenable').unbind('click');
	$('.spm-table .spm-disenable').live('click',function(){
		var sysUserId = $(this).parent().parent().children('td:eq(0)').html();
		var r = confirm('确定要禁用??');
		if(r == true){
			var jinyong = $(this);
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysuser/setUserEnable',{sysUserId:sysUserId,enable:$(this).attr('enableid')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					jinyong.hide();
					jinyong.next().show();
				};
				if(data.code == 1){
					alert(data.data.error);
				};
			});
		};
	});
	
	//点击“人员管理”里面的”启用
	$('.spm-table .spm-enable').unbind('click');
	$('.spm-table .spm-enable').live('click',function(){
		var sysUserId = $(this).parent().parent().children('td:eq(0)').html();
		var r = confirm('确定要启用??');
		if(r == true){
			var qiyong = $(this);
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysuser/setUserEnable',{sysUserId:sysUserId,enable:$(this).attr('enableid')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					qiyong.hide();
					qiyong.prev().show();
				};
				if(data.code == 1){
					alert(data.data.error);
				};
			});
		};
	});
	
	//存储默认选中的权限id
	var resids = '';
	//点击”角色管理“里面的”设置权限“
	$('.srm-set-competence').unbind('click');
	$('.srm-set-competence').live('click',function(e) {	
		$(".manageThisUrls").removeClass("manageThisUrls");
		$(this).addClass("manageThisUrls");
		$('.srm-select-competence .srm-desc').val('');
		$('.srm-select-competence .srm-url').val('');
		//var temp = '';
		$('.systemRoleManagement').hide();
		$('.srm-select-competence').show();
		//存储issuper,roleid
		$('.srm-select-competence').attr('isSuper',$(this).attr('isSuper'));
		$('.srm-select-competence').attr('roleid',$(this).attr('roleid'));
		UrlsPageNumInfo($(this));
	});

//设置权限渲染数据
function getResUrlsDetail(data){
	$('.srm-competence-table tbody tr:gt(0)').remove();
	for(var x = 0; x < data.data.pageData.length; x ++){					
		//判断是否为通用接口
		//否
		var str='';
		var common='';
		if(data.data.pageData[x].isCommon == 0){
			common='否';
		}else{
			common='是';
		}
		//当前角色是否有该URL资源的访问权限(否)
		if(data.data.pageData[x].hasPrivilege == 0){
			if(data.data.pageData[x].canAddOrDel == 0){
				str='';
			}else{
				str='<input type="button" value="添加权限" class="bluebtn1 resManage" roleId="'+$(".srm-select-competence").attr("roleId")+'" resId="'+data.data.pageData[x].resId+'" status="1">';
			};
			$('.srm-competence-table tbody').append('<tr><td>'+data.data.pageData[x].resId+'</td><td>'+data.data.pageData[x].resUrl+'</td><td>'+data.data.pageData[x].resDesc+'</td><td>'+common+'</td><td>'+str+'</td></tr>');	
		};
		//当前角色是否有该URL资源的访问权限(是)
		if(data.data.pageData[x].hasPrivilege == 1){
			if(data.data.pageData[x].canAddOrDel == 0){
				str='';
			}else{
				str='<input type="button" value="删除权限" class="redbtn1 resManage" roleId="'+$(".srm-select-competence").attr("roleId")+'" resId="'+data.data.pageData[x].resId+'" status="0">';
			};
			$('.srm-competence-table tbody').append('<tr><td>'+data.data.pageData[x].resId+'</td><td>'+data.data.pageData[x].resUrl+'</td><td>'+data.data.pageData[x].resDesc+'</td><td>'+common+'</td><td>'+str+'</td></tr>');
		};
	}
}	
//根据不同的页码来渲染页面
function onclickUrlsPageNum(p){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysrole/getResUrls/2.5.4',
		type : 'get',
		dataType : 'json',
		data: {page:p,num:20,roleId:$(".manageThisUrls").attr("roleId")},
		success : function(data){	
			getResUrlsDetail(data);	
		},
	});
}	
//获取入参，渲染页面
function UrlsPageNumInfo(del){
	//获取入参
	var data = labelColumnData();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysrole/getResUrls/2.5.4',
		type : 'get',
		dataType : 'json',
		data: {page:0,num:20,roleId:$(".manageThisUrls").attr("roleId"),resDesc:$('.srm-select-competence .srm-desc').val(),resUrl:$('.srm-select-competence .srm-url').val()},
		success : function(data){
			if(data.code == 0){
			//创建分页
			$(".srm-select-competence .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:onclickUrlsPageNum
			});
			//渲染页面
			getResUrlsDetail(data);
			}else{
				alert(data.data.error);
			}
		},
	});
}	

//角色管理里面的添加或删除权限
	$('.srm-competence-table .resManage').unbind('click');
	$('.srm-competence-table .resManage').live('click',function(e) {
			addOrDelRes($(this));
	});
	function addOrDelRes(del){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysrole/changeResPrivileges/2.5.4',
		type : 'post',
		dataType : 'json',
		data: {roleId:del.attr("roleId"),resId:del.attr("resId"),status:del.attr("status")},
		success : function(data){
			if(data.code == 0){
				if(del.hasClass("redbtn1")){
						del.val("添加权限");
						del.removeClass("redbtn1").addClass("bluebtn1");
						del.attr('status',"1");
					}else{
						del.val("删除权限");
						del.removeClass("bluebtn1").addClass("redbtn1");
						del.attr('status',"0")
					}
			}else{
				alert(data.data.error);
			}
		},
	});
}
	
	//存储默认选中的菜单项
	//var menus = '';
	//点击”角色管理“里面的”设置菜单“
	$('.srm-set-menu').unbind('click');
	$('.srm-set-menu').live('click',function(e) {
		$('.srm-select-menu').attr('isSuper',$(this).attr('isSuper'));
		$('.srm-select-menu').attr('menuid',$(this).attr('menuid'));
		$('.systemRoleManagement').hide();
		$('.srm-select-menu').show();
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysrole/getMenus/2.5.4',{roleId:$(this).attr('menuid')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				//清空之前加载的数据
				$('.srm-select-menu .srm-menu-table tbody tr:gt(0)').remove();
				for(var x =0; x < data.data.length; x ++){
					//判断当前角色登录后是否有该菜单
					//没有
					var str='';
					if(data.data[x].hasPrivilege == 0){
						if(data.data[x].canAddOrDel == 0){
							str='';
						}else{
							str='<input type="button" value="添加菜单" class="bluebtn1 changeMenu" roleId="'+$(".srm-select-menu").attr("menuid")+'" menuId="'+data.data[x].menuId+'" status="1">';
						};
						$('.srm-select-menu .srm-menu-table tbody').append('<tr><td>'+data.data[x].menuId+'</td><td>'+data.data[x].menuUrl+'</td><td>'+data.data[x].menuName+'</td><td>'+str+'</td></tr>');	
					}
					//有
					if(data.data[x].hasPrivilege == 1){
						if(data.data[x].canAddOrDel == 0){
							str='';
						}else{
							str='<input type="button" value="删除菜单" class="redbtn1 changeMenu" roleId="'+$(".srm-select-menu").attr("menuid")+'" menuId="'+data.data[x].menuId+'" status="0">';
						};
						$('.srm-select-menu .srm-menu-table tbody').append('<tr><td>'+data.data[x].menuId+'</td><td>'+data.data[x].menuUrl+'</td><td>'+data.data[x].menuName+'</td><td>'+str+'</td></tr>');
						
					}
				}
				
			}
			
			if(data.code == 1){
				alert(data.data.error);	
			}
		});
	});
	//添加删除菜单
	//角色管理里面的添加或删除权限
	$('.srm-menu-table .changeMenu').unbind('click');
	$('.srm-menu-table .changeMenu').live('click',function(e) {
			changeMenuPrivileges($(this));
	});
	function changeMenuPrivileges(del){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysrole/changeMenuPrivileges/2.5.4',
		type : 'post',
		dataType : 'json',
		data: {roleId:del.attr("roleId"),menuId:del.attr("menuId"),status:del.attr("status")},
		success : function(data){
			if(data.code == 0){
				if(del.hasClass("redbtn1")){
						del.val("添加菜单");
						del.removeClass("redbtn1").addClass("bluebtn1");
						del.attr('status',"1");
					}else{
						del.val("删除菜单");
						del.removeClass("bluebtn1").addClass("redbtn1");
						del.attr('status',"0")
					}
			}else{
				alert(data.data.error);
			}
		},
	});
}
		
	//点击”角色权限“里面的”设置权限“里面的"取消”按钮
	$('.ssc-btn-menu-cancle').click(function(e) {
		$('.srm-select-competence').hide();
		$('.srm-select-menu').hide();
		$('.systemRoleManagement').show();
	});
	
	//点击”角色权限“里面的”设置菜单“里面的"取消”按钮
	$('.ssc-btn-cancle').click(function(e) {
		$('.srm-select-menu').hide();
		$('.srm-select-competence').hide();
		$('.systemRoleManagement').show();
		$('.srm-competence-table tbody tr:gt(0)').remove();
	});
	
	//点击”个人中心“
	$('.mine-message[name=mine-center]').change(function(e) {
		//个人中心
		if($(this).val() == 1){
			//获取个人信息
			getPersonInFn();
			$('.systemPersonMangement').hide();
			$('.systemRoleManagement').hide();
			$('.weight-box').hide();
			$('.edit-mine-message').show();
			$('.srm-select-competence').hide();
			$('.systemMangement option:first').attr('selected','selected');
		}
	});
	
	
	//点击“个人中心”里面的“编辑个人信息”按钮
	$('.emm-edit-btn').click(function(e) {
		$('.edit-mine-message').hide();
		$('.modify-mine-message').show();
		
		//数据回显
		//登录名
		$('.modify-login-name').html($(this).parent().children('.login-name').html());
		//姓名
		$('.modify-name').val($(this).parent().children('.login-name-pin').html());
		//手机号
		$('.modify-tel').val($(this).parent().children('.login-tel').html());
		//邮箱
		$('.modify-email').val($(this).parent().children('.login-email').html());
		//地址
		$('.modify-address').val($(this).parent().children('.login-address').html());
	});
	
	//点击“个人中心”里面的“保存”按钮
	$('.modify-edit-save').click(function(e) {
        $.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/personal/updatePersonalInfo',{employeeName:$.trim($('.modify-name').val()),phoneNum:$.trim($('.modify-tel').val()),email:$.trim($('.modify-email').val()),address:$.trim($('.modify-address').val())},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				alert('更新成功！！');	
				window.location.reload();
			}
			
			if(data.code == 1){
				alert(data.data.error);
			}
		});
    });
	
	//清空修改密码里面的文本信息
	function clearModifyPwdFn(){
		$('.modify-pwd .mp-new-pwd').val('');
		$('.modify-pwd .mp-new-pwd-again').val('');
		$('.modify-pwd .mp-old-pwd').val('');
	}
	
	//点击“个人中心”里面的”个人信息”里面的“取消”按钮
	$('.modify-edit-cancle').click(function(e) {
		$('.modify-mine-message').hide();
		$('.edit-mine-message').show();
	});
	
	//点击“个人中心“里面的”修改密码“按钮
	$('.emm-edit-pwd').click(function(e) {
		$('.edit-mine-message').hide();
		$('.modify-pwd').show();
	});
	
	//点击“个人中心”里面的“修改密码”里面的“保存”按钮
	$('.modify-pwd .mp-save').click(function(e) {
		if($.trim($('.modify-pwd .mp-new-pwd').val()) == $.trim($('.modify-pwd .mp-new-pwd-again').val())){
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/personal/updatePassword',{oldPassword:$('.modify-pwd .mp-old-pwd').val(),newPassword:$('.modify-pwd .mp-new-pwd').val()},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					alert('修改成功！！');
					window.location.reload();	
				}
				
				if(data.code == 1){
					alert(data.data.error);
					clearModifyPwdFn();
				}
			});
		}else{
			alert('两次输入不一致，请重新输入！！');	
			clearModifyPwdFn();
		}
    });
	function wefhwihfeu(){
		$(".goods_parameter_div_second_append").html("")
		$.get("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getOptionalProperties/3.1.0",function(data){
			var data=$.parseJSON(data);
			console.log(data)
			
			var str='<tr>'
			for(var i=0;i<data.data.length;i++){
				str+='<td><input class="goods_parameter_div_second_contrl_span_four" disabled="disabled" value="'+data.data[i].name+'"/></td><td class="goods_parameter_div_second_contrl_span_two">'
					for(var j=0;j<data.data[i].values.length;j++){
						str +='<input type="text" name="" value='+data.data[i].values[j].value+' disabled="false" keyid="'+data.data[i].values[j].valueId+'"><img src="./images/remove_one.png" class="i_want_remove_prev">'
					}
					str+='</td><td class="goods_parameter_div_second_contrl_span"><span class="i_want_to_idit" keyId="'+data.data[i].keyId+'">编辑</span><span class="i_want_newcrease">新增</span><span style="color: red" keyid="'+data.data[i].keyId+'" class="i_want_to_remove">删除</span></td></tr>'
			}
			$(".goods_parameter_div_second_append").append(str)
		})
	}
	//点击”个人中心"里面的“修改密码”里面的“取消”按钮
	$('.mp-cancle').click(function(e) {
		$('.modify-pwd').hide();
		$('.edit-mine-message').show();
		clearModifyPwdFn();
	});
	
	//点击左侧列表的时候，顶部系统管理变为默认选中
	$('.content-left ul li').click(function(e) {
        $('.systemMangement option:first').attr('selected','selected');
		$('.mine-message option:first').attr('selected','selected');
		$('.wb').show();
		$('.order-count-table').hide();
    });
	
	//搜索资源
	$('.srm-select-competence .srm-search-btn').click(function(e) {
		UrlsPageNumInfo();
    });
});

//<!----------------------------------------------------------   人员管理开始   -------------------------------------------------------------->
//创建人员管理分页
function createPersonManagementPage(data){
	$(".systemPersonMangement .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getPersonManagementSearchParams();
			params.page = p;
			$('.spm-table>tbody>tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysuser/getUsers/2.5.6',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initPersonManagementPage
			});			
		}
	});
}

//初始化人员管理分页
function initPersonManagementPage(data){
	createPersonManagementPage(data);
	for(var x = 0; x < data.data.pageData.length; x ++){
		//判断账户状态
		//状态为禁用
		if(data.data.pageData[x].enable == 0){
			$('.spm-table').append('<tr><td>'+data.data.pageData[x].sysUserId+'</td><td>'+data.data.pageData[x].username+'</td><td>'+data.data.pageData[x].employeeName+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].email+'</td><td>'+data.data.pageData[x].address+'</td><td cityid='+data.data.pageData[x].cityId+' cityname='+data.data.pageData[x].cityName+'>'+data.data.pageData[x].cityName+'</td><td>'+data.data.pageData[x].roleName+'</td><td>'+data.data.pageData[x].relatedUserId+'</td><td>'+data.data.pageData[x].relatedNickName+'</td><td>'+data.data.pageData[x].relatedUserRole+'</td><td enable='+data.data.pageData[x].enable+'><input type="button" value="禁用" enableid="0" class="spm-disenable" style="padding:5px; background:#bd362f; color:#fff; display:none;" /><input type="button" enableid="1" value="启用" class="spm-enable" style="padding:5px; background:#51a351; color:#fff;" /></td><td><input type="button" value="编辑" class="spm-edit" style="padding:5px; background:#51a351; color:#fff;" /></td></tr>');	
		}
		//状态为启用
		if(data.data.pageData[x].enable == 1){
			$('.spm-table').append('<tr><td>'+data.data.pageData[x].sysUserId+'</td><td>'+data.data.pageData[x].username+'</td><td>'+data.data.pageData[x].employeeName+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].email+'</td><td>'+data.data.pageData[x].address+'</td><td cityid='+data.data.pageData[x].cityId+' cityname='+data.data.pageData[x].cityName+'>'+data.data.pageData[x].cityName+'</td><td>'+data.data.pageData[x].roleName+'</td><td>'+data.data.pageData[x].relatedUserId+'</td><td>'+data.data.pageData[x].relatedNickName+'</td><td>'+data.data.pageData[x].relatedUserRole+'</td><td enable='+data.data.pageData[x].enable+'><input type="button" value="禁用" enableid="0" class="spm-disenable" style="padding:5px; background:#bd362f; color:#fff; " /><input type="button" value="启用" enableid="1" class="spm-enable" style="padding:5px; background:#51a351; color:#fff; display:none;" /></td><td><input type="button" value="编辑" class="spm-edit" style="padding:5px; background:#51a351; color:#fff;" /></td></tr>');	
		}						
	}	
}

//获取人员管理查询参数
function getPersonManagementSearchParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	params.username = $('.systemPersonMangement .spm-name').val();
	params.employeeName = $('.systemPersonMangement .spm-username').val();
	params.cityId = $('.systemPersonMangement .on-select option:selected').attr('cityid');
	params.roleId = $('.systemPersonMangement .role-select option:selected').attr('role');
	return params;
}

//加载人员管理分页数据
function loadPersonManagementPage(){
	$('.spm-table tbody tr:gt(0)').remove();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysuser/getUsers/2.5.6',
		type : 'get',
		dataType : 'json',
		data: getPersonManagementSearchParams(1),
		success : initPersonManagementPage,
	});
}
//<!----------------------------------------------------------   人员管理结束   ----------------------------------------------------------------->

//锚点定位
$(window).load(function() { 
	var href=window.location.href;
	if(href.indexOf("user_management")!=-1){				//用户管理
		$('.content-left ul>li:eq(1) a').click() 
	}else if(href.indexOf("dresser_management")!=-1){		//化妆师管理
		$('.content-left ul>li:eq(2) a').click() 
	}else if(href.indexOf("work_management")!=-1){			//作品管理
		$('.content-left ul>li:eq(3) a').click() 
	}else if(href.indexOf("banner_management")!=-1){		//banner管理
		$('.content-left ul>li:eq(4) a').click() 
	}else if(href.indexOf("push_management")!=-1){			//官方其他推送管理
		$('.message_manages a').show();
		$('.content-left ul>li a[tag=sysmessage_manage]').click() 
	}else if(href.indexOf("single_message_manage")!=-1){    //官方个推推送管理
		$('.message_manages a').show();
		$('.content-left ul>li a[tag=single_message_manage]').click() 
	}else if(href.indexOf("cash_management")!=-1){			//提现管理
		$('.content-left ul>li:eq(6) a').click() 
	}else if(href.indexOf("complaints_management")!=-1){	//订单投诉管理
		$('.content-left ul>li:eq(7) a').click() 
	}else if(href.indexOf("feedback_management")!=-1){		//反馈意见管理
		$('.content-left ul>li:eq(8) a').click() 
	}else if(href.indexOf("normal_management")!=-1){		//普通邀请码管理
		$('.invitecode a').show();
		$('.content-left ul>li a[tag=normal_invite_manage]').click() 
	}else if(href.indexOf("superInvite_management")!=-1){	//超级邀请码管理
		$('.invitecode a').show();
		$('.content-left ul>li a[tag=super_invite_manage]').click() 
	}else if(href.indexOf("randomInvite_management")!=-1){	//随机邀请码管理
		$('.invitecode a').show();
		$('.content-left ul>li a[tag=random_invite_manage]').click() 
	}else if(href.indexOf("ziXun_management")!=-1){			//资讯管理
		$('.content-left ul>li:eq(10) a').click() 
	}else if(href.indexOf("xwc_management")!=-1){			//美妆下午茶管理
		$('.content-left ul>li:eq(11) a').click() 
	}else if(href.indexOf("xwcOrder_management")!=-1){		//美妆下午茶订单管理
		$('.content-left ul>li:eq(12) a').click() 
	}else if(href.indexOf("complaintZixun_management")!=-1){//投诉/咨询管理
		$('.content-left ul>li:eq(13) a').click() 
	}else if(href.indexOf("smmzTopics_management")!=-1){	//上门美妆推荐专题管理
		$('.content-left ul>li:eq(14) a').click() 
	}else if(href.indexOf("ad_management")!=-1){			//广告管理
		$('.content-left ul>li:eq(15) a').click() 
	}else if(href.indexOf("allCommends_management")!=-1){	//全部评论管理
		$('.content-left ul>li:eq(16) a').click() 
	}else if(href.indexOf("tie_management")!=-1){			//帖子管理
		$('.content-left ul>li.column_manage a').click()
	}else if(href.indexOf("goods_management")!=-1){			//商品管理
		$('.content-left ul>li.goods_manage a').click()
	}else if(href.indexOf("riqian_management")!=-1){	    //日签管理
		$('.content-left ul>li.riqian_manage a').click()    
	}else if(href.indexOf("free_trial_manage")!=-1){	    //妆品试用活动管理
		$('.content-left ul>li.free_trial_manage a').click()  
	}else if(href.indexOf("points_mall_management")!=-1){	//积分商城管理
		$('.content-left ul>li.points_mall_manage a').click()  
	}else if(href.indexOf("lottery_activity_manage")!=-1){	//抽奖活动管理
		$('.content-left ul>li.lottery_activity_manage a').click() 
	}else if(href.indexOf("goods_column_manage")!=-1){	//商品专栏管理
		$('.content-left ul>li.goods_column_manage a').click()  
	}else if(href.indexOf("guest_column_manage")!=-1){	//客座小编
		$('.content-left ul>li.guest_column_manage a').click(); 
	}else if(href.indexOf("index_nav_manage")!=-1){		//导航控制管理
		$('.h5_index_manages a').show();
		$('.content-left ul>li a[tag=index_nav_manage]').click() 
	}else if(href.indexOf("index_list_manage")!=-1){	//列表控制管理
		$('.h5_index_manages a').show();
		$('.content-left ul>li a[tag=index_list_manage]').click() 
	}else if(href.indexOf("community_freetrail_manage_a")!=-1){		//免费试用管理
		$('.pumpkin_community_manage a').show();
		$('.content-left ul>li a[tag=community_freetrail_manage_a]').click() 
	}else if(href.indexOf("community_activity_manage_a")!=-1){	//社团活动管理
		$('.pumpkin_community_manage a').show();
		$('.content-left ul>li a[tag=community_activity_manage_a]').click() 
	}else if(href.indexOf("community_hottopic_manage")!=-1){		//热门话题管理
		$('.pumpkin_community_manage a').show();
		$('.content-left ul>li a[tag=community_hottopic_manage]').click() 
	}else if(href.indexOf("community_label_manage")!=-1){		//帖子标签管理
		$('.pumpkin_community_manage a').show();
		$('.content-left ul>li a[tag=community_label_manage]').click() 
	}else if(href.indexOf("post_manage")!=-1){	//新帖子管理
		$('.content-left ul>li.post_manage a').click() 
	}else if(href.indexOf("heat_weight_manage")!=-1){	//热度权重比配置
		$('.content-left ul>li.heat_weight_manage a').click() 
	}else if(href.indexOf("pumpkin_person_approve_manage")!=-1){//南瓜达人认证管理
		$('.content-left ul>li.pumpkin_person_approve_manage a').click() 
	}else if(href.indexOf("beauty_line_service_company_manage")!=-1){//美妆线下服务管理——企业上门美妆服务
		$('.beauty_line_service_manages a').show();
		$('.content-left ul>li.beauty_line_service_manages a[tag=beauty_line_service_company_manage]').click() 
	}else if(href.indexOf("beauty_line_service_school_manage")!=-1){//美妆线下服务管理——校园美妆课堂
		$('.beauty_line_service_manages a').show();
		$('.content-left ul>li.beauty_line_service_manages a[tag=beauty_line_service_school_manage]').click() 
	}else if(href.indexOf("electricity_supplier_goods_manage")!=-1){//电商管理——商品管理
		$('.electricity_supplier_mall_manages a').show();
		$('.content-left ul>li.electricity_supplier_mall_manages a[tag=electricity_supplier_goods_manage]').click() 
	}else if(href.indexOf("electricity_supplier_branch_manage")!=-1){//电商管理—-品牌管理
		$('.electricity_supplier_mall_manages a').show();
		$('.content-left ul>li.electricity_supplier_mall_manages a[tag=electricity_supplier_branch_manage]').click() 
	}else if(href.indexOf("electricity_goods_delivery_manage")!=-1){//电商管理——商品物流
		$('.electricity_supplier_mall_manages a').show();
		$('.content-left ul>li.electricity_supplier_mall_manages a[tag=electricity_goods_delivery_manage]').click() 
	}else if(href.indexOf("electricity_buy_know_manage")!=-1){//电商管理—-购买须知
		$('.electricity_supplier_mall_manages a').show();
		$('.content-left ul>li.electricity_supplier_mall_manages a[tag=electricity_buy_know_manage]').click() 
	}else if(href.indexOf("shope_order_manage")!=-1){		//商品订单管理
		$('.content-left ul>li.electricity_supplier_mall_manages a[tag=shope_order_manage]').click() 
		$('.electricity_supplier_mall_manages a').show();
	}else if(href.indexOf("shope_evaluate_manage")!=-1){		//商品评价管理
		$('.content-left ul>li.electricity_supplier_mall_manages a[tag=shope_evaluate_manage]').click() 
		$('.electricity_supplier_mall_manages a').show();
	}else if(href.indexOf("shope_after_sale_manage")!=-1){		//商品售后管理
		$('.content-left ul>li.electricity_supplier_mall_manages a[tag=shope_after_sale_manage]').click() 
		$('.electricity_supplier_mall_manages a').show();
	}else if(href.indexOf("goods_parameter_management")!=-1){
		$('.content-left ul>li.electricity_supplier_mall_manages a[tag=goods_parameter_management]').click() 
		$('.electricity_supplier_mall_manages a').show();
	}
	else{
		$('.content-left ul>li:eq(0) a').click();			//订单管理
   }
}); 





// 验证手机号是否正确
function isPhoneNum(phoneNum) {
    var reg = /^1(([3|8|7|5][0-9])|(5[^4|\D]))\d{8}$/;
    return reg.test(phoneNum);
}

