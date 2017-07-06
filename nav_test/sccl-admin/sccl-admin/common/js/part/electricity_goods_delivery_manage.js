$(function(){
	getCompanyTypeFn();
	getCityTypeFn();
	//勾选是否有运费
	$('.electricity_goods_delivery_manage .esg_box .deliveryMessage .fare').live("click",function(){
		$(this).attr("checked","checked").siblings(".fare").removeAttr("checked");
		if($(this).hasClass("no_fare")){
			$(this).parent().parent().next("td").empty();
		}else{
			$(this).parent().parent().next("td").empty().append('<input type="text" value="" name="" class="need_fare" >元');
		}
	});
	//快递添加模块
	$('.electricity_goods_delivery_manage .esg_box .deliveryMessage .addDeliveryMessage').live("click",function(){
		var str='';
		str='<tr><td>'+GetComCompanyDetail()+'</td><td><div class="nowStatus"><label>免运费</label><input type="checkbox" name=""  class="fare no_fare">&nbsp;<label>付运费</label><input type="checkbox" name="" checked class="fare pay_fare"></div></td><td><input type="text" value="" name="" class="need_fare" >元</td><td><div class="gCity">'+GetComCityDetail()+'</div></td><td><input type="button" name=""  class="save_btn green" value="保存"><input type="button" name=""  class="del_btn red" value="删除"></td></tr>';
        $(this).parent().parent().before(str);
	});
	//快递选择地区
	$('.electricity_goods_delivery_manage .esg_box .deliveryMessage .cityBox .selectCity,.electricity_goods_delivery_manage .esg_box .deliveryMessage .cityBox .down').live("click",function(){
		$(this).parent().css("z-index","13");
		$(this).siblings("ul").slideToggle("fast",function(){
			if ($(this).is(':hidden')) {
				$(this).parent().css("z-index","12");
			}else{
				$(".electricity_goods_delivery_manage .esg_box .deliveryMessage .cityBoxlist").not(this).hide();
				$(".electricity_goods_delivery_manage .esg_box .deliveryMessage .cityBox").css("z-index","12");
				$(this).parent().css("z-index","13");
			}
		});
	});
	//选择某一地区
	$('.electricity_goods_delivery_manage .esg_box .deliveryMessage .selectAll input').live("click",function(){
		if ($(this).is(':checked')) {
			$(this).parent().siblings().children("input").attr("checked","checked");
		}else{
			$(this).parent().siblings().children("input").removeAttr("checked");
		}
	});
	//删除快递信息
	$('.electricity_goods_delivery_manage .esg_box .deliveryMessage .del_btn').live("click",function(){
		//调用方法
		var del=$(this);
		var r=confirm("确定删除？");
		if(r == true){
			if(del.attr("templateId")==undefined){
				del.parent().parent().remove();	
			}else{
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/deleteExpressTemplate/3.1.0',{templateId:del.attr("templateId")},function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						del.parent().parent().remove();	
					}else{
						alert(data.data.error);
					}
				});
			}
		};
		
	});
	
	//点击展开城市
	$('.electricity_goods_delivery_manage .deliveryMessage .cityBoxNow img.down').live("click",function(){
		if($(this).hasClass("on")){
			$(this).siblings().addClass("selectedCity");
			$(this).removeClass("on");
		}else{
			$(this).siblings().removeClass("selectedCity");
			$(this).addClass("on");
		}
		
	});
	//编辑物流
	$('.electricity_goods_delivery_manage .delivery_table .edit_btn').live("click",function(){
		$(this).val("保存").removeClass("edit_btn").addClass("save_btn");
		$(this).parent().siblings().children(".nowStatus").hide();
		$(this).parent().siblings().children(".nowHidden").show();
		$(this).parent().siblings().children(".delivery_name").attr("disabled",false);
	});
	//保存物流
	$('.electricity_goods_delivery_manage .delivery_table .save_btn').live("click",function(){
		var del=$(this);
		var tip=del.parent().siblings();
		var freightPrice='';
		var templateId='';
		var arr=new Array();
		var provinceIds='';
		if(del.attr("templateId") == undefined){
			templateId='';
		}else{
			templateId=del.attr("templateId");
		}
		if(tip.find(".need_fare").val() == undefined){
			freightPrice='0';
		}else{
			freightPrice=tip.find(".need_fare").val();
		}
		tip.children(".gCity").children(".cityBox").children(".cityBoxlist").children("li:gt(0)").each(function(index, element) {
			if($(this).children("input").attr('checked')=="checked"){
				arr.push($(this).attr("value"));
			}
		});
		provinceIds=arr.join(",");
		var genData = {
			templateId:templateId,
			companyCode:tip.children(".delivery_name").children("option:selected").val(),
			freightPrice:freightPrice,
			provinceIds:provinceIds
		};
		console.log(genData)
		var r=confirm("确定保存？");
			if(r == true){
				$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/saveExpressTemplate/3.1.0',genData,function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						alert("保存成功！");
						deliveryDetail();
					}else{
						alert(data.data.error);
					}
				});
			};
	});

});


