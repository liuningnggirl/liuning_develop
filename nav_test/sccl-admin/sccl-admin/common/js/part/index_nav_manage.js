var testUrl = 'https://testcli.nggirl.com.cn';
$(function(){
	getKindsListFn();	
	//获取跳转类型V2.4.0
	$.get(testUrl+'/nggirl-web/web/admin/banner/getForwardTypes/2.4.0',function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			for(var x = 0; x < data.data.length; x ++){
				$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_kinds').append('<option forwardtype="'+data.data[x].forwardtype+'" isForwardkeyRequired="'+data.data[x].isForwardkeyRequired+'" forwardkeyDesc="'+data.data[x].forwardkeyDesc+'">'+data.data[x].forwardtypeName+'</option>');
			}
		}else{
			alert(data.data.error);	
		}	
	});
	
	//新增专栏模块
	$('.index_nav_btn .index_nav_btn_add').click(function(e) {
        $('.index_nav_manage_box .index_nav_lan').append('<div class="index_nav_lan_li"><div class="index_nav_lan_li_san" style="overflow:hidden;"><div class="inl_lan_name" contenteditable="true">新增专栏'+(parseInt($('.index_nav_lan .index_nav_lan_li').length)+1)+'</div><input type="text" class="inl_lan_index" /><img src="../common/images/img_delete.png" alt="" class="inl_lan_del" style=" width:30px; padding:3px;" /></div><input type="button" value="配置跳转页面" style=" display:block;" class="inl_lan_href" /></div>');
    });
	
	//编辑专栏模块
	$('.index_nav_btn .index_nav_btn_edit').live("click",function(e) {
		var btn = $(this);
		$(',.index_nav_lan_li .inl_lan_toggle,.index_nav_lan_li .inl_lan_href,.index_nav_lan_li .inl_lan_del,.index_nav_lan_li .inl_lan_modify_name').show();
		$('.index_nav_lan_li .inl_lan_name').attr('contenteditable','true');
		btn.removeClass('index_nav_btn_edit').addClass('index_nav_btn_complete').attr('value','完成');
		$('.index_nav_lan_li .inl_lan_index').removeAttr('disabled');
	});
	
	//完成专栏模块
	$('.index_nav_btn .index_nav_btn_complete').live("click",function(e) {
		var btn = $(this);
		$('.index_nav_lan_li .inl_lan_toggle,.index_nav_lan_li .inl_lan_href,.index_nav_lan_li .inl_lan_del,.index_nav_lan_li .inl_lan_modify_name').hide();
		$('.index_nav_lan_li .inl_lan_name').attr('contenteditable','false');
		btn.removeClass('index_nav_btn_complete').addClass('index_nav_btn_edit').attr('value','编辑');
		$('.index_nav_lan_li .inl_lan_index').attr('disabled','disabled');
	});
	
	//点击配置跳转页面
	//获取分类按钮详情V3.0.0
	$('.index_nav_lan_li .inl_lan_href').live('click',function(e) {
		var btn = $(this);
		//判断是新增还是修改
		if(typeof(btn.attr('sortButtonId')) == "undefined"){
			//清空原有信息
			$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_img').removeAttr('src');
			$('.index_nav_manage_redirect_page .index_nav_manage_shareimg').removeAttr('src');
			$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_href').val('');
			$('.index_nav_manage_redirect_page .index_nav_manage_sharecontent').val('');
			$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_kinds option:eq(0)').attr('selected','selected');
			$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_get_url').val('');
			$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_get_forwardkey_desc_desc').html('');
			$('.index_nav_manage_redirect_page').removeAttr('sortButtonId');
			$('.index_nav_manage_redirect_page').attr('name',btn.prev().children('div').html());
			
			$('.index_nav_manage_redirect_page').show();
			$('.index_nav_manage_box').hide();
		}else{
			$.get(testUrl+'/nggirl-web/web/admin/homepage/getSortButtonDetail/3.0.0',{sortButtonId:btn.attr('sortButtonId')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_img').attr('src',data.data.photoUrl);
					$('.index_nav_manage_redirect_page .index_nav_manage_shareimg').attr('src',data.data.shareImg);
					$('.index_nav_manage_redirect_page .index_nav_manage_sharecontent').val(data.data.shareContent);
					$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_href').val(data.data.webPageUrl);
					$('.index_nav_manage_redirect_page').show().attr('sortButtonId',btn.attr('sortButtonId'));
					$('.index_nav_manage_redirect_page').attr('name',btn.prev().children('div').html());
					$('.index_nav_manage_box').hide();
	
					$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_kinds option').each(function(index, element) {
						if($(this).attr('forwardType') == data.data.forwardType){
							$(this).attr('selected','selected');
							$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_get_forwardkey_desc_desc').html($(this).attr('forwardkeyDesc'));
							if($(this).attr('isForwardkeyRequired') == 0){
								$('.index_nav_manage_redirect_page_get_url_forwardkey,.index_nav_manage_redirect_page_get_forwardkey_desc').hide();
							}
							if($(this).attr('isForwardkeyRequired') == 1){
								$('.index_nav_manage_redirect_page_get_url_forwardkey,.index_nav_manage_redirect_page_get_forwardkey_desc').show();
							}
						}
						if(data.data.forwardKey == '' || data.data.forwardKey == null){
							$('.index_nav_manage_redirect_page_get_url_forwardkey,.index_nav_manage_redirect_page_get_forwardkey_desc').hide();
							$('.index_nav_manage_redirect_page_get_url').val('');
							$('.index_nav_manage_redirect_page_get_forwardkey_desc_desc').html('');
							$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_kinds option:eq(0)').attr('selected','selected');
						};
					});
					$('.index_nav_manage_redirect_page_get_url').val(data.data.forwardKey);
					
				}else{
					alert(data.data.error);	
				}	
			});
		}
    });
	
	//获取原生页面对应的H5跳转链接V2.4.0
	$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_get_url_btn').click(function(e) {
		$.get(testUrl+'/nggirl-web/web/admin/banner/getForwardH5Url/2.4.0',{forwardtype:$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_kinds option:selected').attr('forwardtype'),forwardkey:$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_get_url').val()},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_href').val(data.data.h5url);
			}else{
				alert(data.data.error);	
			}
		});
    });
	
	//选择不同的跳转类型
	$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_kinds').change(function(e) {
        //判断isForwardkeyRequired是否必填，1必填，0不填写
		if($(this).children('option:selected').attr('isForwardkeyRequired') == 0){
			//$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_get_forwardkey_desc').hide();
			$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_href').val('');
		}
		if($(this).children('option:selected').attr('isForwardkeyRequired') == 1){
			$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_get_forwardkey_desc').show();
		}
		$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_get_forwardkey_desc .index_nav_manage_redirect_page_get_forwardkey_desc_desc').html($(this).children('option:selected').attr('forwardkeyDesc'));
    });
	
	//编辑分类按钮V3.0.0
	//点击完成按钮
	$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_success_btn').click(function(e) {
		//判断是新增还是编辑
		if(typeof($('.index_nav_manage_redirect_page').attr('sortButtonId')) == 'undefined'){
			if(typeof($('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_img').attr('src')) == "undefined"){
				alert('请上传导航头图');
			}else if($.trim($('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_href').val()) == ''){
				alert('请选择类型获取跳转地址');
			}else if(typeof($('.index_nav_manage_redirect_page .index_nav_manage_shareimg').attr('src')) == "undefined"){
				alert('请上传分享小图');
			}else if($.trim($('.index_nav_manage_redirect_page .index_nav_manage_sharecontent').val()) == ''){
				alert('请填写分享内容');
			}else{
				$.post(testUrl+'/nggirl-web/web/admin/homepage/addOrEditSortButton/3.0.0',{forwardType:$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_kinds option:selected').attr('forwardType'),forwardKey:$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_get_url').val(),name:$('.index_nav_manage_redirect_page').attr('name'),photoUrl:$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_img').attr('src'),webPageUrl:$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_href').val(),shareImg:$('.index_nav_manage_redirect_page .index_nav_manage_shareimg').attr('src'),shareContent:$.trim($('.index_nav_manage_redirect_page .index_nav_manage_sharecontent').val())},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						$('.index_nav_manage_redirect_page').hide();
						$('.index_nav_manage_box').show();
						$('.index_nav_lan').children('div').remove();
						getKindsListFn();
						$('.index_nav_btn .index_nav_btn_complete').removeClass('index_nav_btn_complete').addClass('index_nav_btn_edit').attr('value','编辑');
					}else{
						alert(data.data.error);	
					}
				});
			}
		}else{
			if(typeof($('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_img').attr('src')) == "undefined"){
				alert('请上传导航头图');
			}else if($.trim($('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_href').val()) == ''){
				alert('请选择类型获取跳转地址');
			}else if(typeof($('.index_nav_manage_redirect_page .index_nav_manage_shareimg').attr('src')) == "undefined"){
				alert('请上传分享小图');
			}else if($.trim($('.index_nav_manage_redirect_page .index_nav_manage_sharecontent').val()) == ''){
				alert('请填写分享内容');
			}else{
				$.post(testUrl+'/nggirl-web/web/admin/homepage/addOrEditSortButton/3.0.0',{sortButtonId:$('.index_nav_manage_redirect_page').attr('sortButtonId'),forwardType:$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_kinds option:selected').attr('forwardType'),forwardKey:$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_get_url').val(),name:$('.index_nav_manage_redirect_page').attr('name'),photoUrl:$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_img').attr('src'),webPageUrl:$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_href').val(),shareImg:$('.index_nav_manage_redirect_page .index_nav_manage_shareimg').attr('src'),shareContent:$.trim($('.index_nav_manage_redirect_page .index_nav_manage_sharecontent').val())},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						$('.index_nav_manage_redirect_page').hide();
						$('.index_nav_manage_box').show();
						$('.index_nav_lan').children('div').remove();
						getKindsListFn();
						$('.index_nav_btn .index_nav_btn_complete').removeClass('index_nav_btn_complete').addClass('index_nav_btn_edit').attr('value','编辑');
					}else{
						alert(data.data.error);	
					}
				});
			}
		}
    });
	
	//点击配置跳转页面的取消按钮
	$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_cancle_btn').click(function(e) {
        $('.index_nav_manage_redirect_page').hide();
		$('.index_nav_manage_box').show();
    });
	
	//更改图片
	$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_img').click(function(e) {
        $('.index_nav_manage_redirect_page #index_nav_manage_redirect_page_img_input').click();
    });	
	$('.index_nav_manage_redirect_page #index_nav_manage_redirect_page_img_input').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('.index_nav_manage_redirect_page .index_nav_manage_redirect_page_img').attr('src',data.result.data.url);
		}
	});	
	
	//上传分享小图图片
	$('.index_nav_manage_redirect_page .index_nav_manage_shareimg').click(function(e) {
        $('.index_nav_manage_redirect_page #index_nav_manage_shareimg_input').click();
    });	
	$('.index_nav_manage_redirect_page #index_nav_manage_shareimg_input').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('.index_nav_manage_redirect_page .index_nav_manage_shareimg').attr('src',data.result.data.url);
		}
	});	
	
	//选择不同的跳转类型
	$('.index_nav_manage_redirect_page_kinds').change(function(e) {
        //判断isForwardkeyRequired是否必填，1必填，0不填写
		if($(this).children('option:selected').attr('isForwardkeyRequired') == 0){
			$('.index_nav_manage_redirect_page_get_url').val('');
			$('.index_nav_manage_redirect_page_get_url_forwardkey,.index_nav_manage_redirect_page_get_forwardkey_desc').hide();
		}
		if($(this).children('option:selected').attr('isForwardkeyRequired') == 1){
			$('.index_nav_manage_redirect_page_get_url_forwardkey,.index_nav_manage_redirect_page_get_forwardkey_desc').show();
		}
		$('.index_nav_manage_redirect_page_get_forwardkey_desc_desc').html($(this).children('option:selected').attr('forwardkeyDesc'));
    });
		
	//发布分类按钮V3.0.0
	//点击导航控制里的保存按钮
	$('.index_nav_manage_box .index_nav_btn_save').click(function(e) {
		var buttonIds = '';
		$('.index_nav_manage_box .index_nav_lan .index_nav_lan_li').each(function(index, element) {
            buttonIds += '{"sortButtonId":' + $(this).attr('sortButtonId') +',"seq":"' + $(this).children('div').children('input').attr('value') +'"},';
        });
		buttonIds = '['+buttonIds.substring(0, buttonIds.length -1)+']';
		if(buttonIds.indexOf("undefined")>-1){
			alert('新增专栏必须先配置跳转页面才能保存！！');
		}else{
			var r = confirm('确定要保存？');
			if(r == true){
				$.post(testUrl+'/nggirl-web/web/admin/homepage/publishSortButton/3.0.0',{buttonIds:buttonIds},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						$('.index_nav_lan').children('div').remove();
						getKindsListFn();
						$('.index_nav_btn .index_nav_btn_complete').removeClass('index_nav_btn_complete').addClass('index_nav_btn_edit').attr('value','编辑');
					}else{
						alert(data.data.error);	
					}
				});
			};
		}
    });
	
	//删除分类按钮V3.0.0
	$('.index_nav_lan_li_san .inl_lan_del').live('click',function(){
		var btn = $(this);
		//判断sortButtonId是否存在
		if(typeof(btn.attr('sortButtonId')) == "undefined"){
			btn.parent().parent().remove();
		}else{
			var r = confirm('确定要删除？？');
			if(r == true){
				$.post(testUrl+'/nggirl-web/web/admin/homepage/deleteSortButton/3.0.0',{sortButtonId:btn.attr('sortButtonId')},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						btn.parent().parent().remove();
					}else{
						alert(data.data.error);	
					}
				});
			};
		}
	});
	
	//修改分类按钮名称V3.0.0
	$('.index_nav_lan .index_nav_lan_li .inl_lan_modify_name').live("click",function(e) {
		var btn = $(this);
		$.post(testUrl+'/nggirl-web/web/admin/homepage/updateSortButtonName/3.0.0',{sortButtonId:btn.attr('sortButtonId'),name:btn.prev().prev().children('div').html()},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.index_nav_lan').children('div').remove();
				getKindsListFn();
				$('.index_nav_btn .index_nav_btn_complete').removeClass('index_nav_btn_complete').addClass('index_nav_btn_edit').attr('value','编辑');
			}else{
				alert(data.data.error);	
			}
		});
    });
})

