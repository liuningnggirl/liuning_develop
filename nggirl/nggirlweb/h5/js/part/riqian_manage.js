
$(function(){
//邀请管理
	//签到满月用户列表
	$(".checkAllMonthUserList").live('click',function(){
		$(".check_user_search input[type='text']").val("");
		checkUserInfo();
		$(".riqian_list").hide();
		$(".check_all_month_user_list").show();
		
	});
	//签到满月用户列表搜索按钮
	$(".check_all_month_user_list .check_search_btn").live('click',function(){
		checkUserInfo();
	});
	//签到满月用户列表返回按钮
	$(".check_all_month_user_list .back_check_list_btn").live('click',function(){
		$(".riqian_list").show();
		$(".check_all_month_user_list").hide();
	});
	//签到满月用户发货状态标记
	$(".riqianUserListDetail .deliverCheckAward").live('click',function(){
		$(".deliverThisCheckAward").removeClass("deliverThisCheckAward");
		$(this).addClass("deliverThisCheckAward");
		deliverCheckAwardFn();
	});
//<!--  日签搜索按钮 -->
	$(".addriqian_btn").live('click',function(){
		$(".riqian_list").hide();
		$(".riqian_create").show();
		clearRiqianList();

		//初始化编辑器
		$('.riqian_create .editor_content').createArticleEditor({
			elements: ['title','image','goods','fullScreen'],
			data:[{type:1,content:''}],//初始化内容
			shouldKeepImage:function(uploadedUrl,width,height){
				var w = parseFloat(width);
				var h = parseFloat(height);
				if(w/h == 690.0/216.0){
					return true;
				}else{
					alert('图片宽高比例错误,图片宽高比必须是690*216');
					return false;
				}
			},
			defaultData:[{type:1,content:''}]//编辑器为空时,默认的元素
		});
	});

	$(".riqian_file_cover").fileupload({
		dataType: 'json',
		done: function (e, data) {
			var a=data.result.data.width/data.result.data.height;
			if(a != 720/480){
				alert("上传失败！图片比例应为720*480");
			}else{
				$('#riqian_img_cover').attr('src',data.result.data.url);
				$('#riqian_img_cover').attr('entend',data.result.data.width+'_'+data.result.data.height);
			};
			
		}
	});

	//发送日签提醒
	$(".sendriqian_btn").live('click',function(){
		if($(".riqianalert_btn").val() == ""){
			alert("日签提醒不能为空！");
		}else{
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/checkin/saveCheckinDesc/2.3.0',
				type : 'post',
				dataType : 'json',
				data: {checkinDesc:$(".riqianalert_btn").val()},
				success : function(data){
					if(data.code == 0){
						$(".riqianalert_btn").html(data.data);
						alert("保存成功！");
					}else{
						alert(data.data.error);
					}
				},
			});
		}
	});

	//新增作品
	$(".riqiansave").live('click',function(){
		saveRiqianDetail();
	});
	//返回列表页
	$(".riqianbacklist").live('click',function(){
		$(".riqian_list").show();
		$(".riqian_create").hide();
		clearRiqianList();
	});
	//取消删除
	$(".delriqianbox .notdel").live('click',function(){
		$(".delriqianbox,.allbox").hide();
	});
	//搜索shangpin
	$(".searchriqian_btn").live('click',function(){
		riqianInfo();
	});
	//清空搜索内容
	$(".allriqian_btn").live('click',function(){
		$(".comodityClass,.comodityBrand,.comodityCountry,.comodityName").val("");
		riqianInfo();
	});
	//删除按钮
	$(".riqianListDetail .riqian_del").live('click',function(){
		$(".delThisRiqian").removeClass("delThisRiqian");
		$(this).addClass("delThisRiqian");
		$(".delriqianbox,.allbox").show();
	});
	//确认删除
	$(".delriqianbox .suredel").live('click',function(){
		deletedRiqianInfo();
	});
	//编辑按钮
	$(".riqianListDetail .riqianEdit").live('click',function(){
		$(".editThisRiqian").removeClass("editThisRiqian");
		$(this).addClass("editThisRiqian");
		$(".riqian_list").hide();
		$(".riqian_create").show();
		getSingleRiqianInfo();
	});
	//价格仅限数据
	$(".riqian_create .riqianprize").live('keyup',function(){
		this.value=this.value.replace(/\D/g,'');
	});
	$(".riqian_create .riqianprize").live('afterpaste',function(){
		this.value=this.value.replace(/\D/g,'')
	});
});
//定义数据

