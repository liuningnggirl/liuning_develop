var testUrl = 'https://testcli.nggirl.com.cn';
$(function(){
	All_cancel_Fn();
	getItemStatInfo();
	comming_write();
	getOptionalLabelAndBuyerReading1();
	//参数选择
	$('.add_electricity_supplier_goods_manage .esg_box .canshubox .canshu,.add_electricity_supplier_goods_manage .esg_box .canshubox .down').live("click",function(){
		$(this).parent().parent().css("z-index","11");
		$('.add_electricity_supplier_goods_manage .esg_box  .canshubox input[type="checkbox"]').attr("checked",false);
		$(this).siblings("ul").slideToggle("fast",function(){
			if ($(this).is(':hidden')) {
				$(this).parent().parent().css("z-index","10");
			}else{
				$(".add_electricity_supplier_goods_manage .esg_box .canshubox .canshulist").not(this).hide();
				$(".add_electricity_supplier_goods_manage .esg_box .canshubox").css("z-index","10");
				$(this).parent().parent().css("z-index","11");
				

			}
		});
	});
	
	$('.add_electricity_supplier_goods_manage .esg_box .canshubox .canshulist li.checkcanshu input').live("click",function(){
		$(this).parent().parent().parent().css("z-index","10");
		$(this).parent().parent().toggle();
		$(this).parent().parent().siblings("input").val($(this).parent().text());

	});
	$('.add_electricity_supplier_goods_manage .esg_box .canshubox .canshulist li.custom input[type="checkbox"]').live("click",function(){
		if($(this).siblings().val()!=""){
			$(this).parent().parent().parent().css("z-index","10");
			$(this).parent().parent().toggle();
			$(this).parent().parent().siblings("input").val($(this).siblings().val());
		}else{
			return false;
		}
	});
	//标签选择
	$('.add_electricity_supplier_goods_manage .esg_box .canshubox .canshu2').live("click",function(){//根据参数调用数据
		var str='<li value="1" class="checkcanshu">保湿1<input type="checkbox"></li><li value="2" class="checkcanshu">美白1<input type="checkbox"></li><li value="3" class="checkcanshu">祛痘<input type="checkbox"></li><li class="custom"><input type="text" placeholder="其他" class="canshudetail2"><input type="checkbox"></li>';
		$(".canshulist1").html(str);
	});
	//新增属性
	$('.add_electricity_supplier_goods_manage .esg_box .add_new_canshu').live("click",function(){
		var str='';
		var del=$(this);
		str=del.prev().clone();
		str.children(".boxnum").html(parseInt(str.children(".boxnum").html())+1);
		str.children("div").children(".canshu").val('');
		$(this).before(str);

	});
	
	//添加展示位图片
	$('.add_electricity_supplier_goods_manage .outImgBox .goodsShowImg .fileimg').fileupload({
		dataType: 'json',
		done: function (e, data) {
			var w = parseFloat(data.result.data.width);
			var h = parseFloat(data.result.data.height);
			if(w/h != 360.0/360.0){
				alert("上传失败！图片比例应为360*360");
			}else{
				$(this).siblings("img.currentimg").attr('src',data.result.data.url);
			}
		}
	});
	//添加购买须知图片
	$('.add_electricity_supplier_goods_manage .beforeBuy .buyKnowFile').live('click',function(){
		$(".changThis").removeClass("changThis");
		$(this).siblings("img.buy_file_img").addClass("changThis");
		$('.add_electricity_supplier_goods_manage .beforeBuy .buy_file').click();
	});
	//添加购买须知图片
	$('.add_electricity_supplier_goods_manage .beforeBuy .buy_file').fileupload({
		dataType: 'json',
		done: function (e, data) {
			if(data.result.code == 0){
				$(".changThis").attr('src',data.result.data.url);
			}else{
				alert(data.data.error);	
			}
		}
	});
	//添加商品头图图片
	$('.add_electricity_supplier_goods_manage .outImgBox .currentimg').live('click',function(){
		$(".changThis").removeClass("changThis");
		$(this).addClass("changThis");
		$('.add_electricity_supplier_goods_manage .outImgBox  .fileimgs').click();
	});
	
	//添加商品头图图片
	$('.add_electricity_supplier_goods_manage .outImgBox .fileimgs').fileupload({
		dataType: 'json',
		done: function (e, data) {
			var w = parseFloat(data.result.data.width);
			var h = parseFloat(data.result.data.height);
			if(w/h >=1){
				alert("上传失败！高度应大于等于宽度");
			}else{
				$(".changThis").attr('src',data.result.data.url);
				
			}
		}
	});
	//添加商品头图图片框
	$('.add_electricity_supplier_goods_manage .outImgBox .addImgBox').live("click",function(){
		var str='';
		str='<div class="innerImgBox bannerImg"><img src="" class="currentimg"><img src="../common/images/ele-del.png" class="delImgBox"></div>';
		$(this).before(str);
	});
	//删除商品头图图片框
	$('.add_electricity_supplier_goods_manage .outImgBox .bannerImg .delImgBox').live("click",function(){
		$(this).parent().remove();
	});
	//进行编辑商品属性
	$('.add_electricity_supplier_goods_manage .esg_box .shuxingEditBox img').live("click",function(){
		if($(this).siblings("input.shuxing1").attr("readonly")){
			$(this).siblings("input.shuxing1").removeAttr("readonly");
		}else{
			$(this).siblings("input.shuxing1").attr("readonly","true");
		}
		
	});
	//新增单个编辑商品属性
	$('.add_electricity_supplier_goods_manage .esg_box .shuxingBox .addShuxingBox').live("click",function(){
		var str='';
		str='<div class="shuxingEditBox"><input type="checkbox" class="check1"><input type="text" readonly="true" class="shuxing1"><img src="../common/images/img_xiugai.png"></div>';
		$(this).before(str);
	});
	//新增整个编辑商品属性
	$('.add_electricity_supplier_goods_manage .esg_box .shuxingBox .addNewShuxing').live("click",function(){
		var str='';
		str='<div class="shuxingBox1"><input type="text" name=""  class="esg esg_title" placeholder="请输入商品属性"><p class="del_btn">批量删除商品属性</p><br/><div class="shuxingBox2"><div class="shuxingEditBox"><input type="checkbox"  class="check1"><input type="text" readonly="true" class="shuxing1"><img src="../common/images/img_xiugai.png"></div><img src="../common/images/u2188.png" class="addShuxingBox"></div></div>';
        $(this).before(str);
	});
	//批量删除商品属性
	$('.add_electricity_supplier_goods_manage .esg_box .shuxingBox .shuxingBox1 .del_btn').live("click",function(){
		var delDet=$(this).siblings(".shuxingBox2").children(".shuxingEditBox").children("input.check1[checked]");
		var delDet1=$(this).siblings(".shuxingBox2").children(".shuxingEditBox").children("input.check1");
		
		if($(delDet).length > 0){
			var r=confirm("确定删除被选中的商品属性？");
		}
		if(r==true){
			if($(delDet).length ==$(delDet1).length){
				$(this).parent().remove();
			}
			$(delDet).each(function(){
				$(this).parent().remove();
			})
		}
	});
	//商品属性表格上方属性删除
	$('.add_electricity_supplier_goods_manage .esg_box .goodsMessage .goodsSize .del_btn').live("click",function(){
		$(this).parent().remove();
	});
	//商品属性表格删除
	$('.add_electricity_supplier_goods_manage .esg_box .goodsMessage .goodsMessage_table .del_btn').live("click",function(){
		$(this).parent().parent().remove();
	});
	//勾选可购买与不可购买
	$('.add_electricity_supplier_goods_manage .esg_box .goodsMessage .checkbox1').live("click",function(){
		$(this).attr("checked","checked").siblings(".checkbox1").removeAttr("checked");
	});
	//勾选可售后与不可售后
	$('.add_electricity_supplier_goods_manage .esg_box .goodsMessage .checkbox4').live("click",function(){
		$(this).attr("checked","checked").siblings(".checkbox4").removeAttr("checked");
	});
	//勾选快递
	$('.add_electricity_supplier_goods_manage .esg_box .beforeBuy .knowDescCheck .checkDesc').live("click",function(){
		$(this).attr("checked","checked").siblings(".checkDesc").removeAttr("checked");
		
	});

	//选择某一地区
	$('.add_electricity_supplier_goods_manage .esg_box .deliveryMessage .checkDelivery').live("click",function(){
		$(this).attr("checked","checked").parent().siblings(".dtitle").children(".checkDelivery").removeAttr("checked");
	});
	//新增商品
	$('.electricity_supplier_goods_manage .add_esg_btn').click(function(){
		clearesg();
		$('.electricity_supplier_goods_manage').hide();
		$('.add_electricity_supplier_goods_manage').show();
		$('.electricity_supplier_goods_manage .goosDesc .editor_content').createArticleEditor();
		$('.electricity_supplier_goods_manage .needKnowDesc .editor_content').createArticleEditor();
		//初始化编辑器
		$('.add_electricity_supplier_goods_manage .goosDesc .editor_content').createArticleEditor({
			elements: ['title','paragraph','image'],
			data:[{type:2,content:''}],//初始化内容
			defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
		});
		//初始化编辑器
		$('.add_electricity_supplier_goods_manage .needKnowDesc .editor_content').createArticleEditor({
			elements: ['title','paragraph','image'],
			data:[{type:2,content:''}],//初始化内容
			defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
		});
	});
	//商品搜索按钮
	$('.electricity_supplier_goods_manage .order-num .search-btn').click(function(){
		esgPageDetail();
	});
	//商品搜索取消按钮
	$('.electricity_supplier_goods_manage .order-num .cancle-btn').click(function(){
		clearesgSearch();
		esgPageDetail();
	});
	//企业上门跳转指定页面按钮
	$('.electricity_supplier_goods_manage .goto_page_box .goto_page_ok').click(function(){
		if($(".electricity_supplier_goods_manage .goto_page_box .goto_redirect_page_num").val() > $(".electricity_supplier_goods_manage .goto_page_box").attr("totnum")){
			alert("没有此页");
		}else{
			esgPageDetail($(".electricity_supplier_goods_manage .goto_page_box .goto_redirect_page_num").val());
		}
	});
	//点击新增商品--取消按钮
	$('.add_electricity_supplier_goods_manage .cancle_btn').click(function(){
		$('.electricity_supplier_goods_manage').show();
		$('.add_electricity_supplier_goods_manage').hide();
	});

	//删除某个企业上门服务V3.0.3
	$('.esg_table .btn_del').live('click',function(){
		var btn = $(this);
		var r = confirm('确认要删除该条记录？？');
		if(r == true){
			$.post(testUrl+'/nggirl-web/web/admin/cosmeticOfflineServer/deleteEnterpriseServer/3.0.3',{id:btn.attr('id')},function(data){
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
	$('.esg_table .btn_edit').live('click',function(){
		var btn = $(this);
		$.get(testUrl+'/nggirl-web/web/admin/cosmeticOfflineServer/getEnterpriseServerDetail/3.0.3',{id:btn.attr('id')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.electricity_supplier_goods_manage').hide();
				$('.add_electricity_supplier_goods_manage').show();
				$('.add_electricity_supplier_goods_manage .city_name').val(data.data.cityName);
				$('.add_electricity_supplier_goods_manage .company_name').val(data.data.enterpriseName);
				$('.add_electricity_supplier_goods_manage .company_address').val(data.data.address);
				$('.add_electricity_supplier_goods_manage .apply_name').val(data.data.applicantName);
				$('.add_electricity_supplier_goods_manage .apply_tel').val(data.data.applicantPhone);
				$('.add_electricity_supplier_goods_manage .apply_type option').each(function(){
					if($(this).attr('value') == data.data.applyType){
						$(this).attr('selected','selected');
					};
				});
				$('.add_electricity_supplier_goods_manage .serve_time').val(data.data.serverTime);
				$('.add_electricity_supplier_goods_manage .remarks').val(data.data.remarks);
				$('.add_electricity_supplier_goods_manage').attr('id',data.data.id);
			}else{
				alert(data.data.error);
			}
		});
		
	});

	//新增／编辑企业上门服务V3.0.3
	$('.add_electricity_supplier_goods_manage .save_btn').click(function(){
		if($.trim($(".add_electricity_supplier_goods_manage .city_name").val()) == ""){
			alert("城市不能为空");
		}else if($.trim($(".add_electricity_supplier_goods_manage .company_name").val()) == ""){
			alert("企业名称不能为空");
		}else if($.trim($(".add_electricity_supplier_goods_manage .company_address").val()) == ""){
			alert("企业地址不能为空");
		}else if($.trim($(".add_electricity_supplier_goods_manage .apply_name").val()) == ""){
			alert("申请人姓名不能为空");
		}else if($.trim($(".add_electricity_supplier_goods_manage .apply_tel").val()) == ""){
			alert("申请人电话不能为空");
		}else if(!isPhoneNum($.trim($(".add_electricity_supplier_goods_manage .apply_tel").val()))){
			alert('手机号格式不正确');
		}else if($(".add_electricity_supplier_goods_manage .apply_type option:selected").val() == ""){
			alert("请选择申请形式");
		}else if($.trim($(".add_electricity_supplier_goods_manage .serve_time").val()) == ""){
			alert("服务时间不能为空");
		}else if($.trim($(".add_electricity_supplier_goods_manage .remarks").val()) == ""){
			alert("备注不能为空");
		}else{
			if(typeof($('.add_electricity_supplier_goods_manage').attr('id')) == 'undefined'){//新增
				var r = confirm('确定要保存？？');
			}else{//编辑
				var r = confirm('确定要更新？？');
			}
		}
		var genData = {
			cityName:$(".add_electricity_supplier_goods_manage .city_name").val(),
			enterpriseName:$(".add_electricity_supplier_goods_manage .company_name").val(),
			address:$(".add_electricity_supplier_goods_manage .company_address").val(),
			applicantName:$(".add_electricity_supplier_goods_manage .apply_name").val(),
			applicantPhone:$(".add_electricity_supplier_goods_manage .apply_tel").val(),
			applyType:$(".add_electricity_supplier_goods_manage .apply_type option:selected").val(),
			serverTime:$(".add_electricity_supplier_goods_manage .serve_time").val(),
			remarks:$(".add_electricity_supplier_goods_manage .remarks").val(),
			id:$(".add_electricity_supplier_goods_manage").attr("id")
		};
		
			if(r == true){
				$.post(testUrl+'/nggirl-web/web/admin/cosmeticOfflineServer/addOrUpdateEnterprise/3.0.3',genData,function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						$('.electricity_supplier_goods_manage').show();
						$('.add_electricity_supplier_goods_manage').hide();
						clearesg();
						clearesgSearch();
						esgPageDetail();
					}else{
						alert(data.data.error);
					}
				});
			};
		
	});


});

//创建商品列表分页
function createesgPage(data){
	$("#electricity_supplier_goods_manage .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getesgSearchParams();
			params.page = p;
			$('.electricity_supplier_goods_manage .esg_table>tbody>tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/cosmeticOfflineServer/getEnterpriseServerList/3.0.3',
				type : 'post',
				dataType : 'json',
				data: params,
				success : initesgPage
			});			
		}
	});
}

