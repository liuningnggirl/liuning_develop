var testUrl = 'https://testcli.nggirl.com.cn';
$(function(){
	getRecommendListTuanFn();
	//点击社团活动里面的编辑按钮
	$('.community_activity_manage_a .community_freetrail_manage_content .cfmc_btn_edit').live('click',function(e) {
		var btn = $(this);
		btn.addClass('cfmc_btn_success').attr('value','完成').removeClass('cfmc_btn_edit');
        $('.community_activity_manage_a .community_freetrail_manage_content .cfmc_content').each(function(index, element) {
            $(this).children('.cc_type').removeAttr('disabled');
            $(this).children('.cc_id').removeAttr('disabled');
			$(this).children('.cc_tools').show();
        });
    });
	
	//点击社团活动里面的完成按钮
	$('.community_activity_manage_a .community_freetrail_manage_content .cfmc_btn_success').live('click',function(e) {
		var btn = $(this);
		btn.removeClass('cfmc_btn_success').attr('value','编辑').addClass('cfmc_btn_edit');
        $('.community_activity_manage_a .community_freetrail_manage_content .cfmc_content').each(function(index, element) {
            $(this).children('.cc_type').attr('disabled','disabled');
            $(this).children('.cc_id').attr('disabled','disabled');
			$(this).children('.cc_tools').hide();
        });
    });
	
	//社团活动-根据id获取单个帖子信息V3.0.0
	$('.community_activity_manage_a .cfmc_content .cc_tools .cc_modify').live('click',function(e) {
		var btn = $(this);
		$.get(testUrl+'/nggirl-web/web/admin/community/post/getRecommendInfo/3.0.0',{postId:btn.parent().prev().prev().prev().val(),postType:btn.parent().prev().children('option:selected').attr('value')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				btn.parent().parent().children('.cc_txt').val(data.data.title);
				btn.attr('postType',data.data.postType);
				btn.attr('postId',data.data.postId);
				btn.attr('recommendImg',data.data.recommendImg);
				if(data.data.recommendImg == ''){
					alert('该帖子没有头图不能成功保存!!');
					btn.parent().prev().prev().prev().focus();
				};
			}else{
				alert(data.data.error);	
				btn.parent().prev().prev().prev().focus();
			}	
		});
    });
	
	//社团活动-保存推荐的帖子列表V3.0.0
	$('.community_activity_manage_a .community_freetrail_manage_content .cfmc_btn_save').click(function(e) {
		var posts = '';
        $('.community_activity_manage_a .community_freetrail_manage_content .cfmc_content').each(function(index, element) {
			if(typeof($(this).children('.cc_tools').children('.cc_modify').attr('postType')) != "undefined" && $(this).children('.cc_id').attr('value') != ''){
				if($(this).children('.cc_tools').children('.cc_modify').attr('recommendImg') == ''){
					//alert('该帖子没有头图不能保存!!');
				}else{
					posts += '{"postId":"'+$(this).children('.cc_id').attr('value') +'","postType":"'+ $(this).children('.cc_tools').children('.cc_modify').attr('postType')+'"}@';
				}
			};
        });
		posts = posts.substring(0,posts.length-1);
		var arr = new Array();
		var str = '';
		arr = posts.split("@");
		var new_arr=[];
		for(var i=0;i<arr.length;i++) {
		　　var items=arr[i];
		　　//判断元素是否存在于new_arr中，如果不存在则插入到new_arr的最后
		　　if($.inArray(items,new_arr)==-1) {
		　　　　new_arr.push(items);
		　　}
		}

		for(var x = 0; x < new_arr.length; x ++){
			str += new_arr[x]+',';	
		}
		str = '['+str.substring(0,str.length -1)+']';
		
		//posts = '['+posts.substring(0,posts.length-1)+']';
		console.log(posts);
		$.post(testUrl+'/nggirl-web/web/admin/community/post/saveRecommendList/3.0.0',{posts:str},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				getRecommendListTuanFn();
			}else{
				alert(data.data.error);	
			}	
		});
    });
	
	//下移元素
	$('.community_activity_manage_a .cfmc_content .cc_tools .cc_arr_down').live('click',function(event) {
		var next= $(this).closest('.cfmc_content').next();  
		$(this).closest('.cfmc_content').insertAfter(next);		
	});
	
	//上移元素
	$('.community_activity_manage_a .cfmc_content .cc_tools .cc_arr_up').live('click',function(event) {
		var pre= $(this).closest('.cfmc_content').prev();  
		$(this).closest('.cfmc_content').insertBefore(pre);		
	});
});