//渲染数据
function riqianListDetail(data){
	$('.riqianListDetail tr:gt(0)').remove();
	for(var x = 0; x < data.data.pageData.length ; x ++){
		$('.riqianListDetail tbody').append('<tr><td>'+data.data.pageData[x].onlineTime+'</td><td>'+data.data.pageData[x].id+'</td><td><img src="'+data.data.pageData[x].checkinPicture+'" alt="" class="riqian_img_show"/></td><td>'+data.data.pageData[x].shareContent+'</td><td><input type="button" value="编辑" class="bluebtn1 riqianEdit" id="'+data.data.pageData[x].id+'"/><br/><br/><input type="button" value="删除" class="redbtn1 riqian_del" id="'+data.data.pageData[x].id+'" /></td></tr>');
	};	
};
	
//根据不同的页码来渲染页面
function onclickriqianPageNum(p){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/checkin/getCheckinList/2.3.0',
		type : 'get',
		dataType : 'json',
		data: {page:p,num:20},
		success : function(data){
			
			riqianListDetail(data);
			
		},
	});
};	
//获取入参，渲染页面
function riqianInfo(){
	//获取入参
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/checkin/getCheckinList/2.3.0',
		type : 'get',
		dataType : 'json',
		data: {page:0,num:20},
		success : function(data){
			if(data.code == 0){
			//创建分页
			$(".riqian_list .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:onclickriqianPageNum
			});
			//渲染页面
			riqianListDetail(data);
			}else{
				alert(data.data.error);
			}
		},
	});
};
//清除数据
function clearRiqianList(){
	$(".riqian_create input").val("");
	$("#riqian_img_cover").attr("src","");
	$(".riqian_create").removeAttr("id");
};
//新建日签
function saveRiqianDetail(){
	if($("#riqian_img_cover").attr('src') == " "){
		alert("日签图不能为空！");
	}else if($.trim($(".riqian_date").val()) == ""){
		alert("日签日期不能为空！");
	}else if($.trim($(".riqian_share").val()) == ""){
		alert("日签分享不能为空！");
	}else{
		var content = $('.riqian_create .editor_content').getArticleEditorData();
		if(!$.isArray(content)){
			alert(content);
			return ;
		}
		//只保留标题和图片
		var finalData = new Array();
		for(var i=0;i<content.length;i++){
			if(content[i].type == 2){
				content[i].type = 1;
			}
			if(content[i].type == 1 || content[i].type == 3 || content[i].type == 5){
				finalData.push(content[i]);
			}
			
		}
		if(finalData.length == 0){
			alert('商品推荐信息不能为空');
		}
		var details = JSON.stringify(finalData);
		console.log(details);
		if($(".riqian_create").attr("id") != "" && typeof($(".riqian_create").attr("id")) != "undefined"){//编辑
			var r = confirm('确定更改该日签？？');
			if(r == true){
				var params={id:$(".riqian_create").attr("id"),onlineTime:$(".riqian_date").val().replace(/\D/g,''),checkinPicture:$("#riqian_img_cover").attr('src'),shareContent:$(".riqian_share").val(),details:details};
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/checkin/updateCheckin/2.3.0',
					type : 'post',
					dataType : 'json',
					data: params,
					success : function(data){
						if(data.code == 0){
							$(".riqian_create").hide();
							$(".riqian_list").show();
							riqianInfo();
							clearRiqianList();
							
						}else{
							alert(data.data.error);
						};
					},
				});
			}
		}else{//新建
			var r = confirm('确定保存该日签？？');
			if(r == true){
				var data={onlineTime:$(".riqian_date").val().replace(/\D/g,''),checkinPicture:$("#riqian_img_cover").attr('src'),shareContent:$(".riqian_share").val(),details:details};
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/checkin/addCheckin/2.3.0',
					type : 'post',
					dataType : 'json',
					data: data,
					success : function(data){
						if(data.code == 0){
							$(".riqian_list").show();
							$(".riqian_create").hide();
							riqianInfo();
							clearRiqianList();
						}else{
							alert(data.data.error);
						};
					},
				});
			};
		};
	};
};
//删除日签
function deletedRiqianInfo(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/checkin/deleteCheckin/2.3.0',
		type : 'post',
		dataType : 'json',
		data: {id:$(".delThisRiqian").attr("id")},
		success : function(data){
			if(data.code == 0){
				$(".delThisRiqian").parent().parent().remove();
				$(".delriqianbox,.allbox").hide();
			}else{
				alert(data.data.error);
			}
		},
	});
};
//获取单个日签信息进行编辑
function getSingleRiqianInfo(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/checkin/getCheckin/2.5.0',
		type : 'get',
		dataType : 'json',
		data: {id:$(".editThisRiqian").attr("id")},
		success : function(data){
			if(data.code == 0){
				$(".riqian_create").attr('id',data.data.id);
				$(".riqian_date").val(data.data.onlineTime);
				$(".riqian_share").val(data.data.shareContent);
				$("#riqian_img_cover").attr('src',data.data.checkinPicture);

				$('.riqian_create .editor_content').createArticleEditor({
					elements: ['title','image','goods','fullScreen'],
					data:data.data.details,//初始化内容
					shouldKeepImage:function(uploadedUrl,width,height){
						var w = parseFloat(width);
						var h = parseFloat(height);
						if(w/h == 690.0/216.0){
							return true;
						}else{
							alert('图片宽高比例错误,图片宽高比必须是690*216');
							return false;
						}
					},
					defaultData:[{type:1,content:''}]//编辑器为空时,默认的元素
				});
			}else{
				alert(data.data.error);
			}
		},
	});
};
//获取日签
function getRiQianAlert(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/checkin/getCheckinDesc/2.3.0',
		type : 'get',
		dataType : 'json',
		data: {},
		success : function(data){
			if(data.code == 0){
				$(".riqianalert_btn").val(data.data);
			}else{
				alert(data.data.error);
			}
		},
	});
};
//渲染数据
function checkUserListDetail(data){
	$('.riqianUserListDetail tr:gt(0)').remove();
	for(var x = 0; x < data.data.pageData.length ; x ++){
		var str='';
		if(data.data.pageData[x].status =='0'){
			str='<td>未发货</td><td><input type="button" value="发货" class="bluebtn1 deliverCheckAward" id="'+data.data.pageData[x].id+'"/></td>';
		}else{
			str='<td>已发货</td><td><input type="button" value="发货" class=""/></td>';

		}
		$('.riqianUserListDetail tbody').append('<tr><td>'+data.data.pageData[x].id+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+data.data.pageData[x].yearMonth+'</td><td>'+data.data.pageData[x].checkinTime+'</td>'+str+'</tr>');
	};	
};
	
