var testUrl = 'https://testcli.nggirl.com.cn';
$(function(){
	loadMessagePush();
//统计推送消息字数
	$('.text-area').keyup(function(e) {
        $('.txt-num-readonly').val($.trim($('.text-area').val()).length);
    });
	
//获取城市
	$.get(testUrl+'/nggirl-web/web/admin/dresser/getCitys',function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			for(var x = 0; x < data.data.length; x ++){
				$('.message-city').append('<input type="checkbox" value="'+data.data[x].cityId+'"/><label for="">'+data.data[x].cityName+'</label>&nbsp;&nbsp;');	
			}	
		};
		if(data.code == 1){
			alert(data.data.error);	
		}
	});
	
//点击城市里面的全部，获取全部的城市id
	var cityStr = '';
	var cityEndStr = '';
	$('.message-city input:eq(0)').click(function(e) {
		if(typeof($(this).attr('checked')) != "undefined"){
			cityStr = '';
			$(this).attr('value',1);
			$('.message-city input:gt(0)').each(function(index, element) {
				cityStr += $(this).attr('value') + ',';
				$(this).attr('checked','checked');
			});
		}else{
			$(this).attr('value',0);
			cityStr = '';
			$('.message-city input:gt(0)').each(function(index, element) {
				$(this).removeAttr('checked');
			});
		}
		console.log('cityStr+++++++++++++++++'+cityStr);
    });
	
	//点击除了全部以外的其它选项
	$('.message-city input:gt(0)').live('click',function(e) {
		$('.message-city input:eq(0)').attr('value',0);
        $('.message-city input:eq(0)').removeAttr('checked','checked');
    });
	
//选择不同的userType请求数据
	$('.radiobtn>input').click(function(e) {
		$('.recent-posts ul li').remove();
		var aaa = $('.txgl .on-select  option:selected').index();
		var utype;
		if($("input[name='usertype']:checked").val() == 1){
			utype ='用户端';
		}
		if($("input[name='usertype']:checked").val() == 2){
			utype ='化妆师';
		}
		$.ajax({
			url : testUrl+'/nggirl-web/web/admin/sysmessage/listMessages',
			type : 'get',
			dataType : 'json',
			data: {userType:$("input[name='usertype']:checked").val()},
			success : function(data){
				for(var x = 0; x < data.data.pageData.length; x ++){
					$('.recent-posts ul').append('<li><p style="color:#666;">'+data.data.pageData[x].content+'</p><p style="color: #a2a2a2">'+utype+'</p><p style="color: #a2a2a2">'+data.data.pageData[x].sendTime+'</p></li>');

				}
			},
		});
    });
	
	//推送类型为短信的时候其它两项隐藏
	$('.weight-box .sel-option').change(function(e) {
        if($(this).attr('value') == 4){
			$('.messagetype').hide();
			$('.forwardkey').hide();
			$('.message-city').show();
		}else{
			$('.messagetype').show();
			$('.forwardkey').show();
			$('.message-city').hide();
		}
    });

