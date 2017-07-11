var testUrl = 'https://testcli.nggirl.com.cn';
$(function(){
	loadGoodsListPage();
	loadPorderListPage();
	//获取用户角色
	$.get(testUrl+'/nggirl-web/web/admin/common/getUserRoles',function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			for(var x = 0; x < data.data.length ;x ++){
				if(data.data[x].userRole == '南瓜用户'){
					$('.followRole ul').append('<li userRole="所有用户">所有用户<input type="checkbox"></li>');
				}else{
					$('.followRole ul').append('<li userRole='+data.data[x].userRole+'>'+data.data[x].userRole+'<input type="checkbox"></li>');
				}
			}
		}else{
			alert(data.data.error);	
		}
	});
	
	//导出积分商城订单
	$('.porder_list .porder_search .points_goods_import').click(function(e) {
		var strParam = 'orderId='+$(".porder_search .porder_id").val() + '&phoneNum='+$('.porder_search .porder_user_num').val() +
			'&nickName=' + $('.porder_search .porder_user_name').val() + '&startTime='+$('.porder_search .postartTime').val() +
			'&endTime=' + $('.porder_search .poendTime').val();
		window.location.href = "<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/scoreshop/exportOrderList/2.5.4?" + strParam+'&v=<%= VERSION %>';
    });
	
//<!--  点击积分商城搜索按钮 -->
	$(".points_goods_create").live('click',function(){
		clearPointsList();
		$(".points_list").hide();
		$(".points_create").show();
		$(".points_create .changeGQ").removeAttr("disabled");
		//$(".gdneedpoints .codenum").removeAttr("disabled");
		//初始化编辑器
		$('.points_create .editor_content').createArticleEditor({
			elements: ['paragraph','image'],
			data:[{type:2,content:''}],//初始化内容
			/*shouldKeepImage:function(uploadedUrl,width,height){
				var w = parseFloat(width);
				var h = parseFloat(height);
				if(w/h == 690.0/216.0){
					return true;
				}else{
					alert('图片宽高比例错误,图片宽高比必须是690*216');
					return false;
				}
			},*/
			defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
		});
	});
	
//切换商品与优惠券
$('.randomedit .on-select').change(function(){
		if($('.randomedit .on-select option:selected').attr('value') == 1){
			$(".randomedit .notforeverbox").hide();
		}else if($('.randomedit .on-select option:selected').attr('value') == 0){
			$(".randomedit .notforeverbox").show();
		}
	})
	$(".changeGQ").change(function(){
		if($('.changeGQ  option:selected').attr('value') == 0){
			$(".hdimglabel").html("商品头图");
			$(".gdimglabel").html("商品图");
			$(".gdname").html("商品名称");
			$(".gdintro").html("商品详情说明");
			$(".gdneedpoints,.secondIntro").hide();
			$(".gdnum").show();
		}else if($('.changeGQ option:selected').attr('value') == 2){
			$(".hdimglabel").html("第三方优惠券商品头图");
			$(".gdimglabel").html("第三方优惠券商品图");
			$(".gdname").html("第三方优惠券商品名称");
			$(".gdintro").html("第三方优惠券商品详情说明");
			$(".gdneedpoints,.secondIntro").show();
			$(".gdnum").hide();
		}
	});
//商品头图
	$(".pointsgoods_head_img").fileupload({
		dataType: 'json',
		done: function (e, data) {
			var w = parseFloat(data.result.data.width);
			var h = parseFloat(data.result.data.height);
			if(w/h != 720.0/480.0){
				alert("上传失败！图片比例应为720*480");
			}else{
				$('.p_head_img').attr('src',data.result.data.url);
				$('.p_head_img').attr('entend',data.result.data.width+'_'+data.result.data.height);
			};
		}
	});
