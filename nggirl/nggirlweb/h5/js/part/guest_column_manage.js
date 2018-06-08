// JavaScript Document
$(function(){
	var ldq=new LocalStorageDeque('pageRestoreStack2');
	$(".online_column").live('click',function(){
		$(".going_column_list").hide();
		$(".guest_column_list").show();
	});
	$(".going_column").live('click',function(){
		$(".going_column_list").show();
		$(".guest_column_list").hide();
		goingColumnInfo();
	});
	$(".guest_column_list .guest_add_column").live('click',function(){
		var pageInfo = new PageInfo(".guest_column_list");
		ldq.push(pageInfo);
	});
	$(".going_column_list .guest_add_column").live('click',function(){
		var pageInfo = new PageInfo(".going_column_list");
		ldq.push(pageInfo);
	});
	$(".guest_add_column").live('click',function(){
		$(".guest_column_create .guest_tit").val('');
		$(".guest_column_create").removeAttr("postId");
		$(".going_column_list,.guest_column_list").hide();
		$(".guest_column_create").show();
		$('.guest_column_create .editor_content').createArticleEditor({
			elements: ['paragraph', 'title', 'note', 'image', 'goods', 'preview', 'fullScreen'],
			data:[{type:2,content:''}],//初始化内容
			defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
		});
	});
	//搜索按钮
	$(".guest_column_list .search_column_btn").live('click',function(){
		guestColumnInfo();
	});
	$(".going_column_list .search_column_btn").live('click',function(){
		goingColumnInfo();
	});
	//取消搜索按钮
	$(".guest_column_list .close_column_btn").live('click',function(){
		clearGuestArtical();
		guestColumnInfo();
	});
	$(".going_column_list .close_column_btn").live('click',function(){
		$(".going_column_list .guest_online_tit").val('');
		goingColumnInfo();
	});
	//查看原贴
	$(".guest_column_list .lookGuestColumn").live('click',function(){
		
		$(".guest_column_list").hide();
		$(".look_guest_column").show();
		getGuestTieDetailsFn($(this));
	});
	//原贴返回到列表页
	$(".look_guest_column .backToOnlineList").live('click',function(){
		$(".guest_column_list").show();
		$(".look_guest_column").hide();
		clearGuestArtDet();
	});
	//删除按钮
	$(".going_column_list .delGuestColumn").live('click',function(){
		$(".delThisGuestColumn").removeClass("delThisGuestColumn");
		$(this).addClass("delThisGuestColumn");
		var r = confirm('确定删除该帖子？？');
		if(r == true){
			deletedGuestColumnInfo();
		}
	});
	//提交按钮
	$(".going_column_list .pushGuestColumn").live('click',function(){
		$(".pushThisColumn").removeClass("pushThisColumn");
		$(this).addClass("pushThisColumn");
		var r = confirm('确定提交该帖子？？');
		if(r == true){
			pushGuestTieDetailsFn();
			clearGuestArtDet();
		}
	});
	//编辑帖子
	$(".going_column_list .editGuestColumn").live('click',function(){
		var pageInfo = new PageInfo(".going_column_list");
		ldq.push(pageInfo);
		$('.going_column_list').hide();
		$(".guest_column_create").show();
		//clearVideoMessageFn();
        getGuestTieDetailsFn($(this));
	});	
	//编辑帖子返回
	$(".guest_column_create .articleBtn .guest_column_back").live('click',function(){
		var previousPage = ldq.pop();
		var str = previousPage._name;
		$(str).show();
		$(".guest_column_create").hide();
		clearGuestArtDet();
	});
	//点击新增、编辑文章页里面的保存按钮
	$('.guest_column_create .guest_column_save').die().live('click',saveGuestArticleDetails);
	function saveGuestArticleDetails(e) {
	var data = $('.guest_column_create .editor_content').getArticleEditorData();
	if($.type(data) != 'array'){
		alert(data);
		$('.guest_column_create .guest_column_save').die().live('click',saveGuestArticleDetails);
		return;
	}
	var articles = JSON.stringify(data);
	if($.trim($(".guest_column_create .guest_tit").val()) == ''){
		alert("文章题目不能为空！");
	}else if(data.length == 0){
		alert("文章信息不能为空！");
	}else{
		var r = confirm('确定要保存？？？');
		if(r == true){
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/guesteditor/addOrUpdateArticlePost/2.5.6',
				type : 'post',
				dataType : 'json',
				data: {postId:$(".guest_column_create").attr("postId"),title:$(".guest_column_create .guest_tit").val(),articles:articles},
				success : function(data){
					if(data.code == 0){
						var previousPage = ldq.pop();
						var str = previousPage._name;
						$(str).show();
						$(".guest_column_create").hide();
						goingColumnInfo();
						clearGuestArtDet();
					};
					if(data.code == 1){
						alert(data.data.error);
					}
				}
			});
		};
	};
	$('.guest_column_create .guest_column_save').die().live('click',saveGuestArticleDetails);
}
});
//获取审核通过的列表信息
//定义数据

