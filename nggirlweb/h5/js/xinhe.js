$(function(){	
	//根据手机号，验证码搜索数据
	$('.box-btn-select').click(function(e) {
		$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/usercheck/search',  
			type : 'get',
			data : {phoneNum:$('.box-tel').val(),checkCode:$('.box-yzm').val()},
			dataType : 'json',  
			success : function(data){
				if(data.data.length == 0){
					alert('未匹配到查询结果！！');	
					$('.box-tel').val('');
					$('.box-yzm').val('');
				};
				if(data.code == 0){
					$('.box-table tr:gt(0)').remove();
					for(var x = 0; x <data.data.length; x ++){
						//判断使用状态(0：未使用)
						if(data.data[x].codeused == 0){
							$('.box-table').append('<tr><td usercodeId="'+data.data[x].usercodeId+'">'+data.data[x].usercode+
							'</td><td>'+data.data[x].userphone+
							'</td><td>'+data.data[x].resid+
							'</td><td>'+data.data[x].restype+
							'</td><td>'+data.data[x].rescost+
							'</td><td>未使用</td><td><input type="button" value="使用" class="btn-use" /></td></tr>');
						}
						//判断使用状态(1：已使用)
						if(data.data[x].codeused == 1){
							$('.box-table').append('<tr><td usercodeId="'+data.data[x].usercodeId+'">'+data.data[x].usercode+
							'</td><td>'+data.data[x].userphone+
							'</td><td>'+data.data[x].resid+
							'</td><td>'+data.data[x].restype+
							'</td><td>'+data.data[x].rescost+
							'</td><td>已使用</td><td><input type="button" value="使用" class="btn-use" style=" display:none;" /></td></tr>');
						}
					}
				}
				
			}
		});
    });
	
	//点击“使用”按钮
	$('.btn-use').live('click',function(){
		var usercodeId = $(this).parent().parent().children('td:eq(0)').attr('usercodeId');
		var r = confirm('确定使用该入场码？？');
		var searchbtn = $(this);
		if(r == true){
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/usercheck/use',  
				type : 'post',
				data : {usercodeId:usercodeId},
				dataType : 'json',  
				success : function(data){
					if(data.code == 0){
						searchbtn.hide();
						searchbtn.parent().prev().html('已使用');
					};
					if(data.code == 1){
						alert(data.data.error);	
						var r = confirm('确定');
						if(r == true){
 						 window.location.reload();
						
                                                   }
					};
				}
			});
		}
	});
});