//初始商品分页
function initesgPage(data){
	$('.electricity_supplier_goods_manage .esg_table tr:gt(0)').remove(); //清除原来的表格信息
	$('.electricity_supplier_goods_manage .esg_table .redirect_page .all_commonts_redirect_page_num').val('');
	$('.electricity_supplier_goods_manage .goto_page_box').attr("totnum",data.data.totalPageNum);
	$('.electricity_supplier_goods_manage .goto_page_box .totNum').text(data.data.totalNum).css("color","#f00");
	createesgPage(data)
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
		$('.electricity_supplier_goods_manage .esg_table tbody').append('<tr><td>'+data.data.pageData[x].id+'</td><td>'+new Date(data.data.pageData[x].applyTime).format("yyyy-MM-dd hh:mm:ss")+'</td><td>'+data.data.pageData[x].cityName+'</td><td>'+data.data.pageData[x].enterpriseName+'</td><td>'+data.data.pageData[x].address+'</td><td>'+data.data.pageData[x].applicantName+'</td><td>'+data.data.pageData[x].applicantPhone+'</td><td>'+applyType+'</td><td>'+data.data.pageData[x].serverTime+'</td><td>'+data.data.pageData[x].remarks+'</td><td><input type="button" name="" value="编辑" id='+data.data.pageData[x].id+' class="btn_edit green"><input type="button" name="" value="删除" class="btn_del red" id='+data.data.pageData[x].id+'></td></tr>');
	}
}

