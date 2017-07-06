$(function(){
	//获取所有活动列表
	//loadXwcPage();
	
	//获取城市列表
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/common/getCitys',
		type : 'get',
		dataType : 'json',  
		success : function(data){
			for(var x = 0; x < data.data.length; x ++){
				$('.mac-activity-address .mine-city').append('<option cityId='+data.data[x].cityId+'>'+data.data[x].cityName+'</option>');
			}
		}
	});
	
	//改变城市获取对应的地区列表
	$('.mac-activity-address #province').change(function(){
		//获取地区列表
		$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/common/getCountys',
			type : 'get',
			data : ({cityId:$('.mac-activity-address .mine-city option:selected').attr('cityId')}),
			dataType : 'json',  
			success : function(data){
				$('.city option:gt(0)').remove();
				$('.city option:eq(0)').html('请选择所在地区');
				for(var x = 0; x < data.data.length; x ++){
					$('.mac-activity-address .mine-area').append('<option areaId="'+data.data[x].areaId+'">'+data.data[x].areaName+'</option>');
				}
			}
		});
	});
	
	//点击页面上的“上线”按钮
	$('.mzxwc-gl .mzxwc_status').live('click',function(e) {
		if($(this).hasClass("redbtn1")){
			var r = confirm('确定要下线？？');
		}else{
			var r = confirm('确定要上线？？');
		}
		var del = $(this);
		if(r == true){
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/salon/work/setOnline',
				type : 'get',
				dataType : 'json',
				data: {atId:del.attr("atId"),flag:del.attr("flag")},
				success : function(data){
					if(data.code == 0){
						if(del.hasClass("redbtn1")){
							del.removeClass("redbtn1").addClass("bluebtn1");
							del.attr("flag","0");
							del.val("上线");
						}else{
							del.removeClass("bluebtn1").addClass("redbtn1");
							del.attr("flag","1");
							del.val("下线");
						}
					};
					if(data.code == 1){
						alert(data.data.error);	
					}
				}
			});
		};
	});
	//点击“增加活动按钮”
	$('.mzxwc-add-btn').click(function(e) {
		$('.mzxwc-activity-content').attr('id','edit');
		$('.mzxwc-gl').removeAttr('atId');
		$('.xwc_active_detail').hide();
		$('.mzxwc-activity-content').show();
		//初始化编辑器
		$('.xwc_active_img .editor_content').createArticleEditor({
			elements: ['image'],
			data:[{type:1,content:''}],//初始化内容
			shouldKeepImage:function(uploadedUrl,width,height){
				var w = parseFloat(width);
				var h = parseFloat(height);
				if(w/h == 640.0/427.0){
					return true;
				}else{
					alert('图片宽高比例错误,图片宽高比须是640:427');
					return false;
				}
			},
			defaultData:[{type:1,content:''}]//编辑器为空时,默认的
		});
		//初始化编辑器
		$('.xwc_active_intro .editor_content').createArticleEditor({
			elements: ['paragraph', 'title', 'image', 'preview', 'fullScreen'],
			data:[{type:2,content:''}],//初始化内容
			defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
		});
		$('.mzxwc-activity-content  .book_need_know .editor_content').createArticleEditor({
			elements: ['paragraph'],
			data:[{type:2,content:''}],//初始化内容
			defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
		});	
		clearFn();
	});
			
	//点击“添加活动”里面的"保存"按钮
	$('.mzxwc-btn .mzxwc-save').click(function(e) {
		var photos=new Array;
		$('.xwc_active_img .editor_content img:gt(0)').each(function(index, element) {
			  photos[index] =$(this).attr("src");
		});
		var photos = JSON.stringify(photos);
		var data = $('.xwc_active_intro .editor_content').getArticleEditorData();
		if($.type(data) != 'array'){
			alert(data);
			return;
		}
		
		var introduces = JSON.stringify(data);
		var ruler = $('.book_need_know .editor_content').getArticleEditorData();
		if($.type(ruler) != 'array'){
			alert(ruler);
			return;
		}
		var rules = JSON.stringify(ruler);
		data = {
			productType:1,
			title:$('.mzxwc-activity-content .mac-title').val(),
			description:$('.mzxwc-activity-content .mac-content').val(),
			startTime:$('.mzxwc-activity-content .qian').val().replace(/\D/g,''),
			endTime:$('.mzxwc-activity-content .hou').val().replace(/\D/g,''),
			registEndTime:$('.mzxwc-activity-content .end').val().replace(/\D/g,''),
			price:$('.mzxwc-activity-content .mac-cost').val(),
			dresserId:$('.mzxwc-activity-content .mac-id').val(),
			place:$('.mzxwc-activity-content .maa-address').val(),
			shortPlace:$('.mzxwc-activity-content .maa-address-ok').val(),
			lattitude:$('.mzxwc-activity-content .maa-y').val(),
			longitude:$('.mzxwc-activity-content .maa-x').val(),
			peopleLow:$('.mzxwc-activity-content .xiaxian .mt-center-num').html(),
			peopleHigh:$('.mzxwc-activity-content .shangxian .mt-center-num').html(),
			cover:$('.mzxwc-activity-content  .editor_content img:eq(0)').attr('src'),
			
			atId:$('.mzxwc-gl').attr('atId'),
			online:0,
			cityId:$('.mac-activity-address .mine-city option:selected').attr('cityId'),
			areaId:$('.mac-activity-address .mine-area option:selected').attr('areaId'),
			linkMan:$('.mzxwc-activity-content .mac-linkman').val(),
			photos:photos,
			introduces:introduces,
			rules:rules,};
			//验证信息
			if($('.mzxwc-activity-content .mac-title').val() == ''){
				alert('请输入活动题目！！');	
			}else if($('.mzxwc-activity-content .mac-content').val() == ''){
				alert('请输入活动简介！！');	
			}else if($('.mzxwc-activity-content .qian').val() == ''){
				alert('请输选择活动开始时间！！');		
			}else if($('.mzxwc-activity-content .hou').val() == ''){
				alert('请输选择活动结束时间！！');		
			}else if($('.mzxwc-activity-content .end').val() == ''){
				alert('请输选择报名截止时间！！');		
			}else if($('.mzxwc-activity-content .mac-cost').val() == ''){
				alert('请填写价格！！');		
			}else if($('.mzxwc-activity-content .mac-id').val() == ''){
				alert('请填写化妆师ID！！');		
			}else if($('.mzxwc-activity-content .maa-address').val() == ''){
				alert('请填写详细地址！！');		
			}else if($('.maa-address-ok').val() == ''){
				alert('请填写大体方位！！');
			}else if($('.maa-address-ok').val().length > 20){
				alert('填写大体方位的字符不能大于20个！！');
			}else if($('.mzxwc-activity-content .maa-x').val() == ''){
				alert('请填写地址经度（X）！！');		
			}else if($('.mzxwc-activity-content .maa-y').val() == ''){
				alert('请填写地址经度（Y）！！');		
			}else if(parseInt($('.mzxwc-activity-content .xiaxian .mt-center-num').html()) == 0){
				alert('请选择成团人数下限！！');
			}else if(parseInt($('.mzxwc-activity-content .shangxian .mt-center-num').html()) == 0){
				alert('请选择成团人数上限！！');
			}else if(parseInt($('.mzxwc-activity-content .shangxian .mt-center-num').html()) < parseInt($('.mzxwc-activity-content .xiaxian .mt-center-num').html())){
				alert('成团人数下限不能大于上限');	
			}else{
				var r = confirm('确定要保存？？');
				if(typeof($('.mzxwc-gl').attr("atId"))!="undefined"){
					//更新活动信息
					if(r == true){
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/salon/work/addOrUpdateSalonDetails/2.5.8',
							type : 'POST',
							dataType : 'json',
							data: data,
							success : function(data){
								if(data.code == 0){
									alert('成功更新！！');
									$(".mzxwc-activity-content").hide();
									$(".xwc_active_detail").show();
									loadXwcPage();
								}
								if(data.code == 1){
									alert(data.data.error);	
								};
							}
						});
					};
				}else{
					//新增活动信息
					if(r == true){
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/salon/work/addOrUpdateSalonDetails/2.5.8',
							type : 'POST',
							dataType : 'json',
							data: data,
							success : function(data){
								if(data.code == 0){
									alert('添加成功！！');
									$(".mzxwc-activity-content").hide();
									$(".xwc_active_detail").show();
									loadXwcPage();
								};
								if(data.code == 1){
									alert(data.data.error);	
								};
							}
						});
						console.log(data);
					}						
				}
			}
	});

	//美妆下午茶“编辑按钮”
	$('.mzxwc-operate .mzxwc-edit').live('click',function(e) {

		//显示加载数据图片以及黑色背景
		/*$('.loading').show();
		$('.graybox').show();*/
		
		$('.mzxwc-activity-content').attr('id','edit');
		$('.mzxwc-gl').attr('atId',$(this).parent().parent().children('td:eq(0)').html());
		$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/salon/work/getSalonDetails/2.5.8',
			type : 'get',
			dataType : 'json',
			data: {atId:$(this).parent().parent().children('td:eq(0)').html()},
			success : function(data){
				$('.xwc_active_detail').hide();
				$('.mzxwc-activity-content').show();
				$('.mzxwc-activity-content .mac-title').val(data.data.title);
				$('.mzxwc-activity-content .mac-content').val(data.data.description);
				$('.mzxwc-activity-content .qian').val(new Date(data.data.startTime).format("yyyy-MM-dd hh:mm:ss"));
				$('.mzxwc-activity-content .hou').val(new Date(data.data.endTime).format("yyyy-MM-dd hh:mm:ss"));
				$('.mzxwc-activity-content .end').val(new Date(data.data.registEndTime).format("yyyy-MM-dd hh:mm:ss"));
				$('.mzxwc-activity-content .mac-cost').val(data.data.price);
				$('.mzxwc-activity-content .mac-id').val(data.data.dresserId);
				$('.mzxwc-activity-content .maa-address').val(data.data.place);
				$('.mzxwc-activity-content .maa-address-ok').val(data.data.shortPlace);
				$('.mzxwc-activity-content .maa-y').val(data.data.lattitude);
				$('.mzxwc-activity-content .maa-x').val(data.data.longitude);
				$('.mzxwc-activity-content .xiaxian .mt-center-num').html(data.data.peopleLow);
				$('.mzxwc-activity-content .shangxian .mt-center-num').html(data.data.peopleHigh);
				$('.mzxwc-activity-content .mac-linkman').val(data.data.linkMan);
				
				//回显所在城市
				$('.mac-activity-address .mine-city option').each(function(index, element) {
					if($(this).html() == data.data.cityName){
						$(this).attr('selected','selected');	
					};
				});
				
				var areaname = data.data.areaName;
				//回显所在城区
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/common/getCountys',
					type : 'get',
					data : ({cityId:$('.mac-activity-address .mine-city option:selected').attr('cityId')}),
					dataType : 'json',  
					success : function(data){
						$('.city option:gt(0)').remove();
						for(var x = 0; x < data.data.length; x ++){
							if(areaname == data.data[x].areaName){
								$('.mac-activity-address .mine-area').append('<option selected="selected" areaId="'+data.data[x].areaId+'" >'+data.data[x].areaName+'</option>');
							}else{
								$('.mac-activity-address .mine-area').append('<option areaId="'+data.data[x].areaId+'">'+data.data[x].areaName+'</option>');
							}
						}
					}
				});
				$('.mzxwc-activity-content  .xwc_active_img .editor_content').createArticleEditor({
					elements: ['image'],
					data:[{type:3,content:''}],//初始化内容
					shouldKeepImage:function(uploadedUrl,width,height){
						var w = parseFloat(width);
						var h = parseFloat(height);
						if(w/h == 640.0/427.0){
							return true;
						}else{
							alert('图片宽高比例错误,图片宽高比须是640:427');
							return false;
						}
					},
					defaultData:[{type:3,content:''}]//编辑器为空时,默认的元素
				});
				$('.mzxwc-activity-content  .xwc_active_img .editor_content .article_editor').html('<img class="image" src="'+data.data.cover+'">');
				for( var i=0; i<data.data.photos.length;i++){
					$('.mzxwc-activity-content  .xwc_active_img .editor_content .article_editor').append('<img class="image" src="'+data.data.photos[i]+'">');
				}
				$('.mzxwc-activity-content  .xwc_active_intro .editor_content').createArticleEditor({
					elements: ['paragraph', 'title', 'image', 'preview', 'fullScreen'],
					data:data.data.introduces,//初始化内容
					defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
				});	
				$('.mzxwc-activity-content  .book_need_know .editor_content').createArticleEditor({
					elements: ['paragraph'],
					data:data.data.rules,//初始化内容
					defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
				});						

			}
		});
	});
	//下线 +
	var xia = 0;
	$('.xiaxian .mt-right-plus').click(function(e) {
		xia = parseInt($('.xiaxian .mt-center-num').html());
		xia = xia+1;
		if(parseInt($('.xiaxian .mt-center-num').html()) > 0){
			$('.xiaxian .mt-left-jian').bind('click');
		};
		$('.xiaxian .mt-center-num').html(xia);
	});
	
	//下线 -
	$('.xiaxian .mt-left-jian').click(function(e) {
		xia = parseInt($('.xiaxian .mt-center-num').html());
		xia = xia-1;
		if(xia < 0){
			$('.xiaxian .mt-center-num').html(0);
		}else{
			$('.xiaxian .mt-center-num').html(xia);
		}
	});
	
	//上线 +
	var xia = 0;
	var imgNum = 0;
	$('.shangxian .mt-right-plus').click(function(e) {
		xia = parseInt($('.shangxian .mt-center-num').html());
		xia = xia+1;
		if(parseInt($('.shangxian .mt-center-num').html()) > 0){
			$('.shangxian .mt-left-jian').bind('click');
		};
		$('.shangxian .mt-center-num').html(xia);
	});
	
	//上线 -
	$('.shangxian .mt-left-jian').click(function(e) {
		xia = parseInt($('.shangxian .mt-center-num').html());
		xia = xia-1;
		if(xia < 0){
			$('.shangxian .mt-center-num').html(0);
		}else{
			$('.shangxian .mt-center-num').html(xia);
		}
	});
	
	
	//点击“增加活动”里面的”取消“按钮
	$('.mzxwc-cancle').click(function(e) {
		clearFn();
		$('.mzxwc-activity-content').hide();
		$('.xwc_active_detail').show();
	});
});
	
