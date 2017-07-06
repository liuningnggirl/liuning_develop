$(function(){

	//新增校园上门美妆服务
	$('.beauty_line_service_school_manage .add_service_school_manage_btn').click(function(){
		clearUniversity();
		$('.beauty_line_service_school_manage').hide();
		$('.add_beauty_line_service_school_manage').show();
	});
	//企业上门美妆服务搜索按钮
	$('.beauty_line_service_school_manage .order-num .search-btn').click(function(){
		loadSchollPage();
	});
	//企业上门美妆服务搜索取消按钮
	$('.beauty_line_service_school_manage .order-num .cancle-btn').click(function(){
		clearUniversitySearch();
		loadSchollPage();
	});
	//企业上门跳转指定页面按钮
	$('.beauty_line_service_school_manage .goto_page_box .goto_page_ok').click(function(){
		if($(".beauty_line_service_school_manage .goto_page_box .goto_redirect_page_num").val() > $(".beauty_line_service_school_manage .goto_page_box").attr("totnum")){
			alert("没有此页");
		}else{
			loadSchollPage($(".beauty_line_service_school_manage .goto_page_box .goto_redirect_page_num").val());
		}
	});
	//点击新增企业上门美妆服务--取消按钮
	$('.add_beauty_line_service_school_manage .cancle_btn').click(function(){
		$('.beauty_line_service_school_manage').show();
		$('.add_beauty_line_service_school_manage').hide();
	});

	//删除某个企业上门服务V3.0.3
	$('.add_service_school_table .btn_del').live('click',function(){
		var btn = $(this);
		var r = confirm('确认要删除该条记录？？');
		if(r == true){
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticOfflineServer/deleteUniversityServer/3.0.3',{id:btn.attr('id')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					btn.parent().parent().remove();
				}else{
					alert(data.data.error);
				}
			});
		};
	});

	//获取学校服务详情V3.0.3
	$('.add_service_school_table .btn_edit').live('click',function(){
		var btn = $(this);
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticOfflineServer/getUniversityServerDetail/3.0.3',{id:btn.attr('id')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.beauty_line_service_school_manage').hide();
				$('.add_beauty_line_service_school_manage').show();
				$('.add_beauty_line_service_school_manage .cityName').val(data.data.cityName);
				$('.add_beauty_line_service_school_manage .universityName').val(data.data.universityName);
				$('.add_beauty_line_service_school_manage .universityAddress').val(data.data.address);
				$('.add_beauty_line_service_school_manage .applicantName').val(data.data.applicantName);
				$('.add_beauty_line_service_school_manage .applicantPhone').val(data.data.applicantPhone);
				$('.add_beauty_line_service_school_manage .apply_type option').each(function(){
					if($(this).attr('value') == data.data.applyType){
						$(this).attr('selected','selected');
					};
				});
				$('.add_beauty_line_service_school_manage .remarks').val(data.data.remarks);
				$('.add_beauty_line_service_school_manage').attr('id',data.data.id);
			}else{
				alert(data.data.error);
			}
		});
		
	});

	//新增／编辑企业上门服务V3.0.3
	$('.add_beauty_line_service_school_manage .save_btn').click(function(){
		if($.trim($(".add_beauty_line_service_school_manage .cityName").val()) == ""){
			alert("城市不能为空");
		}else if($.trim($(".add_beauty_line_service_school_manage .universityName").val()) == ""){
			alert("学校名称不能为空");
		}else if($.trim($(".add_beauty_line_service_school_manage .universityAddress").val()) == ""){
			alert("学校地址不能为空");
		}else if($.trim($(".add_beauty_line_service_school_manage .applicantName").val()) == ""){
			alert("申请人姓名不能为空");
		}else if($.trim($(".add_beauty_line_service_school_manage .applicantPhone").val()) == ""){
			alert("申请人电话不能为空");
		}else if(!isPhoneNum($.trim($(".add_beauty_line_service_school_manage .applicantPhone").val()))){
			alert('手机号格式不正确');
		}else if($(".add_beauty_line_service_school_manage .apply_type option:selected").val() == ""){
			alert("请选择申请形式");
		}else if($.trim($(".add_beauty_line_service_school_manage .remarks").val()) == ""){
			alert("备注不能为空");
		}else{
			if(typeof($('.add_beauty_line_service_school_manage').attr('id')) == 'undefined'){//新增
				var r = confirm('确定要保存？？');
			}else{//编辑
				var r = confirm('确定要更新？？');
			}
		}
		var genData = {
			cityName:$(".add_beauty_line_service_school_manage .cityName").val(),
			universityName:$(".add_beauty_line_service_school_manage .universityName").val(),
			address:$(".add_beauty_line_service_school_manage .universityAddress").val(),
			applicantName:$(".add_beauty_line_service_school_manage .applicantName").val(),
			applicantPhone:$(".add_beauty_line_service_school_manage .applicantPhone").val(),
			applyType:$(".add_beauty_line_service_school_manage .apply_type option:selected").val(),
			remarks:$(".add_beauty_line_service_school_manage .remarks").val(),
			id:$(".add_beauty_line_service_school_manage").attr("id")
		};
		
			if(r == true){
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticOfflineServer/addOrUpdateUniversity/3.0.3',genData,function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						$('.beauty_line_service_school_manage').show();
						$('.add_beauty_line_service_school_manage').hide();
						clearUniversity();
						clearUniversitySearch();
						loadSchollPage();
					}else{
						alert(data.data.error);
					}
				});
			};
		
	});


});