//根据不同的页码来渲染页面
function onclickCheckUserPageNum(p){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/checkin/getCheckinFullMonthUserList/2.5.6',
		type : 'get',
		dataType : 'json',
		data: {page:p,num:20,nickName:$(".check_all_month_user_list .check_user_name").val(),startTime:$('.check_all_month_user_list .rustartTime').val().replace(/\D/g,''),endTime:$('.check_all_month_user_list .ruendTime').val().replace(/\D/g,'')},
		success : function(data){
			
			checkUserListDetail(data);
			
		},
	});
};	
//获取入参，渲染页面
function checkUserInfo(){
	//获取入参
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/checkin/getCheckinFullMonthUserList/2.5.6',
		type : 'get',
		dataType : 'json',
		data: {page:0,num:20,nickName:$(".check_all_month_user_list .check_user_name").val(),startTime:$('.check_all_month_user_list .rustartTime').val().replace(/\D/g,''),endTime:$('.check_all_month_user_list .ruendTime').val().replace(/\D/g,'')},
		success : function(data){
			if(data.code == 0){
			//创建分页
			$(".check_all_month_user_list .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:onclickCheckUserPageNum
			});
			//渲染页面
			checkUserListDetail(data);
			}else{
				alert(data.data.error);
			}
		},
	});
};
//奖品发货发货
function deliverCheckAwardFn(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/checkin/deliverCheckinGift/2.5.6',
		type : 'post',
		dataType : 'json',
		data: {id:$(".deliverThisCheckAward").attr("id")},
		success : function(data){
			if(data.code == 0){
				$(".deliverThisCheckAward").parent().prev().html("已发货");
				$(".deliverThisCheckAward").removeClass("bluebtn1").addClass("unclick");
				$(".deliverThisCheckAward").removeClass("deliverAward");
			}else{
				alert(data.data.error);
			}
		},
	});
};