//时间格式化
function getLocalTime(publishTime) {
	 var d_minutes,d_hours,d_days;       
		var timeNow = parseInt(new Date().getTime());       
		var d;       
		d = timeNow - publishTime;       
		d_days = parseInt(d/86400);       
		d_hours = parseInt(d/3600);       
		d_minutes = parseInt(d/60);       
		if(d_days>0 && d_days<4){       
			return d_days+"天前";       
		}else if(d_days<=0 && d_hours>0){       
			return d_hours+"小时前";       
		}else if(d_hours<=0 && d_minutes>0){       
			return d_minutes+"分钟前";       
		}else{       
			var s = 0;
			s = new Date(publishTime);       
			return (s.getFullYear()+"-"+parseInt(s.getMonth()+1))+"-"+parseInt(s.getDate());       
		}  
}

//获取查询参数
function getXwcSearchParams(page){
	var params = new Object();
	params.page =1;
	params.title = $('.mzxwc-activity-content .mac-title').val();
	params.description = $('.mzxwc-activity-content .mac-content').val();
	params.startTime = $('.mzxwc-activity-content .qian').val();
	params.endTime = $('.mzxwc-activity-content .hou').val();
	params.registEndTime = $('.mzxwc-activity-content .end').val();
	params.price = $('.mzxwc-activity-content .mac-cost').val();
	params.dresserId = $('.mzxwc-activity-content .mac-id').val();
	params.place = $('.mzxwc-activity-content .maa-address').val();
	params.shortPlace = $('.mzxwc-activity-content .maa-address-ok').val();
	params.lattitude = $('.mzxwc-activity-content .maa-y').val();
	params.longitude = $('.mzxwc-activity-content .maa-x').val();
	params.peopleLow = $('.mzxwc-activity-content .xiaxian .mt-center-num').html();
	params.peopleHigh = $('.mzxwc-activity-content .shangxian .mt-center-num').html();
	params.cover = $('.mzxwc-activity-content .mac-add-img-table tbody tr:eq(2) td:eq(1) #img-add-img').attr('src');
	params.atId = $('.mzxwc-gl').attr('atId');
	params.num = 20;
	return params;
}

