
$(function(){
//商品管理
	var ldq=new LocalStorageDeque('pageRestoreStacks');
//搜索按钮>
	$(".creategoods_btn").live('click',function(){
		clearGoodsList();
		if($(".backBranchList").css('display')== "none"){
			var pageInfo = new PageInfo(".goods_list");
			ldq.push(pageInfo);
			$(".goods_create .chooseBranch").removeAttr('disabled');
		}else{
			var pageInfo = new PageInfo(".goods_list,.backBranchList");
			ldq.push(pageInfo);
			$(".goods_create .chooseBranch").val($(".lookThisBranch").parent("td").parent("tr").children("td:eq(4)").html());
			$(".goods_create .chooseBranch").attr('brandId',$(".lookThisBranch").parent("td").parent("tr").children("td:eq(0)").html());
			if(typeof($('.goods_create').attr('comodityId')) == "undefined"){
				$(".goods_create .chooseBranch").removeAttr('disabled');
			};
		}
		$(".goods_list,.backBranchList").hide();
		$(".goods_create").show();
		
	});
	//新增商品图
	$(".goods_little_img").fileupload({
		dataType: 'json',
		done: function (e, data) {
			var w = parseFloat(data.result.data.width);
			var h = parseFloat(data.result.data.height);
			if(w/h != 76.0/76.0){
				alert("上传失败！图片比例应为76*76");
			}else{
				$('.goodsupflie').attr('src',data.result.data.url);
			}
		}
	});
	//新增品牌图
	$(".branch_img").fileupload({
		dataType: 'json',
		done: function (e, data) {
			var w = parseFloat(data.result.data.width);
			var h = parseFloat(data.result.data.height);
			if(w/h != 76.0/76.0){
				alert("上传失败！图片比例应为76*76");
			}else{
				$('.brandImg').attr('src',data.result.data.url);
			}
			
		}
	});
	//新增商品头图
	$(".goods_head_img").fileupload({
		dataType: 'json',
		done: function (e, data) {
			var w = parseFloat(data.result.data.width);
			var h = parseFloat(data.result.data.height);
			if(w/h != 360.0/240.0){
				alert("上传失败！图片比例应为360*240");
			}else{
				$('#goods_head_img').attr('src',data.result.data.url);
			}	
		}
	});
	//新增作品
	$(".goodssave").live('click',function(){
		saveGoodsDetail(ldq);
	});
	//返回列表页
	$(".goodsbacklist").live('click',function(){
		var previousPage = ldq.pop();
		var str = previousPage._name;
		$(str).show();
		//$(".goods_list").show();
		$(".goods_create").hide();
		goodsInfo();
		clearGoodsList();
	});
	//取消删除
	$(".delgoodsbox .notdel").live('click',function(){
		$(".delgoodsbox,.allbox").hide();
	});
	//搜索shangpin
	$(".goods_list .searchgoods_btn").live('click',function(){
		var del=$(this);
		goodsInfo();
	});
	//清空搜索内容
	$(".goods_list .allgoods_btn").live('click',function(){
		$(".comodityClass,.comodityBrand,.comodityCountry,.comodityName,.createUserId").val("");
		goodsInfo();
	});
	//搜索品牌
	$(".branch_list .search_branch_btn").live('click',function(){
		branchInfo();
	});
	//清空品牌搜索内容
	$(".branch_list .qx_branch_btn").live('click',function(){
		$(".branch_list .BrandName,.branch_list .BrandCountry").val("");
		branchInfo();
	});
	//删除按钮
	$(".goodsListDetail .goods_del").live('click',function(){
		$(".delThisGoods").removeClass("delThisGoods");
		$(this).addClass("delThisGoods");
		$(".delgoodsbox,.allbox").show();
	});
	//确认删除
	$(".delgoodsbox .suredel").live('click',function(){
		deletedGoodsInfo();
	});
	//商品编辑按钮
	$(".goodsListDetail .goodsEdit").live('click',function(){
		$('.goods_create').attr('comodityId',$(this).attr('comodityId'))
		$(".editThisGoods").removeClass("editThisGoods");
		$(this).addClass("editThisGoods");
		if($(".backBranchList").css('display')== "none"){
			var pageInfo = new PageInfo(".goods_list");
			ldq.push(pageInfo);
			$(".goods_create .chooseBranch").removeAttr('disabled');
		}else{
			var pageInfo = new PageInfo(".goods_list,.backBranchList");
			ldq.push(pageInfo);
			$(".goods_create .chooseBranch").attr('disabled','disabled');
		}
		$(".goods_list,.backBranchList").hide();
		$(".goods_create").show();
		getSingleGoodsInfo();
	});

	//点击新增容量价格
	$(".goods_create .add_new_rj").live('click',function(){
		$(".goods_create .add_new_rj").before($(".goods_create .rj_box:first").clone());
		$(".goods_create .rj_box:last").children().val("");
		$(".goods_create .rj_box:last").append('<span class="rj_del">删除</span>');
		$(this).addClass("add_new_rjs");
	});
	$(".rj_del").live('click',function(){
		$(this).parent().remove();
		if($(".rj_box").length == 1){
			$(".goods_create .add_new_rj").removeClass("add_new_rjs");
		}
	});
	//查看种草
	$(".zhangCao").live('click',function(){
		if($(".backBranchList").css('display')== "none"){
			var pageInfo = new PageInfo(".goods_list");
			ldq.push(pageInfo);
		}else{
			var pageInfo = new PageInfo(".goods_list,.backBranchList");
			ldq.push(pageInfo);
		}
		$(".goods_list,.backBranchList").hide();
		$(".zhangCaoDetail").show();
		$(".lookThisDetail").removeClass("lookThisDetail");
		$(this).addClass("lookThisDetail");
		getCollectedList();
	});
	//商城管理商品查看种草
	$(".look_changchao_number").live('click',function(){
		var pageInfo = new PageInfo(".electricity_supplier_goods_manage");
		ldq.push(pageInfo);
		
		$(".electricity_supplier_goods_manage").hide();
		$(".goods_manages").show();
		$(".zhangCaoDetail").show().siblings().hide();
		$(".lookThisDetail").removeClass("lookThisDetail");
		$(this).addClass("lookThisDetail");
		getCollectedList();
	});
	//种草页返回
	$(".backGoodsList").live('click',function(){
		var previousPage = ldq.pop();
		var str = previousPage._name;
		$(str).show();
		$(this).parent().hide();
	});
	//切换商品和品牌
	$(".goods_list_tab").live('click',function(){
		$(".goods_list .goods_search input[type='text']").val("");
		$(".branch_list .goodsLook ").removeClass("lookThisBranch");
		$(".goods_list").show().siblings(".branch_list").hide();
		goodsInfo();
	});
	$(".branch_list_tab").live('click',function(){
		$(".branch_list").show().siblings(".goods_list").hide();
		branchInfo();
	});
	//搜索取消按钮
	$(".qx_branch_btn").live('click',function(){
		$(".branch_list .BrandName,.branch_list .BrandCountry").val("");
		branchInfo();
	});
	//新增品牌
	$(".create_branch_btn").live('click',function(){
		$(".branch_list").hide();
		$(".branch_create").show();
	});
	//创建品牌页返回按钮
	$(".branch_create .branchBack").live('click',function(){
		$(".branch_list").show();
		$(".branch_create").hide();
	});
	//品牌删除按钮
	$(".branchListDetail .branch_del").live('click',function(){
		$(".delThisBrand").removeClass("delThisBrand");
		$(this).addClass("delThisBrand");
		var r = confirm('确定删除该品牌信息？？');
		if(r == true){
			deletedBranchInfo();
		}
	});
	//品牌保存按钮
	$(".branchSave").live('click',function(){
		saveBranchDetail();
	});
	//品牌编辑按钮
	$(".branch_list .branchEdit").live('click',function(){
		$(".editThisBranch").removeClass("editThisBranch");
		$(this).addClass("editThisBranch");
		getSingleBranchInfo();
	});
	//品牌查看商品详情
	$(".branch_list .goodsLook").live('click',function(){
		var pageInfo = new PageInfo(".goods_list .goods_search .comodityBrand,.goods_list .goods_search .comodityCountry,.tab_goods,.branch_list");
		ldq.push(pageInfo);
		$(".lookThisBranch").removeClass("lookThisBranch");
		$(this).addClass("lookThisBranch");
		$(".goods_list,.backBranchList").show();
		goodsInfo();
		$(".goods_list .goods_search .comodityBrand,.goods_list .goods_search .comodityCountry,.tab_goods,.branch_list").hide();
		$(".goods_list .goods_search input[type='text']").val("");
	});
	//商品列表页返回品牌列表页
	$(".backBranchList").live('click',function(){
		var previousPage = ldq.pop();
		var str = previousPage._name;
		$(str).show();
		$(".goods_list,.backBranchList").hide();
	});
	//查看某个帖子或日签的详细种草人
	$(".lookZhongCaoUser").live('click',function(){
		var pageInfo = new PageInfo(".zhangCaoDetail");
		ldq.push(pageInfo);
		var del = $(this);
		getCollectUserList(del);
	});
	//品牌检索
	$(".chooseBranch").live('keyup',function(){
		if($(this).val() != ""){
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/comodity/searchBrand/2.5.0',
				type : 'get',
				dataType : 'json',
				data: {brandName:$(".chooseBranch").val()},
				success : function(data){
					$(".searchResult").show();
					$(".searchResult p").remove();
					for(var i= 0; i<data.data.length; i++){
						$(".searchResult").append('<p brandId='+data.data[i].brandId+'>'+data.data[i].brandName+'</p>')
						if($(".chooseBranch").val() == data.data[i].brandName){
							$(".chooseBranch").attr('brandId',data.data[i].brandId);
						};
					};
				},
			});
		}else{
			$(".searchResult").hide();
			$(".chooseBranch").removeAttr('brandId');
		}
	});



	
	//失焦
	$(document).on("click", "*", function(){
		$(".searchResult").hide();
	});
	$(".chooseBranch").live('click',function(){
		if($(this).val() != ""){
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/comodity/searchBrand/2.5.0',
				type : 'get',
				dataType : 'json',
				data: {brandName:$(".chooseBranch").val()},
				success : function(data){
					$(".searchResult").show();
					$(".searchResult p").remove();
					for(var i= 0; i<data.data.length; i++){
						$(".searchResult").append('<p brandId='+data.data[i].brandId+'>'+data.data[i].brandName+'</p>')
					};
					
					return false;
				},
			});
		}else{
			$(".searchResult").hide();
			$(".chooseBranch").removeAttr('brandId');
		}
		
	});
	
	//选择品牌
	$(".searchResult p").live('click',function(){
		$(".chooseBranch").val($(this).text());
		$(".chooseBranch").attr('brandId',$(this).attr('brandId'));
		$(".searchResult p").remove();
		$(".searchResult ").hide();
		return false;
	});
	$(".goods_search .sortType").live('change',function(){
		goodsInfo();
	});
});
//定义数据

