var goodsNum= new Array();
$(function(){
	getPopularSearch();
	var ldq=new LocalStorageDeque('pageRestoreStacks');
	$(".hotLabelBox .hotLabel").live('click',function(){
		pushPopularSearch();	
	});
	/*wz添加标签*/
	$(".articleedit .labelEditBox .addNewLabel").live('click',function(){
		var str='';
		str='<div class="labelBox2"> <input type="text" placeholder="输入标签" class="userLabel"> <img src="images/ele-del.png" class="delLabelType" alt="" /></div>';
		$(".articleedit .labelEditBox .thisBefore").before(str);
	});	
	/*wz删除标签*/
	$(".labelEditBox .labelBox2 .delLabelType").live('click',function(){
		$(this).parent().remove();
	});	
	/*sp添加标签*/
	$(".video_add_or_edit .labelEditBox .addNewLabel").live('click',function(){
		var str='';
		str='<div class="labelBox2"> <input type="text" placeholder="输入标签" class="vaoe vaoe_Label"> <img src="images/ele-del.png" class="delLabelType" alt="" /></div>';
		$(".video_add_or_edit .labelEditBox .thisBefore").before(str);
	});	
	
	/*新增的标题和用户列表*/
	$(".label_list_btn").live('click',function(){
		$(".label_cn_list").show();	
		$(".column-table").hide();
		getColumnNameInfo();
		clearTextMessage();
		labelColumnInfo();
	});	
	$(".label_cn_list .backBtn").live('click',function(){
		//清空表格信息
		clearTextMessage();
        $('.column-table').show();
		$(".column_managebox").show();
		$(".label_cn_list").hide();
		loadColumnPage();
		//clearColumnTxtFn();
	});
	$(".user_cn_btn").live('click',function(){
		$(".user_cn_list").show();	
		$(".column-table").hide();
		getColumnNameInfo();
		clearTextMessage();
		userColumnInfo();
	});	
	$(".user_cn_list .backBtn").live('click',function(){
		//清空表格信息
		clearTextMessage();
        $('.column-table').show();
		$(".column_managebox").show();
		$(".user_cn_list").hide();
		loadColumnPage();
		//clearColumnTxtFn();
	});
	
	$(".label_cn_list .search_label_btn").live('click',function(){
		labelColumnInfo();
	});
	$(".label_cn_list .close_label_btn").live('click',function(){
		clearSearchMessage();
		labelColumnInfo();
	});
	$(".user_cn_list .search_user_btn").live('click',function(){
		userColumnInfo();
	});
	$(".user_cn_list .close_user_btn").live('click',function(){
		clearSearchMessage();
		userColumnInfo();
	});
	//用户帖子列表上下线
	$(".user_cn_list .postStatus").live('click',function(){
		$(".changeThisPostStatus").removeClass("changeThisPostStatus");
		$(this).addClass("changeThisPostStatus");	
		if($(this).hasClass("redbtn1")){
			$("#column_manage .outlineReasonBox").show();
			$("#column_manage .outlineReasonBox .reasonList .selfReason").removeAttr("disabled");
			$("#column_manage .outlineReasonBox").attr("user","1")
		}else{
			var data= new Array();
			var obj= new Object();
			obj.postId=$(this).attr("postId");
			obj.postType=$(this).attr("postType");
			data.push(obj);
			var datas = JSON.stringify(data);
			console.log(datas);
			changePostStatus(datas);
		}
	});
	//帖子列表上下线
	$(".cn-select-table .changeoriPostStatus").die('click');
	$(".cn-select-table .changeoriPostStatus").live('click',function(){
		$(".changeThisOnlineStatus").removeClass("changeThisOnlineStatus");
		$(this).addClass("changeThisOnlineStatus");
		if($(this).hasClass("redbtn1")){
			$("#column_manage .outlineReasonBox").show();
			$("#column_manage .outlineReasonBox .reasonList .selfReason").removeAttr("disabled");
			$("#column_manage .outlineReasonBox").attr("user","2")
		}else{
			var data= new Array();
			var obj= new Object();
			obj.postId=$(this).attr("postId");
			obj.postType=$(this).attr("postType");
			data.push(obj);
			var datas = JSON.stringify(data);
			console.log(datas);
			changeOriPostStatus(datas);
		}
		
	});
	//下线原因完成按钮
	$("#column_manage .outlineReasonBox .finish").live('click',function(event){
		var reason="";
		if($("#column_manage .outlineReasonBox .reasonList p.on").text() !="" ){
			reason=$("#column_manage .outlineReasonBox .reasonList p.on").text();
			if($("#column_manage .outlineReasonBox").attr("user") == "2"){
				changeOriPostStatus(reason);
			}else{
				changePostStatus(reason);
			}
		}else if($.trim($("#column_manage .outlineReasonBox .reasonList .selfReason").val()) !=""){
			reason=$.trim($("#column_manage .outlineReasonBox .reasonList .selfReason").val());
			if($("#column_manage .outlineReasonBox").attr("user") == "2"){
				changeOriPostStatus(reason);
			}else{
				changePostStatus(reason);
			}
		}else{
			alert("请选择原因!");
		}
	});
	//编辑帖子
	$(".label_cn_list .articaldeatiledit").live('click',function(){
		$('.label_cn_list').hide();
		clearVideoMessageFn();
		//getColumnNameInfo();
        getTieDetailsFn($(this));
		var pageInfo = new PageInfo(".label_cn_list,#column_manage");
		ldq.push(pageInfo);
	});	
	//新版编辑帖子18
	$(".postListTabel .articaldeatiledit").live('click',function(){
		$('#post_manage').hide();
		$('#column_manage').show();
		$('.column-table').hide();
		clearVideoMessageFn();
		//getColumnNameInfo();
        getTieDetailsFn($(this));
		var pageInfo = new PageInfo("#post_manage");
		ldq.push(pageInfo);
	});
	//新版待审核帖子110
	$(".waitPassTabel .articaldeatiledit").live('click',function(){
		$('#post_manage').hide();
		$('#column_manage').show();
		$('.column-table').hide();
		clearVideoMessageFn();
		//getColumnNameInfo();
        getTieDetailsFn($(this));
		var pageInfo = new PageInfo("#post_manage");
		ldq.push(pageInfo);
	});	
	//编辑帖子
	$(".user_cn_list .articaldeatiledit").live('click',function(){
		$('.user_cn_list').hide();
		clearVideoMessageFn();
		//getColumnNameInfo();
        getTieDetailsFn($(this));
		var pageInfo = new PageInfo(".user_cn_list,#column_manage");
		ldq.push(pageInfo);
	});			
	/*结束*/
	//点击管理评论调到评论页
	$(".columncomment,.postListTabel .goToCommentPage").live('click',function(){
		$("#ac_manage,.ac_everyOne_list").show();
		$(".ac_everyOne_list").attr("id",$(this).attr("cid"));
		$(".ac_everyOne_list .look_yuan_tie").attr("postid",$(this).attr("cid"));
		$(".ac_everyOne_list .add_new_ping").attr("postid",$(this).attr("cid"));
		$('.ac_everyOne_list').attr('type',$(this).attr("utype"));
		$('.ac_everyOne_list .look_yuan_tie').attr('posttype',$(this).attr("utype"));
		$('.ac_everyOne_list .add_new_ping').attr('posttype',$(this).attr("utype"));
		loadEveryOneTiePage($('.ac_everyOne_list').attr('type'),$(".ac_everyOne_list .look_yuan_tie").attr("postid"),0);
	});
	//全部帖子跳转评论页
	$(".all_cn_list .columncomment").live('click',function(){
		var pageInfo = new PageInfo(".all_cn_list,#column_manage");
		ldq.push(pageInfo);
		$(".all_cn_list,.column_managebox,.ac-list").hide();
	});
	//某个专栏帖子跳转评论页
	$(".addcolumn .columncomment").live('click',function(){
		var pageInfo = new PageInfo(".addcolumn,#column_manage");
		ldq.push(pageInfo);
		$(".addcolumn,.column_managebox,.ac-list").hide();
	});
	//全部帖子跳转评论页
	$(".label_cn_list .columncomment").live('click',function(){
		var pageInfo = new PageInfo(".label_cn_list,#column_manage");
		ldq.push(pageInfo);
		$(".label_cn_list,.column_managebox,.ac-list").hide();
	});
	//某个专栏帖子跳转评论页
	$(".user_cn_list .columncomment").live('click',function(){
		var pageInfo = new PageInfo(".user_cn_list,#column_manage");
		ldq.push(pageInfo);
		$(".user_cn_list,.column_managebox,.ac-list").hide();
	});
	//新帖子列表页帖子跳转评论页
	$(".postListTabel .goToCommentPage").live('click',function(){
		var pageInfo = new PageInfo("#post_manage");
		ldq.push(pageInfo);
		$("#post_manage,.column_managebox,.ac-list").hide();
	});
	//点击全部评论管理查看所有相关评论里的返回按钮
	$('.ac_everyOne_list .ael_return_btn').click(function(e) {
		$("#ac_manage").hide();
		var previousPage = ldq.pop();
		var str = previousPage._name;
		$(str).show();
		$('.ac_everyOne_list').hide();
    });
	
	//查看所属帖子的所有评论
	$('.all_commonts_table .look_all_tie_ping').live('click',function(e) {
		var pageInfo = new PageInfo(".ac-list,#ac_manage");
		ldq.push(pageInfo);
        $('.ac_everyOne_list').show();
		$('.ac-list').hide();
		loadEveryOneTiePage($(this).attr('posttype'),$(this).attr('postid'),0);
		$('.ac_everyOne_list').attr('id',$(this).attr('postid'));
		$('.ac_everyOne_list').attr('type',$(this).attr('posttype'));
		$('.ac_everyOne_list .ael_title').html($(this).attr('postTitle'));
		$('.ac_everyOne_list .add_new_ping').attr('postId',$(this).attr('postId'))//存储
		$('.ac_everyOne_list .add_new_ping').attr('postType',$(this).attr('postType'))//存储
		$('.ac_everyOne_list .look_yuan_tie').attr('postId',$(this).attr('postId'))//存储
		$('.ac_everyOne_list .look_yuan_tie').attr('postType',$(this).attr('postType'))//存储
    });
		
	//发布专题
	$('.column-table .check-id .ci-btn').click(function(e) {
		var arr = '';
		$('.column-table .check-id .ci-txt').each(function(index, element) {
			if($(this).val() != ""){
			arr += $(this).val() + ';';
			}
		});
		
		var r = confirm('确定要发布？？');
		if(r == true){
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/updateBatchColIsOnline/2.0.0',{columnIds:arr},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					alert('发布成功！！');
					//重新加载专题页面
					loadColumnPage();
				};
				if(data.code == 1){
					alert(data.data.error);	
				}
			});
		};
    });
	
	//删除专栏
	$('.add-column-table .cn-del-btn').live('click',function(e) {
		var ok = $(this);
		var r = confirm('确定要删除？？');
		if(r == true){
			$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/deleteColumn/2.0.0',{id:$(this).attr('tId')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
						alert('删除成功！！');
						ok.parent().parent().remove();
				};
				if(data.code == 1){
					alert(data.data.error);	
				}
			});
		};
    });
	
	//点击“新增专题”
	$('.column-table .cn-add-btn').click(function(e) {
		//清除专题id
		$('.addcolumn').removeAttr('tid');
		//清空表格信息
		clearColumnTxtFn();
        $('.column-table').hide();
		$('.addcolumn').show();
    });
	//点击返回 按钮
	$('.addcolumn-btn .colu-cancle').click(function(e) {
		//清除专题id
		$('.addcolumn').removeAttr('id');
		//清空表格信息
		clearColumnTxtFn();
		clearTextMessage();
        $('.column-table').show();
		$(".column_managebox").show();
		$("#ac_manage").hide();
		$('.addcolumn').hide();
		loadColumnPage();
    });
	
	//首页图片
	$('.cn-file').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('#cn-img').attr('src',data.result.data.url);
		}
	});
	
	//文章页图片
	$('.cover-file').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('#cover-img').attr('src',data.result.data.url);
		}
	});
	//详情头图片
	$('.detailtop-file').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('#detailtop-img').attr('src',data.result.data.url);
		}
	});
	//w推荐用图片
	$('.atuijian').fileupload({
		dataType: 'json',
		done: function (e, data) {
			var w = parseFloat(data.result.data.width);
			var h = parseFloat(data.result.data.height);
			if(w/h != 1.0/1.0){
				alert("上传失败！图片比例应为1:1");
			}else{
				$('#atuijianimg').attr('src',data.result.data.url);
				$('.atuijianimg').attr('entend',data.result.data.width+'_'+data.result.data.height);
			};			
		}
	});
	//s推荐用图片
	$('.tuijian').fileupload({
		dataType: 'json',
		done: function (e, data) {
			var w = parseFloat(data.result.data.width);
			var h = parseFloat(data.result.data.height);
			if(w/h != 1.0/1.0){
				alert("上传失败！图片比例应为1:1");
			}else{
				$('#tuijianimg').attr('src',data.result.data.url);
				$('#tuijianimg').attr('entend',data.result.data.width+'_'+data.result.data.height);
			};	
		}
	});
	//点击专栏添加或修改页面里面的“保存”按钮
	$('.addcolumn-btn .colu-save').click(function(e) {//columnlist
		//信息验证
		if($.trim($('.addcolumn .cn-name').val()) == ''){
			alert('请填写专栏名称！！');	
		}else if($('.addcolumn #cn-img').attr('src') == ''){
			alert('请选择背景图片！！');
		}else if($('.addcolumn #rp-img-list').attr('src') == ''){
			alert('请选择列表页图片！！');
		}else{
			var arr2 = '';
			$('.selectcolumn  .ci-txt').each(function(index, element) {
				if($(this).val() != ""){
				arr2 += $(this).val() + ';';
				}
			});
			//判断当前窗体内是否存在专题id
			if(typeof($('.addcolumn').attr('id')) == "undefined"){
				//新增专题
				 var r = confirm('确定要保存？？？');
				 if(r == true){
					$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/addOrUpdateColumn/2.0.0',{name: $('.addcolumn .cn-name').val(),bgImg: $('.addcolumn #cn-img').attr('src'),columnPostIds:arr2},function(data){
						var data = $.parseJSON(data);
						if(data.code == 0){
							alert('添加成功！！');
							clearColumnTxtFn();
							$('.addcolumn').hide();
							$('.column-table').show();
							//$(".ac_manage").hide();
							$(".column_managebox").show();
							//重新加载专题数据
							loadColumnPage();
						};
						if(data.code == 1){
							alert(data.data.error);
						};
					});
				 };
			}else{
				 var r = confirm('确定要保存？？？');
				 if(r == true){
					$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/addOrUpdateColumn/2.0.0',{id: $('.addcolumn').attr('id'),name: $('.addcolumn .cn-name').val(),bgImg: $('.addcolumn #cn-img').attr('src'),columnPostIds:arr2},function(data){
						var data = $.parseJSON(data);
						if(data.code == 0){
							alert('更新成功！！');
							clearColumnTxtFn();
							$(".addcolumn").removeAttr("id");
							$('.addcolumn').hide();
							$('.column-table').show();
							$(".column_managebox").show();
							//重新加载专题数据
							loadColumnPage();
						};
						if(data.code == 1){
							alert(data.data.error);
						};
					});
				 };
			}		
		}
    });
	
	//获取某一专栏对应帖子列表
	$(".cn-edit-btn").live('click',function(){
		$('.column-table').hide();
		$('.addcolumn').show();
		$(".addcolumn").attr("id",$(this).parent().parent().children('td:eq(0)').text());
		getcolumnInfo();
		columnInfo();
		
	});
		
	//搜索按钮
	$(".searchcn-btn").live('click',function(){
		columnInfo();
	});
	
	//全部取消
	$(".closecn-btn").click(function(){
		clearSearchMessage();
		columnInfo();
	});


		
	//点击新增作品里面的"添加文章"按钮
	$('.addcolumn .addarticle-btn').live('click',function(e) {
		var pageInfo = new PageInfo(".addcolumn,#column_manage");
		ldq.push(pageInfo);
		$(".addcolumn").hide();
		$(".articleedit").show();
		cleararticalDeatil();
		getColumnNameInfo();
		$(".articleedit").attr("id",$(".addcolumn").attr("id"));
		$('.articleedit .editor_content').createArticleEditor();
    });
	//点击全部帖子里面的"添加文章"按钮
	$('.all_cn_list .addarticle-btn').live('click',function(e) {
		var pageInfo = new PageInfo(".all_cn_list,#column_manage");
		ldq.push(pageInfo);
		$(".all_cn_list").hide();
		$(".articleedit").show();
		cleararticalDeatil();
		getColumnNameInfo();
		$('.articleedit .editor_content').createArticleEditor();
		
    });
		
	//点击everyone评论管理里面的查看所属帖子的所有评论里的查看原帖
	$('.ac_everyOne_list .look_yuan_tie').click(function(e) {
		$('.ac_everyOne_list').hide();
        getTieDetailsFn($(this));
		var pageInfo = new PageInfo(".ac_everyOne_list");
		ldq.push(pageInfo);
    });

	//all举报管理里面的查看原帖
	$('.ju_bao_box .jbb_btn_look').live('click',function(e) {
		$('.ju_bao_box').hide();
        getTieDetailsFn($(this));
		var pageInfo = new PageInfo(".ju_bao_box");
		ldq.push(pageInfo);
    });
	
	//编辑帖子
	$(".addcolumn .articaldeatiledit").live('click',function(){
		$('.addcolumn').hide();
		clearVideoMessageFn();
		//getColumnNameInfo();
        getTieDetailsFn($(this));
		var pageInfo = new PageInfo(".addcolumn,#column_manage");
		ldq.push(pageInfo);
	});		
	//全部列表编辑帖子
	$(".all_cn_list .articaldeatiledit").live('click',function(){
		$('.all_cn_list').hide();
		clearVideoMessageFn();
		//getColumnNameInfo();
        getTieDetailsFn($(this));
		var pageInfo = new PageInfo(".all_cn_list,#column_manage");
		ldq.push(pageInfo);
	});	
	//点击新增文章页里面的返回按钮
	$('.articleedit .articalbackbtn').live('click',function(e) {
		var previousPage = ldq.pop();
		var str = previousPage._name;
		$(str).show();
		if(str=="#post_manage"){
			$('.column_managebox').hide();
		}
		$('.articleedit').hide();
    });	

	//点击新增、编辑文章页里面的保存按钮
	$('.articleBtn .articalsavebtn').die().live('click',saveArticleDetails);

	function saveArticleDetails(e) {
		$('.articleBtn .articalsavebtn').unbind('click');
		var labels="";
		 if($(".articleedit .chooseColumn option:selected").val() == ""){
		   alert("所属专栏不能为空！");
		   return false;
		}else if($.trim($(".articleedit .arttit").val())==""){
			alert("帖子题目不能为空！");
			return false;
	   	}else if($.trim($(".articleedit .promulgator").val())==""){
			alert("发布者ID不能为空！");
			return false;
		}else if($(".userLabel").val()==""){
		   videolabels="";
		   alert("标签不能为空！");
		   return false;
		}else{
			for( i = 0; i<$(".userLabel").length; i++ ){
			  if($(".userLabel:eq("+i+")").val().length>8){
				alert("每个标签的字符数不能超过8个！");
				return false;
			  }
			  if($(".userLabel:eq("+i+")").val() !=''){
				   labels += $(".userLabel:eq("+i+")").val()+',';
			  }  
			}
		}
		console.log(labels);
		var data = $('.articleedit .editor_content').getArticleEditorData();
		if($.type(data) != 'array'){
			alert(data);
			$('.articleBtn .articalsavebtn').die().live('click',saveArticleDetails);
			return;
		}

		var articles = JSON.stringify(data);

		if(data.length == 0){
			alert("文章信息不能为空！");
		}else{
			var r = confirm('确定要保存？？？');
			if(r == true){
				var shareContent ='';
				if($.trim($(".articleedit .shareContent").val()) == ""){
					shareContent = "变美的路有那么多，南瓜姑娘的帖子是一条捷径~";
				}else{
					shareContent =$(".articleedit .shareContent").val()
				}
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/addOrUpdateArticlePost/2.5.3',
					type : 'post',
					dataType : 'json',
					data: {columnId:$(".articleedit .chooseColumn option:selected").val(),postId:$(".articleedit").attr("pid"),postType:1,title:$(".articleedit .arttit").val(),shareContent:shareContent,createUserId:$(".articleedit .promulgator").val(),picture:$(".articleedit #cover-img").attr("src"),detailImg:$(".articleedit #detailtop-img").attr("src"),recommendImg:$(".articleedit #atuijianimg").attr("src"),labels:labels,articles:articles},
					success : function(data){
						if(data.code == 0){
							var previousPage = ldq.pop();
							var str = previousPage._name;
							$(str).show();
							console.log(str);
							if(str =="#post_manage"){
								$('.column_managebox').hide();
							}
							$(".articleedit").hide();
							cleararticalDeatil();
							if(typeof($(".addcolumn").attr("id")) == "undefined" && str ==".addcolumn,#column_manage"){
								console.log(str);
							}else{
								columnInfo();
							}
							userColumnInfo();
						};
						if(data.code == 1){
							alert(data.data.error);
						}
					}
				});
			};
		};

		$('.articleBtn .articalsavebtn').die().live('click',saveArticleDetails);
	}

	//点击添加视频里面的保存按钮，添加或编辑视频
	$('.vaoe_btn_save').click(function(e) {
		var videolabels="";
	   
	   if($(".video_add_or_edit .chooseColumn option:selected").val() == ""){
		   alert("所属专栏不能为空！");
		   return false;
		}else if($.trim($(".video_add_or_edit .vaoe_title").val())==""){
			alert("帖子题目不能为空！");
			return false;
	   	}else if($.trim($(".video_add_or_edit .vaoe_id").val())==""){
			alert("发布者ID不能为空！");
			return false;
		}else if($(".vaoe_Label").val()==""){
		   videolabels="";
		   alert("标签不能为空！");
		   return false;
		}else if($.trim($(".video_add_or_edit .vaoe_video_id").val())==""){
			alert("视频编号不能为空！");
			return false;
		}else{
			for( i = 0; i<$(".vaoe_Label").length ; i++ ){
			  if($(".vaoe_Label:eq("+i+")").val().length>8){
				alert("每个标签的字符数不能超过8个！");
				return false;
			  }
			    videolabels += $(".vaoe_Label:eq("+i+")").val()+',';
			}
			var data = $('.video_add_or_edit .goods_box').getArticleEditorData();
			if($.type(data) != 'array'){
				alert(data);
				$('.articleBtn .articalsavebtn').die().live('click',saveArticleDetails);
				return;
			}
			
			var articles = JSON.stringify(data);
			var shareContent ='';
			if($.trim($(".video_add_or_edit .shareContent").val()) == ""){
				shareContent = "变美的路有那么多，南瓜姑娘的帖子是一条捷径~";
			}else{
				shareContent =$(".video_add_or_edit .shareContent").val();
				
			};
			
			var genData = {
				columnId:$(".video_add_or_edit .chooseColumn option:selected").val(),
				postId:$('.video_add_or_edit').attr('postId'),
				postType:2,
				title:$('.video_add_or_edit .vaoe_title').val(),
				shareContent:shareContent,
				createUserId:$('.video_add_or_edit .vaoe_id').val(),
				videoId:$('.video_add_or_edit .vaoe_video_id').val(),
				picture:$('.video_add_or_edit #vaoe_img_cover').attr('src'),
				detailImg:$('.video_add_or_edit #vaoe_img_zhen').attr('src'),
				recommendImg:$('.video_add_or_edit #tuijianimg').attr('src'),
				articles:articles/*JSON.stringify(goods)*/,
				//userRole:$('.video_add_or_edit .vaoe_role').val()
				labels:videolabels};
			//console.log(genData);
			var r = confirm('确定要保存？？？');
			if(r == true){
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/addOrUpdateVideoPost/2.5.3',genData,function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						$('.video_add_or_edit').hide();
						var previousPage = ldq.pop();
						var str = previousPage._name;
						$(str).show();
						if(str=="#post_manage"){
							$('.column_managebox').hide();
						}
						if(typeof($(".addcolumn").attr("id")) == "undefined" && str ==".addcolumn"){
							console.log(str);
						}else{
							columnInfo();
						}
						clearVideoMessageFn();
					}else{
						alert(data.data.error);
					}
				});
			};
		 }
    });
	
	//点击添加视频里面的返回按钮
	$('.video_add_or_edit .vaoe_btn_return').click(function(e) {
		var previousPage = ldq.pop();
		var str = previousPage._name;
		$(str).show();
		if(str=="#post_manage"){
			$('.column_managebox').hide();
		}
		$('.video_add_or_edit').hide();
		clearVideoMessageFn();
    });
	
	//点击全部评论管理里面的管理举报按钮
	$('.ac-list .ju_bao_manage_all').live('click',function(e) {
		juBaoFun($(this));
		$('.ac-list').hide();
		var pageInfo = new PageInfo(".ac-list");
		ldq.push(pageInfo);
    });
	
	//点击某个评论管理里面的管理举报按钮
	$('.ac_everyOne_list .ael_manage_ju_bao').live('click',function(e) {
		$('.ac_everyOne_list').hide();
		juBaoFun($(this));
		var pageInfo = new PageInfo(".ac_everyOne_list");
		ldq.push(pageInfo);
    });
	
	//取消评论和回复的举报
	$('.ju_bao_box .jbb_btn_cancle').live('click',function(e) {
		var previousPage = ldq.pop();
		var str = previousPage._name;
		$(str).show();
		$('.ju_bao_box').hide();
    });
	
	//处理评论和回复的举报
	$('.ju_bao_box .jbb_btn_ok').live('click',function(e) {
		//判断commentType
		if($(this).attr('commentType') == 1){
			//判断是否选择处理结果
			if($('.jbb_ju_bao_status option:selected').attr('value') == 0){
				alert('请选择处理结果！！');	
			}else if($('.jbb_ju_bao_status option:selected').attr('value') == 1 || $('.jbb_ju_bao_status option:selected').attr('value') == 2 || $('.jbb_ju_bao_status option:selected').attr('value') == 3){
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/post/processReport/2.0.0',{commentType:$(this).attr('commentType'),targetId:$(this).attr('commentId'),resultNum:$('.jbb_ju_bao_status option:selected').attr('value'),resultContent:$('.jbb_ju_bao_status option:selected').html()},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						alert('处理完成！！');
						$('.ju_bao_box').hide();
						$('.ac-list').show();
						loadAllCommentsPage($('body').attr('page'));
					}else{
						alert(data.data.error);
					}
				});
			}
		}
		if($(this).attr('commentType') == 2){
			//判断是否选择处理结果
			if($('.jbb_ju_bao_status option:selected').attr('value') == 0){
				alert('请选择处理结果！！');	
			}else if($('.jbb_ju_bao_status option:selected').attr('value') == 1 || $('.jbb_ju_bao_status option:selected').attr('value') == 2 || $('.jbb_ju_bao_status option:selected').attr('value') == 3){
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/post/processReport/2.0.0',{commentType:$(this).attr('commentType'),targetId:$(this).attr('replyId'),resultNum:$('.jbb_ju_bao_status option:selected').attr('value'),resultContent:$('.jbb_ju_bao_status option:selected').html()},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						alert('处理完成！！');
						$('.ju_bao_box').hide();
						$('.ac-list').show();
						loadAllCommentsPage($('body').attr('page'));
					}else{
						alert(data.data.error);
					}
				});
			}
		}
    });
		
	//点击新增作品里面的"删除"按钮
	$('.cn-select-table .column-del,.user_cn_list .column-del').live('click',function(e) {
		$("#column_manage .delReasonBox").show();
		$(".delThis").removeClass("delThis");
		$(this).addClass("delThis");
		$("#column_manage .allreasonBox .reasonList .selfReason").removeAttr("disabled");

    });
	//删除完成按钮
	$("#column_manage .delReasonBox .finish").live('click',function(event){
		var reason="";
		if($("#column_manage .delReasonBox .reasonList p.on").text() !="" ){
			reason=$("#column_manage .delReasonBox .reasonList p.on").text();
			deletOldPostFn(reason);
		}else if($.trim($("#column_manage .delReasonBox .reasonList .selfReason").val()) !=""){
			reason=$.trim($("#column_manage .delReasonBox .reasonList .selfReason").val());
			deletOldPostFn(reason);
		}else{
			alert("请选择原因!");
		}
	});
	//点击新增作品里面的"删除"按钮
	$('.label_cn_list .column-del').live('click',function(e) {
		$("#column_manage .delReasonBox").show();
		$(".delThis").removeClass("delThis");
		$(this).addClass("delThis").addClass("labeldel");
		$("#column_manage .allreasonBox .reasonList .selfReason").removeAttr("disabled");
		
		/*var del = $(this);
		var r = confirm('确定要删除？？');
		if(r == true){
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/deletePost/2.0.0',{postId:$(this).attr('tid'),postType:$(this).attr('ttype')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					alert('删除成功！！');
					console.log($('body').attr('labelpage'));
					onclickLabelPageNum($('body').attr('labelpage'));
				};
				if(data.code == 1){
					alert(data.data.error);	
				}
			});
		};*/
    });
	//点击新增视频按钮
	$('.addcolumn .columnbtn.mlreset.addvideo-btn').click(function(e) {
		clearVideoMessageFn();//清空添加视频信息
		var pageInfo = new PageInfo(".addcolumn");
		ldq.push(pageInfo);
		$('.video_add_or_edit').show();
		getColumnNameInfo();
		//$('.column_managebox').hide();
		$('.addcolumn').hide();
        $('.video_add_or_edit').attr('columnId',$('.addcolumn').attr('id'));
		$('.goods_box').createArticleEditor();
    });
	//点击全部帖子新增视频按钮
	$('.all_cn_list .columnbtn.mlreset.addvideo-btn').click(function(e) {
		clearVideoMessageFn();//清空添加视频信息
		var pageInfo = new PageInfo(".all_cn_list");
		ldq.push(pageInfo);
		$('.video_add_or_edit').show();
		getColumnNameInfo();
		//$('.column_managebox').hide();
		$('.all_cn_list').hide();
		$('.goods_box').createArticleEditor();
    });
	//点击全部评论管理里面的权限管理按钮
	$('.all_commonts_table .all_commonts_table_quanxian').live('click',function(e) {
		var pageInfo = new PageInfo("#ac_manage");
		ldq.push(pageInfo);
		$('#ac_manage').hide();
		$('.user_competence_manage').show();
		getUserManageMessageFn($(this));
    });
	
	//点击全部评论管理里面的权限管理按钮
	$('.everyone_commonts_table .all_commonts_table_quanxian').live('click',function(e) {
		var pageInfo = new PageInfo("#ac_manage");
		ldq.push(pageInfo);
		$('#ac_manage').hide();
		$('.user_competence_manage').show();
		getUserManageMessageFn($(this));
    });
	
	//从用户管理--》获取用户权限管理信息
	$('.yhxq .user_competence').live('click',function(e) {
		var pageInfo = new PageInfo("#user_manage");
		ldq.push(pageInfo);
		$('#user_manage').hide();
		$('.user_competence_manage').show();
		getUserManageMessageFn($(this));
    });
	
	//从用户权限管理返回到各个入口页面
	$('.user_competence_manage .ucm_return_btn').click(function(e) {
		$('.user_competence_manage').hide();
		var previousPage = ldq.pop();
		var str = previousPage._name;
		$(str).show();		
    });

});

