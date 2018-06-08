$(function(){
	//全部取消
	$('.electricity_supplier_branch_manage .cancle-btn').click(function(e) {
        clearesbSearch();
		esbPageDetail();
    });
	
	//新增商品
	$('.electricity_supplier_branch_manage .add_esg_btn').click(function(){
		$('.electricity_supplier_branch_manage').hide();
		$('.electricity_supplier_branch_manage_branch_create').show();
		clearBrandMessage();
	});
	
	//新增／编辑品牌信息V3.1.0
	$('.electricity_supplier_branch_manage_branch_create .electricity_supplier_branch_manage_branch_create_btn .save_btn').click(function(e) {
		var id = '';
		if($.trim($(".electricity_supplier_branch_manage_branch_create .country_name").val()) == ''){
			alert('所属国家不能为空！！');
		}else if($.trim($(".electricity_supplier_branch_manage_branch_create .brand_name").val()) == ''){
			alert('品牌名称不能为空！！');
		}else if($.trim($(".electricity_supplier_branch_manage_branch_create .brand_introduce").val()) == ''){
			alert('品牌介绍不能为空！！');
		}else if(typeof($('.electricity_supplier_branch_manage_branch_create .brandImg').attr('src')) == 'undefined'){
			alert('品牌图片不能为空！！');
		}else{
			//判断brandId是否存在，存在则是新增，不存在则是修改
			if(typeof($('.electricity_supplier_branch_manage_branch_create').attr('brandId')) == 'undefined'){//新增
				var r = confirm('确认要新增品牌？？');
				id = '';
			}else{//更新
				var r = confirm('确认要更新品牌？？');
				id = $('.electricity_supplier_branch_manage_branch_create').attr('brandId');
			}
			if(r == true){
				var paramData = {
					id:id,
					brandName:$.trim($(".electricity_supplier_branch_manage_branch_create .brand_name").val()),
					country:$.trim($(".electricity_supplier_branch_manage_branch_create .country_name").val()),
					brandDesc:$.trim($(".electricity_supplier_branch_manage_branch_create .brand_introduce").val()),
					brandImg:$('.electricity_supplier_branch_manage_branch_create .brandImg').attr('src')
				};
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/addOrUpdateBrand/3.1.0',paramData,function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						esbPageDetail();
						$('.electricity_supplier_branch_manage').show();
						$('.electricity_supplier_branch_manage_branch_create').hide();
					}else{
						alert(data.data.error);	
					}
				});
			};
		}
    });
	
	//取消
	$('.electricity_supplier_branch_manage_branch_create .electricity_supplier_branch_manage_branch_create_btn .return_btn').click(function(e) {
		clearBrandMessage();
		$('.electricity_supplier_branch_manage').show();
		$('.electricity_supplier_branch_manage_branch_create').hide();
    });
	
	//全选
	$('.electricity_supplier_branch_manage #electricity_supplier_branch_manage_select_all').click(function(e) {
		if(typeof($(this).attr('checked')) != 'undefined'){
			$('.electricity_supplier_branch_manage .esb_table tbody tr').each(function(index, element) {
				if($(this).children('td:eq(0)').children("input[type='checkbox']")){
					$(this).children('td:eq(0)').children("input[type='checkbox']").attr('checked','checked');
				}
			});
		}else{
			$('.electricity_supplier_branch_manage .esb_table tbody tr').each(function(index, element) {
				if($(this).children('td:eq(0)').children("input[type='checkbox']")){
					$(this).children('td:eq(0)').children("input[type='checkbox']").removeAttr('checked');
				}
			});
		}
    });
	
	//获取品牌详情V3.1.0
	$('.electricity_supplier_branch_manage .esb_table .esb_table_edit').live('click',function(e) {
		var btn = $(this);
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getBrandDetail/3.1.0',{brandId:btn.attr('brandId')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$(".electricity_supplier_branch_manage_branch_create").attr('brandId',btn.attr('brandId'));
				$(".electricity_supplier_branch_manage_branch_create .brand_name").val(data.data.brandName);
				$(".electricity_supplier_branch_manage_branch_create .country_name").val(data.data.country);
				$(".electricity_supplier_branch_manage_branch_create .brand_introduce").val(data.data.brandDesc);
				$('.electricity_supplier_branch_manage_branch_create .brandImg').attr('src',data.data.brandImg);
				$('.electricity_supplier_branch_manage').hide();
				$('.electricity_supplier_branch_manage_branch_create').show();
			}else{
				alert(data.data.error);	
			}
		});
    });
	
	//删除商品品牌V3.1.0
	$('.electricity_supplier_branch_manage .del-btn').click(function(e) {
		var brandIds = '';
		$('.electricity_supplier_branch_manage .esb_table>tbody>tr').each(function(index, element) {
			if(typeof($(this).children('td:eq(0)').children("input[type='checkbox']").attr('checked')) !='undefined'){
				brandIds += $(this).attr('brandId')+',';
			};
        });
		brandIds = brandIds.substring(0,brandIds.length -1);
		var btn = $(this);
		var r = confirm('确认要删除该品牌信息？？');
		if(r == true){
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/deleteBrand/3.1.0',{brandIds:brandIds},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					esbPageDetail();
				}else{
					alert(data.data.error);	
				}
			});
		};
    });
	
	//新增品牌图
	$(".electricity_supplier_branch_manage_branch_create .branch_img").fileupload({
		dataType: 'json',
		done: function (e, data) {
			var w = parseFloat(data.result.data.width);
			var h = parseFloat(data.result.data.height);
			if(w/h != 360.0/360.0){
				alert("上传失败！图片比例应为360*360");
			}else{
				$('.electricity_supplier_branch_manage_branch_create .brandImg').attr('src',data.result.data.url);
			}
		}
	});
	
	//品牌列表搜索按钮
	$('.electricity_supplier_branch_manage .order-num .search-btn').click(function(){
		esbPageDetail();
	});

	//跳转指定页面按钮
	$('.electricity_supplier_branch_manage .goto_page_box .goto_page_ok').click(function(){
		if($(".electricity_supplier_branch_manage .goto_page_box .goto_redirect_page_num").val() > $(".electricity_supplier_branch_manage .goto_page_box").attr("totnum")){
			alert("没有此页");
		}else{
			esbPageDetail($(".electricity_supplier_branch_manage .goto_page_box .goto_redirect_page_num").val());
		}
	});
});

