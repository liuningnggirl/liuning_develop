var testUrl = 'https://testcli.nggirl.com.cn';
$(function(){
	loadFeedback();
//点击“反馈意见”--》取消全部--》清空文本框 
	$('.fkxq .cancle-btn').click(function(e) {
        $('.fkxq .search').val('');
    });
});

//反馈意见管理
function loadFeedback() {
	$('.fkxqq tbody tr:gt(0)').remove();
	$('.fkxq .search').val('');
	var listnum = $('.fkxq .on-select  option:selected').index();
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/feedback/listFeedbacks',
		type : 'get',
		dataType : 'json',
		data: {phoneNum:$('.fkxq .search').val(),userType:$('.fkxq .on-select option:selected').index()+1,page:1},
		success : function(data){
			$('.fkxqq tbody tr:gt(0)').remove();
			$(".fkxq .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:function(p){
					$.ajax({
						url : testUrl+'/nggirl-web/web/admin/feedback/listFeedbacks',
						type : 'get',
						dataType : 'json',
						data: {phoneNum:$('.fkxq .search').val(),userType:$('.fkxq .on-select option:selected').index()+1,page:p},
						success : function(data){
							$('.fkxqq tbody tr:gt(0)').remove();
							for(var x = 0; x < data.data.pageData.length; x ++){
								$('.fkxqq tbody').append('<tr><td feedbackId='+data.data.pageData[x].feedbackId+'>'+data.data.pageData[x].userName+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].feebackType+'</td><td>'+data.data.pageData[x].content+'</td><td><input type="button" value="处理" class="chuli" /><p class="yichuli" >已处理</p></td><td>'+data.data.pageData[x].processorName+'</td><td>'+getLocalTime(data.data.pageData[x].processTime)+'</td></tr>');
								//判断“意见反馈类型”
								if(data.data.pageData[x].feebackType == 0){
									$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('用户体验性建议');
								}
								if(data.data.pageData[x].feebackType == 1){
									$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('功能性建议');
								}
								if(data.data.pageData[x].feebackType == 2){
									$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('用户洽谈');
								}
								if(data.data.pageData[x].feebackType == 3){
									$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('其他');
								}
								//判断"反馈处理"状态
								if(data.data.pageData[x].status == 0){
									$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').show();
									$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.yichuli').hide();
									//点击“处理”按钮向后台发送处理问题请求
									$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').click(function(e) {
										var r = confirm("确定要处理？？");
										if(r == true){
											var feedbackId = $('.fkxqq tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').attr('feedbackId');
											var chuli = $(this);
											$.ajax({
												url : testUrl+'/nggirl-web/web/admin/feedback/processFeedback',
												type : 'post',
												dataType : 'json',
												data: {userType:listnum+1,feedbackId:feedbackId},
												success : function(data){
													chuli.hide();
													var yichuli = chuli.next();
													yichuli.show();
												}
											});
										}
									});
								}else{
									$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').hide();
									$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.yichuli').show();
								}
							}
						},
					});
				}
			});
			for(var x = 0; x < data.data.pageData.length; x ++){
				$('.fkxqq tbody').append('<tr><td feedbackId='+data.data.pageData[x].feedbackId+'>'+data.data.pageData[x].userName+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].feebackType+'</td><td>'+data.data.pageData[x].content+'</td><td><input type="button" value="处理" class="chuli" /><p class="yichuli" >已处理</p></td><td>'+data.data.pageData[x].processorName+'</td><td>'+getLocalTime(data.data.pageData[x].processTime)+'</td></tr>');
				//判断“意见反馈类型”
				if(data.data.pageData[x].feebackType == 0){
					$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('用户体验性建议');
				}
				if(data.data.pageData[x].feebackType == 1){
					$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('功能性建议');
				}
				if(data.data.pageData[x].feebackType == 2){
					$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('用户洽谈');
				}
				if(data.data.pageData[x].feebackType == 3){
					$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('其他');
				}
				//判断"反馈处理"状态
				if(data.data.pageData[x].status == 0){
					$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').show();
					$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.yichuli').hide();
					//点击“处理”按钮向后台发送处理问题请求
					$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').click(function(e) {
						var r = confirm("确定要处理？？");
						if(r == true){
							var feedbackId = $('.fkxqq tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').attr('feedbackId');
							var chuli = $(this);
							$.ajax({
								url : testUrl+'/nggirl-web/web/admin/feedback/processFeedback',
								type : 'post',
								dataType : 'json',
								data: {userType:listnum+1,feedbackId:feedbackId},
								success : function(data){
									chuli.hide();
									var yichuli = chuli.next();
									yichuli.show();
								}
							});
						}
					});
				}else{
					$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').hide();
					$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.yichuli').show();
				}
			}
		},
	});