function  getgoodsData(comodityClass,comodityBrand,comodityCountry,comodityName,page,num,sortType,createUser,brandId){
	var data = new Object();
	data.comodityClass = comodityClass;
	data.comodityBrand = comodityBrand;
	data.comodityCountry = comodityCountry;
	data.comodityName = comodityName;
	data.page = page;
	data.num = num;
	data.sortType = sortType;
	data.createUser = createUser;
	data.brandId = brandId;
	return data;	
};

//商品搜索的数据
function goodsData(){
	return getgoodsData(
	$('.goods_list .comodityClass').val(),$('.goods_list .comodityBrand').val(),$('.goods_list .comodityCountry').val(),$('.goods_list .comodityName').val(),0,20,$(".sortType").val(),$(".createUserId").val(),$('.lookThisBranch').attr('brandId')
	);
};
//渲染数据
function goodsListDetail(data){
	$('.goodsListDetail tr:gt(0)').remove();
	for(var x = 0; x < data.data.pageData.length ; x ++){
		$('.goodsListDetail tbody').append('<tr><td>'+data.data.pageData[x].comodityId+'</td><td>'+data.data.pageData[x].createUser+'</td><td>'+data.data.pageData[x].createTime+'</td><td>'+data.data.pageData[x].lastModifyUser+'</td><td>'+data.data.pageData[x].lastModifyTime+'</td><td><img src='+data.data.pageData[x].photo+' alt="" class="goodsImg"/></td><td>'+data.data.pageData[x].comodityCountry+'</td><td>'+data.data.pageData[x].comodityBrand+'</td><td>'+data.data.pageData[x].comodityClass+'</td><td>'+data.data.pageData[x].comodityName+'</td><td>'+data.data.pageData[x].refPrice+'</td><td>'+data.data.pageData[x].seedNum+'<br/><input type="button" value="查看详情" class="bluebtn1 zhangCao" comodityId='+data.data.pageData[x].comodityId+' /></td><td>'+data.data.pageData[x].tb_detail_url+'</td><td><input type="button" value="编辑" class="bluebtn1 goodsEdit" comodityId='+data.data.pageData[x].comodityId+' /><br/><br/><input type="button" value="删除" class="redbtn1 goods_del" comodityId='+data.data.pageData[x].comodityId+' /></td></tr>');
	};
	if(data.data.pageData.length == 0){
		$('.goodsListDetail tbody').append('<tr><td class="h20"></td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td></tr><tr><td class="h20"></td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td></tr>');
	}
};
	