//商品图
	$(".pointsgoods_little_img").fileupload({
		dataType: 'json',
		done: function (e, data) {
			var w = parseFloat(data.result.data.width);
			var h = parseFloat(data.result.data.height);
			if(w/h != 76.0/76.0){
				alert("上传失败！图片比例应为76*76");
			}else{
				$('.pointsgoodsupflie').attr('src',data.result.data.url);
				$('.pointsgoodsupflie').attr('entend',data.result.data.width+'_'+data.result.data.height);
			};
			
		}
	});
//切换商品与订单
	$(".p_order").live('click',function(){
		$(".points_list ").hide();
		$(".porder_list").show();
		
		loadPorderListPage();
	});
	$(".p_goods").live('click',function(){
		$(".points_list ").show();
		$(".porder_list").hide();
		loadGoodsListPage();
	});
//选择用户角色
	$(".followRole p").live('click',function(){
		$(".followRole ul").toggle();
		return false;
	});
	$(".followRole ul li").live('click',function(){
		if($(this).children('input').attr("checked")){
			$(this).children('input').attr("checked",false);
		}else{
			$(this).children('input').attr("checked",true);
		}
		var str="";
		for(var i=0;i<$(".followRole ul li").length;i++){ 
			if($(".followRole ul li:eq("+i+")").children("input").attr('checked')){ 
				str += $(".followRole ul li:eq("+i+")").text()+',';
			} ;
		} ;
		str = str.substring(0,str.length -1);
		if(str == ""){
			$(".followRole p.chooseRole").text("请选择用户身份角色");
		}else{
			$(".followRole p.chooseRole").text(str);
		};
		$(".followRole ul").toggle();
	});
	$(".followRole ul li input").live('click',function(){
		$(this).parent().click();
	});
//选择关系
	$(".fitType p:eq(0)").live('click',function(){
		$(".fitType p:last").toggle();
		return false;
	});
	$(".fitType p:eq(1)").live('click',function(){
		var  p = $(this).prev();
        $(this).insertBefore(p);
		$(".fitType p:last").hide();
	});
//选择用户等级
	$(".followRolelevel p").live('click',function(){
		$(".followRolelevel ul").toggle();
		return false;
	});
	$(".followRolelevel ul li").live('click',function(){
		$(this).children('input').attr("checked",true);
		$(".followRolelevel ul").toggle();
		$(".followRolelevel p").html($(this).text());
	});
	$(".followRolelevel ul li input").live('click',function(){
		$(".followRolelevel ul").toggle();
		$(".followRolelevel p").html($(this).parent().text());
	});
	
	//新增作品
	$(".pointssave").live('click',function(){
		savePointsGoodsDetail();
	});
	//返回列表页
	$(".pointsbacklist").live('click',function(){
		$(".points_list").show();
		$(".points_create").hide();
		clearPointsList();
	});
	//搜索
	$(".searchPoints_btn").live('click',function(){
		loadGoodsListPage();
	});
	//清空搜索内容
	$(".allCancle_btn").live('click',function(){
		$(".points_good_id,.points_good_name").val("");
		loadGoodsListPage();
	});
	//上下架
	$(".pointsListDetail .onoroutsale").die('click');
	$(".pointsListDetail .onoroutsale").live('click',function(){
		$(".upOrDown").removeClass("upOrDown");
		$(this).addClass("upOrDown");
		standUpOrDown();
	});
	//删除按钮
	$(".pointsListDetail .points_del").live('click',function(){
		$(".delThisRiqian").removeClass("delThisRiqian");
		$(this).addClass("delThisRiqian");
		var r = confirm('确定删除该商品？？');
		if(r == true){
			deletedpointsInfo();
		}
	});
	//编辑按钮
	$(".points_list .pointsEdit").live('click',function(){
		clearPointsList();
		$(".points_list").hide();
		$(".points_create").show();
		$(".editThisPgoods").removeClass("editThisPgoods");
		$(this).addClass("editThisPgoods");
		getPointsGoodsInfo();
	});
	//订单发货
	$(".porder_list .deliverGoods").live('click',function(){
		$(".deliverBtn").removeClass("deliverBtn");
		$(this).addClass("deliverBtn");
		var r = confirm('确定发货？？');
		if(r == true){
			deliverGoodsFn();
		}
	});
	//订单页搜索
	$(".porder_list .searchPorder_btn").live('click',function(){
		loadPorderListPage();
	});
	//订单页取消搜索
	$(".porder_list .cancle_porder_btn").live('click',function(){
		$(".porder_search input[type='text']").val("");
		loadPorderListPage();
	});
	
});
//渲染数据
function pointsListDetail(data){
	$('.pointsListDetail tr:gt(0)').remove();
	var str='';
	var goodsType='';
	$.each(data.data.pageData,function(key,val){
		if(val.isAdd == 0){
			str ='<input type="button" value="上架" class="bluebtn1 onoroutsale" isAdd="0"/>';
		}else{
			str ='<input type="button" value="下架" class="redbtn1 onoroutsale" isAdd="1""/>';
		}
		if(val.goodsType == 0){
			listType ='实物商品';
		}else if(val.goodsType == 1){
			listType ='补签卡';
		}else if(val.goodsType == 2){
			listType ='第三方优惠券';
		}
		$('.pointsListDetail tbody').append('<tr><td>'+val.goodsId+'</td><td><img src="'+val.commonImg+'" alt="" class="riqian_img_show"/></td><td>'+val.name+'</td><td>'+listType+'</td><td>'+val.costScore+'</td><td>'+val.storeNum+'</td><td>'+val.totalNum+'</td><td goodsId="'+val.goodsId+'" goodsType="'+val.goodsType+'" unionGoodsId="'+val.unionGoodsId+'">'+str+'<input type="button" value="编辑" class="bluebtn1 pointsEdit"/><input type="button" value="删除" class="redbtn1 points_del" /></td></tr>');
	});	
};
	
