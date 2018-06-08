$(function(){	
	//点击权重值设置的编辑按钮
	$('#tie_hot_admin_manage .tie_hot_admin_manage_content .common_setting .edit_btn').live("click",function(e) {
        $(this).parent().parent().children('td').children("input[type='text']").removeAttr('disabled');
		$(this).removeClass('edit_btn').addClass('save_btn').attr('value','完成');
    });
	
	//点击权重值设置的完成按钮
	//保存权重值配置V4.0.0
	$('#tie_hot_admin_manage .tie_hot_admin_manage_content .common_setting .save_btn').live("click",function(e) {
		var btn = $(this);
		btn.attr('disabled','disabled');
		var param = $('#tie_hot_admin_manage .tie_hot_admin_manage_content .common_setting tbody tr');
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/heat/saveWeightConfig/4.0.0',{viewWeight:param.children('td:eq(0)').children('input').attr('value'),praiseWeight:param.children('td:eq(1)').children('input').attr('value'),commentWeight:param.children('td:eq(2)').children('input').attr('value'),updateSpeed:param.children('td:eq(3)').children('input').attr('value')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				btn.removeAttr('disabled');
				btn.parent().parent().children('td').children("input[type='text']").attr('disabled','disabled');
				btn.removeClass('save_btn').addClass('edit_btn').attr('value','编辑');
			}else{
				btn.removeAttr('disabled');
				alert(data.data.error);	
			}
		});
    });
	
	//同步权重值配置V4.0.0
	$('#tie_hot_admin_manage .tie_hot_admin_manage_content .tie_hot_admin_manage_synchronize').click(function(e) {
		btn = $(this);
		if(btn.hasClass('green')){
			btn.removeClass('green');
			$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/heat/syncWeightConfig/4.0.0',function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					btn.addClass('green');
					alert('同步成功！！');
				}else{
					btn.addClass('green');
					alert(data.data.error);	
				}
			});
		};
    });
});