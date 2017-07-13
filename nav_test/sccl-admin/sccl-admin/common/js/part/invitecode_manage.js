var testUrl = 'https://testcli.nggirl.com.cn';
$(function(){
	listInviteCodes();
//邀请管理
// 点击“邀请码管理”--》搜索按钮
	$('.yhqgl .search-btn').click(listInviteCodes);
	
//点击“邀请码管理”--》全部取消按钮
	$('.yhqgl .cancle-btn').click(function(e) {
		listInviteCodes();
		$('.yhqgl .search.yhq').val('');
		$('.yhqgl .search.creater').val('');
		$('.yhqgl .on-select option:eq(0)').attr('selected','selected');
		$('.yhq-list .Wdate.startTime').val(''),
		$('.yhq-list .Wdate.endTime').val(''),
		$('.yhq-list .beizhu').val('');
	});
	
	//导出
	$('.yhq-list .daochu-btn').click(function(e) {
		var strParam = 'code='+$('.yhqgl .search.yhq').val() + '&isForever='+$('.yhqgl .on-select option:selected').attr('value') +
			'&employeeName=' + $('.yhqgl .search.creater').val() + '&startTime='+$('.yhq-list .Wdate.startTime').val() +
			'&endTime=' + $('.yhq-list .Wdate.endTime').val() + '&comment=' + $('.yhq-list .beizhu').val() ;
		window.location.href = testUrl+"/nggirl-web/web/admin/invitecode/exportCode/2.4.2?" + strParam+'&v=<%= VERSION %>';
    });
	
//创建邀请码
	$('.create-yhq').click(function(e) {
		//判断是否为永久有效（1：永久有效）
		if($('.yhq-create .on-select option:selected').attr('value') == 1){
				if($('.yhq-create .quan-name').val() == ''){
					alert('请输入券名');	
				}else if($('.yhq-create .quan-money').val() == ''){
					alert('请输入面值');	
				}else if($('.yhq-create .quan-pro option:selected').val() == ''){
					alert('请输入适用产品');	
				}else if($('.yhq-create .quan-use-num').val() == ''){
					alert('请输入单张可适用次数');	
				}else if($('.yhq-create .quan-create-num').val() == ''){
					alert('请输入生成优惠码个数');	
				}else{
					var re=new RegExp("[\\-,\\:, ]","g");  //正则格式化字符，解释：re=new RegExp("l","g")中的第一个参数是你要替换的字符串，第二个参数指替换所有的。
					var startDate = $('.yhq-create .qian').val().replace(re, "");
					var endDate = $('.yhq-create .hou').val().replace(re, "");
					//判断是否是折扣券
					if($('.is-select option:selected').attr('value') == 0){
						$('.yhq-create .quan-create-dis').val('');	
					}else{
						$('.yhq-create .quan-create-dis').val();
						if($('.yhq-create .quan-create-dis').val() == ''){
							alert('请输入折扣数');
						};
					}
					$.ajax({
						url : testUrl+'/nggirl-web/web/admin/invitecode/createInviteCode/1.4.0',
						type : 'post',
						dataType : 'json',
						data: {isForever:$('.yhq-create .on-select option:selected').attr('value'),startDate:startDate,endDate:endDate,productName:$('.yhq-create .quan-name').val(),faceValue:$('.yhq-create .quan-money').val(),type:$('.yhq-create .quan-pro option:selected').attr('value'),limitPrice:$('.yhq-create .quan-low-money').val(),allowedTimes:$('.yhq-create .quan-use-num').val(),nums:$('.yhq-create .quan-create-num').val(),isDiscount:$('.yhq-create .is-select option:selected').attr('value'),discount:$('.yhq-create .quan-create-dis').val(),comment:$('.yhq-create .quan-content').val(),effectiveType:$('.yhq-create .quan-duan option:selected').attr('value'),effectiveDate:$('.yhq-create .quan-day').val()},
						success : function(data){
							$('.yhq-create').hide();
							$('.yhq-success').show();
							$('.yhq-success .ys-num').html(data.data.length);
							for(var x = 0 ; x < data.data.length; x ++){
								$('.yhq-success .ys-code').append('<b>'+data.data[x]+'</b>,');	
							}
						},
					});
				}
			}
		//判断是否为永久有效以及有效期是否为时间段（0：非永久有效,1为时间段）
		if($('.yhq-create .on-select option:selected').attr('value') == 0 && $('.yhq-create .quan-duan option:selected').attr('value') == 1){
			if($('.yhq-create .qian').val() == ''){
				alert('请选择有效开始时间');	
			}else if($('.yhq-create .hou').val() == ''){
				alert('请选择有效结束时间');	
			}else if($('.yhq-create .quan-name').val() == ''){
				alert('请输入券名');	
			}else if($('.yhq-create .quan-money').val() == ''){
				alert('请输入面值');	
			}else if($('.yhq-create .quan-pro option:selected').val() == ''){
				alert('请输入适用产品');	
			}else if($('.yhq-create .quan-use-num').val() == ''){
				alert('请输入单张可适用次数');	
			}else if($('.yhq-create .quan-create-num').val() == ''){
				alert('请输入生成优惠码个数');	
			}else{
				var re=new RegExp("[\\-,\\:, ]","g");  //正则格式化字符，解释：re=new RegExp("l","g")中的第一个参数是你要替换的字符串，第二个参数指替换所有的。
				var startDate = $('.yhq-create .qian').val().replace(re, "");
				var endDate = $('.yhq-create .hou').val().replace(re, "");
				//判断是否是折扣券
				if($('.is-select option:selected').attr('value') == 0){
					$('.yhq-create .quan-create-dis').val('');	
				}else{
					$('.yhq-create .quan-create-dis').val();
					if($('.yhq-create .quan-create-dis').val() == ''){
						alert('请输入折扣数');
					};
				}
				$.ajax({
					url : testUrl+'/nggirl-web/web/admin/invitecode/createInviteCode/1.4.0',
					type : 'post',
					dataType : 'json',
					data: {isForever:$('.yhq-create .on-select option:selected').attr('value'),startDate:startDate,endDate:endDate,productName:$('.yhq-create .quan-name').val(),faceValue:$('.yhq-create .quan-money').val(),type:$('.yhq-create .quan-pro option:selected').attr('value'),limitPrice:$('.yhq-create .quan-low-money').val(),allowedTimes:$('.yhq-create .quan-use-num').val(),nums:$('.yhq-create .quan-create-num').val(),isDiscount:$('.yhq-create .is-select option:selected').attr('value'),discount:$('.yhq-create .quan-create-dis').val(),comment:$('.yhq-create .quan-content').val(),effectiveType:$('.yhq-create .quan-duan option:selected').attr('value'),effectiveDate:$('.yhq-create .quan-day').val()},
					success : function(data){
						$('.yhq-create').hide();
						$('.yhq-success').show();
						$('.yhq-success .ys-num').html(data.data.length);
						for(var x = 0 ; x < data.data.length; x ++){
							$('.yhq-success .ys-code').append('<b>'+data.data[x]+'</b>,');	
						}
					},
				});
			}
		}//判断是否为永久有效以及有效期是否为时间段（0：非永久有效,2为注册时起）
		if($('.yhq-create .on-select option:selected').attr('value') == 0 && $('.yhq-create .quan-duan option:selected').attr('value') == 2){
			if($('.yhq-create .quan-day').val() ==''){
				alert('请输入有效期天数！！');
			}else if($('.yhq-create .quan-name').val() == ''){
				alert('请输入券名');	
			}else if($('.yhq-create .quan-money').val() == ''){
				alert('请输入面值');	
			}else if($('.yhq-create .quan-pro option:selected').val() == ''){
				alert('请输入适用产品');	
			}else if($('.yhq-create .quan-use-num').val() == ''){
				alert('请输入单张可适用次数');	
			}else if($('.yhq-create .quan-create-num').val() == ''){
				alert('请输入生成优惠码个数');	
			}else{
				var re=new RegExp("[\\-,\\:, ]","g");  //正则格式化字符，解释：re=new RegExp("l","g")中的第一个参数是你要替换的字符串，第二个参数指替换所有的。
				var startDate = $('.yhq-create .qian').val().replace(re, "");
				var endDate = $('.yhq-create .hou').val().replace(re, "");
				//判断是否是折扣券
				if($('.is-select option:selected').attr('value') == 0){
					$('.yhq-create .quan-create-dis').val('');	
				}else{
					$('.yhq-create .quan-create-dis').val();
					if($('.yhq-create .quan-create-dis').val() == ''){
						alert('请输入折扣数');
					};
				}
				$.ajax({
					url : testUrl+'/nggirl-web/web/admin/invitecode/createInviteCode/1.4.0',
					type : 'post',
					dataType : 'json',
					data: {isForever:$('.yhq-create .on-select option:selected').attr('value'),startDate:startDate,endDate:endDate,productName:$('.yhq-create .quan-name').val(),faceValue:$('.yhq-create .quan-money').val(),type:$('.yhq-create .quan-pro option:selected').attr('value'),limitPrice:$('.yhq-create .quan-low-money').val(),allowedTimes:$('.yhq-create .quan-use-num').val(),nums:$('.yhq-create .quan-create-num').val(),isDiscount:$('.yhq-create .is-select option:selected').attr('value'),discount:$('.yhq-create .quan-create-dis').val(),comment:$('.yhq-create .quan-content').val(),effectiveType:$('.yhq-create .quan-duan option:selected').attr('value'),effectiveDate:$('.yhq-create .quan-day').val()},
					success : function(data){
						$('.yhq-create').hide();
						$('.yhq-success').show();
						$('.yhq-success .ys-num').html(data.data.length);
						for(var x = 0 ; x < data.data.length; x ++){
							$('.yhq-success .ys-code').append('<b>'+data.data[x]+'</b>,');	
						}
					},
				});
			}
		}
    });
	
//<!--  创建邀请码信息 -->
	$('.create-btn').click(function(e) {
		$('.yhq-create .qian').val('');
		$('.yhq-create .hou').val('');
		$('.yhq-create .quan-name').val('');
		$('.yhq-create .quan-money').val('');
		$('.yhq-create .quan-low-money').val('');
		$('.yhq-create .quan-use-num').val('');
		$('.yhq-create .quan-create-num').val('');
		$('.yhq-create .quan-content').val('');
		$('.yhq-create .quan-day').val('');
		$('.yhq-list').hide();
        $('.yhq-create').show();
    });	
	
//<!--  点击--》返回--》返回到邀请码列表 -->	
	$('.return-yhq').click(function(e) {
		$('.yhq-success .ys-num').html('');
		$('.yhq-success .ys-code').children('b').remove();
		$('.yhq-success .ys-code').html('');
		$('.yhq-list').show();
        $('.yhq-create').hide();
    });	
	
//<!--  返回列表 -->
	$('.ysbtn-return').click(function(e) {
		listInviteCodes();
		$('.yhq-success .ys-num').html('');
		$('.yhq-success .ys-code').children('b').remove();
		$('.yhq-success .ys-code').html('');
		$('.yhq-success').hide();
        $('.yhq-create').hide();
        $('.yhq-list').show();
    });
	
//<!--  继续创建 -->
	$('.ysbtn-create').click(function(e) {
		$('.yhq-success .ys-num').html('');
		$('.yhq-success .ys-code').children('b').remove();
		$('.yhq-success .ys-code').html('');
		$('.yhq-success').hide();
        $('.yhq-list').hide();
        $('.yhq-create').show();
    });

//删除邀请码
	$('.yqm-btn-del').live('click',function(e) {
		var r = confirm('确定要删除？？');
		if(r == true){
			var del= $(this);
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/invitecode/deleteInviteCode',
				type : 'get',
				dataType : 'json',
				data: {codeId:$(this).parent().parent().children('td:eq(0)').attr('codeId')},
				success : function(data){
					del.parent().parent().remove();
				},
			});
		}
    });
});