//初始化用户分页
function initXwcPage(data){
	$('.mzxwc-gl .mzxwc tbody tr:gt(0)').remove();
	$.each(data.data.pageData,function(key,val){
		var status='';
		if(val.online == 1){
			status = '<input type="button" value="下线" class="redbtn1 mzxwc_status" atId="'+val.atId+'" flag="1"/>';
		}else{
			status = '<input type="button" value="上线" class="bluebtn1 mzxwc_status" atId="'+val.atId+'" flag="0"/>';
		}
		//判断时间是否为null
		var editTime='';
		if(val.editTime == null){
			editTime='';
		}else{
			editTime=getLocalTime(val.editTime);
		}
		$('.mzxwc-gl .mzxwc tbody').append('<tr><td>'+val.atId+'</td><td>'+val.createSysUser+'</td><td>'+val.editSysUser+'</td><td>'+editTime+'</td><td>'+val.title+'</td><td class="mzxwc-cover"><img src="'+val.cover+'" alt="" /></td><td>'+val.dresserName+'</td><td>'+val.time+'</td><td>'+val.place+'</td><td>'+val.linkMan+'</td><td class="mzxwc-operate"><input type="button" value="编辑" class="bluebtn1 mzxwc-edit" /><br /><br />'+status+'</td></tr>');
	});
	
}