//创建企业上门美妆服务列表分页
function createSchollNextPage(data){
	$("#beauty_line_service_school_manage .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getschoolParams();
			params.page = p;
			$('.beauty_line_service_school_manage .add_service_school_table>tbody>tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticOfflineServer/getUniversityServerList/3.0.3',
				type : 'post',
				dataType : 'json',
				data: params,
				success : initschoolDetail
			});			
		}
	});
}

//初始企业上门美妆服务分页
function initschoolDetail(data){
	$('.beauty_line_service_school_manage .add_service_school_table tr:gt(0)').remove(); //清除原来的表格信息
	$('.beauty_line_service_school_manage .goto_page_box').attr("totnum",data.data.totalPageNum);
	$('.beauty_line_service_school_manage .goto_page_box .totNum').text(data.data.totalNum).css("color","#f00");
	createSchollNextPage(data);
	for(var x = 0; x < data.data.pageData.length ; x ++){
		var applyType='';
		if(data.data.pageData[x].applyType=="1"){
			applyType='个人形式申请';
		}else if(data.data.pageData[x].applyType=="2"){
			applyType='社团形式申请';
		}else if(data.data.pageData[x].applyType=="3"){
			applyType='院级形式申请';
		}else if(data.data.pageData[x].applyType=="4"){
			applyType='校级形式申请';
		}else{
			applyType='';
		}
		$('.beauty_line_service_school_manage .add_service_school_table tbody').append('<tr><td>'+data.data.pageData[x].id+'</td><td>'+new Date(data.data.pageData[x].applyTime).format("yyyy-MM-dd hh:mm:ss")+'</td><td>'+data.data.pageData[x].cityName+'</td><td>'+data.data.pageData[x].universityName+'</td><td>'+data.data.pageData[x].address+'</td><td>'+data.data.pageData[x].applicantName+'</td><td>'+data.data.pageData[x].applicantPhone+'</td><td>'+applyType+'</td><td>'+data.data.pageData[x].remarks+'</td><td><input type="button" name="" value="编辑" id='+data.data.pageData[x].id+' class="btn_edit green"><input type="button" name="" value="删除" class="btn_del red" id='+data.data.pageData[x].id+'></td></tr>');
	}
}

//获取查询参数
function getschoolParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	params.num = 20;
	params.cityName = $.trim($('.beauty_line_service_school_manage .order-num .city_name').val());
	params.universityName = $.trim($('.beauty_line_service_school_manage .order-num .school_name').val());
	params.applicantName = $.trim($('.beauty_line_service_school_manage .order-num .school_apply_name').val());
	params.applicantPhone = $.trim($('.beauty_line_service_school_manage .order-num .school_apply_tel').val());
	params.applyType = $('.beauty_line_service_school_manage .order-num .apply_status option:selected').val();
	return params;
}
        
//加载企业上门美妆服务分页数据
function loadSchollPage(page){
	
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticOfflineServer/getUniversityServerList/3.0.3',
		type : 'post',
		dataType : 'json',
		data: getschoolParams(page),
		success : initschoolDetail,
	});
}
//清除新增编辑申请的数据
function clearUniversity(){
	$(".add_beauty_line_service_school_manage input[type='text']',.add_beauty_line_service_school_manage textarea").val("");
	$(".add_beauty_line_service_school_manage .apply_type option:eq(0)").attr('selected','selected');
	$(".add_beauty_line_service_school_manage").removeAttr("id");
};
//清除搜索的数据
function clearUniversitySearch(){
	$(".beauty_line_service_school_manage .order-num input[type='text']").val("");
	$("#beauty_line_service_school_manage .order-num .apply_status option:eq(0)").attr('selected','selected');
};
//验证手机号
function isPhoneNum(phoneNum){
	var reg = /^1[3|8|7|5|4]\d{9}$/;
	return reg.test(phoneNum);		
}

