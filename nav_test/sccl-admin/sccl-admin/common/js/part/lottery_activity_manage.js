var testUrl = 'https://testcli.nggirl.com.cn';
$(function(){
	loadLotteryListPage();
	loadLotteryOrderListPage();
	//导出抽奖活动管理订单
	$('.lottery_activity_manage .order_search .import_btn').click(function(e) {
		var strParam = 'awardRecordId='+$(".lam_order_table .order_search .bianhao").val() + '&phoneNum='+$('.lam_order_table .order_search .tel').val() +'&nickName=' + $('.lam_order_table .order_search .nicheng').val() + '&realName='+$('.lam_order_table .order_search .name').val() + '&startTime=' + $('.lam_order_table .order_search .qian').val().replace(/\D/g,'') + '&endTime=' + $('.lam_order_table .order_search .hou').val().replace(/\D/g,'');
		window.location.href = "<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/lottery/exportAwardRecords/2.5.4?" + strParam+'&v=<%= VERSION %>';
		
    });
	
	//点击抽奖活动管理
	$('.lottery_activity_manage .order_num_btn .lam_bianhao_manage').click(function(e) {
        $('.lottery_activity_manage .lam_lottery_table').show();
		$('.lottery_activity_manage .lam_order_table').hide();
		$(".lam_lottery_table .lottery_num").val("");
		$(".lam_lottery_table .lottery_title").val("");
		loadLotteryListPage();
    });
	
	//点击订单管理
	$('.lottery_activity_manage .order_num_btn .lam_order_manage').click(function(e) {
        $('.lottery_activity_manage .lam_order_table').show();
		$('.lottery_activity_manage .lam_lottery_table').hide();
		clearAwardOrderList();
		loadLotteryOrderListPage();
    });
	//搜索
	$('.lam_lottery_table .lam_search_btn').click(function(e) {
		loadLotteryListPage();
    });
	//取消搜索
	$('.lottery_activity_manage .lam_cancle_btn').click(function(e) {
		$(".lam_lottery_table .lottery_num").val("");
		$(".lam_lottery_table .lottery_title").val("");
		loadLotteryListPage();
    });
	//发布活动
	$('.lottery_activity_list .lottery_pub').live('click',function(e) {
		$(".publishOrNot").removeClass("publishOrNot");
		$(this).addClass("publishOrNot");
		var r = confirm('确定发布该活动？？');
		if(r == true){
			publishLottery();
		};	
    });
	//新增活动
	$('.lam_lottery_table .lam_add_activity_btn').live('click',function(e) {
		clearLotteryList();
		$('.lottery_activity_manage .lottery_activity').hide();
		$('.lottery_activity_manage .add_lottery_activity').show();
    });
	//保存活动
	$('.add_lottery_activity .lottery_activity_save').live('click',function(e) {
		addOrEditLottery();
    });
	//点击新增活动里面的取消按钮
	$('.add_lottery_activity .lottery_activity_cancle').click(function(e) {
        $('.lottery_activity_manage .lottery_activity').show();
		$('.lottery_activity_manage .add_lottery_activity').hide();
    });
	//编辑按钮
	$('.lottery_activity_list .lottery_editor').live('click',function(e) {
		$(".editorThisLottery").removeClass("editorThisLottery");
		$(this).addClass("editorThisLottery");
		getLotteryDetail();
    });
	//删除按钮
	$('.lottery_activity_list .lottery_del').live('click',function(e) {
		$(".delThisLottery").removeClass("delThisLottery");
		$(this).addClass("delThisLottery");
		var r = confirm('确定删除该活动？？');
		if(r == true){
			deleteLotteryFn();
		};	
    });
	//奖品管理
	$('.lottery_activity_list .getAward').live('click',function(e) {
		$(".editorThisAward").removeClass("editorThisAward");
		$(this).addClass("editorThisAward");
		getAwardDetail();
	});
	//添加奖品
	$('.gift_manage .gm_shope').live('click',function(e) {
		$(".gift_manage").hide();
		$(".lottery_add_commodity").show();
		clearLotteryAwar();
		$(".lottery_add_commodity").attr("awardType","1");
		$(".lottery_add_commodity .la_name").html("商品名称：");
		$(".lottery_add_commodity .la_num_box").show();
		$(".lottery_add_commodity .la_quan_box").hide();
		$(".lottery_add_commodity .la_img").html("商品图：");
		$(".lottery_add_commodity .la_handimg").html("商品头图：");
		$(".lottery_add_commodity .la_detail").html("商品详细说明：");
		//初始化编辑器
		$('.lottery_add_commodity .editor_content').createArticleEditor({
			elements: ['paragraph','image'],
			data:[{type:2,content:''}],//初始化内容
			defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
		});
    });
	//添加南瓜券
	$('.gift_manage .gm_vouchers').live('click',function(e) {
		$(".gift_manage").hide();
		$(".lottery_add_commodity").show();
		clearLotteryAwar();
		$(".lottery_add_commodity").attr("awardType","2");
		$(".lottery_add_commodity .la_name").html("南瓜券名称：");
		$(".lottery_add_commodity .la_quan").html("南瓜券兑换码：");
		$(".lottery_add_commodity .la_num_box").hide();
		$(".lottery_add_commodity .la_quan_box").show();
		$(".lottery_add_commodity .laac_quan").removeAttr("disabled");
		$(".lottery_add_commodity .la_img").html("南瓜券图：");
		$(".lottery_add_commodity .la_handimg").html("南瓜券头图：");
		$(".lottery_add_commodity .la_detail").html("南瓜券详细说明：");
		//初始化编辑器
		$('.lottery_add_commodity .editor_content').createArticleEditor({
			elements: ['paragraph','image'],
			data:[{type:2,content:''}],//初始化内容
			defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
		});
    });
	//添加第三方优惠券
	$('.gift_manage .gm_three_vouchers').live('click',function(e) {
		$(".gift_manage").hide();
		$(".lottery_add_commodity").show();
		clearLotteryAwar();
		$(".lottery_add_commodity").attr("awardType","3");
		$(".lottery_add_commodity .la_name").html("第三方优惠券名称：");
		$(".lottery_add_commodity .la_num_box").hide();
		$(".lottery_add_commodity .la_quan_box").show();
		$(".lottery_add_commodity .laac_quan").removeAttr("disabled");
		$(".lottery_add_commodity .la_quan").show().html("优惠券兑换码：");
		$(".lottery_add_commodity .la_img").html("优惠券图：");
		$(".lottery_add_commodity .la_handimg").html("优惠券头图：");
		$(".lottery_add_commodity .la_detail").html("优惠券详细说明：");
		//初始化编辑器
		$('.lottery_add_commodity .editor_content').createArticleEditor({
			elements: ['paragraph','image'],
			data:[{type:2,content:''}],//初始化内容
			defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
		});
    });
	//添加谢谢合作
	$('.gift_manage .gm_tanks').live('click',function(e) {
		$(".lottery_add_commodity").attr("awardType","0");
		addOrEditAwardForNone();
    });
	//确认添加奖品
	$('.lottery_add_commodity .la_save').live('click',function(e) {
		addOrEditAward();
    });
	//取消添加奖品
	$('.lottery_add_commodity .la_cancle').live('click',function(e) {
		$(".gift_manage").show();
		$(".lottery_add_commodity").hide();
    });
	//编辑奖品
	$('.gift_manage .gift_table_manage .award_editor').live('click',function(e) {
		$(".editorThisLotteryAward").removeClass("editorThisLotteryAward");
		$(this).addClass("editorThisLotteryAward");
		editorLotteryAwardFn();	
    });
	//删除奖品
	$('.gift_manage .gift_table_manage .award_del').live('click',function(e) {
		$(".delThisLotteryAward").removeClass("delThisLotteryAward");
		$(this).addClass("delThisLotteryAward");
		var r = confirm('确定删除该奖品？？');
		if(r == true){
			deleteLotteryAwardFn();
		};	
    });
	//返回抽奖活动列表页
	$('.gift_manage .gift_manage_back').live('click',function(e) {
		$(".gift_manage").hide();
		$(".lottery_activity").show();
    });
	//订单搜索
	$('.lam_order_table .search_btn').click(function(e) {
		loadLotteryOrderListPage();
    });
	//订单取消搜索
	$('.lam_order_table .cancle_btn').click(function(e) {
		clearAwardOrderList();
		loadLotteryOrderListPage();
    });
	//奖品发货
	$(".deliverAward").live('click',function(){
		$(".deliverThisAward").removeClass("deliverThisAward");
		$(this).addClass("deliverThisAward");
		var r = confirm('确定发货？？');
		if(r == true){
			deliverAwardFn();
		};	
	});
	
	//抽奖活动头图
	$(".lottery_activity_file_toutu_cover").fileupload({
		dataType: 'json',
		done: function (e, data) {
			var w = parseFloat(data.result.data.width);
			var h = parseFloat(data.result.data.height);
			if(w/h != 640.0/320.0){
				alert("上传失败！图片比例应为640*320");
			}else{
				$('#lottery_activity_file_small_cover').attr('src',data.result.data.url);
				$('#lottery_activity_file_small_cover').attr('entend',data.result.data.width+'_'+data.result.data.height);
			};
		}
	});
	//抽奖活动分享小图
	$(".lottery_activity_file_small_cover").fileupload({
		dataType: 'json',
		done: function (e, data) {
			var w = parseFloat(data.result.data.width);
			var h = parseFloat(data.result.data.height);
			if(w/h != 70.0/70.0){
				alert("上传失败！图片比例应为70*70");
			}else{
				$('#lottery_activity_file_cover').attr('src',data.result.data.url);
				$('#lottery_activity_file_cover').attr('entend',data.result.data.width+'_'+data.result.data.height);
			};
		}
	});
	//转盘图片
	$(".lottery_zhuanpan_cover").fileupload({
		dataType: 'json',
		done: function (e, data) {
		  $('#lottery_zhuanpan_cover').attr('src',data.result.data.url);
		  $('#lottery_zhuanpan_cover').attr('entend',data.result.data.width+'_'+data.result.data.height);
		}
	});
	//转盘指针图
	$(".lottery_hand_cover").fileupload({
		dataType: 'json',
		done: function (e, data) {
		  $('#lottery_hand_cover').attr('src',data.result.data.url);
		  $('#lottery_hand_cover').attr('entend',data.result.data.width+'_'+data.result.data.height);	
		}
	});
	//奖品图
	$(".la_commodity_img").fileupload({
		dataType: 'json',
		done: function (e, data) {
			var w = parseFloat(data.result.data.width);
			var h = parseFloat(data.result.data.height);
			if(w/h != 70.0/70.0){
				alert("上传失败！图片比例应为70*70");
			}else{
				$('#la_commodity_img').attr('src',data.result.data.url);
		 		$('#la_commodity_img').attr('entend',data.result.data.width+'_'+data.result.data.height);
			};
		}
	});
	//奖品头图
	$(".la_commodity_head_img").fileupload({
		dataType: 'json',
		done: function (e, data) {
			var w = parseFloat(data.result.data.width);
			var h = parseFloat(data.result.data.height);
			if(w/h != 360.0/240.0){
				alert("上传失败！图片比例应为360*240");
			}else{
				 $('#la_commodity_head_img').attr('src',data.result.data.url);
		 		 $('#la_commodity_head_img').attr('entend',data.result.data.width+'_'+data.result.data.height);	
			};
		 
		}
	});
});
//渲染数据
function lotteryListDetail(data){
	$('.lottery_activity_list tr:gt(0)').remove();
	var str='';
	$.each(data.data.pageData,function(key,val){
		if(val.isPublished == 0){
			str ='<td activityId="'+val.activityId+'"><input type="button" class="bluebtn1 lottery_pub" value="发布"><input type="button" class="bluebtn1 lottery_editor" value="编辑"><input type="button" class="redbtn1 lottery_del" value="删除"></td>';
		}else{
			str ='<td activityId="'+val.activityId+'"><input type="button" class="bluebtn1 lottery_editor" value="编辑"><input type="button" class="redbtn1 lottery_del" value="删除"></td>';
		}
		$('.lottery_activity_list tbody').append('<tr><td>'+val.activityId+'</td><td><img src="'+val.headImg+'" alt="" class="lottery_headImg"/></td><td>'+val.title+'</td><td>'+val.activeTime+'</td><td>'+val.joinedTimes+'</td><td>'+val.maxTimes+'</td>'+str+'<td activityId="'+val.activityId+'"><input type="button" value="奖品管理" class="bluebtn1 getAward"/></td></tr>');
	});	
};
	
