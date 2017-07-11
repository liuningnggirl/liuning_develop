var testUrl = 'https://testcli.nggirl.com.cn';
$(function(){
	getRecomdTypeFn();
	loadHistoryListPage();
	//列表控制-新增列表
	$('#index_list_manage .index_list_manage_box .index_list_btn_add').live('click',function(e) {
        $('#index_list_manage .index_list_manage_box_top_table .top_table tbody').append('<tr class="cfmc_content"><td><select class="select_type" name="" id="" style="padding: 5px;border-radius: 5px;border: 1px solid #ccc;">'+getCommendType()+'</select></td><td><div class="select_tie" style=" display:none;"><input type="text" placeholder="id" value="" style=" text-align:center;width: 100%;padding: 7px;box-sizing: border-box;" /></div></div></td><td><div class="tie" style=" display:none;"><span class="title_content"></span><input type="button" value="获取标题" class="get_title" style="background: #51a351;color: #fff;border-radius: 5px;" /></div></div></td><td><input type="button" value="删除" class="del_recoder" style=" background:#bd362f; color:#fff; border-radius:5px; vertical-align: middle;" /><img src="../common/images/img_arr_down.png" alt="" style="width:30px; vertical-align: middle;" class="arr_down" /><img src="../common/images/img_arr_up.png" alt="" style="width:30px; vertical-align: middle;" class="arr_up" /></td></tr>');
    });
	
	//更改id类型
	$('#index_list_manage .index_list_manage_box_top_table .top_table .select_type').live('change',function(e) {
        if($(this).children('option:selected').html() == '文章' || $(this).children('option:selected').html() == '视频'){
			$(this).parent().next().children('.select_tie').show();
			$(this).parent().next().next().children('.tie').show();
		}else if($(this).children('option:selected').html() == '商品'){
			$(this).parent().next().children('.select_tie').show();
			$(this).parent().next().next().children('.tie').show();
		}else{
			$(this).parent().next().children('.select_tie').hide();
			$(this).parent().next().next().children('.tie').hide();
		}
    });
	
	//下移元素
	$('.index_list_manage .index_list_manage_box_top_table .top_table .arr_down').live('click',function(event) {
		if($(this).closest('.cfmc_content').next().hasClass('cfmc_content')){
			var next= $(this).closest('.cfmc_content').next();  
			$(this).closest('.cfmc_content').insertAfter(next);		
		};
	});
	
	//上移元素
	$('.index_list_manage .index_list_manage_box_top_table .top_table .arr_up').live('click',function(event) {
		if($(this).closest('.cfmc_content').prev().hasClass('cfmc_content')){
			var pre= $(this).closest('.cfmc_content').prev();  
			$(this).closest('.cfmc_content').insertBefore(pre);		
		};
	});
	
	//删除历史记录
	$('.index_list_manage_box_bottom_table .bottom_table .del_history_recoder').live('click',function(e) {
		var btn = $(this);
		var r = confirm('确认要删除该历史记录？？');
		if(r == true){
			$.post(testUrl+'/nggirl-web/web/admin/homepage/deleteRecommendHistory/3.0.2',{historyId:btn.attr('historyId')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					loadHistoryListPage();
				}else{
					alert(data.data.error);	
				}	
			});		
		};
    });
	
	//删除新增记录
	$('.index_list_manage_box_top_table .top_table .del_recoder').live('click',function(e) {
        $(this).parent().parent().remove();
    });
	
	//获取帖子标题
	$('.index_list_manage_box_top_table .top_table .get_title').live('click',function(e) {
		var btn = $(this);
		//判断是帖子还是商品
		if(btn.parent().parent().prev().prev().children('.select_type').children('option:selected').attr('recomdType') == 3){//文章
			$.get(testUrl+'/nggirl-web/web/admin/homepage/getPostTitle/3.0.0',{postId:btn.parent().parent().prev().children('.select_tie').children('input').val(),postType:1},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					btn.prev().html(data.data.title);
				}else{
					alert(data.data.error);	
				}	
			});		
		}else if(btn.parent().parent().prev().prev().children('.select_type').children('option:selected').attr('recomdType') == 4){//视频
			$.get(testUrl+'/nggirl-web/web/admin/homepage/getPostTitle/3.0.0',{postId:btn.parent().parent().prev().children('.select_tie').children('input').val(),postType:2},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					btn.prev().html(data.data.title);
				}else{
					alert(data.data.error);	
				}	
			});		
		}else if(btn.parent().parent().prev().prev().children('.select_type').children('option:selected').attr('recomdType') == 2){//商品
			$.get(testUrl+'/nggirl-web/web/admin/homepage/getProductName/3.0.0',{goodsId:btn.parent().parent().prev().children('.select_tie').children('input').val()},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					btn.prev().html(data.data.name);
				}else{
					alert(data.data.error);	
				}	
			});		
		}
    });
		
	//发布今日推荐V3.0.2
	$('.index_list_manage_box .index_list_btn .index_list_btn_fabu').click(function(e) {
		var r = confirm('确认要发布今日推荐？');
		if(r == true){
			$.post(testUrl+'/nggirl-web/web/admin/homepage/publishTodayRecommends/3.0.2',function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					alert('发布成功！！');
					getTodayRecommendsFn();
					loadHistoryListPage();
				}else{
					alert(data.data.error);	
				}	
			});		
		};
    });
		
	//保存今日推荐列表V3.0.2
	$('.index_list_manage_box .index_list_btn .index_list_btn_save').click(function(e) {
		var arr = new Array();
		$('.index_list_manage_box_top_table .top_table tbody tr:gt(0)').each(function(index, element) {
			var obj = new Object();
			obj.recomdType = $(this).children('td:eq(0)').children('.select_type').children('option:selected').attr('recomdType');
			obj.targetId = $(this).children('td:eq(1)').children('.select_tie').children('input').val();
			arr.push(obj);
		});
		var recommends = JSON.stringify(arr);
		console.log(recommends);
		var r = confirm('确认要保存推荐列表？');
		if(r == true){
			$.post(testUrl+'/nggirl-web/web/admin/homepage/saveTodayRecommends/3.0.2',{recommends:recommends},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					getTodayRecommendsFn();
					loadHistoryListPage();
				}else{
					alert(data.data.error);	
				}	
			});		
		};
    });
});


