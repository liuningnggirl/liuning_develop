$(function(){
	//新增自定义设置记录
	$('#tie_hot_operators_manage .tie_hot_operators_manage_content .free_setting .add_row_recoder').click(function(e) {
        $('#tie_hot_operators_manage .tie_hot_operators_manage_content .free_setting tbody').append('<tr><td><select name="" id="" style="padding:7px; border:1px solid #ccc;"><option value="1">文章</option><option value="2">视频</option></select></td><td><input type="text" class="text_padding" style=" width:100%;text-align:center;border:none;background:none;" /></td><td></td><td><span style="float:left"></span><span class="heart_num"></span><img src="images/img_xiugai.png" style="width:15px; float:right;display:none;" alt="" class="free_setting_modify_hot" /></td></td><td><input type="button" value="完成" class="save_btn green" /></td></tr>');
    });
	
	//点击通用设置的编辑按钮
	$('#tie_hot_manage .tie_hot_manage_content .common_setting .edit_btn').live("click",function(e) {
        $(this).parent().parent().children('td').children("input[type='text']").removeAttr('disabled');
		$(this).removeClass('edit_btn').addClass('save_btn').attr('value','完成');
    });
	
	//点击通用设置的完成按钮
	//保存权重值配置V4.0.0
	$('#tie_hot_manage .tie_hot_manage_content .common_setting .save_btn').live("click",function(e) {
		var btn = $(this);
		var param = $('#tie_hot_manage .tie_hot_manage_content .common_setting tbody tr');
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/heat/saveWeightConfig/4.0.0',{viewWeight:param.children('td:eq(0)').children('input').attr('value'),praiseWeight:param.children('td:eq(1)').children('input').attr('value'),commentWeight:param.children('td:eq(2)').children('input').attr('value'),updateSpeed:param.children('td:eq(3)').children('input').attr('value')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				btn.parent().parent().children('td').children("input[type='text']").attr('disabled','disabled');
				btn.removeClass('save_btn').addClass('edit_btn').attr('value','编辑');
			}else{
				alert(data.data.error);	
			}
		});
    });
	
	//修改模拟热度值
	$('#tie_hot_operators_manage .tie_hot_operators_manage_content .free_setting .free_setting_modify_hot').live('click',function(e) {
		var btn = $(this);
		$('.column_weight_manage_content_box .column_weight_manage_content_box_true').html(btn.attr('realHeatNum'));
		$('.column_weight_manage_content_box .column_weight_manage_content_box_moni').val(btn.attr('initHeatNum'));
		$('.column_weight_manage_content_box').attr('postType',btn.attr('postType'));
		$('.column_weight_manage_content_box').attr('postId',btn.attr('postId'));
		$('.column_weight_manage_content_box').attr('realHeatNum',btn.attr('realHeatNum'));
		$('.column_weight_manage_content_box').attr('initHeatNum',btn.attr('initHeatNum'));
        $('.column_weight_manage_content_box').show().css('top',btn.offset().top -200);
    });
	
	//关闭模拟热度值
	$('.column_weight_manage_content_box .column_weight_manage_content_box_close').click(function(e) {
        $('.column_weight_manage_content_box').hide();
		$('.column_weight_manage_content_box .column_weight_manage_content_box_moni').val('');
    });
	
	//初始化所有帖子热度到redis缓存V4.0.0
	$('#tie_hot_operators_manage .tie_hot_operators_manage_content .tie_hot_operators_manage_content_update').click(function(e) {
        var btn = $(this);
		if(btn.hasClass('green')){
			btn.attr('disabled','disabled').removeClass('green');
			$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/heat/initPostHeat/4.0.0',function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					btn.addClass('green').removeAttr('disabled');
					alert('更新成功！！');
				}else{
					alert(data.data.error);	
				}
			});
		};
    });
	
	//获取某一篇帖子的热度V4.0.0
	$('#tie_hot_operators_manage .tie_hot_operators_manage_content .free_setting .save_btn').live('click',function(e) {
		var btn = $(this).parent().parent();
		var btnStr = $(this);
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/heat/getOnePostHeat/4.0.0',{postId:btn.children('td:eq(1)').children('input').val(),postType:btn.children('td:eq(0)').children('select').children('option:selected').attr('value')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				btn.children('td:eq(1)').html(data.data.postId);
				if(data.data.postType == 1){//文章
					btn.children('td:eq(0)').html('文章');
				}else{//视频
					btn.children('td:eq(0)').html('视频');
				}
				btn.children('td:eq(2)').html(data.data.title);
				//判断是否有虚拟热度值
				if(data.data.initHeatNum == 0){//没有虚拟热度值
					btn.children('td:eq(3)').html('<span style="float:left"></span><span class="heart_num">'+data.data.realHeatNum+'</span><img src="images/img_xiugai.png" style="width:15px; float:right; display:none;" alt="" class="free_setting_modify_hot" postId='+data.data.postId+' postType='+data.data.postType+' initHeatNum='+data.data.initHeatNum+' realHeatNum='+data.data.realHeatNum+' />');
				}else{
					btn.children('td:eq(3)').html('<span style="float:left">模拟</span><span class="heart_num">'+(data.data.initHeatNum + data.data.realHeatNum)+'</span><img src="images/img_xiugai.png" style="width:15px; float:right;" alt="" class="free_setting_modify_hot" postId='+data.data.postId+' postType='+data.data.postType+' initHeatNum='+data.data.initHeatNum+' realHeatNum='+data.data.realHeatNum+' />');
				}
				btnStr.addClass('del_btn red').removeClass('green save_btn').attr('value','删除').attr('postId',data.data.postId).attr('postType',data.data.postType);
			}else{
				alert(data.data.error);	
			}
		});
    });
	
	//删除自定义条目
	//删除人工修改记录V4.0.0]
	$('#tie_hot_operators_manage .tie_hot_operators_manage_content .free_setting .del_btn').live("click",function(e) {
		var btn = $(this);
		var r = confirm('确认要删除该条记录？？');
		if(r == true){
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/heat/deletePostHeatSetRecord/4.0.0',{postId:btn.attr('postId'),postType:btn.attr('postType')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					btn.parent().parent().remove();
				}else{
					alert(data.data.error);	
				}
			});
		};
    });
	
	//修改帖子的虚拟热度V4.0.0
	//点击帖子热度值的恢复按钮  
	$('.column_weight_manage_content_box .column_weight_manage_content_box_modify').click(function(e) {
		var btn = $(this);
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/heat/updatePostHeat/4.0.0',{postId:btn.parent().attr('postId'),postType:btn.parent().attr('postType'),initHeatNum:$.trim(btn.parent().children('.column_weight_manage_content_box_moni').val())},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				getPostHeatSetRecordFn();
				$('.column_weight_manage_content_box').hide();
				$('.column_weight_manage_content_box .column_weight_manage_content_box_moni').val('');
			}else{
				alert(data.data.error);	
			}
		});
    });
	$('.column_weight_manage_content_box .column_weight_manage_content_box_huifu').click(function(e) {
		var btn = $(this);
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/heat/updatePostHeat/4.0.0',{postId:btn.parent().attr('postId'),postType:btn.parent().attr('postType'),initHeatNum:0},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				getPostHeatSetRecordFn();
				$('.column_weight_manage_content_box').hide();
				$('.column_weight_manage_content_box .column_weight_manage_content_box_moni').val('');
			}else{
				alert(data.data.error);	
			}
		});
    });
	
	
});


