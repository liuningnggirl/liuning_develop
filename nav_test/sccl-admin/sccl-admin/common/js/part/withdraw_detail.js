var testUrl = 'https://testcli.nggirl.com.cn';
$(function(){
	loadWithdrawDetail();
//提现管理--》搜索按钮
	$('.txgl .search-btn').click(function(e) {
		$('.txgll>tbody>tr:gt(0)').remove();
		var re=new RegExp("[\\-,\\:, ]","g");  //正则格式化字符，解释：re=new RegExp("l","g")中的第一个参数是你要替换的字符串，第二个参数指替换所有的。
		var startTime = $('.txgl .qian').val().replace(re, "");
		var endTime = $('.txgl .hou').val().replace(re, "");
		$.ajax({
			url : testUrl+'/nggirl-web/web/admin/withdraw/listWithdrawRequires/1.5.0',
			type : 'get',
			dataType : 'json',
			data: {realName:$('.txgl .search_realname').val(),nickName:$('.txgl .search').val(),startTime:startTime,endTime:endTime,status:$('.txgl .on-select option:selected').attr('value'),page:1},
			success : function(data){
				$(".txgl .tcdPageCode").createPage({
					pageCount:parseInt(data.data.totalPageNum),
					current:parseInt(data.data.currnetPageNum),
					backFn:function(p){
						$.ajax({
							url : testUrl+'/nggirl-web/web/admin/withdraw/listWithdrawRequires/1.5.0',
							type : 'get',
							dataType : 'json',
							data: {realName:$('.txgl .search_realname').val(),nickName:$('.txgl .search').val(),startTime:startTime,endTime:endTime,status:$('.txgl .on-select option:selected').attr('value'),page:p},
							success : function(data){
								$('.txgl tr:gt(0)').remove(); //清除原来的表格信息
								for(var x = 0; x < data.data.pageData.length ; x ++){
									$('.txgl .table-message tbody').append('<tr><td requireId='+data.data.pageData[x].requireId+'>'+data.data.pageData[x].dresserId+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].balance+'</td><td>'+data.data.pageData[x].amount+'</td><td>'+data.data.pageData[x].bankName+'</td><td>'+data.data.pageData[x].account+'</td><td>'+data.data.pageData[x].time+'</td><td>'+data.data.pageData[x].processTime+'</td><td><input type="button" value="提现" class="tixian" style="display:none;" /><p class="yitixian" style="display:none;" >已提现</p></td></tr>');
									//判断是否提现
									if(data.data.pageData[x].status == 0 && data.data.pageData[x].status != null){
										$('.txgl tbody>tr:eq('+(x+1)+') td:eq(10)').children('.tixian').show();
										$('.txgl tbody>tr:eq('+(x+1)+') td:eq(10)').children('.yitixian').hide();
										$('.txgl tbody>tr:eq('+(x+1)+') td:eq(10)').children('.tixian').click(function(e) {
										   //点击“提现按钮”向后台发送请求
										   var r = confirm('确认提现？？');
										   var btnTixian = $(this);
										   if(r == true){
											   var requireId = $('.txgl table tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').attr('requireId');
											   $.ajax({
													url : testUrl+'/nggirl-web/web/admin/withdraw/processWithdrawRequire',
													type : 'post',
													dataType : 'json',
													data: {requireId:requireId},
													success : function(data){
														if(data.code == 0){
															btnTixian.hide();
															var yitixian = btnTixian.next();
															yitixian.show();
														};
														if(data.code == 1){
															alert(data.data.error);	
														};
													}
											   });
										   }
										});
									}else{
										$('.txgl tbody>tr:eq('+(x+1)+') td:eq(10)').children('.tixian').hide();
										$('.txgl tbody>tr:eq('+(x+1)+') td:eq(10)').children('.yitixian').show();
									}
								}
							},
						});
					}
				});
				for(var x = 0; x < data.data.pageData.length ; x ++){
					$('.txgl .table-message tbody').append('<tr><td requireId='+data.data.pageData[x].requireId+'>'+data.data.pageData[x].dresserId+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].balance+'</td><td>'+data.data.pageData[x].amount+'</td><td>'+data.data.pageData[x].bankName+'</td><td>'+data.data.pageData[x].account+'</td><td>'+data.data.pageData[x].time+'</td><td>'+data.data.pageData[x].processTime+'</td><td><input type="button" value="提现" class="tixian" style="display:none;" /><p class="yitixian" style="display:none;" >已提现</p></td></tr>');
					//判断是否提现
					if(data.data.pageData[x].status == 0 && data.data.pageData[x].status != null){
						$('.txgl tbody>tr:eq('+(x+1)+') td:eq(10)').children('.tixian').show();
						$('.txgl tbody>tr:eq('+(x+1)+') td:eq(10)').children('.yitixian').hide();
						$('.txgl tbody>tr:eq('+(x+1)+') td:eq(10)').children('.tixian').click(function(e) {
                           //点击“提现按钮”向后台发送请求
						   var r = confirm('确认提现？？');
						   var btnTixian = $(this);
						   if(r == true){
							   var requireId = $('.txgl table tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').attr('requireId');
							   $.ajax({
									url : testUrl+'/nggirl-web/web/admin/withdraw/processWithdrawRequire',
									type : 'post',
									dataType : 'json',
									data: {requireId:requireId},
									success : function(data){
										if(data.code == 0){
											btnTixian.hide();
											var yitixian = btnTixian.next();
											yitixian.show();
										};
										if(data.code == 1){
											alert(data.data.error);	
										};
									}
							   });
						   }
                        });
					}else{
						$('.txgl tbody>tr:eq('+(x+1)+') td:eq(10)').children('.tixian').hide();
						$('.txgl tbody>tr:eq('+(x+1)+') td:eq(10)').children('.yitixian').show();
					}
				}
			},
		});
    });

