$(function(){
	var pageL=new LocalStorageDeque('pageRestoreStack');
	
	//选择一个虚拟用户
	$('.add_new_ping_lun .add_ping_lun_xuni_li li').live('click',function(e) {
        $('.add_new_ping_lun .add_ping_lun_user_xuni_name').val($(this).children('span').html()).attr('userId',$(this).attr('userId'));
		$('.add_new_ping_lun .add_ping_lun_xuni_li').hide();
    });
	
	//点击获取虚拟用户列表
	$('.add_new_ping_lun .add_ping_lun_user_xuni_name').click(function(e) {
		$('.add_new_ping_lun .add_ping_lun_xuni_li').children('li').remove();
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/post/listAddWaterUser/3.0.2',function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.add_new_ping_lun .add_ping_lun_xuni_li').show();
				for(var x = 0; x< data.data.length; x ++){
					$('.add_new_ping_lun .add_ping_lun_xuni_li').append('<li userId='+data.data[x].userId+'><img src="'+data.data[x].profile+'" alt="" style="width:30px; height:30px; padding:10px; vertical-align:middle;"><span style="vertical-align:middle;">'+data.data[x].nickName+'</span></li>');
				}
			}else{
				alert(data.data.error);	
			}	
		});		
    });
	
	//虚拟用户框失去焦点
	$('.add_new_ping_lun .apl_ping_conent,.add_new_ping_lun .apl_ping_user_id').focus(function(e) {
        $('.add_new_ping_lun .add_ping_lun_xuni_li').hide();
    });
			
	//获取灌水用户列表V3.0.2
	$('.add_new_ping_lun .add_ping_lun_user_xuni_name').keyup(function(e) {
		$('.add_new_ping_lun .add_ping_lun_xuni_li').children('li').remove();
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/post/listAddWaterUser/3.0.2',{nickName:$('.add_new_ping_lun .add_ping_lun_user_xuni_name').val()},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				if(data.data.length > 0){
					$('.add_new_ping_lun .add_ping_lun_xuni_li').show();
					$('.add_new_ping_lun .add_ping_lun_xuni_li').children('li').remove();
					for(var x = 0; x< data.data.length; x ++){
						$('.add_new_ping_lun .add_ping_lun_xuni_li').append('<li userId='+data.data[x].userId+'><img src="'+data.data[x].profile+'" alt="" style="width:30px; height:30px; padding:10px; vertical-align:middle;"><span style="vertical-align:middle;">'+data.data[x].nickName+'</span></li>');
					}
				}else{
					$('.add_new_ping_lun .add_ping_lun_user_xuni_name').removeAttr('userId');
					$('.add_new_ping_lun .add_ping_lun_xuni_li').children('li').remove();
					$('.add_new_ping_lun .add_ping_lun_xuni_li').hide();
				}
			}else{
				alert(data.data.error);	
			}	
		});				
    });
	
	//点击退出
	$('.all_commonts_look_tie_window h2').click(function(e) {
        $('.all_commonts_look_tie_window,.graybox_ping_list').hide();
		$('.all_commonts_look_tie_window').children('h2').siblings().remove();
		$('body').removeClass('over_flow_body');
    });
	
	//点击全部评论管理列表里面的查看帖子
	$('.all_commonts_table tbody>tr>td .all_commonts_table_look_tie').live('click',function(e) {
		var ok = $(this);
        //判断是视频还是文章
		if(ok.attr('postType') == 1){//文章
			$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getArticleDetail/2.5.3',{postId:ok.attr('postId'),postType:1},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.all_commonts_look_tie_window,.graybox_ping_list').show();
					for(var x = 0 ; x < data.data.articles.length; x ++){
						if(data.data.articles[x].type == 1){//标题
							$('.all_commonts_look_tie_window').append('<h3>'+data.data.articles[x].content+'</h3>');
						};
						if(data.data.articles[x].type == 2 || data.data.articles[x].type == 4){//段落
							$('.all_commonts_look_tie_window').append('<p style=" padding:5px; box-sizing:border-box;">'+data.data.articles[x].content+'</p>');
						};
						if(data.data.articles[x].type == 3){//图片
							$('.all_commonts_look_tie_window').append('<img src="'+data.data.articles[x].content+'" style=" width:100%;padding: 5px; box-sizing: border-box;" />');
						};
					}
				}else{
					alert(data.data.error);	
				}	
			});				
		};
		if(ok.attr('postType') == 2){//视频
			$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getVideoDetail/2.5.3',{postId:ok.attr('postId'),postType:2},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.all_commonts_look_tie_window,.graybox_ping_list').show();
					for(var x = 0 ; x < data.data.articles.length; x ++){
						if(data.data.articles[x].type == 1){//标题
							$('.all_commonts_look_tie_window').append('<h3>'+data.data.articles[x].content+'</h3>');
						};
						if(data.data.articles[x].type == 2 || data.data.articles[x].type == 4){//段落
							$('.all_commonts_look_tie_window').append('<p style=" padding:5px; box-sizing:border-box;">'+data.data.articles[x].content+'</p>');
						};
						if(data.data.articles[x].type == 3){//图片
							$('.all_commonts_look_tie_window').append('<img src="'+data.data.articles[x].content+'" style=" width:100%;padding: 5px; box-sizing: border-box;" />');
						};
					}
				}else{
					alert(data.data.error);	
				}	
			});				
		};
    });
	
	//点击全部评论管理列表里面的选择
	$('#ac_manage .ac-list .select_all_btn').click(function(e) {
		if($('.select_all_btn').hasClass('on') ==false){
			$('.select_all_btn').addClass('on').attr('checked','checked').prev().html('取消');
			$('.ac-list .del_all_btn,.ac-list .quanxuan_all_btn').show();
			$('.all_commonts_table tbody>tr:gt(0)').each(function(index, element) {
				$(this).children('td:eq(0)').children('.act_check').show();
			});
		}else{
			clearAllPingFn();		
		}
    });
	//点击全部评论管理列表里面的全选
	$('#ac_manage .ac-list .quanxuan_all_btn').click(function(e) {
		if($('.quanxuan_all_btn').hasClass('on') ==false){
			$('.ac-list .del_all_btn,.ac-list .quanxuan_all_btn').show();
			$('.all_commonts_table tbody>tr:gt(0)').each(function(index, element) {
				$(this).children('td:eq(0)').children('.act_check').show().addClass('check').attr('checked','checked');
			});
		}else{
			clearAllPingFn();		
		}
    });
	
	//点击某一个帖子列表里面的选择
	$('#ac_manage .ac_everyOne_list .select_everyone_btn').click(function(e) {
		if($('.select_everyone_btn').hasClass('on') ==false){
			$('.select_everyone_btn').addClass('on').attr('checked','checked').prev().html('取消');
			$('.ac_everyOne_list .del_everyone_btn,.ac_everyOne_list .quanxuan_everyone_btn').show();
			$('.everyone_commonts_table tbody>tr:gt(0)').each(function(index, element) {
				$(this).children('td').children('input.act_check').show();
			});
		}else{
			clearEveryOnePingFn();		
		}
    });
	
	//点击某一个帖子列表里面的全部
	$('#ac_manage .ac_everyOne_list .quanxuan_everyone_btn').click(function(e) {
		if($('.quanxuan_everyone_btn').hasClass('on') ==false){
			$('.ac_everyOne_list .del_everyone_btn,.ac_everyOne_list .quanxuan_everyone_btn').show();
			$('.everyone_commonts_table tbody>tr:gt(0)').each(function(index, element) {
				$(this).children('td').children('input.act_check').show().addClass('check').attr('checked','checked');
			});
		}else{
			clearEveryOnePingFn();		
		}
    });
	
	//批量删除全部评论列表里的评论
	//删除多个楼层和层中层V2.5.3
	//全部评论管理里面的弹框删除按钮
	$('.ac-list .del_all_btn').click(function(e) {
		var r = confirm('确认删除？？');
		var commentIds = '';
		var replyIds = '';
		if(r == true){
			$('.all_commonts_table tbody>tr:gt(0)').each(function(index, element) {
				if($(this).children('td:eq(0)').children('.act_check').hasClass('check')){
					//判断是层主还是层中层
					if($(this).attr('commentType') == 1){//层主
						commentIds += $(this).attr('commentId')+',';
					};
					if($(this).attr('commentType') == 2){//层中层
						replyIds += $(this).attr('replyId')+',';
					};
				}
			});
			commentIds = commentIds.substring(0,commentIds.length -1);
			replyIds = replyIds.substring(0,replyIds.length -1);
			console.log('commentIds_______'+ commentIds.substring(0,commentIds.length -1));
			console.log('replyIds_________'+replyIds.substring(0,replyIds.length -1));
			$('.all_commonts_del_window,.graybox').show();
			$('.all_commonts_del_window').addClass('del_list_btn');
			$('.all_commonts_del_window .acw_btn_save').attr({'commentIds':commentIds,'replyIds':replyIds});
		};
    });
	
	//某一个帖子列表里的删除按钮
	$('.ac_everyOne_list .del_everyone_btn').click(function(e) {
		var commentIds = '';
		var replyIds = '';
		var r = confirm('确认删除？？');
		if(r == true){
			$('.everyone_commonts_table tbody>tr:gt(0)').each(function(index, element) {
				if($(this).children('td').children('input.act_check').hasClass('check')){
					//判断是层主还是层中层
					if($(this).attr('commentType') == 1){//层主
						commentIds += $(this).attr('commentId')+',';
					};
					if($(this).attr('commentType') == 2){//层中层
						replyIds += $(this).attr('replyId')+',';
					};
				}
			});
			commentIds = commentIds.substring(0,commentIds.length -1);
			replyIds = replyIds.substring(0,replyIds.length -1);
			console.log('commentIds_______'+ commentIds.substring(0,commentIds.length -1));
			console.log('replyIds_________'+replyIds.substring(0,replyIds.length -1));
			$('.all_commonts_del_window,.graybox').show();
			$('.all_commonts_del_window').addClass('del_list_btn');
			$('.all_commonts_del_window .acw_btn_save').attr({'commentIds':commentIds,'replyIds':replyIds});
		}
    });
	
	//点击全部评论管理列表里的复选按钮
	$('.all_commonts_table tbody>tr>td .act_check').live('click',function(e) {
        if($(this).hasClass('check')){
			$(this).removeClass('check').removeClass('checked');
			$('.ac-list .select_all_btn').removeClass('on').removeAttr('checked');
		}else{
			$(this).addClass('check').attr('checked','checked');
		}
    });
	
	//点击某一个帖子列表里的复选按钮
	$('.everyone_commonts_table tbody>tr>td .act_check').live('click',function(e) {
        if($(this).hasClass('check')){
			$(this).removeClass('check').removeClass('checked');
			$('.ac_everyOne_list .select_everyone_btn').removeClass('on').removeAttr('checked');
		}else{
			$(this).addClass('check').attr('checked','checked');
		}
    });
	
	// 点击“全部评论管理”--》搜索按钮
	$('.ac-list .searchad-btn').click(function(){
		loadAllCommentsPage(0);	
	});

	//点击“全部评论管理”--》全部取消按钮 
	$('.ac-list .cancle-btn').click(function(e) {
        $('.ac-list .ping_name').val('');
		$('.ac-list .ping_content').val('');
		$('.ac-list .acstartTime').val('');
		$('.ac-list .acendTime').val('');
    });
	
	//点击“某个帖子对应的评论”--》搜索
	$('.ac_everyOne_list .searchad-btn').click(function(){
		loadEveryOneTiePage($('.ac_everyOne_list').attr('type'),$('.ac_everyOne_list').attr('id'),0);	
	});
	
	//点击删除楼层
	$('.all_commonts_table .del_lou_ceng,.everyone_commonts_table tbody .ael_del_ceng').live('click',function(e) {
		$('.all_commonts_del_window,.graybox').show();
		$('.all_commonts_del_window .acw_btn_save').attr({'commentId':$(this).attr('commentId'),'replyId':$(this).attr('replyId'),'commentType':$(this).attr('commentType')});
		$('.all_commonts_del_window').removeClass('del_list_btn');
    });
	
	//删除原因弹窗单选按钮操作
	$('.acd_content>input[name="ac_check"]').click(function(e) {
        $(this).addClass('on').attr('checked','checked').siblings().removeClass('on').removeAttr('checked');
    });
	
	//点击删除原因弹框里的保存按钮
	$('.all_commonts_del_window .acw_btn_save').click(function(e) {
		var deleteType = '';
		var reasons = $.trim($('.all_commonts_del_window .ac_reason').val());
		var ok = $(this);
		//判断入口
		if($('.all_commonts_del_window').hasClass('del_list_btn')){//勾选列表
			//判断deleteType类型
			$('.acd_content>input[name="ac_check"]').each(function(index, element) {
				if($(this).hasClass('on')){
					deleteType= $(this).attr('value');	
				}	
			});
			//如果deleteType为3
			if(deleteType == 3 && reasons == ''){
				alert('删除原因不能为空！！');
			}else{
				$('.loading,.graybox_ping_list').show();
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/post/deleteCommentsAndReplies/2.5.3',{commentIds:$('.all_commonts_del_window .acw_btn_save').attr('commentIds'),replyIds:$('.all_commonts_del_window .acw_btn_save').attr('replyIds'),deleteType:deleteType,reasons:reasons},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						loadAllCommentsPage($('body').attr('page'));
						loadEveryOneTiePage($('.ac_everyOne_list').attr('type'),$('.ac_everyOne_list').attr('id'),$('body').attr('page'));
						$('.loading,.graybox_ping_list').hide();
					}else{
						alert(data.data.error);	
						$('.loading,.graybox_ping_list').hide();
					}	
				});				
			}
		}else{
			//判断deleteType类型
			$('.acd_content>input[name="ac_check"]').each(function(index, element) {
				if($(this).hasClass('on')){
					deleteType= $(this).attr('value');	
				}	
			});
			//如果deleteType为3
			if(deleteType == 3 && reasons == ''){
				alert('删除原因不能为空！！');
			}else{
				//判断是层主还是层中层
				if(ok.attr('commentType') == 1){//层主
					$('.loading,.graybox_ping_list').show();
					$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/post/deleteComment/2.5.3',{commentId:$(this).attr('commentId'),deleteType:deleteType,reasons:reasons},function(data){
						var data = $.parseJSON(data);
						if(data.code == 0){
							loadAllCommentsPage($('body').attr('page'));
							loadEveryOneTiePage($('.ac_everyOne_list').attr('type'),$('.ac_everyOne_list').attr('id'),$('body').attr('page'));
							$('.loading,.graybox_ping_list').hide();
						}else{
							alert(data.data.error);	
						}	
				  });
				}
				if(ok.attr('commentType') == 2){//层中层
					$('.loading,.graybox_ping_list').show();
					$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/post/deleteReply/2.5.3',{replyId:$(this).attr('replyId'),deleteType:deleteType,reasons:reasons},function(data){
						var data = $.parseJSON(data);
						if(data.code == 0){
							loadEveryOneTiePage($('.ac_everyOne_list').attr('type'),$('.ac_everyOne_list').attr('id'),$('body').attr('page'));
							loadAllCommentsPage($('body').attr('page'));
							$('.loading,.graybox_ping_list').hide();
						}else{
							alert(data.data.error);	
							$('.loading,.graybox_ping_list').hide();
						}
					});
				}
			}
		}
		$('.graybox,.all_commonts_del_window').hide();
		$('.all_commonts_del_window .ac_reason').val('');
    });
	
	//点击评论弹框里面的取消按钮关闭删除平乱弹框
	$('.all_commonts_del_window .acw_btn_cancle,.graybox').click(function(e) {
        $('.all_commonts_del_window,.graybox').hide();
		$('.all_commonts_del_window .ac_reason').val('');
    });
		
	//屏蔽评论或者回复
	$('.all_commonts_table .ping_bi,.ac_everyOne_list .ael_del_ping_bi').live('click',function(e) {
		var btn = $(this);
		var r = confirm('确定要屏蔽此条评论？？');
		if(r == true){
			if(btn.attr('commentType') == 1){
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/post/shieldComment/2.0.0',{commentType:btn.attr('commentType'),targetId:btn.attr('commentId')},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						loadAllCommentsPage($('body').attr('page'));
						loadEveryOneTiePage($('.ac_everyOne_list').attr('type'),$('.ac_everyOne_list').attr('id'),$('body').attr('page'));
					}else{
						alert(data.data.error);	
					}	
				});
			}
			if(btn.attr('commentType') == 2){
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/post/shieldComment/2.0.0',{commentType:btn.attr('commentType'),targetId:btn.attr('replyId')},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						loadAllCommentsPage($('body').attr('page'));
						loadEveryOneTiePage($('.ac_everyOne_list').attr('type'),$('.ac_everyOne_list').attr('id'),$('body').attr('page'));	
					}else{
						alert(data.data.error);	
					}	
				});
			}
		}
    });
	
	//取消屏蔽评论或者回复
	$('.all_commonts_table .cancle_ping_bi,.ac_everyOne_list .ael_del_ping_bi_cancle').live('click',function(e) {
		var btn = $(this);
		var r = confirm('确定要取消屏蔽此条评论？？');
		if(r == true){
			if(btn.attr('commentType') == 1){
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/post/cancelShieldComment/2.0.0',{commentType:btn.attr('commentType'),targetId:btn.attr('commentId')},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						loadAllCommentsPage($('body').attr('page'));
						loadEveryOneTiePage($('.ac_everyOne_list').attr('type'),$('.ac_everyOne_list').attr('id'),$('body').attr('page'));	
					}else{
						alert(data.data.error);	
					}	
				});
			}
			if(btn.attr('commentType') == 2){
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/post/cancelShieldComment/2.0.0',{commentType:btn.attr('commentType'),targetId:btn.attr('replyId')},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						loadAllCommentsPage($('body').attr('page'));
						loadEveryOneTiePage($('.ac_everyOne_list').attr('type'),$('.ac_everyOne_list').attr('id'),$('body').attr('page'));	
					}else{
						alert(data.data.error);	
					}	
				});
			}
		}
	});
	
	//回复层主或者层中层
	$('.ac-list .hui_fu,.ac_everyOne_list .ael_replay').live('click',function(e) {
		//清除原有数据
		$('.add_ping_lun .apl_ping_user_id').val('');
		$('.add_ping_lun .apl_ping_conent').val('');
		$('#ac_manage .add_ping_lun .add_ping_lun_user_xuni_name').val('');
		
		//判断当前是曾中层还是层主
		if($(this).attr('commentType') == 1){//层主
			$('.apl_ping_conent').attr('placeholder','回复层主');
		}
		if($(this).attr('commentType') == 2){//层中层
			$('.apl_ping_conent').attr('placeholder','回复'+ $(this).parent().parent().children('td:eq(2)').children('span').html());
		}
		$('.graybox').show();
        $('.add_ping_lun').show();
		$('.add_ping_lun').attr('commentId',$(this).attr('commentId'));
		$('.add_ping_lun').attr('replyId',$(this).attr('replyId'));
		$('.add_ping_lun').attr('commentType',$(this).attr('commentType'));
    });
	
	//点击回复弹框里面的发送按钮
	$('.add_ping_lun .apl_btn_send').click(function(e) {
		//判断是层主还是层中层回复
		if($('.add_ping_lun').attr('commentType') == 1){//层主
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/post/reply/2.0.0',{commentId:$('.add_ping_lun').attr('commentId'),userId:$('.add_ping_lun .apl_ping_user_id').val(),content:$('.add_ping_lun .apl_ping_conent').val()},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.graybox').hide();
					$('.add_ping_lun').hide();
					alert('发送成功！！');
					loadEveryOneTiePage($('.ac_everyOne_list').attr('type'),$('.ac_everyOne_list').attr('id'),$('body').attr('page'));
					loadAllCommentsPage($('body').attr('page'));
				}else{
					alert(data.data.error);	
				}
			});
		}
		if($('.add_ping_lun').attr('commentType') == 2){//层中层
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/post/reply/2.0.0',{commentId:$('.add_ping_lun').attr('commentId'),replyId:$('.add_ping_lun').attr('replyId'),userId:$('.add_ping_lun .apl_ping_user_id').val(),content:$('.add_ping_lun .apl_ping_conent').val()},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.graybox').hide();
					$('.add_ping_lun').hide();
					alert('发送成功！！');
					loadEveryOneTiePage($('.ac_everyOne_list').attr('type'),$('.ac_everyOne_list').attr('id'),$('body').attr('page'));
					loadAllCommentsPage($('body').attr('page'));
				}else{
					alert(data.data.error);	
				}
			});
		}
    });
	
	//点击新增评论弹框里面的发送按钮
	$('.add_new_ping_lun .apl_btn_send').click(function(e) {
		var userId = '';
		if($.trim($('.add_new_ping_lun .apl_ping_user_id').val()) != ''){
			userId = $('.add_new_ping_lun .apl_ping_user_id').val();		
		}else if($.trim($('.add_new_ping_lun .add_ping_lun_user_xuni_name').val()) != ''){
			userId = $('.add_new_ping_lun .add_ping_lun_user_xuni_name').attr('userId');
		}else if($.trim($('.add_new_ping_lun .apl_ping_user_id').val()) != '' && $.trim($('.add_new_ping_lun .add_ping_lun_user_xuni_name').val()) != ''){
			userId = $('.add_new_ping_lun .apl_ping_user_id').val();	
		}
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/post/comment/2.0.0',{postId:$('.ac_everyOne_list .add_new_ping').attr('postId'),postType:$('.ac_everyOne_list .add_new_ping').attr('postType'),userId:userId,content:$('.add_new_ping_lun .apl_ping_conent').val()},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.graybox').hide();
				$('.add_new_ping_lun').hide();
				alert('发送成功！！');
				loadEveryOneTiePage($('.ac_everyOne_list').attr('type'),$('.ac_everyOne_list').attr('id'),$('body').attr('page'));
				loadAllCommentsPage($('body').attr('page'));
			}else{
				alert(data.data.error);	
			}
		});
    });
	
	//点击弹框里面的取消按钮
	$('.add_ping_lun .apl_btn_cancle,.add_new_ping_lun .apl_btn_cancle,.graybox').click(function(e) {
		$('.graybox').hide();
        $('.add_ping_lun').hide();
		$('.add_new_ping_lun').hide();
    });
	
	//点击新增评论
	$('.ac_everyOne_list .add_new_ping').click(function(e) {
		$('.apl_ping_conent').attr('placeholder','请输入评论内容');
		$('.add_new_ping_lun').attr('postId',$(this).attr('postId'))//存储
		$('.add_new_ping_lun').attr('postType',$(this).attr('postType'))//存储
		$('.graybox').show();
        $('.add_new_ping_lun').show();
		$('.add_new_ping_lun .add_ping_lun_user_xuni_name').val('');
		$('.add_new_ping_lun .apl_ping_user_id').val('');
		$('.add_new_ping_lun .apl_ping_conent').val('');
    });
	
	//上传视频封面图
	$('.vaoe_file_cover').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('#vaoe_img_cover').attr('src',data.result.data.url);
		}
	});
	
	//上传第一张配图
	$('.vaoe_file_zhen').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('#vaoe_img_zhen').attr('src',data.result.data.url);
		}
	});
	
	//全部评论列表跳转到某一页
	$('.all_commonts_redirect_page .all_commonts_redirect_page_ok').click(function(e) {
        loadAllCommentsPage($.trim($('.all_commonts_redirect_page .all_commonts_redirect_page_num').val()));
    });
	
	//某一个帖子对应的所有评论列表跳转到某一页
	$('.everyone_commonts_redirect_page .everyone_commonts_redirect_page_ok').click(function(e) {
        loadEveryOneTiePage($('.ac_everyOne_list').attr('type'),$('.ac_everyOne_list').attr('id'),$.trim($('.everyone_commonts_redirect_page .everyone_commonts_redirect_page_num').val()));
    });
	
	//从用户管理查看该用户所有评论后点击返回按钮，返回到该用户的权限管理
	$('.ac-list .topbtn.return_btn').click(function(e) {
        $('#ac_manage').hide();
		$('.user_competence_manage').show();
    });
});

