var testUrl = 'https://testcli.nggirl.com.cn';
$(function(){
	loadZiXunPage();
//资讯管理--》搜索按钮
	$('.zxgll .search-btn').click(loadZiXunPage);
//资讯管理--》删除按钮
	$('.zxgl-del-btn').live('click',function(e){
		var r = confirm('确定要删除？？');
		if(r == true){
			var del = $(this);
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/focuscontent/delete',
				type : 'post',
				dataType : 'json',
				data: {contentId:$(this).parent().parent().children('td:eq(0)').html()},
				success : function(data){
					del.parent().parent().remove();
				},
			});	
		}
	});
//资讯管理--》取消全部按钮--》清空文本框
	$('.zxgll .cancle-btn').click(function(e) {
		$('.zxgll .qian').val('');
		$('.zxgll .hou').val('');
	});

//资讯管理--》新建按钮
	$('.new-zx-btn').click(function(e) {
		window.open ("focusimagemanage.html");
	});

//发布资讯
	$('.zxgl .zxgl-status-btn0').live('click',function(e){
		var r = confirm('确定要发布资讯？？');
		if(r == true){
			var fabu = $(this);
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/focuscontent/publish',
				type : 'post',
				dataType : 'json',
				data: {contentId:$(this).parent().parent().children('td:eq(0)').html()},
				success : function(data){
					if(data.code == 0){
						fabu.hide();
						var cancle = fabu.next();
						cancle.show();
					};
					if(data.code == 1){
						alert(data.data.error);
					};
				}
			});
		}
	});

//取消发布资讯
	$('.zxgl .zxgl-status-btn1').live('click',function(e){
		var r = confirm('确定要取消发布？？');
		if(r == true){
			var cancle = $(this);
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/focuscontent/depublish',
				type : 'post',
				dataType : 'json',
				data: {contentId:$(this).parent().parent().children('td:eq(0)').html()},
				success : function(data){
					if(data.code == 0){
						cancle.hide();
						var fabu= cancle.prev();
						fabu.show();
					};
					if(data.code == 1){
						alert(data.data.error);
					};
				}
			});
		}
	});
});

//初始化资讯管理页面
function initZiXunPage(data){
	$('.zxgl tbody tr:gt(0)').remove(); //清除原来的表格信息
	createZiXunPage(data);
	for(var x = 0; x < data.data.pageData.length; x ++){
		$('.zxgl tbody').append('<tr><td>'+data.data.pageData[x].id+'</td><td>'+data.data.pageData[x].title+'</td><td>'+data.data.pageData[x].description+'</td><td>'+data.data.pageData[x].contentUrl+'</td><td>'+getLocalTime(data.data.pageData[x].createTime)+'</td><td><input type="button" value="删除" class="zxgl-del-btn" /></td><td><input type="button" value="发布" class="zxgl-status-btn0" /><input type="button" value="取消发布" class="zxgl-status-btn1" /></td></tr>');
		if(data.data.pageData[x].published == 0){
			$('.zxgl tbody>tr:eq('+(x+1)+') td:eq(6)>.zxgl-status-btn0').show();
			$('.zxgl tbody>tr:eq('+(x+1)+') td:eq(6)>.zxgl-status-btn1').hide();
		}
		if(data.data.pageData[x].published == 1){
			$('.zxgl tbody>tr:eq('+(x+1)+') td:eq(6)>.zxgl-status-btn0').hide();
			$('.zxgl tbody>tr:eq('+(x+1)+') td:eq(6)>.zxgl-status-btn1').show();
		}
	}
}

//资讯加载页面
function  loadZiXunPage(){
	var params = getZiXunParams();
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/focuscontent/list',
		type : 'get',
		dataType : 'json',
		data: params,
		success : function(data){
			console.log(data)
			createZiXunPage(data);
			initZiXunPage(data);
		},
	});
}

//获取资讯管理参数
function getZiXunParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	params.startTime = $('.zxgll .qian').val()
	params.endTime = $('.zxgll .hou').val();
	return params;
}

//创建资讯分页
function  createZiXunPage(data){
	$(".zxgll .tcdPageCode").createPage({
		pageCount:data.data.totalPageNum,
		current:data.data.currnetPageNum,
		backFn:function(p){
			var params = getZiXunParams();
			params.page = p;
			$('.zxgl tbody tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/focuscontent/list',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initZiXunPage
			});			
		}
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