//社团活动-获取推荐的帖子列表V3.0.0
function getRecommendListTuanFn(){
	$('.community_activity_manage_a .community_freetrail_manage_content .cfmc_btn_success').removeClass('cfmc_btn_success').attr('value','编辑').addClass('cfmc_btn_edit');
	$('.community_activity_manage_a .community_freetrail_manage_content .cfmc_box').children('.cfmc_content').remove();
	$.get(testUrl+'/nggirl-web/web/admin/community/post/getRecommendList/3.0.0',function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.length < 3 && data.data.length !=0){
				for(var x = 0; x < data.data.length; x ++){
					if(data.data[x].postType == 1){
					$('.community_activity_manage_a .community_freetrail_manage_content .cfmc_box').append('<div class="cfmc_content"><input type="text" class="cc_txt" disabled="disabled" value="'+data.data[x].title+'" /><label for=""> ID: </label><input type="text" class="cc_id" value="'+data.data[x].postId+'" disabled="disabled" /><label for=""> 帖子类型: </label><select class="cc_type" style="padding: 9px;border-radius: 5px;    border: 1px solid #ccc;" disabled="disabled"><option value="">请选择帖子类型</option><option value="1" selected="selected">文章</option><option value="2">视频</option></select><span class="cc_tools" style="display:none;"><img src="../common/images/img_xiugai.png" class="cc_modify" postType='+data.data[x].postType+' postId='+data.data[x].postId+' alt="" /><img src="../common/images/img_arr_down.png" class="cc_arr_down" alt="" /><img src="../common/images/img_arr_up.png" class="cc_arr_up" alt="" /></span></div>');
					}else if(data.data[x].postType == 2){
					$('.community_activity_manage_a .community_freetrail_manage_content .cfmc_box').append('<div class="cfmc_content"><input type="text" class="cc_txt" disabled="disabled" value="'+data.data[x].title+'" /><label for=""> ID: </label><input type="text" class="cc_id" value="'+data.data[x].postId+'" disabled="disabled" /><label for=""> 帖子类型: </label><select class="cc_type" style="padding: 9px;border-radius: 5px;    border: 1px solid #ccc;" disabled="disabled"><option value="">请选择帖子类型</option><option value="1">文章</option><option value="2" selected="selected">视频</option></select><span class="cc_tools" style="display:none;"><img src="../common/images/img_xiugai.png" class="cc_modify" postType='+data.data[x].postType+' postId='+data.data[x].postId+' alt="" /><img src="../common/images/img_arr_down.png" class="cc_arr_down" alt="" /><img src="../common/images/img_arr_up.png" class="cc_arr_up" alt="" /></span></div>');
					}
				}
				for(var x = 0; x < (3- data.data.length); x ++){
					$('.community_activity_manage_a .community_freetrail_manage_content .cfmc_box').append('<div class="cfmc_content"><input type="text" class="cc_txt" disabled="disabled" value="" /><label for=""> ID: </label><input type="text" class="cc_id" value="" disabled="disabled" /><label for=""> 帖子类型: </label><select class="cc_type" style="padding: 9px;border-radius: 5px; border: 1px solid #ccc;" disabled="disabled"><option value="">请选择帖子类型</option><option value="1">文章</option><option value="2">视频</option></select><span class="cc_tools" style="display:none;"><img src="../common/images/img_xiugai.png" class="cc_modify" alt="" /><img src="../common/images/img_arr_down.png" class="cc_arr_down" alt="" /><img src="../common/images/img_arr_up.png" class="cc_arr_up" alt="" /></span></div>');
				}
			}else if(data.data.length == 0){
				for(var x = 0; x < 3; x ++){
					$('.community_activity_manage_a .community_freetrail_manage_content .cfmc_box').append('<div class="cfmc_content"><input type="text" class="cc_txt" disabled="disabled" value="" /><label for=""> ID: </label><input type="text" class="cc_id" value="" disabled="disabled" /><label for=""> 帖子类型: </label><select class="cc_type" style="padding: 9px;border-radius: 5px; border: 1px solid #ccc;" disabled="disabled"><option value="">请选择帖子类型</option><option value="1">文章</option><option value="2">视频</option></select><span class="cc_tools" style="display:none;"><img src="../common/images/img_xiugai.png" class="cc_modify" alt="" /><img src="../common/images/img_arr_down.png" class="cc_arr_down" alt="" /><img src="../common/images/img_arr_up.png" class="cc_arr_up" alt="" /></span></div>');
				}
			}else{
				for(var x = 0; x < 3; x ++){
					if(data.data[x].postType == 1){
						$('.community_activity_manage_a .community_freetrail_manage_content .cfmc_box').append('<div class="cfmc_content"><input type="text" class="cc_txt" disabled="disabled" value="'+data.data[x].title+'" /><label for=""> ID: </label><input type="text" class="cc_id" value="'+data.data[x].postId+'" disabled="disabled" /><label for=""> 帖子类型: </label><select class="cc_type" style="padding: 9px;border-radius: 5px; border: 1px solid #ccc;" disabled="disabled"><option value="">请选择帖子类型</option><option value="1" selected="selected">文章</option><option value="2">视频</option></select><span class="cc_tools" style="display:none;"><img src="../common/images/img_xiugai.png" class="cc_modify" postType='+data.data[x].postType+' postId='+data.data[x].postId+' alt="" /><img src="../common/images/img_arr_down.png" class="cc_arr_down" alt="" /><img src="../common/images/img_arr_up.png" class="cc_arr_up" alt="" /></span></div>');
					}else if(data.data[x].postType == 2){
						$('.community_activity_manage_a .community_freetrail_manage_content .cfmc_box').append('<div class="cfmc_content"><input type="text" class="cc_txt" disabled="disabled" value="'+data.data[x].title+'" /><label for=""> ID: </label><input type="text" class="cc_id" value="'+data.data[x].postId+'" disabled="disabled" /><label for=""> 帖子类型: </label><select class="cc_type" style="padding: 9px;border-radius: 5px; border: 1px solid #ccc;" disabled="disabled"><option value="">请选择帖子类型</option><option value="1">文章</option><option value="2" selected="selected">视频</option></select><span class="cc_tools" style="display:none;"><img src="../common/images/img_xiugai.png" class="cc_modify" postType='+data.data[x].postType+' postId='+data.data[x].postId+' alt="" /><img src="../common/images/img_arr_down.png" class="cc_arr_down" alt="" /><img src="../common/images/img_arr_up.png" class="cc_arr_up" alt="" /></span></div>');
					}
				}
			}
		}else{
			alert(data.data.error);	
		}	
	});
}