//获取查询参数
function getesgSearchParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	params.num = 20;
	params.cityName = $.trim($('.electricity_supplier_goods_manage .order-num .city_name').val());
	params.enterpriseName = $.trim($('.electricity_supplier_goods_manage .order-num .company_name').val());
	params.applicantName = $.trim($('.electricity_supplier_goods_manage .order-num .apply_name').val());
	params.applicantPhone = $.trim($('.electricity_supplier_goods_manage .order-num .apply_tel').val());
	params.applyType = $('.electricity_supplier_goods_manage .order-num .apply_status option:selected').val();
	params.startTime = $.trim($('.electricity_supplier_goods_manage .order-num .start').val());
	params.endTime = $.trim($('.electricity_supplier_goods_manage .order-num .end').val());
	return params;
}
        
//加载商品分页数据
function esgPageDetail(page){
	
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/cosmeticOfflineServer/getEnterpriseServerList/3.0.3',
		type : 'post',
		dataType : 'json',
		data: getesgSearchParams(page),
		success : initesgPage,
	});
}
//清除新增编辑申请的数据
function clearesg(){
	$(".add_electricity_supplier_branch_manage input.esg',.add_electricity_supplier_branch_manage textarea").val("");
	$(".add_electricity_supplier_branch_manage select option:eq(0)").attr('selected','selected');
	$(".add_electricity_supplier_branch_manage").removeAttr("id");
};
//清除搜索的数据
function clearesgSearch(){
	$(".electricity_supplier_goods_manage .order-num input[type='text']").val("");
	$("#electricity_supplier_goods_manage .order-num .apply_status option:eq(0)").attr('selected','selected');
};


 /*清除搜索信息*/