//帖子热度匹配列表分页
function createAllPostHeatPage(data){
	$("#tie_hot_operators_manage .tie_hot_operators_manage_content .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getAllPostHeatSearchParams();
			params.page = p;
			$('#tie_hot_operators_manage .tie_hot_operators_manage_content .moren_sort_table tbody>tr').remove();
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/heat/getAllPostHeat/4.0.0',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initAllPostHeatPage
			});			
		}
	});
}

//帖子热度匹配列表分页
function initAllPostHeatPage(data){
	createAllPostHeatPage(data);
	$('#tie_hot_operators_manage .tie_hot_operators_manage_content .moren_sort_table tbody>tr').remove();
	for(var x = 0; x < data.data.pageData.length ; x ++){
		$('#tie_hot_operators_manage .tie_hot_operators_manage_content .moren_sort_table tbody').append('<tr><td>'+(x+1)+'</td><td>'+data.data.pageData[x].postId+'</td><td>'+data.data.pageData[x].title+'</td><td>'+data.data.pageData[x].heatNum+'</td></tr>');
	}
}

//获取查询参数
function getAllPostHeatSearchParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	return params;
}

//帖子热度匹配列表分页数据
function loadAllPostHeatPage(){
	$('#tie_hot_operators_manage .tie_hot_operators_manage_content .moren_sort_table tbody>tr').remove();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/heat/getAllPostHeat/4.0.0',
		type : 'get',
		dataType : 'json',
		data: getAllPostHeatSearchParams(1),
		success : initAllPostHeatPage,
	});
}