//--------------------------------------------------------------创建专栏列表分页----------------------------------------------------
function createcolumnPage(data){
	$(".column-table .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getColumnSearchParams();
			params.page = p;
			$('.add-column-table>tbody>tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getColumnList/2.0.0',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initcolumnPage
			});			
		}
	});
}

//初始化专栏分页
function initcolumnPage(data){
	createcolumnPage(data);
	for(var x = 0; x < data.data.pageData.length ; x ++){
		var editTime='';
		if(typeof(data.data.pageData[x].editTime) == "undefined" || data.data.pageData[x].editTime == null){
			editTime='';
		}else{
			editTime=getLocalTime(data.data.pageData[x].editTime);
		}
		$('.add-column-table').append('<tr><td>'+data.data.pageData[x].id+'</td><td>'+data.data.pageData[x].createSysUser+'</td><td>'+data.data.pageData[x].editSysUser+'</td><td>'+editTime+'</td><td>'+data.data.pageData[x].name+'</td><td><img src="'+data.data.pageData[x].bgImg+'" width="100" alt="" /></td><td>'+data.data.pageData[x].articleNum+'</td><td>'+data.data.pageData[x].videoNum+'</td><td><input type="button" value="编辑" class="bluebtn1 cn-edit-btn" tId="'+data.data.pageData[x].id+'" /> <input type="button" value="删除" class="redbtn1 cn-del-btn" tId="'+data.data.pageData[x].id+'"  /></td></tr>');
	}
}

