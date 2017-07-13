var testUrl = 'https://testcli.nggirl.com.cn';
var topicsStr = '';
$(function(){
	loadTopicsPage();
	//发布专题
	$('.recommendedTopics-table .check-id .ci-btn').click(function(e) {
		var arr = '';
		$('.recommendedTopics-table .check-id .ci-txt').each(function(index, element) {
			arr += $(this).val() + ';';
		});
		var r = confirm('确定要发布？？');
		if(r == true){
			$.post(testUrl+'/nggirl-web/web/admin/work/special/publish/v1.4.0',{specialIds:arr},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					alert('发布成功！！');
					//重新加载专题页面
					loadTopicsPage();
				};
				if(data.code == 1){
					alert(data.data.error);	
				}
			});
		};
    });
	
	//删除专题
	$('.add-recommendedTopics-table .ab-del-btn').live('click',function(e) {
		var ok = $(this);
        $.post(testUrl+'/nggirl-web/web/admin/work/special/delete/v1.4.0',{specialId:$(this).attr('tId')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				var r = confirm('确定要删除？？');
				if(r == true){
					alert('删除成功！！');
					ok.parent().parent().remove();
				};
			};
			
			if(data.code == 1){
				alert(data.data.error);	
			}
		});
    });
	
	//点击“新增专题”
	$('.recommendedTopicsMangement .rt-add-btn').click(function(e) {
		//清除专题id
		$('.rtm-page').removeAttr('tid');
		//清空表格信息
		clearTxtFn();
        $('.recommendedTopicsMangement').hide();
		$('.rtm-page').show();
    });
	
	//点击“作品详情”里面的“取消”
	$('.rp-dresser .rd-cancel').click(function(e) {
        $('.rtm-page').show();
		$('.rp-dresser').hide();
    });
	
	//点击“新增专题页面”里面的“取消”
	$('.rst-double-btn .rdb-cancle').click(function(e) {
        $('.recommendedTopicsMangement').show();
		$('.rtm-page').hide();
		//清空信息
		clearTxtFn();
    });
	
	//点击“作品列表”里面的“搜索”按钮
	$('.rp-dresser .rd-search').click(function(e) {
		loadTopicsWorksPage();
    });
	
	//点击“新增作品”按钮,获取所有上门美妆作品类型
	$('.rtm-page .rp-add-work-btn').click(function(e) {
		//清空之前选中的workid
		$('.rp-dresser .workid').html('');
		
		//获取当前已选中的作品id再填进去  
		$('.rp-dresser .workid').html(getSelectedIdFn());
		topicsStr = getSelectedIdFn();
		
        $('.rtm-page').hide();
		$('.rp-dresser').show();
		loadTopicsWorksPage();
        $.get(testUrl+'/nggirl-web/web/admin/common/getWorkTypes',function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				//清除之前加载的数据
				//$('.rp-dresser .rd-type option:gt(0)').remove();
				for(var x = 0; x < data.data.length; x ++){
					$('.rp-dresser .rd-type').append('<option value="'+data.data[x]+'">'+data.data[x]+'</option>');	
				}
			};
			if(data.code == 1){
				alert(data.data.error);
			}
		});
    });
	
	//点击作品详情页面里面的“选择”按钮 
	$('.rp-dresser-table .rdt-slect-btn').live('click',function(e) {
		$('.rp-dresser .workid').append($(this).parent().parent().children('td:eq(0)').html()+',');
        $(this).next().show();
		$(this).hide();
    });
	
	//点击作品详情页面里面的“删除”按钮  
	$('.rp-dresser-table .rdt-del-btn').live('click',function(e) {
		var sVal = $('.rp-dresser .workid').html();
		var arrStr = sVal.substring(0,sVal.length-1);
		//拆分已选中的workid  
		var str = arrStr.split(',');
		console.log('str+++++++++++++++++'+str);
		
		//遍历已经选中的workid
		var endStr ='';
		for(var x = 0;x < str.length; x ++){
			if(str[x] != $(this).parent().parent().children('td:eq(0)').html()){
				endStr += str[x]+',';
			}	
		}
		$('.rp-dresser .workid').html(endStr);
        $(this).prev().show();
		$(this).hide();
    });
	
	//点击作品详情页面里面的“确定”按钮
	$('.rp-dresser .rd-ok').click(function(e) {
        $('.rp-dresser').hide();
		$('.rtm-page').show();
		
		//获取已选中的workid
		var workid = $('.rp-dresser .workid').html();
		//截掉最后一个字符
		var subid = workid.substring(0,workid.length-1);
		var qianSubid = topicsStr.substring(0,topicsStr.length -1);
		$.get(testUrl+'/nggirl-web/web/admin/work/special/listSelectedWork/v1.4.0',{workIds :subid},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				var newArr = qianSubid.split(',');
				var oldArr = subid.split(',');
				console.log('newArr++++++++++++++++++++'+newArr);
				console.log('oldArr++++++++++++++'+oldArr);
				//获取新增的作品id
				var newStr = '';
				for(var x =0; x < oldArr.length; x ++){
					if(newArr.indexOf(oldArr[x]) == -1){
						newStr += oldArr[x] + ',';
					}	
				}
				//获取删除的作品id
				var delStr = '';
				for(var x =0; x < newArr.length; x ++){
					if(oldArr.indexOf(newArr[x]) == -1){
						delStr += newArr[x] + ',';
					}	
				}
				console.log('delStr---------------------'+delStr);
				console.log('newStr---------------------'+newStr);
				//拿到新增的
				for(var x = 0; x < data.data.length; x ++){
					if(getWorkidFn(data.data[x].workId,newStr)){
						$('.rp-select-table tbody').append('<tr workid="'+data.data[x].workId+'"><td><input type="text" class="rst-id" /></td><td>'+getImgFn(data.data[x].imgs)+'</td><td>'+data.data[x].descrip+'</td><td>'+data.data[x].workType+'</td><td>'+data.data[x].price+'</td><td>'+data.data[x].dresserName+'</td><td><textarea name="" id="" cols="30" rows="10" class="rst-txt" ></textarea></td><td><input type="button" value="删除" class="rst-del-btn" /></td></tr>');
					};
				}	
				//删掉存在的
				for(var x = $('.rp-select-table tr').length -1; x >= 0 ; x --){
					if(getWorkidFn($('.rp-select-table tr:eq('+x+')').attr('workid'),delStr)){
						$('.rp-select-table tr:eq('+x+')').remove();
					};
				}
			};
			if(data.code == 1){
				alert(data.data.error);	
			};
		});
    });
		
	//判断作品id是否相等
	function getWorkidFn(workid,str){
		var endStr = str.substring(0,str.length-1);
		var endArr = endStr.split(',');
		for(var x = 0; x< endArr.length; x ++){
			if(workid == endArr[x]){
				return true;
			}
		}
		return false;
	}
	
	//首页图片
	$('.rp-file').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('#rp-img').attr('src',data.result.data.url);
		}
	});
	
	//列表页图片
	$('.rp-file-list').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('#rp-img-list').attr('src',data.result.data.url);
		}
	});
	
	//点击专题添加或修改页面里面的“保存”按钮
	$('.rst-double-btn .rdb-save').click(function(e) {//rtm-page
		var specialInfo= 
		 '{"name":"' +$('.rtm-page .rp-name').val() +'",' +
		 '"outCover":"'+ $('.rtm-page #rp-img').attr('src') +'",' +
		 '"innerCover":"' + $('.rtm-page #rp-img-list').attr('src') +'",' +
		 '"editorId":"'+ $('.rtm-page .rp-userId').val() +'",' +
		 '"descrip":"'+ $('.rtm-page .rp-txt').val() +'",' +
		 '"workList": [' +getMessageFn() +']}';
		var specialInfoUpdate= 
		 '{"id":"'+$('.rtm-page').attr('tid')+'",'+
		 '"name":"' +$('.rtm-page .rp-name').val() +'",' +
		 '"outCover":"'+ $('.rtm-page #rp-img').attr('src') +'",' +
		 '"innerCover":"' + $('.rtm-page #rp-img-list').attr('src') +'",' +
		 '"editorId":"'+ $('.rtm-page .rp-userId').val() +'",' +
		 '"descrip":"'+ $('.rtm-page .rp-txt').val() +'",' +
		 '"workList": [' +getMessageFn() +']}';
		 
		//信息验证
		if($.trim($('.rtm-page .rp-name').val()) == ''){
			alert('请填写专题名称！！');	
		}else if($('.rtm-page #rp-img').attr('src') == ''){
			alert('请选择首页图片！！');
		}else if($('.rtm-page #rp-img-list').attr('src') == ''){
			alert('请选择列表页图片！！');
		}else if($.trim($('.rtm-page .rp-userId').val()) == ''){
			alert('请填写小编id!!');
		}else if($.trim($('.rtm-page .rp-txt').val()) == ''){
			alert('请填写小编文案！！');
		}else if($('.rp-select-table tbody tr').length < 2){
			alert('至少选择一个作品！！');
		}else if(getTxtContentFn() ==  0){
			alert('请填写作品序号！！');
		}else if(getTxtContentFn() ==  1){
			alert('请填写广告文案！！');
		}else if(getTxtContentFn() == 2){
			//判断当前窗体内是否存在专题id
			if(typeof($('.rtm-page').attr('tid')) == "undefined"){
				//新增专题
				 var r = confirm('确定要保存？？？');
				 if(r == true){
					$.post(testUrl+'/nggirl-web/web/admin/work/special/add/v1.4.0',{specialInfo:specialInfo},function(data){
						var data = $.parseJSON(data);
						if(data.code == 0){
							alert('添加成功！！');
							$('.rtm-page').hide();
							$('.recommendedTopicsMangement').show();
							//重新加载专题数据
							loadTopicsPage();
						};
						if(data.code == 1){
							alert(data.data.error);
						};
					});
				 };
			}else{
				 var r = confirm('确定要保存？？？');
				 if(r == true){
					$.post(testUrl+'/nggirl-web/web/admin/work/special/update/v1.4.0',{specialInfo:specialInfoUpdate},function(data){
						var data = $.parseJSON(data);
						if(data.code == 0){
							alert('更新成功！！');
							$('.rtm-page').hide();
							$('.recommendedTopicsMangement').show();
							//重新加载专题数据
							loadTopicsPage();
						};
						if(data.code == 1){
							alert(data.data.error);
						};
					});
				 };
			}		
		}
    });
	
	//点击新增作品里面的"删除"按钮
	$('.rp-select-table .rst-del-btn').live('click',function(e) {
		var del = $(this);
		var r = confirm('确定要删除？？');
		if(r == true){
			del.parent().parent().remove();
		};
    });
		
	//点击专题页面里面的“编辑”按钮
	$('.add-recommendedTopics-table .ab-edit-btn').live('click',function(e) {
		//存储专题id
		$('.rtm-page').attr('tid',$(this).attr('tid'));
        $.get(testUrl+'/nggirl-web/web/admin/work/special/detail/v1.4.0',{specialId:$(this).attr('tid')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				//清空信息
				clearTxtFn();
				$('.recommendedTopicsMangement').hide();
				$('.rtm-page').show();
				$('.rtm-page .rp-name').val(data.data.name);
				$('.rtm-page #rp-img').attr('src',data.data.innerCover);
				$('.rtm-page #rp-img-list').attr('src',data.data.outCover);
				$('.rtm-page .rp-userId').val(data.data.editorId);
				$('.rtm-page .rp-txt').val(data.data.descrip);
				//清除之前加载的数据
				$('.rp-select-table tbody tr:gt(0)').remove();
				for(var x = 0; x< data.data.workList.length; x ++){
					if(data.data.workList[x].seq == null){
						$('.rp-select-table tbody').append('<tr workid="'+data.data.workList[x].workId+'"><td><input type="text" class="rst-id" value="" /></td><td>'+getImgFn(data.data.workList[x].imgs)+'</td><td>'+data.data.workList[x].descrip+'</td><td>'+data.data.workList[x].workType+'</td><td>'+data.data.workList[x].price+'</td><td>'+data.data.workList[x].dresserName+'</td><td><textarea name="" id="" cols="30" rows="10" class="rst-txt" value="'+data.data.workList[x].advertise+'" >'+data.data.workList[x].advertise+'</textarea></td><td><input type="button" value="删除" class="rst-del-btn" /></td></tr>');
					}else{
						$('.rp-select-table tbody').append('<tr workid="'+data.data.workList[x].workId+'"><td><input type="text" class="rst-id" value="'+data.data.workList[x].seq+'" /></td><td>'+getImgFn(data.data.workList[x].imgs)+'</td><td>'+data.data.workList[x].descrip+'</td><td>'+data.data.workList[x].workType+'</td><td>'+data.data.workList[x].price+'</td><td>'+data.data.workList[x].dresserName+'</td><td><textarea name="" id="" cols="30" rows="10" class="rst-txt" value="'+data.data.workList[x].advertise+'" >'+data.data.workList[x].advertise+'</textarea></td><td><input type="button" value="删除" class="rst-del-btn" /></td></tr>');
					}
				}
			};
			if(data.code == 1){
				alert(data.data.error);
			};	
		});
    });
	
	
	
});