//<!--  清空‘订单管理’文本框内容 -->
	$('.txgl .all-cancle').click(function(e) {
        $('.txgl .search').val('');
        $('.txgl .search_realname').val('');
        $('.txgl .qian').val('');
        $('.txgl .hou').val('');
    });
});

//提现管理
function loadWithdrawDetail(){
    $('.txgl .search').val('');
    $('.txgl .qian').val('');
    $('.txgl .hou').val('');
	$('.txgl tr:gt(0)').remove(); //清除原来的表格信息
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/withdraw/listWithdrawRequires/1.5.0',
		type : 'get',
		dataType : 'json',
		data: {page:1},
		success : function(data){
			$('.txgl tr:gt(0)').remove(); //清除原来的表格信息
			$(".txgl .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:function(p){
					$.ajax({
						url : testUrl+'/nggirl-web/web/admin/withdraw/listWithdrawRequires/1.5.0',
						type : 'get',
						dataType : 'json',
						data: {page:p},
						success : function(data){
							$('.txgl tr:gt(0)').remove(); //清除原来的表格信息
							for(var x = 0; x < data.data.pageData.length; x ++){
								$('.txgl .table-message tbody').append('<tr><td requireId='+data.data.pageData[x].requireId+'>'+data.data.pageData[x].dresserId+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].balance+'</td><td>'+data.data.pageData[x].amount+'</td><td>'+data.data.pageData[x].bankName+'</td><td>'+data.data.pageData[x].account+'</td><td>'+data.data.pageData[x].time+'</td><td>'+data.data.pageData[x].processTime+'</td><td><input type="button" value="提现" class="tixian" style="display:none;" /><p class="yitixian" style="display:none;" >已提现</p></td></tr>');
								//判断是否提现
								if(data.data.pageData[x].status == 0 && data.data.pageData[x].status != null){
									$('.txgl tbody>tr:eq('+(x+1)+') td:eq(10)').children('.tixian').show();
									$('.txgl tbody>tr:eq('+(x+1)+') td:eq(10)').children('.yitixian').hide();
									$('.txgl tbody>tr:eq('+(x+1)+') td:eq(10)').children('.tixian').click(function(e) {
									   //点击“提现按钮”向后台发送请求
									   var r = confirm('确认提现？？');
									   var btnTixian = $(this);
									   if(r == true){
										   var requireId = $('.txgl table tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').attr('requireId');
										   $.ajax({
												url : testUrl+'/nggirl-web/web/admin/withdraw/processWithdrawRequire',
												type : 'post',
												dataType : 'json',
												data: {requireId:requireId},
												success : function(data){
													if(data.code == 0){
														btnTixian.hide();
														var yitixian = btnTixian.next();
														yitixian.show();
													};
													if(data.code == 1){
														alert(data.data.error);	
													}
												}
										   });
									   }
									});
								}else{
									$('.txgl tbody>tr:eq('+(x+1)+') td:eq(10)').children('.tixian').hide();
									$('.txgl tbody>tr:eq('+(x+1)+') td:eq(10)').children('.yitixian').show();
								}
							}
						},
					});
				}
			});
			for(var x = 0; x < data.data.pageData.length; x ++){
				$('.txgl .table-message tbody').append('<tr><td requireId='+data.data.pageData[x].requireId+'>'+data.data.pageData[x].dresserId+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].balance+'</td><td>'+data.data.pageData[x].amount+'</td><td>'+data.data.pageData[x].bankName+'</td><td>'+data.data.pageData[x].account+'</td><td>'+data.data.pageData[x].time+'</td><td>'+data.data.pageData[x].processTime+'</td><td><input type="button" value="提现" class="tixian" style="display:none;" /><p class="yitixian" style="display:none;" >已提现</p></td></tr>');
				//判断是否提现
				if(data.data.pageData[x].status == 0 && data.data.pageData[x].status != null){
					$('.txgl tbody>tr:eq('+(x+1)+') td:eq(10)').children('.tixian').show();
					$('.txgl tbody>tr:eq('+(x+1)+') td:eq(10)').children('.yitixian').hide();
					$('.txgl tbody>tr:eq('+(x+1)+') td:eq(10)').children('.tixian').click(function(e) {
                       //点击“提现按钮”向后台发送请求
					   var r = confirm('确认提现？？');
					   var btnTixian = $(this);
					   if(r == true){
						   var requireId = $('.txgl table tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').attr('requireId');
						   $.ajax({
								url : testUrl+'/nggirl-web/web/admin/withdraw/processWithdrawRequire',
								type : 'post',
								dataType : 'json',
								data: {requireId:requireId},
								success : function(data){
									if(data.code == 0){
										btnTixian.hide();
										var yitixian = btnTixian.next();
										yitixian.show();
									};
									if(data.code == 1){
										alert(data.data.error);	
									};
								}
						   });
					   }
                    });
				}else{
					$('.txgl tbody>tr:eq('+(x+1)+') td:eq(10)').children('.tixian').hide();
					$('.txgl tbody>tr:eq('+(x+1)+') td:eq(10)').children('.yitixian').show();
				}
			}
		},
	});
}