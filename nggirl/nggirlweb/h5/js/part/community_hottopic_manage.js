$(function(){
	//热门话题-保存社区推荐的全部话题V3.0.0
	$('.community_hottopic_manage .community_hottopic_manage_content .chmc_btn_save').click(function(e) {
		var topicIds = '';
		$('.community_hottopic_manage_content .chmc_six_top .cst').each(function(index, element) {
            if($(this).children('.cst_id').attr('value') != ''){
				topicIds += $(this).children('.cst_id').attr('value') +',';
			};
        });
		topicIds = topicIds.substring(0,topicIds.length -1);
		var arr = new Array();
		var str = '';
		arr = topicIds.split(",");
		var new_arr=[];
		for(var i=0;i<arr.length;i++) {
		　　var items=arr[i];
		　　//判断元素是否存在于new_arr中，如果不存在则插入到new_arr的最后
		　　if($.inArray(items,new_arr)==-1) {
		　　　　new_arr.push(items);
		　　}
		}

		for(var x = 0; x < new_arr.length; x ++){
			str += new_arr[x]+',';	
		}
		str = str.substring(0,str.length -1);
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/hottopic/saveRecommendHotTopics/3.0.0',{topicIds:str},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				hotTopicFn();
				$('.community_hottopic_manage .community_hottopic_manage_content .chmc_btn_success').addClass('chmc_btn_edit').val('编辑').removeClass('chmc_btn_success');
			}else{
				alert(data.data.error);	
			}	
		});
    });
	
	//点击热门话题里面的编辑按钮
	$('.community_hottopic_manage .community_hottopic_manage_content .chmc_btn_edit').live('click',function(e) {
		$(this).addClass('chmc_btn_success').val('完成').removeClass('chmc_btn_edit');
		$('.community_hottopic_manage_content .chmc_six_top .cst').each(function(index, element) {
            $(this).children('.cst_id').removeAttr('disabled');
        });
	});
	
	//点击热门话题里面的完成按钮
	$('.community_hottopic_manage .community_hottopic_manage_content .chmc_btn_success').live('click',function(e) {
		$(this).addClass('chmc_btn_edit').val('编辑').removeClass('chmc_btn_success');
		$('.community_hottopic_manage_content .chmc_six_top .cst').each(function(index, element) {
            $(this).children('.cst_id').attr('disabled','disabled');
        });
	});
	
	//点击帖子管理里的新增
	$('.community_hottopic_manage_content .chmc_btn_add').click(function(e) {
		$('.add_hottopic').hide().removeAttr('topicId');
		$('.add_hottopic').removeAttr('initFansNum');
		$('.add_hottopic').removeAttr('initPostNum');
		$('.add_hottopic').removeAttr('recommendPosts');
		$('.add_hottopic .add_hottopic_cover').removeAttr('src');
		$('.add_hottopic .add_hottopic_add_title').val('');
		$('.add_hottopic .add_hottopic_para').val('');
        $('.add_hottopic').show();
		$('.community_hottopic_manage').hide();
    });
	
	//点击新增热门话题里的取消按钮
	$('.add_hottopic .add_hottopic_cancle').click(function(e) {
		$('.community_hottopic_manage_content').show();
		$('.add_hottopic').hide().removeAttr('topicId');
		$('.add_hottopic').removeAttr('initFansNum');
		$('.add_hottopic').removeAttr('initPostNum');
		$('.add_hottopic').removeAttr('recommendPosts');
		$('.add_hottopic .add_hottopic_add_title').val('');
		$('.add_hottopic .add_hottopic_para').val('');
    });
	
	//点击新增热门话题里的完成按钮
	//热门话题-新增或编辑话题V3.0.0
	$('.add_hottopic .add_hottopic_success').click(function(e) {
		var btn = $(this);
		//判断是新增还是编辑
		if(typeof($('.add_hottopic').attr('topicId')) == "undefined"){//新增
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/hottopic/saveHotTopic/3.0.0',{name:$.trim($('.add_hottopic .add_hottopic_add_title').val()),picture:$('.add_hottopic .add_hottopic_cover').attr('src'),descrip:$('.add_hottopic .add_hottopic_para').val()},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					loadHotTopicListPage();
					$('.add_hottopic').hide();
					$('.community_hottopic_manage').show();
				}else{
					alert(data.data.error);	
				}	
			});
		}else{
			if($('.add_hottopic').attr('recommendPosts') == ''){
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/hottopic/saveHotTopic/3.0.0',{topicId:$('.add_hottopic').attr('topicId'),name:$.trim($('.add_hottopic .add_hottopic_add_title').val()),picture:$('.add_hottopic .add_hottopic_cover').attr('src'),descrip:$('.add_hottopic .add_hottopic_para').val(),initFansNum:$('.add_hottopic').attr('initFansNum'),initPostNum:$('.add_hottopic').attr('initPostNum')},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						loadHotTopicListPage();
						$('.add_hottopic').hide();
						$('.community_hottopic_manage_content').show();
					}else{
						alert(data.data.error);	
					}	
				});
			}else{
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/hottopic/saveHotTopic/3.0.0',{topicId:$('.add_hottopic').attr('topicId'),name:$.trim($('.add_hottopic .add_hottopic_add_title').val()),picture:$('.add_hottopic .add_hottopic_cover').attr('src'),descrip:$('.add_hottopic .add_hottopic_para').val(),initFansNum:$('.add_hottopic').attr('initFansNum'),initPostNum:$('.add_hottopic').attr('initPostNum'),recommendPosts:$('.add_hottopic').attr('recommendPosts')},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						loadHotTopicListPage();
						$('.add_hottopic').hide();
						$('.community_hottopic_manage_content').show();
					}else{
						alert(data.data.error);	
					}	
				});
			}
		}
    });
	
	//热门话题里的编辑
	//热门话题-获取话题详情V3.0.0
	$('.chmc_hot_sort .community_hottopic_table .cht_edit_btn').live('click',function(e) {
		var btn = $(this);
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/hottopic/getHotTopic/3.0.0',{topicId:btn.attr('topicId')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.community_hottopic_manage_content').hide();
				$('.add_hottopic').show().attr('topicId',data.data.topicId);
				$('.add_hottopic .add_hottopic_cover').attr('src',data.data.picture);
				$('.add_hottopic .add_hottopic_add_title').val(data.data.name);
				$('.add_hottopic .add_hottopic_para').val(data.data.descrip);
				$('.add_hottopic').attr('initFansNum',data.data.initFansNum);
				$('.add_hottopic').attr('initPostNum',data.data.initPostNum);
				$('.add_hottopic').attr('recommendPosts',data.data.recommendPosts);
			}else{
				alert(data.data.error);	
			}	
		});
    });
	
	//点击帖子管理里的完成按钮
	$('.add_community_hottopic .add_community_hottopic_success_btn').click(function(e) {
		$('#community_hottopic_manage').show();
    });
	
	//添加关联帖子
	$('.add_community_hottopic .add_community_hottopic_relation').click(function(e) {
        $('.add_community_hottopic').hide();
		$('.add_community_hottopic_relation_tie').show();
		loadPostListPage($(this).attr('topicId'));
    });
	
	//点击添加关联帖子列表里的完成按钮
	$('.add_community_hottopic_relation_tie .add_relation_tie_success_btn').click(function(e) {
        $('.add_community_hottopic_relation_tie').hide();
		$('.add_community_hottopic').show();
		loadPostListOfHotTopicPage($('.add_community_hottopic').attr('topicId'));
    });
	
	//点击模拟粉丝数窗口的关闭按钮
	$('.community_hottopic_manage_fensi_box_close').click(function(e) {
        $('.community_hottopic_manage_fensi_box').hide();
		$('.community_hottopic_manage_tiezi_moni').val('');
    });
	
	//点击模拟评论数窗口的关闭按钮
	$('.community_hottopic_manage_pinglun_box_close').click(function(e) {
        $('.community_hottopic_manage_pinglun_box').hide();
		$('.community_hottopic_manage_pinglun_moni').val('');
    });
	
	//修改模拟粉丝数
	$('.community_hottopic_table .cht_modify_fensinum_btn').live('click',function(e) {
		var btn = $(this);
        $('.community_hottopic_manage_fensi_box').show().css('top',btn.offset().top -200).attr('topicId',btn.attr('topicId'));
		$('.community_hottopic_manage_fensi_box .community_hottopic_manage_fensi_box_true').html(btn.attr('realFansNum'));
		$('.community_hottopic_manage_fensi_box .community_hottopic_manage_fensi_box_moni').val(btn.attr('initFansNum'));
		$('.community_hottopic_manage_tiezi_box,.community_hottopic_manage_pinglun_box').hide();
    });
	
	//修改模拟帖子数
	$('.community_hottopic_table .cht_modify_tienum_btn').live('click',function(e) {
		var btn = $(this);
        $('.community_hottopic_manage_tiezi_box').show().css('top',btn.offset().top - 200).attr('topicId',btn.attr('topicId'));
		$('.community_hottopic_manage_tiezi_box .community_hottopic_manage_tiezi_box_true').html(btn.attr('realPostNum'));
		$('.community_hottopic_manage_tiezi_box .community_hottopic_manage_tiezi_box_moni').val(btn.attr('initPostNum'));
		$('.community_hottopic_manage_fensi_box,.community_hottopic_manage_pinglun_box').hide();
    });
	
	//修改模拟评论数
	$('.community_hottopic_table .cht_modify_pingnum_btn').live('click',function(e) {
		var btn = $(this);
        $('.community_hottopic_manage_pinglun_box').show().css('top',btn.offset().top - 200).attr('topicId',btn.attr('topicId'));
		$('.community_hottopic_manage_pinglun_box .community_hottopic_manage_pinglun_box_true').html(btn.attr('realTalkNum'));
		$('.community_hottopic_manage_pinglun_box .community_hottopic_manage_pinglun_box_moni').val(btn.attr('initTalkNum'));
		$('.community_hottopic_manage_fensi_box,.community_hottopic_manage_tiezi_box').hide();
    });
	
	//点击模拟帖子数窗口的关闭按钮
	$('.community_hottopic_manage_tiezi_box .community_hottopic_manage_tiezi_box_close').click(function(e) {
        $('.community_hottopic_manage_tiezi_box').hide();
		$('.community_hottopic_manage_tiezi_box .community_hottopic_manage_tiezi_moni').val('');
    });
	
	//修改模拟粉丝数
	$('.community_hottopic_manage_fensi_box .community_hottopic_manage_fensi_box_modify').click(function(e) {
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/hottopic/saveHotTopicInitFansNum/3.0.0',{topicId:$('.community_hottopic_manage_fensi_box').attr('topicId'),initFansNum:$('.community_hottopic_manage_fensi_box .community_hottopic_manage_fensi_box_moni').val()},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.community_hottopic_manage_fensi_box').hide();
				loadHotTopicListPage();
			}else{
				alert(data.data.error);	
			}	
		});
    });
	
	//恢复模拟粉丝数
	$('.community_hottopic_manage_fensi_box .community_hottopic_manage_fensi_box_huifu').click(function(e) {
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/hottopic/saveHotTopicInitFansNum/3.0.0',{topicId:$('.community_hottopic_manage_fensi_box').attr('topicId'),initFansNum:0},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.community_hottopic_manage_fensi_box').hide();
				loadHotTopicListPage();
			}else{
				alert(data.data.error);	
			}	
		});
    });
	
	//恢复模拟帖子数
	$('.community_hottopic_manage_tiezi_box .community_hottopic_manage_tiezi_box_huifu').click(function(e) {
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/hottopic/saveHotTopicInitPostNum/3.0.0',{topicId:$('.community_hottopic_manage_tiezi_box').attr('topicId'),initPostNum:0},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.community_hottopic_manage_tiezi_box').hide();
				loadHotTopicListPage();
			}else{
				alert(data.data.error);	
			}	
		});
    });
	
	//恢复模拟评论数
	$('.community_hottopic_manage_pinglun_box .community_hottopic_manage_pinglun_box_huifu').click(function(e) {
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/hottopic/saveHotTopicInitCommentNum/4.0.0',{topicId:$('.community_hottopic_manage_pinglun_box').attr('topicId'),initTalkNum:0},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.community_hottopic_manage_pinglun_box').hide();
				loadHotTopicListPage();
			}else{
				alert(data.data.error);	
			}	
		});
    });
	
	//修改模拟帖子数
	$('.community_hottopic_manage_tiezi_box .community_hottopic_manage_tiezi_box_modify').click(function(e) {
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/hottopic/saveHotTopicInitPostNum/3.0.0',{topicId:$('.community_hottopic_manage_tiezi_box').attr('topicId'),initPostNum:$('.community_hottopic_manage_tiezi_box .community_hottopic_manage_tiezi_box_moni').val()},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.community_hottopic_manage_tiezi_box').hide();
				loadHotTopicListPage();
			}else{
				alert(data.data.error);	
			}	
		});
    });
	
	//修改模拟评论数
	$('.community_hottopic_manage_pinglun_box .community_hottopic_manage_pinglun_box_modify').click(function(e) {
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/hottopic/saveHotTopicInitCommentNum/4.0.0',{topicId:$('.community_hottopic_manage_pinglun_box').attr('topicId'),initTalkNum:$('.community_hottopic_manage_pinglun_box .community_hottopic_manage_pinglun_box_moni').val()},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.community_hottopic_manage_pinglun_box').hide();
				loadHotTopicListPage();
			}else{
				alert(data.data.error);	
			}	
		});
    });
	
	//添加话题背景图
	$('.add_hottopic .add_hottopic_cover').click(function(e) {
        $('.add_hottopic #add_hottopic_input').click();
    });	
	$('.add_hottopic #add_hottopic_input').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('.add_hottopic .add_hottopic_cover').attr('src',data.result.data.url);
		}
	});	
	
	//热门话题-删除话题V3.0.0
	$('.community_hottopic_table .cht_del_btn').live("click",function(e) {
        var btn = $(this);
		var r = confirm('确定要删除吗？');
		if(r == true){
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/hottopic/deleteHotTopic/3.0.0',{topicId:btn.attr('topicId')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					btn.parent().parent().remove();
				}else{
					alert(data.data.error);	
				}	
			});
		};
    });
	
	//热门话题里的帖子管理
	$('.community_hottopic_table .cht_tiezi_btn').live('click',function(e) {
		var btn = $(this);
        $('.add_community_hottopic').show();
		$('.community_hottopic_manage_content').hide();
		loadPostListOfHotTopicPage(btn.attr('topicId'));
    });
	
	//点击话题下包含的帖子列表里的完成按钮
	//热门话题-获取话题中的帖子列表V3.0.0
	$('.add_community_hottopic .add_community_hottopic_success_btn').click(function(e) {
        $('.add_community_hottopic').hide();
		$('.community_hottopic_manage_content').show();
    });
	
	//点击话题下包含的帖子列表里的取消按钮
	$('.add_community_hottopic .add_community_hottopic_cancle_btn').click(function(e) {
        $('.add_community_hottopic').hide();
		$('.community_hottopic_manage_content').show();
    });
	
	//热门话题-删除话题中的帖子V3.0.0
	$('.ach_hot_sort_table .ach_hot_sort_btn_delete').live('click',function(e) {
        var btn = $(this);
		var r = confirm('确定要删除吗？');
		if(r == true){
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/hottopic/deletePostFromHotTopic/3.0.0',{topicId:$('.add_community_hottopic').attr('topicId'),postType:btn.attr('postType'),postId:btn.attr('postId')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					btn.parent().parent().remove();
				}else{
					alert(data.data.error);	
				}	
			});
		};
    });
	
	//搜索标签
	$('.add_community_hottopic_relation_tie .add_relation_tie_search_btn').click(function(e) {
        loadPostListPage($('.add_community_hottopic').attr('topicId'));
    });
	
	//点击添加关联帖子列表里的取消按钮
	$('.add_community_hottopic_relation_tie .add_relation_tie_cancle_btn').click(function(e) {
		$('.add_community_hottopic_relation_tie .add_relation_tie_txt').val('');
        loadPostListPage($('.add_community_hottopic').attr('topicId'));
    });
	
	//热门话题-向话题中添加帖子V3.0.0
	$('.community_hottopic_table .community_hottopic_table_btn_add').live('click',function(e) {
		var btn = $(this);
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/hottopic/addPostToHotTopic/3.0.0',{topicId:$('.add_community_hottopic').attr('topicId'),postType:btn.attr('postType'),postId:btn.attr('postId')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				btn.addClass('community_hottopic_table_btn_add_cancle').attr('value','已添加').removeClass('community_hottopic_table_btn_add');
			}else{
				alert(data.data.error);	
			}	
		});
    });
	
	//热门话题-删除话题中的帖子V3.0.0
	$('.community_hottopic_table .community_hottopic_table_btn_add_cancle').live('click',function(e) {
		var btn = $(this);
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/hottopic/deletePostFromHotTopic/3.0.0',{topicId:$('.add_community_hottopic').attr('topicId'),postType:btn.attr('postType'),postId:btn.attr('postId')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				btn.addClass('community_hottopic_table_btn_add').attr('value','添加').removeClass('community_hottopic_table_btn_add_cancle');
			}else{
				alert(data.data.error);	
			}	
		});
    });
	
	//查看帖子详情
	$('.community_hottopic_table .community_hottopic_table_btn_edit').live('click',function(e) {
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
	
	//热门话题-向话题中批量添加帖子V3.0.0
	$('.add_community_hottopic_relation_tie .add_relation_tie_all_btn').click(function(e) {
		var postList = '';
        $('.add_community_hottopic_relation_tie .community_hottopic_table tbody tr:gt(0)').each(function(index, element) {
            postList += '{"postType":'+ $(this).attr('postType') +',"postId":'+ $(this).attr('postId') +'},';
        });
		postList ='['+ postList.substring(0,postList.length -1) +']';
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/hottopic/addPostListToHotTopic/3.0.0',{topicId:$('.add_community_hottopic').attr('topicId'),postList:postList},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				loadPostListPage($('.add_community_hottopic').attr('topicId'));
			}else{
				alert(data.data.error);	
			}	
		});
    });
	
});