//--------------------------------------------------------------创建专题列表分页----------------------------------------------------
function createTopcisPage(data){
	$(".recommendedTopics-table .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getTopicsSearchParams();
			params.page = p;
			$('.add-recommendedTopics-table>tbody>tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/work/special/list/v1.4.0',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initTopcisPage
			});			
		}
	});
}

//初始化专题分页
function initTopcisPage(data){
	createTopcisPage(data);
	for(var x = 0; x < data.data.pageData.length ; x ++){
		//判断时间是否为null
		var editTime='';
		if(data.data.pageData[x].editTime == null){
			editTime='';
		}else{
			editTime=getLocalTime(data.data.pageData[x].editTime);
		}
		$('.add-recommendedTopics-table').append('<tr><td>'+data.data.pageData[x].id+'</td><td>'+data.data.pageData[x].createSysUser+'</td><td>'+data.data.pageData[x].editSysUser+'</td><td>'+editTime+'</td><td>'+data.data.pageData[x].name+'</td><td><img src="'+data.data.pageData[x].innerCover+'" width="100" alt="" /></td><td><img src="'+data.data.pageData[x].outCover+'" width="80" alt="" /></td><td><input type="button" value="编辑" class="ab-edit-btn" tId="'+data.data.pageData[x].id+'" /> <input type="button" value="删除" class="ab-del-btn" tId="'+data.data.pageData[x].id+'"  /></td></tr>');
	}
}

