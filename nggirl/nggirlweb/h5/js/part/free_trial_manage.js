$(function(){
	//妆品试用列表跳转到某一页
	$('.free_trial_list .redirect_page .all_commonts_redirect_page_ok').click(function(e) {
        loadFreeTrialPage($.trim($('.free_trial_list .redirect_page .all_commonts_redirect_page_num').val()));
    });
	
	//查看申请名单列表跳转到某一页
	$('.look_free_trial_list .redirect_page .all_commonts_redirect_page_ok').click(function(e) {
        loadFreeTrialEveryOnePage($.trim($('.look_free_trial_list .redirect_page .all_commonts_redirect_page_num').val()));
    });
	
	//添加微信试用报告
	$('.look_free_trial_listname_weixin .look_free_trial_listname_add_weiuser_btn').click(function(e) {
        $('.add_weixin_report_content').show();
		$('.look_free_trial_listname_weixin').hide();
		$('.add_weixin_report_content').removeAttr('reportId');
		$('.add_weixin_report_content .add_weixin_report_content_cover').removeAttr('src');
		$('.add_weixin_report_content .add_weixin_report_content_username').val('');
		$('.add_weixin_report_content .editor_content').createArticleEditor({
			elements:['paragraph','image','fullScreen','preview','downloadImages']
		});
    });
	
	//点击微信免费试用列表里的返回按钮
	$('.look_free_trial_listname_weixin .look_free_trial_listname_return_btn').click(function(e) {
        $('.look_free_trial_listname_weixin').hide();
		$('.look_free_trial_list').show();
    });
	
	//点击微信用户免费试用列表
	$('.look_free_trial_list .free_trial_apply_user_list_btn').click(function(e) {	
		getWeChatReportListFn();	
    });
	
	//添加微信试用报告里的上传用户头像
	$('.add_weixin_report_content .add_weixin_report_content_cover').click(function(e) {
        $('.add_weixin_report_content #add_weixin_report_content_file').click();
    });	
	$('.add_weixin_report_content #add_weixin_report_content_file').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('.add_weixin_report_content .add_weixin_report_content_cover').attr('src',data.result.data.url);
		}
	});
	
	//点击添加微信试用报告里的编辑，获取报告下详情
	$('.look_free_trial_listname_weixin .free_trial_table_listname .edit_report').live('click',function(e) {
		var btn = $(this);		
		//获取微信用户试用报告详情V3.0.0
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/getWeChatReportDetail/3.0.0',{reportId:btn.attr('reportId')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.look_free_trial_listname_weixin').hide();
				$('.add_weixin_report_content').show();
				$('.add_weixin_report_content').show().attr('reportId',btn.attr('reportId'));
				$('.add_weixin_report_content .add_weixin_report_content_cover').attr('src',data.data.profile);
				$('.add_weixin_report_content .add_weixin_report_content_username').val(data.data.nickName);
				$('.add_weixin_report_content .editor_content').createArticleEditor({
					elements:['paragraph','image','fullScreen','preview','downloadImages'],
					data:data.data.reportDetail,//初始化内容
					defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
				});
			}else{
				alert(data.data.error);
			}
		});
    });
	
	//点击添加微信试用报告里的--》保存按钮
	$('.add_weixin_report_content .aft_save').click(function(e) {
		var data = $('.add_weixin_report_content .editor_content').getArticleEditorData();
		if(!$.isArray(data)){
			alert(data);
			return ;
		}
		var finalData = new Array();
		for(var i=0;i<data.length;i++){
			//只留下段落和图片
			if(data[i].type == 2 || data[i].type == 3){
				finalData.push(data[i]);
			}
		}
		var reportDetail = JSON.stringify(finalData);
		if(typeof($('.add_weixin_report_content').attr('reportId')) == "undefined"){//新增
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/addOrEditWechatReport/3.0.0',{cosmeticId:$('.look_free_trial_list').attr('cosmeticId'),nickName:$('.add_weixin_report_content .add_weixin_report_content_username').val(),profile:$('.add_weixin_report_content .add_weixin_report_content_cover').attr('src'),reportDetail:reportDetail},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.add_weixin_report_content').hide();
					$('.look_free_trial_listname_weixin').show();
					getWeChatReportListFn();
				}else{
					alert(data.data.error);	
				}	
			});
		}else{//更新
			var r = confirm('确定要更新该报告？？');
			if(r == true){
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/addOrEditWechatReport/3.0.0',{reportId:$('.add_weixin_report_content').show().attr('reportId'),cosmeticId:$('.look_free_trial_list').attr('cosmeticId'),nickName:$('.add_weixin_report_content .add_weixin_report_content_username').val(),profile:$('.add_weixin_report_content .add_weixin_report_content_cover').attr('src'),reportDetail:reportDetail},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						$('.add_weixin_report_content').hide();
						$('.look_free_trial_listname_weixin').show();
						getWeChatReportListFn();
					}else{
						alert(data.data.error);	
					}	
				});
			};
		}
    });
	
	//点击添加微信试用报告里的删除报告按钮
	$('.look_free_trial_listname_weixin .free_trial_table_listname .del_report').live('click',function(e) {
		var btn = $(this);
		var r = confirm('确认要删除该报告？');
		if(r == true){
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/deleteReport/2.5.6',{reportId:btn.attr('reportId')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					btn.parent().parent().remove();
				}else{
					alert(data.data.error);	
				}
			});
		};
    });
	
	//点击添加微信试用报告里的--》返回按钮
	$('.add_weixin_report_content .aft_return').click(function(e) {
        $('.add_weixin_report_content').hide();
		$('.look_free_trial_listname_weixin').show();
    });
	
	// 点击“妆品试用活动管理”--》搜索按钮
	$('.free_trial_list .ftl_search_btn').click(function(e) {
        loadFreeTrialPage(0);
    });

	//点击“妆品试用活动管理”--》全部取消按钮 
	$('.free_trial_list .ftl_cancle_btn').click(function(e) {
        $('.free_trial_list .ftl_bianhao').val('');
		$('.free_trial_list .ftl_timu').val('');
		$('.free_trial_list .ftl_product_name').val('');
		$('.free_trial_list .qian').val('');
		$('.free_trial_list .hou').val('');
		loadFreeTrialPage();
    });
	
	//查看虚拟用户申请列表
	$('.free_trial_list .ftl_false_list_btn').click(function(e) {
        $('.free_trial_list').hide();
		$('.virtual_user_list').show();
		$('.look_free_trial_list').attr('cosmeticId','');
		loadVirtualUserListPage();
    });
	
	//点击虚拟用户列表里的返回按钮
	$('.virtual_user_list .virtual_user_list_return').click(function(e) {
        $('.free_trial_list').show();
		$('.virtual_user_list').hide();
    });
	
	//点击虚拟用户列表里的添加新用户按钮
	$('.virtual_user_list .virtual_user_list_adduser').click(function(e) {
        $('.virtual_user_add_box,.graybox').show();
    });
	
	//点击添加虚拟用户弹框里的保存按钮
	$('.virtual_user_add_box .virtual_user_double_btn .virtual_user_double_btn_save').click(function(e) {
		if($('#virtual_user_img').attr('src') == ""){
			alert('请上传用户头像');
		}else if($.trim($('.virtual_user_add_box .virtual_user_username').val()) == ''){
			alert('请输入用户姓名');
		}else if($.trim($('.virtual_user_add_box .virtual_user_usermessage').val()) == ''){
			alert('请输入用户申请留言');
		}else{
			//根据userId是否存在判断是编辑还是新增
			if(typeof($('.virtual_user_add_box').attr('userId')) != "undefined"){
				var r = confirm('确定要更新虚拟用户信息？');
				if(r == true){
					$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/addOrEditVirtualUser/2.5.8',{userId:$('.virtual_user_add_box').attr('userId'),nickName:$('.virtual_user_add_box .virtual_user_username').val(),profile:$('.virtual_user_add_box #virtual_user_img').attr('src'),message:$('.virtual_user_add_box .virtual_user_usermessage').val()},function(data){
						var data = $.parseJSON(data);
						if(data.code == 0){
							loadVirtualUserListPage();
							$('#virtual_user_img').removeAttr('src');
							$('.virtual_user_add_box .virtual_user_username,.virtual_user_add_box .virtual_user_usermessage').val('');
							$('.virtual_user_add_box,.graybox').hide();
							$('.virtual_user_add_box').removeAttr('userId');
						}else{
							alert(data.data.error);	
						}	
					});
				};
			}else{
				var r = confirm('确定要添加虚拟用户？');
				if(r == true){
					$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/addOrEditVirtualUser/2.5.8',{nickName:$('.virtual_user_add_box .virtual_user_username').val(),profile:$('.virtual_user_add_box #virtual_user_img').attr('src'),message:$('.virtual_user_add_box .virtual_user_usermessage').val()},function(data){
						var data = $.parseJSON(data);
						if(data.code == 0){
							loadVirtualUserListPage();
							$('#virtual_user_img').removeAttr('src');
							$('.virtual_user_add_box .virtual_user_username,.virtual_user_add_box .virtual_user_usermessage').val('');
							$('.virtual_user_add_box,.graybox').hide();
							$('.virtual_user_add_box').removeAttr('userId');
						}else{
							alert(data.data.error);	
						}	
					});
				};
			}
		}
    });
	
	//点击添加虚拟用户弹框里的取消按钮
	$('.virtual_user_add_box .virtual_user_double_btn .virtual_user_double_btn_cancle').click(function(e) {
		$('#virtual_user_img').removeAttr('src');
		$('.virtual_user_add_box .virtual_user_username,.virtual_user_add_box .virtual_user_usermessage').val('');
        $('.virtual_user_add_box,.graybox').hide();
		$('.virtual_user_add_box').removeAttr('userId');
    });
	
	//点击添加虚拟用户弹框里的取消按钮
	$('.virtual_user_add_box .virtual_user_double_btn .virtual_user_double_btn_cancle').click(function(e) {
		$('#virtual_user_img').removeAttr('src');
		$('.virtual_user_add_box .virtual_user_username,.virtual_user_add_box .virtual_user_usermessage').val('');
        $('.virtual_user_add_box,.graybox').hide();
    });
	
	//点击添加虚拟用户弹框里的头像
	$('.virtual_user_add_box #virtual_user_address').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('#virtual_user_img').attr('src',data.result.data.url);
		}
    });
	
	//点击添加虚拟申请用户按钮
	$('.look_free_trial_list .free_trial_apply_user_btn').click(function(e) {
		if(!$(this).hasClass('background_gray')){
			$('.look_free_trial_list').hide();
			$('.select_virtual_user_list').show();
			loadVirtualUserListPage();
		};
    });
	
	//点击选择虚拟用户列表里的返回按钮
	$('.select_virtual_user_list .virtual_user_list_return').click(function(e) {
        $('.look_free_trial_list').show();
		$('.select_virtual_user_list').hide();
		loadFreeTrialEveryOnePage(0);
    });
	
	//编辑新增的虚拟用户信息
	$('.virtual_user_list_table .virtual_table_edit_btn').live('click',function(){
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/getVirtaulUserInfo/2.5.8',{userId:$(this).attr('userId')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.virtual_user_add_box,.graybox').show();
				$('.virtual_user_add_box #virtual_user_img').attr('src',data.data.profile);
				$('.virtual_user_add_box .virtual_user_username').val(data.data.nickName);
				$('.virtual_user_add_box .virtual_user_usermessage').val(data.data.message);
				$('.virtual_user_add_box').attr('userId',data.data.userId);
			}else{
				alert(data.data.error);	
			}
		});
	});
	
	//删除新增虚拟用户
	$('.virtual_user_list_table .virtual_table_del_btn').live('click',function(){
		var btn = $(this);
		var r = confirm('确定要删除？？');
		if(r == true){
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/deleteVirtualUser/2.5.8',{userId:btn.attr('userId')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					btn.parent().parent().remove();
				}else{
					alert(data.data.error);	
				}
			});
		};
	});
	
	//查看申请名单
	$('.free_trial_look_btn').live('click',function(e) {
		$('.free_trial_list').hide();
		$('.look_free_trial_list').show();
		$('.look_free_trial_list').attr('cosmeticId',$(this).attr('cosmeticId'));
		$('.look_free_trial_list').attr('isPushed',$(this).attr('isPushed'));
		$('.look_free_trial_list').attr('isEnd',$(this).attr('isEnd'));
        loadFreeTrialEveryOnePage(0);
    });
	
	//点击返回按钮，返回到妆品试用活动列表
	$('.look_free_trial_list .free_trial_return_btn').click(function(e) {
        $('.look_free_trial_list').hide();
		$('.free_trial_list').show();
    });
	
	//选择虚拟申请用户
	$('.select_virtual_user_list_table .select_virtual_table_btn_checked').live('click',function(e) {
		var btn = $(this);
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/forCosmeticAddVirtualUser/2.5.8',{userId:btn.attr('userId'),cosmeticId:$('.look_free_trial_list').attr('cosmeticId')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				btn.addClass('select_virtual_table_btn_cancle').val('取消').css('background','#bd362f').removeClass('select_virtual_table_btn_checked');
			}else{
				alert(data.data.error);	
			}
		});
    });
	
	//取消选择虚拟申请用户
	$('.select_virtual_user_list_table .select_virtual_table_btn_cancle').live('click',function(e) {
		var btn = $(this);
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/forCosmeticDeleteVirtualUser/2.5.8',{userId:btn.attr('userId'),cosmeticId:$('.look_free_trial_list').attr('cosmeticId')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				btn.addClass('select_virtual_table_btn_checked').val('选择').css('background','#51a351').removeClass('select_virtual_table_btn_cancle');
			}else{
				alert(data.data.error);	
			}
		});
    });
	
	//用户获奖
	$('.free_trial_every_one_getjiang').live('click',function(e) {
		//判断是否可点击
		if(!$(this).hasClass('background_gray')){
			//判断活动是否结束
			if($('.look_free_trial_list').attr('isEnd') == 1){//活动已结束
				//判断是否已经推送短信
				if($('.look_free_trial_list').attr('isPushed') == 0){//未推送短信
					var btn = $(this);
					var r = confirm('确定选中此用户获奖？？');
					if(r == true){
						$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/applySuccess/2.3.0',{cosmeticId:$('.look_free_trial_list').attr('cosmeticId'),userId:$(this).attr('userId')},function(data){
							var data = $.parseJSON(data);
							if(data.code ==0){
								btn.addClass('free_trial_every_one_cancle').val('取消').removeClass('free_trial_every_one_getjiang');
							}else{
								alert(data.data.error);	
							}
						});
					};
				};
			};
		};
    });
	
	//取消获奖
	$('.free_trial_every_one_cancle').live('click',function(e) {
		//判断活动是否结束
		if($('.look_free_trial_list').attr('isEnd') == 1){//活动已结束
			//判断是否已经推送短信
			if($('.look_free_trial_list').attr('isPushed') == 0){//未推送短信
				var btn = $(this);
				var r = confirm('确定取消此用户获奖');
				if(r == true){
					$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/applyFailure/2.3.0',{cosmeticId:$('.look_free_trial_list').attr('cosmeticId'),userId:$(this).attr('userId')},function(data){
						var data = $.parseJSON(data);
						if(data.code ==0){
							btn.addClass('free_trial_every_one_getjiang').val('获奖').removeClass('free_trial_every_one_cancle');
						}else{
							alert(data.data.error);	
						}
					});
				}
			}
		}
    });
	
	//比较公布人数与活动限量人数
	$('.free_trial_tijiao_mingdan_btn').click(function(e) {
		//判断活动是否结束
		if($('.look_free_trial_list').attr('isEnd') == 1){
			//判断是否已经推送短信
			if($('.look_free_trial_list').attr('isPushed') == 0){//未推送短信
				var btn = $(this);
				$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/submitJudge/2.3.0',{cosmeticId:$('.look_free_trial_list').attr('cosmeticId')},function(data){
					var data = $.parseJSON(data);
					if(data.code ==0){
						//判断type值
						if(data.data.type == 0){//type==0
							var t = confirm('确定要公布名单??');
							if(t == true){
								//短信推送
								$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/pushMessage/2.4.2',{cosmeticId:$('.look_free_trial_list').attr('cosmeticId')},function(data){
									var data = $.parseJSON(data);
									if(data.code ==0){
										$('.look_free_trial_list').hide();
										$('.free_trial_list').show();
										loadFreeTrialPage(0);
									}else{
										alert(data.data.error);	
									}
								});
							}
						}
						if(data.data.type == 1){//type==1
							var t = confirm('获奖人数已超出'+data.data.num+'人，确定要公布名单??');
							if(t == true){
								//短信推送
								$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/pushMessage/2.4.2',{cosmeticId:$('.look_free_trial_list').attr('cosmeticId')},function(data){
									var data = $.parseJSON(data);
									if(data.code ==0){
										$('.look_free_trial_list').hide();
										$('.free_trial_list').show();
										loadFreeTrialPage(0);
									}else{
										alert(data.data.error);	
									}
								});
							}
						}
						if(data.data.type == 2){//type==2
							var t = confirm('获奖人数还差'+data.data.num+'人，确定要公布名单??');
							if(t == true){
								//短信推送
								$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/pushMessage/2.4.2',{cosmeticId:$('.look_free_trial_list').attr('cosmeticId')},function(data){
									var data = $.parseJSON(data);
									if(data.code ==0){
										$('.look_free_trial_list').hide();
										$('.free_trial_list').show();
										loadFreeTrialPage(0);
									}else{
										alert(data.data.error);	
									}
								});
							}
						}
					}else{
						alert(data.data.error);	
					}
				});
			}
		}
    });

	//点击新增妆品试用活动按钮
	$('.free_trial_manage .ftl_add_btn').click(function(e) {
		//清空添加妆品试用活动信息
		clearFreeTrialMessageFn();
        $('.add_free_trial').removeAttr('status');
		$('.free_trial_manage .free_trial_list,.add_free_trial .aft_href_txt').hide();
		$('.add_free_trial').show();
		$('.add_free_trial .editor_content').createArticleEditor({
			elements:['paragraph','image','fullScreen']
		});
    });
	
	//点击添加妆品试用里面的返回按钮
	$('.add_free_trial .aft_return').click(function(e) {
        $('.add_free_trial').hide();
		$('.free_trial_manage .free_trial_list').show();
    });
	
	//上传妆品试用分享小图
	$('.add_free_trial .free_trial_file_small_cover').fileupload({
		dataType: 'json',
		done: function (e, data) {
			var a=data.result.data.width/data.result.data.height;
			if(a != 320/320){
				alert("上传失败！图片比例应为320*320");
			}else{
				$('.add_free_trial #free_trial_file_small_cover').attr('src',data.result.data.url);
			};
			
		}
	});
	
	//上传妆品试用图
	$('.add_free_trial .free_trial_file_cover').fileupload({
		dataType: 'json',
		done: function (e, data) {
			var a=data.result.data.width/data.result.data.height;
			if(a != 640/320){
				alert("上传失败！图片比例应为640*320");
			}else{
				$('.add_free_trial #free_trial_file_cover').attr('src',data.result.data.url);
			};
		}
	});
		
	//新增妆品试用活动V2.4.0
	$('.add_free_trial .aft_save').click(function(e) {
		var data = $('.add_free_trial .editor_content').getArticleEditorData();
		if(!$.isArray(data)){
			alert(data);
			return ;
		}
		var finalData = new Array();
		for(var i=0;i<data.length;i++){
			//将所有的标题改为段落
			if(data[i].type == 1){
				data[i].type = 2;
			}
			//只留下段落和图片
			if(data[i].type == 2 || data[i].type == 3){
				finalData.push(data[i]);
			}

		}

		var cosmeticDetail = JSON.stringify(finalData);
		var re = new RegExp("[\\-,\\:, ]","g");
		var applyStartTime = $('.add_free_trial .qian').val().replace(re, "");
		var applyEndTime = $('.add_free_trial .hou').val().replace(re, "");
		var publishTime = $('.add_free_trial .aft_publish_time').val().replace(re, "");
		
		//判断是新增还是修改 
		if(typeof($('.add_free_trial').attr('status')) == 'undefined' ){//新增
			var r = confirm('确定保存妆品试用活动？？');
			if(r == true){
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/addCosmeticTrial/2.4.0',{
					cosmeticImg:$('.add_free_trial #free_trial_file_cover').attr('src'),
					shareImg:$('.add_free_trial #free_trial_file_small_cover').attr('src'),
					title:$('.add_free_trial .aft_title').val(),
					limits:$('.add_free_trial .aft_num').val(),
					name:$('.add_free_trial .aft_name').val(),
					applyStartTime:applyStartTime,
					applyEndTime:applyEndTime,
					publishTime:publishTime,
					message:$('.add_free_trial #aft_message').val(),
					cosmeticDetail:cosmeticDetail},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						$('.add_free_trial').hide();
						$('.free_trial_list').show();
						loadFreeTrialPage(0);
						
						//清空添加妆品试用活动信息
						clearFreeTrialMessageFn();
					}else{
						alert(data.data.error);	
					}
				});
			}
		}else{
			var r = confirm('确定更新妆品试用活动？？');
			if(r == true){
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/updateCosmeticTrial/2.4.0',{//更新
					cosmeticId:$('.add_free_trial').attr('cosmeticId'),
					cosmeticImg:$('.add_free_trial #free_trial_file_cover').attr('src'),
					shareImg:$('.add_free_trial #free_trial_file_small_cover').attr('src'),
					title:$('.add_free_trial .aft_title').val(),
					limits:$('.add_free_trial .aft_num').val(),
					name:$('.add_free_trial .aft_name').val(),
					applyStartTime:applyStartTime,
					applyEndTime:applyEndTime,
					publishTime:publishTime,
					message:$('.add_free_trial #aft_message').val(),
					cosmeticDetail:cosmeticDetail},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						$('.add_free_trial').hide();
						$('.free_trial_list').show();
						loadFreeTrialPage(0);
						
						//清空添加妆品试用活动信息
						clearFreeTrialMessageFn();
					}else{
						alert(data.data.error);	
					}
				});
			}
		}
		
		//判断是否有活动详情
    });
	
	//获取妆品试用活动详情V2.4.0
	$('.free_trial_table_list .free_trial_edit_btn').live('click',function(e) {
		$('.add_free_trial').attr('status','edit');
        $.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/getCosmeticTrial/2.4.0',{cosmeticId:$(this).attr('cosmeticId')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.free_trial_list').hide();
				$('.add_free_trial').show();
				$('.add_free_trial #free_trial_file_cover').attr('src',data.data.cosmeticImg);
				$('.add_free_trial #free_trial_file_small_cover').attr('src',data.data.shareImg);
				$('.add_free_trial .aft_title').val(data.data.title);
				$('.add_free_trial .aft_num').val(data.data.limits);
				$('.add_free_trial .aft_name').val(data.data.name);
				$('.add_free_trial .qian').val(data.data.applyStartTime);
				$('.add_free_trial .hou').val(data.data.applyEndTime);
				$('.add_free_trial .aft_publish_time').val(data.data.publishTime);
				$('.add_free_trial #aft_message').val(data.data.message);
				$('.add_free_trial').attr('cosmeticId',data.data.cosmeticId);
				$('.add_free_trial .aft_href_txt').show();
				$('.add_free_trial .aft_href_txt .aft_href').html(data.data.originalUrl);
				$('.add_free_trial .aft_href_cosmeticid').html(data.data.cosmeticId);

				$('.add_free_trial .editor_content').createArticleEditor({
					elements:['paragraph','image','fullScreen'],
					data:data.data.cosmeticDetail
				});
			}else{
				alert(data.data.error);	
			}
		});
    });
	
	//删除妆品试用活动V2.4.0
	$('.free_trial_table_list .free_trial_del_btn').live('click',function(e) {
		var r = confirm('确定删除此妆品试用活动？？');
		var ok = $(this);
		if(r == true){
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/deleteCosmeticTrial/2.4.0',{cosmeticId:ok.attr('cosmeticId')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					ok.parent().parent().remove();
				}else{
					alert(data.data.error);	
				}
			});
		}
    });
	
	//发布妆品试用活动V2.4.0
	$('.free_trial_table_list .free_trial_fabu_btn').live('click',function(e) {
		var r = confirm('确定发布此妆品试用活动？？');
		var ok = $(this);
		if(r == true){
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/releaseCosmeticTrial/2.4.0',{cosmeticId:ok.attr('cosmeticId')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					ok.addClass('free_trial_look_btn').attr('value','查看申请名单').removeClass('free_trial_fabu_btn').css({'background':'#51a351','color':'#fff'});
					ok.prev('free_trial_del_btn').remove();
					ok.parent().prev().html('已发布');
					ok.prev().hide();
					loadFreeTrialPage(0);
				}else{
					alert(data.data.error);	
				}
			});
		}
    });
	
	//点击中奖名单按钮查看中奖名单列表
	//获取某个试用活动的中奖名单V2.5.6
	$('.free_trial_listname_btn').click(function(e) {
        $('.look_free_trial_listname').show();
		$('.look_free_trial_list').hide();
		loadAwardUserListPage();
    });
	
	//点击中奖名单列表里的返回按钮
	$('.look_free_trial_listname .look_free_trial_listname_return_btn').click(function(e) {
        $('.look_free_trial_listname').hide();
		$('.look_free_trial_list').show();
    });
	
	//点击编辑报告
	//获取试用报告详情V2.5.6
	$('.look_free_trial_listname .free_trial_table_listname .edit_report').live('click',function(e) {
		var btn = $(this);
		if(!btn.hasClass('no_edit')){
			$('.edit_report_content').show();
			$('.look_free_trial_listname').hide();
			$(".edit_report_content").attr('reportId',btn.attr("reportId"));
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/getReportDetail/2.5.6',
				type : 'get',
				dataType : 'json',
				data: {reportId:btn.attr("reportId")},
				success : function(data){
					if(data.code == 0){
						$('.edit_report_content .editor_content').createArticleEditor({
							elements:['paragraph','image','downloadImages'],
							data:data.data,//初始化内容
							defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
						});
					}else{
						alert(data.data.error);
					}
				},
			});
		};
    });
	
	//点击编辑报告里面的返回按钮
	$('.edit_report_content .aft_return').click(function(e) {
        $('.edit_report_content').hide();
		$('.look_free_trial_listname').show();
    });
	
	//点击编辑报告里面的保存按钮
	//更新试用报告
	$('.edit_report_content .aft_save').click(function(e) {
		var content = $('.edit_report_content .editor_content').getArticleEditorData();
		if(!$.isArray(content)){
			alert(content);
			return ;
		}
		//只保留标题和图片
		var finalData = new Array();
		for(var i=0;i<content.length;i++){
			if(content[i].type == 3 || content[i].type == 2){
				finalData.push(content[i]);
			}
		}
		var details = JSON.stringify(finalData);
		console.log(details);
		var r = confirm('确认更新该报告？？');
		if(r == true){
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/addOrEditReport/2.5.6',{reportId:$('.edit_report_content').attr('reportId'),reportDetail:details},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					loadAwardUserListPage();
					$('.edit_report_content').hide();
					$('.look_free_trial_listname').show();
				}else{
					alert(data.data.error);	
				}
			});
		};
    });
	
	//点击删除报告
	$('.look_free_trial_listname .free_trial_table_listname .del_report').live('click',function(e) {
		var btn = $(this);
		if(!btn.hasClass('no_del')){
			var r = confirm('确认要删除该报告？');
			if(r == true){
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/deleteReport/2.5.6',{reportId:btn.attr('reportId')},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						btn.parent().parent().remove();
					}else{
						alert(data.data.error);	
					}
				});
			};
		};
    });
	
});