//热门话题-获取社区推荐的全部话题V3.0.0
function hotTopicFn(){
	$('.community_hottopic_manage_content .chmc_six_top .cst').each(function(index, element) {
		$(this).children('.cst_id').attr('disabled','disabled');
		$(this).children('.cst_id').attr('value','');
	});
	$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/hottopic/getRecommendHotTopics/3.0.0',function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			for(var x = 0; x < data.data.length ; x ++){
				$('.community_hottopic_manage_content .chmc_six_top .cst:eq('+x+')').children('.cst_id').attr('value',data.data[x]);
			}
		}else{
			alert(data.data.error);	
		}	
	});
}

//话题热度排序列表分页
function createHotTopicListPage(data){
	$(".chmc_hot_sort .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getHotTopicListSearchParams();
			params.page = p;
			$('.chmc_hot_sort .community_hottopic_table>tr:gt(0)').remove();
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/hottopic/getHotTopicList/3.0.0',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initHotTopicListPage
			});			
		}
	});
}

//话题热度排序分页
function initHotTopicListPage(data){
	createHotTopicListPage(data);
	$('.chmc_hot_sort .community_hottopic_table tbody>tr:gt(0)').remove();
	for(var x = 0; x < data.data.pageData.length ; x ++){
		//判断是否有模拟粉丝数
		if(data.data.pageData[x].initFansNum == 0){//没有
			//判断是否有模拟帖子数
			if(data.data.pageData[x].initPostNum == 0){//没有
				//判断是否有模拟评论数
				if(data.data.pageData[x].initTalkNum == 0){//没有
					$('.chmc_hot_sort .community_hottopic_table tbody').append('<tr><td>'+data.data.pageData[x].topicId+'</td><td>'+data.data.pageData[x].name+'</td><td><span style="float:left;"></span>'+data.data.pageData[x].realFansNum+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_fensinum_btn" topicId="'+data.data.pageData[x].topicId+'" initFansNum="'+data.data.pageData[x].initFansNum+'" realFansNum="'+data.data.pageData[x].realFansNum+'"></td><td><span style="float:left;"></span>'+data.data.pageData[x].realPostNum+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_tienum_btn" topicId="'+data.data.pageData[x].topicId+'" initPostNum="'+data.data.pageData[x].initPostNum+'" realPostNum="'+data.data.pageData[x].realPostNum+'"></td><td><span style="float:left;"></span>'+data.data.pageData[x].realTalkNum+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_pingnum_btn" topicId="'+data.data.pageData[x].topicId+'" initTalkNum="'+data.data.pageData[x].initTalkNum+'" realTalkNum="'+data.data.pageData[x].realTalkNum+'"></td><td><input type="button" value="帖子管理" class="cht_tiezi_btn" topicId="'+data.data.pageData[x].topicId+'"> <input type="button" value="编辑" class="cht_edit_btn" topicId="'+data.data.pageData[x].topicId+'"> <input type="button" value="删除" class="cht_del_btn" topicId="'+data.data.pageData[x].topicId+'"></td></tr>');
				}else{
					$('.chmc_hot_sort .community_hottopic_table tbody').append('<tr><td>'+data.data.pageData[x].topicId+'</td><td>'+data.data.pageData[x].name+'</td><td><span style="float:left;"></span>'+data.data.pageData[x].realFansNum+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_fensinum_btn" topicId="'+data.data.pageData[x].topicId+'" initFansNum="'+data.data.pageData[x].initFansNum+'" realFansNum="'+data.data.pageData[x].realFansNum+'"></td><td><span style="float:left;"></span>'+data.data.pageData[x].realPostNum+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_tienum_btn" topicId="'+data.data.pageData[x].topicId+'" initPostNum="'+data.data.pageData[x].initPostNum+'" realPostNum="'+data.data.pageData[x].realPostNum+'"></td><td><span style="float:left;">模拟</span>'+(data.data.pageData[x].realTalkNum + data.data.pageData[x].initTalkNum)+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_pingnum_btn" topicId="'+data.data.pageData[x].topicId+'" initTalkNum="'+data.data.pageData[x].initTalkNum+'" realTalkNum="'+data.data.pageData[x].realTalkNum+'"></td><td><input type="button" value="帖子管理" class="cht_tiezi_btn" topicId="'+data.data.pageData[x].topicId+'"> <input type="button" value="编辑" class="cht_edit_btn" topicId="'+data.data.pageData[x].topicId+'"> <input type="button" value="删除" class="cht_del_btn" topicId="'+data.data.pageData[x].topicId+'"></td></tr>');
				}
			}else{
				//有模拟帖子数
				//判断是否有模拟评论数
				if(data.data.pageData[x].initTalkNum == 0){//没有
					$('.chmc_hot_sort .community_hottopic_table tbody').append('<tr><td>'+data.data.pageData[x].topicId+'</td><td>'+data.data.pageData[x].name+'</td><td><span style="float:left;"></span>'+data.data.pageData[x].realFansNum+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_fensinum_btn" topicId="'+data.data.pageData[x].topicId+'" initFansNum="'+data.data.pageData[x].initFansNum+'" realFansNum="'+data.data.pageData[x].realFansNum+'"></td><td><span style="float:left;">模拟</span>'+(data.data.pageData[x].realPostNum + data.data.pageData[x].initPostNum)+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_tienum_btn" topicId="'+data.data.pageData[x].topicId+'" initPostNum="'+data.data.pageData[x].initPostNum+'" realPostNum="'+data.data.pageData[x].realPostNum+'"></td><td><span style="float:left;"></span>'+data.data.pageData[x].realTalkNum+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_pingnum_btn" topicId="'+data.data.pageData[x].topicId+'" initTalkNum="'+data.data.pageData[x].initTalkNum+'" realTalkNum="'+data.data.pageData[x].realTalkNum+'"></td><td><input type="button" value="帖子管理" class="cht_tiezi_btn" topicId="'+data.data.pageData[x].topicId+'"> <input type="button" value="编辑" class="cht_edit_btn" topicId="'+data.data.pageData[x].topicId+'"> <input type="button" value="删除" class="cht_del_btn" topicId="'+data.data.pageData[x].topicId+'"></td></tr>');
				}else{
					$('.chmc_hot_sort .community_hottopic_table tbody').append('<tr><td>'+data.data.pageData[x].topicId+'</td><td>'+data.data.pageData[x].name+'</td><td><span style="float:left;"></span>'+data.data.pageData[x].realFansNum+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_fensinum_btn" topicId="'+data.data.pageData[x].topicId+'" initFansNum="'+data.data.pageData[x].initFansNum+'" realFansNum="'+data.data.pageData[x].realFansNum+'"></td><td><span style="float:left;">模拟</span>'+(data.data.pageData[x].realPostNum + data.data.pageData[x].initPostNum)+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_tienum_btn" topicId="'+data.data.pageData[x].topicId+'" initPostNum="'+data.data.pageData[x].initPostNum+'" realPostNum="'+data.data.pageData[x].realPostNum+'"></td><td><span style="float:left;">模拟</span>'+(data.data.pageData[x].realTalkNum + data.data.pageData[x].initTalkNum)+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_pingnum_btn" topicId="'+data.data.pageData[x].topicId+'" initTalkNum="'+data.data.pageData[x].initTalkNum+'" realTalkNum="'+data.data.pageData[x].realTalkNum+'"></td><td><input type="button" value="帖子管理" class="cht_tiezi_btn" topicId="'+data.data.pageData[x].topicId+'"> <input type="button" value="编辑" class="cht_edit_btn" topicId="'+data.data.pageData[x].topicId+'"> <input type="button" value="删除" class="cht_del_btn" topicId="'+data.data.pageData[x].topicId+'"></td></tr>');
				}
			}
		}else{
			
			
			//判断是否有模拟帖子数
			if(data.data.pageData[x].initPostNum == 0){//没有
				//判断是否有模拟评论数
				if(data.data.pageData[x].initTalkNum == 0){//没有
					$('.chmc_hot_sort .community_hottopic_table tbody').append('<tr><td>'+data.data.pageData[x].topicId+'</td><td>'+data.data.pageData[x].name+'</td><td><span style="float:left;">模拟</span>'+(data.data.pageData[x].initFansNum + data.data.pageData[x].realFansNum)+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_fensinum_btn" topicId="'+data.data.pageData[x].topicId+'" initFansNum="'+data.data.pageData[x].initFansNum+'" realFansNum="'+data.data.pageData[x].realFansNum+'"></td><td><span style="float:left;"></span>'+data.data.pageData[x].realPostNum+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_tienum_btn" topicId="'+data.data.pageData[x].topicId+'" initPostNum="'+data.data.pageData[x].initPostNum+'" realPostNum="'+data.data.pageData[x].realPostNum+'"></td><td><span style="float:left;"></span>'+data.data.pageData[x].realTalkNum+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_pingnum_btn" topicId="'+data.data.pageData[x].topicId+'" initTalkNum="'+data.data.pageData[x].initTalkNum+'" realTalkNum="'+data.data.pageData[x].realTalkNum+'"></td><td><input type="button" value="帖子管理" class="cht_tiezi_btn" topicId="'+data.data.pageData[x].topicId+'"> <input type="button" value="编辑" class="cht_edit_btn" topicId="'+data.data.pageData[x].topicId+'"> <input type="button" value="删除" class="cht_del_btn" topicId="'+data.data.pageData[x].topicId+'"></td></tr>');
				}else{
					$('.chmc_hot_sort .community_hottopic_table tbody').append('<tr><td>'+data.data.pageData[x].topicId+'</td><td>'+data.data.pageData[x].name+'</td><td><span style="float:left;">模拟</span>'+(data.data.pageData[x].initFansNum + data.data.pageData[x].realFansNum)+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_fensinum_btn" topicId="'+data.data.pageData[x].topicId+'" initFansNum="'+data.data.pageData[x].initFansNum+'" realFansNum="'+data.data.pageData[x].realFansNum+'"></td><td><span style="float:left;"></span>'+data.data.pageData[x].realPostNum+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_tienum_btn" topicId="'+data.data.pageData[x].topicId+'" initPostNum="'+data.data.pageData[x].initPostNum+'" realPostNum="'+data.data.pageData[x].realPostNum+'"></td><td><span style="float:left;">模拟</span>'+(data.data.pageData[x].realTalkNum + data.data.pageData[x].initTalkNum)+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_pingnum_btn" topicId="'+data.data.pageData[x].topicId+'" initTalkNum="'+data.data.pageData[x].initTalkNum+'" realTalkNum="'+data.data.pageData[x].realTalkNum+'"></td><td><input type="button" value="帖子管理" class="cht_tiezi_btn" topicId="'+data.data.pageData[x].topicId+'"> <input type="button" value="编辑" class="cht_edit_btn" topicId="'+data.data.pageData[x].topicId+'"> <input type="button" value="删除" class="cht_del_btn" topicId="'+data.data.pageData[x].topicId+'"></td></tr>');
				}
			}else{
				//有模拟帖子数
				//判断是否有模拟评论数
				if(data.data.pageData[x].initTalkNum == 0){//没有
					$('.chmc_hot_sort .community_hottopic_table tbody').append('<tr><td>'+data.data.pageData[x].topicId+'</td><td>'+data.data.pageData[x].name+'</td><td><span style="float:left;">模拟</span>'+(data.data.pageData[x].initFansNum + data.data.pageData[x].realFansNum)+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_fensinum_btn" topicId="'+data.data.pageData[x].topicId+'" initFansNum="'+data.data.pageData[x].initFansNum+'" realFansNum="'+data.data.pageData[x].realFansNum+'"></td><td><span style="float:left;">模拟</span>'+(data.data.pageData[x].realPostNum + data.data.pageData[x].initPostNum)+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_tienum_btn" topicId="'+data.data.pageData[x].topicId+'" initPostNum="'+data.data.pageData[x].initPostNum+'" realPostNum="'+data.data.pageData[x].realPostNum+'"></td><td><span style="float:left;"></span>'+data.data.pageData[x].realTalkNum+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_pingnum_btn" topicId="'+data.data.pageData[x].topicId+'" initTalkNum="'+data.data.pageData[x].initTalkNum+'" realTalkNum="'+data.data.pageData[x].realTalkNum+'"></td><td><input type="button" value="帖子管理" class="cht_tiezi_btn" topicId="'+data.data.pageData[x].topicId+'"> <input type="button" value="编辑" class="cht_edit_btn" topicId="'+data.data.pageData[x].topicId+'"> <input type="button" value="删除" class="cht_del_btn" topicId="'+data.data.pageData[x].topicId+'"></td></tr>');
				}else{
					$('.chmc_hot_sort .community_hottopic_table tbody').append('<tr><td>'+data.data.pageData[x].topicId+'</td><td>'+data.data.pageData[x].name+'</td><td><span style="float:left;">模拟</span>'+(data.data.pageData[x].initFansNum + data.data.pageData[x].realFansNum)+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_fensinum_btn" topicId="'+data.data.pageData[x].topicId+'" initFansNum="'+data.data.pageData[x].initFansNum+'" realFansNum="'+data.data.pageData[x].realFansNum+'"></td><td><span style="float:left;">模拟</span>'+(data.data.pageData[x].realPostNum + data.data.pageData[x].initPostNum)+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_tienum_btn" topicId="'+data.data.pageData[x].topicId+'" initPostNum="'+data.data.pageData[x].initPostNum+'" realPostNum="'+data.data.pageData[x].realPostNum+'"></td><td><span style="float:left;">模拟</span>'+(data.data.pageData[x].realTalkNum + data.data.pageData[x].initTalkNum)+'<img src="images/img_xiugai.png" style="width:13px; cursor:pointer;float: right;margin: 3px;" alt="" class="cht_modify_pingnum_btn" topicId="'+data.data.pageData[x].topicId+'" initTalkNum="'+data.data.pageData[x].initTalkNum+'" realTalkNum="'+data.data.pageData[x].realTalkNum+'"></td><td><input type="button" value="帖子管理" class="cht_tiezi_btn" topicId="'+data.data.pageData[x].topicId+'"> <input type="button" value="编辑" class="cht_edit_btn" topicId="'+data.data.pageData[x].topicId+'"> <input type="button" value="删除" class="cht_del_btn" topicId="'+data.data.pageData[x].topicId+'"></td></tr>');
				}
			}
		}
	}
}

//获取查询参数
function getHotTopicListSearchParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	return params;
}