//获取人工修改帖子热度记录V4.0.0\
function getPostHeatSetRecordFn(){
	$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/heat/getPostHeatSetRecord/4.0.0',function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			$('#tie_hot_operators_manage .tie_hot_operators_manage_content .free_setting tbody>tr').remove();
			for(var x = 0; x < data.data.length; x ++){
				if(data.data[x].postType == 1){
					//判断是否有虚拟热度值
					if(data.data[x].initHeatNum == 0){//没有虚拟热度值
						$('#tie_hot_operators_manage .tie_hot_operators_manage_content .free_setting tbody').append('<tr><td>文章</td><td>'+data.data[x].postId+'</td><td>'+data.data[x].title+'</td><td><span style="float:left"></span><span class="heart_num">'+ data.data[x].realHeatNum +'</span><img src="images/img_xiugai.png" style="width:15px; float:right;" alt="" class="free_setting_modify_hot" postId='+data.data[x].postId+' postType='+data.data[x].postType+' initHeatNum='+data.data[x].initHeatNum+' realHeatNum='+data.data[x].realHeatNum+' /></td><td><input type="button" value="删除" class="del_btn red" postId='+data.data[x].postId+' postType='+data.data[x].postType+' /></td></tr>');
					}else{
						$('#tie_hot_operators_manage .tie_hot_operators_manage_content .free_setting tbody').append('<tr><td>文章</td><td>'+data.data[x].postId+'</td><td>'+data.data[x].title+'</td><td><span style="float:left">模拟</span><span class="heart_num">'+(data.data[x].initHeatNum + data.data[x].realHeatNum)+'</span><img src="images/img_xiugai.png" style="width:15px; float:right;" alt="" class="free_setting_modify_hot" postId='+data.data[x].postId+' postType='+data.data[x].postType+' initHeatNum='+data.data[x].initHeatNum+' realHeatNum='+data.data[x].realHeatNum+' /></td><td><input type="button" value="删除" class="del_btn red" postId='+data.data[x].postId+' postType='+data.data[x].postType+' /></td></tr>');
					}
				}else{
					//判断是否有虚拟热度值
					if(data.data[x].initHeatNum == 0){//没有虚拟热度值
						$('#tie_hot_operators_manage .tie_hot_operators_manage_content .free_setting tbody').append('<tr><td>视频</td><td>'+data.data[x].postId+'</td><td>'+data.data[x].title+'</td><td><span style="float:left"></span><span class="heart_num">'+data.data[x].realHeatNum+'</span><img src="images/img_xiugai.png" style="width:15px; float:right;" alt="" class="free_setting_modify_hot" postId='+data.data[x].postId+' postType='+data.data[x].postType+' initHeatNum='+data.data[x].initHeatNum+' realHeatNum='+data.data[x].realHeatNum+' /></td><td><input type="button" value="删除" class="del_btn red" postId='+data.data[x].postId+' postType='+data.data[x].postType+' /></td></tr>');
					}else{
						$('#tie_hot_operators_manage .tie_hot_operators_manage_content .free_setting tbody').append('<tr><td>视频</td><td>'+data.data[x].postId+'</td><td>'+data.data[x].title+'</td><td><span style="float:left">模拟</span><span class="heart_num">'+(data.data[x].initHeatNum + data.data[x].realHeatNum)+'</span><img src="images/img_xiugai.png" style="width:15px; float:right;" alt="" class="free_setting_modify_hot" postId='+data.data[x].postId+' postType='+data.data[x].postType+' initHeatNum='+data.data[x].initHeatNum+' realHeatNum='+data.data[x].realHeatNum+' /></td><td><input type="button" value="删除" class="del_btn red" postId='+data.data[x].postId+' postType='+data.data[x].postType+' /></td></tr>');
					}
				}
			}
		}else{
			alert(data.data.error);	
		}
	});
}
