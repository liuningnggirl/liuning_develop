// JavaScript Document
$(function(){
	getAllHotTopic();
	$(".label_manage_box .label_manage_btn .edit_label").live("click",function(){
			$(this).text("完成");
			$(this).removeClass("edit_label").addClass("save_label");
			$(".labelTypeBox input[type='text']").removeAttr("disabled");
			$(".labelTypeBox .label_name").removeAttr("disabled");
			$(".label_manage_box .label_list .delLabel").show();
			$(".label_manage_box .label_list .labelTypeDetail .addNewLabel,.label_manage_box .label_list .labelTypeDetail .addNewTopicLabel").show();
	})
	/*$(".label_manage_box .label_manage_btn .save_label").live("click",function(){
			$(this).text("编辑");
			$(this).removeClass("save_label").addClass("edit_label");
			$(".labelTypeBox input[type='text']").attr("disabled","disabled");
			$(".labelTypeBox .label_name").attr("disabled","disabled");
			$(".label_manage_box .label_list .delLabel").hide();
			$(".label_manage_box .label_list .labelTypeDetail .addNewLabel,.label_manage_box .label_list .labelTypeDetail .addNewTopicLabel").hide();
		
	})*/
	$(".label_manage_box .label_manage_btn .save_label").live("click",function(){
		
		saveLabelList();
	});
	/*$(".label_manage_box .label_manage_btn .add_label").live("click",function(){
		var str ='';
		str +='<div class="labelTypeBox"><div class="labelBox labelBox1"><input type="text" value="" placeholder="新增标签类型" class="labelType" ><img src="images/ele-del.png" class="delLabelTYpe" alt="" /></div><br/>';
		str +='<div class="labelTypeDetail"><div class="labelBox"><input type="text" value="" placeholder="标签" class="labelone"><img src="images/ele-del.png" class="delLabel" alt="" /></div><input type="button" value="添加" class="addNewLabel"></div></div>';
		$(".label_list").append(str);
	});*/
	$(".label_manage_box .labelTypeDetail .labelBox .delLabel").live("click",function(){
		$(this).parent("").remove();
	});
	/*$(".label_manage_box .labelTypeBox .labelBox .delLabelTYpe").live("click",function(){
		if($(this).prev().val() !=""){
			var r = confirm('确定删除该类型标签？？');
		}else{
			$(this).parent("").parent().remove();	
		}
		if(r == true){
			$(this).parent("").parent().remove();	
		}
	});*/
	$(".label_manage_box .labelTypeDetail .addNewLabel").live("click",function(){
		var str='';
		str +='<div class="labelBox"><input type="text" value="" placeholder="标签" class="labelone"><img src="images/ele-del.png" class="delLabel" alt="" /></div>';
		$(this).before(str);
	});
	$(".label_manage_box .labelTypeDetail .addNewTopicLabel").live("click",function(){
		var str='';
		str +='<div class="labelBox">'+getAllHotTopicDetail()+'<img src="images/ele-del.png" class="delLabel" alt="" /></div>';
		$(this).before(str);
		$(".labelTypeBox .label_name").removeAttr("disabled");
	});
	
})
function getLabelList(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/label/getAllLables/4.0.0',
		type : 'get',
		dataType : 'json',
		data: {},
		success : function(data){
			if(data.code == 0){
				$(".label_manage_box .label_list").empty();
				var str='';
				$.each(data.data,function(key,val){
					str +='<div class="labelTypeBox"><div class="labelBox labelBox1"><p  value="" class="labelType" >'+val.clazz+'</p></div><br/>';
					str +='<div class="labelTypeDetail">';
					if(key ==0){
						$.each(val.labels,function(key,val1){
							str +='<div class="labelBox"><input type="text" value="'+val1.name+'" class="labelone"><img src="images/ele-del.png" class="delLabel" alt="" /></div>';	
						});
						str +='<input type="button" value="添加" class="addNewLabel"></div></div>';
					}else{
						$.each(val.labels,function(key,val1){
							str +='<div class="labelBox">'+getAllHotTopicDetail(val1.topicId)+'<img src="images/ele-del.png" class="delLabel" alt="" /></div>';	
						});
						str +='<input type="button" value="添加" class="addNewTopicLabel"></div></div>';
					}
				});
				$(".label_manage_box .label_list").append(str);
				$(".labelTypeBox input[type='text']").attr("disabled","disabled");
				$(".label_manage_box .label_list .delLabelTYpe,.label_manage_box .label_list .delLabel").hide();
				$(".label_manage_box .label_list .labelTypeDetail .addNewLabel,.label_manage_box .label_list .labelTypeDetail .addNewTopicLabel").hide();
				$(".label_manage_box .label_manage_btn .edit_label").text("编辑")
			}else{
				alert(data.data.error);
			}
		},
	});
}
function saveLabelList(){
	var data = new Array();
	var canSave='';
	$(".labelone").each(function(index, element) {
		if($.trim($(this).val()) == "" ){
			alert("您有标签未添加标签类型！");
			canSave=2;
			return false;
		}
	});
	$('.label_manage_box .label_list .labelTypeBox').each(function(index, element) {
		var labelType=$(this).children(".labelBox1").children(".labelType");
			var label=new Object();
			var labels=new Array();
			label.clazz =labelType.html();
			var biaoqiannum=0;
			var valu=$(this).children(".labelTypeDetail");
			if(index == 0){
				for( var i=0; i<$(valu).children(".labelBox").length; i++){
					if($(valu).children(".labelBox:eq("+i+")").children(".labelone").val().length >10){
						alert("长度不能大于10个字符！");
						canSave=2;
					}else if($.trim($(valu).children(".labelBox:eq("+i+")").children(".labelone").val())!= ""){
						labels[i] = $(valu).children(".labelBox:eq("+i+")").children(".labelone").val();		
					
					}
					
				}
			}else{
				for( var i=0; i<$(valu).children(".labelBox").length; i++){
					if($.trim($(valu).children(".labelBox:eq("+i+")").children(".label_name").val())!= ""){
						labels[i] = $(valu).children(".labelBox:eq("+i+")").children(".label_name").children("option:selected").val();		
					}
				}
			}
			label.labels=labels;
			data.push(label);
			return data;
	
	});
	var labelall = JSON.stringify(data);
	if(canSave != 2){
		$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/label/saveAllLables/4.0.0',
			type : 'post',
			dataType : 'json',
			data: {labels:labelall},
			success : function(data){
				if(data.code == 0){
					alert("保存成功！");
					getLabelList();
					$(".save_label").removeClass("save_label").addClass("edit_label");
					/*$(".labelTypeBox input[type='text']").attr("disabled","disabled");
					$(".label_manage_box .label_list .delLabel").hide();
					$(".label_manage_box .label_list .labelTypeDetail .addNewLabel,.label_manage_box .label_list .labelTypeDetail .addNewTopicLabel").hide();
					$(".label_manage_box .label_manage_btn .edit_label").text("编辑")*/
				}else{
					alert(data.data.error);
				}
			},
		});
	}
}
//获取快递名称详情接口
function getAllHotTopic(){
	$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getAllHotTopic/2.5.3',function(data){
		var data = $.parseJSON(data);
		var str = '';
		if(data.code == 0){
			 $('.label_manage_box').data('getAllHotTopic',data.data);
		}else{
			alert(data.data.error);	
		}	
	});	
}
//获取标签名称详情
	function getAllHotTopicDetail(topicId){
		
		var data = $('.label_manage_box').data('getAllHotTopic');
		if(data != undefined && data.length != undefined){
				var str='';
				str+='<select class="label_name" disabled>';
				$.each(data,function(key,val){
					if(val.topicId ==topicId){
						str+='<option value="'+val.topicId+'" selected class="labelName">'+val.name+'</option>';
					}else{
						str+='<option value="'+val.topicId+'" class="labelName">'+val.name+'</option>';
					}
				})
				str+='</select>';
				return str;
				console.log(str);
		}
		
	};
//获取标签名称详情
	/*function getComHotTopicDetail(topicId){
		
		var data = $('.label_manage_box').data('getAllHotTopic');
		if(data != undefined && data.length != undefined){
				var str='';
				str+='<select class="label_name" disabled>';
				$.each(data,function(key,val){
					str+='<option value="'+val.topicId+'" class="labelName">'+val.name+'</option>';
				})
				str+='</select>';
				return str;
		}
		
	};*/