//获取专题查询参数
function getTopicsSearchParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	return params;
}

//加载专题分页数据
function loadTopicsPage(){
	$('.add-recommendedTopics-table>tbody>tr:gt(0)').remove();
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/work/special/list/v1.4.0',
		type : 'get',
		dataType : 'json',
		data: getTopicsSearchParams(1),
		success : initTopcisPage,
	});
	
	$.get(testUrl+'/nggirl-web/web/admin/work/special/publishedIds/v1.4.0',function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			$('.recommendedTopics-table .check-online ul li>.co-txt').html('()');
			var arr = data.data.publisedIds.split(';');
			console.log(arr);
			console.log('length++++++++++'+arr.length);
			for(var x = 0; x < arr.length; x ++){
				$('.recommendedTopics-table .check-id input:eq('+x+')').val(arr[x]);
				$('.recommendedTopics-table .check-online ul li:eq('+x+') .co-txt').html('('+arr[x]+')');
			}
		};
		if(data.code == 1){
			alert(data.data.error);	
		}	
	});
}



//---------------------------------------------------------------------创建用作品表分页-----------------------------------------
function createTopicsWorksPage(data){
	$(".rp-dresser .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getTopicsWorksSearchParams();
			params.page = p;
			$('.rp-dresser-table>tbody>tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/work/special/listWork/v1.4.0',
				type : 'post',
				dataType : 'json',
				data: params,
				success : initTopicsWorksPage
			});			
		}
	});
}