function  getDatai(page,code,employeeName,isForever,startTime,endTime,comment){
	var data = new Object();
	data.page = page;
	data.code = code;
	data.employeeName = employeeName;
	data.isForever = isForever;
	data.startTime = startTime;
	data.endTime = endTime;
	data.comment = comment;
	return data;	
}

//搜索的数据
function genDatai(){
	return getDatai(
	1,$('.yhqgl .search.yhq').val(),
	$('.yhqgl .search.creater').val(),$('.yhqgl .on-select option:selected').attr('value'),
	$('.yhq-list .Wdate.startTime').val(),
	$('.yhq-list .Wdate.endTime').val(),
	$('.yhq-list .beizhu').val()
	);
}

//渲染数据
function resolvePage(data){
	$('.yhqgll tr:gt(0)').remove();
	for(var x = 0; x < data.data.pageData.length ; x ++){
		//判断有效期类型
		if(data.data.pageData[x].effectiveType == 1){
			$('.yhqgll').append('<tr><td codeId='+data.data.pageData[x].codeId+'>'+data.data.pageData[x].productName+'</td><td>'+data.data.pageData[x].code+'</td><td>'+data.data.pageData[x].faceValue+'</td><td>'+data.data.pageData[x].allowedTimes+'</td><td>'+data.data.pageData[x].usedTimes+'</td><td>'+data.data.pageData[x].isForever+'</td><td>'+data.data.pageData[x].startDate+'</td><td>'+data.data.pageData[x].endDate+'</td><td>'+data.data.pageData[x].comment+'</td><td>'+data.data.pageData[x].employeeName+'</td><td>'+data.data.pageData[x].isDiscount+'</td><td>'+data.data.pageData[x].discount+'</td><td>时间段</td><td>'+data.data.pageData[x].effectiveDate+'</td><td><input type="button" value="删除" class="yqm-btn-del" /></td></tr>');
		}
		if(data.data.pageData[x].effectiveType == 2){
			$('.yhqgll').append('<tr><td codeId='+data.data.pageData[x].codeId+'>'+data.data.pageData[x].productName+'</td><td>'+data.data.pageData[x].code+'</td><td>'+data.data.pageData[x].faceValue+'</td><td>'+data.data.pageData[x].allowedTimes+'</td><td>'+data.data.pageData[x].usedTimes+'</td><td>'+data.data.pageData[x].isForever+'</td><td>'+data.data.pageData[x].startDate+'</td><td>'+data.data.pageData[x].endDate+'</td><td>'+data.data.pageData[x].comment+'</td><td>'+data.data.pageData[x].employeeName+'</td><td>'+data.data.pageData[x].isDiscount+'</td><td>'+data.data.pageData[x].discount+'</td><td>领取时起</td><td>'+data.data.pageData[x].effectiveDate+'</td><td><input type="button" value="删除" class="yqm-btn-del" /></td></tr>');
		}
		if(data.data.pageData[x].effectiveType == null){
			$('.yhqgll').append('<tr><td codeId='+data.data.pageData[x].codeId+'>'+data.data.pageData[x].productName+'</td><td>'+data.data.pageData[x].code+'</td><td>'+data.data.pageData[x].faceValue+'</td><td>'+data.data.pageData[x].allowedTimes+'</td><td>'+data.data.pageData[x].usedTimes+'</td><td>'+data.data.pageData[x].isForever+'</td><td>'+data.data.pageData[x].startDate+'</td><td>'+data.data.pageData[x].endDate+'</td><td>'+data.data.pageData[x].comment+'</td><td>'+data.data.pageData[x].employeeName+'</td><td>'+data.data.pageData[x].isDiscount+'</td><td>'+data.data.pageData[x].discount+'</td><td></td><td>'+data.data.pageData[x].effectiveDate+'</td><td><input type="button" value="删除" class="yqm-btn-del" /></td></tr>');
		}
		//当返回值为0时，优惠券非永久有效
		if(data.data.pageData[x].isForever == 0){
			$('.yhqgll tbody>tr:eq('+(x+1)+') td:eq(5)').html('否');	
		}
		//当返回值为1时，优惠券永久有效
		if(data.data.pageData[x].isForever == 1){
			$('.yhqgll tbody>tr:eq('+(x+1)+') td:eq(5)').html('是');	
		}
		
		//当返回值是0时，不是折扣券
		if(data.data.pageData[x].isDiscount == 0){
			$('.yhqgll tbody>tr:eq('+(x+1)+') td:eq(10)').html('否');	
		}
		//当返回值是1时，是折扣券
		if(data.data.pageData[x].isDiscount == 1){
			$('.yhqgll tbody>tr:eq('+(x+1)+') td:eq(10)').html('是');	
		}
	}
}

//根据不同的页码来渲染页面
function onClickPageNum(p){
	var data = genDatai();
	data.page = p;
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/invitecode/listInviteCodes/2.4.2',
		type : 'get',
		dataType : 'json',
		data: data,
		success : function(data){
			resolvePage(data);
		},
	});
}

//获取入参，渲染页面
function listInviteCodes(){
	//获取入参
	var data = genDatai();
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/invitecode/listInviteCodes/2.4.2',
		type : 'get',
		dataType : 'json',
		data: data,
		success : function(data){
			//创建分页
			$(".yhqgl .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:onClickPageNum
			});
			
			//渲染页面
			resolvePage(data);
		},
	});
}