//创建妆品试用活动列表分页
function createFreeTrialPage(data){
	$(".free_trial_manage .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getFreeTrialSearchParams();
			params.page = p;
			$('.free_trial_table_list>tbody>tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/getCosmeticTrialList/2.4.0',
				type : 'post',
				dataType : 'json',
				data: params,
				success : initFreeTrialPage
			});			
		}
	});
}

//初始化妆品试用活动分页
function initFreeTrialPage(data){
	$('.free_trial_manage .redirect_page .all_commonts_redirect_page_num').val('');
	$('.free_trial_list .redirect_page .all_commonts_redirect_page_totalnum').html(data.data.pageData.length);
	createFreeTrialPage(data);
	for(var x = 0; x < data.data.pageData.length ; x ++){
		//判断是否已发布
		if(data.data.pageData[x].isReleased == 0){//未发布
			$('.free_trial_table_list').append('<tr><td>'+data.data.pageData[x].cosmeticId+'</td><td>'+data.data.pageData[x].title+'</td><td>'+data.data.pageData[x].limits+'</td><td>'+data.data.pageData[x].applyNum+'</td><td>'+data.data.pageData[x].name+'</td><td>'+data.data.pageData[x].applyTime+'</td><td>'+data.data.pageData[x].publishTime+'</td><td>'+data.data.pageData[x].message+'</td><td>'+getStatusFn(data.data.pageData[x].isReleased)+'</td><td><input type="button" value="编辑" class="free_trial_edit_btn" cosmeticId="'+data.data.pageData[x].cosmeticId+'" isPushed="'+data.data.pageData[x].isPushed+'" isEnd="'+data.data.pageData[x].isEnd+'"/> <input type="button" value="删除" class="free_trial_del_btn" cosmeticId="'+data.data.pageData[x].cosmeticId+'" isPushed="'+data.data.pageData[x].isPushed+'" isEnd="'+data.data.pageData[x].isEnd+'"/> <input type="button" value="发布" class="free_trial_fabu_btn" cosmeticId="'+data.data.pageData[x].cosmeticId+'" isPushed="'+data.data.pageData[x].isPushed+'" isEnd="'+data.data.pageData[x].isEnd+'"/></td></tr>');
		}
		if(data.data.pageData[x].isReleased == 1){//已发布
			//判断申请时间是否已结束
			if(data.data.pageData[x].isEnd == 0){//0未结束
				$('.free_trial_table_list').append('<tr><td>'+data.data.pageData[x].cosmeticId+'</td><td>'+data.data.pageData[x].title+'</td><td>'+data.data.pageData[x].limits+'</td><td>'+data.data.pageData[x].applyNum+'</td><td>'+data.data.pageData[x].name+'</td><td>'+data.data.pageData[x].applyTime+'</td><td>'+data.data.pageData[x].publishTime+'</td><td>'+data.data.pageData[x].message+'</td><td>'+getStatusFn(data.data.pageData[x].isReleased)+'</td><td><input type="button" value="编辑" class="free_trial_edit_btn" cosmeticId="'+data.data.pageData[x].cosmeticId+'" isPushed="'+data.data.pageData[x].isPushed+'" isEnd="'+data.data.pageData[x].isEnd+'"/> <input type="button" value="查看申请名单" class="free_trial_look_btn" cosmeticId="'+data.data.pageData[x].cosmeticId+'" isPushed="'+data.data.pageData[x].isPushed+'" isEnd="'+data.data.pageData[x].isEnd+'"/></td></tr>');
			}
			if(data.data.pageData[x].isEnd == 1){//1已结束
				//判断活动时间已结束并且是否已提交公布名单
				if(data.data.pageData[x].isPushed == 1){//已推送短信
					$('.free_trial_table_list').append('<tr><td>'+data.data.pageData[x].cosmeticId+'</td><td>'+data.data.pageData[x].title+'</td><td>'+data.data.pageData[x].limits+'</td><td>'+data.data.pageData[x].applyNum+'</td><td>'+data.data.pageData[x].name+'</td><td>'+data.data.pageData[x].applyTime+'</td><td>'+data.data.pageData[x].publishTime+'</td><td>'+data.data.pageData[x].message+'</td><td>'+getStatusFn(data.data.pageData[x].isReleased)+'</td><td><input type="button" value="编辑" class="free_trial_edit_btn" cosmeticId="'+data.data.pageData[x].cosmeticId+'" isPushed="'+data.data.pageData[x].isPushed+'" isEnd="'+data.data.pageData[x].isEnd+'"/> <input type="button" value="查看申请名单" class="free_trial_look_btn" cosmeticId="'+data.data.pageData[x].cosmeticId+'" isPushed="'+data.data.pageData[x].isPushed+'" isEnd="'+data.data.pageData[x].isEnd+'"/></td></tr>');
				}
				if(data.data.pageData[x].isPushed == 0){//未推送短信
					$('.free_trial_table_list').append('<tr><td>'+data.data.pageData[x].cosmeticId+'</td><td>'+data.data.pageData[x].title+'</td><td>'+data.data.pageData[x].limits+'</td><td>'+data.data.pageData[x].applyNum+'</td><td>'+data.data.pageData[x].name+'</td><td>'+data.data.pageData[x].applyTime+'</td><td>'+data.data.pageData[x].publishTime+'</td><td>'+data.data.pageData[x].message+'</td><td>'+getStatusFn(data.data.pageData[x].isReleased)+'</td><td><input type="button" value="编辑" class="free_trial_edit_btn" cosmeticId="'+data.data.pageData[x].cosmeticId+'" isPushed="'+data.data.pageData[x].isPushed+'" isEnd="'+data.data.pageData[x].isEnd+'"/> <input type="button" value="查看申请名单" class="free_trial_look_btn" style=" background:#51a351; color:#fff;" cosmeticId="'+data.data.pageData[x].cosmeticId+'" isPushed="'+data.data.pageData[x].isPushed+'" isEnd="'+data.data.pageData[x].isEnd+'"/></td></tr>');
				}
			}
		}
	}
}