//根据不同的页码来渲染页面
function onclickLotteryPageNum(p){
	
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/lottery/getLotteryList/2.5.3',
		type : 'post',
		dataType : 'json',
		data: {page:p,num:20,activityId:$(".lam_lottery_table .lottery_num").val(),title:$(".lam_lottery_table .lottery_title").val()},
		success : function(data){
			lotteryListDetail(data);
		},
	});
};	
//获取入参，渲染页面
function loadLotteryListPage(){
	//获取入参
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/lottery/getLotteryList/2.5.3',
		type : 'post',
		dataType : 'json',
		data: {page:0,num:20,activityId:$(".lam_lottery_table .lottery_num").val(),title:$(".lam_lottery_table .lottery_title").val()},
		success : function(data){
			if(data.code == 0){
			//创建分页
			$(".lam_lottery_table .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:onclickLotteryPageNum
			});
			//渲染页面
			lotteryListDetail(data);
			}else{
				alert(data.data.error);
			}
		},
	});
};
//发布活动
function publishLottery(){
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/lottery/publishLottery/2.5.3',
		type : 'post',
		dataType : 'json',
		data: {activityId:$(".publishOrNot").parent().attr("activityId")},
		success : function(data){
			if(data.code == 0){
				$(".publishOrNot").remove();
			}else{
				alert(data.data.error);
			}
		},
	});
};
//新增保存抽奖活动
function addOrEditLottery(){
	if($.trim($(".add_lottery_activity .ala_title").val()) == ""){
		alert("活动题目不能为空！");
	}else if($.trim($(".add_lottery_activity .ala_content").val()) == ""){
		alert("活动分享内容不能为空！");
	}else if($("#lottery_activity_file_cover").attr('src') == ""){
		alert("分享小图不能为空！");
	}else if($("#lottery_activity_file_small_cover").attr('src') == ""){
		alert("活动头图不能为空！");
	}else if($("#lottery_zhuanpan_cover").attr('src') == ""){
		alert("转盘图片不能为空！");
	}else if($("#lottery_hand_cover").attr('src') == ""){
		alert("指针图片不能为空！");
	}else if($.trim($(".add_lottery_activity .qian").val()) == ""){
		alert("开始时间不能为空！");
	}else if($.trim($(".add_lottery_activity .hou").val()) == ""){
		alert("结束时间不能为空！");
	}else if($.trim($(".add_lottery_activity .lottery_choujiang_num").val()) == ""){
		alert("抽奖次数不能为空！");
	}else if($.trim($(".add_lottery_activity .lottery_everday_num").val()) == ""){
		alert("每人每天免费抽奖次数不能为空！");
	}else if($.trim($(".add_lottery_activity .lottery_once_cost").val()) == ""){
		alert("抽奖一次所需积分不能为空！");
	}else{
		if($(".add_lottery_activity").attr("activityId") != "" && typeof($(".add_lottery_activity").attr("activityId")) != "undefined"){//编辑
			var r = confirm('确定更改该抽奖活动？？');
		}else{
			var r = confirm('确定保存该抽奖活动？？');
		};
		if(r == true){
			var params={activityId:$(".add_lottery_activity").attr("activityId"),title:$(".add_lottery_activity .ala_title").val(),shareContent:$(".add_lottery_activity .ala_content").val(),shareImg:$("#lottery_activity_file_cover").attr('src'),
			headImg:$("#lottery_activity_file_small_cover").attr('src'),rotaryTableImg:$("#lottery_zhuanpan_cover").attr('src'),pointerImg:$("#lottery_hand_cover").attr('src'),
			startTime:$(".add_lottery_activity .qian").val(),endTime:$(".add_lottery_activity .hou").val(),maxTimes:$(".add_lottery_activity .lottery_choujiang_num").val(),dailyFreeTimes:$(".add_lottery_activity .lottery_everday_num").val(),
			costScore:$(".add_lottery_activity .lottery_once_cost").val()};
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/lottery/addOrEditLottery/2.5.3',
				type : 'post',
				dataType : 'json',
				data: params,
				success : function(data){
					if(data.code == 0){
						$('.lottery_activity_manage .lottery_activity').show();
						$('.lottery_activity_manage .add_lottery_activity').hide();
						loadLotteryListPage();
						clearPointsList();
					}else{
						alert(data.data.error);
					};
				},
			});
		};
	};
};
//编辑抽奖活动
function getLotteryDetail(){
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/lottery/getLotteryDetail/2.5.3',
		type : 'get',
		dataType : 'json',
		data: {activityId:$(".editorThisLottery").parent().attr("activityId")},
		success : function(data){
			if(data.code == 0){
				clearPointsList();
				$('.lottery_activity_manage .lottery_activity').hide();
				$('.lottery_activity_manage .add_lottery_activity').show();	
				$(".add_lottery_activity").attr("activityId",data.data.activityId);
				$(".add_lottery_activity .ala_title").val(data.data.title);
				$(".add_lottery_activity .ala_content").val(data.data.shareContent);
				$("#lottery_activity_file_cover").attr('src',data.data.shareImg);
				$("#lottery_activity_file_small_cover").attr('src',data.data.headImg);
				$("#lottery_zhuanpan_cover").attr('src',data.data.rotaryTableImg);
				$("#lottery_hand_cover").attr('src',data.data.pointerImg);
				$(".add_lottery_activity .qian").val(data.data.startTime);
				$(".add_lottery_activity .hou").val(data.data.endTime);
				$(".add_lottery_activity .lottery_choujiang_num").val(data.data.maxTimes);
				$(".add_lottery_activity .lottery_everday_num").val(data.data.dailyFreeTimes);
				$(".add_lottery_activity .lottery_once_cost").val(data.data.costScore);
				$(".add_lottery_activity .lottery_activity_message").val(data.data.rules);
			}else{
				alert(data.data.error);
			};
		},
	});
};
//删除抽奖活动
function deleteLotteryFn(){
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/lottery/deleteLottery/2.5.3',
		type : 'post',
		dataType : 'json',
		data: {activityId:$(".delThisLottery").parent().attr("activityId")},
		success : function(data){
			if(data.code == 0){
				$(".delThisLottery").parent().parent().remove();
			}else{
				alert(data.data.error);
			};
		},
	});
};
//奖品管理
function getAwardDataDetail(data){
	$('.gift_table_manage tr:gt(0)').remove();
	$(".lottery_activity").hide();
	$(".gift_manage").show();
	$(".gift_manage").attr('activityId',$(".editorThisAward").parent().attr("activityId"));
	$.each(data.data.pageData,function(key,val){
		if(val.awardType == 0){
			str ='谢谢参与';
		}else if(val.awardType == 1){
			str ='商品';
		}else if(val.awardType == 2){
			str ='南瓜券';
		}else if(val.awardType == 3){
			str ='优惠券';
		}
		if(val.awardType == 0){
			$('.gift_table_manage tbody').append('<tr><td>'+val.awardId+'</td><td>'+str+'</td><td></td><td></td><td></td><td></td><td awardId="'+val.awardId+'"><input type="button" class="redbtn1 award_del" value="删除"></td></tr>');
		}else{
			$('.gift_table_manage tbody').append('<tr><td>'+val.awardId+'</td><td>'+str+'</td><td>'+val.awardName+'</td><td><img src="'+val.awardHeadImg+'" /></td><td><img src="'+val.awardImg+'" /></td><td>'+val.awardNum+'</td><td awardType="'+val.awardType+'" awardId="'+val.awardId+'"><input type="button" class="bluebtn1  award_editor" value="编辑"><input type="button" class="redbtn1 award_del" value="删除"></td></tr>');
		}
	});
};
//根据不同的页码来渲染页面
function getAwardDetailPageNum(p){
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/lottery/getAwardList/2.5.3',
		type : 'get',
		dataType : 'json',
		data: {activityId:$(".editorThisAward").parent().attr("activityId"),page:p,num:20},
		success : function(data){
			getAwardDataDetail(data);
		},
	});
};	
//获取入参，渲染页面
function getAwardDetail(){
	//获取入参
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/lottery/getAwardList/2.5.3',
		type : 'get',
		dataType : 'json',
		data: {activityId:$(".editorThisAward").parent().attr("activityId"),page:0,num:20},
		success : function(data){
			if(data.code == 0){
			//创建分页
			$(".gift_manage .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:getAwardDetailPageNum
			});
			//渲染页面
			getAwardDataDetail(data);
			}else{
				alert(data.data.error);
			}
		},
	});
};
//保存奖品
function addOrEditAward(){
	if($.trim($(".lottery_add_commodity .laac_name").val()) == ""){
		alert("奖品名称不能为空！");
	}else if($.trim($(".lottery_add_commodity  .laac_num").val()) == "" && $(".la_num_box").css("display") != 'none'){
		alert("奖品数量不能为空！");
	}else if($.trim($(".lottery_add_commodity  .laac_quan").val()) == "" && $(".la_quan_box").css("display") != 'none'){
		alert("兑换码不能为空！");
	}else if($(".lottery_add_commodity  #la_commodity_img").attr('src') == ""){
		alert("奖品配图不能为空！");
	}else if($(".lottery_add_commodity  #la_commodity_head_img").attr('src') == ""){
		alert("奖品头图不能为空！");
	}else{
		var content = $('.lottery_add_commodity .editor_content').getArticleEditorData();
		if(!$.isArray(content)){
			alert(content);
			return ;
		}
		//只保留段落和图片
		var finalData = new Array();
		for(var i=0;i<content.length;i++){
			if(content[i].type == 2 || content[i].type == 3 ){
				finalData.push(content[i]);
			}
		}
		var details = JSON.stringify(finalData);
		//console.log(details);
		if($(".lottery_add_commodity").attr("awardId") != "" && typeof($(".lottery_add_commodity").attr("awardId")) != "undefined"){//编辑
			var r = confirm('确定更改该奖品？？');
		}else{
			var r = confirm('确定保存该奖品？？');
		};
		if(r == true){
			var params={activityId:$(".gift_manage").attr("activityId"),awardId:$(".lottery_add_commodity").attr("awardId"),awardType:$(".lottery_add_commodity").attr("awardType"),awardName:$(".lottery_add_commodity .laac_name").val(),
			awardNum:$(".lottery_add_commodity .laac_num").val(),inviteCodes:$(".lottery_add_commodity .laac_quan").val(),awardImg:$(".lottery_add_commodity #la_commodity_img").attr('src'),awardHeadImg:$(".lottery_add_commodity #la_commodity_head_img").attr('src'),awardDetail:details};
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/lottery/addOrEditAward/2.5.3',
				type : 'post',
				dataType : 'json',
				data: params,
				success : function(data){
					if(data.code == 0){
						$(".lottery_add_commodity").hide();
						$(".gift_manage").show();
						getAwardDetail();
						clearLotteryAwar();
						
					}else{
						alert(data.data.error);
					};
				},
			});
		};
	};
};
//添加谢谢合作
function addOrEditAwardForNone(){			
		$.ajax({
		url : testUrl+'/nggirl-web/web/admin/lottery/addOrEditAward/2.5.3',
		type : 'post',
		dataType : 'json',
		data: {activityId:$(".gift_manage").attr("activityId"),awardType:0},
		success : function(data){
			if(data.code == 0){
				getAwardDetail();
			}else{
				alert(data.data.error);
			};
		},
	});
};
//编辑奖品
function editorLotteryAwardFn(){
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/lottery/getAwardDetail/2.5.3',
		type : 'get',
		dataType : 'json',
		data: {awardId:$(".editorThisLotteryAward").parent().attr("awardId")},
		success : function(data){
			if(data.code == 0){
				clearLotteryAwar();
				$(".lottery_add_commodity").show();
				$(".gift_manage").hide();
				if(data.data.awardType == 1){
					$(".lottery_add_commodity .la_num_box").show();
					$(".lottery_add_commodity .la_quan_box").hide();
					$(".lottery_add_commodity").attr("awardType","1");
					$(".lottery_add_commodity .la_name").html("商品名称：");
					$(".lottery_add_commodity .la_num_box").show();
					$(".lottery_add_commodity .la_quan_box").hide();
					$(".lottery_add_commodity .la_img").html("商品图：");
					$(".lottery_add_commodity .la_handimg").html("商品头图：");
					$(".lottery_add_commodity .la_detail").html("商品详细说明：");
				}else if(data.data.awardType == 2){
					$(".lottery_add_commodity .la_num_box").hide();
					$(".lottery_add_commodity .la_quan_box").show();
					$(".lottery_add_commodity").attr("awardType","2");
					$(".lottery_add_commodity .la_name").html("南瓜券名称：");
					$(".lottery_add_commodity .la_quan").html("南瓜券兑换码：");
					$(".lottery_add_commodity .la_num_box").hide();
					$(".lottery_add_commodity .la_quan_box").show();
					$(".lottery_add_commodity .la_img").html("南瓜券图：");
					$(".lottery_add_commodity .la_handimg").html("南瓜券头图：");
					$(".lottery_add_commodity .la_detail").html("南瓜券详细说明：");
				}else if(data.data.awardType ==3){
					$(".lottery_add_commodity .la_num_box").hide();
					$(".lottery_add_commodity .la_quan_box").show();
					$(".lottery_add_commodity").attr("awardType","3");
					$(".lottery_add_commodity .la_name").html("第三方优惠券名称：");
					$(".lottery_add_commodity .la_num_box").hide();
					$(".lottery_add_commodity .la_quan_box").show();
					$(".lottery_add_commodity .la_quan").show().html("优惠券兑换码：");
					$(".lottery_add_commodity .la_img").html("优惠券图：");
					$(".lottery_add_commodity .la_handimg").html("优惠券头图：");
					$(".lottery_add_commodity .la_detail").html("优惠券详细说明：");
				}
				$(".lottery_add_commodity").attr("awardId",data.data.awardId);
				$(".lottery_add_commodity").attr("awardType",data.data.awardType);
				$(".lottery_add_commodity .laac_name").val(data.data.awardName);
				$(".lottery_add_commodity .laac_num").val(data.data.awardNum);
				$(".lottery_add_commodity .laac_quan").val(data.data.inviteCodes);
				$(".lottery_add_commodity .laac_quan").attr("disabled",'true');
				$(".lottery_add_commodity #la_commodity_img").attr('src',data.data.awardImg);
				$(".lottery_add_commodity #la_commodity_head_img").attr('src',data.data.awardHeadImg);
				$('.lottery_add_commodity .editor_content').createArticleEditor({
					elements: ['paragraph','image'],
					data:data.data.awardDetail ,//初始化内容
					defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
				});
			}else{
				alert(data.data.error);
			};
		},
	});
};
//删除活动
function deleteLotteryAwardFn(){
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/lottery/deleteAward/2.5.3',
		type : 'post',
		dataType : 'json',
		data: {awardId:$(".delThisLotteryAward").parent().attr("awardId")},
		success : function(data){
			if(data.code == 0){
				$(".delThisLotteryAward").parent().parent().remove();
			}else{
				alert(data.data.error);
			};
		},
	});
};
//清除活动数据
function clearLotteryList(){
	$(".add_lottery_activity input[type='text']").val("");
	$("#lottery_activity_file_cover,#lottery_activity_file_small_cover,#lottery_zhuanpan_cover,#lottery_hand_cover").attr("src","");
	$(".add_lottery_activity .lottery_activity_message").val("");
	$(".add_lottery_activity").removeAttr("activityid");
};
//清除奖品数据
function clearLotteryAwar(){
	$(".lottery_add_commodity input[type='text']").val("");
	$("#la_commodity_img,#la_commodity_head_img").attr("src","");
	$(".lottery_add_commodity").removeAttr("awardId");
};
//抽奖订单页
//定义数据
function  getLotteryorderData(awardRecordId,phoneNum,nickName,realName,startTime,endTime,page,num){
	var data = new Object();
	data.awardRecordId = awardRecordId;
	data.phoneNum = phoneNum;
	data.nickName = nickName;
	data.realName = realName;
	data.startTime = startTime;
	data.endTime = endTime;
	data.page = page;
	data.num = num;
	return data;	
}

