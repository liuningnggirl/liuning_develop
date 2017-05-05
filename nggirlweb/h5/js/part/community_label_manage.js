// JavaScript Document
$(function(){
	$(".label_manage_box .label_manage_btn .edit_label").live("click",function(){
		if($(this).text() == "编辑"){
			$(this).text("完成");
			$(".labelTypeBox input[type='text']").removeAttr("disabled");
			$(".label_manage_box .label_list .delLabelTYpe,.label_manage_box .label_list .delLabel").show();
			$(".label_manage_box .label_list .labelTypeDetail .addNewLabel").show();
		}else{
			$(this).text("编辑");
			$(".labelTypeBox input[type='text']").attr("disabled","disabled");
			$(".label_manage_box .label_list .delLabelTYpe,.label_manage_box .label_list .delLabel").hide();
			$(".label_manage_box .label_list .labelTypeDetail .addNewLabel").hide();
		}
	})
	$(".label_manage_box .label_manage_btn .save_label").live("click",function(){
		saveLabelList();
	});
	$(".label_manage_box .label_manage_btn .add_label").live("click",function(){
		var str ='';
		str +='<div class="labelTypeBox"><div class="labelBox labelBox1"><input type="text" value="" placeholder="新增标签类型" class="labelType" ><img src="images/ele-del.png" class="delLabelTYpe" alt="" /></div><br/>';
		str +='<div class="labelTypeDetail"><div class="labelBox"><input type="text" value="" placeholder="标签" class="labelone"><img src="images/ele-del.png" class="delLabel" alt="" /></div><input type="button" value="添加" class="addNewLabel"></div></div>';
		$(".label_list").append(str);
	});
	$(".label_manage_box .labelTypeDetail .labelBox .delLabel").live("click",function(){
		$(this).parent("").remove();
	});
	$(".label_manage_box .labelTypeBox .labelBox .delLabelTYpe").live("click",function(){
		if($(this).prev().val() !=""){
			var r = confirm('确定删除该类型标签？？');
		}else{
			$(this).parent("").parent().remove();	
		}
		if(r == true){
			$(this).parent("").parent().remove();	
		}
	});
	$(".label_manage_box .labelTypeDetail .addNewLabel").live("click",function(){
		var str='';
		str +='<div class="labelBox"><input type="text" value="" placeholder="标签" class="labelone"><img src="images/ele-del.png" class="delLabel" alt="" /></div>';
		$(this).before(str);
	});
})
function getLabelList(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/label/getAllLables/3.0.0',
		type : 'get',
		dataType : 'json',
		data: {},
		success : function(data){
			if(data.code == 0){
				$(".label_manage_box .label_list").empty();
				var str='';
				$.each(data.data,function(key,val){
					str +='<div class="labelTypeBox"><div class="labelBox labelBox1"><input type="text" value="'+val.clazz+'" class="labelType" ><img src="images/ele-del.png" class="delLabelTYpe" alt="" /></div><br/>';
					str +='<div class="labelTypeDetail">';
					$.each(val.labels,function(key,val1){
						str +='<div class="labelBox"><input type="text" value="'+val1+'" class="labelone"><img src="images/ele-del.png" class="delLabel" alt="" /></div>';	
					});
					str +='<input type="button" value="添加" class="addNewLabel"></div></div>';
				});
				$(".label_manage_box .label_list").append(str);
				$(".labelTypeBox input[type='text']").attr("disabled","disabled");
				$(".label_manage_box .label_list .delLabelTYpe,.label_manage_box .label_list .delLabel").hide();
				$(".label_manage_box .label_list .labelTypeDetail .addNewLabel").hide();
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
	$('.label_manage_box .label_list .labelTypeBox').each(function(index, element) {
		var labelType=$(this).children(".labelBox1").children(".labelType");
		if($.trim(labelType.val()) != ""){
			var label=new Object();
			var labels=new Array();
			label.clazz =labelType.val();
			var biaoqiannum=0;
			var valu=$(this).children(".labelTypeDetail");
			for( var i=0; i<$(valu).children(".labelBox").length; i++){
				if($.trim($(valu).children(".labelBox:eq("+i+")").children(".labelone").val())!= ""){
					labels[i] = $(valu).children(".labelBox:eq("+i+")").children(".labelone").val();		
				}else{
					/*biaoqiannum++;
					if(biaoqiannum==$(this).children(".labelTypeDetail").children(".labelBox").length){
						alert("您有标签类型未添加标签！");
						canSave=2;
						return false;
					}*/
				}
			}
			label.labels=labels;
			data.push(label);
			return data;
			
		}else{
			$(this).children(".labelTypeDetail").children(".labelBox").each(function(index, element) {
				if($.trim($(this).children(".labelone").val()) != ""){
					alert("您有标签未添加标签类型！");
					canSave=2;
					return false;
				}
			});
		}
		
	});
	var labelall = JSON.stringify(data);
	if(canSave != 2){
		$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/community/label/saveAllLables/3.0.0',
			type : 'post',
			dataType : 'json',
			data: {labels:labelall},
			success : function(data){
				if(data.code == 0){
					alert("保存成功！");
					$(".labelTypeBox input[type='text']").attr("disabled","disabled");
					$(".label_manage_box .label_list .delLabelTYpe,.label_manage_box .label_list .delLabel").hide();
					$(".label_manage_box .label_list .labelTypeDetail .addNewLabel").hide();
					$(".label_manage_box .label_manage_btn .edit_label").text("编辑")
				}else{
					alert(data.data.error);
				}
			},
		});
	}
}