//获取快递详情V3.1.0
	function deliveryDetail(){
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getOptionalExpressTemplates/3.1.0',function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				var str='';
				$.each(data.data,function(key,val){
					var ids=new Array();
					str+='<tr><td>'+GetCompanyDetail(val.companyCode)+'</td>'
					if(val.freightPrice>0){
						 str+='<td><div class="nowStatus">付运费</div><div class="nowHidden"><label>免运费</label><input type="checkbox" name="" class="fare no_fare">&nbsp;<label>付运费</label><input type="checkbox" name="" checked class="fare pay_fare"></div></td><td><div class="nowStatus">'+val.freightPrice+'元</div><div class="nowHidden"><input type="text" value="'+val.freightPrice+'" name="" class="need_fare" >元</div></td>'
					}else{
						 str+='<td><div class="nowStatus">免运费</div><div class="nowHidden"><label>免运费</label><input type="checkbox" name="" checked class="fare no_fare">&nbsp;<label>付运费</label><input type="checkbox" name=""  class="fare pay_fare"></div></td><td></td>'	
					}
					str+='<td><div class="cityBoxNow nowStatus"><p readonly="readonly" class="selectedCity">'
					var citys='';
					$.each(val.provinces,function(key,val){
						ids.push(val.provinceId);
						citys+=val.provinceName+'，';
						//citys+='<span provinceId="'+val.provinceId+'" class="provinceId">'+val.provinceName+'，</span>';
					})
					citys = citys.substring(0,citys.length -1);
					str+=citys+'</p>'+'<img src="images/down.png" class="down" /></div>';
					str+='<div class="nowHidden gCity">'+GetCityDetail(ids)+'</div>';
					str+='</td><td><input type="button" name=""  class="edit_btn green" value="编辑" templateId="'+val.templateId+'"><input type="button" name=""  class="del_btn red" value="删除" templateId="'+val.templateId+'"></td></tr>';
					
				})
				$(".electricity_goods_delivery_manage .delivery_table tbody tr").not(".addNew").remove();
				$(".electricity_goods_delivery_manage .delivery_table tbody tr:last").before(str);
			}else{
				alert(data.data.error);
			}
		});
	};
//获取快递名称详情接口
function getCompanyTypeFn(){
	$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getAllCompanies/3.1.0',function(data){
		var data = $.parseJSON(data);
		var str = '';
		if(data.code == 0){
			 $('.deliveryMessage').data('getAllCompanies',data.data);
		}else{
			alert(data.data.error);	
		}	
	});	
}
//获取快递名称详情
	function GetCompanyDetail(companyCode){
		var data = $('.deliveryMessage').data('getAllCompanies');
		if(data != undefined && data.length != undefined){
				var str='';
				str+='<select class="delivery_name" disabled>';
				$.each(data,function(key,val){
					if(val.companyCode ==companyCode){
						str+='<option value="'+val.companyCode+'" selected class="companyName">'+val.companyName+'</option>';
					}else{
						str+='<option value="'+val.companyCode+'" class="companyName">'+val.companyName+'</option>';
					}
				})
				str+='</select>';
				return str;
		}
	};
//获取快递名称详情
	function GetComCompanyDetail(){
		var data = $('.deliveryMessage').data('getAllCompanies');
		if(data != undefined && data.length != undefined){
			var str='';
			str+='<select class="delivery_name" >';
			$.each(data,function(key,val){
				str+='<option value="'+val.companyCode+'" class="companyName">'+val.companyName+'</option>';
			})
			str+='</select>';
			return str;
		}
	};
//获取快递名称详情接口
function getCityTypeFn(){
	$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getAllProvinces/3.1.0',function(data){
		var data = $.parseJSON(data);
		var str = '';
		if(data.code == 0){
			 $('.deliveryMessage').data('getAllProvinces',data.data);
		}else{
			alert(data.data.error);	
		}	
	});	
}
//获取城市详情
	function GetCityDetail(ids){
		var data = $('.deliveryMessage').data('getAllProvinces');
		if(data != undefined && data.length != undefined){
			var str='';
			str+='<div class="cityBox"><input type="text" placeholder="请选择地区" readonly="readonly" class="selectCity"><img src="images/down.png" class="down">';
			str+='<ul class="cityBoxlist"><li value="1" class="selectAll">全选<input type="checkbox"></li>';
								
			$.each(data,function(key,val){
				if(ids.indexOf(val.provinceId)==-1){
					str+='<li value="'+val.provinceId+'" class="selectAreaCity">'+val.provinceName+'<input type="checkbox"></li>';
				}else{
					str+='<li value="'+val.provinceId+'" class="selectAreaCity">'+val.provinceName+'<input type="checkbox" checked="checked")></li>';
				}
			})
			str+='</ul></div>';
			return str;
		}
	};
//获取城市详情
	function GetComCityDetail(){
		var data = $('.deliveryMessage').data('getAllProvinces');
		if(data != undefined && data.length != undefined){
			var str='';
			str+='<div class="cityBox"><input type="text" placeholder="请选择地区" readonly="readonly" class="selectCity"><img src="images/down.png" class="down">';
			str+='<ul class="cityBoxlist"><li value="" class="selectAll">全选<input type="checkbox"></li>';				
			$.each(data,function(key,val){
				str+='<li value="'+val.provinceId+'" class="selectAreaCity">'+val.provinceName+'<input type="checkbox"></li>';
			})
			str+='</ul></div>';
			return str;
		}
	};