//话题热度排序分页数据
function loadHotTopicListPage(){
	$('.chmc_hot_sort .community_hottopic_table tbody>tr:gt(0)').remove();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/hottopic/getHotTopicList/3.0.0',
		type : 'get',
		dataType : 'json',
		data: getHotTopicListSearchParams(1),
		success : initHotTopicListPage,
	});
}
	
	
<!--  =====================================================   获取热度排序列表   ================================================================== -->	

//话题中的帖子列表分页
function createPostListOfHotTopicPage(data){
	$(".add_community_hottopic .ach_hot_sort .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getPostListOfHotTopicSearchParams();
			params.page = p;
			params.topicId = $('.add_community_hottopic').attr('topicId');
			$('.ach_hot_sort .ach_hot_sort_table tbody>tr:gt(0)').remove();
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/hottopic/getPostListOfHotTopic/3.0.0',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initPostListOfHotTopicPage
			});			
		}
	});
}

//话题中的帖子列表分页
function initPostListOfHotTopicPage(data){
	createPostListOfHotTopicPage(data);
	$('.ach_hot_sort .ach_hot_sort_table tbody>tr:gt(0)').remove();
	for(var x = 0; x < data.data.pageData.length ; x ++){
		$('.ach_hot_sort .ach_hot_sort_table tbody').append('<tr><td>'+data.data.pageData[x].postId+'</td><td>'+data.data.pageData[x].title+'</td><td><input type="button" value="删除" style=" color:#fff; background: #bd362f;" class="ach_hot_sort_btn_delete" postId="'+data.data.pageData[x].postId+'" postType="'+data.data.pageData[x].postType+'" /></td></tr>');
	}
}