//获取专题查询参数
function getColumnSearchParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	return params;
}

//加载专题分页数据
function loadColumnPage(){
	$('.add-column-table>tbody>tr:gt(0)').remove();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getColumnList/2.0.0',
		type : 'get',
		dataType : 'json',
		data: getColumnSearchParams(1),
		success : initcolumnPage,
	});
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getPublishIds/2.0.0',
		type : 'get',
		dataType : 'json',
		data: {},
		success : function(data){
			if(data.code == 0){
			$('.column-table .check-online ul li>.co-txt').html('()');
			var arr = data.data.publishIds.split(';');
			for(var x = 0; x < arr.length; x ++){
				$('.column-table .check-id input:eq('+x+')').val(arr[x]);
				$('.column-table .check-online ul li:eq('+x+') .co-txt').html('('+arr[x]+')');
			}
		};
		if(data.code == 1){
			alert(data.data.error);	
		}	
		}
	});
}



//---------------------------------------------------------------------创建用作品表分页-----------------------------------------

//清除搜索输入框内的内容
function clearTextMessage(){
	$('.all_cn_list .columnlist .columnNameId').children("option:gt(0)").remove();
	$('.user_cn_list .columnlist .columnNameId').children("option:gt(0)").remove();
	$('.label_cn_list .columnlist .columnNameId').children("option:gt(0)").remove();
	$('.all_cn_list .columnlist .columntype option:eq(0)').attr("selected","selected");
	$('.label_cn_list .columnlist .columntype option:eq(0)').attr("selected","selected");
	$('.columnlist .columntype option:eq(0)').attr("selected","selected");
	$('.columnlist .columntit').val("");
	$('.columnlist .columnname').val("");
	$('.columnlist .cnstartTime').val("");
	$('.columnlist .cnendTime').val("");
	$('.columnlist .columnSearchId').val("");
	$('.columnlist .columnPostId').val("");
	$('.columnlist .columnCardId').val("");
	$('.columnlist .checkStatus  option:eq(0)').attr("selected","selected");
	$('.columnlist .labelName').val("");
	$('.columnlist .labelID').val("");	
	$('.user_cn_list .columnlist .username').val("");
}
//清除搜索输入框内的内容
function clearSearchMessage(){
	$('.all_cn_list .columnlist .columnNameId option:eq(0)').attr("selected","selected");
	$('.user_cn_list .columnlist .columnNameId option:eq(0)').attr("selected","selected");
	$('.label_cn_list .columnlist .columnNameId option:eq(0)').attr("selected","selected");
	$('.all_cn_list .columnlist .columntype option:eq(0)').attr("selected","selected");
	$('.addcolumn .columnlist .columntype option:eq(0)').attr("selected","selected");
	$('.label_cn_list .columnlist .columntype option:eq(0)').attr("selected","selected");
	$('.user_cn_list .columnlist .columntype option:eq(0)').attr("selected","selected");
	$('.columnlist .columntit').val("");
	$('.columnlist .columnname').val("");
	$('.columnlist .cnstartTime').val("");
	$('.columnlist .cnendTime').val("");
	$('.columnlist .columnSearchId').val("");
	$('.columnlist .columnPostId').val("");
	$('.columnlist .columnCardId').val("");
	$('.columnlist .checkStatus  option:eq(0)').attr("selected","selected");
	$('.columnlist .labelName').val("");
	$('.columnlist .labelID').val("");	
	$('.user_cn_list .columnlist .username').val("");
}
//清空文本信息
function clearColumnTxtFn(){
	//清空信息
	$('.addcolumn .cn-name').val('');
	$('.addcolumn #cn-img').attr('src','');
	$('.addcolumn .ci-txt').val('');
	$('.addcolumn .co-txt').text("()");
	$('.all_cn_list .cn-select-table tr:gt(0)').remove();
	$('.addcolumn .cn-select-table tr:gt(0)').remove();
}	