//初始化用户分页
function initTopicsWorksPage(data){
	createTopicsWorksPage(data);
	//判断当前选中了那些作品的id
	var sVal = $('.rp-dresser .workid').html();
	var arrStr = sVal.substring(0,sVal.length-1);
	//拆分已选中的workid  
	var str = arrStr.split(',');
	console.log('str+++++++++++++++++'+str);
	//清除之前加载的数据
	$('.rp-dresser-table tbody tr:gt(0)').remove();
	for(var x = 0; x < data.data.pageData.length; x ++){
		if(getArrFn(str,data.data.pageData[x].workId) != data.data.pageData[x].workId){
			$('.rp-dresser-table tbody').append('<tr><td>'+data.data.pageData[x].workId+'</td><td>'+getImgFn(data.data.pageData[x].imgs)+'</td><td>'+data.data.pageData[x].descrip+'</td><td>'+data.data.pageData[x].workType+'</td><td>'+data.data.pageData[x].price+'</td><td>'+data.data.pageData[x].dresserName+'</td><td><input type="button" value="选择" class="rdt-slect-btn" /><input type="button" value="删除" class="rdt-del-btn" style=" display:none;" /></td></tr>');
		}else{
			$('.rp-dresser-table tbody').append('<tr><td>'+data.data.pageData[x].workId+'</td><td>'+getImgFn(data.data.pageData[x].imgs)+'</td><td>'+data.data.pageData[x].descrip+'</td><td>'+data.data.pageData[x].workType+'</td><td>'+data.data.pageData[x].price+'</td><td>'+data.data.pageData[x].dresserName+'</td><td><input type="button" value="选择" class="rdt-slect-btn" style="display:none;" /><input type="button" value="删除"  style="display:blcok;" class="rdt-del-btn" /></td></tr>');
		}
	}
}

