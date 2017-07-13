var testUrl = 'https://testcli.nggirl.com.cn';
$(function(){
	loadCaPage();
//时间转换
	Date.prototype.format = function(format) {
		var o = {
			"M+" :this.getMonth() + 1, // month
			"d+" :this.getDate(), // day
			"h+" :this.getHours(), // hour
			"m+" :this.getMinutes(), // minute
			"s+" :this.getSeconds(), // second
			"q+" :Math.floor((this.getMonth() + 3) / 3), // quarter
			"S" :this.getMilliseconds()
		// millisecond
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
	
//点击订单管理里面的“查看记录”按钮，查看每个订单对应的投诉或咨询记录
	$('.ddxq .look-message-btn').unbind('click');
	$('.ddxq .look-message-btn').live('click',function(e) {
		$('.new-ca .nc-true-name').val('');
		$('.new-ca .nc-local-city').val('');
		$('.new-ca .nc-sex option:eq(0)').attr('selected','selected');
		$('.nc-history-message').show();
		$('.ddxqq-search').hide();
		$('.nc-solve-message').hide();
		$('.nc-history-message').attr('orderId',$(this).parent().parent().parent().children('td:eq(0)').attr('reservationid'));
        $.get(testUrl+'/nggirl-web/web/admin/complaintConsult/listByOrderId/1.4.0',{orderId:$(this).parent().parent().parent().children('td:eq(0)').attr('reservationid')},function(data){
			var data = $.parseJSON(data);
			messageFn(data);
		});
    });	
		
//点击订单管理里面的“新建”按钮，新建每条订单对应的投诉或咨询记录
	$('.ddxq .create-btn').unbind('click');
	$('.ddxq .create-btn').live('click',function(e) {
		//设置用户昵称和电话不可更改状态
		$('.new-ca .nc-name').attr('disabled','disabled');
		$('.new-ca .nc-tel').attr('disabled','disabled');
		
		//让部分被查看时被禁用的文本框还原
		$('.new-ca .nc-select').removeAttr('disabled');
		$('.new-ca .nc-problem').removeAttr('disabled');
		
		//清空文本框
		$('.new-ca .nc-problem').val('');
		$('.new-ca .nc-solve').val('');
		$('.new-ca .nc-true-name').val('');
		$('.new-ca .nc-local-city').val('');
		$('.new-ca .nc-sex option:eq(0)').attr('selected','selected');
		
		$('.ddxqq-search').hide();
		$('.nc-solve-message').hide();
		$('.new-ca').show();
		$('.new-ca #new-ca-flag').val('1');
		$('.new-ca').attr('reservationid',$(this).parent().parent().parent().children('td:eq(0)').html());
		$('.new-ca').attr('name',$(this).parent().parent().parent().children('td:eq(2)').html());
		$('.new-ca').attr('tel',$(this).parent().parent().parent().children('td:eq(3)').html());
		//获取从订单里面带来的电话和用户昵称
		$('.new-ca .nc-name').val($('.new-ca').attr('name'));
		$('.new-ca .nc-tel').val($('.new-ca').attr('tel'));
    });	
	
//点击“新建”按钮，打开的新建投诉或者是咨询页面，点击里面的“保存”按钮
	$('.new-ca .nc-save-btn').unbind('click');
	$('.new-ca .nc-save-btn').click(function(e) {
		var dataMessage = {
			type:$('.new-ca .nc-select option:selected').attr('value'),
			orderId:$('.new-ca').attr('reservationid'),
			userName:$.trim($('.new-ca .nc-name').val()),
			phoneNum:$.trim($('.new-ca .nc-tel').val()),
			question:$.trim($('.new-ca .nc-problem').val()),
			solution:$.trim($('.new-ca .nc-solve').val()),
			status:1,
			realName:$.trim($('.new-ca .nc-true-name').val()),
			city:$.trim($('.new-ca .nc-local-city').val()),
			sex:$('.new-ca .nc-sex option:selected').attr('value')}
		
		//判断new-ca下的new-ca-flag的value值
		if($('.new-ca #new-ca-flag').attr('value') == 1){   // 订单管理里面的首页面
			if($.trim($('.new-ca .nc-problem').val()) == ''){
				alert('请填写问题！！');
			}else{
				var r = confirm('确认要保存？？');
				if(r == true){
					$.post(testUrl+'/nggirl-web/web/admin/complaintConsult/add/1.4.0',dataMessage,function(data){
						var data = $.parseJSON(data);
						if(data.code == 0){
							//加载订单页面
							loadListReservationsPage();
							alert('保存成功！！');
							//清除标签属性
							clearTagFn();
							
							$('.new-ca').hide();
							$('.ddxqq-search').show();
							$('.nc-solve-message').hide();
							
							//重新加载每条订单对应的投诉或者是咨询的记录
							messageDataFn();
						};
						
						if(data.code == 1){
							alert(data.data.error);	
						};
					});
				};
			}
		}else if($('.new-ca #new-ca-flag').attr('value') == 2){  //回到订单管理二级页面
			if($.trim($('.new-ca .nc-solve').val()) == ''){
				alert('请填写处理方法！！');
			}else{
				var r = confirm('确认要保存？？');
				if(r == true){
					$.post(testUrl+'/nggirl-web/web/admin/complaintConsult/addSolution',{complaintId:$('.new-ca').attr('id'),solution:$('.new-ca .nc-solve').val(),status:1},function(data){
						var data = $.parseJSON(data);
						if(data.code == 0){
							alert('保存成功！！');
							//清除标签属性
							clearTagFn();
							
							$('.new-ca').hide();
							$('.nc-solve-message').hide();
							$('.nc-history-message').show();
							
							//重新加载每条订单对应的投诉或者是咨询的记录
							messageDataFn();
						};
						
						if(data.code ==1){
							alert(data.data.error);	
						};
					});
				};
			}
		}else{    //回到投诉投诉咨询管理首页面
			//判断状态为三时new-ca中是否存在id，存在id则为添加，没有则为新增
			if(typeof($('.new-ca').attr('id')) == "undefined"){//新增
				if($.trim($('.new-ca .nc-tel').val()) == ''){
					alert('请填写手机号！！');
				}else if($.trim($('.new-ca .nc-sex').val()) != '0' & $.trim($('.new-ca .nc-sex').val()) != '1'){
					alert('请选择性别！！');
				}else if($.trim($('.new-ca .nc-problem').val()) == ''){
					alert('请填写问题！！');
				}else{
					var r = confirm('确认要保存？？');
					if(r == true){
						$.post(testUrl+'/nggirl-web/web/admin/complaintConsult/add/1.4.0',dataMessage,function(data){
							var data = $.parseJSON(data);
							if(data.code == 0){
								//加载订单页面
								loadCaPage();
								alert('保存成功！！');
								//清除标签属性
								clearTagFn();
								
								$('.new-ca').hide();
								$('.nc-solve-message').hide();
								$('.complaintsMangement').show();
								
								//重新加载每条订单对应的投诉或者是咨询的记录
								messageDataFn();
							};
							
							if(data.code == 1){
								alert(data.data.error);	
							};
						});
					};
				}
			}else{
				if($.trim($('.new-ca .nc-solve').val()) == ''){
					alert('请填写处理方法！！');
				}else{
					var r = confirm('确认要保存？？');
					if(r == true){
						$.post(testUrl+'/nggirl-web/web/admin/complaintConsult/addSolution',{complaintId:$('.new-ca').attr('id'),solution:$('.new-ca .nc-solve').val(),status:1},function(data){
							var data = $.parseJSON(data);
							if(data.code == 0){
								//加载订单页面
								loadCaPage();
								alert('保存成功！！');
								//清除标签属性
								clearTagFn();
								
								$('.new-ca').hide();
								$('.nc-solve-message').hide();
								$('.complaintsMangement').show();
								
								//重新加载每条订单对应的投诉或者是咨询的记录
								messageDataFn();
							};
							
							if(data.code ==1){
								alert(data.data.error);	
							};
						});
					};
				}
			}
		}
    });

//点击“新建”按钮，打开的新建投诉或者是咨询页面，点击里面的”已经处理“按钮
	$('.new-ca .nc-already-save-btn').unbind('click');
	$('.new-ca .nc-already-save-btn').click(function(e) {
		var dataMessage = {
			type:$('.new-ca .nc-select option:selected').attr('value'),
			orderId:$('.new-ca').attr('reservationid'),
			userName:$.trim($('.new-ca .nc-name').val()),
			phoneNum:$.trim($('.new-ca .nc-tel').val()),
			question:$.trim($('.new-ca .nc-problem').val()),
			solution:$.trim($('.new-ca .nc-solve').val()),
			status:2,
			realName:$.trim($('.new-ca .nc-true-name').val()),
			city:$.trim($('.new-ca .nc-local-city').val()),
			sex:$('.new-ca .nc-sex option:selected').attr('value')}

		//判断$('.new-ca')下的new-ca-flag的value值
		if($('.new-ca #new-ca-flag').attr('value') == 1){
			if($.trim($('.new-ca .nc-problem').val()) == ''){
				alert('请填写问题！！');
			}else if($.trim($('.new-ca .nc-solve').val()) == ''){
					alert('请填写处理方法！！');
			}else{
				var r = confirm('确认要保存？？');
				if(r == true){
					$.post(testUrl+'/nggirl-web/web/admin/complaintConsult/add/1.4.0',dataMessage,function(data){
						var data = $.parseJSON(data);
						if(data.code == 0){
							//加载订单页面
							loadListReservationsPage();
							alert('关单成功！！');
							//清除标签属性
							clearTagFn();
							
							$('.new-ca').hide();
							$('.nc-solve-message').hide();
							$('.ddxqq-search').show();
							
							//重新加载每条订单对应的投诉或者是咨询的记录
							messageDataFn();
						};
						
						if(data.code ==1){
							alert(data.data.error);	
						};
					});
				};
			}
		}else if($('.new-ca #new-ca-flag').attr('value') == 2){
			if($.trim($('.new-ca .nc-solve').val()) == ''){
				alert('请填写处理方法！！');
			}else{
				var r = confirm('确认要保存？？');
				if(r == true){
					$.post(testUrl+'/nggirl-web/web/admin/complaintConsult/addSolution',{complaintId:$('.new-ca').attr('id'),solution:$('.new-ca .nc-solve').val(),status:2},function(data){
						var data = $.parseJSON(data);
						if(data.code == 0){
							alert('关单成功！！');
							//清除标签属性
							clearTagFn();
							
							$('.new-ca').hide();
							$('.nc-solve-message').hide();
							$('.nc-history-message').show();
							
							//重新加载每条订单对应的投诉或者是咨询的记录
							messageDataFn();
						};
						
						if(data.code ==1){
							alert(data.data.error);	
						};
					});
				};
			}
		}else{
			//判断当前new-ca中是否存在id 
			if(typeof($('.new-ca').attr('id')) == "undefined"){//新增status:2
				if($.trim($('.new-ca .nc-tel').val()) == ''){
					alert('请填写手机号！！');
				}else if($.trim($('.new-ca .nc-sex').val()) != '0' & $.trim($('.new-ca .nc-sex').val()) != '1'){
					alert('请选择性别！！');
				}else if($.trim($('.new-ca .nc-problem').val()) == ''){
					alert('请填写问题！！');
				}else if($.trim($('.new-ca .nc-solve').val()) == ''){
					alert('请填写处理方法！！');
				}else{
				var r = confirm('确认要保存？？');
					if(r == true){
						$.post(testUrl+'/nggirl-web/web/admin/complaintConsult/add/1.4.0',dataMessage,function(data){
							var data = $.parseJSON(data);
							if(data.code == 0){
								//加载订单页面
								loadCaPage();
								alert('关单成功！！');
								//清除标签属性
								clearTagFn();
								
								$('.new-ca').hide();
								$('.complaintsMangement').show();
								$('.nc-solve-message').hide();
							};
							
							if(data.code ==1){
								alert(data.data.error);	
							};
						});
					};
				}			
			}else{
				if($.trim($('.new-ca .nc-solve').val()) == ''){
					alert('请填写处理方法！！');
				}else{
					var r = confirm('确认要保存？？');
					if(r == true){
						$.post(testUrl+'/nggirl-web/web/admin/complaintConsult/addSolution',{complaintId:$('.new-ca').attr('id'),solution:$('.new-ca .nc-solve').val(),status:2},function(data){
							var data = $.parseJSON(data);
							if(data.code == 0){
								//加载订单页面
								loadCaPage();
								alert('关单成功！！');
								//清除标签属性
								clearTagFn();
								
								$('.new-ca').hide();
								$('.complaintsMangement').show();
								$('.nc-solve-message').hide();
							};
							
							if(data.code ==1){
								alert(data.data.error);	
							};
						});
					};
				}
			}
		}
    });
	
//点击“新建”按钮，打开的新建投诉或者是咨询页面，点击里面的”取消“按钮
	$('.new-ca .nc-cancle-btn').unbind('click');
	$('.new-ca .nc-cancle-btn').click(function(e) {
		//清空文本框
		$('.new-ca .nc-solve').val('');
		
		//判断new-ca窗体内的#new-ca-flag的value值，1为订单管理里面的未处理里面的取消，2为订单管理里面的新建里面的取消，其它的为投诉/咨询管理里面的新建和未处理里面的取消
		if($('.new-ca #new-ca-flag').attr('value') ==2){
			$('.new-ca').hide();
			$('.nc-solve-message').hide();
			$('.nc-history-message').show();
			$('.new-ca').removeAttr('id');
		}else if($('.new-ca #new-ca-flag').attr('value')==1){
			$('.new-ca').hide();
			$('.ddxqq-search').show();
			$('.nc-solve-message').hide();
		}
		else{
			$('.new-ca').removeAttr('id');
			$('.new-ca').hide();
			$('.nc-solve-message').hide();
			$('.complaintsMangement').show();
		}
		//清除标签属性
		clearTagFn();
    });
	
//点击订单管理里面的“查看记录”按钮，查看每个订单对应的投诉或咨询记录里面的“返回”按钮
	$('.nc-history-message .nhm-return-btn').click(function(e) {
		//清空之前加载的数据
		$('.comp-table tbody tr:gt(0)').remove();
		$('.adv-table tbody tr:gt(0)').remove();
		
        $('.nc-history-message').hide();
		$('.ddxqq-search').show();
    });
	
//点击“订单管理”里面的“查看记录”里面的“投诉/咨询”里面的“未处理”按钮
	$('.comp-table-nochuli').unbind('click');
	$('.comp-table-nochuli').live('click',function(e) {
		//清空文本框
		$('.nc-solve').val('');
		
		//存储订单id
		$('.new-ca').attr('orderid',$('.nc-history-message').attr('orderid'));
		$('.nc-solve-message').show();
		$('.nsm-reutn-btn').hide();
		//把投诉或咨询id加到窗体中
		$('.new-ca').attr('id',$(this).parent().parent().children('td:eq(0)').html());
        $.get(testUrl+'/nggirl-web/web/admin/complaintConsult/getDetails/1.4.0',{id:$(this).parent().parent().children('td:eq(0)').html()},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				//判断是咨询还是投诉（1为投诉，2为咨询）
				$('.new-ca .nc-select option').each(function() {
					if($(this).attr('value') == data.data.type){
						$(this).attr('selected','selected');
						$('.new-ca .nc-select').attr('disabled','true');	
					};
				});
				
				//文本框为不可用状态
				$('.new-ca .nc-name').attr('disabled','true');
				$('.new-ca .nc-tel').attr('disabled','true');
				$('.new-ca .nc-problem').attr('disabled','true');
				
				//清除之前加载的数据
				$('.nc-solve-message ul li').remove();
				
				$('.nc-history-message').hide();
				$('.new-ca').show();
				$('.new-ca #new-ca-flag').val("2");  // 订单中间页面
				$('.new-ca .nc-name').val(data.data.userName);
				$('.new-ca .nc-tel').val(data.data.phoneNum);
				$('.new-ca .nc-true-name').val(data.data.realName);
				$('.new-ca .nc-local-city').val(data.data.city);
				$('.new-ca .nc-sex option').each(function(index, element) {
                    if($(this).attr('value') == data.data.sex){
						$(this).attr('selected','selected');	
					};
                });
				$('.new-ca .nc-problem').val(data.data.question);
				$('.nc-solve-question').html('问题：'+data.data.question);
				for(var x =0; x < data.data.solutions.length; x ++){
					$('.nc-solve-message ul').append('<li><div class="nc-ul-left">'+(parseInt(x)+1)+'、'+data.data.solutions[x].content+'</div><div class="nc-ul-right">'+new Date(data.data.solutions[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</div></li>');
				}
			};
			
			if(data.code == 1){
				alert(data.data.error);	
			}
		});
    });
	
//点击“投诉/咨询管理”里面的“未处理”按钮
	$('.complaintsMangement .processed').unbind('click');
	$('.complaintsMangement .processed').live('click',function(e) {
		//清空文本框
		$('.nc-solve').val('');
		
		//把投诉或咨询id加到窗体中
		$('.new-ca').attr('id',$(this).parent().parent().children('td:eq(1)').html());
        $.get(testUrl+'/nggirl-web/web/admin/complaintConsult/getDetails/1.4.0',{id:$(this).parent().parent().children('td:eq(1)').html()},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				//判断是咨询还是投诉（1为投诉，2为咨询）
				$('.new-ca .nc-select option').each(function() {
					if($(this).attr('value') == data.data.type){
						$(this).attr('selected','selected');
						$('.new-ca .nc-select').attr('disabled','true');	
					};
				});
				
				//文本框不可用
				$('.new-ca .nc-name').attr('disabled','disabled');
				$('.new-ca .nc-tel').attr('disabled','disabled');
				$('.new-ca .nc-problem').attr('disabled','disabled');
				
				//清除之前加载的数据
				$('.nc-solve-message ul li').remove();
				
				//数据回显
				$('.new-ca .nc-name').val($(this).parent().parent().children('td:eq(4)').val());
				$('.new-ca .nc-tel').val($(this).parent().parent().children('td:eq(2)').val());
				$('.new-ca .nc-problem').val($(this).parent().parent().children('td:eq(8)').val());
				
				$('.nc-history-message').hide();
				$('.new-ca').show();
				$('.new-ca #new-ca-flag').val('3');
				$('.nc-solve-message').show();
				$('.complaintsMangement').hide();
				$('.new-ca .nc-name').val(data.data.userName);
				$('.new-ca .nc-tel').val(data.data.phoneNum);
				$('.new-ca .nc-true-name').val(data.data.realName);
				$('.new-ca .nc-local-city').val(data.data.city);
				$('.new-ca .nc-sex option').each(function(index, element) {
                    if($(this).attr('value') == data.data.sex){
						$(this).attr('selected','selected');	
					};
                });
				$('.new-ca .nc-problem').val(data.data.question);
				$('.nsm-reutn-btn').hide();
				$('.nc-solve-question').html('问题：'+data.data.question);
				for(var x =0; x < data.data.solutions.length; x ++){
					$('.nc-solve-message ul').append('<li><div class="nc-ul-left">'+(parseInt(x)+1)+'、'+data.data.solutions[x].content+'</div><div class="nc-ul-right">'+new Date(data.data.solutions[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</div></li>');
				}
			};
			
			if(data.code == 1){
				alert(data.data.error);	
			}
		});
    });
	
//点击“订单管理”里面的“查看记录”里面的“投诉/咨询”里面的“已处理”按钮
	$('.comp-table-yichuli').live('click',function(e) {
		$('.nsm-reutn-btn').show();
		//把投诉或咨询id加到窗体中
		$('.new-ca').attr('id',$(this).parent().parent().children('td:eq(0)').html());
        $.get(testUrl+'/nggirl-web/web/admin/complaintConsult/getDetails/1.4.0',{id:$(this).parent().parent().children('td:eq(0)').html()},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){		
				//清除之前加载的数据
				$('.nc-solve-message ul li').remove();
				
				$('.nc-history-message').hide();
				$('.nc-solve-message').show();	
				$('.nc-solve-question').html('问题：'+data.data.question);
				for(var x =0; x < data.data.solutions.length; x ++){
					$('.nc-solve-message ul').append('<li><div class="nc-ul-left">'+(parseInt(x)+1)+'、'+data.data.solutions[x].content+'</div><div class="nc-ul-right">'+new Date(data.data.solutions[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</div></li>');
				}
			};
			
			if(data.code == 1){
				alert(data.data.error);	
			}
		});
    });
	
//点击“已经处理”按钮打开的已处理过问题的页面里面的“返回”按钮
	$('.nsm-reutn-btn').click(function(e) {
		//判断new-ca窗体里面有没有id,如果有则点击返回，回到的是订单管理的二级页面，没有则返回的是咨询/投诉管理里面的一级一面
		if(typeof($('.new-ca').attr('id')) != "undefined"){
			$('.nc-history-message').show();
			$('.nc-solve-message').hide();
			$('.new-ca').removeAttr('id');
		}else{
			$('.nc-solve-message').hide();
			$('.complaintsMangement').show();	
		}
    });
	
// 点击“订单/投诉管理”--》搜索按钮
	$('.complaintsMangement .cm-search-btn').click(function(){
		
		if($('.complaintsMangement .type-select option:selected').attr('value') == 1){
			//投诉
			$('.c-table').show();
			$('.a-table').hide();	
			loadCaPage();
		};
		if($('.complaintsMangement .type-select option:selected').attr('value') == 2){
			//咨询
			$('.a-table').show();
			$('.c-table').hide();
			loadCaPage();		
		};
	});	

//点击“订单/投诉管理”里面的“全部取消”按钮
	$('.complaintsMangement .cm-cancle-btn').click(function(e) {
		$('.complaintsMangement .cm-order-num').val('');//订单编号
		$('.complaintsMangement .cm-complans-num').val('');//化妆师
		$('.complaintsMangement .cm-tel').val('');//预约地址
		$('.complaintsMangement .cm-dresser-name').val('');//用户昵称
		$('.complaintsMangement .cm-user-name').val('');//用户电话
    });
//城市选择框
//获取省的列表
		$.ajax({
			url : testUrl+'/nggirl-web/web/admin/common/getCitys',
			type : 'get',
			dataType : 'json',
			data: {},
			success : function(data){
				for(var x = 0; x <data.data.length; x ++){
					$('#complaint-province').append('<option cityId = "'+data.data[x].cityId+'" key="'+data.data[x].key+'">'+data.data[x].cityName+'</option>');
				}
			},
		});	
				
		//添加化妆师--城市级联
		/*$('#complaint-province').change(function(){
			//获取省对应城市的列表
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/getCountys',
				type : 'get',
				dataType : 'json',
				data: {cityId:$('#complaint-province option:selected').attr('cityId')},
				success : function(data){
					$('.complaint-city option:gt(0)').remove();
					for(var x = 0; x <data.data.length; x ++){
						$('.complaint-city').append('<option areaId="'+data.data[x].countyId+'">'+data.data[x].countyName+'</option>');
					}
				},
			});	
		});	*/
//点击“订单/投诉管理”里面的“新建咨询”按钮
	$('.complaintsMangement .cm-create-btn').click(function(e) {
		$('.new-ca .nc-true-name').val('');
		$('.new-ca .nc-local-city').val('');
		$('.new-ca .nc-sex option:eq(0)').attr('selected','selected');
		$('.new-ca .nc-local-city option:eq(0)').attr('selected','selected');
		$('.complaintsMangement').hide();
        $('.new-ca').show();
		$('.new-ca #new-ca-flag').val('3');
		$('.new-ca').removeAttr('id');
		$('.new-ca .nc-select option:eq(1)').attr('selected','selected');
		$('.new-ca .nc-select').attr('disabled','true');
		
		//清除之前存储的标签属性
		clearTagFn();
		
		//清除文本框信息
		$('.new-ca .nc-name').val('');
		$('.new-ca .nc-tel').val('');
		$('.new-ca .nc-problem').val('');
		$('.new-ca .nc-solve').val('');
		
		//清除之前可能遗留下来的属性标签
		$('.new-ca .nc-name').removeAttr('disabled');
		$('.new-ca .nc-tel').removeAttr('disabled');
		$('.new-ca .nc-problem').removeAttr('disabled');
    });
	
//点击“订单/投诉管理”里面的“已处理”按钮
	$('.untreated').unbind('click');
	$('.untreated').live('click',function(e) {
		//清除ｎｅｗ-ca窗体里面的id
		$('.new-ca').removeAttr('id');
        $.get(testUrl+'/nggirl-web/web/admin/complaintConsult/getDetails/1.4.0',{id:$(this).parent().parent().children('td:eq(1)').html()},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.nc-solve-message').show();
				$('.complaintsMangement').hide();
				$('.new-ca').hide();
				$('.nsm-reutn-btn').show();
				//清除之前加载的数据
				$('.nc-solve-message ul li').remove();
				
				$('.nc-history-message').hide();
				$('.new-ca .nc-name').val(data.data.userName);
				$('.new-ca .nc-tel').val(data.data.phoneNum);
				$('.new-ca .nc-problem').val(data.data.question);
				$('.new-ca .nc-true-name').val(data.data.realName);
				$('.new-ca .nc-local-city').val(data.data.city);
				$('.new-ca .nc-sex option').each(function(index, element) {
                    if($(this).attr('value') == data.data.sex){
						$(this).attr('selected','selected');	
					};
                });
				$('.nc-solve-question').html('问题：'+data.data.question);
				for(var x =0; x < data.data.solutions.length; x ++){
					$('.nc-solve-message ul').append('<li><div class="nc-ul-left">'+(parseInt(x)+1)+'、'+data.data.solutions[x].content+'</div><div class="nc-ul-right">'+new Date(data.data.solutions[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</div></li>');
				}
			};
			
			if(data.code == 1){
				alert(data.data.error);	
			}
		});
    });
	
});

//清除属性标签
function clearTagFn(){
	$('.new-ca').removeAttr('reservationid');
	$('.new-ca').removeAttr('name');
	$('.new-ca').removeAttr('tel');
}

//加载每条订单对应投诉或者咨询记录
function messageFn(data){
	//清空之前加载的数据
	$('.comp-table tbody tr:gt(0)').remove();
	$('.adv-table tbody tr:gt(0)').remove();
	$('.nc-history-message .nhm-orderid').html(data.data.orderId);//订单编号
	$('.nc-history-message .nhm-dressername').html(data.data.dresserName);//化妆师
	$('.nc-history-message .nhm-address').html(data.data.resPlace);//预约地址
	$('.nc-history-message .nhm-name').html(data.data.userName);//用户昵称
	$('.nc-history-message .nhm-tel').html(data.data.phoneNum);//用户电话
	$('.nc-history-message .nhm-time').html(data.data.resTime);//预约时间
	
	//每条订单对应的记录
	for(var x = 0; x < data.data.questions.length; x ++){					
		//判断是否为投诉（1为投诉）
		if(data.data.questions[x].type == 1){
			//判断是否已处理(1为未处理)
			//判断性别(男)
			if(data.data.questions[x].sex == 0){
				if(data.data.questions[x].status == 1){
					$('.comp-table tbody').append('<tr><td>'+data.data.questions[x].id+'</td><td>'+new Date(data.data.questions[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</td><td>'+data.data.questions[x].question+'</td><td>'+data.data.questions[x].realName+'</td><td>'+data.data.questions[x].city+'</td><td>男</td><td><input type="button" value="未处理" class="comp-table-nochuli" style="padding:5px; background:#51a351; color:#fff;"/></td></tr>');	
				};
				//判断是否已处理(2为已处理)
				if(data.data.questions[x].status == 2){
					$('.comp-table tbody').append('<tr><td>'+data.data.questions[x].id+'</td><td>'+new Date(data.data.questions[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</td><td>'+data.data.questions[x].question+'</td><td>'+data.data.questions[x].realName+'</td><td>'+data.data.questions[x].city+'</td><td>男</td><td><input type="button" value="已处理" class="comp-table-yichuli" style="padding:5px; background:#bd362f; color:#fff;" /></td></tr>');	
				};
			};
			//女
			if(data.data.questions[x].sex == 1){
				if(data.data.questions[x].status == 1){
					$('.comp-table tbody').append('<tr><td>'+data.data.questions[x].id+'</td><td>'+new Date(data.data.questions[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</td><td>'+data.data.questions[x].question+'</td><td>'+data.data.questions[x].realName+'</td><td>'+data.data.questions[x].city+'</td><td>女</td><td><input type="button" value="未处理" class="comp-table-nochuli" style="padding:5px; background:#51a351; color:#fff;"/></td></tr>');	
				};
				//判断是否已处理(2为已处理)
				if(data.data.questions[x].status == 2){
					$('.comp-table tbody').append('<tr><td>'+data.data.questions[x].id+'</td><td>'+new Date(data.data.questions[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</td><td>'+data.data.questions[x].question+'</td><td>'+data.data.questions[x].realName+'</td><td>'+data.data.questions[x].city+'</td><td>女</td><td><input type="button" value="已处理" class="comp-table-yichuli" style="padding:5px; background:#bd362f; color:#fff;" /></td></tr>');	
				};
			};
		};
		
		//判断是否为投诉（2为咨询）
		if(data.data.questions[x].type == 2){
			//判断是否已处理(1为未处理)
			//判断性别（男）
			if(data.data.questions[x].sex == 0){
				if(data.data.questions[x].status == 1){
					$('.adv-table tbody').append('<tr><td>'+data.data.questions[x].id+'</td><td>'+new Date(data.data.questions[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</td><td>'+data.data.questions[x].question+'</td><td>'+data.data.questions[x].realName+'</td><td>'+data.data.questions[x].city+'</td><td>男</td><td><input type="button" value="未处理" class="comp-table-nochuli" style="padding:5px; background:#51a351; color:#fff;"/></td></tr>');	
				};
				//判断是否已处理(2为已处理)
				if(data.data.questions[x].status == 2){
					$('.adv-table tbody').append('<tr><td>'+data.data.questions[x].id+'</td><td>'+new Date(data.data.questions[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</td><td>'+data.data.questions[x].question+'</td><td>'+data.data.questions[x].realName+'</td><td>'+data.data.questions[x].city+'</td><td>男</td><td><input type="button" value="已处理" class="comp-table-yichuli" style="padding:5px; background:#bd362f; color:#fff;" /></td></tr>');	
				};
			};
			if(data.data.questions[x].sex == 1){
				if(data.data.questions[x].status == 1){
					$('.adv-table tbody').append('<tr><td>'+data.data.questions[x].id+'</td><td>'+new Date(data.data.questions[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</td><td>'+data.data.questions[x].question+'</td><td>'+data.data.questions[x].realName+'</td><td>'+data.data.questions[x].city+'</td><td>女</td><td><input type="button" value="未处理" class="comp-table-nochuli" style="padding:5px; background:#51a351; color:#fff;"/></td></tr>');	
				};
				//判断是否已处理(2为已处理)
				if(data.data.questions[x].status == 2){
					$('.adv-table tbody').append('<tr><td>'+data.data.questions[x].id+'</td><td>'+new Date(data.data.questions[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</td><td>'+data.data.questions[x].question+'</td><td>'+data.data.questions[x].realName+'</td><td>'+data.data.questions[x].city+'</td><td>女</td><td><input type="button" value="已处理" class="comp-table-yichuli" style="padding:5px; background:#bd362f; color:#fff;" /></td></tr>');	
				};
			};
		};
	}
}

function messageDataFn(){
	//重新加载每条订单对应的投诉或者是咨询的记录
	$.get(testUrl+'/nggirl-web/web/admin/complaintConsult/listByOrderId/1.4.0',{orderId:$('.new-ca').attr('orderid')},function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			messageFn(data);
		};
		if(data.code == 1){
			alert(data.data.error);
		};
	});
}


//<!---------------------------------------------------------------------加载投诉/咨询管理页面 ----------------------------------------------->	

//创建投诉/咨询列表分页
function createCaPage(data){
	$(".c-table .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getCaSearchParams();
			params.page = p;
			$('.complaints-table>tbody>tr:gt(0)').remove();
			$('.advisory-table>tbody>tr:gt(0)').remove();
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/complaintConsult/list/1.4.0',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initCaPage
			});			
		}
	});
	$(".a-table .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getCaSearchParams();
			params.page = p;
			$('.complaints-table>tbody>tr:gt(0)').remove();
			$('.advisory-table>tbody>tr:gt(0)').remove();
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/complaintConsult/list/1.4.0',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initCaPage
			});			
		}
	});
}

//初始化投诉/咨询分页
function initCaPage(data){
	createCaPage(data);
	for(var x = 0; x < data.data.pageData.length ; x ++){
		//判断投诉或咨询状态（1为未处理）
		if(data.data.pageData[x].status == 1){
			//判断性别(男)
			if(data.data.pageData[x].sex == 0){
				$('.complaints-table').append('<tr><td>'+data.data.pageData[x].orderId+'</td><td>'+data.data.pageData[x].id+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+new Date(data.data.pageData[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</td><td>'+data.data.pageData[x].userName+'</td><td>'+data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].resPlace+'</td><td>'+data.data.pageData[x].resTime+'</td><td>'+data.data.pageData[x].question+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+data.data.pageData[x].city+'</td><td>男</td><td><input compid='+data.data.pageData[x].id+' type="button" value="未处理" class="processed" style="padding:5px; background:#51a351; color:#fff;" /></td></tr>');
				
			$('.advisory-table').append('<tr><td>'+data.data.pageData[x].orderId+'</td><td>'+data.data.pageData[x].id+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+new Date(data.data.pageData[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</td><td>'+data.data.pageData[x].userName+'</td><td>'+data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].resPlace+'</td><td>'+data.data.pageData[x].resTime+'</td><td>'+data.data.pageData[x].question+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+data.data.pageData[x].city+'</td><td>男</td><td><input compid='+data.data.pageData[x].id+' type="button" value="未处理" class="processed" style="padding:5px; background:#51a351; color:#fff;" /></td></tr>');
			};
			//判断性别(女)
			if(data.data.pageData[x].sex == 1){
				$('.complaints-table').append('<tr><td>'+data.data.pageData[x].orderId+'</td><td>'+data.data.pageData[x].id+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+new Date(data.data.pageData[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</td><td>'+data.data.pageData[x].userName+'</td><td>'+data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].resPlace+'</td><td>'+data.data.pageData[x].resTime+'</td><td>'+data.data.pageData[x].question+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+data.data.pageData[x].city+'</td><td>女</td><td><input compid='+data.data.pageData[x].id+' type="button" value="未处理" class="processed" style="padding:5px; background:#51a351; color:#fff;" /></td></tr>');
				
			$('.advisory-table').append('<tr><td>'+data.data.pageData[x].orderId+'</td><td>'+data.data.pageData[x].id+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+new Date(data.data.pageData[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</td><td>'+data.data.pageData[x].userName+'</td><td>'+data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].resPlace+'</td><td>'+data.data.pageData[x].resTime+'</td><td>'+data.data.pageData[x].question+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+data.data.pageData[x].city+'</td><td>女</td><td><input compid='+data.data.pageData[x].id+' type="button" value="未处理" class="processed" style="padding:5px; background:#51a351; color:#fff;" /></td></tr>');
			};
			//判断性别(null)
			if(data.data.pageData[x].sex == null){
				$('.complaints-table').append('<tr><td>'+data.data.pageData[x].orderId+'</td><td>'+data.data.pageData[x].id+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+new Date(data.data.pageData[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</td><td>'+data.data.pageData[x].userName+'</td><td>'+data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].resPlace+'</td><td>'+data.data.pageData[x].resTime+'</td><td>'+data.data.pageData[x].question+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+data.data.pageData[x].city+'</td><td> </td><td><input compid='+data.data.pageData[x].id+' type="button" value="未处理" class="processed" style="padding:5px; background:#51a351; color:#fff;" /></td></tr>');
				
			$('.advisory-table').append('<tr><td>'+data.data.pageData[x].orderId+'</td><td>'+data.data.pageData[x].id+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+new Date(data.data.pageData[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</td><td>'+data.data.pageData[x].userName+'</td><td>'+data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].resPlace+'</td><td>'+data.data.pageData[x].resTime+'</td><td>'+data.data.pageData[x].question+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+data.data.pageData[x].city+'</td><td> </td><td><input compid='+data.data.pageData[x].id+' type="button" value="未处理" class="processed" style="padding:5px; background:#51a351; color:#fff;" /></td></tr>');
			};
		};
		//判断投诉或咨询状态（2为已处理）
		if(data.data.pageData[x].status == 2){
			//判断性别(男)
			if(data.data.pageData[x].sex == 0){
					$('.complaints-table').append('<tr><td>'+data.data.pageData[x].orderId+'</td><td>'+data.data.pageData[x].id+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+new Date(data.data.pageData[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</td><td>'+data.data.pageData[x].userName+'</td><td>'+data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].resPlace+'</td><td>'+data.data.pageData[x].resTime+'</td><td>'+data.data.pageData[x].question+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+data.data.pageData[x].city+'</td><td>男</td><td><input type="button" value="已处理" class="untreated" style="padding:5px; background:#bd362f; color:#fff;" /></td></tr>');
					
				$('.advisory-table').append('<tr><td>'+data.data.pageData[x].orderId+'</td><td>'+data.data.pageData[x].id+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+new Date(data.data.pageData[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</td><td>'+data.data.pageData[x].userName+'</td><td>'+data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].resPlace+'</td><td>'+data.data.pageData[x].resTime+'</td><td>'+data.data.pageData[x].question+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+data.data.pageData[x].city+'</td><td>男</td><td><input type="button" value="已处理" class="untreated" style="padding:5px; background:#bd362f; color:#fff;" /></td></tr>');
			};		
			if(data.data.pageData[x].sex == 1){
					$('.complaints-table').append('<tr><td>'+data.data.pageData[x].orderId+'</td><td>'+data.data.pageData[x].id+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+new Date(data.data.pageData[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</td><td>'+data.data.pageData[x].userName+'</td><td>'+data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].resPlace+'</td><td>'+data.data.pageData[x].resTime+'</td><td>'+data.data.pageData[x].question+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+data.data.pageData[x].city+'</td><td>女</td><td><input type="button" value="已处理" class="untreated" style="padding:5px; background:#bd362f; color:#fff;" /></td></tr>');
					
				$('.advisory-table').append('<tr><td>'+data.data.pageData[x].orderId+'</td><td>'+data.data.pageData[x].id+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+new Date(data.data.pageData[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</td><td>'+data.data.pageData[x].userName+'</td><td>'+data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].resPlace+'</td><td>'+data.data.pageData[x].resTime+'</td><td>'+data.data.pageData[x].question+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+data.data.pageData[x].city+'</td><td>女</td><td><input type="button" value="已处理" class="untreated" style="padding:5px; background:#bd362f; color:#fff;" /></td></tr>');
			};		
			if(data.data.pageData[x].sex == null){
					$('.complaints-table').append('<tr><td>'+data.data.pageData[x].orderId+'</td><td>'+data.data.pageData[x].id+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+new Date(data.data.pageData[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</td><td>'+data.data.pageData[x].userName+'</td><td>'+data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].resPlace+'</td><td>'+data.data.pageData[x].resTime+'</td><td>'+data.data.pageData[x].question+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+data.data.pageData[x].city+'</td><td> </td><td><input type="button" value="已处理" class="untreated" style="padding:5px; background:#bd362f; color:#fff;" /></td></tr>');
					
				$('.advisory-table').append('<tr><td>'+data.data.pageData[x].orderId+'</td><td>'+data.data.pageData[x].id+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+new Date(data.data.pageData[x].createTime).format("yyyy-MM-dd hh:mm:ss")+'</td><td>'+data.data.pageData[x].userName+'</td><td>'+data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].resPlace+'</td><td>'+data.data.pageData[x].resTime+'</td><td>'+data.data.pageData[x].question+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+data.data.pageData[x].city+'</td><td> </td><td><input type="button" value="已处理" class="untreated" style="padding:5px; background:#bd362f; color:#fff;" /></td></tr>');
			};		
		};
	}
}

//获取查询参数
function getCaSearchParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	params.orderId = $('.complaintsMangement .cm-order-num').val();
	params.complaintId = $('.complaintsMangement .cm-complans-num').val();
	params.phoneNum = $('.complaintsMangement .cm-tel').val();
	params.dresserName = $('.complaintsMangement .cm-dresser-name').val();
	params.userName = $('.complaintsMangement .cm-user-name').val();
	params.status = $('.complaintsMangement .status-select option:selected').attr('value');
	params.type = $('.complaintsMangement .type-select option:selected').attr('value');
	return params;
}

//加载投诉/咨询分页数据
function loadCaPage(){
	$('.complaints-table>tbody>tr:gt(0)').remove();
	$('.advisory-table>tbody>tr:gt(0)').remove();
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/complaintConsult/list/1.4.0',
		type : 'get',
		dataType : 'json',
		data: getCaSearchParams(1),
		success : initCaPage,
	});
}
	