//时间格式化
function getLocalTime(publishTime) {
		var s = 0;
		s = new Date(publishTime);
		var m=parseInt(s.getMonth() + 1);
		if(m<10){
			m="0"+m;
			}
		var day=parseInt(s.getDate());
		if(day<10){
			day="0"+day;
			}
		 var hours=parseInt(s.getHours());
		if(hours<10){
			hours="0"+hours;
			}
		var minutes=parseInt(s.getMinutes());
		if(minutes<10){
			minutes="0"+minutes;
			}
		return (s.getFullYear() + "-" + m) + "-" +day+ " " +hours+ ":" +minutes ;
}

//点击编辑时获取帖子详情
function getcolumnInfo(){
	$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getColumnDetail/2.0.0',
			type : 'get',
			dataType : 'json',
			data: {id:$(".addcolumn").attr("id")},
			success : function(data){
				if(data.code==0){
					$(".addcolumn .cn-name").val(data.data.name);
					for(var x = 0; x < data.data.columnPostIds.length; x ++){
						$('.currentcolumn li:eq('+x+') .co-txt').html('('+data.data.columnPostIds[x]+')');
						$('.selectcolumn .ci-txt:eq('+x+')').val(data.data.columnPostIds[x]);
					}
					$("#cn-img").attr("src",data.data.bgImg);
					$("#ac_manage").hide();
				}else{
					alert(data.data.error);
					}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				console.log( XMLHttpRequest )
				//$(".main").html("尚未发布任何信息！");
			}
		});
	}