function  guestColumn(num,page,columnId,title,submitStartTime,submitEndTime,publishStartTime,publishEndTime){
	var data = new Object();
	data.num = num;
	data.page = page;
	data.columnId = columnId;
	data.title = title;
	data.submitStartTime = submitStartTime;
	data.submitEndTime = submitEndTime;
	data.publishStartTime = publishStartTime;
	data.publishEndTime = publishEndTime;
	return data;	
}

//搜索的数据
function guestColumnData(){
	return guestColumn(
	20,1,$('.guest_column_list .guest_online_column_search .columnNameId option:selected').attr('value'),
	$('.guest_column_list .guest_online_column_search .guest_online_tit').val(),$('.guest_column_list .guest_online_column_search .tjstartTime').val().replace(/\D/g,''),$('.guest_column_list .guest_online_column_search .tjendTime').val().replace(/\D/g,''),$('.guest_column_list .guest_online_column_search .shstartTime').val().replace(/\D/g,''),$('.guest_column_list .guest_online_column_search .shendTime').val().replace(/\D/g,'')
	);	
}

//渲染数据
function guestColumnListdetail(data){
	$('.guest_column_list .guest_online_column_list tr:gt(0)').remove();
	$.each(data.data.pageData ,function(key,val){
		$('.guest_column_list .guest_online_column_list tbody').append('<tr><td>'+val.nickName+'</td><td>'+val.submitTime+'</td><td>'+val.publishTime+'</td><td>'+val.title+'</td><td id="'+val.columnId+'">'+val.columnName+'</td><td><img src="'+val.picture+'" alt=""/></td><td><input type="button" value="查看" postId="'+val.postId+'" class="bluebtn1 lookGuestColumn"/></td></tr>');
	});
}
	
//根据不同的页码来渲染页面
function onclickGuestPageNum(p){
	var data = guestColumnData();
	data.page = p;
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/guesteditor/getPublishedPostList/2.5.6',
		type : 'post',
		dataType : 'json',
		data: data,
		success : function(data){
			guestColumnListdetail(data);
		},
	});
};
	
//获取入参，渲染页面
function guestColumnInfo(){
	//获取入参
	var data = guestColumnData();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/guesteditor/getPublishedPostList/2.5.6',
		type : 'post',
		dataType : 'json',
		data: data,
		success : function(data){
			if(data.code == 0){
			//创建分页
			$(".guest_column_list .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:onclickGuestPageNum
			});
			//渲染页面
			guestColumnListdetail(data);
			}else{
				alert(data.data.error);
			}
		},
	});
};
//获取草稿箱的列表信息
//渲染数据
function goingColumnListdetail(data){
	$('.going_column_list .going_column_list_detail tr:gt(0)').remove();
	$.each(data.data.pageData,function(key,val){
		var str='';
		var status='';
		if(val.status == 1){
			status = '审核中'; 
			str='<input type="button" value="删除" postId="'+val.postId+'" class="redbtn1 delGuestColumn"/>';
		}else if(val.status == 0){
			status = '未提交'; 
			str='<input type="button" value="提交" postId="'+val.postId+'" class="bluebtn1 pushGuestColumn"/><input type="button" value="编辑" postId="'+val.postId+'" class="bluebtn1 editGuestColumn"/><input type="button" value="删除"  postId="'+val.postId+'" class="redbtn1 delGuestColumn"/>';
		}
		$('.going_column_list .going_column_list_detail tbody').append('<tr><td>'+val.nickName+'</td><td>'+val.title+'</td><td>'+status+'</td><td>'+str+'</td></tr>');
	});
}
	
//根据不同的页码来渲染页面
function onclickgoingPageNum(p){
	data.page = p;
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/guesteditor/getDraftPostList/2.5.6',
		type : 'post',
		dataType : 'json',
		data: {page:p,num:20,title:$(".going_column_list .guest_online_tit").val()},
		success : function(data){
			goingColumnListdetail(data);
		},
	});
};
	