//获取查询参数
function getTopicsWorksSearchParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	params.dresserName = $('.rp-dresser .rp-dress-name').val();
	params.workId = $('.rp-dresser .rp-dress-id').val();
	params.workType = $('.rp-dresser .rd-type option:selected').attr('value');
	return params;
}

//加载用户分页数据
function loadTopicsWorksPage(){
	$('.rp-dresser-table>tbody>tr:gt(0)').remove();
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/work/special/listWork/v1.4.0',
		type : 'post',
		dataType : 'json',
		data: getTopicsWorksSearchParams(1),
		success : initTopicsWorksPage,
	});
}

//获取已选中的作品id
function getArrFn(str,data){
	for(var x = 0; x < str.length ; x ++){
		if(str[x] == data){
			return data;	
		};
	}
	return;
}

//获取图片
function getImgFn(img){
	var str = '';
	for(var x = 0; x < img.length; x ++){
		str +='<img src="'+img[x].url+'" style="width:100px; height:100px;" alt="" /> '
	}
	return str;
}

//获取所有作品序号以及广告文案
function getMessageFn(){
	var strs = '';
	$('.rp-select-table tbody tr:gt(0)').each(function(index, element) {
		strs +='{"seq":"'+$(this).children('td:eq(0)').children('.rst-id').val()+'","workId":"'+ $(this).attr('workid')+'",'+'"advertise":"'+$(this).children('td:eq(6)').children('.rst-txt').val()+'"'+'},';
	});
	var subStr = strs.substring(0,strs.length-1);
	return subStr;
}

//获取编辑后已选中的作品id
function getSelectedIdFn(){
	var str = '';
	$('.rp-select-table tbody tr:gt(0)').each(function(index, element) {
		str += $(this).attr('workid') +',';
	});
	return str;
}

//清空文本信息
function clearTxtFn(){
	//清空信息
	$('.rtm-page .rp-name').val('');
	$('.rtm-page #rp-img').attr('src','');
	$('.rtm-page #rp-img-list').attr('src','');
	$('.rtm-page .rp-userId').val('');
	$('.rtm-page .rp-txt').val('');
	$('.rp-select-table tbody tr:gt(0)').remove();
}	

//获取所有作品序号以及广告文案
function getTxtContentFn(){
	var str = '';

	var len = $('.rp-select-table tbody tr:gt(0)').length;
	for(var i=0;i<len;i++){
		var tr = $($('.rp-select-table tbody tr:gt(0)').get(i));
		if($.trim(tr.find('.rst-id').val()) == ''){
			str = 0;
			return str;
		}else if($.trim(tr.find('.rst-txt').val()) == ''){
			str = 1
			return str;
		}
	}
	return 2;

/*	$('.rp-select-table tbody tr:gt(0)').each(function(index, element) {
		if(str != '' && str != 2){
			return ;
		}
		if($.trim($(this).children('td:eq(0)').children('.rst-id').val()) == ''){
			str = 0
		}else if($.trim($(this).children('td:eq(6)').children('.rst-txt').val()) == ''){
			str = 1
		}else{
			str = 2;
		}
	});
	return str;
*/}



//时间格式化
function getLocalTime(publishTime) {
	var s = 0;
	s = new Date(publishTime);
	var m=parseInt(s.getMonth() + 1);
	if(m<10){
		m="0"+m;
		}
	var day=parseInt(s.getDate());
	if(day<10){
		day="0"+day;
		}
	 var hours=parseInt(s.getHours());
	if(hours<10){
		hours="0"+hours;
		}
	var minutes=parseInt(s.getMinutes());
	if(minutes<10){
		minutes="0"+minutes;
		}
	return (s.getFullYear() + "-" + m) + "-" +day+ " " +hours+ ":" +minutes ;
}
