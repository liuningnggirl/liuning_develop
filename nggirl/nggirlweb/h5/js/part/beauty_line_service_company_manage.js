$(function(){

	//新增企业上门美妆服务
	$('.beauty_line_service_company_manage .add_service_company_manage_btn').click(function(){
		clearEnterprise();
		$('.beauty_line_service_company_manage').hide();
		$('.add_beauty_line_service_company_manage').show();
	});
	//企业上门美妆服务搜索按钮
	$('.beauty_line_service_company_manage .order-num .search-btn').click(function(){
		loadOfflineServerPage();
	});
	//企业上门美妆服务搜索取消按钮
	$('.beauty_line_service_company_manage .order-num .cancle-btn').click(function(){
		clearEnterpriseSearch();
		loadOfflineServerPage();
	});
	//企业上门跳转指定页面按钮
	$('.beauty_line_service_company_manage .goto_page_box .goto_page_ok').click(function(){
		if($(".beauty_line_service_company_manage .goto_page_box .goto_redirect_page_num").val() > $(".beauty_line_service_company_manage .goto_page_box").attr("totnum")){
			alert("没有此页");
		}else{
			loadOfflineServerPage($(".beauty_line_service_company_manage .goto_page_box .goto_redirect_page_num").val());
		}
	});
	//点击新增企业上门美妆服务--取消按钮
	$('.add_beauty_line_service_company_manage .cancle_btn').click(function(){
		$('.beauty_line_service_company_manage').show();
		$('.add_beauty_line_service_company_manage').hide();
	});

	//删除某个企业上门服务V3.0.3
	$('.beauty_line_service_company_table .btn_del').live('click',function(){
		var btn = $(this);
		var r = confirm('确认要删除该条记录？？');
		if(r == true){
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticOfflineServer/deleteEnterpriseServer/3.0.3',{id:btn.attr('id')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					btn.parent().parent().remove();
				}else{
					alert(data.data.error);
				}
			});
		};
	});

	//获取企业服务详情V3.0.3
	$('.beauty_line_service_company_table .btn_edit').live('click',function(){
		var btn = $(this);
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticOfflineServer/getEnterpriseServerDetail/3.0.3',{id:btn.attr('id')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.beauty_line_service_company_manage').hide();
				$('.add_beauty_line_service_company_manage').show();
				$('.add_beauty_line_service_company_manage .city_name').val(data.data.cityName);
				$('.add_beauty_line_service_company_manage .company_name').val(data.data.enterpriseName);
				$('.add_beauty_line_service_company_manage .company_address').val(data.data.address);
				$('.add_beauty_line_service_company_manage .apply_name').val(data.data.applicantName);
				$('.add_beauty_line_service_company_manage .apply_tel').val(data.data.applicantPhone);
				$('.add_beauty_line_service_company_manage .apply_type option').each(function(){
					if($(this).attr('value') == data.data.applyType){
						$(this).attr('selected','selected');
					};
				});
				$('.add_beauty_line_service_company_manage .serve_time').val(data.data.serverTime);
				$('.add_beauty_line_service_company_manage .remarks').val(data.data.remarks);
				$('.add_beauty_line_service_company_manage').attr('id',data.data.id);
			}else{
				alert(data.data.error);
			}
		});
		
	});

	//新增／编辑企业上门服务V3.0.3
	$('.add_beauty_line_service_company_manage .save_btn').click(function(){
		if($.trim($(".add_beauty_line_service_company_manage .city_name").val()) == ""){
			alert("城市不能为空");
		}else if($.trim($(".add_beauty_line_service_company_manage .company_name").val()) == ""){
			alert("企业名称不能为空");
		}else if($.trim($(".add_beauty_line_service_company_manage .company_address").val()) == ""){
			alert("企业地址不能为空");
		}else if($.trim($(".add_beauty_line_service_company_manage .apply_name").val()) == ""){
			alert("申请人姓名不能为空");
		}else if($.trim($(".add_beauty_line_service_company_manage .apply_tel").val()) == ""){
			alert("申请人电话不能为空");
		}else if(!isPhoneNum($.trim($(".add_beauty_line_service_company_manage .apply_tel").val()))){
			alert('手机号格式不正确');
		}else if($(".add_beauty_line_service_company_manage .apply_type option:selected").val() == ""){
			alert("请选择申请形式");
		}else if($.trim($(".add_beauty_line_service_company_manage .serve_time").val()) == ""){
			alert("服务时间不能为空");
		}else if($.trim($(".add_beauty_line_service_company_manage .remarks").val()) == ""){
			alert("备注不能为空");
		}else{
			if(typeof($('.add_beauty_line_service_company_manage').attr('id')) == 'undefined'){//新增
				var r = confirm('确定要保存？？');
			}else{//编辑
				var r = confirm('确定要更新？？');
			}
		}
		var genData = {
			cityName:$(".add_beauty_line_service_company_manage .city_name").val(),
			enterpriseName:$(".add_beauty_line_service_company_manage .company_name").val(),
			address:$(".add_beauty_line_service_company_manage .company_address").val(),
			applicantName:$(".add_beauty_line_service_company_manage .apply_name").val(),
			applicantPhone:$(".add_beauty_line_service_company_manage .apply_tel").val(),
			applyType:$(".add_beauty_line_service_company_manage .apply_type option:selected").val(),
			serverTime:$(".add_beauty_line_service_company_manage .serve_time").val(),
			remarks:$(".add_beauty_line_service_company_manage .remarks").val(),
			id:$(".add_beauty_line_service_company_manage").attr("id")
		};
		
			if(r == true){
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticOfflineServer/addOrUpdateEnterprise/3.0.3',genData,function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						$('.beauty_line_service_company_manage').show();
						$('.add_beauty_line_service_company_manage').hide();
						clearEnterprise();
						clearEnterpriseSearch();
						loadOfflineServerPage();
					}else{
						alert(data.data.error);
					}
				});
			};
		
	});


});