//获取查询参数
function getFreeTrialSearchParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	params.cosmeticId = $('.free_trial_list .ftl_bianhao').val();
	params.title = $('.free_trial_list .ftl_timu').val();
	params.name = $('.free_trial_list .ftl_product_name').val();
	params.startTime = $('.free_trial_list .qian').val();
	params.endTime = $('.free_trial_list .hou').val();
	return params;
}
        
//加载妆品试用活动分页数据
function loadFreeTrialPage(page){
	$('.free_trial_table_list>tbody>tr:gt(0)').remove();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/getCosmeticTrialList/2.4.0',
		type : 'post',
		dataType : 'json',
		data: getFreeTrialSearchParams(page),
		success : initFreeTrialPage,
	});
}



//创建查看申请名单列表分页
function createFreeTrialEveryOnePage(data){
	$(".look_free_trial_list .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getFreeTrialSearchEveryOneParams();
			params.page = p;
			$('.free_trial_table_everone_list>tbody>tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/getApplyUserList/2.5.8',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initFreeTrialEveryOnePage
			});			
		}
	});
}

//初始化查看申请名单分页
function initFreeTrialEveryOnePage(data){
	$('.look_free_trial_list .redirect_page .all_commonts_redirect_page_num').val('');
	$('.look_free_trial_list .redirect_page .all_commonts_redirect_page_totalnum').html(data.data.pageData.length);
	createFreeTrialEveryOnePage(data);
	if(data.data.pageData.length > 0){
		for(var x = 0; x < data.data.pageData.length ; x ++){
			//判断活动时间是否结束
			if($('.look_free_trial_list').attr('isEnd') == 1){//已结束
				$('.free_trial_apply_user_btn').addClass('background_gray');
				//活动结束后判断短信是否已经推送过，0未推送，1已推送
				if($('.look_free_trial_list').attr('isPushed') == 0){//未推送短信
					$('.free_trial_tijiao_mingdan_btn').removeClass('background_gray');
					$('.free_trial_listname_btn').hide();
					//是否被抽中，0未被抽中，1被抽中
					if(data.data.pageData[x].isSelected == 0){
						//判断是否为虚拟用户
						if(data.data.pageData[x].isVirtual == 0){//非虚拟用户
							$('.free_trial_table_everone_list').append('<tr><td>'+data.data.pageData[x].userId+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+getSexFn(data.data.pageData[x].sex)+'</td><td>'+data.data.pageData[x].age+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].wechat+'</td><td>'+data.data.pageData[x].skinType+'</td><td>'+data.data.pageData[x].address+'</td><td>'+data.data.pageData[x].message+'</td><td><input type="button" value="获奖" class="free_trial_every_one_getjiang" userId="'+data.data.pageData[x].userId+'" isVirtual="'+data.data.pageData[x].isVirtual+'"/></td></tr>');
						}else{//虚拟用户
							$('.free_trial_table_everone_list').append('<tr><td>'+data.data.pageData[x].userId+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+getSexFn(data.data.pageData[x].sex)+'</td><td>'+data.data.pageData[x].age+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].wechat+'</td><td>'+data.data.pageData[x].skinType+'</td><td>'+data.data.pageData[x].address+'</td><td>'+data.data.pageData[x].message+'</td><td><input type="button" value="获奖(虚拟用户)" class="free_trial_every_one_getjiang background_gray" userId="'+data.data.pageData[x].userId+'" isVirtual="'+data.data.pageData[x].isVirtual+'"/></td></tr>');
						}
					}
					if(data.data.pageData[x].isSelected == 1){
						$('.free_trial_table_everone_list').append('<tr><td>'+data.data.pageData[x].userId+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+getSexFn(data.data.pageData[x].sex)+'</td><td>'+data.data.pageData[x].age+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].wechat+'</td><td>'+data.data.pageData[x].skinType+'</td><td>'+data.data.pageData[x].address+'</td><td>'+data.data.pageData[x].message+'</td><td><input type="button" value="取消" class="free_trial_every_one_cancle" userId="'+data.data.pageData[x].userId+'" isVirtual="'+data.data.pageData[x].isVirtual+'"/></td></tr>');
					}
				}
				if($('.look_free_trial_list').attr('isPushed') == 1){//已推送短信
					$('.free_trial_tijiao_mingdan_btn,.free_trial_apply_user_btn').addClass('background_gray');
					$('.free_trial_listname_btn').show();
					//是否被抽中，0未被抽中，1被抽中
					if(data.data.pageData[x].isSelected == 0){
						//判断是否为虚拟用户
						if(data.data.pageData[x].isVirtual == 0){//非虚拟用户
							$('.free_trial_table_everone_list').append('<tr><td>'+data.data.pageData[x].userId+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+getSexFn(data.data.pageData[x].sex)+'</td><td>'+data.data.pageData[x].age+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].wechat+'</td><td>'+data.data.pageData[x].skinType+'</td><td>'+data.data.pageData[x].address+'</td><td>'+data.data.pageData[x].message+'</td><td><input type="button" value="获奖" class="free_trial_every_one_getjiang background_gray" userId="'+data.data.pageData[x].userId+'" isVirtual="'+data.data.pageData[x].isVirtual+'"/></td></tr>');
						}else{//虚拟用户
							$('.free_trial_table_everone_list').append('<tr><td>'+data.data.pageData[x].userId+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+getSexFn(data.data.pageData[x].sex)+'</td><td>'+data.data.pageData[x].age+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].wechat+'</td><td>'+data.data.pageData[x].skinType+'</td><td>'+data.data.pageData[x].address+'</td><td>'+data.data.pageData[x].message+'</td><td><input type="button" value="获奖(虚拟用户)" class="free_trial_every_one_getjiang background_gray" userId="'+data.data.pageData[x].userId+'" isVirtual="'+data.data.pageData[x].isVirtual+'"/></td></tr>');
						}
					}
					if(data.data.pageData[x].isSelected == 1){
						$('.free_trial_table_everone_list').append('<tr><td>'+data.data.pageData[x].userId+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+getSexFn(data.data.pageData[x].sex)+'</td><td>'+data.data.pageData[x].age+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].wechat+'</td><td>'+data.data.pageData[x].skinType+'</td><td>'+data.data.pageData[x].address+'</td><td>'+data.data.pageData[x].message+'</td><td><input type="button" value="取消" class="free_trial_every_one_cancle background_gray" userId="'+data.data.pageData[x].userId+'" isVirtual="'+data.data.pageData[x].isVirtual+'"/></td></tr>');
					}
				}
			}
			if($('.look_free_trial_list').attr('isEnd') == 0){//未结束
				$('.free_trial_listname_btn').hide();
				$('.free_trial_tijiao_mingdan_btn').addClass('background_gray');
				$('.free_trial_apply_user_btn').removeClass('background_gray');
				//是否被抽中，0未被抽中，1被抽中
				if(data.data.pageData[x].isSelected == 0){
					//判断是否为虚拟用户
					if(data.data.pageData[x].isVirtual == 0){//非虚拟用户
						$('.free_trial_table_everone_list').append('<tr><td>'+data.data.pageData[x].userId+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+getSexFn(data.data.pageData[x].sex)+'</td><td>'+data.data.pageData[x].age+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].wechat+'</td><td>'+data.data.pageData[x].skinType+'</td><td>'+data.data.pageData[x].address+'</td><td>'+data.data.pageData[x].message+'</td><td><input type="button" value="获奖" class="free_trial_every_one_getjiang background_gray" userId="'+data.data.pageData[x].userId+'" isVirtual="'+data.data.pageData[x].isVirtual+'"/></td></tr>');
					}else{//虚拟用户
						$('.free_trial_table_everone_list').append('<tr><td>'+data.data.pageData[x].userId+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+getSexFn(data.data.pageData[x].sex)+'</td><td>'+data.data.pageData[x].age+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].wechat+'</td><td>'+data.data.pageData[x].skinType+'</td><td>'+data.data.pageData[x].address+'</td><td>'+data.data.pageData[x].message+'</td><td><input type="button" value="获奖(虚拟用户)" class="free_trial_every_one_getjiang background_gray" userId="'+data.data.pageData[x].userId+'" isVirtual="'+data.data.pageData[x].isVirtual+'"/></td></tr>');
					}
				}
				if(data.data.pageData[x].isSelected == 1){
					$('.free_trial_table_everone_list').append('<tr><td>'+data.data.pageData[x].userId+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+getSexFn(data.data.pageData[x].sex)+'</td><td>'+data.data.pageData[x].age+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].wechat+'</td><td>'+data.data.pageData[x].skinType+'</td><td>'+data.data.pageData[x].address+'</td><td>'+data.data.pageData[x].message+'</td><td><input type="button" value="取消" class="free_trial_every_one_cancle background_gray" userId="'+data.data.pageData[x].userId+'" isVirtual="'+data.data.pageData[x].isVirtual+'"/></td></tr>');
				}
			}
		}
	}else{
		//判断活动时间是否结束
		if($('.look_free_trial_list').attr('isEnd') == 1){//已结束
			$('.free_trial_apply_user_btn').addClass('background_gray');
			//活动结束后判断短信是否已经推送过，0未推送，1已推送
			if($('.look_free_trial_list').attr('isPushed') == 1){//已推送短信
				$('.free_trial_tijiao_mingdan_btn,.free_trial_apply_user_btn').addClass('background_gray');
				$('.free_trial_listname_btn').show();
			}else{
				$('.free_trial_tijiao_mingdan_btn').removeClass('background_gray');
				$('.free_trial_listname_btn').hide();
			}
		}
		//判断活动时间是否结束
		if($('.look_free_trial_list').attr('isEnd') == 0){//未结束
			$('.free_trial_apply_user_btn').removeClass('background_gray');
			$('.free_trial_tijiao_mingdan_btn').addClass('background_gray');
			$('.free_trial_listname_btn').hide();
		};
	}
}