//根据不同的页码来渲染页面
function onclickPointsPageNum(p){
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/scoreshop/getGoodsList/3.0.0',
		type : 'post',
		dataType : 'json',
		data: {page:p,num:20,goodsId:$(".points_good_id").val(),name:$(".points_good_name").val()},
		success : function(data){
			pointsListDetail(data);
		},
	});
};	
//获取入参，渲染页面
function loadGoodsListPage(){
	//获取入参
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/scoreshop/getGoodsList/3.0.0',
		type : 'post',
		dataType : 'json',
		data: {page:0,num:20,goodsId:$(".points_good_id").val(),name:$(".points_good_name").val()},
		success : function(data){
			if(data.code == 0){
			//创建分页
			$(".points_list .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:onclickPointsPageNum
			});
			//渲染页面
			pointsListDetail(data);
			}else{
				alert(data.data.error);
			}
		},
	});
};
//清除数据
function clearPointsList(){
	$(".points_create .topBoxForClear input").val("");
	$(".points_create .changeLimit").val("");
	$(".upImg").attr("src","");
	$(".points_create").removeAttr("unionGoodsId");
	$(".points_create").removeAttr("goodsId");
	$(".followRole p.chooseRole").html("请选择用户身份角色");
	$(".followRolelevel p.chooseRoleLevel").html("请选择用户等级");
	$(".followRole ul li input").removeAttr("checked");
	$(".followRolelevel ul li input").removeAttr("checked");
	$(".followRole ul").hide();
	$(".followRolelevel ul").hide();
	$(".fitType p:first").html("或").attr("fitType",0);
	$(".fitType p:last").html("与").attr("fitType",1).hide();
};
//新建商品
function savePointsGoodsDetail(){
	var del=$(".followRole ul li"); 
	var dels=$(".followRolelevel ul li"); 
	var flag = false ;   
	var flag1 = false ;   
	var str1="";
	var str2="";  
	var type="";
	var goodsType="";
	if($('.changeGQ  option:selected').attr('value') == 2){
		type="第三方优惠券";
		goodsType = 2;
	}else if($('.changeGQ  option:selected').attr('value') == 0){
		type="";
		goodsType = 0;
	}
	for(var i=0;i<$(".followRole ul li").length;i++){ 
		var currentRole=$(".followRole ul li:eq("+i+")");
		if(currentRole.children("input").attr('checked')){ 
			flag = true ; 
			str1 += currentRole.text()+',';
		} ;
	} ;
	str1 = str1.substring(0,str1.length -1);
	console.log(str1);
	for(var i=0;i<$(".followRolelevel ul li").length;i++){ 
		var currentLevel=$(".followRolelevel ul li:eq("+i+")")
		if(currentLevel.children("input").attr('checked')){ 
			flag1 = true ; 
			str2 = currentLevel.children("input").val();
			break ; 
		} 
	} 
	if($(".p_head_img").attr('src') == ""){
		alert(type+"商品头图不能为空！");
	}else if($(".pointsgoodsupflie").attr('src') == ""){
		alert(type+"商品图不能为空！");
	}else if($.trim($(".pointsgoodsname").val()) == ""){
		alert(type+"商品名称不能为空！");
	}else if($.trim($(".costScore").val()) == "" ){
		alert("所需积分不能为空！");
	}else if($.trim($(".codenum").val()) == "" && $('.changeGQ  option:selected').attr('value') == 2){
		alert("优惠券兑换码不能为空！");
	}else if($.trim($(".storeNum").val()) == "" && $('.changeGQ  option:selected').attr('value') == 0){
		alert("商品数量不能为空！");
	}else if($.trim($(".pmstartTime").val()) == ""){
		alert("兑换活动开始时间不能为空！");
	}else if($.trim($(".pmendTime").val()) == ""){
		alert("兑换活动结束时间不能为空！");
	}else if(!flag){
		alert("请选择用户！");
	}else if(!flag1){
		alert("请选择用户等级！");
	}else{
		var content = $('.points_create .firstIntro .editor_content').getArticleEditorData();
		if(!$.isArray(content)){
			alert(content);
			return ;
		}
		//只保留段落和图片
		var finalData = new Array();
		for(var i=0;i<content.length;i++){
			if(content[i].type == 2 || content[i].type == 3 ){
				finalData.push(content[i]);
			}
		}
		var details = JSON.stringify(finalData);
		//优惠券详情说明
		var content1 = $('.points_create .secondIntro .editor_content').getArticleEditorData();
		if(!$.isArray(content1)){
			alert(content1);
			return ;
		}
		//只保留段落和图片
		var finalData1 = new Array();
		for(var i=0;i<content1.length;i++){
			if(content1[i].type == 2 || content1[i].type == 3 ){
				finalData1.push(content1[i]);
			}
		}
		var details1 = JSON.stringify(finalData1);
		console.log(details);
		console.log(details1);
		if($(".points_create").attr("unionGoodsId") != "" && typeof($(".points_create").attr("unionGoodsId")) != "undefined"){//编辑
			var r = confirm('确定更改该'+type+'商品？？');
		}else{
			var r = confirm('确定保存该'+type+'商品？？');
		};
		
		if(r == true){
			var params={unionGoodsId:$(".points_create").attr("unionGoodsId"),goodsId:$(".points_create").attr("goodsId"),goodsType:goodsType,headImg:$(".p_head_img").attr('src'),
			commonImg:$(".pointsgoodsupflie").attr('src'),name:$(".pointsgoodsname").val(),originCostScore:$(".costScore").val(),costScore:$(".lastCostScore").val(),storeNum:$(".storeNum").val(),
			freight:"0",startTime:$(".pmstartTime").val(),endTime:$(".pmendTime").val(),fitUserRole:str1,fitType:$(".fitType p:eq(0)").attr("fitType"),
			fitUserLevel:str2,exchangeTime:$(".changeLimit").val(),goodsDetail:details,codes:$(".codenum").val(),instructions:details1};
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/scoreshop/addOrEditGoods/2.5.3',
				type : 'post',
				dataType : 'json',
				data: params,
				success : function(data){
					if(data.code == 0){
						$(".points_create").hide();
						$(".points_list").show();
						loadGoodsListPage();
						clearPointsList();
						
					}else{
						alert(data.data.error);
					};
				},
			});
		};
	};
};
//商品上下架
function standUpOrDown(){
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/scoreshop/standUpOrDown/2.5.2',
		type : 'post',
		dataType : 'json',
		data: {unionGoodsId:$(".upOrDown").parent().attr("unionGoodsId"),goodsId:$(".upOrDown").parent().attr("goodsId"),goodsType:$(".upOrDown").parent().attr("goodsType"),isAdd:$(".upOrDown").attr("isAdd")},
		success : function(data){
			if(data.code == 0){
				if($(".upOrDown").hasClass("redbtn1")){
					$(".upOrDown").removeClass("redbtn1");
					$(".upOrDown").val("上架").addClass("bluebtn1");
					$(".upOrDown").attr("isAdd","0")
				}else{
					$(".upOrDown").removeClass("bluebtn1");
					$(".upOrDown").addClass("redbtn1 ");
					$(".upOrDown").val("下架");
					$(".upOrDown").attr("isAdd","1")
				}
			}else{
				alert(data.data.error);
			}
		},
	});
};
//删除商品
function deletedpointsInfo(){
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/scoreshop/deleteGoods/2.5.2',
		type : 'post',
		dataType : 'json',
		data: {goodsId:$(".delThisRiqian").parent().attr("goodsId"),goodsType:$(".delThisRiqian").parent().attr("goodsType")},
		success : function(data){
			if(data.code == 0){
				$(".delThisRiqian").parent().parent().remove();
			}else{
				alert(data.data.error);
			}
		},
	});
};
//获取单个商品信息进行编辑
function getPointsGoodsInfo(){
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/scoreshop/getGoodsDetail/2.5.3',
		type : 'get',
		dataType : 'json',
		data: {goodsId:$(".editThisPgoods").parent().attr("goodsId"),goodsType:$(".editThisPgoods").parent().attr("goodsType")},
		success : function(data){
			if(data.code == 0){
				$(".points_create .changeGQ").attr("disabled",'true');
				if(data.data.goodsType == 0){
					$('.changeGQ option:eq(1)').attr('selected','selected');
					$(".hdimglabel").html("商品头图");
					$(".gdimglabel").html("商品图");
					$(".gdname").html("商品名称");
					$(".gdintro").html("商品详情说明");
					$(".gdneedpoints,.secondIntro").hide();
					$(".gdnum").show();
				}else if(data.data.goodsType == 2){
					$('.changeGQ option:eq(2)').attr('selected','selected');
					$(".hdimglabel").html("第三方优惠券商品头图");
					$(".gdimglabel").html("第三方优惠券商品图");
					$(".gdname").html("第三方优惠券商品名称");
					$(".gdintro").html("第三方优惠券商品详情说明");
					$(".gdneedpoints,.secondIntro").show();
					//$(".gdneedpoints .codenum").attr("disabled",'true');
					$(".gdnum").hide();
				}
				var str='';
				$(".points_create").attr('unionGoodsId',data.data.unionGoodsId);
				$(".points_create").attr('goodsId',data.data.goodsId);
				$(".points_create").attr('goodsType',data.data.goodsType);
				$(".p_head_img").attr('src',data.data.headImg);
				$(".pointsgoodsupflie").attr('src',data.data.commonImg);
				$(".pointsgoodsname").val(data.data.name);
				$(".codenum").val(data.data.codes);
				$(".costScore").val(data.data.originCostScore);
				$(".lastCostScore").val(data.data.costScore);
				$(".storeNum").val(data.data.storeNum);
				$(".pmstartTime").val(data.data.startTime);
				$(".pmendTime").val(data.data.endTime);
				for(i=0; i<data.data.fitUserRole.length;i++){
					var fitUserRole=data.data.fitUserRole[i];
					getUserRoleFn(fitUserRole);
					str += fitUserRole+',';
				};
				
				function getUserRoleFn(role){
					$(".followRole ul li").each(function(index, element) {
                        if($(this).attr('userRole') == role){
							$(this).children('input').attr("checked",'checked');
						};
                    });
				}
				
				str = str.substring(0,str.length -1);
				$(".followRole .chooseRole").html(str);
				if(data.data.fitType == 0){
					$(".fitType p:first").html("或").attr("fitType",0);
					$(".fitType p:last").html("与").attr("fitType",1);
				}else{
					$(".fitType p:first").html("与").attr("fitType",1);
					$(".fitType p:last").html("或").attr("fitType",0);
				};
				var fitUserLevel=parseInt(data.data.fitUserLevel);
				$(".followRolelevel .chooseRoleLevel").html($('.followRolelevel ul li:eq('+fitUserLevel+')').text());
				$(".followRolelevel ul li:eq("+fitUserLevel+") input").attr("checked",'checked');
				$(".points_create .changeLimit").val(data.data.exchangeTime);
				$('.points_create  .firstIntro .editor_content').createArticleEditor({
					elements: ['paragraph','image'],
					data:data.data.goodsDetail,//初始化内容
					defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
				});
				$('.points_create  .secondIntro .editor_content').createArticleEditor({
					elements: ['paragraph','image'],
					data:data.data.instructions,//初始化内容
					defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
				});
			}else{
				alert(data.data.error);
			}
		},
	});
};
//定义数据

