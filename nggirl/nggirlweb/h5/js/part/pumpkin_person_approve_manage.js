$(function(){
	//彩妆类——返回
	$('.getTestQuestionDetail_caizhuang .checkpass_return').live('click',function(e) {
		$('#pumpkin_person_approve_manage').show();
		$('.getTestQuestionDetail_caizhuang').hide();
		loadTestListPage();
    });
	
	//护肤类——返回
	$('.getTestQuestionDetail_hufu .checkpass_return').live('click',function(e) {
		$('#pumpkin_person_approve_manage').show();
		$('.getTestQuestionDetail_hufu').hide();
		loadTestListPage();
    });
	
	//搜索
	$('#pumpkin_person_approve_manage .search-btn').click(function(e) {
        loadTestListPage();
    });
	
	//全部取消
	$('.pumpkin_person_approve_manage .cancle-btn').click(function(e) {
		$('.pumpkin_person_approve_manage .order-num .name').val('');
		$('.pumpkin_person_approve_manage .startTime').val('');
		$('.pumpkin_person_approve_manage .endTime').val('');
		$('.pumpkin_person_approve_manage .test_type option:eq(0)').attr('selected','selected');
		$('.pumpkin_person_approve_manage .ischeck_pass option:eq(0)').attr('selected','selected');
        loadTestListPage();
    });
	
	//通过/取消认证V3.0.2
	$('.pumpkin_person_approve_manage .getTestListTable .checkpass,.getTestQuestionDetail_hufu .checkpass,.getTestQuestionDetail_caizhuang .checkpass').live('click',function(e) {
		var btn = $(this);
		if(btn.hasClass('red')){
			var r = confirm('确认要取消认证？？');
			if(r == true){
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/pumpkinexpert/passOrCancel/3.0.2',{baseInfoId:btn.attr('baseInfoId'),isCheckPass:btn.attr('isCheckPass')},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						btn.addClass('green').removeClass('red').attr('value','通过认证').attr('isCheckPass',0);
					}else{
						alert(data.data.error);	
					}
				});
			};
		}else if(btn.hasClass('green')){
			var r = confirm('确认要通过认证？？');
			if(r == true){
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/pumpkinexpert/passOrCancel/3.0.2',{baseInfoId:btn.attr('baseInfoId'),isCheckPass:btn.attr('isCheckPass')},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						btn.removeClass('green').addClass('red').attr('value','取消认证').attr('isCheckPass',1);
					}else{
						alert(data.data.error);	
					}
				});
			};
		};
    });
	
	//查看评测详情V3.0.2
	$('.pumpkin_person_approve_manage .getTestListTable .loo_test_message').live('click',function(e) {
        var btn = $(this);
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/pumpkinexpert/getTestQuestionDetail/3.0.2',{baseInfoId:btn.attr('baseInfoId')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				//判断是否通过验证
				if(data.data.isCheckPass == 0){//0未通过，1已通过
					$('.getTestQuestionDetail_caizhuang').children().remove();
					$('#pumpkin_person_approve_manage').hide();
					$('.getTestQuestionDetail_caizhuang').show();
					for(var x = 0; x < data.data.details.length; x ++){
						$('.getTestQuestionDetail_caizhuang').append('<div class="par"><p class="par_top" style="color:red;">'+data.data.details[x].question+'</p><p class="par_bottom" style="line-height:50px; margin:0 0 0 15px;">'+data.data.details[x].answer+'</p></div>');
					};
					$('.getTestQuestionDetail_caizhuang').append('<input class="checkpass green" type="button" value="通过认证" baseInfoId='+data.data.baseInfoId+' isCheckPass='+data.data.isCheckPass+' />');
					$('.getTestQuestionDetail_caizhuang').append('<input class="checkpass_return green" type="button" value="返回" />');
				};
				if(data.data.isCheckPass == 1){
					$('.getTestQuestionDetail_hufu').children().remove();
					$('#pumpkin_person_approve_manage').hide();
					$('.getTestQuestionDetail_hufu').show();
					for(var x = 0; x < data.data.details.length; x ++){
						$('.getTestQuestionDetail_hufu').append('<div class="par"><p class="par_top" style="color:red;">'+data.data.details[x].question+'</p><p class="par_bottom" style="line-height:50px; margin:0 0 0 15px;">'+data.data.details[x].answer+'</p></div>');
					};
					$('.getTestQuestionDetail_hufu').append('<input class="checkpass red" type="button" value="取消认证" baseInfoId='+data.data.baseInfoId+' isCheckPass='+data.data.isCheckPass+' />');
					$('.getTestQuestionDetail_hufu').append('<input class="checkpass_return green" type="button" value="返回" />');
				};
			}else{
				alert(data.data.error);	
			}
		});
    });
});
//创建作品列表分页
function createTestListPage(data){
	$(".pumpkin_person_approve_manage .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getTestListSearchParams();
			params.page = p;
			$('.pumpkin_person_approve_manage .getTestListTable>tbody>tr:gt(0)').remove();
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/pumpkinexpert/getTestList/3.0.2',
				type : 'post',
				dataType : 'json',
				data: params,
				success : initTestListPage
			});			
		}
	});
}