//创建全部评论管理列表分页
function createAllCommentsPage(data){
	$(".ac-list .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getAllCommentsSearchParams();
			params.page = p;
			$('.all_commonts_table>tbody>tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/post/getAllComments/2.5.3',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initAllCommentsPage
			});			
		}
	});
}

//初始化全部评论管理分页
function initAllCommentsPage(data){
	$('.all_commonts_redirect_page_num').val('');
	clearAllPingFn();
	if(data.code == 0){
		$('body').attr('page',data.data.currnetPageNum);
		createAllCommentsPage(data);
		if(data.data.pageData.length > 0){
			for(var x = 0; x < data.data.pageData.length ; x ++){
				//被举报未处理
				if($('.ac-list .ju_bao_status option:selected').attr('value') == 1){//被举报未处理
					//判断屏蔽状态
					if(data.data.pageData[x].shieldType == 0){//未屏蔽
						//判断举报状态
						if(data.data.pageData[x].reportStatus == 1){//已举报未处理
							//判断评论者身份
							if(data.data.pageData[x].commentatorIdentity =='层中层'){
								$('.all_commonts_table tbody').append('<tr replyId="'+data.data.pageData[x].replyId+'" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" postId="'+data.data.pageData[x].postId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+tieKinds(data.data.pageData[x].postType)+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" userId="'+data.data.pageData[x].userId+'"/></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td>'+data.data.pageData[x].content+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td>'+data.data.pageData[x].postTitle+'<br /><input type="button" value="查看帖子" class="all_commonts_table_look_tie" style=" padding: 7px; color:#fff; background:#51a351;" postId="'+data.data.pageData[x].postId+'" postType="'+data.data.pageData[x].postType+'"></td><td><input type="button" value="查看所属帖子的所有评论" postTitle="'+data.data.pageData[x].postTitle+'"  postType="'+data.data.pageData[x].postType+'" postId="'+data.data.pageData[x].postId+'" style="width:160px; background: #51a351 !important;" class="padding look_all_tie_ping" /><br /><input type="button" value="回复" style="background: #51a351 !important;" class="padding hui_fu" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/> <input type="button" style="background: #bd362f;" value="删除" class="padding del_lou_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" style=" background: #bd362f;" value="屏蔽" class="padding ping_bi" /><br /><input type="button" value="管理举报" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" style="width:160px; background: #51a351 !important;" class="padding ju_bao_manage_all" /></td></tr>');
							}else{
								$('.all_commonts_table tbody').append('<tr replyId="'+data.data.pageData[x].replyId+'" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" postId="'+data.data.pageData[x].postId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+tieKinds(data.data.pageData[x].postType)+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td>'+data.data.pageData[x].content+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td>'+data.data.pageData[x].postTitle+'<br /><input type="button" value="查看帖子" class="all_commonts_table_look_tie" style=" padding: 7px; color:#fff; background:#51a351;" postId="'+data.data.pageData[x].postId+'" postType="'+data.data.pageData[x].postType+'"></td><td><input type="button" value="查看所属帖子的所有评论" postTitle="'+data.data.pageData[x].postTitle+'"  postType="'+data.data.pageData[x].postType+'" postId="'+data.data.pageData[x].postId+'" style="width:160px; background: #51a351 !important;" class="padding look_all_tie_ping" /><br /><input type="button" value="回复" style="background: #51a351 !important;" class="padding hui_fu" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/> <input type="button" style="background: #bd362f;" value="删除楼层" class="padding del_lou_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" style=" background: #bd362f;" value="屏蔽" class="padding ping_bi" /><br /><input type="button" value="管理举报" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" style="width:160px; background: #51a351 !important;" class="padding ju_bao_manage_all" /></td></tr>');
							}
						}else{
							//判断评论者身份
							if(data.data.pageData[x].commentatorIdentity =='层中层'){
								$('.all_commonts_table tbody').append('<tr replyId="'+data.data.pageData[x].replyId+'" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" postId="'+data.data.pageData[x].postId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+tieKinds(data.data.pageData[x].postType)+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td>'+data.data.pageData[x].content+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td>'+data.data.pageData[x].postTitle+'<br /><input type="button" value="查看帖子" class="all_commonts_table_look_tie" style=" padding: 7px; color:#fff; background:#51a351;" postId="'+data.data.pageData[x].postId+'" postType="'+data.data.pageData[x].postType+'"></td><td><input type="button" value="查看所属帖子的所有评论" postTitle="'+data.data.pageData[x].postTitle+'"  postType="'+data.data.pageData[x].postType+'" postId="'+data.data.pageData[x].postId+'" style="width:160px; background: #51a351 !important;" class="padding look_all_tie_ping" /><br /><input type="button" value="回复" style="background: #51a351 !important;" class="padding hui_fu" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/> <input type="button" style="background: #bd362f;" value="删除" class="padding del_lou_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" style=" background: #bd362f;" value="屏蔽" class="padding ping_bi" /></td></tr>');
							}else{
								$('.all_commonts_table tbody').append('<tr replyId="'+data.data.pageData[x].replyId+'" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" postId="'+data.data.pageData[x].postId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+tieKinds(data.data.pageData[x].postType)+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td>'+data.data.pageData[x].content+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td>'+data.data.pageData[x].postTitle+'<br /><input type="button" value="查看帖子" class="all_commonts_table_look_tie" style=" padding: 7px; color:#fff; background:#51a351;" postId="'+data.data.pageData[x].postId+'" postType="'+data.data.pageData[x].postType+'"></td><td><input type="button" value="查看所属帖子的所有评论" postTitle="'+data.data.pageData[x].postTitle+'"  postType="'+data.data.pageData[x].postType+'" postId="'+data.data.pageData[x].postId+'" style="width:160px; background: #51a351 !important;" class="padding look_all_tie_ping" /><br /><input type="button" value="回复" style="background: #51a351 !important;" class="padding hui_fu" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/> <input type="button" style="background: #bd362f;" value="删除楼层" class="padding del_lou_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" style=" background: #bd362f;" value="屏蔽" class="padding ping_bi" /></td></tr>');
							}
						}
					}
					if(data.data.pageData[x].shieldType == 1){//已屏蔽
						//判断举报状态
						if(data.data.pageData[x].reportStatus == 1){//已举报未处理
							//判断评论者身份
							if(data.data.pageData[x].commentatorIdentity =='层中层'){
								$('.all_commonts_table tbody').append('<tr replyId="'+data.data.pageData[x].replyId+'" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" postId="'+data.data.pageData[x].postId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+tieKinds(data.data.pageData[x].postType)+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td>'+data.data.pageData[x].content+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td>'+data.data.pageData[x].postTitle+'<br /><input type="button" value="查看帖子" class="all_commonts_table_look_tie" style=" padding: 7px; color:#fff; background:#51a351;" postId="'+data.data.pageData[x].postId+'" postType="'+data.data.pageData[x].postType+'"></td><td><input type="button" value="查看所属帖子的所有评论" postTitle="'+data.data.pageData[x].postTitle+'" postType="'+data.data.pageData[x].postType+'" postId="'+data.data.pageData[x].postId+'"  style="width:160px; background: #51a351 !important;" class="padding look_all_tie_ping" /><br /><input type="button" value="回复" style="background: #51a351 !important;" class="padding hui_fu" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" style="background: #bd362f;" value="删除" class="padding del_lou_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" style=" background: #bd362f;" value="取消屏蔽" class="padding cancle_ping_bi" /><br /><input type="button" value="管理举报"  commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" style="width:160px; background: #51a351 !important;" class="padding ju_bao_manage_all" /></td></tr>');
							}else{
								$('.all_commonts_table tbody').append('<tr replyId="'+data.data.pageData[x].replyId+'" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" postId="'+data.data.pageData[x].postId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+tieKinds(data.data.pageData[x].postType)+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td>'+data.data.pageData[x].content+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td>'+data.data.pageData[x].postTitle+'<br /><input type="button" value="查看帖子" class="all_commonts_table_look_tie" style=" padding: 7px; color:#fff; background:#51a351;" postId="'+data.data.pageData[x].postId+'" postType="'+data.data.pageData[x].postType+'"></td><td><input type="button" value="查看所属帖子的所有评论" postTitle="'+data.data.pageData[x].postTitle+'" postType="'+data.data.pageData[x].postType+'" postId="'+data.data.pageData[x].postId+'"  style="width:160px; background: #51a351 !important;" class="padding look_all_tie_ping" /><br /><input type="button" value="回复" style="background: #51a351 !important;" class="padding hui_fu" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" style="background: #bd362f;" value="删除楼层" class="padding del_lou_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" style=" background: #bd362f;" value="取消屏蔽" class="padding cancle_ping_bi" /><br /><input type="button" value="管理举报"  commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" style="width:160px; background: #51a351 !important;" class="padding ju_bao_manage_all" /></td></tr>');
							}
						}else{
							//判断评论者身份
							if(data.data.pageData[x].commentatorIdentity =='层中层'){
								  $('.all_commonts_table tbody').append('<tr replyId="'+data.data.pageData[x].replyId+'" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" postId="'+data.data.pageData[x].postId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+tieKinds(data.data.pageData[x].postType)+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td>'+data.data.pageData[x].content+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td>'+data.data.pageData[x].postTitle+'<br /><input type="button" value="查看帖子" class="all_commonts_table_look_tie" style=" padding: 7px; color:#fff; background:#51a351;" postId="'+data.data.pageData[x].postId+'" postType="'+data.data.pageData[x].postType+'"></td><td><input type="button" value="查看所属帖子的所有评论" postTitle="'+data.data.pageData[x].postTitle+'" postType="'+data.data.pageData[x].postType+'" postId="'+data.data.pageData[x].postId+'"  style="width:160px; background: #51a351 !important;" class="padding look_all_tie_ping" /><br /><input type="button" value="回复" style="background: #51a351 !important;" class="padding hui_fu" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" style="background: #bd362f;" value="删除" class="padding del_lou_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" style=" background: #bd362f;" value="取消屏蔽" class="padding cancle_ping_bi" /></td></tr>');
							}else{
								$('.all_commonts_table tbody').append('<tr replyId="'+data.data.pageData[x].replyId+'" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" postId="'+data.data.pageData[x].postId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+tieKinds(data.data.pageData[x].postType)+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td>'+data.data.pageData[x].content+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td>'+data.data.pageData[x].postTitle+'<br /><input type="button" value="查看帖子" class="all_commonts_table_look_tie" style=" padding: 7px; color:#fff; background:#51a351;" postId="'+data.data.pageData[x].postId+'" postType="'+data.data.pageData[x].postType+'"></td><td><input type="button" value="查看所属帖子的所有评论" postTitle="'+data.data.pageData[x].postTitle+'" postType="'+data.data.pageData[x].postType+'" postId="'+data.data.pageData[x].postId+'"  style="width:160px; background: #51a351 !important;" class="padding look_all_tie_ping" /><br /><input type="button" value="回复" style="background: #51a351 !important;" class="padding hui_fu" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" style="background: #bd362f;" value="删除楼层" class="padding del_lou_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" style=" background: #bd362f;" value="取消屏蔽" class="padding cancle_ping_bi" /></td></tr>');
							}
						}
					}
				}else{
					//判断屏蔽状态
					if(data.data.pageData[x].shieldType == 0){//未屏蔽
						//判断举报状态
						if(data.data.pageData[x].reportStatus == 1){//已举报未处理
							//判断评论者身份
							if(data.data.pageData[x].commentatorIdentity =='层中层'){
								$('.all_commonts_table tbody').append('<tr replyId="'+data.data.pageData[x].replyId+'" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" postId="'+data.data.pageData[x].postId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+tieKinds(data.data.pageData[x].postType)+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td>'+data.data.pageData[x].content+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td>'+data.data.pageData[x].postTitle+'<br /><input type="button" value="查看帖子" class="all_commonts_table_look_tie" style=" padding: 7px; color:#fff; background:#51a351;" postId="'+data.data.pageData[x].postId+'" postType="'+data.data.pageData[x].postType+'"></td><td><input type="button" value="查看所属帖子的所有评论" postTitle="'+data.data.pageData[x].postTitle+'"  postType="'+data.data.pageData[x].postType+'" postId="'+data.data.pageData[x].postId+'" style="width:160px; background: #51a351 !important;" class="padding look_all_tie_ping" /><br /><input type="button" value="回复" style="background: #51a351 !important;" class="padding hui_fu" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/> <input type="button" style="background: #bd362f;" value="删除" class="padding del_lou_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" style=" background: #bd362f;" value="屏蔽" class="padding ping_bi" /><br /><input type="button" value="管理举报"  commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" style="width:160px; background: #51a351 !important;" class="padding ju_bao_manage_all" /></td></tr>');
							}else{
								$('.all_commonts_table tbody').append('<tr replyId="'+data.data.pageData[x].replyId+'" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" postId="'+data.data.pageData[x].postId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+tieKinds(data.data.pageData[x].postType)+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td>'+data.data.pageData[x].content+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td>'+data.data.pageData[x].postTitle+'<br /><input type="button" value="查看帖子" class="all_commonts_table_look_tie" style=" padding: 7px; color:#fff; background:#51a351;" postId="'+data.data.pageData[x].postId+'" postType="'+data.data.pageData[x].postType+'"></td><td><input type="button" value="查看所属帖子的所有评论" postTitle="'+data.data.pageData[x].postTitle+'"  postType="'+data.data.pageData[x].postType+'" postId="'+data.data.pageData[x].postId+'" style="width:160px; background: #51a351 !important;" class="padding look_all_tie_ping" /><br /><input type="button" value="回复" style="background: #51a351 !important;" class="padding hui_fu" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/> <input type="button" style="background: #bd362f;" value="删除楼层" class="padding del_lou_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" style=" background: #bd362f;" value="屏蔽" class="padding ping_bi" /><br /><input type="button" value="管理举报"  commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" style="width:160px; background: #51a351 !important;" class="padding ju_bao_manage_all" /></td></tr>');
							}
						}else{
							//判断评论者身份
							if(data.data.pageData[x].commentatorIdentity =='层中层'){
								$('.all_commonts_table tbody').append('<tr replyId="'+data.data.pageData[x].replyId+'" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" postId="'+data.data.pageData[x].postId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+tieKinds(data.data.pageData[x].postType)+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td>'+data.data.pageData[x].content+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td>'+data.data.pageData[x].postTitle+'<br /><input type="button" value="查看帖子" class="all_commonts_table_look_tie" style=" padding: 7px; color:#fff; background:#51a351;" postId="'+data.data.pageData[x].postId+'" postType="'+data.data.pageData[x].postType+'"></td><td><input type="button" value="查看所属帖子的所有评论" postTitle="'+data.data.pageData[x].postTitle+'"  postType="'+data.data.pageData[x].postType+'" postId="'+data.data.pageData[x].postId+'" style="width:160px; background: #51a351 !important;" class="padding look_all_tie_ping" /><br /><input type="button" value="回复" style="background: #51a351 !important;" class="padding hui_fu" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/> <input type="button" style="background: #bd362f;" value="删除" class="padding del_lou_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" style=" background: #bd362f;" value="屏蔽" class="padding ping_bi" /></td></tr>');
							}else{
								$('.all_commonts_table tbody').append('<tr replyId="'+data.data.pageData[x].replyId+'" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" postId="'+data.data.pageData[x].postId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+tieKinds(data.data.pageData[x].postType)+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td>'+data.data.pageData[x].content+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td>'+data.data.pageData[x].postTitle+'<br /><input type="button" value="查看帖子" class="all_commonts_table_look_tie" style=" padding: 7px; color:#fff; background:#51a351;" postId="'+data.data.pageData[x].postId+'" postType="'+data.data.pageData[x].postType+'"></td><td><input type="button" value="查看所属帖子的所有评论" postTitle="'+data.data.pageData[x].postTitle+'"  postType="'+data.data.pageData[x].postType+'" postId="'+data.data.pageData[x].postId+'" style="width:160px; background: #51a351 !important;" class="padding look_all_tie_ping" /><br /><input type="button" value="回复" style="background: #51a351 !important;" class="padding hui_fu" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/> <input type="button" style="background: #bd362f;" value="删除楼层" class="padding del_lou_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" style=" background: #bd362f;" value="屏蔽" class="padding ping_bi" /></td></tr>');
							}
						}
					}
					if(data.data.pageData[x].shieldType == 1){//已屏蔽
						//判断举报状态
						if(data.data.pageData[x].reportStatus == 1){//已举报未处理
							//判断评论者身份
							if(data.data.pageData[x].commentatorIdentity =='层中层'){
								$('.all_commonts_table tbody').append('<tr replyId="'+data.data.pageData[x].replyId+'" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" postId="'+data.data.pageData[x].postId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+tieKinds(data.data.pageData[x].postType)+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td>'+data.data.pageData[x].content+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td>'+data.data.pageData[x].postTitle+'<br /><input type="button" value="查看帖子" class="all_commonts_table_look_tie" style=" padding: 7px; color:#fff; background:#51a351;" postId="'+data.data.pageData[x].postId+'" postType="'+data.data.pageData[x].postType+'"></td><td><input type="button" value="查看所属帖子的所有评论" postTitle="'+data.data.pageData[x].postTitle+'" postType="'+data.data.pageData[x].postType+'" postId="'+data.data.pageData[x].postId+'"  style="width:160px; background: #51a351 !important;" class="padding look_all_tie_ping" /><br /><input type="button" value="回复" style="background: #51a351 !important;" class="padding hui_fu" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" style="background: #bd362f;" value="删除" class="padding del_lou_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" style=" background: #bd362f;" value="取消屏蔽" class="padding cancle_ping_bi" /><br /><input type="button" value="管理举报"  commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" style="width:160px; background: #51a351 !important;" class="padding ju_bao_manage_all" /></td></tr>');
							}else{
								$('.all_commonts_table tbody').append('<tr replyId="'+data.data.pageData[x].replyId+'" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" postId="'+data.data.pageData[x].postId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+tieKinds(data.data.pageData[x].postType)+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td>'+data.data.pageData[x].content+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td>'+data.data.pageData[x].postTitle+'<br /><input type="button" value="查看帖子" class="all_commonts_table_look_tie" style=" padding: 7px; color:#fff; background:#51a351;" postId="'+data.data.pageData[x].postId+'" postType="'+data.data.pageData[x].postType+'"></td><td><input type="button" value="查看所属帖子的所有评论" postTitle="'+data.data.pageData[x].postTitle+'" postType="'+data.data.pageData[x].postType+'" postId="'+data.data.pageData[x].postId+'"  style="width:160px; background: #51a351 !important;" class="padding look_all_tie_ping" /><br /><input type="button" value="回复" style="background: #51a351 !important;" class="padding hui_fu" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" style="background: #bd362f;" value="删除楼层" class="padding del_lou_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" style=" background: #bd362f;" value="取消屏蔽" class="padding cancle_ping_bi" /><br /><input type="button" value="管理举报"  commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" style="width:160px; background: #51a351 !important;" class="padding ju_bao_manage_all" /></td></tr>');
							}
						}else{
							//判断评论者身份
							if(data.data.pageData[x].commentatorIdentity =='层中层'){
								$('.all_commonts_table tbody').append('<tr replyId="'+data.data.pageData[x].replyId+'" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" postId="'+data.data.pageData[x].postId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+tieKinds(data.data.pageData[x].postType)+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td>'+data.data.pageData[x].content+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td>'+data.data.pageData[x].postTitle+'<br /><input type="button" value="查看帖子" class="all_commonts_table_look_tie" style=" padding: 7px; color:#fff; background:#51a351;" postId="'+data.data.pageData[x].postId+'" postType="'+data.data.pageData[x].postType+'"></td><td><input type="button" value="查看所属帖子的所有评论" postTitle="'+data.data.pageData[x].postTitle+'" postType="'+data.data.pageData[x].postType+'" postId="'+data.data.pageData[x].postId+'"  style="width:160px; background: #51a351 !important;" class="padding look_all_tie_ping" /><br /><input type="button" value="回复" style="background: #51a351 !important;" class="padding hui_fu" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" style="background: #bd362f;" value="删除" class="padding del_lou_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" style=" background: #bd362f;" value="取消屏蔽" class="padding cancle_ping_bi" /></td></tr>');
							}else{
								$('.all_commonts_table tbody').append('<tr replyId="'+data.data.pageData[x].replyId+'" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" postId="'+data.data.pageData[x].postId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+tieKinds(data.data.pageData[x].postType)+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td>'+data.data.pageData[x].content+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td>'+data.data.pageData[x].postTitle+'<br /><input type="button" value="查看帖子" class="all_commonts_table_look_tie" style=" padding: 7px; color:#fff; background:#51a351;" postId="'+data.data.pageData[x].postId+'" postType="'+data.data.pageData[x].postType+'"></td><td><input type="button" value="查看所属帖子的所有评论" postTitle="'+data.data.pageData[x].postTitle+'" postType="'+data.data.pageData[x].postType+'" postId="'+data.data.pageData[x].postId+'"  style="width:160px; background: #51a351 !important;" class="padding look_all_tie_ping" /><br /><input type="button" value="回复" style="background: #51a351 !important;" class="padding hui_fu" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" style="background: #bd362f;" value="删除楼层" class="padding del_lou_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" style=" background: #bd362f;" value="取消屏蔽" class="padding cancle_ping_bi" /></td></tr>');
							}
						}
					}
				}
			}
		}
	}else{
		alert(data.data.error);	
	}
}

//获取全部评论管理查询参数
function getAllCommentsSearchParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	var re=new RegExp("[\\-,\\:, ]","g");
	params.page = page;
	params.shieldType = $('.ac-list .ping_bi_status option:selected').attr('value');
	params.reportStatus = $('.ac-list .ju_bao_status option:selected').attr('value');
	//只显示近七天的评论
	/*if($.trim($('.ac-list .acstartTime').val()) == '' && $.trim($('.ac-list .acendTime').val()) == ''){
		var re=new RegExp("[\\-,\\:, ]","g");
		Date.prototype.format = function(format) {
			var o = {
				"M+" :this.getMonth() + 1, // month
				"d+" :this.getDate(), // day
				"h+" :this.getHours(), // hour
				"m+" :this.getMinutes(), // minute
				"s+" :this.getSeconds(), // second
				"q+" :Math.floor((this.getMonth() + 3) / 3), // quarter
				"S" :this.getMilliseconds()
			}
		
			if (/(y+)/.test(format)) {
				format = format.replace(RegExp.$1, (this.getFullYear() + "")
						.substr(4 - RegExp.$1.length));
			}
		
			for ( var k in o) {
				if (new RegExp("(" + k + ")").test(format)) {
					format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
							: ("00" + o[k]).substr(("" + o[k]).length));
				}
			}
			return format;
		}
		var now = new Date(new Date().getTime()).format("yyyy-MM-dd hh:mm");
		var end = new Date(new Date().getTime() -604000*1000).format("yyyy-MM-dd hh:mm");
		params.publishBeginTime = end.replace(re,'');
		params.publishEndTime = now.replace(re,'');
		$('.ac-list .acstartTime').val(end);
		$('.ac-list .acendTime').val(now);
	}else{*/
		params.publishBeginTime = $('.ac-list .acstartTime').val().replace(re,'');
		params.publishEndTime = $('.ac-list .acendTime').val().replace(re,'');
//	}
		params.commentatorName = $('.ac-list .ping_name').val();
		params.content = $('.ac-list .ping_content').val();
		if($('.ac-list').attr('userId') == undefined){
			params.userId = '';
		}else{
			params.userId = $('.ac-list').attr('userId');
		}
		return params;
}