//推送消息
	$('.weight-box .submit-btn').click(function(e) {
		cityStr ='';
		//获取选中的城市id
		$('.message-city input:gt(0)').each(function(index, element) {
			if(typeof($(this).attr('checked')) != "undefined"){
				cityStr += $(this).attr('value') + ',';
			};
        });
		cityEndStr = cityStr.substring(0,cityStr.length-1);
		console.log('cityStr+++++++++++++++++'+cityStr);
		console.log('cityEndStr+++++++++++++++++'+cityEndStr);
		
		if($.trim($('.text-area').val())== ''){
			alert('请填入推送消息');	
		}else if($('.sel-option option:selected').attr('value') == ''){
			alert('请选择推送类型');	
		}else if($('.sel-option option:selected').attr('value') == 4){
			var r = confirm('确认要提交？？');
			if(r == true){
				$.ajax({
					url : testUrl+'/nggirl-web/web/admin/sysmessage/sendMessage/1.4.1',
					type : 'post',
					dataType : 'json',
					data: {userType:$("input[name='usertype']:checked").val(),content:$.trim($('.text-area').val()),sendType:$('.sel-option option:selected').attr('value'),messagetype:$('.messagetype option:selected').attr('value'),forwardkey:$('.forwardkey').val(),isAllCity:$('.message-city input:eq(0)').attr('value'),cityIds:cityEndStr},
					success : function(data){
						if(data.code == 0){
							$.ajax({
								url : testUrl+'/nggirl-web/web/admin/sysmessage/listMessages',
								type : 'get',
								dataType : 'json',
								data: {userType:$("input[name='usertype']:checked").val()},
								success : function(data){
									for(var x = 0; x < data.data.pageData.length; x ++){
										$('.recent-posts ul').append('<li><p style="color:#666;">'+data.data.pageData[x].content+'</p><p style="color: #a2a2a2">'+utype+'</p><p style="color: #a2a2a2">'+data.data.pageData[x].sendTime+'</p></li>');
									}
									alert('提交成功！！');
									window.location.reload();
								},
							});
						};
						if(data.code == 1){
							alert(data.data.error);	
						};
					},
				});
			}
		}else if($('.messagetype option:selected').attr('value') == ''){
			alert('请选择通知类型');	
		}else{
			if($('.messagetype option:selected').attr('value') == 'marketingactivity' && $('.forwardkey').val() == ''){
				alert('当通知类型为营销活动通知时，跳转地址必须填写哟亲！！');	
			}else{
				var r = confirm('确认要提交？？');
				if(r == true){
					$.ajax({
						url : testUrl+'/nggirl-web/web/admin/sysmessage/sendMessage/1.4.1',
						type : 'post',
						dataType : 'json',
						data: {userType:$("input[name='usertype']:checked").val(),content:$.trim($('.text-area').val()),sendType:$('.sel-option option:selected').attr('value'),messagetype:$('.messagetype option:selected').attr('value'),forwardkey:$('.forwardkey').val()},
						success : function(data){
							if(data.code == 0){
								$.ajax({
									url : testUrl+'/nggirl-web/web/admin/sysmessage/listMessages',
									type : 'get',
									dataType : 'json',
									data: {userType:$("input[name='usertype']:checked").val()},
									success : function(data){
										for(var x = 0; x < data.data.pageData.length; x ++){
											$('.recent-posts ul').append('<li><p style="color:#666;">'+data.data.pageData[x].content+'</p><p style="color: #a2a2a2">'+utype+'</p><p style="color: #a2a2a2">'+data.data.pageData[x].sendTime+'</p></li>');
		
										}
										alert('提交成功！！');
										loadMessagePush();
									},
								});
							};
							if(code == 1){
								alert(data.data.error);	
							};
						},
					});
				}
			}
		}
    });
});

var utype;
function loadMessagePush(){
	$('.recent-posts ul li').remove();
	$('.text-area').val('');
	var aaa = $('.txgl .on-select  option:selected').index();
	if($("input[name='usertype']:checked").val() == 1){
		utype ='用户端';
	}
	if($("input[name='usertype']:checked").val() == 2){
		utype ='化妆师';
	}
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/sysmessage/listMessages',
		type : 'get',
		dataType : 'json',
		data: {userType:$("input[name='usertype']:checked").val(),page:1},
		success : function(data){
			for(var x = 0; x < data.data.pageData.length; x ++){
				$('.recent-posts ul').append('<li><p style="color:#666;">'+data.data.pageData[x].content+'</p><p style="color: #a2a2a2">'+utype+'</p><p style="color: #a2a2a2">'+data.data.pageData[x].sendTime+'</p></li>');
			}
			$(".tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:function(p){
					$.ajax({
						url : testUrl+'/nggirl-web/web/admin/sysmessage/listMessages',
						type : 'get',
						dataType : 'json',
						data: {userType:$("input[name='usertype']:checked").val(),page:p},
						success : function(data){
							for(var x = 0; x < data.data.pageData.length; x ++){
								$('.recent-posts ul').append('<li><p style="color:#666;">'+data.data.pageData[x].content+'</p><p style="color: #a2a2a2">'+utype+'</p><p style="color: #a2a2a2">'+data.data.pageData[x].sendTime+'</p></li>');
							}
						},
					});
				}
			});
		},
	});
}