//获取查询参数
function getFreeTrialSearchEveryOneParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	params.cosmeticId = $('.look_free_trial_list').attr('cosmeticId');
	return params;
}
        
//加载查看申请名单分页数据
function loadFreeTrialEveryOnePage(page){
	$('.free_trial_table_everone_list>tbody>tr:gt(0)').remove();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/getApplyUserList/2.5.8',
		type : 'get',
		dataType : 'json',
		data: getFreeTrialSearchEveryOneParams(page),
		success : initFreeTrialEveryOnePage,
	});
}

//返回获取到的性别
function getSexFn(sex){
	if(sex == 0){
		return '男';	
	}
	if(sex == 1){
		return '女';	
	}
}

//清空添加妆品试用活动信息
function clearFreeTrialMessageFn(){
	$('.add_free_trial #free_trial_file_cover').removeAttr('src');
	$('.add_free_trial #free_trial_file_small_cover').removeAttr('src');
	$('.add_free_trial .aft_title').val('');
	$('.add_free_trial .aft_num').val('');
	$('.add_free_trial .aft_name').val('');
	$('.add_free_trial .qian').val('');
	$('.add_free_trial .hou').val('');
	$('.add_free_trial .aft_publish_time').val('');
	$('.add_free_trial #aft_message').val('');
}