//根据不同的页码来渲染页面
function onclickGoodsPageNum(p){
	var data = goodsData();
	data.page = p;
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/comodity/list/2.5.6',
		type : 'get',
		dataType : 'json',
		data: data,
		success : function(data){
			goodsListDetail(data);
		},
	});
};
//商品获取入参，渲染页面
function goodsInfo(){
	var data = goodsData();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/comodity/list/2.5.6',
		type : 'get',
		dataType : 'json',
		data: data,
		success : function(data){
			if(data.code == 0){
			//创建分页
			$(".goods_list .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:onclickGoodsPageNum
			});
			//渲染页面
			goodsListDetail(data);
			}else{
				alert(data.data.error);
			}
		},
	});
};
//清除数据
function clearGoodsList(){
	$(".goods_create input,.goods_create textarea").val("");
	$(".goodsupflie,#goods_head_img,#brandImg").removeAttr("src");
	$(".goods_create").removeAttr("comodityId");
	$(".goods_create .rj_box:gt(0)").remove();
};
//品牌定义数据

function  getBranchData(brandName,country,page,num){
	var data = new Object();
	data.brandName = brandName;
	data.country = country;
	data.page = page;
	data.num = num;
	return data;	
};

//品牌搜索的数据
function branchData(){
	return getBranchData(
	$('.branch_list .BrandName').val(),$('.branch_list .BrandCountry').val(),0,20
	);
};
//品牌渲染数据
function branchListDetail(data){
	$('.branchListDetail tr:gt(0)').remove();
	var　str='';
	for(var x = 0; x < data.data.pageData.length ; x ++){
		str += '<tr><td>'+data.data.pageData[x].brandId+'</td><td>'+data.data.pageData[x].createUser+'</td><td>'+data.data.pageData[x].lastModifyUser+'</td><td>'+data.data.pageData[x].lastModifyTime+'</td><td>'+data.data.pageData[x].brandName+'</td><td>'+data.data.pageData[x].country+'</td><td>';
		if(data.data.pageData[x].brandImg != ''){
			str += '<img src="'+data.data.pageData[x].brandImg+'" />';
		}
		str += '</td><td>'+data.data.pageData[x].productNum+'</td><td><input type="button" value="编辑" class="bluebtn1 branchEdit" brandId='+data.data.pageData[x].brandId+' /><input type="button" value="查看商品" class="bluebtn1 goodsLook" brandId='+data.data.pageData[x].brandId+' /><input type="button" value="删除" class="redbtn1 branch_del" brandId='+data.data.pageData[x].brandId+' /></td></tr>';
		
	};
	$('.branchListDetail tbody').append(str);
};
	