//获取今日推荐列表V3.0.2
function getTodayRecommendsFn(){
	$.get(testUrl+'/nggirl-web/web/admin/homepage/getTodayRecommends/3.0.2',function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			$('.index_list_manage .index_list_manage_box_top_table .top_table tbody tr:gt(0)').remove();
			for(var x = 0; x < data.data.length ; x ++){
				$('.index_list_manage .index_list_manage_box_top_table .top_table tbody').append('<tr class="cfmc_content"><td><select class="select_type" name="" id="" style="padding: 5px;border-radius: 5px;border: 1px solid #ccc;">'+getOptions(data.data[x].recomdType)+'</select></td><td><div class="select_tie" ><input type="text" placeholder="id" value="'+data.data[x].targetId+'" style=" text-align:center;width: 100%;padding: 7px;box-sizing: border-box;" /></div></div></td><td><div class="tie"><span class="title_content">'+data.data[x].title+'</span><input type="button" value="获取标题" recomdType='+data.data[x].recomdType+' class="get_title" style="background: #51a351;color: #fff;border-radius: 5px;" /></div></div></td><td><input type="button" value="删除" class="del_recoder" style=" background:#bd362f; color:#fff; border-radius:5px; vertical-align: middle;" /><img src="../common/images/img_arr_down.png" alt="" style="width:30px; vertical-align: middle;" class="arr_down" /><img src="../common/images/img_arr_up.png" alt="" style="width:30px; vertical-align: middle;" class="arr_up" /></td></tr>');	
			}
		}else{
			alert(data.data.error);	
		}	
	});		
}

//创建获取历史记录列表分页
function createHistoryListPage(data){
	$(".index_list_manage_box_bottom_table .bottom_table .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getHistoryListSearchParams();
			params.page = p;
			$('.index_list_manage .index_list_manage_box_bottom_table .bottom_table>tbody>tr:gt(0)').remove();
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/homepage/getRecommendHistoryList/3.0.2',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initHistoryListPage
			});			
		}
	});
}