//获取妆品试用活动发布状态
function getStatusFn(isReleased){
	if(isReleased == 0)	{
		return '未发布';	
	}
	if(isReleased == 1)	{
		return '已发布';	
	}
}


//创建某个试用活动的中奖名单列表分页
function createAwardUserListPage(data){
	$(".look_free_trial_listname .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getAwardUserListSearchParams();
			params.page = p;
			params.cosmeticId = $('.free_trial_manage .look_free_trial_list').attr('cosmeticId');
			$('.look_free_trial_listname .free_trial_table_listname>tbody>tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/getAwardUserList/2.5.6',
				type : 'get',
				dataType : 'json',
				data: params,
				success : function(data){
					if(data.code == 0){
						initAwardUserListPage(data);
					}else{
						alert(data.data.error);
					}
				}
				//success : initAwardUserListPage
			});			
		}
	});
}

//初始化某个试用活动的中奖名单分页
function initAwardUserListPage(data){
	createAwardUserListPage(data);
	for(var x = 0; x < data.data.pageData.length ; x ++){
		//试用报告状态：0未提交，1已提交，只有已经提交的试用报告才能编辑
		if(data.data.pageData[x].reportStatus == 1){
			$('.look_free_trial_listname .free_trial_table_listname tbody').append('<tr><td>'+data.data.pageData[x].userId+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+data.data.pageData[x].age+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].wechat+'</td><td>'+data.data.pageData[x].skinType+'</td><td>'+data.data.pageData[x].address+'</td><td>'+data.data.pageData[x].message+'</td><td>'+data.data.pageData[x].reportDesc+'</td><td><input type="button" value="编辑报告" class="edit_report" style="padding:7px; color:#fff; background:#51a351;"  reportId='+data.data.pageData[x].reportId+' /><br /><br /><input type="button" value="删除报告" class="del_report" style="padding:7px; color:#fff; background:#bd362f;" reportId='+data.data.pageData[x].reportId+' /></td></tr>');
		}else{
			$('.look_free_trial_listname .free_trial_table_listname tbody').append('<tr><td>'+data.data.pageData[x].userId+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+data.data.pageData[x].age+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].wechat+'</td><td>'+data.data.pageData[x].skinType+'</td><td>'+data.data.pageData[x].address+'</td><td>'+data.data.pageData[x].message+'</td><td>'+data.data.pageData[x].reportDesc+'</td><td><input type="button" value="编辑报告" class="edit_report no_edit" style="padding:7px; color:#000; background:#ccc;"  reportId='+data.data.pageData[x].reportId+' /><br /><br /><input type="button" value="删除报告" class="del_report no_del" style="padding:7px; color:#000; background:#ccc;" reportId='+data.data.pageData[x].reportId+' /></td></tr>');
		}
	}
}