//获取查询参数
function getPostListOfHotTopicSearchParams(page,topicId){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	params.topicId = topicId;
	return params;
}

//话话题中的帖子列表分页数据
function loadPostListOfHotTopicPage(topicId){
	$('.add_community_hottopic').attr('topicId',topicId);
	$('.add_community_hottopic .add_community_hottopic_relation').attr('topicId',topicId);
	$('.ach_hot_sort .ach_hot_sort_table tbody>tr:gt(0)').remove();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/hottopic/getPostListOfHotTopic/3.0.0',
		type : 'get',
		dataType : 'json',
		data: getPostListOfHotTopicSearchParams(1,topicId),
		success : initPostListOfHotTopicPage,
	});
}
	





	
<!--  =====================================================   搜索可选的帖子列表   ============================================================= -->	

//搜索可选的帖子列表分页
function createPostListPage(data){
	$(".add_community_hottopic_relation_tie .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getPostListSearchParams();
			params.page = p;
			params.topicId = $('.add_community_hottopic').attr('topicId');
			$('.add_community_hottopic_relation_tie .community_hottopic_table tbody>tr:gt(0)').remove();
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/hottopic/searchPostList/3.0.0',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initPostListPage
			});			
		}
	});
}

//搜索可选的帖子列表分页
function initPostListPage(data){
	createPostListPage(data);
	$('.add_community_hottopic_relation_tie .community_hottopic_table tbody>tr:gt(0)').remove();
	for(var x = 0; x < data.data.pageData.length ; x ++){
		//是否是话题内的帖子，1是话题内帖子，0不是
		if(data.data.pageData[x].isInTopic == 0){
			$('.add_community_hottopic_relation_tie .community_hottopic_table tbody').append('<tr postType='+data.data.pageData[x].postType+' postId='+data.data.pageData[x].postId+'><td>'+data.data.pageData[x].postId+'</td><td>'+data.data.pageData[x].title+'</td><td>'+data.data.pageData[x].labels+'</td><td>'+data.data.pageData[x].viewNum+'</td><td>'+data.data.pageData[x].praiseNum+'</td><td>'+data.data.pageData[x].commentNum+'</td><td>'+data.data.pageData[x].columnName+'</td><td><input type="button" value="查看" class="community_hottopic_table_btn_edit" postType='+data.data.pageData[x].postType+' postId='+data.data.pageData[x].postId+' /><input type="button" value="添加" class="community_hottopic_table_btn_add" postType='+data.data.pageData[x].postType+' postId='+data.data.pageData[x].postId+' /></td></tr>');
		}
		if(data.data.pageData[x].isInTopic == 1){
			$('.add_community_hottopic_relation_tie .community_hottopic_table tbody').append('<tr postType='+data.data.pageData[x].postType+' postId='+data.data.pageData[x].postId+'><td>'+data.data.pageData[x].postId+'</td><td>'+data.data.pageData[x].title+'</td><td>'+data.data.pageData[x].labels+'</td><td>'+data.data.pageData[x].viewNum+'</td><td>'+data.data.pageData[x].praiseNum+'</td><td>'+data.data.pageData[x].commentNum+'</td><td>'+data.data.pageData[x].columnName+'</td><td><input type="button" value="查看" class="community_hottopic_table_btn_edit" postType='+data.data.pageData[x].postType+' postId='+data.data.pageData[x].postId+' /><input type="button" value="已添加" class="community_hottopic_table_btn_add_cancle" postType='+data.data.pageData[x].postType+' postId='+data.data.pageData[x].postId+' /></td></tr>');
		}
	}
}

//获取查询参数
function getPostListSearchParams(page,topicId){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	params.topicId = topicId;
	params.label = $.trim($('.add_community_hottopic_relation_tie .add_relation_tie_txt').val());
	return params;
}

//搜索可选的帖子列表分页数据
function loadPostListPage(topicId){
	$('.add_community_hottopic_relation_tie .community_hottopic_table tbody>tr:gt(0)').remove();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/hottopic/searchPostList/3.0.0',
		type : 'get',
		dataType : 'json',
		data: getPostListSearchParams(1,topicId),
		success : initPostListPage,
	});
}
	