//定义数据

function  getcolumnData(columnPostId,id,num,page,postType,title,nickName,startTime,endTime,postId){
	var data = new Object();
	data.columnPostId = columnPostId;
	data.id = id;
	data.num = num;
	data.page = page;
	data.postType = postType;
	data.title = title;
	data.nickName = nickName;
	data.startTime = startTime;
	data.endTime = endTime;
	data.postId = postId;
	return data;	
}

//搜索的数据
function columnData(){
	if(typeof($(".addcolumn").attr("id")) == "undefined"){
		return getcolumnData(
		$(".all_cn_list .columnlist .columnPostId").val(),$(".all_cn_list .columnlist .columnNameId").val(),20,1,$('.all_cn_list .columnlist .columntype option:selected').attr('value'),
		$('.all_cn_list .columnlist .columntit').val(),$('.all_cn_list .columnlist .columnname').val(),$('.all_cn_list .columnlist .cnstartTime').val().replace(/\D/g,''),$('.all_cn_list .columnlist .cnendTime').val().replace(/\D/g,''),$('.all_cn_list .columnlist .columnSearchId').val()
		);
	}else{
		return getcolumnData(
		'',$(".addcolumn").attr("id"),20,1,$('.addcolumn .columnlist .columntype option:selected').attr('value'),
		$('.addcolumn .columnlist .columntit').val(),$('.addcolumn .columnlist .columnname').val(),$('.addcolumn .columnlist .cnstartTime').val().replace(/\D/g,''),$('.addcolumn .columnlist .cnendTime').val().replace(/\D/g,''),$('.addcolumn .columnlist .columnSearchId').val()
		);
	}
	
}

//渲染数据
function columnlistdetail(data){
	$('.all_cn_list .cn-select-table tr:gt(0)').remove();
	$('.addcolumn .cn-select-table tr:gt(0)').remove();
	for(var x = 0; x < data.data.pageData.length ; x ++){
		var status='';
		var picture='';
		if(data.data.pageData[x].status == '1'){
			status='<input type="button" value="上线" class="bluebtn1 changeoriPostStatus"  postId="'+data.data.pageData[x].postId+'" postType="'+data.data.pageData[x].postType+'" online="1"/>';
		}else if(data.data.pageData[x].status == '2'){
			status='<input type="button" value="下线" class="redbtn1 changeoriPostStatus"  postId="'+data.data.pageData[x].postId+'" postType="'+data.data.pageData[x].postType+'" online="0"/>';
		};
		if(data.data.pageData[x].picture == ''){
			picture='';
		}else{
			picture='<img src='+data.data.pageData[x].picture+' class="colimg" alt="" />';
		}
		//判断时间是否为null
		var editTime='';
		if(data.data.pageData[x].editTime == null){
			editTime='';
		}else{
			editTime=getLocalTime(data.data.pageData[x].editTime);
		}
		var createTime='';
		if(data.data.pageData[x].createTime == null){
			createTime='';
		}else{
			createTime=getLocalTime(data.data.pageData[x].createTime);
		}
		$('.addcolumn .cn-select-table').append('<tr><td>'+data.data.pageData[x].columnPostId+'</td><td>'+data.data.pageData[x].postId+'</td><td>'+data.data.pageData[x].createSysUser+'</td><td>'+data.data.pageData[x].editSysUser+'</td><td>'+editTime+'</td><td class="columntype" typeid='+data.data.pageData[x].postType+'></td><td>'+data.data.pageData[x].title+'</td><td>'+picture+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+createTime+'</td><td>'+data.data.pageData[x].trueViewNum+'</td><td>'+status+'<input type="button" value="编辑" class="bluebtn1 articaldeatiledit" postType="'+data.data.pageData[x].postType+'" postId="'+data.data.pageData[x].postId+'" title="'+data.data.pageData[x].title+'" />&nbsp;<input type="button" value="删除" class="redbtn1 column-del" tid="'+data.data.pageData[x].postId+'" ttype="'+data.data.pageData[x].postType+'" /><br/><input type="button" value="管理评论" class="bluebtn1 columncomment"  cid="'+data.data.pageData[x].postId+'"  utype="'+data.data.pageData[x].postType+'"/></td></tr>');
		$('.all_cn_list .cn-select-table').append('<tr><td>'+data.data.pageData[x].columnPostId+'</td><td>'+data.data.pageData[x].postId+'</td><td>'+data.data.pageData[x].createSysUser+'</td><td>'+data.data.pageData[x].editSysUser+'</td><td>'+editTime+'</td><td class="columntype" typeid='+data.data.pageData[x].postType+'></td><td>'+data.data.pageData[x].columnName+'</td><td>'+data.data.pageData[x].title+'</td><td>'+picture+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+createTime+'</td><td>'+data.data.pageData[x].trueViewNum+'</td><td>'+status+'<input type="button" value="编辑" class="bluebtn1 articaldeatiledit" postType="'+data.data.pageData[x].postType+'" postId="'+data.data.pageData[x].postId+'" columnId="'+data.data.pageData[x].columnId+'" title="'+data.data.pageData[x].title+'" />&nbsp;<input type="button" value="删除" class="redbtn1 column-del" tid="'+data.data.pageData[x].postId+'" ttype="'+data.data.pageData[x].postType+'" /><br/><input type="button" value="管理评论" class="bluebtn1 columncomment"  cid="'+data.data.pageData[x].postId+'" utype="'+data.data.pageData[x].postType+'"/></td></tr>');
	};
		$(".columntype").each(function(index, element) {
				if($(this).attr("typeid") == '1'){
					$(this).html("文章");
				}else if($(this).attr("typeid") == '2'){
					$(this).html("视频");
				}
			});
	}
	