//获取查询参数
function getAwardUserListSearchParams(page,cosmeticId){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	params.cosmeticId = cosmeticId;
	return params;
}

//加载某个试用活动的中奖名单分页数据
function loadAwardUserListPage(){
	$('.look_free_trial_listname .free_trial_table_listname>tbody>tr:gt(0)').remove();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/getAwardUserList/2.5.6',
		type : 'get',
		dataType : 'json',
		data: getAwardUserListSearchParams(1,$('.free_trial_manage .look_free_trial_list').attr('cosmeticId')),
		success : function(data){
			if(data.code == 0){
				initAwardUserListPage(data);
			}else{
				alert(data.data.error);
			}
		}
	});
}

//虚拟用户申请列表分页
function createVirtualUserListPage(data){
	$(".virtual_user_list .tcdPageCode,.select_virtual_user_list .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getVirtualUserListSearchParams();
			params.page = $('.look_free_trial_list').attr('cosmeticId');
			params.cosmeticId = p;
			$('.virtual_user_list_table>tbody>tr:gt(0)').remove(); //清除原来的表格信息
			$('.select_virtual_user_list_table>tbody>tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/getVirtualUserList/2.5.8',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initVirtualUserListPage
			});			
		}
	});
}

//初始化虚拟用户申请列表分页
function initVirtualUserListPage(data){
	createVirtualUserListPage(data);
	for(var x = 0; x < data.data.pageData.length ; x ++){
		$('.virtual_user_list_table tbody').append('<tr><td>'+data.data.pageData[x].nickName+'</td><td><img src="'+data.data.pageData[x].profile+'" alt="" style=" width:100px;" /></td><td>'+data.data.pageData[x].message+'</td><td><input type="button" value="编辑" userId="'+data.data.pageData[x].userId+'" class="virtual_table_edit_btn" style=" background:#51a351; color:#fff;" /><input type="button" value="删除" class="virtual_table_del_btn" style=" background:#bd362f; color:#fff;" userId="'+data.data.pageData[x].userId+'" /></td></tr>');
		
		//选择虚拟用户
		//判断是否被选中过
		if(data.data.pageData[x].isSelected == 0){//为选
			$('.select_virtual_user_list_table tbody').append('<tr><td>'+data.data.pageData[x].nickName+'</td><td><img src="'+data.data.pageData[x].profile+'" alt="" style=" width:100px;" /></td><td>'+data.data.pageData[x].message+'</td><td><input type="button" value="选择" userId="'+data.data.pageData[x].userId+'" class="select_virtual_table_btn_checked" style=" background:#51a351; color:#fff;"></td></tr>');
		}else{//已选
			$('.select_virtual_user_list_table tbody').append('<tr><td>'+data.data.pageData[x].nickName+'</td><td><img src="'+data.data.pageData[x].profile+'" alt="" style=" width:100px;" /></td><td>'+data.data.pageData[x].message+'</td><td><input type="button" value="取消" userId="'+data.data.pageData[x].userId+'" class="select_virtual_table_btn_cancle" style=" background:#bd362f; color:#fff;"></td></tr>');
		}
	}
}