//获取分类按钮列表V3.0.0
function getKindsListFn(){
	$.get(testUrl+'/nggirl-web/web/admin/homepage/sortButtonList/3.0.0',function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.length > 0){
				for(var x = 0; x < data.data.length ; x ++){
					if(data.data[x].seq == null){
						$('.index_nav_manage_box .index_nav_lan').append('<div class="index_nav_lan_li" sortButtonId="'+data.data[x].sortButtonId+'" seq=""><div class="index_nav_lan_li_san" style="overflow:hidden;"><div class="inl_lan_name" contenteditable="false">'+data.data[x].name+'</div><input type="text" class="inl_lan_index" disabled="disabled" value="" /><img src="../common/images/img_delete.png" alt="" class="inl_lan_del" style=" display:none; width:30px; padding:3px;" sortButtonId="'+data.data[x].sortButtonId+'" /></div><input type="button" value="配置跳转页面" class="inl_lan_href" name="'+data.data[x].name+'" sortButtonId="'+data.data[x].sortButtonId+'" /><input type="button" value="修改完成" class="inl_lan_modify_name" name="'+data.data[x].name+'" sortButtonId="'+data.data[x].sortButtonId+'" /></div>');
					}else{
						$('.index_nav_manage_box .index_nav_lan').append('<div class="index_nav_lan_li" sortButtonId="'+data.data[x].sortButtonId+'" seq="'+data.data[x].seq+'"><div class="index_nav_lan_li_san" style="overflow:hidden;"><div class="inl_lan_name" contenteditable="false">'+data.data[x].name+'</div><input type="text" class="inl_lan_index" disabled="disabled" value="'+data.data[x].seq+'" /><img src="../common/images/img_delete.png" alt="" class="inl_lan_del" style=" display:none; width:30px; padding:3px;" sortButtonId="'+data.data[x].sortButtonId+'" /></div><input type="button" value="配置跳转页面" class="inl_lan_href" name="'+data.data[x].name+'" sortButtonId="'+data.data[x].sortButtonId+'" /><input type="button" value="修改完成" class="inl_lan_modify_name" name="'+data.data[x].name+'" sortButtonId="'+data.data[x].sortButtonId+'" /></div>');
					}
				};
			};
		}else{
			alert(data.data.error);	
		}	
	});
}