function  getPorderData(orderId,phoneNum,nickName,startTime,endTime,page,num){
	var data = new Object();
	data.orderId = orderId;
	data.phoneNum = phoneNum;
	data.nickName = nickName;
	data.startTime = startTime;
	data.endTime = endTime;
	data.page = page;
	data.num = num;
	return data;	
}

//搜索的数据
function porderData(){
	return getPorderData(
		$(".porder_search .porder_id").val(),$('.porder_search .porder_user_num').val(),
		$('.porder_search .porder_user_name').val(),$('.porder_search .postartTime').val(),$('.porder_search .poendTime').val(),0,20
    )
}
//渲染数据
function porderListDetail(data){
	$('.porderListDetail tr:gt(0)').remove();
	var str='';
	$.each(data.data.pageData,function(key,val){
		if(val.status == 0){
			str ='<td>待发货</td><td><input type="button" value="发货" class="bluebtn1 deliverGoods" orderId="'+val.orderId+'"/></td>';
		}else{
			str ='<td>已发货</td><td><input type="button" value="发货" class="unclick"/></td>';
		}
		
		$('.porderListDetail tbody').append('<tr><td>'+val.orderId+'</td><td>'+val.nickName+'</td><td>'+val.createTime+'</td><td>'+val.goodsName+'</td><td>'+val.realName+'</td><td>'+val.phoneNum+'</td><td>'+val.address+'</td><td>'+val.remark+'</td>'+str);
	});	
};
	