//初始化作品分页
function initTestListPage(data){
	createTestListPage(data);
	for(var x = 0; x < data.data.pageData.length ; x ++){
		//是否认证通过，0未通过，1已通过
		if(data.data.pageData[x].isCheckPass == 0){
			$('.pumpkin_person_approve_manage .getTestListTable>tbody').append('<tr><td>'+data.data.pageData[x].userId+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+data.data.pageData[x].createTime+'</td><td>'+getTestListFn(data.data.pageData[x].testType)+'</td><td><input type="button" value="通过认证" class="checkpass green" baseInfoId='+data.data.pageData[x].baseInfoId+' isCheckPass='+data.data.pageData[x].isCheckPass+'></td><td><input type="button" value="查看测评" class="loo_test_message green" testType='+data.data.pageData[x].testType+' baseInfoId='+data.data.pageData[x].baseInfoId+' isCheckPass='+data.data.pageData[x].isCheckPass+'></td></tr>');
		};
		if(data.data.pageData[x].isCheckPass == 1){
			$('.pumpkin_person_approve_manage .getTestListTable>tbody').append('<tr><td>'+data.data.pageData[x].userId+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+data.data.pageData[x].createTime+'</td><td>'+getTestListFn(data.data.pageData[x].testType)+'</td><td><input type="button" value="取消认证" class="checkpass red" baseInfoId='+data.data.pageData[x].baseInfoId+' isCheckPass='+data.data.pageData[x].isCheckPass+'></td><td><input type="button" value="查看测评" class="loo_test_message green" testType='+data.data.pageData[x].testType+' baseInfoId='+data.data.pageData[x].baseInfoId+' isCheckPass='+data.data.pageData[x].isCheckPass+'></td></tr>');
		};
	}
}

//获取查询参数
function getTestListSearchParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	params.nickName = $('.pumpkin_person_approve_manage .order-num .name').val();
    var re=new RegExp("[\\-,\\:, ]","g"); 
	if($('.pumpkin_person_approve_manage .startTime').val() != ''){
		var startTime = $('.pumpkin_person_approve_manage .startTime').val().replace(re, "");
		params.startTime = startTime;
	};
	if($('.pumpkin_person_approve_manage .endTime').val() != ''){
		var endTime = $('.pumpkin_person_approve_manage .endTime').val().replace(re, "");
		params.endTime = endTime;
	};
	params.testType = $('.pumpkin_person_approve_manage .test_type option:selected').attr('value');
	params.isCheckPass = $('.pumpkin_person_approve_manage .ischeck_pass option:selected').attr('value');
	return params;
}

//加载作品分页数据
function loadTestListPage(){
	$('.pumpkin_person_approve_manage .getTestListTable>tbody>tr:gt(0)').remove();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/pumpkinexpert/getTestList/3.0.2',
		type : 'post',
		dataType : 'json',
		data: getTestListSearchParams(1),
		success : initTestListPage,
	});
}

//获取测评题类型
function getTestListFn(type){
	if(type == 1){
		return '彩妆类';	
	}else if(type == 2){
		return '护肤类';	
	}
}