//创建获取品牌列表V3.1.0列表分页
function createesbPage(data){
	$("#electricity_supplier_branch_manage .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = esbSearchParams();
			params.page = p;
			$('.electricity_supplier_branch_manage .esb_table>tbody>tr').remove(); //清除原来的表格信息
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getItemBrandList/3.1.0',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initesbPage
			});			
		}
	});
}

//初始化获取品牌列表V3.1.0分页
function initesbPage(data){
	$('.electricity_supplier_branch_manage .esb_table>tbody>tr').remove(); //清除原来的表格信息
	$('.electricity_supplier_branch_manage .esb_table .redirect_page .all_commonts_redirect_page_num').val('');
	$('.electricity_supplier_branch_manage .goto_page_box').attr("totnum",data.data.totalPageNum);
	$('.electricity_supplier_branch_manage .goto_page_box .totNum').text(data.data.totalNum).css("color","#f00");
	createesbPage(data)
	for(var x = 0; x < data.data.pageData.length ; x ++){
		$('.electricity_supplier_branch_manage .esb_table tbody').append('<tr brandId='+data.data.pageData[x].brandId+'><td><input type="checkbox" style="vertical-align: text-bottom;" />'+data.data.pageData[x].brandId+'</td><td>'+data.data.pageData[x].brandName+'</td><td>'+data.data.pageData[x].country+'</td><td><img src="'+data.data.pageData[x].brandImg+'" style="width:50px; height:50px;" alt="" /></td><td>'+data.data.pageData[x].itemNum+'</td><td><div class="esb_table_edit" brandId='+data.data.pageData[x].brandId+'><img src="images/modify_icon.png" alt="" style=" width:20px;vertical-align: bottom;" /> 编辑</div></td></tr>');
	}
}

//获取查询参数
function esbSearchParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	params.brandId = $.trim($('.electricity_supplier_branch_manage .order-num .brand_id').val());
	params.brandName = $.trim($('.electricity_supplier_branch_manage .order-num .brand_name').val());
	params.country = $.trim($('.electricity_supplier_branch_manage .order-num .brand_city').val());
	return params;
}
        
//加载品牌列表V3.1.0分页数据
function esbPageDetail(page){
	$('.electricity_supplier_branch_manage #electricity_supplier_branch_manage_select_all').removeAttr('checked');
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getItemBrandList/3.1.0',
		type : 'get',
		dataType : 'json',
		data: esbSearchParams(page),
		success : initesbPage,
	});
}

//清除搜索的数据
function clearesbSearch(){
	$(".electricity_supplier_branch_manage .order-num input[type='text']").val("");
};

//清除品牌款信息
function clearBrandMessage(){
	$(".electricity_supplier_branch_manage_branch_create").removeAttr('brandId');
	$(".electricity_supplier_branch_manage_branch_create .brand_name").val('');
	$(".electricity_supplier_branch_manage_branch_create .country_name").val('');
	$(".electricity_supplier_branch_manage_branch_create .brand_introduce").val('');
	$('.electricity_supplier_branch_manage_branch_create .brandImg').removeAttr('src');
}