//根据不同的页码来渲染页面
function onclickPorderPageNum(p){
	var data = porderData();
	data.page = p;
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/scoreshop/getOrderList/2.5.2',
		type : 'post',
		dataType : 'json',
		data: data,
		success : function(data){
			porderListDetail(data);
		},
	});
};	
//获取入参，渲染页面
function loadPorderListPage(){
	var data = porderData();
	//获取入参
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/scoreshop/getOrderList/2.5.2',
		type : 'post',
		dataType : 'json',
		data: data,
		success : function(data){
			if(data.code == 0){
			//创建分页
			$(".porder_list .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:onclickPorderPageNum
			});
			//渲染页面
			porderListDetail(data);
			}else{
				alert(data.data.error);
			}
		},
	});
};
//商品发货
function deliverGoodsFn(){
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/scoreshop/deliverGoods/2.5.2',
		type : 'post',
		dataType : 'json',
		data: {orderId:$(".deliverBtn").attr("orderId")},
		success : function(data){
			if(data.code == 0){
				$(".deliverBtn").parent().prev().html("已发货");
				$(".deliverBtn").removeClass("bluebtn1");
				$(".deliverBtn").removeClass("deliverGoods");
				$(".deliverBtn").val("发货");	
			}else{
				alert(data.data.error);
			}
		},
	});
};