//<!--  “反馈意见”--》搜索按钮 -->
	$('.fkxq .search-btn').click(function(e) {
	$('.fkxqq tbody tr:gt(0)').remove();
		$.ajax({
			url : testUrl+'/nggirl-web/web/admin/feedback/listFeedbacks',
			type : 'get',
			dataType : 'json',
			data: {phoneNum:$('.fkxq .search').val(),userType:$('.fkxq .on-select option:selected').index()+1},
			success : function(data){
				$('.fkxqq tbody tr:gt(0)').remove();
				$(".fkxq .tcdPageCode").createPage({
					pageCount:parseInt(data.data.totalPageNum),
					current:parseInt(data.data.currnetPageNum),
					backFn:function(p){
						$.ajax({
							url : testUrl+'/nggirl-web/web/admin/feedback/listFeedbacks',
							type : 'get',
							dataType : 'json',
							data: {phoneNum:$('.fkxq .search').val(),userType:$('.fkxq .on-select option:selected').index()+1,page:p},
							success : function(data){
								$('.fkxqq tbody tr:gt(0)').remove();
								for(var x = 0; x < data.data.pageData.length; x ++){
									$('.fkxqq tbody').append('<tr><td feedbackId='+data.data.pageData[x].feedbackId+'>'+data.data.pageData[x].userName+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].feebackType+'</td><td>'+data.data.pageData[x].content+'</td><td><input type="button" value="处理" class="chuli" /><p class="yichuli" >已处理</p></td><td>'+data.data.pageData[x].processorName+'</td><td>'+getLocalTime(data.data.pageData[x].processTime)+'</td></tr>');
									//判断“意见反馈类型”
									if(data.data.pageData[x].feebackType == 0){
										$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('用户体验性建议');
									}
									if(data.data.pageData[x].feebackType == 1){
										$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('功能性建议');
									}
									if(data.data.pageData[x].feebackType == 2){
										$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('用户洽谈');
									}
									if(data.data.pageData[x].feebackType == 3){
										$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('其他');
									}
									//判断"反馈处理"状态
									if(data.data.pageData[x].status == 0){
										$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').show();
										$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.yichuli').hide();
										//点击“处理”按钮向后台发送处理问题请求
										$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').click(function(e) {
											var r = confirm("确定要处理？？");
											if(r == true){
												var feedbackId = $('.fkxqq tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').attr('feedbackId');
												var chuli = $(this);
												$('.fkxqq tbody tr:gt(0)').remove();
												$.ajax({
													url : testUrl+'/nggirl-web/web/admin/feedback/processFeedback',
													type : 'post',
													dataType : 'json',
													data: {userType:listnum+1,feedbackId:feedbackId},
													success : function(data){
														chuli.hide();
														var yichuli = chuli.next();
														yichuli.show();
													}
												});
											}
										});
									}else{
										$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').hide();
										$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.yichuli').show();
									}
								}
							},
						});
					}
				});
				for(var x = 0; x < data.data.pageData.length; x ++){
					$('.fkxqq tbody').append('<tr><td feedbackId='+data.data.pageData[x].feedbackId+'>'+data.data.pageData[x].userName+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].feebackType+'</td><td>'+data.data.pageData[x].content+'</td><td><input type="button" value="处理" class="chuli" /><p class="yichuli" >已处理</p></td><td>'+data.data.pageData[x].processorName+'</td><td>'+getLocalTime(data.data.pageData[x].processTime)+'</td></tr>');
					//判断“意见反馈类型”
					if(data.data.pageData[x].feebackType == 0){
						$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('用户体验性建议');
					}
					if(data.data.pageData[x].feebackType == 1){
						$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('功能性建议');
					}
					if(data.data.pageData[x].feebackType == 2){
						$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('用户洽谈');
					}
					if(data.data.pageData[x].feebackType == 3){
						$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('其他');
					}
					//判断"反馈处理"状态
					if(data.data.pageData[x].status == 0){
						$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').show();
						$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.yichuli').hide();
						//点击“处理”按钮向后台发送处理问题请求
						$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').click(function(e) {
							var r = confirm("确定要处理？？");
							if(r == true){
								var feedbackId = $('.fkxqq tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').attr('feedbackId');
								var chuli = $(this);
								$('.fkxqq tbody tr:gt(0)').remove();
								$.ajax({
									url : testUrl+'/nggirl-web/web/admin/feedback/processFeedback',
									type : 'post',
									dataType : 'json',
									data: {userType:listnum+1,feedbackId:feedbackId},
									success : function(data){
										chuli.hide();
										var yichuli = chuli.next();
										yichuli.show();
									}
								});
							}
						});
					}else{
						$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').hide();
						$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.yichuli').show();
					}
				}
			}
		});
	});
}

//时间格式化
function getLocalTime(publishTime) {
	var d_minutes,d_hours,d_days;       
	var timeNow = parseInt(new Date().getTime()/1000);       
	var d;       
	d = timeNow - publishTime;       
	d_days = parseInt(d/86400);       
	d_hours = parseInt(d/3600);       
	d_minutes = parseInt(d/60);       
	if(d_days>0 && d_days<4){       
		return d_days+"天前";       
	}else if(d_days<=0 && d_hours>0){       
		return d_hours+"小时前";       
	}else if(d_hours<=0 && d_minutes>0){       
		return d_minutes+"分钟前";       
	}else{       
		var s = 0;
		s = new Date(publishTime);       
		return (s.getFullYear()+"年"+parseInt(s.getMonth()+1))+"月"+parseInt(s.getDate())+"日";       
	}  
}