//加载用户分页数据
function loadXwcPage(){
	
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/salon/work/listWorks/2.5.8',
		type : 'get',
		dataType : 'json',
		data: getXwcSearchParams(1),
		success : function(data){
			if(data.code == 0){
			//创建分页
			$(".xwc_active_detail .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:createXwcPage
			});
			//渲染页面
			initXwcPage(data);
			}else{
				alert(data.data.error);
			}
		},
	});
}
//根据不同的页码来渲染页面
function createXwcPage(p){
	var data = getXwcSearchParams(p);
	data.page = p;
	
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/salon/work/listWorks/2.5.8',
		type : 'get',
		dataType : 'json',
		data: data,
		success : function(data){
			initXwcPage(data);
		},
	});
};
/**
 * 时间对象的格式化;
 */
Date.prototype.format = function(format) {
    /*
     * eg:format="YYYY-MM-dd hh:mm:ss";
     */
    var o = {
        "M+" :this.getMonth() + 1, // month
        "d+" :this.getDate(), // day
        "h+" :this.getHours(), // hour
        "m+" :this.getMinutes(), // minute
        "s+" :this.getSeconds(), // second
        "q+" :Math.floor((this.getMonth() + 3) / 3), // quarter
        "S" :this.getMilliseconds()
    // millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
    }

    for ( var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

//清空信息
function clearFn(){
	//清空文本框
	$('.mzxwc-activity-content .mac-title').val('');
	$('.mzxwc-activity-content .mac-content').val('');
	$('.mzxwc-activity-content .qian').val('');
	$('.mzxwc-activity-content .hou').val('');
	$('.mzxwc-activity-content .end').val('');
	$('.mzxwc-activity-content .mac-cost').val('');
	$('.mzxwc-activity-content .mac-id').val('');
	$('.mzxwc-activity-content .maa-address').val('');
	$('.mzxwc-activity-content .maa-address-ok').val('');
	$('.mzxwc-activity-content .maa-y').val('');
	$('.mzxwc-activity-content .maa-x').val('');
	$('.mzxwc-activity-content .xiaxian .mt-center-num').html(0);
	$('.mzxwc-activity-content .shangxian .mt-center-num').html(0);
	$('.mzxwc-activity-content .mac-add-img-table tbody tr:gt(1)').remove();
	$('.mac-add-activity-content-table tbody tr:gt(0)').remove();
	$('.mac-add-dressers-content-table tbody tr:gt(0)').remove();
	$('.booking-table tbody tr:gt(0)').remove();
	$('.mzxwc-activity-content .book_need_know_content').val('');
	$('.mzxwc-activity-content .mac-linkman').val('');
	$('.mzxwc-activity-content .mine-city option:eq(0)').attr('selected','selected');
	$('.mzxwc-activity-content .mine-area').prepend('<option value="请选择所在地区" selected>请选择所在地区</option>');
	$('.mzxwc-activity-content .mine-area option:gt(0)').remove();
}