//加载全部评论管理分页数据
function loadAllCommentsPage(page){
	$('.all_commonts_table>tbody>tr:gt(0)').remove();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/post/getAllComments/2.5.3',
		type : 'get',
		dataType : 'json',
		data: getAllCommentsSearchParams(page),
		success : initAllCommentsPage,
	});
}

//举报状态
function juBaoFn(num){
	if(num == 0){
		return '未被举报';	
	}	
	if(num == 1){
		return '已举报未处理';	
	}	
	if(num == 2){
		return '已举报已处理';	
	}
}

//屏蔽状态
function pingBiFn(num){
	if(num == 0){
		return '未屏蔽';	
	}	
	if(num == 1){
		return '已屏蔽';	
	}
}

//帖子类型
function tieKinds(num){
	if(num == 1){
		return '文章';	
	}
	if(num == 2){
		return '视频';	
	}	
}

/*---------------------------------------------------------  查看某一个帖子对应的所有评论 --------------------------------------------------- */
//创建某一个帖子对应的所有评论列表分页
function createEveryOneTiePage(data){
	$(".ac_everyOne_list .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getEveryOneTieSearchParams();
			params.page = p;
			params.postId = $('.ac_everyOne_list').attr('id');
			params.postType = $('.ac_everyOne_list').attr('type');
			$('.everyone_commonts_table>tbody>tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/post/getPostComments/2.3.0',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initEveryOneTiePage
			});			
		}
	});
}

