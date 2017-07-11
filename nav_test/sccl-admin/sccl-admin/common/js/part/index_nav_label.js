var testUrl = 'https://testcli.nggirl.com.cn';
$(function(){
	getNavLabelListFn();	
	//新增专栏模块
	$('.index_label_btn .index_label_btn_add').click(function(e) {
			$('.index_nav_label_box .index_nav_list').append('<div class="index_nav_list_li"><div class="index_nav_list_li_san" style="overflow:hidden;"><div class="inl_list_name" contenteditable="true">新增导航栏标签'+(parseInt($('.index_nav_list .index_nav_list_li').length)+1)+'</div><input type="text" class="inl_lan_seq" /><img src="../common/images/img_delete.png" alt="" class="inl_label_del" style=" width:30px; padding:3px;" /><input type="button" value="保存" class="index_label_btn_edit" style="padding:10px 40px; border-radius:5px; vertical-align: top;" /></div></div>');
	});
	
	//编辑专栏模块
	$('.index_nav_list_li .index_label_btn_edit').live("click",function(e) {
		if($(this).val()=="编辑"){
			var btn = $(this);
			btn.siblings('.inl_label_del').show();
			btn.siblings('.inl_list_name').attr('contenteditable','true');
			btn.attr('value','保存');
			btn.siblings('.inl_lan_seq').removeAttr('disabled');
		}else{
			addOrUpdateLabelButton($(this));
		}
		
	});
	//删除分类按钮V3.0.0
	$('.index_nav_list_li_san .inl_label_del').live('click',function(){
		var btn = $(this);
		//判断id是否存在
		if(typeof(btn.attr('id')) == "undefined"){
			btn.parent().parent().remove();
		}else{
			var r = confirm('确定要删除？？');
			if(r == true){
				$.post(testUrl+'/nggirl-web/web/admin/homepage/deleteLabelButton/4.0.0',{id:btn.attr('id')},function(data){
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
	
})

//获取分类按钮列表V3.0.0
function getNavLabelListFn(){
	$('.index_nav_list').children('div').remove();
	$.get(testUrl+'/nggirl-web/web/admin/homepage/labelButtonList/4.0.0',function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.length > 0){
				for(var x = 0; x < data.data.length ; x ++){
					if(data.data[x].seq == null){
						$('.index_nav_label_box .index_nav_list').append('<div class="index_nav_list_li" id="'+data.data[x].id+'" seq=""><div class="index_nav_list_li_san" style="overflow:hidden;"><div class="inl_list_name" contenteditable="false">'+data.data[x].name+'</div><input type="text" class="inl_lan_seq" disabled="disabled" value="" /><img src="../common/images/img_delete.png" alt="" class="inl_label_del" style=" display:none; width:30px; padding:3px;" id="'+data.data[x].id+'" /><input type="button" value="编辑" class="index_label_btn_edit" style="padding:10px 40px; border-radius:5px; vertical-align: top;" /></div></div>');
					}else{
						$('.index_nav_label_box .index_nav_list').append('<div class="index_nav_list_li" id="'+data.data[x].id+'" seq="'+data.data[x].seq+'"><div class="index_nav_list_li_san" style="overflow:hidden;"><div class="inl_list_name" contenteditable="false">'+data.data[x].name+'</div><input type="text" class="inl_lan_seq" disabled="disabled" value="'+data.data[x].seq+'" /><img src="../common/images/img_delete.png" alt="" class="inl_label_del" style=" display:none; width:30px; padding:3px;" id="'+data.data[x].id+'" /><input type="button" value="编辑" class="index_label_btn_edit" style="padding:10px 40px; border-radius:5px;vertical-align: top;" /></div></div>');
					}
				};
			};
		}else{
			alert(data.data.error);	
		}	
	});
}
//点击导航控制里的保存按钮
function addOrUpdateLabelButton(del){
        if(del.siblings('.inl_list_name').text().length >5){
			alert("标签不能超过5个字符！");
		    return false;
		}else{
			var r = confirm('确定要保存？');
		}
		
		if(r == true){
			$.post(testUrl+'/nggirl-web/web/admin/homepage/addOrUpdateLabelButton/4.0.0',{id:del.parent().parent().attr('id'),name:del.siblings('.inl_list_name').text(),seq:del.siblings('.inl_lan_seq').attr('value')},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					alert("保存成功！！");
					getNavLabelListFn();
					$('.index_label_btn .index_label_btn_add').attr('value','新增');
					del.attr('value','编辑');
				}else{
					alert(data.data.error);	
				}
			});
		};
	/*}*/
}
	