//根据不同的页码来渲染页面
function onclickcolPageNum(p){
	var data = columnData();

	data.page = p;
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getColumnPostList/2.5.6',
		type : 'post',
		dataType : 'json',
		data: data,
		success : function(data){
			columnlistdetail(data);
		},
	});
}
	
//获取入参，渲染页面
function columnInfo(){
	//获取入参
	var data = columnData();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getColumnPostList/2.5.6',
		type : 'post',
		dataType : 'json',
		data: data,
		success : function(data){
			if(data.code == 0){
			//创建分页
			$(".addcolumn .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:onclickcolPageNum
			});
			$(".all_cn_list .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:onclickcolPageNum
			});
			//渲染页面
			columnlistdetail(data);
			}else{
				alert(data.data.error);
			}
		},
	});
}
	
//获取文章详情
function getTieDetailsFn(btn){
	var del=btn;
	$('.ac_everyOne_list').hide();
	cleararticalDeatil();
	var postType;
	if(del.attr('postType') == 1){
		postType=1;
			$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getArticleDetail/2.5.3',
			type : 'get',
			dataType : 'json',
			data: {postId:del.attr('postId'),postType:postType},
			success : function(data){
				if(data.code == 0){
				$(".articleedit").attr("id",data.data.postId)
				$('.articleedit').attr('tag','article')
				$(".addcolumn").hide();
				$(".articleedit").show();
				getColumnNameInfo(data.data.columnId);
				$(".articleedit").attr("id",$(".addcolumn").attr("id"));
				$(".articleedit").attr("pid",del.attr("postid"));
				$(".articleedit .arttit").val(data.data.title);
				if(data.data.shareContent == "变美的路有那么多，南瓜姑娘的帖子是一条捷径~"){
					$(".articleedit .shareContent").val("");
				}else{
					$(".articleedit .shareContent").val(data.data.shareContent);
				}
				/*$(".articleedit .chooseColumn option").each(function(index, element) {
                    if($(this).val()==data.data.columnId){
						$(this).attr("selected","selected");
					};
                });*/
				$(".articleedit .promulgator").val(data.data.createUserId);
				if(data.data.labels.length>3 && $(".articleedit .labelEditBox .userLabel").length != data.data.labels.length){
					var str='';
					str='<div class="labelBox2"><input type="text" placeholder="输入标签" class="userLabel"><img src="images/ele-del.png" class="delLabelType" alt="" /> </div>';
					for(var i=3;i<data.data.labels.length;i++){
						$(".articleedit .labelEditBox .thisBefore").before(str);
					}
				}
				for(var i=0;i<data.data.labels.length;i++){
					$(".articleedit .labelEditBox .userLabel:eq("+i+")").val(data.data.labels[i]);
				};
				$(".articleedit #cover-img").attr("src",data.data.picture);
				$(".articleedit #detailtop-img").attr("src",data.data.detailImg);
				$(".articleedit #atuijianimg").attr("src",data.data.recommendImg);
				$(".articleedit .userRole").val(data.data.userRole);

				$('.articleedit .editor_content').createArticleEditor({data:data.data.articles});

			}else{
				alert(data.data.error);
			}
			}
		});

	}else{
		postType=2;
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getVideoDetail/2.5.3',{postId:del.attr('postId'),postType:postType},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.video_add_or_edit').attr('tag','video')
				//$('#column_manage').hide();
				$('.addcolumn').hide();
				$('.video_add_or_edit').show();
				$('.video_add_or_edit').attr('flage','update');
				$('.ju_bao_box').hide();
				//视频帖子回显数据
				getColumnNameInfo(data.data.columnId);
				/*$(".video_add_or_edit .chooseColumn option").each(function(index, element) {
                    if($(this).val()==data.data.columnId){
						$(this).attr("selected","selected");
					};
                });*/
				$('.video_add_or_edit .vaoe_title').val(data.data.title);
				if(data.data.shareContent == "变美的路有那么多，南瓜姑娘的帖子是一条捷径~"){
					$(".video_add_or_edit .shareContent").val("");
				}else{
					$(".video_add_or_edit .shareContent").val(data.data.shareContent);
				}
				$('.video_add_or_edit .vaoe_id').val(data.data.createUserId),
				$('.video_add_or_edit .vaoe_video_id').val(data.data.videoId),
				$('.video_add_or_edit #vaoe_img_cover').attr('src',data.data.picture),
				$('.video_add_or_edit #vaoe_img_zhen').attr('src',data.data.detailImg),
				$('.video_add_or_edit #tuijianimg').attr('src',data.data.recommendImg),
				$('.video_add_or_edit').attr('postId',data.data.postId);
				
				if(data.data.labels.length>3 /*&& $(".video_add_or_edit .labelEditBox .userLabel").length != data.data.labels.length*/){
					var str='';
					var a=$(".video_add_or_edit .labelEditBox .vaoe_Label").length;
					str='<div class="labelBox2"><input type="text" placeholder="输入标签" class="vaoe vaoe_Label"><img src="images/ele-del.png" class="delLabelType" alt="" /> </div>';
					for(var i=a;i<data.data.labels.length;i++){
						$(".video_add_or_edit .labelEditBox .thisBefore").before(str);
					}
				}
				for(var j=0;j<data.data.labels.length;j++){
					$(".vaoe_Label:eq("+j+")").val(data.data.labels[j]);
				};
				$(".goodsEditBox ul").children().remove();

				//初始化
				$('.goods_box').createArticleEditor({data:data.data.articles});;
			}else{
				alert(data.data.error);	
			}
		});
	}
}


//清除文章页内容信息
function cleararticalDeatil(){
	$('.articleedit .chooseColumn').children("option:gt(0)").remove();;
	$(".articleedit").removeAttr("id");
	$(".articleedit").removeAttr("pid");
	$(".articleedit .arttit").val("");
	$(".articleedit .promulgator").val("");
	$(".articleedit .shareContent").val("");
	$(".userLabel").val("");
	$(".articleedit #cover-img").removeAttr("src");
	$(".articleedit #detailtop-img").removeAttr("src");
	$(".articleedit #atuijianimg").removeAttr("src");
	$('.articleedit .editor_content').createArticleEditor();
	$('.articleedit .labelEditBox .labelBox2:gt('+2+')').remove();
	
}
function juBaoFun(btn){
	var ok = btn;
	//判断评论类型
	if(ok.attr('commentType') == 1){//层主
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/post/getCommentReport/2.0.0',{commentType:ok.attr('commentType'),targetId:ok.attr('commentId')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.ju_bao_box table tbody tr:gt(0)').remove();
				$('.ac-list').hide();
				$('.ac_everyOne_list').hide();
				$('.ju_bao_box').show();
				$('.ju_bao_box table tbody').append('<tr><td>'+data.data.content+'</td><td>'+data.data.postTitle+'<br /><input type="button" value="查看原帖" class="jbb_btn_look" postType="'+data.data.postType+'" postId="'+data.data.postId+'" /></td><td>'+data.data.publisher+'</td><td>'+data.data.reporters+'</td><td><select name="" id="" class="jbb_ju_bao_status"><option value="0">请选择处理结果</option><option value="1">无效举报</option><option value="2">有效举报</option><option value="3">恶意举报</option></select></td><td><input type="button" value="处理完成" commentId="'+ok.attr('commentId')+'" replyId="'+ok.attr('replyId')+'" class="jbb_btn_ok" commentType="'+data.data.commentType+'" targetId="'+data.data.targetId+'" /> <input type="button" value="取消" class="jbb_btn_cancle" /></td></tr>');
			}else{
				alert(data.data.error);	
			}
		});
	}
	if(ok.attr('commentType') == 2){//层中层
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/post/getCommentReport/2.0.0',{commentType:ok.attr('commentType'),targetId:ok.attr('replyId')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.ju_bao_box table tbody tr:gt(0)').remove();
				$('.ac-list').hide();
				$('.ac_everyOne_list').hide();
				$('.ju_bao_box').show();
				$('.ju_bao_box table tbody').append('<tr><td>'+data.data.content+'</td><td>'+data.data.postTitle+'<br /><input type="button" value="查看原帖" class="jbb_btn_look" postType="'+data.data.postType+'" postId="'+data.data.postId+'" /></td><td>'+data.data.publisher+'</td><td>'+data.data.reporters+'</td><td><select name="" id="" class="jbb_ju_bao_status"><option value="0">请选择处理结果</option><option value="1">无效举报</option><option value="2">有效举报</option><option value="3">恶意举报</option></select></td><td><input type="button" value="处理完成" commentId="'+ok.attr('commentId')+'" class="jbb_btn_ok" replyId="'+ok.attr('replyId')+'" commentType="'+data.data.commentType+'" targetId="'+data.data.targetId+'" /> <input type="button" value="取消" class="jbb_btn_cancle" /></td></tr>');
			}else{
				alert(data.data.error);	
			}
		});
	}	
}