//初始化某一个帖子对应的所有评论分页
function initEveryOneTiePage(data){
	$('.everyone_commonts_redirect_page_num').val('');
	clearEveryOnePingFn();
	createEveryOneTiePage(data);
	if(data.data.pageData.length > 0){
		$('body').attr('page',data.data.currnetPageNum);
		//合并单元格
		for(var x = 0; x < data.data.pageData.length ; ){
			var rowspan = getRowSpanNum(data,x);
			if(rowspan > 1){
				var spanstr = '<td rowspan="'+rowspan+'">'+data.data.pageData[x].floorNum+'</td>';
				for(var i=0;i<rowspan;i++,x++){
					//判断屏蔽状态
					if(data.data.pageData[x].shieldType == 0){//未屏蔽
						//判断是否显示管理举报按钮
						if($('.ac_everyOne_list .ju_bao_status option:selected').attr('value') == 1){//显示
							//判断举报状态
							if(data.data.pageData[x].reportStatus == 1){//已举报未处理
								if(i == 0){
									//判断评论者身份
									if(data.data.pageData[x].commentatorIdentity =='层中层'){
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'">'+spanstr+'<td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
									}else{
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'">'+spanstr+'<td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
									}
								}else{
									//判断评论者身份
									if(data.data.pageData[x].commentatorIdentity =='层中层'){
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
									}else{
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
									}
								}
							}else{
								if(i == 0){
									//判断评论者身份
									if(data.data.pageData[x].commentatorIdentity =='层中层'){
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'">'+spanstr+'<td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
									}else{
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'">'+spanstr+'<td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
									}
								}else{
									//判断评论者身份
									if(data.data.pageData[x].commentatorIdentity =='层中层'){
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
									}else{
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
									}
								}
							}
						}else{
							//判断举报状态
							if(data.data.pageData[x].reportStatus == 1){//已举报未处理
								if(i == 0){
									//判断评论者身份
									if(data.data.pageData[x].commentatorIdentity =='层中层'){
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'">'+spanstr+'<td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
									}else{
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'">'+spanstr+'<td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
									}
								}else{
									//判断评论者身份
									if(data.data.pageData[x].commentatorIdentity =='层中层'){
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
									}else{
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
									}
								}
							}else{
								if(i == 0){
									//判断评论者身份
									if(data.data.pageData[x].commentatorIdentity =='层中层'){
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'">'+spanstr+'<td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
									}else{
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'">'+spanstr+'<td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
									}
								}else{
									//判断评论者身份
									if(data.data.pageData[x].commentatorIdentity =='层中层'){
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
									}else{
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
									}
								}
							}
						}
					}
					if(data.data.pageData[x].shieldType == 1){//已屏蔽
						if($('.ac_everyOne_list .ju_bao_status option:selected').attr('value') == 1){
							//判断举报状态
							if(data.data.pageData[x].reportStatus == 1){//已举报未处理
								if(i == 0){
									//判断评论者身份
									if(data.data.pageData[x].commentatorIdentity =='层中层'){
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'">'+spanstr+'<td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
									}else{
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'">'+spanstr+'<td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
									}
								}else{
									//判断评论者身份
									if(data.data.pageData[x].commentatorIdentity =='层中层'){
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
									}else{
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
									}
								}
							}else{
								if(i == 0){
									//判断评论者身份
									if(data.data.pageData[x].commentatorIdentity =='层中层'){
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'">'+spanstr+'<td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
									}else{
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'">'+spanstr+'<td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
									}
								}else{
									//判断评论者身份
									if(data.data.pageData[x].commentatorIdentity =='层中层'){
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
									}else{
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><tall_commonts_table_quanxiand>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
									}
								}
							}
						}else{
							//判断举报状态
							if(data.data.pageData[x].reportStatus == 1){//已举报未处理
								if(i == 0){
									//判断评论者身份
									if(data.data.pageData[x].commentatorIdentity =='层中层'){
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'">'+spanstr+'<td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
									}else{
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'">'+spanstr+'<td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
									}
								}else{
									//判断评论者身份
									if(data.data.pageData[x].commentatorIdentity =='层中层'){
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
									}else{
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
									}
								}
							}else{
								if(i == 0){
									//判断评论者身份
									if(data.data.pageData[x].commentatorIdentity =='层中层'){
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'">'+spanstr+'<td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
									}else{
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'">'+spanstr+'<td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
									}
								}else{
									//判断评论者身份
									if(data.data.pageData[x].commentatorIdentity =='层中层'){
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
									}else{
										$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
									}
								}
							}
						}
					}
				}
			}else if(rowspan == 1){
				if($('.ac_everyOne_list .ju_bao_status option:selected').attr('value') == 1){
					//判断屏蔽状态
					if(data.data.pageData[x].shieldType == 0){//未屏蔽
						//判断举报状态
						if(data.data.pageData[x].reportStatus == 1){//已举报未处理
							//判断评论者身份
							if(data.data.pageData[x].commentatorIdentity =='层中层'){
								$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].floorNum+'</td><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" style=" background: #bd362f;" value="屏蔽" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
							}else{
								$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].floorNum+'</td><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" style=" background: #bd362f;" value="屏蔽" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
							}
						}else{
							//判断评论者身份
							if(data.data.pageData[x].commentatorIdentity =='层中层'){
								$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].floorNum+'</td><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" style=" background: #bd362f;" value="屏蔽" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
							}else{
								$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].floorNum+'</td><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" style=" background: #bd362f;" value="屏蔽" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
							}
						}
					}
					if(data.data.pageData[x].shieldType == 1){//已屏蔽
						//判断举报状态
						if(data.data.pageData[x].reportStatus == 1){//已举报未处理
							//判断评论者身份
							if(data.data.pageData[x].commentatorIdentity =='层中层'){
								$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].floorNum+'</td><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
							}else{
								$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].floorNum+'</td><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
							}
						}else{
							//判断评论者身份
							if(data.data.pageData[x].commentatorIdentity =='层中层'){
								$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].floorNum+'</td><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
							}else{
								$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].floorNum+'</td><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
							}
						}
					}
				}else{
					//判断屏蔽状态
					if(data.data.pageData[x].shieldType == 0){//未屏蔽
						//判断举报状态
						if(data.data.pageData[x].reportStatus == 1){//已举报未处理
							//判断评论者身份
							if(data.data.pageData[x].commentatorIdentity =='层中层'){
								$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].floorNum+'</td><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" style=" background: #bd362f;" value="屏蔽" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
							}else{
								$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].floorNum+'</td><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" style=" background: #bd362f;" value="屏蔽" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
							}
						}else{
							//判断评论者身份
							if(data.data.pageData[x].commentatorIdentity =='层中层'){
								$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].floorNum+'</td><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" style=" background: #bd362f;" value="屏蔽" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
							}else{
								$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].floorNum+'</td><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" style=" background: #bd362f;" value="屏蔽" class="ael ael_del_ping_bi" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
							}
						}
					}
					if(data.data.pageData[x].shieldType == 1){//已屏蔽
						//判断举报状态
						if(data.data.pageData[x].reportStatus == 1){//已举报未处理
							//判断评论者身份
							if(data.data.pageData[x].commentatorIdentity =='层中层'){
								$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].floorNum+'</td><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
							}else{
								$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].floorNum+'</td><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /> <input type="button" value="管理举报" class="ael ael_manage_ju_bao" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"/></td></tr>');
							}
						}else{
							//判断评论者身份
							if(data.data.pageData[x].commentatorIdentity =='层中层'){
								$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].floorNum+'</td><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>回复'+data.data.pageData[x].commentTarget+':'+data.data.pageData[x].content+'/td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
							}else{
								$('.everyone_commonts_table').append('<tr commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'"><td>'+data.data.pageData[x].floorNum+'</td><td>'+data.data.pageData[x].publishTime+'<br/><input type="checkbox" class="act_check" /></td><td>'+data.data.pageData[x].commentatorIdentity+'</td><td><span>'+data.data.pageData[x].commentatorName+'</span><input type="button" value="权限管理" class="all_commonts_table_quanxian" userId="'+data.data.pageData[x].userId+'" /></td><td>'+data.data.pageData[x].content+'</td><td>'+data.data.pageData[x].commentTarget+'</td><td>'+pingBiFn(data.data.pageData[x].shieldType)+'</td><td>'+juBaoFn(data.data.pageData[x].reportStatus)+'</td><td><input type="button" value="回复" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" class="ael ael_replay" /> <input type="button" value="删除楼层" style=" background: #bd362f;" class="ael ael_del_ceng" commentType="'+data.data.pageData[x].commentType+'" replyId="'+data.data.pageData[x].replyId+'" commentId="'+data.data.pageData[x].commentId+'" /> <input type="button" value="取消屏蔽" style=" background: #bd362f;" class="ael ael_del_ping_bi_cancle" commentType="'+data.data.pageData[x].commentType+'" commentId="'+data.data.pageData[x].commentId+'" replyId="'+data.data.pageData[x].replyId+'" /></td></tr>');
							}
						}
					}
				}
				x++;
			}
		}
	}
}