//搜索的数据
function LotteryOrderData(){
	return getLotteryorderData(
		$(".lam_order_table .order_search .bianhao").val(),$('.lam_order_table .order_search .tel').val(),$('.lam_order_table .order_search .nicheng').val(),
		$('.lam_order_table .order_search .name').val(),$('.lam_order_table .order_search .qian').val().replace(/\D/g,''),$('.lam_order_table .order_search .hou').val().replace(/\D/g,''),0,20
    )
}
//渲染数据
function LotteryOrderListDetail(data){
	$('.order_manage_list tr:gt(0)').remove();
	var str='';
	$.each(data.data.pageData,function(key,val){
		if(val.status == 0){
			str ='<td>待填写收货信息</td><td><input type="button" value="发货" class="unclick" orderId="'+val.orderId+'"/></td>';
		}else if(val.status == 1){
			str ='<td>待发货</td><td><input type="button" value="发货" class="bluebtn1 deliverAward" awardRecordId="'+val.awardRecordId+'"/></td>';
		}else if(val.status == 2){
			str ='<td>已发货</td><td><input type="button" value="发货" class="unclick"/></td>';
		}
		
		$('.order_manage_list tbody').append('<tr><td>'+val.awardRecordId+'</td><td>'+val.nickName+'</td><td>'+val.createTime+'</td><td>'+val.awardName+'</td><td>'+val.realName+'</td><td>'+val.phoneNum+'</td><td>'+val.address+'</td>'+str+'</tr>');
	});	
};
	