//品牌根据不同的页码来渲染页面
function onclickBranchPageNum(p){
	var data = branchData();
	data.page = p;
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/comodity/getBrandList/2.5.6',
		type : 'get',
		dataType : 'json',
		data: data,
		success : function(data){
			
			branchListDetail(data);
			
		},
	});
};
//品牌获取入参，渲染页面
function branchInfo(){
	var data = branchData();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/comodity/getBrandList/2.5.6',
		type : 'get',
		dataType : 'json',
		data: data,
		success : function(data){
			if(data.code == 0){
			//创建分页
			$(".branch_list .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:onclickBranchPageNum
			});
			//渲染页面
			branchListDetail(data);
			}else{
				alert(data.data.error);
			}
		},
	});
};
//品牌清除数据
function clearBranchList(){
	$(".branch_create input,.branch_create textarea").val("");
	$(".branch_create .brandImg").removeAttr("src");
	$(".branch_create").removeAttr("branchId");
};
//新建、编辑商品
function saveGoodsDetail(ldq){
	if(typeof($(".goods_create #goods_head_img").attr('src')) == "undefined"){
		alert("商品头图不能为空！");
	}else if($.trim($(".goods_create .chooseBranch").attr("brandId")) == ""){
		alert("请选择品牌名！");
	}else if(Number($(".goods_create .tuiJianDu").val()) >10.0){
		alert("推荐度不能超过10!");
	}else if(!$(".goods_create .tuiJianDu").val().match(/^\d+(\.\d+)?$/) && $(".goods_create .tuiJianDu").val() != ""){
		alert("推荐度为数值！");	
	}else if($.trim($(".goods_create .goodsType").val()) == ""){
		alert("商品类别不能为空！");	
	}else if(typeof($(".goods_create .goodsupflie").attr('src')) == "undefined"){
		alert("商品图不能为空！");
	}else if($.trim($(".goods_create .goodsname").val()) == ""){
		alert("商品名称不能为空！");
	}else if($.trim($('.goods_create .goodsprize:eq(0)').val())==''){
		alert("价格不能为空！");
	}else{
		var data = new Array();
		for(var i =0; i < $(".goods_create .rl_input").length; i ++){
			var elem = new Object();
			if(/*$('.goods_create .rl_input:eq('+i+')').val()!='' && */$('.goods_create .goodsprize:eq('+i+')').val()!=''){
				elem.volume = $('.goods_create .rl_input:eq('+i+')').val();
				elem.price = $('.goods_create .goodsprize:eq('+i+')').val();
			}/*else if($('.goods_create .rl_input:eq('+i+')').val()=='' && $('.goods_create .goodsprize:eq('+i+')').val()==''){
			}else{
				alert("容量与价格需成对填写！");
				return false;
			}*/
			data.push(elem);
		};
		var standard = JSON.stringify(data);
		var data={comodityId:$(".goods_create").attr('comodityId'),brandId:$(".chooseBranch").attr('brandId'),recommendation:$(".tuiJianDu").val(),productClass:$(".goodsType").val(),productImg:$(".goodsupflie").attr('src'),productName:$(".goodsname").val(),productDesc:$(".goods_create .productDesc").val(),detailImg:$("#goods_head_img").attr('src'),standard:standard,tb_detail_url:$(".goods_create .tb_detail_url").val(),tb_item_id:$(".goods_create .tb_item_id").val()};
		//console.log(data);
		if($(".goods_create").attr("comodityid") != "" && typeof($(".goods_create").attr("comodityid")) != "undefined"){
			var r = confirm('确定更新商品信息？？');
		}else{
			var r = confirm('确定保存商品信息？？');
		}
		if(r == true){
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/comodity/addOrEdit/2.5.0',
				type : 'post',
				dataType : 'json',
				data: data,
				success : function(data){
					if(data.code == 0){
						/*var previousPage = ldq.pop();
						var str = previousPage._name;
						$(str).show();
						//$(".goods_list").show();
						$(".goods_create").hide();
						goodsInfo();*/
						alert("保存成功！");
						clearGoodsList();
					}else{
						alert(data.data.error);
					};
				},
			});
		};
	};
};
//新建、编辑品牌
function saveBranchDetail(){
	if($.trim($(".branch_create .branch_country").val()) == ""){
		alert("所属国家不能为空！");
	}else if($.trim($(".branch_create .branch_name").val()) == ""){
		alert("品牌名不能为空！");
	}else {
		var data={brandId:$(".branch_create").attr('brandId'),brandName:$(".branch_create .branch_name").val(),country:$(".branch_create .branch_country").val(),brandDesc:$(".brand_intro").val(),brandImg:$(".branch_create  .brandImg").attr('src')};
		//console.log(data);
		if($(".branch_create").attr("branchId") != "" && typeof($(".branch_create").attr("branchId")) != "undefined"){
			var r = confirm('确定更新品牌信息？？');
		}else{
			var r = confirm('确定保存品牌信息？？');
		}
		if(r == true){
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/comodity/addOrEditBrand/2.5.0',
				type : 'post',
				dataType : 'json',
				data: data,
				success : function(data){
					if(data.code == 0){
						$(".branch_list").show();
						$(".branch_create").hide();
						branchInfo();
						clearBranchList();
					}else{
						alert(data.data.error);
					};
				},
			});
		};
	};
};
//删除商品
function deletedGoodsInfo(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/comodity/delete/2.4.2',
		type : 'post',
		dataType : 'json',
		data: {comodityId:$(".delThisGoods").attr("comodityId")},
		success : function(data){
			if(data.code == 0){
				$(".delThisGoods").parent().parent().remove();
				$(".delgoodsbox,.allbox").hide();
			}else{
				alert(data.data.error);
			}
		},
	});
};
//删除品牌
function deletedBranchInfo(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/comodity/deleteBrand/2.5.0',
		type : 'post',
		dataType : 'json',
		data: {brandId:$(".delThisBrand").attr("brandId")},
		success : function(data){
			if(data.code == 0){
				$(".delThisBrand").parent().parent().remove();
			}else{
				alert(data.data.error);
			}
		},
	});
};
//获取商品编辑列表
function getSingleGoodsInfo(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/comodity/get/2.5.0',
		type : 'get',
		dataType : 'json',
		data: {comodityId:$(".editThisGoods").attr("comodityId")},
		success : function(data){
			if(data.code == 0){
				$(".goods_create").attr("comodityId",data.data.comodityId);
				$(".chooseBranch").val(data.data.brandName);
				$(".chooseBranch").attr('brandId',data.data.brandId);
				$(".tuiJianDu").val(data.data.recommendation);
				$(".goodsType").val(data.data.productClass);
				$(".goodsupflie").attr("src",data.data.productImg);
				$(".goodsname").val(data.data.productName);
				$(".productDesc").val(data.data.productDesc);
				$("#goods_head_img").attr("src",data.data.detailImg);
				for(var i =0; i < data.data.standard.length; i ++){
					if(i>0){
						$(".goods_create .add_new_rj").before($(".goods_create .rj_box:first").clone());
						$(".goods_create .rj_box:last").append('<span class="rj_del">删除</span>');
						$(".goods_create .rj_box:last").children().val("");
						$(".goods_create .add_new_rj").addClass("add_new_rjs");
					}else{
						$(".goods_create .add_new_rj").removeClass("add_new_rjs");
					}
					$('.goods_create .rl_input:eq('+i+')').val(data.data.standard[i].volume);
					$('.goods_create .goodsprize:eq('+i+')').val(data.data.standard[i].price);
				};
				$(".tb_detail_url").val(data.data.tb_detail_url);
				$(".tb_item_id").val(data.data.tb_item_id);
			}else{
				alert(data.data.error);
			}
		},
	});
};
//获取品牌编辑列表
function getSingleBranchInfo(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/comodity/getBrandDetail/2.5.0',
		type : 'get',
		dataType : 'json',
		data: {brandId:$(".editThisBranch").attr("brandId")},
		success : function(data){
			if(data.code == 0){
				$(".branch_list").hide();
				$(".branch_create").show();
				$(".branch_create").attr("brandId",data.data.brandId);
				$(".branch_country").val(data.data.country);
				$(".branch_name").val(data.data.brandName);
				$(".brand_intro").val(data.data.brandDesc);
				$(".brandImg").attr("src",data.data.brandImg);
			}else{
				alert(data.data.error);
			}
		},
	});
};
//获取长草列表
function getCollectedList(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/comodity/getCollectedList/2.5.0',
		type : 'get',
		dataType : 'json',
		data: {comodityId:$(".lookThisDetail").attr("comodityid")},
		success : function(data){
			if(data.code == 0){
				var str="";
				var str1="";
				$('.articleCaoDetail tbody tr,.qianDetail tbody tr').remove();
				$.each(data.data.post,function(key,val){
					str += '<tr><td>'+val.postId+'</td>';
					str += '<td>'+val.columnName+'</td>';
					if(val.postType == 1){
						str += '<td>文章</td>';
					}else{
						str += '<td>视频</td>';
					}
					str += '<td>'+val.postTitle+'</td><td>'+val.seedNum+'</td>';
					if(val.postType == 1){
						str += '<td><input type="button" class="bluebtn1 lookZhongCaoUser" value="查看详情" targetType="1" targetId="'+val.postId+'" </td>';
					}else{
						str += '<td><input type="button" class="bluebtn1 lookZhongCaoUser" value="查看详情" targetType="2" targetId="'+val.postId+'"></td>';
					}
					str += '</tr>';
				});
				$('.articleCaoDetail tbody').append(str);
				if(data.data.post.length == 0){
					$('.articleCaoDetail tbody').append('<tr><td class="h20"></td><td> </td><td> </td><td> </td><td> </td><td> </td></tr><tr><td class="h20"></td><td> </td><td> </td><td> </td><td> </td><td> </td></tr>');
				}
				$.each(data.data.checkin,function(key,val){
					str1 += '<tr><td>'+val.checkinId+'</td>';
					str1 += '<td><img src="'+val.picture+'" alt=""/></td>';
					str1 += '<td>'+val.shareContent+'</td>';
					str1 += '<td>'+val.seedNum+'</td>';
					str1 += '<td><input type="button" class="bluebtn1 lookZhongCaoUser" value="查看详情" targetType="3" targetId="'+val.checkinId+'"></td>';
					str1 += '</tr>';
				});
				$('.qianDetail tbody').append(str1);
				if(data.data.checkin.length == 0){
					$('.qianDetail tbody').append('<tr><td class="h20"></td><td> </td><td> </td><td> </td><td> </td></tr><tr><td class="h20"></td><td> </td><td> </td><td> </td><td> </td></tr>');
				}
			}else{
				alert(data.data.error);
			}
		},
	});
};
//获取帖子或日签种草人名单
function getCollectUserList(del){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/comodity/getCollectUserList/2.5.0',
		type : 'get',
		dataType : 'json',
		data: {comodityId:$(".lookThisDetail").attr("comodityid"),targetType:del.attr("targetType"),targetId:del.attr("targetId")},
		success : function(data){
			if(data.code == 0){
				$('.collectUserListDetail tbody tr').remove();
				$(".zhangCaoDetail").hide();
				$(".goodsCollectUserList").show();
				$.each(data.data,function(key,val){
					$('.collectUserListDetail tbody').append('<tr><td>'+val.userId+'</td><td>'+val.nickName+'</td><td>'+val.collectTime+'</td>');
				});
				if(data.data.length == 0){
					$('.collectUserListDetail tbody').append('<tr><td class="h20"></td><td> </td><td> </td></tr><tr><td class="h20"></td><td> </td><td> </td></tr>');
				}
			}else{
				alert(data.data.error);
			}
		},
	});
};