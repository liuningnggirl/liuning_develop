var testUrl = 'https://testcli.nggirl.com.cn';
$(function(){
	wefhwihfeu();
	$.get(testUrl+"/nggirl-web/web/admin/item/getOptionalProperties/3.1.0",function(data){
		var data=$.parseJSON(data)
		console.log(data)
	})
/*保存某个商品属性*/
	$(".i_want_newcrease").live('click',function(){
			
				$(this).parent().prev().append('<input type="text" name=""><img src="../common/images/remove_one.png" class="i_want_remove_prev" style="display:inline-block">')
			
	})
	$('.i_want_to_idit').live('click',function(){
		var name=$(this).parent().parent().children().eq(0).children().eq(0).val();
		var keyId=$(this).attr("keyid")
		var input_Arr=$(this).parent().parent().children().eq(1).children("input")
		
		var input_Arr_Value=String();
		for(var i=0;i<input_Arr.length;i++){
				input_Arr_Value+=''+$(input_Arr[i]).val()+','
		}
		var name_ineed=$(".input_choice_value_none").val()
		$(this).parent().prev().children("img").css("display","inline-block")
		if($(this).html()=='编辑'){
			$(this).next().css("display","inline-block")
			$(this).html("保存")
			$(this).parent().parent().children().eq(0).children().eq(0).removeAttr("disabled")
			$('.goods_parameter_div_second_contrl_span_two input').removeAttr('disabled')
			$(".goods_parameter_div_second_contrl_span_four input").removeAttr('disabled')
					/*新增属性*/
			
		}else{

			$(this).parent().parent().children().eq(0).children().eq(0).attr("disabled","disabled")
			$('.goods_parameter_div_second_contrl_span_two input').attr('disabled','false')
			$('.goods_parameter_div_second_contrl_span_four input').attr('disabled','false')
			$(this).html("编辑")
			$(this).next().css("display","none")
			$(this).parent().prev().children("img").css("display","none")
			if(!$(this).attr("keyid")==""){
				$.post(testUrl+"/nggirl-web/web/admin/item/saveProperty/3.1.0",{keyId:keyId,name:name,values:input_Arr_Value},function(data){
				var data=$.parseJSON(data)
					if(data.code==0){
						alert("保存成功")
					}
				})
			}else{
				$.post(testUrl+"/nggirl-web/web/admin/item/saveProperty/3.1.0",{name:name_ineed,values:input_Arr_Value},function(data){
					var data=$.parseJSON(data)
					if(data.code==0){
						alert("保存成功")
						wefhwihfeu()
					}
				})
			}
			

		}
		
	})
	$(".i_want_remove_prev").live("click",function(){
				$(this).prev().remove()
				console.log(11)
				$(this).remove();
				
			})
	var common_keyid=null;
	
/*删除某个商品参数*/
	$(".i_want_to_remove").live("click",function(){
		
		var keyId=$(this).attr("keyid");
		var that=this
		if(!keyId==""){
			$.post(testUrl+"/nggirl-web/web/admin/item/deleteProperty/3.1.0",{keyId:keyId},function(data){
				var data=$.parseJSON(data)
				if(data.code==0){
					$(that).parent().parent().remove()
					alert("删除成功")
					
				}
			})
		}else{
			$(this).parent().parent().remove()
		}
		
	})
/*手动增加商品参数*/
	$(".increase_goods_parameter_contrll").live("click",function(){
		
		$(".goods_parameter_div_second_append").append('<tr><td><input class="input_choice_value_none"  value=""/></td><td class="goods_parameter_div_second_contrl_span_two"><input type="text" name="" value="" ><img src="../common/images/remove_one.png" class="i_want_remove_prev"></td><td class="goods_parameter_div_second_contrl_span"><span class="i_want_to_idit" keyId="">保存</span><span style="display:inline-block" class="i_want_newcrease">新增</span><span style="color: red" keyid="" class="i_want_to_remove">删除</span></td></tr>')
	})
	function wefhwihfeu(){
		$(".goods_parameter_div_second_append").html("")
		$.get(testUrl+"/nggirl-web/web/admin/item/getOptionalProperties/3.1.0",function(data){
			var data=$.parseJSON(data);
			console.log(data)
			
			var str='<tr>'
			for(var i=0;i<data.data.length;i++){
				str+='<td><input class="goods_parameter_div_second_contrl_span_four" disabled="disabled" value="'+data.data[i].name+'"/></td><td class="goods_parameter_div_second_contrl_span_two">'
					for(var j=0;j<data.data[i].values.length;j++){
						str +='<input type="text" name="" value='+data.data[i].values[j].value+' disabled="false" keyid="'+data.data[i].values[j].valueId+'"><img src="../common/images/remove_one.png" class="i_want_remove_prev">'
					}
					str+='</td><td class="goods_parameter_div_second_contrl_span"><span class="i_want_to_idit" keyId="'+data.data[i].keyId+'">编辑</span><span class="i_want_newcrease">新增</span><span style="color: red" keyid="'+data.data[i].keyId+'" class="i_want_to_remove">删除</span></td></tr>'
			}
			$(".goods_parameter_div_second_append").append(str)
		})
	}

})