//获取入参，渲染页面
function goingColumnInfo(){
	console.log($(".going_column_list .guest_online_tit").val());
	//获取入参
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/guesteditor/getDraftPostList/2.5.6',
		type : 'post',
		dataType : 'json',
		data: {page:0,num:20,title:$(".going_column_list .guest_online_tit").val()},
		success : function(data){
			if(data.code == 0){
			//创建分页
			$(".going_column_list .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:onclickgoingPageNum
			});
			//渲染页面
			goingColumnListdetail(data);
			}else{
				alert(data.data.error);
			}
		},
	});
};

//清空搜索信息
function clearGuestArtical(){
	$(".guest_online_column_search .columnNameId").children("option:eq(0)").attr("selected","true");
	$(".guest_online_column_search input[type='text']").val('');
}
//获取专栏名称
function guestColumnNameInfo(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getAllColumnList/2.4.0',
		type : 'get',
		dataType : 'json',
		data: {},
		success : function(data){
			if(data.code == 0){
				$(".guest_online_column_search .columnNameId").children("option:gt(0)").remove();
				for( var i= 0; i<data.data.length ; i++){
				$(".guest_online_column_search .columnNameId").append('<option value="'+data.data[i].columnId+'">'+data.data[i].columnName+'</option>');
				}
				
			};
			if(data.code == 1){
				alert(data.data.error);	
			}	
		}
	});
};
//删除帖子
function deletedGuestColumnInfo(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/guesteditor/deletePostArticle/2.5.6',
		type : 'post',
		dataType : 'json',
		data: {postId:$(".delThisGuestColumn").attr("postId")},
		success : function(data){
			if(data.code == 0){
				$(".delThisGuestColumn").parent().parent().remove();
			}else{
				alert(data.data.error);
			}
		},
	});
};
//查看帖子 
//function lookGuestColumnInfo(btn){
//	var del=btn;
//	$.ajax({
//	url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/guesteditor/getArticleDetail/2.5.6',
//	type : 'get',
//	dataType : 'json',
//	data: {postId:del.attr('postId')},
//	success : function(data){
//		if(data.code == 0){
//			$(".look_guest_column p").html(data.data.title);
//			$('.guest_column_create .editor_content').createArticleEditor({
//				elements: ['paragraph', 'title', 'note', 'image', 'goods', 'preview', 'fullScreen'],
//				data:data.data.articles,//初始化内容
//				defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
//			});
//			$(".look_guest_column .look_guest_column_det").append($('.guest_column_create .editor_content .article_editor').html());
//			//$(".look_guest_column .look_guest_column_det").createArticleEditor({data:data.data.articles});
///*			var str='';
//			$.each(data.data.articles,function(key,val){
//				
//			});
//			$(".look_guest_column .look_guest_column_det").append(str);*/
//		}else{
//			alert(data.data.error);
//		}
//	}
//});
//}
//编辑帖子 
function getGuestTieDetailsFn(btn){
	var del=btn;
	$.ajax({
	url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/guesteditor/getArticleDetail/2.5.6',
	type : 'get',
	dataType : 'json',
	data: {postId:del.attr('postId')},
	success : function(data){
		if(data.code == 0){
			$(".guest_column_create").attr("postId",data.data.postId);
			
			$(".guest_column_create .guest_tit").val(data.data.title);
			$('.guest_column_create .editor_content').createArticleEditor({
				elements: ['paragraph', 'title', 'note', 'image', 'goods', 'preview', 'fullScreen'],
				data:data.data.articles,//初始化内容
				defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
			});
			$(".look_guest_column p.look_guest_column_tit").html(data.data.title);
			$(".look_guest_column .look_guest_column_det").empty().append($('.guest_column_create .editor_content .article_editor').html());
		}else{
			alert(data.data.error);
		}
	}
});
}
//提交帖子 
function pushGuestTieDetailsFn(){
	$.ajax({
	url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/guesteditor/submitPostArticle/2.5.6',
	type : 'post',
	dataType : 'json',
	data: {postId:$(".pushThisColumn").attr('postId')},
	success : function(data){
		if(data.code == 0){
			$(".pushThisColumn").parent().prev().html("审核中");
			$(".pushThisColumn").next().remove();
			$(".pushThisColumn").remove();
		}else{
			alert(data.data.error);
		}
	}
});
}
//清除原来内容
function clearGuestArtDet(){
	$(".look_guest_column .look_guest_column_tit,.look_guest_column .look_guest_column_det").empty();
	$(".guest_column_create .guest_tit").val('');
	$(".guest_column_create .editor_content").empty();
}