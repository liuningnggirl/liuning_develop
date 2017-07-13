var testUrl = 'https://testcli.nggirl.com.cn';
$(function(){
	listInviteCodess();
//邀请管理
//点击“邀请码管理”--》搜索按钮
	$('.surpercodes .search-btn').click(listInviteCodess);
	
//点击“普通码管理”--》搜索按钮
	$('.commontop .searchcom').click(listInviteCodescom);

//点击“邀请码管理”--》全部取消按钮
	$('.surpercodes .cancle-btn').click(function(e) {
		$('.surpercodes .search.yhq').val('');
		$('.surpercodes .search.creater').val('');
		$('.surpercodes .on-select option:eq(0)').attr('selected','selected');
	});
	
//创建超级邀请码信息
	$('.mcreate-btn').click(function(e) {
		$('.myhq-create .surpercode').val('');
		$('.myhq-create .all-time').val('');
		$('.myhq-create .supremark').val('');
		$('.myhq-list').hide();
        $('.myhq-create').show();
    });	
	
//创建邀请码
	$('.create-myhq').click(function(e) {
		//判断
		if($('.myhq-create .all-time').val() == ''){
			alert('请输入可使用次数');	
		}else if($('.myhq-create .all-time').val() < '0'){
			alert('请输入正确的可使用次数');	
		}
		else{
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/invitecodesuper/createSuperInviteCode',
				type : 'post',
				dataType : 'json',
				data: {"code":$(".surpercode").val(),"allowedTimes":$(".all-time").val(), "comment":$(".supremark").val()},
				success : function(data){
					$('.myhq-create').hide();
					$('.myhq-success').show();
					$('.myhq-success .ys-code').html(data.data.code);
					$('.myhq-success .ys-num').html(data.data.allowedTimes);	
					
				},
			});
		}
	})
	
//<!--  点击--》返回--》返回到邀请码列表 -->	
	$('.return-myhq').click(function(e) {
		$('.myhq-success .ys-num').html('');
		$('.myhq-success .ys-code').children('b').remove();
		$('.myhq-success .ys-code').html('');
		$('.myhq-list').show();
        $('.myhq-create').hide();
    });	
	
//<!--  返回列表 -->
	$('.surper-return').click(function(e) {
		listInviteCodess();
		$('.myhq-success .ys-num').html('');
		$('.myhq-success .ys-code').children('b').remove();
		$('.myhq-success .ys-code').html('');
		$('.myhq-success').hide();
        $('.myhq-create').hide();
        $('.myhq-list').show();
    });
	
//<!--  继续创建 -->
	$('.surper-create').click(function(e) {
		$('.myhq-success .ys-num').html('');
		$('.myhq-success .ys-code').children('b').remove();
		$('.myhq-success .ys-code').html('');
		$('.myhq-success').hide();
        $('.myhq-list').hide();
        $('.myhq-create').show();
		$('.myhq-create .surpercode').val('');
		$('.myhq-create .all-time').val('');
		$('.myhq-create .supremark').val('');
    });
//查看邀请码
	$('.yqm-btn-check').live('click',function(e) {
		$('.myhq-list').hide();
		$(".surperlink").show();
		var superCodeId=$(this).parent().parent().children('td:eq(0)').attr('codeId');
		surpercodeall(superCodeId);	
	});
	
//封装超级邀请码
	function surpercodeall(date){
		$.ajax({
			url : testUrl+'/nggirl-web/web/admin/invitecodesuper/listUnionInviteCodes',
			type : 'get',
			dataType : 'json',
			data: {superCodeId:date},
			success : function(data){
				if(data.code==0){
					$('.surpercode-detail').attr("superCodeId",date);
					$(".surpercode-detail tr:gt(0)").remove();
					for(var x = 0; x < data.data.length ; x ++){
					$('.surpercode-detail').append('<tr superCodeId='+data.data[x].superCodeId+'><td codeId='+data.data[x].commonCodeId+'>'+data.data[x].commonCode+'</td><td>'+data.data[x].productName+'</td><td>'+data.data[x].commonCodeDesc+'</td><td>'+data.data[x].allowedTimes+'</td><td>'+data.data[x].usedTimes+'</td><td>'+data.data[x].comment+'</td><td><input type="button" value="解除" class="canclelink" /></td></tr>');
					}
				}else{
					alert(data.data.error);
				}
			},
		});
	}
	
	//返回超级邀请码列表
	$(".linkback").click(function(){
		$('.myhq-list').show();
		$(".surperlink").hide();
		listInviteCodess();
	});
		
	//为超级邀请码添加关联跳转页
	$(".addlink").click(function(){
		$(".surperlink").hide();
		$('.commoncode').show();
		$('.commoncode .commontop .yhq').val('');
		$('.commoncode .commontop .remark').val('');
		listInviteCodescom();
	});
	
	//普通码页返回按钮
	$(".comlinkback").click(function(){
		$(".surperlink").show();
		$('.commoncode').hide();
		surpercodeall($(".surpercode-detail").attr('superCodeId'));
		});