function All_cancel_Fn(){
		$(".electricity_supplier_goods_manage .search_input_fillin input[type='text']").val('');
		$(".electricity_supplier_goods_manage .search_input_second input[type='text']").val('');
		$(".input_focus_click").removeAttr("categoryId");
		$(".orderByStr").attr("value","-1");
		$(".main_body_table_main").removeAttr("page");
	}

/*商品统计信息：就上面的数量填写*/
	function getItemStatInfo(){
		$.get(testUrl+'/nggirl-web/web/admin/item/getItemStatInfo/3.1.0',function(data){
			var data=$.parseJSON(data);
			var str='<span class="pointer_common" statusCode="0">'
					+'<span class="Altogether_goods">总商品</span>:'
					+'<span class="Altogether_goods_number color_common">'+data.data.totalNum+'</span>'
				+'</span>'
				+'<span class="pointer_common" statusCode="1">'
					+'<span class="Conduct_showing_goods">在售中商品</span>:'
					+'<span class="Conduct_showing_goods_number color_common">'+data.data.onSaleNum+'</span>'
				+'</span>'
				+'<span class="pointer_common" statusCode="2">'
					+' <span class="wating_margincall_goods">待补仓商品</span>:'
					+'<span class="wating_margincall_goods_number color_common">'+data.data.coverNum+'</span>'
				+'</span>'
				+'<span class="pointer_common" statusCode="3">'
					+'<span class="Forsale_goods">待售商品</span>:'
					+'<span class="Forsale_goods_number color_common">'+data.data.forSaleNum+'</span>'
				+'</span>'
				+'<span class="pointer_common" statusCode="4">'
					+'<span class="Plantingrass_goods">种草商品</span>:'
					+'<span class="Plantingrass_goods_number color_common">'+data.data.seedingNum+'</span>'
				+'</span>'
				+'<span class="pointer_common" statusCode="5">'
					+'<span class="forbid_shop_goods">未上架不可购买商品</span>:'
					+'<span class="forbid_shop_goods_number color_common">'+data.data.putOffNum+'</span>'
				+'</span>'
				+'<span class="pointer_common" statusCode="6">'
					+'<span class="Expired_goods">保质期逾期商品</span>:'
					+'<span class="Expired_goods_number color_common">'+data.data.pastDueNum+'</span>'
				+'</span>'
			$(".electricity_adopt_find").html("")
			$(".electricity_adopt_find").html(str)
		})
	}
//初始化购买须知
function needKnowDetail(){
		$('.editor_contents').createArticleEditor({
			elements: ['paragraph'],
			data:[{type:2,content:''}],//初始化内容
			defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
		});
};
function needKnowDetail1(del,buyerReading){
	console.log(buyerReading);
	for(var i=0;i<del;i++){
		$('.editor_content'+i+'').createArticleEditor({
			elements: ['paragraph'],
			data:buyerReading[i].detail,//初始化内容
			defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
		});
	}
};