//获取查询参数
function getVirtualUserListSearchParams(page,cosmeticId){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	params.cosmeticId = cosmeticId;
	return params;
}

//加载虚拟用户申请列表分页数据
function loadVirtualUserListPage(){
	$('.virtual_user_list_table>tbody>tr:gt(0)').remove();
	$('.select_virtual_user_list_table>tbody>tr:gt(0)').remove();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/getVirtualUserList/2.5.8',
		type : 'get',
		dataType : 'json',
		data: getVirtualUserListSearchParams(1,$('.look_free_trial_list').attr('cosmeticId')),
		success : initVirtualUserListPage,
	});
}

//获取微信用户免费试用列表
function getWeChatReportListFn(){
	$('.look_free_trial_listname_weixin .free_trial_table_listname tbody tr:gt(0)').remove();
	$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticTrial/getWeChatReportList/3.0.0',{cosmeticId:$('.look_free_trial_list').attr('cosmeticId')},function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			$('.free_trial_manage .look_free_trial_list').hide();
			$('.look_free_trial_listname_weixin').show();
			if(data.data.length > 0){
				for(var x = 0; x < data.data.length;x ++){
					$('.look_free_trial_listname_weixin .free_trial_table_listname tbody').append('<tr><td>'+data.data[x].nickName+'</td><td><img style=" width:100px; height:100px;" src="'+data.data[x].profile+'" /></td><td>'+data.data[x].reportDesc+'</td><td><input type="button" value="编辑报告" class="edit_report" style="padding:7px; color:#fff; background:#51a351;" reportId='+data.data[x].reportId+'><br><br><input type="button" value="删除报告" class="del_report" style="padding:7px; color:#fff; background:#bd362f;" reportId='+data.data[x].reportId+'></td></tr>');	
				}
			};
		}else{
			alert(data.data.error);	
		}	
	});
}