//添加关联按钮
	$(".addcommonlink").live('click',function(e) {
		var del=$(this);
		$.ajax({
			url : testUrl+'/nggirl-web/web/admin/invitecodesuper/createUnion',
			type : 'post',
			dataType : 'json',
			data: {superCodeId:$(".surpercode-detail").attr('superCodeId'),commonCodeId:$(this).parent().parent().children('td:eq(0)').attr('codeId'),},
			success : function(data){
				if(data.code==0){
					del.val("解除")
					del.removeClass("addcommonlink").addClass("canclecommonlink");
				}else{
					alert(data.data.error);
				}
			}
		})
	})
//邀请码关联列表页解除关联
	$(".canclelink").live('click',function(e) {
		$(".canclecodebox").css("top",$(window).scrollTop()+156);
		$(".canclecodebox,.allbox").show();
		var del=$(this);
		$(".canclecodebox .suredel").unbind();
		$(".canclecodebox .suredel").click(function(){
			$(".canclecodebox,.allbox").hide();
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/invitecodesuper/deleteUnion',
				type : 'post',
				dataType : 'json',
				data: {superCodeId:$(".surpercode-detail").attr('superCodeId'),commonCodeId:del.parent().parent().children('td:eq(0)').attr('codeId'),},
				success : function(data){
					if(data.code==0){
						del.parent().parent().remove();
					}else{
						alert(data.data.error);
					}
				}
			});
		});
		$(".canclecodebox .notdel").unbind();
		$(".canclecodebox  .notdel").click(function(){
			$(".canclecodebox ,.allbox").hide();
		});
	});
//普通码列表页解除关联
	$(".canclecommonlink").live('click',function(e) {
		$(".canclecodebox").css("top",$(window).scrollTop()+156);
		$(".canclecodebox,.allbox").show();
		var del=$(this);
		$(".canclecodebox .suredel").unbind();
		$(".canclecodebox .suredel").click(function(){
		$(".canclecodebox,.allbox").hide();
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/invitecodesuper/deleteUnion',
				type : 'post',
				dataType : 'json',
				data: {superCodeId:$(".surpercode-detail").attr('superCodeId'),commonCodeId:del.parent().parent().children('td:eq(0)').attr('codeId'),},
				success : function(data){
					if(data.code==0){
						del.val("添加");
						del.removeClass("canclecommonlink").addClass("addcommonlink");
					}else{
						alert(data.data.error);
					}
				}
			});
		});
		$(".canclecodebox  .notdel").unbind();
		$(".canclecodebox  .notdel").click(function(){
			$(".canclecodebox,.allbox ").hide();
		});
	});

//删除邀请码
	$('.yqm-btn-dels').live('click',function(e) {
		$(".confirmdel").css("top",$(window).scrollTop()+156);
		$(".confirmdel,.allbox").show();
		var del=$(this);
		$(".confirmdel .suredel").click(function(){
			$(".confirmdel,.allbox").hide();
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/invitecodesuper/deleteSuperInviteCode',
				type : 'post',
				dataType : 'json',
				data: {codeId:del.parent().parent().children('td:eq(0)').attr('codeId')},
				success : function(data){
					if(data.code==0){
						del.parent().parent().remove();
					}else{
						alert(data.data.error);
					}
				},
			});
		});
		$(".confirmdel .notdel").click(function(){
			$(".confirmdel,.allbox").hide();
		});
    });
});

function  getDatas(page,code,comment,creatorName){
	var data = new Object();
	data.page = page;
	data.code = code;
	data.comment = comment;
	data.creatorName = creatorName;
	return data;	
}

//搜索的数据
function genDatas(){
	return getDatas(
	1,$('.surpercodes .order-num .yhq').val(),$('.surpercodes .order-num .remark').val(),$('.surpercodes .order-num .creater').val()
	);
}

