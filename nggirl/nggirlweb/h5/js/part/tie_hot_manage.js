$(function(){
	//新增自定义设置记录
	$('.tie_hot_manage_content .free_setting .add_row_recoder').click(function(e) {
        $('#tie_hot_manage .tie_hot_manage_content .free_setting tbody').append('<tr><td><select name="" id="" style="padding:7px; border:1px solid #ccc;"><option value="">文章</option><option value="">视频</option></select></td><td><input type="text" class="text_padding" /></td><td><input type="text" class="text_padding" /></td><td><input type="text" class="text_padding" /></td><td><input type="button" value="完成" class="save_btn green" /></td></tr>');
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
	$('#tie_hot_manage .tie_hot_manage_content .free_setting .free_setting_modify_hot').click(function(e) {
		var btn = $(this);
        $('.column_weight_manage_content_box').show().css('top',btn.offset().top -200);
    });
	
	//关闭模拟热度值
	$('.column_weight_manage_content_box .column_weight_manage_content_box_close').click(function(e) {
        $('.column_weight_manage_content_box').hide();
		$('.column_weight_manage_content_box .column_weight_manage_content_box_moni').val('');
    });
	
	//删除自定义条目
	$('#tie_hot_manage .tie_hot_manage_content .free_setting .del_btn').live("click",function(e) {
        $(this).parent().parent().remove();
    });
	
	//tie_hot_manage_operators
});