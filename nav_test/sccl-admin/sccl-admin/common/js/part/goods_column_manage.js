var testUrl = 'https://testcli.nggirl.com.cn';
$(function(){
	loadGoodsColumnListPage();
//<!--  点击商品专栏搜索按钮 -->
	$(".goods_column_list .gcSearch .gc_create").live('click',function(){
		clearPointsColumnList();
		$(".goods_column_list").hide();
		$(".goods_column_create").show();
		//初始化编辑器
		$('.goods_column_create .editor_content').createArticleEditor({
			elements: ['goods'],
			data:[{type:1,content:''}],//初始化内容
			defaultData:[{type:1,content:''}]//编辑器为空时,默认的元素
		});
	});
//商品头图
	$(".goods_column_head_img").fileupload({
		dataType: 'json',
		done: function (e, data) {
			var w = parseFloat(data.result.data.width);
			var h = parseFloat(data.result.data.height);
			if(w/h != 360.0/180.0){
				alert("上传失败！图片比例应为360*180");
			}else{
				$('.gc_head_img').attr('src',data.result.data.url);
				$('.gc_head_img').attr('entend',data.result.data.width+'_'+data.result.data.height);
			};
		}
	});
	//新增作品
	$(".goodsColumnSave").live('click',function(){
		saveGoodsColumnDetail();
	});
	//返回列表页
	$(".goodsColumnBack").live('click',function(){
		$(".goods_column_list").show();
		$(".goods_column_create").hide();
		clearPointsColumnList();
	});
	//搜索
	$(".goods_column_search ").live('click',function(){
		loadGoodsColumnListPage();
	});
	//清空搜索内容
	$(".gcSearch .cancle_btn").live('click',function(){
		$(".goods_column_name,.goods_column_ID,.goods_column_content,.gcStartTime,.gcEndTime").val("");
		loadGoodsColumnListPage();
	});
	//删除按钮
	$(".goodsColumnDetail .points_del").live('click',function(){
		var btn = $(this);
		var r = confirm('确定删除该商品？？');
		if(r == true){
			deletedpointsInfo(btn);
		}
	});
	//编辑按钮
	$(".goods_column_list .pointsEdit").live('click',function(){
		clearPointsColumnList();
		$(".goods_column_list").hide();
		$(".goods_column_create").show();
		$(".goods_column_create").removeClass("columnId")
		getGoodsColumnInfo($(this));
	});
});
//渲染数据
function goodsColumnDetail(data){
	$('.goodsColumnDetail tr:gt(0)').remove();
	$.each(data.data.pageData,function(key,val){
		$('.goodsColumnDetail tbody').append('<tr><td>'+val.columnId+'</td><td>'+val.name+'</td><td><img src="'+val.headImg+'" alt="" class="riqian_img_show"/></td><td>'+val.content+'</td><td><input columnId="'+val.columnId+'" type="button" value="编辑" class="bluebtn1 pointsEdit"/><input type="button" value="删除" columnId="'+val.columnId+'" class="redbtn1 points_del" /></td></tr>');
	});	
};
	
//根据不同的页码来渲染页面
function onclickgoodsColumnPageNum(p){
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/comodityColumn/list/2.5.4',
		type : 'post',
		dataType : 'json',
		data: {page:p,num:20,goodsId:$(".points_good_id").val(),name:$(".points_good_name").val()},
		success : function(data){
			goodsColumnDetail(data);
		},
	});
};	
//获取入参，渲染页面
function loadGoodsColumnListPage(){
	//获取入参
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/comodityColumn/list/2.5.4',
		type : 'post',
		dataType : 'json',
		data: {currnetPageNum:0,num:20,name:$(".goods_column_list .goods_column_name").val(),columnId:$(".goods_column_list .goods_column_ID").val(),content:$('.goods_column_list .goods_column_content').val()},
		success : function(data){
			if(data.code == 0){
			//创建分页
			$(".goods_column_list .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:onclickgoodsColumnPageNum
			});
			//渲染页面
			goodsColumnDetail(data);
			}else{
				alert(data.data.error);
			}
		},
	});
};
//清除数据
function clearPointsColumnList(){
	$(".goods_column_create  .gcnameVal").val("");
	$(".goods_column_create  textarea").val("");
	$(".upImg").attr("src","");
	$(".goods_column_create").removeAttr("columnId");
};
//新建商品
function saveGoodsColumnDetail(){
	if($.trim($(".gcnameVal").val()) == ""){
		alert("专题名称不能为空！");
	}else if($(".gc_head_img").attr('src') == ""){
		alert("专题头图不能为空！");
	}else if($.trim($(".gcContent").val()) == ""){
		alert("专题内容不能为空！");
	}else{
		var content = $('.goods_column_create .editor_content').getArticleEditorData();
		if(!$.isArray(content)){
			alert(content);
			return ;
		}
		//只保留商品
		var finalDataStr = '';
		for(var i=0;i<content.length;i++){
			if(content[i].type == 5){
				finalDataStr += content[i].content+',';
			}
		}
		var details = finalDataStr.substring(0,finalDataStr.length -1);
		console.log(details);
		if($(".goods_column_create").attr("columnId") != "" && typeof($(".goods_column_create").attr("columnId")) != "undefined"){//编辑
			var r = confirm('确定更改该商品？？');
		}else{
			var r = confirm('确定保存该商品？？');
		};
		
		if(r == true){
			var params={name:$.trim($(".gcnameVal").val()),headImg:$(".gc_head_img").attr('src'),content:$.trim($(".gcContent").val()),seedProductIds:details,columnId:$(".goods_column_create").attr("columnId")};
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/comodityColumn/addOrEdit/2.5.4',
				type : 'post',
				dataType : 'json',
				data: params,
				success : function(data){
					if(data.code == 0){
						$(".goods_column_create").hide();
						$(".goods_column_list").show();
						loadGoodsColumnListPage();
						clearPointsColumnList();
						
					}else{
						alert(data.data.error);
					};
				},
			});
		};
	};
};

//删除商品
function deletedpointsInfo(btn){
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/comodityColumn/delete/2.5.4',
		type : 'post',
		dataType : 'json',
		data: {columnId:btn.attr('columnId')},
		success : function(data){
			if(data.code == 0){
				btn.parent().parent().remove();
			}else{
				alert(data.data.error);
			}
		},
	});
};
//获取单个商品信息进行编辑
function getGoodsColumnInfo(btn){
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/comodityColumn/detail/2.5.4',
		type : 'get',
		dataType : 'json',
		data: {columnId:btn.attr('columnId')},
		success : function(data){
			if(data.code == 0){
				$(".goods_column_create .gcnameVal").val(data.data.name);
				$(".goods_column_create .gc_head_img").attr('src',data.data.headImg);
				$(".goods_column_create .gcContent").val(data.data.content);
				$('.goods_column_manage .goods_column_create').attr('columnId',data.data.columnId);
				
				$('.goods_column_create .editor_content').createArticleEditor({
					elements: ['goods'],
					data:data.data.products,//初始化内容
					defaultData:[{type:5,content:''}]//编辑器为空时,默认的元素
				});
			}else{
				alert(data.data.error);
			}
		},
	});
};