//渲染数据
function sresolvePage(data){
	$('.scode-detail tr:gt(0)').remove();
	for(var x = 0; x < data.data.pageData.length ; x ++){
		$('.scode-detail').append('<tr><td codeId='+data.data.pageData[x].codeId+'>'+data.data.pageData[x].code+'</td><td>'+data.data.pageData[x].unionNum+'</td><td>'+data.data.pageData[x].allowedTimes+'</td><td>'+data.data.pageData[x].usedTimes+'</td><td>'+data.data.pageData[x].comment+'</td><td>'+data.data.pageData[x].creatorName+'</td><td><input type="button" value="查看" class="yqm-btn-check" /></td><td><input type="button" value="删除" class="yqm-btn-dels" /></td></tr>');
		
	}
}

//根据不同的页码来渲染页面
function onClickPageNums(p){
	var data = genDatas();
	data.page = p;
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/invitecodesuper/listSuperInviteCodes',
		type : 'get',
		dataType : 'json',
		data: data,
		success : function(data){
			sresolvePage(data);
		},
	});
}

//获取入参，渲染页面
function listInviteCodess(){
	//获取入参
	var data = genDatas();
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/invitecodesuper/listSuperInviteCodes',
		type : 'get',
		dataType : 'json',
		data: data,
		success : function(data){
			//创建分页
			$(".surpercodes .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:onClickPageNums
			});
			
			//渲染页面
			sresolvePage(data);
		},
	});
}
//普通码分页
	function  getData1(page,superCodeId,commonCode,productName){
		var data = new Object();
		data.page = page;
		data.superCodeId = superCodeId;
		data.commonCode = commonCode;
		data.productName = productName;
		return data;	
	}
	//搜索的数据
	function genData1(){
		return getData1(
		1,$(".surpercode-detail").attr('superCodeId'),$('.commoncode .commontop .yhq').val(),$('.commoncode .commontop .remark').val()
		);
	}
	
	//渲染数据
	//获取普通码列表
	function commoncodelist(data){
		if(data.code==0){
			$(".commoncode-detail tr:gt(0)").remove();
			$('.commoncode-detail').attr("superCodeId",$(".surpercode-detail").attr('superCodeId'));
			for(var x = 0; x < data.data.pageData.length ; x ++){
				if(data.data.pageData[x].isUnion== '1'){
			    	$('.commoncode-detail').append('<tr codeId='+data.data.pageData[x].superCodeId+'><td codeId='+data.data.pageData[x].commonCodeId+'>'+data.data.pageData[x].commonCode+'</td><td>'+data.data.pageData[x].productName+'</td><td>'+data.data.pageData[x].commonCodeDesc+'</td><td>'+data.data.pageData[x].allowedTimes+'</td><td>'+data.data.pageData[x].usedTimes+'</td><td>'+data.data.pageData[x].comment+'</td><td><input type="button" value="解除" class="canclecommonlink" /></td></tr>');
					}else if(data.data.pageData[x].isUnion== '0'){
						$('.commoncode-detail').append('<tr codeId='+data.data.pageData[x].superCodeId+'><td codeId='+data.data.pageData[x].commonCodeId+'>'+data.data.pageData[x].commonCode+'</td><td>'+data.data.pageData[x].productName+'</td><td>'+data.data.pageData[x].commonCodeDesc+'</td><td>'+data.data.pageData[x].allowedTimes+'</td><td>'+data.data.pageData[x].usedTimes+'</td><td>'+data.data.pageData[x].comment+'</td><td><input type="button" value="添加" class="addcommonlink" /></td></tr>');
						}
		        }
		}else{
			alert(data.data.error);
		}
			
	}
	
	//根据不同的页码来渲染页面
	function onClickPageNumcom(p){
		var data = genData1();
		data.page = p;
		$.ajax({
			url : testUrl+'/nggirl-web/web/admin/invitecodesuper/listCommonInviteCodes',
			type : 'get',
			dataType : 'json',
			data: data,
			success : function(data){
				commoncodelist(data);
			},
		});
	}
	
	//获取入参，渲染页面
	function listInviteCodescom(){
		//获取入参
		var data = genData1();
		$.ajax({
			url : testUrl+'/nggirl-web/web/admin/invitecodesuper/listCommonInviteCodes',
			type : 'get',
			dataType : 'json',
			data: data,
			success : function(data){
				//创建分页
				$(".commoncode .tcdPageCode").createPage({
					pageCount:parseInt(data.data.totalPageNum),
					current:parseInt(data.data.currnetPageNum),
					backFn:onClickPageNumcom
				});
				
				//渲染页面
				commoncodelist(data);
			},
		});
	}