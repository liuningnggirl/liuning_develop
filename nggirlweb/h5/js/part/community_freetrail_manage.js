$(function(){
	//点击免费试用里面的编辑按钮
	$('.community_freetrail_manage_a .community_freetrail_manage_content .cfmc_btn_edit').live('click',function(e) {
		var btn = $(this);
		btn.addClass('cfmc_btn_success').attr('value','完成').removeClass('cfmc_btn_edit');
        $('.community_freetrail_manage_a .community_freetrail_manage_content .cfmc_content').each(function(index, element) {
            //$(this).children('.cc_txt').removeAttr('disabled');
            $(this).children('.cc_id').removeAttr('disabled');
			$(this).children('.cc_tools').show();
        });
    });
	
	//点击免费试用里面的完成按钮
	$('.community_freetrail_manage_a .community_freetrail_manage_content .cfmc_btn_success').live('click',function(e) {
		var btn = $(this);
		btn.removeClass('cfmc_btn_success').attr('value','编辑').addClass('cfmc_btn_edit');
        $('.community_freetrail_manage_a .community_freetrail_manage_content .cfmc_content').each(function(index, element) {
            //$(this).children('.cc_txt').attr('disabled','disabled');
            $(this).children('.cc_id').attr('disabled','disabled');
			$(this).children('.cc_tools').hide();
        });
    });
	
	//免费试妆-根据id获取单个免费试妆信息V3.0.0
	$('.community_freetrail_manage_a .cfmc_content .cc_tools .cc_modify').live('click',function(e) {
		var btn = $(this);
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/cosmeticTrial/getRecommendInfo/3.0.0',{cosmeticId:btn.parent().prev().val()},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				btn.parent().parent().children('.cc_txt').val(data.data.name);
				btn.attr('cosmeticId',data.data.cosmeticId);
			}else{
				alert(data.data.error);	
				btn.parent().prev().focus();
			}	
		});
    });
	
	//免费试妆-保存推荐的免费试妆列表V3.0.0
	$('.community_freetrail_manage_a .community_freetrail_manage_content .cfmc_btn_save').click(function(e) {
		var cosmeticIds = '';
        $('.community_freetrail_manage_a .community_freetrail_manage_content .cfmc_content').each(function(index, element) {
			if($(this).children('.cc_id').attr('value') != ''){
				cosmeticIds += $(this).children('.cc_id').attr('value') +',';
			};
        });
		cosmeticIds = cosmeticIds.substring(0,cosmeticIds.length-1);
		var arr = new Array();
		var str = '';
		arr = cosmeticIds.split(",");
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
		str = str.substring(0,str.length -1);

		//console.log(cosmeticIds);
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/cosmeticTrial/saveRecommendList/3.0.0',{cosmeticIds:str},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				getRecommendListFn();
			}else{
				alert(data.data.error);	
			}	
		});
    });
	
	//下移元素
	$('.community_freetrail_manage_a .cfmc_content .cc_tools .cc_arr_down').live('click',function(event) {
		var next= $(this).closest('.cfmc_content').next();  
		$(this).closest('.cfmc_content').insertAfter(next);		
	});
	
	//上移元素
	$('.community_freetrail_manage_a .cfmc_content .cc_tools .cc_arr_up').live('click',function(event) {
		var pre= $(this).closest('.cfmc_content').prev();  
		$(this).closest('.cfmc_content').insertBefore(pre);		
	});
});

//免费试妆-获取推荐的免费试妆列表V3.0.0
function getRecommendListFn(){
	$('.community_freetrail_manage_a .community_freetrail_manage_content .cfmc_btn_success').removeClass('cfmc_btn_success').attr('value','编辑').addClass('cfmc_btn_edit');
	$('.community_freetrail_manage_a .community_freetrail_manage_content .cfmc_box').children('.cfmc_content').remove();
	$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/cosmeticTrial/getRecommendList/3.0.0',function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.length < 3 && data.data.length != 0){
				for(var x = 0; x < data.data.length; x ++){
					$('.community_freetrail_manage_a .community_freetrail_manage_content .cfmc_box').append('<div class="cfmc_content"><input type="text" class="cc_txt" disabled="disabled" value="'+data.data[x].name+'" /><label for=""> ID: </label><input type="text" class="cc_id" value="'+data.data[x].cosmeticId+'" disabled="disabled" /><span class="cc_tools" style="display:none;"><img src="images/img_xiugai.png" class="cc_modify" cosmeticId='+data.data[x].cosmeticId+' alt="" /><img src="images/img_arr_down.png" class="cc_arr_down" alt="" /><img src="images/img_arr_up.png" class="cc_arr_up" alt="" /></span></div>');
				}
				for(var x = 0; x < (3-data.data.length); x ++){
					$('.community_freetrail_manage_a .community_freetrail_manage_content .cfmc_box').append('<div class="cfmc_content"><input type="text" class="cc_txt" disabled="disabled" value="" /><label for=""> ID: </label><input type="text" class="cc_id" value="" disabled="disabled" /><span class="cc_tools" style="display:none;"><img src="images/img_xiugai.png" class="cc_modify" alt="" /><img src="images/img_arr_down.png" class="cc_arr_down" alt="" /><img src="images/img_arr_up.png" class="cc_arr_up" alt="" /></span></div>');
				}
			}else if(data.data.length == 0){
				$('.community_freetrail_manage_a .community_freetrail_manage_content .cfmc_box').append('<div class="cfmc_content"><input type="text" class="cc_txt" disabled="disabled" value="" /><label for=""> ID: </label><input type="text" class="cc_id" value="" disabled="disabled" /><span class="cc_tools" style="display:none;"><img src="images/img_xiugai.png" class="cc_modify" alt="" /><img src="images/img_arr_down.png" class="cc_arr_down" alt="" /><img src="images/img_arr_up.png" class="cc_arr_up" alt="" /></span></div>');
			}else{
				for(var x = 0; x < 3; x ++){
					$('.community_freetrail_manage_a .community_freetrail_manage_content .cfmc_box').append('<div class="cfmc_content"><input type="text" class="cc_txt" disabled="disabled" value="'+data.data[x].name+'" /><label for=""> ID: </label><input type="text" class="cc_id" value="'+data.data[x].cosmeticId+'" disabled="disabled" /><span class="cc_tools" style="display:none;"><img src="images/img_xiugai.png" class="cc_modify" cosmeticId='+data.data[x].cosmeticId+' alt="" /><img src="images/img_arr_down.png" class="cc_arr_down" alt="" /><img src="images/img_arr_up.png" class="cc_arr_up" alt="" /></span></div>');
				}
			}
		}else{
			alert(data.data.error);	
		}	
	});
}