//创建企业上门美妆服务列表分页
function createOfflineServerPage(data){
	$("#beauty_line_service_company_manage .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getOfflineServerSearchParams();
			params.page = p;
			$('.beauty_line_service_company_manage .beauty_line_service_company_table>tbody>tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticOfflineServer/getEnterpriseServerList/3.0.3',
				type : 'post',
				dataType : 'json',
				data: params,
				success : initOfflineServerPage
			});			
		}
	});
}

//初始企业上门美妆服务分页
function initOfflineServerPage(data){
	$('.beauty_line_service_company_manage .beauty_line_service_company_table tr:gt(0)').remove(); //清除原来的表格信息
	$('.beauty_line_service_company_manage .beauty_line_service_company_table .redirect_page .all_commonts_redirect_page_num').val('');
	$('.beauty_line_service_company_manage .goto_page_box').attr("totnum",data.data.totalPageNum);
	$('.beauty_line_service_company_manage .goto_page_box .totNum').text(data.data.totalNum).css("color","#f00");
	createOfflineServerPage(data)
	for(var x = 0; x < data.data.pageData.length ; x ++){
		var applyType='';
		if(data.data.pageData[x].applyType=="1"){
			applyType='个人形式申请';
		}else if(data.data.pageData[x].applyType=="2"){
			applyType='部门形式申请';
		}else if(data.data.pageData[x].applyType=="3"){
			applyType='企业形式申请';
		}else{
			applyType='';
		}
		$('.beauty_line_service_company_manage .beauty_line_service_company_table tbody').append('<tr><td>'+data.data.pageData[x].id+'</td><td>'+new Date(data.data.pageData[x].applyTime).format("yyyy-MM-dd hh:mm:ss")+'</td><td>'+data.data.pageData[x].cityName+'</td><td>'+data.data.pageData[x].enterpriseName+'</td><td>'+data.data.pageData[x].address+'</td><td>'+data.data.pageData[x].applicantName+'</td><td>'+data.data.pageData[x].applicantPhone+'</td><td>'+applyType+'</td><td>'+data.data.pageData[x].serverTime+'</td><td>'+data.data.pageData[x].remarks+'</td><td><input type="button" name="" value="编辑" id='+data.data.pageData[x].id+' class="btn_edit green"><input type="button" name="" value="删除" class="btn_del red" id='+data.data.pageData[x].id+'></td></tr>');
	}
}

//获取查询参数
function getOfflineServerSearchParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	params.num = 20;
	params.cityName = $.trim($('.beauty_line_service_company_manage .order-num .city_name').val());
	params.enterpriseName = $.trim($('.beauty_line_service_company_manage .order-num .company_name').val());
	params.applicantName = $.trim($('.beauty_line_service_company_manage .order-num .apply_name').val());
	params.applicantPhone = $.trim($('.beauty_line_service_company_manage .order-num .apply_tel').val());
	params.applyType = $('.beauty_line_service_company_manage .order-num .apply_status option:selected').val();
	params.startTime = $.trim($('.beauty_line_service_company_manage .order-num .start').val());
	params.endTime = $.trim($('.beauty_line_service_company_manage .order-num .end').val());
	return params;
}
        
//加载企业上门美妆服务分页数据
function loadOfflineServerPage(page){
	
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/cosmeticOfflineServer/getEnterpriseServerList/3.0.3',
		type : 'post',
		dataType : 'json',
		data: getOfflineServerSearchParams(page),
		success : initOfflineServerPage,
	});
}
//清除新增编辑申请的数据
function clearEnterprise(){
	$(".add_beauty_line_service_company_manage input[type='text']',.add_beauty_line_service_company_manage textarea").val("");
	$(".add_beauty_line_service_company_manage .apply_type option:eq(0)").attr('selected','selected');
	$(".add_beauty_line_service_company_manage").removeAttr("id");
};
//清除搜索的数据
function clearEnterpriseSearch(){
	$(".beauty_line_service_company_manage .order-num input[type='text']").val("");
	$("#beauty_line_service_company_manage .order-num .apply_status option:eq(0)").attr('selected','selected');
};