//初始化获取历史记录分页
function initHistoryListPage(data){
	createHistoryListPage(data);
	for(var x = 0; x < data.data.pageData.length ;){
		var rowspan = getTypeNameNum(data,x);
		if(rowspan > 1){
			var spanstr = '<td rowspan="'+rowspan+'">'+data.data.pageData[x].typeName+'</td>';
			for(var i=0;i<rowspan;i++,x++){
				if(i == 0){
					$('.index_list_manage .index_list_manage_box_bottom_table .bottom_table>tbody').append('<tr>'+spanstr+'<td>'+data.data.pageData[x].targetId+'</td><td>'+data.data.pageData[x].title+'</td><td>'+data.data.pageData[x].publishTime+'</td><td><input type="button" value="删除" style=" background:#bd362f; color:#fff; border-radius:5px;" class="del_history_recoder" historyId='+data.data.pageData[x].historyId+'></td></tr>');
				}else{
					$('.index_list_manage .index_list_manage_box_bottom_table .bottom_table>tbody').append('<tr><td>'+data.data.pageData[x].targetId+'</td><td>'+data.data.pageData[x].title+'</td><td>'+data.data.pageData[x].publishTime+'</td><td><input type="button" value="删除" style=" background:#bd362f; color:#fff; border-radius:5px;" class="del_history_recoder" historyId='+data.data.pageData[x].historyId+'></td></tr>');
				}
			}
		}else if(rowspan == 1){
			$('.index_list_manage .index_list_manage_box_bottom_table .bottom_table>tbody').append('<tr><td>'+data.data.pageData[x].typeName+'</td><td>'+data.data.pageData[x].targetId+'</td><td>'+data.data.pageData[x].title+'</td><td>'+data.data.pageData[x].publishTime+'</td><td><input type="button" value="删除" style=" background:#bd362f; color:#fff; border-radius:5px;" class="del_history_recoder" historyId='+data.data.pageData[x].historyId+'></td></tr>');
			x ++;
		}
	}			
}

//获取查询参数
function getHistoryListSearchParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	return params;
}

//获取历史记录分页数据
function loadHistoryListPage(){
	$('.index_list_manage .index_list_manage_box_bottom_table .bottom_table>tbody>tr:gt(0)').remove();
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/homepage/getRecommendHistoryList/3.0.2',
		type : 'get',
		dataType : 'json',
		data: getHistoryListSearchParams(1),
		success : initHistoryListPage,
	});
}

//返回获取的楼层数
function getTypeNameNum(data,rowIndex){//data，行下标
	var typeName = data.data.pageData[rowIndex].typeName;
	var rowspanNum = 0;
	for(var i=rowIndex;i<data.data.pageData.length;i++){
		if(data.data.pageData[i].typeName == typeName){
			rowspanNum++;
		}else{
			return rowspanNum;
		}
	}
	return rowspanNum;
}


//获取推荐类型
function getRecomdTypeFn(){
	$.get(testUrl+'/nggirl-web/web/admin/common/getAllRecommendTypes',function(data){
		var data = $.parseJSON(data);
		var str = '';
		if(data.code == 0){
			 $('body').data('getAllRecommendTypes',data.data)
		}else{
			alert(data.data.error);	
		}	
	});	
}

function getOptions(recomdType){
	var data = $('body').data('getAllRecommendTypes');
	var str = '';
	if(data != undefined && data.length != undefined){
		for(var x = 0; x < data.length; x ++){
			if(recomdType == data[x].type){
				str +=('<option selected="selected" recomdType='+data[x].type+'>'+data[x].name+'</option>');
			}else{
				str +=('<option recomdType='+data[x].type+'>'+data[x].name+'</option>');
			}
		}	
		str += '<option value="">请选择类型</option>';
	}
	return str;
}
	

//获取全部推荐类型
function getCommendType(){
	var data = $('body').data('getAllRecommendTypes');
	var str = '';
	for(var x = 0; x < data.length; x ++){
		str +='<option recomdType='+data[x].type+'>'+data[x].name+'</option>';
	}	
	str += '<option value="" selected="selected">请选择类型</option>';
	return str;	
}