//清空视频信息
function clearVideoMessageFn(){
	$('.video_add_or_edit .chooseColumn').children("option:gt(0)").remove();
	$('.video_add_or_edit .vaoe_title').val('');
	$('.video_add_or_edit .shareContent').val('');
	$('.video_add_or_edit .vaoe_id').val('');
	$('.video_add_or_edit .vaoe_role').val('');
	$('.video_add_or_edit .vaoe_video_id').val('');
	$('.video_add_or_edit #vaoe_img_cover').attr('src','');
	$('.video_add_or_edit #vaoe_img_zhen').attr('src','');
	$('.video_add_or_edit #tuijianimg').attr('src','');
	$('.video_add_or_edit .vaoe_Label').val('');
	$('.goodsEditBox ul').html("");
	goodsNum.splice(0,goodsNum.length);
	$(".selectednum b").text("0");
	$(".video_add_or_edit").removeAttr("postid");
	$('.video_add_or_edit .labelEditBox .labelBox2:gt('+2+')').remove();
}
//获取热搜词
function getPopularSearch(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getPopularSearch/2.2.0',
		type : 'get',
		dataType : 'json',
		data: {},
		success : function(data){
			if(data.code == 0){
				$(".hotLabelBox input").val(data.data);
			};
			if(data.code == 1){
				alert(data.data.error);	
			}	
		}
	});
};
//发布热搜词
function pushPopularSearch(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/savePopularSearch/2.2.0',
		type : 'post',
		dataType : 'json',
		data: {popularSearch:$(".hotLabelBox input").val()},
		success : function(data){
			if(data.code == 0){
				alert("发布成功！");
			};
			if(data.code == 1){
				alert(data.data.error);	
			}	
		}
	});
}
$(function(){
	$(".cn-list-btn").live('click',function(){
		clearTextMessage();
		$(".all_cn_list").show();	
		$(".column-table").hide();
		getColumnNameInfo();
		columnInfo();
	});	
	$(".list-back-btn").live('click',function(){
		//清空表格信息
		clearTextMessage();
        $('.column-table').show();
		$(".column_managebox").show();
		$(".all_cn_list").hide();
		loadColumnPage();
		clearColumnTxtFn();
	});
});
//获取专栏名称
function getColumnNameInfo(id){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getAllColumnList/2.4.0',
		type : 'get',
		dataType : 'json',
		data: {},
		success : function(data){
			if(data.code == 0){
				for( var i= 0; i<data.data.length ; i++){
				$(".columnlist .columnNameId").append('<option value="'+data.data[i].columnId+'">'+data.data[i].columnName+'</option>');
				if(data.data[i].columnId == $(".addcolumn").attr("id")){
					$(".articleedit .chooseColumn").append('<option value="'+data.data[i].columnId+'" selected>'+data.data[i].columnName+'</option>');
					$(".video_add_or_edit .chooseColumn").append('<option value="'+data.data[i].columnId+'" selected>'+data.data[i].columnName+'</option>');
				}else if(data.data[i].columnId == id){
					$(".articleedit .chooseColumn").append('<option value="'+data.data[i].columnId+'" selected>'+data.data[i].columnName+'</option>');
					$(".video_add_or_edit .chooseColumn").append('<option value="'+data.data[i].columnId+'" selected>'+data.data[i].columnName+'</option>');
				}else{
					$(".articleedit .chooseColumn").append('<option value="'+data.data[i].columnId+'">'+data.data[i].columnName+'</option>');
					$(".video_add_or_edit .chooseColumn").append('<option value="'+data.data[i].columnId+'">'+data.data[i].columnName+'</option>');
				};
				$(".guest_online_column_search .columnNameId").append('<option value="'+data.data[i].columnId+'">'+data.data[i].columnName+'</option>');
				$(".abouting_goods_Posts_children_two .columnNameId").append('<option value="'+data.data[i].columnId+'">'+data.data[i].columnName+'</option>');
			}
				
			};
			if(data.code == 1){
				alert(data.data.error);	
			}	
		}
	});
};
//定义数据
function  getLabelColumnData(num,page,tag,columnId,postType,postId,title,nickName,startTime,endTime){
	var data = new Object();
	data.num = num;
	data.page = page;
	data.tag = tag;
	data.columnId = columnId;
	data.postType = postType;
	data.postId = postId;
	data.title = title;
	data.nickName = nickName;
	data.startTime = startTime;
	data.endTime = endTime;
	return data;	
}
//搜索的数据
function labelColumnData(){
	return getLabelColumnData(
		20,1,$('.label_cn_list .columnlist .labelName').val(),$(".label_cn_list .columnlist .columnNameId").val(),$('.label_cn_list .columnlist .columntype option:selected').attr('value'),
		$('.label_cn_list .columnlist .columnSearchId').val(),$('.label_cn_list .columnlist .columntit').val(),$('.label_cn_list .columnlist .columnname').val(),$('.label_cn_list .columnlist .cnstartTime').val().replace(/\D/g,''),$('.label_cn_list .columnlist .cnendTime').val().replace(/\D/g,'')
	);	
}
//返回相同标签的的楼层数
function getLabelSpanNum(data,rowIndex){//data，行下标
	var tag = data.data.pageData[rowIndex].tag;
	var tagNum = 0;
	for(var i=rowIndex;i<data.data.pageData.length;i++){
		if(data.data.pageData[i].tag == tag){
			tagNum++;
		}else{
			return tagNum;
			
		}
	}
	return tagNum;
}
//渲染数据
function labelColumnlistdetail(data){
	$('.label_cn_list .label_cn_table tr:gt(0)').remove();
	var postType='';
	var img='';
	for(var x = 0;x < data.data.pageData.length;){
		var vals=getLabelSpanNum(data,x);
		for(var i=0;i< vals;i++,x++){
			var val=data.data.pageData[x];
			if(val.postType == '1'){
				postType='文章';
			}else if(val.postType == '2'){
				postType='视频';
			};
			if(val.picture != ""){
				img='<img src='+val.picture+' class="colimg" alt="" />';
			}else{
				img='';
			}
			if(i==0){
				$('.label_cn_list .label_cn_table').append('<tr ><td rowspan="'+vals+'">'+val.tag+'</td><td rowspan="'+vals+'">'+val.postCount+'</td><td>'+val.postId+'</td><td class="columntype" typeid='+val.postType+'>'+postType+'</td><td>'+val.columnName+'</td><td>'+val.title+'</td><td>'+img+'</td><td>'+val.nickName+'</td><td>'+getCreatTime(val.publishTime)+'</td><td><input type="button" value="编辑" class="bluebtn1 articaldeatiledit" postType="'+val.postType+'" postId="'+val.postId+'" title="'+val.title+'" />&nbsp;<input type="button" value="删除" class="redbtn1 column-del" tid="'+val.postId+'" ttype="'+val.postType+'" /><br/><input type="button" value="管理评论" class="bluebtn1 columncomment"  cid="'+val.postId+'" utype="'+val.postType+'"/></td></tr>');
			}else{
				$('.label_cn_list .label_cn_table').append('<tr ><td>'+val.postId+'</td><td class="columntype" typeid='+val.postType+'>'+postType+'</td><td>'+val.columnName+'</td><td>'+val.title+'</td><td>'+img+'</td><td>'+val.nickName+'</td><td>'+getCreatTime(val.publishTime)+'</td><td><input type="button" value="编辑" class="bluebtn1 articaldeatiledit" postType="'+val.postType+'" postId="'+val.postId+'" title="'+val.title+'" />&nbsp;<input type="button" value="删除" class="redbtn1 column-del" tid="'+val.postId+'" ttype="'+val.postType+'" /><br/><input type="button" value="管理评论" class="bluebtn1 columncomment"  cid="'+val.postId+'" utype="'+val.postType+'"/></td></tr>');
			}
		}
	};
}	
//根据不同的页码来渲染页面
function onclickLabelPageNum(p){
	var data = labelColumnData();
	data.page = p;
	$('body').attr('labelpage',p);
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getPostListByTag/2.5.4',
		type : 'post',
		dataType : 'json',
		data: data,
		success : function(data){	
			labelColumnlistdetail(data);	
		},
	});
}	
//获取入参，渲染页面
function labelColumnInfo(){
	//获取入参
	var data = labelColumnData();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getPostListByTag/2.5.4',
		type : 'post',
		dataType : 'json',
		data: data,
		success : function(data){
			if(data.code == 0){
			//创建分页
			$(".label_cn_list .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:onclickLabelPageNum
			});
			$('body').attr('labelpage',1);
			//渲染页面
			labelColumnlistdetail(data);
			}else{
				alert(data.data.error);
			}
		},
	});
}
//根据用户获取帖子
//定义数据
function  getUserColumnData(num,page,userId,nickName,title,columnId,postType,status,startTime,endTime){
	var data = new Object();
	data.num = num;
	data.page = page;
	data.userId = userId;
	data.nickName = nickName;
	data.title = title;
	data.columnId = columnId;
	data.postType = postType;
	data.status = status;
	data.startTime = startTime;
	data.endTime = endTime;
	return data;	
}
//搜索的数据
function UserColumnData(){
	return getUserColumnData(
		20,1,$('.user_cn_list .columnlist .columnCardId').val(),$(".user_cn_list .columnlist .username").val(),$('.user_cn_list .columnlist .columntit').val(),$('.user_cn_list .columnlist .columnSearchId').val(),$('.user_cn_list .columnlist .columntype option:selected').attr('value'),
		$('.user_cn_list .columnlist .checkStatus option:selected').attr('value'),$('.user_cn_list .columnlist .cnstartTime').val().replace(/\D/g,''),$('.user_cn_list .columnlist .cnendTime').val().replace(/\D/g,'')
	);	
}
//渲染数据
function userColumnlistdetail(data){
	$('.user_cn_list .user_cn_table tr:gt(0)').remove();
	var postType='';
	var status='';
	var picture='';
	$.each(data.data.pageData,function(key,val){
		if(val.postType == '1'){
			postType='文章';
		}else if(val.postType == '2'){
			postType='视频';
		};
		if(val.status == '1'){
			status='审核中';
			changestatus='<input type="button" value="上线" online="1" class="bluebtn1 postStatus "  postType="'+val.postType+'" postId="'+val.postId+'" />';
		}else if(val.status == '2'){
			status='审核通过、已上线';
			changestatus='<input type="button" value="下线" online="0" class="redbtn1 postStatus"  postType="'+val.postType+'" postId="'+val.postId+'" />';
		};
		if(val.picture == ""){
			 picture='';
		}else{
			 picture='<img src='+val.picture+' class="colimg" alt="" />';
		}
		//判断时间是否为null
		var editTime='';
		if(val.editTime == null){
			editTime='';
		}else{
			editTime=getLocalTime(val.editTime);
		}
		
		$('.user_cn_list .user_cn_table').append('<tr ><td>'+getCreatTime(val.updateTime)+'</td><td>'+val.userId+'</td><td>'+val.nickName+'</td><td>'+val.editSysUser+'</td><td>'+editTime+'</td><td>'+postType+'</td><td>'+val.columnName+'</td><td>'+val.title+'</td><td>'+picture+'</td><td>'+status+'</td><td  postType="'+val.postType+'" postId="'+val.postId+'" >'+changestatus+'<input type="button" value="编辑" class="bluebtn1 articaldeatiledit" postType="'+val.postType+'" postId="'+val.postId+'" title="'+val.title+'" />&nbsp;<input type="button" value="删除" class="redbtn1 column-del" tid="'+val.postId+'" ttype="'+val.postType+'" /><br/></td></tr>');
	});
}
	