//获取某一个帖子对应的所有评论查询参数
function getEveryOneTieSearchParams(type,id,page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	var re=new RegExp("[\\-,\\:, ]","g");
	params.page = page;
	params.postId = id;
	params.postType = type;
	params.reportStatus = $('.ac_everyOne_list .ju_bao_status option:selected').attr('value');
	params.shieldType = $('.ac_everyOne_list .ping_bi_status option:selected').attr('value');
	params.commentatorName = $('.ac_everyOne_list .ping_name').val();
	params.publishBeginTime = $('.ac_everyOne_list .acstartTime').val().replace(re,"");
	params.publishEndTime = $('.ac_everyOne_list .acendTime').val().replace(re,"");
	params.content = $('.ac_everyOne_list .ping_content').val();
	return params;
}

//加载某一个帖子对应的所有评论分页数据
function loadEveryOneTiePage(type,id,page){
	$('.everyone_commonts_table>tbody>tr:gt(0)').remove();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/post/getPostComments/2.3.0',
		type : 'get',
		dataType : 'json',
		data: getEveryOneTieSearchParams(type,id,page),
		success : initEveryOneTiePage,
	});
}


//返回获取的楼层数
function getRowSpanNum(data,rowIndex){//data，行下标
	var floorNum = data.data.pageData[rowIndex].floorNum;
	var rowspanNum = 0;
	for(var i=rowIndex;i<data.data.pageData.length;i++){
		if(data.data.pageData[i].floorNum == floorNum){
			rowspanNum++;
		}else{
			return rowspanNum;
		}
	}
	return rowspanNum;
}

//清掉全部评论列表所有被选中的评论
function clearAllPingFn(){
	$('.select_all_btn').removeClass('on').removeAttr('checked').prev().html('选择');	
	$('.ac-list .del_all_btn,.ac-list .quanxuan_all_btn').hide();
	$('.ac-list .quanxuan_all_btn').removeClass('on');
	$('.all_commonts_table tbody >tr:gt(0)').each(function(index, element) {
		$(this).children('td:eq(0)').children('.act_check').hide().removeClass('check').removeAttr('checked');
	});			
}

//清掉某一个帖子里诶小所有被选中的评论
function clearEveryOnePingFn(){
	$('.select_everyone_btn').removeClass('on').removeAttr('checked').prev().html('选择');	
	$('.ac_everyOne_list .del_everyone_btn,.ac_everyOne_list .quanxuan_everyone_btn').hide();
	$('.ac_everyOne_list .quanxuan_all_btn').removeClass('on');
	$('.everyone_commonts_table tbody >tr:gt(0)').each(function(index, element) {
		$(this).children('td').children('input.act_check').hide().removeClass('check').removeAttr('checked');
	});			
}