//根据不同的页码来渲染页面
function onclickLotteryOrderPageNum(p){
	var data = LotteryOrderData();
	data.page = p;
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/lottery/getLotteryAwardRecords/2.5.3',
		type : 'get',
		dataType : 'json',
		data: data,
		success : function(data){
			LotteryOrderListDetail(data);
			//console.log(1);
		},
	});
};	
//获取入参，渲染页面
function loadLotteryOrderListPage(){
	var data = LotteryOrderData();
	//获取入参
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/lottery/getLotteryAwardRecords/2.5.3',
		type : 'get',
		dataType : 'json',
		data: data,
		success : function(data){
			if(data.code == 0){
			//创建分页
			$(".lam_order_table .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:onclickLotteryOrderPageNum
			});
			//渲染页面
			LotteryOrderListDetail(data);
			}else{
				alert(data.data.error);
			}
		},
	});
};
function clearAwardOrderList(){
	$(".lam_order_table .order_search .bianhao").val("");
	$('.lam_order_table .order_search .tel').val("");
	$('.lam_order_table .order_search .nicheng').val("");
	$('.lam_order_table .order_search .name').val("");
	$('.lam_order_table .order_search .qian').val("");
	$('.lam_order_table .order_search .hou').val("");
};
//奖品发货发货
function deliverAwardFn(){
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/lottery/sendLotteryAwardGoods/2.5.3',
		type : 'post',
		dataType : 'json',
		data: {awardRecordId:$(".deliverThisAward").attr("awardRecordId")},
		success : function(data){
			if(data.code == 0){
				$(".deliverThisAward").parent().prev().html("已发货");
				$(".deliverThisAward").removeClass("bluebtn1").addClass("unclick");
				$(".deliverThisAward").removeClass("deliverAward");
				$(".deliverThisAward").val("发货");	
			}else{
				alert(data.data.error);
			}
		},
	});
};