//根据不同的页码来渲染页面
function onclickUserPageNum(p){
	var data = UserColumnData();

	data.page = p;
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getPostListByUser/2.5.6',
		type : 'post',
		dataType : 'json',
		data: data,
		success : function(data){
			
			userColumnlistdetail(data);
			
		},
	});
}
	
//获取入参，渲染页面
function userColumnInfo(){
	//获取入参
	var data = UserColumnData();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getPostListByUser/2.5.6',
		type : 'post',
		dataType : 'json',
		data: data,
		success : function(data){
			if(data.code == 0){
			//创建分页
			$(".user_cn_list .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:onclickUserPageNum
			});
			//渲染页面
			userColumnlistdetail(data);
			}else{
				alert(data.data.error);
			}
		},
	});
}
//用户文章上下线
function changePostStatus(data){
	if($(".changeThisPostStatus").hasClass("redbtn1")){
		$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/offLinePost/3.0.0',
			type : 'post',
			dataType : 'json',
			data: {postId:$(".changeThisPostStatus").attr("postId"),postType:$(".changeThisPostStatus").attr("postType"),reason:data},
			success : function(data){
				if(data.code == 0){
					//userColumnInfo();
					$("#column_manage .allreasonBox").hide();
					$(".changeThisPostStatus").parent().parent().remove();
					$("#column_manage .allreasonBox .reasonList p").removeClass("on");
					$("#column_manage .allreasonBox .reasonList .selfReason").val("");
					$(".changeThisPostStatus").parent().prev().html("已下线");
				}else{
					alert(data.data.error);
				}
			},
		});
	}else{
		$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/onLinePost/3.0.0',
			type : 'post',
			dataType : 'json',
			data: {params:data},
			success : function(data){
				if(data.code == 0){
					$(".changeThisPostStatus").removeClass("bluebtn1");
					$(".changeThisPostStatus").addClass("redbtn1");
					$(".changeThisPostStatus").val("下线");
					$(".changeThisPostStatus").parent().prev().html("审核通过、已上线");
				}else{
					alert(data.data.error);
				}
			},
		});
	}
};
//文章列表页上下线
function changeOriPostStatus(data){
	if($(".changeThisOnlineStatus").hasClass("redbtn1")){
		$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/offLinePost/3.0.0',
			type : 'post',
			dataType : 'json',
			data: {postId:$(".changeThisOnlineStatus").attr("postId"),postType:$(".changeThisOnlineStatus").attr("postType"),reason:data},
			success : function(data){
				if(data.code == 0){
					columnInfo();
					$("#column_manage .allreasonBox").hide();
					$("#column_manage .allreasonBox .reasonList p").removeClass("on");
					$("#column_manage .allreasonBox .reasonList .selfReason").val("");
				}else{
					alert(data.data.error);
				}
			},
		});
	}else{
		$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/onLinePost/3.0.0',
			type : 'post',
			dataType : 'json',
			data: {params:data},
			success : function(data){
				if(data.code == 0){
					$(".changeThisOnlineStatus").removeClass("bluebtn1");
					$(".changeThisOnlineStatus").addClass("redbtn1");
					$(".changeThisOnlineStatus").val("下线");
				}else{
					alert(data.data.error);
				}
			},
		});
	}
};
//删除帖子
function deletOldPostFn(reason){
	console.log(reason);
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/deletePost/3.0.0',
		type : 'post',
		dataType : 'json',
		data: {postType:$(".delThis").attr("ttype"),postId:$(".delThis").attr("tid"),reason:reason},
		success : function(data){
			if(data.code == 0){
				if($(".delThis").hasClass("labeldel")){
					onclickLabelPageNum($('body').attr('labelpage'));
					$("#column_manage .allreasonBox").hide();
					$("#column_manage .allreasonBox .reasonList p").removeClass("on");
					$("#column_manage .allreasonBox .reasonList .selfReason").val("");
				}else{
					$(".delThis").parent().parent().remove();
					$("#column_manage .allreasonBox").hide();
					$("#column_manage .allreasonBox .reasonList p").removeClass("on");
					$("#column_manage .allreasonBox .reasonList .selfReason").val("");
				}
			}else{
				alert(data.data.error);
			}
		},
	});
}
//留言时间格式化
function getCreatTime(publishTime) {
	var s = 0;
    s = new Date(publishTime);
	var m=parseInt(s.getMonth() + 1);
	if(m<10){
		m="0"+m;
		}
	var day=parseInt(s.getDate());
	if(day<10){
		day="0"+day;
		}
 	var hours=parseInt(s.getHours());
	if(hours<10){
		hours="0"+hours;
	}
	var minutes=parseInt(s.getMinutes());
	if(minutes<10){
		minutes="0"+minutes;
	}
    return (s.getFullYear() + "-" + m) + "-" +day  + " " +hours + ":" +minutes ;
    
}
