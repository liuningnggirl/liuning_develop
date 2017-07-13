var testUrl = 'https://testcli.nggirl.com.cn';
$(function(){
	listInviteCodes2();
//邀请管理
//点击“邀请码管理”--》搜索按钮
	$('.random-list .comsearch-btn').click(listInviteCodes2);

//创建邀请码
	//判断是否为永久有效（1：永久有效时隐藏）
	$('.random-create .on-select').change(function(){
		if($('.random-create .on-select option:selected').attr('value') == 1){
			$(".random-create .notforeverbox").hide();
		}else if($('.random-create .on-select option:selected').attr('value') == 0){
			$(".random-create .notforeverbox").show();
		}
	})
	//点击最后一行添加一行新的
	$(".random-create .moneyweight tr:last .ran-moneys").live('click',function(){
		$(".random-create .thisline").after($(".random-create .moneyweight .thisline").clone());
		$(".random-create .moneyweight tr:last-child").addClass("thisline").siblings("tr").removeClass("thisline");
		$(".random-create .moneyweight tr:last-child .ran-money").addClass("ran-moneys").val("");
		$(".random-create .moneyweight tr:last-child .ran-ratio").val("");
		$(this).removeClass("ran-moneys");
		})
	
	//删除面值行
	$(".delline").live('click',function(){
		$(this).parent("td").parent("tr").remove();
		$(".moneyweight tr:last-child").addClass("thisline").siblings("tr").removeClass("thisline")
		$(".moneyweight tr:last-child .ran-money").addClass("ran-moneys");
	 });
	 //有效期类型为时间段
	 $('.random-create .quan-duan').change(function(){
		if($('.random-create .quan-duan option:selected').attr('value') == 1){
			$(".random-create .effectday").hide();
			$(".random-create .effecttime").show();
		}else{
			$(".random-create .effecttime").hide();
			$(".random-create .effectday").show();
		}
	});
	//更改时判断是否为永久有效（1：永久有效时隐藏）
	$('.randomedit .on-select').change(function(){
		if($('.randomedit .on-select option:selected').attr('value') == 1){
			$(".randomedit .notforeverbox").hide();
		}else if($('.randomedit .on-select option:selected').attr('value') == 0){
			$(".randomedit .notforeverbox").show();
		}
	})
	//更改时有效期类型为时间段
	 $('.randomedit .quan-duan').change(function(){
		if($('.randomedit .quan-duan option:selected').attr('value') == 1){
			$(".randomedit .effectday").hide();
			$(".randomedit .effecttime").show();
		}else{
			$(".randomedit .effecttime").hide();
			$(".randomedit .effectday").show();
		}
	});
	//更改时点击最后一行添加一行
	$(".randomedit .moneyweight tr:last .ran-moneys").live('click',function(){
		$(".randomedit  .thisline").after($(".randomedit .moneyweight .thisline").clone());
		$(".randomedit  .moneyweight tr:last-child").addClass("thisline").siblings("tr").removeClass("thisline");
		$(".randomedit  .moneyweight tr:last-child .ran-money").addClass("ran-moneys").val("");
		$(".randomedit  .moneyweight tr:last-child .ran-ratio").val("");
		$(this).removeClass("ran-moneys");
		})
	$('.create-rancode').click(function(e) {
		createrandomcode();
	});			
//<!--  创建邀请码信息 -->
	$('.createrandom-btn').click(function(e) {
		$('.random-create .quan-name').val('');
		$('.random-create .quan-pro option:eq(0)').attr('selected','selected');
		$('.random-create .quan-use-num').val('');
		$('.random-create .quan-low-money').val('');
		$('.random-create .on-select option:eq(0)').attr('selected','selected');
		$(".notforeverbox").hide();
		$('.random-create .quan-duan option:eq(0)').attr('selected','selected');
		$(".effectday").hide();
		$('.random-create .qian').val('');
		$('.random-create .hou').val('');
		$('.random-create .quan-day').val('');
		$('.random-create .ran-money').val('');
		$('.random-create .ran-ratio').val('');
		$('.random-list').hide();
        $('.random-create').show();
    });	
//点击--》返回--》返回到邀请码列表	
	$('.return-rancode,.ranbtn-return').click(function(e) {
		listInviteCodes2();
		$('.random-txt').html('');
		$('.random-list').show();
        $('.random-create').hide();
		$('.random-success').hide();
    });			
//继续创建 
	$('.ranbtn-create').click(function(e) {
		$('.random-create .quan-name').val('');
		$('.random-create .quan-pro option:eq(0)').attr('selected','selected');
		$('.random-create .quan-use-num').val('');
		$('.random-create .quan-low-money').val('');
		$('.random-create .on-select option:eq(0)').attr('selected','selected');
		$(".notforeverbox").hide();
		$('.random-create .quan-duan option:eq(0)').attr('selected','selected');
		$(".effectday").hide();
		$('.random-create .qian').val('');
		$('.random-create .hou').val('');
		$('.random-create .quan-day').val('');
		$('.random-create .ran-money').val('');
		$('.random-create .ran-ratio').val('');
		$('.random-txt').html('');
		$('.random-success').hide();
        $('.random-list').hide();
        $('.random-create').show();
    });
//权值点击显示数字
$(".moneyweight input").live('keyup',function(){
	this.value=this.value.replace(/\D/g,'');
	});
$(".moneyweight input").live('afterpaste',function(){
	this.value=this.value.replace(/\D/g,'')
	});
//获取编辑随机邀请码
	$('.randomcode-check').live('click' ,function(e) {
		$('.random-list').hide();
        $('.randomedit').show();
		 var del=$(this);
		  $.ajax({
					url : testUrl+'/nggirl-web/web/admin/invitecoderandom/getRandomInviteCodeInfo',
					type : 'get',
					dataType : 'json',
					data: {codeId:del.parent().parent().children('td:eq(0)').attr('codeId')},
					success : function(data){
						$(".randomedit").attr("codeId",data.data.codeId);
						$(".randomedit  .moneyweight tr:gt(0)").remove();
						$(".randomedit .randomcodename").val(data.data.code);
						$(".randomedit .quan-name").val(data.data.productName);
						if(data.data.type=='0'){
							$(".randomedit .quan-pro option[value='0']").attr("selected","selected");
							}else if(data.data.type=='1'){
							$(".randomedit .quan-pro option[value='1']").attr("selected","selected");
								}else if(data.data.type=='2'){
							$(".randomedit .quan-pro option[value='2']").attr("selected","selected");
								}else {
							$(".randomedit .quan-pro option[value='3']").attr("selected","selected");
								}
						$(".randomedit .quan-use-num").val(data.data.allowedTimes);
						$(".randomedit .quan-used-num").val(data.data.usedTimes);
						$(".randomedit .quan-low-money").val(data.data.limitPrice);
						if(data.data.isForever== '1'){
						$('.randomedit .on-select option:eq(0)').attr("selected","selected");
						$(".randomedit .notforeverbox").hide();
						}else if(data.data.isForever== '0'){
							$('.randomedit .on-select option:eq(1)').attr("selected","selected");
						    $(".randomedit .notforeverbox").show();
							if(data.data.effectiveType=='1'){
								$('.randomedit .quan-duan option:eq(0)').attr("selected","selected");
						        $(".randomedit .effecttime").show();
								$(".randomedit .effectday").hide();
								$(".randomedit .qian").val(data.data.startDate);
								$(".randomedit .hou").val(data.data.endDate);
								}else{
									$('.randomedit .quan-duan option:eq(1)').attr("selected","selected");
									$(".randomedit .effecttime").hide();
									$(".randomedit .effectday").show();
									$(".randomedit .quan-day").val(data.data.effectiveDate);
									}
							}
						for(var i =0; i < data.data.faceValueAndWeight.length; i ++){
							$(".randomedit  .moneyweight").append('<tr><td><input type="text" class="ran-money weightwidth" value='+data.data.faceValueAndWeight[i].faceValue+' /></td><td><input type="text" class="ran-ratio weightwidth" value='+data.data.faceValueAndWeight[i].weight+' /></td><td><img src="../common/images/ele-del.png" class="delline"></td></tr>');
							
							}
						$(".randomedit  .moneyweight tr:last-child").addClass("thisline").siblings("tr").removeClass("thisline");
						$(".randomedit  .moneyweight tr:last-child .ran-money").addClass("ran-moneys");
						
						},
				});
		
    });
//<!--  点击取消编辑返回到邀请码列表 -->	
	$('.randomedit .quitedit').click(function(e) {
		$('.random-list').show();
        $('.randomedit').hide();
    });	
//<!--  点击提交按钮返回到邀请码列表 -->	
	$('.randomedit .saveedit').live('click',function(e) {
		editrandomcode();
	});	
	$(".commitbox .notcom").click(function(){
		$(".commitbox,.allbox").hide();
		});
//点击是按钮时
$(".commitbox .surecom").click(function(){
	if($('.randomedit .on-select option:selected').attr('value') == 1){
	typeone();
	}else if($('.randomedit .on-select option:selected').attr('value') == 0 && $('.randomedit .quan-duan option:selected').attr('value') == 1){
	typetwo();
	}else if($('.randomedit .on-select option:selected').attr('value') == 0 && $('.randomedit .quan-duan option:selected').attr('value') == 2){
	typethree();
	}
});
	
	
//删除邀请码
	$('.randomcode-del').live('click',function(e) {
		$(".delcodebox").css("top",$(window).scrollTop()+156);
		$(".delcodebox, .allbox").show();
		var del=$(this);
		$(".delcodebox .suredel").click(function(){
			$(".delcodebox,.allbox").hide();
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/invitecoderandom/deleteRandomInviteCode',
				type : 'post',
				dataType : 'json',
				data: {codeId:del.parent().parent().children('td:eq(0)').attr('codeId')},
				success : function(data){
					if(data.code==0){
						del.parent().parent().remove();
					}else{
						alert(data.data.error);
						}
				},
			});
		});
		$(".delcodebox .notdel").click(function(){
			$(".delcodebox,.allbox").hide();
			});
    });
});

//定义数据
function  getData2(page,code,productName,creatorName){
	var data = new Object();
	data.page = page;
	data.code = code;
	data.productName = productName;
	data.creatorName = creatorName;
	return data;	
}

//搜索的数据
function genData2(){
	return getData2(
	1,$('.random-list .order-num .yqmcode').val(),
	$('.random-list .order-num .yqmremark').val(),$('.random-list .order-num .yqmcreater').val()
	);
}

//渲染数据
function sresolvePage2(data){
	$('.productlist tr:gt(0)').remove();
	for(var x = 0; x < data.data.pageData.length ; x ++){
		
		$('.productlist').append('<tr><td codeId='+data.data.pageData[x].codeId+'>'+data.data.pageData[x].productName+'</td><td>'+data.data.pageData[x].code+'</td><td>'+data.data.pageData[x].allowedTimes+'</td><td>'+data.data.pageData[x].usedTimes+'</td><td>'+data.data.pageData[x]. faceValueAndWeight+'</td><td>'+data.data.pageData[x].deadline+'</td><td class="suittype" typeid='+data.data.pageData[x].type+'></td><td>'+data.data.pageData[x].limitPrice+'</td><td>'+data.data.pageData[x].creatorName+'</td><td><input type="button" value="编辑" class="randomcode-check" /><br><br><input type="button" value="删除" class="randomcode-del" /></td></tr>');
	}
	$(".suittype").each(function(index, element) {
            if($(this).attr("typeid") == '0'){
				$(this).html("全品类");
				}else if($(this).attr("typeid") == '1'){
					$(this).html("美妆上门服务");
					}else if($(this).attr("typeid") == '2'){
						$(this).html("化妆师教学服务");
						}else if($(this).attr("typeid") == '3'){
							$(this).html("美妆沙龙下午茶");
							}
        });
}

//根据不同的页码来渲染页面
function onClickPageNum2(p){
	var data = genData2();
	data.page = p;
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/invitecoderandom/listRandomInviteCodes',
		type : 'get',
		dataType : 'json',
		data: data,
		success : function(data){
			sresolvePage2(data);
		},
	});
}

//获取入参，渲染页面
function listInviteCodes2(){
	//获取入参
	var data = genData2();
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/invitecoderandom/listRandomInviteCodes',
		type : 'get',
		dataType : 'json',
		data: data,
		success : function(data){
			//创建分页
			$(".random-list .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:onClickPageNum2
			});
			
			//渲染页面
			sresolvePage2(data);
		},
	});
}
//创建随机邀请码方法
function createrandomcode(){
		//判断是否为永久有效（1：永久有效）
		var str2= "";
		if($('.random-create .on-select option:selected').attr('value') == 1){
				if($('.random-create .quan-name').val() == ''){
					alert('请输入券名');	
				}else if($('.random-create .quan-pro option:selected').val() == ''){
					alert('请输入适用产品');
				
				}else if($('.random-create .quan-use-num').val() == ''){
					alert('请输入可领取次数');	
				}else if($('.random-create .ran-money:eq(0)').val() == '' || $('.random-create .ran-ratio:eq(0)').val() == ''){
					alert('请输入面值与权重');	
				}else{
					for(var i =0; i < $(".random-create .moneyweight tr").length-1; i ++){
						if($('.random-create .ran-money:eq('+i+')').val()!='' && $('.random-create .ran-ratio:eq('+i+')').val()!=''){
					    	var str2=str2+$('.random-create .ran-money:eq('+i+')').val()+","+$('.random-create .ran-ratio:eq('+i+')').val()+";";
						}else if($('.random-create .ran-money:eq('+i+')').val()=='' && $('.random-create .ran-ratio:eq('+i+')').val()==''){
							
						}else{
							alert("面值与权重需成对填写！");
							return false;
							}
					};
					$.ajax({
						url : testUrl+'/nggirl-web/web/admin/invitecoderandom/createRandomInviteCode',
						type : 'post',
						dataType : 'json',
						data: {productName:$('.random-create .quan-name').val(),type:$('.random-create .quan-pro option:selected').attr('value'),allowedTimes:$('.random-create .quan-use-num').val(),limitPrice:$('.random-create .quan-low-money').val(),isForever:$('.random-create .on-select option:selected').attr('value'),faceValueAndWeight:str2},
						success : function(data){
							$('.random-create').hide();
							$('.random-success').show();
							$('.random-txt').html(data.data.info);
							
						},
					});
				}
			}
		//判断是否为永久有效以及有效期是否为时间段（0：非永久有效,1为时间段）
		if($('.random-create .on-select option:selected').attr('value') == 0 && $('.random-create .quan-duan option:selected').attr('value') == 1){
			if($('.random-create .quan-name').val() == ''){
				alert('请输入券名');	
			}else if($('.random-create .quan-pro option:selected').val() == ''){
				alert('请输入适用产品');
			}else if($('.random-create .quan-use-num').val() == ''){
				alert('请输入可领取次数');		
			}else if($('.random-create .qian').val() == ''){
				alert('请选择有效开始时间');	
			}else if($('.random-create .hou').val() == ''){
				alert('请选择有效结束时间');	
			}else if($('.random-create .ran-money:eq(0)').val() == '' || $('.random-create .ran-ratio:eq(0)').val() == ''){
				alert('请输入面值与权重');		
			}else{
				for(var i =0; i < $(".random-create .moneyweight tr").length-1; i ++){
						if($('.random-create .ran-money:eq('+i+')').val()!='' && $('.random-create .ran-ratio:eq('+i+')').val()!=''){
					    	var str2=str2+$('.random-create .ran-money:eq('+i+')').val()+","+$('.random-create .ran-ratio:eq('+i+')').val()+";";
						}else if($('.random-create .ran-money:eq('+i+')').val()=='' && $('.random-create .ran-ratio:eq('+i+')').val()==''){
							
						}else{
							alert("面值与权重需成对填写！");
							return false;
							}
					};
				var re=new RegExp("[\\-,\\:, ]","g");  //正则格式化字符，解释：re=new RegExp("l","g")中的第一个参数是你要替换的字符串，第二个参数指替换所有的。
				var startDate = $('.random-create .qian').val().replace(re, "");
				var endDate = $('.random-create .hou').val().replace(re, "");
				$.ajax({
					url : testUrl+'/nggirl-web/web/admin/invitecoderandom/createRandomInviteCode',
					type : 'post',
					dataType : 'json',
					data: {productName:$('.random-create .quan-name').val(),type:$('.random-create .quan-pro option:selected').attr('value'),allowedTimes:$('.random-create .quan-use-num').val(),limitPrice:$('.random-create .quan-low-money').val(),isForever:$('.random-create .on-select option:selected').attr('value'),effectiveType:$('.random-create .quan-duan option:selected').attr('value'),startDate:startDate,endDate:endDate,faceValueAndWeight:str2},
					success : function(data){
						$('.random-create').hide();
						$('.random-success').show();
						$('.random-txt').html(data.data.info);	
					},
				});
			}
		}//判断是否为永久有效以及有效期是否为时间段（0：非永久有效,2为注册时起）
		if($('.random-create .on-select option:selected').attr('value') == 0 && $('.random-create .quan-duan option:selected').attr('value') == 2){
			if($('.random-create .quan-name').val() == ''){
				alert('请输入券名');	
			}else if($('.random-create .quan-pro option:selected').val() == ''){
				alert('请输入适用产品');
			}else if($('.random-create .quan-use-num').val() == ''){
				alert('请输入可领取次数');		
			}else if($('.random-create .quan-day').val() == ''){
				alert('请选择有效天数');		
			}else if($('.random-create .quan-money').val() == ''){
				alert('请输入面值');		
			}else{
				for(var i =0; i < $(".random-create .moneyweight tr").length-1; i ++){
						if($('.random-create .ran-money:eq('+i+')').val()!='' && $('.random-create .ran-ratio:eq('+i+')').val()!=''){
					    	var str2=str2+$('.random-create .ran-money:eq('+i+')').val()+","+$('.random-create .ran-ratio:eq('+i+')').val()+";";
						}else if($('.random-create .ran-money:eq('+i+')').val()=='' && $('.random-create .ran-ratio:eq('+i+')').val()==''){
							
						}else{
							alert("面值与权重需成对填写！");
							return false;
							}
					};
				var re=new RegExp("[\\-,\\:, ]","g");  //正则格式化字符，解释：re=new RegExp("l","g")中的第一个参数是你要替换的字符串，第二个参数指替换所有的。
				var startDate = $('.random-create .qian').val().replace(re, "");
				var endDate = $('.random-create .hou').val().replace(re, "");
			    $.ajax({
					url : testUrl+'/nggirl-web/web/admin/invitecoderandom/createRandomInviteCode',
					type : 'post',
					dataType : 'json',
					data: {productName:$('.random-create .quan-name').val(),type:$('.random-create .quan-pro option:selected').attr('value'),allowedTimes:$('.random-create .quan-use-num').val(),limitPrice:$('.random-create .quan-low-money').val(),isForever:$('.random-create .on-select option:selected').attr('value'),effectiveType:$('.random-create .quan-duan option:selected').attr('value'),effectiveDate:$('.random-create .quan-day').val(),faceValueAndWeight:str2},
					success : function(data){
						$('.random-create').hide();
						$('.random-success').show();
						$('.random-txt').html(data.data.info);
					},
				});
			}
		}
}

//保存编辑后的信息
function editrandomcode(){
		//判断是否永久有效
		if($('.randomedit .on-select option:selected').attr('value') == 1){
				if($('.randomedit .quan-name').val() == ''){
					alert('请输入券名');	
				}else if($('.randomedit .quan-pro option:selected').val() == ''){
					alert('请输入适用产品');
				
				}else if($('.randomedit .quan-use-num').val() == ''){
					alert('请输入可领取次数');	
				}else if($('.randomedit .ran-money:eq(0)').val() == '' || $('.randomedit .ran-ratio:eq(0)').val() == ''){
					alert('请输入面值与权重');	
				}else{
					for(var i =0; i < $(".randomedit .moneyweight tr").length-1; i ++){
						if($('.randomedit .ran-money:eq('+i+')').val()!='' && $('.randomedit .ran-ratio:eq('+i+')').val()!=''){
					    	var str3=str3+$('.randomedit .ran-money:eq('+i+')').val()+","+$('.randomedit .ran-ratio:eq('+i+')').val()+";";
						}else if($('.randomedit .ran-money:eq('+i+')').val()=='' && $('.randomedit .ran-ratio:eq('+i+')').val()==''){
							
						}else{
							alert("面值与权重需成对填写！");
							return false;
							}
					};
					$(".commitbox").css("top",$(window).scrollTop()+156);
					$(".commitbox,.allbox").show();
					
				}
			}
		//判断是否为永久有效以及有效期是否为时间段（0：非永久有效,1为时间段）
		if($('.randomedit .on-select option:selected').attr('value') == 0 && $('.randomedit .quan-duan option:selected').attr('value') == 1){
			if($('.randomedit .quan-name').val() == ''){
				alert('请输入券名');	
			}else if($('.randomedit .quan-pro option:selected').val() == ''){
				alert('请输入适用产品');
			}else if($('.randomedit.quan-use-num').val() == ''){
				alert('请输入可领取次数');		
			}else if($('.randomedit .qian').val() == ''){
				alert('请选择有效开始时间');	
			}else if($('.randomedit .hou').val() == ''){
				alert('请选择有效结束时间');	
			}else if($('.randomedit .ran-money:eq(0)').val() == '' || $('.randomedit .ran-ratio:eq(0)').val() == ''){
				alert('请输入面值与权重');		
			}else{
				for(var i =0; i < $(".randomedit .moneyweight tr").length-1; i ++){
						if($('.randomedit .ran-money:eq('+i+')').val()!='' && $('.randomedit .ran-ratio:eq('+i+')').val()!=''){
					    	var str3=str3+$('.randomedit .ran-money:eq('+i+')').val()+","+$('.randomedit .ran-ratio:eq('+i+')').val()+";";
						}else if($('.randomedit .ran-money:eq('+i+')').val()=='' && $('.randomedit .ran-ratio:eq('+i+')').val()==''){
							
						}else{
							alert("面值与权重需成对填写！");
							return false;
							}
					};
				
				$(".commitbox").css("top",$(window).scrollTop()+156);
				$(".commitbox,.allbox").show();
				
			}
		}//判断是否为永久有效以及有效期是否为时间段（0：非永久有效,2为注册时起）
		if($('.randomedit .on-select option:selected').attr('value') == 0 && $('.randomedit .quan-duan option:selected').attr('value') == 2){
			if($('.randomedit .quan-name').val() == ''){
				alert('请输入券名');	
			}else if($('.randomedit .quan-pro option:selected').val() == ''){
				alert('请输入适用产品');
			}else if($('.randomedit .quan-use-num').val() == ''){
				alert('请输入可领取次数');		
			}else if($('.randomedit .quan-day').val() == ''){
				alert('请选择有效天数');		
			}else if($('.randomedit .quan-money').val() == ''){
				alert('请输入面值');		
			}else{
				for(var i =0; i < $(".randomedit .moneyweight tr").length-1; i ++){
						if($('.randomedit .ran-money:eq('+i+')').val()!='' && $('.randomedit .ran-ratio:eq('+i+')').val()!=''){
					    	var str3=str3+$('.randomedit .ran-money:eq('+i+')').val()+","+$('.randomedit .ran-ratio:eq('+i+')').val()+";";
						}else if($('.randomedit .ran-money:eq('+i+')').val()=='' && $('.randomedit .ran-ratio:eq('+i+')').val()==''){
							
						}else{
							alert("面值与权重需成对填写！");
							return false;
							}
					};
				
			    $(".commitbox").css("top",$(window).scrollTop()+156);
				$(".commitbox,.allbox").show();
				
			}
		}
	}
//第一种类型
function typeone(){
	var str3= "";
	for(var i =0; i < $(".randomedit .moneyweight tr").length-1; i ++){
		var str3=str3+$('.randomedit .ran-money:eq('+i+')').val()+","+$('.randomedit .ran-ratio:eq('+i+')').val()+";";
	};
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/invitecoderandom/updateRandomInviteCode',
		type : 'post',
		dataType : 'json',
		data: {codeId:$(".randomedit").attr("codeId"),productName:$('.randomedit .quan-name').val(),type:$('.randomedit .quan-pro option:selected').attr('value'),allowedTimes:$('.randomedit .quan-use-num').val(),limitPrice:$('.randomedit .quan-low-money').val(),isForever:$('.randomedit .on-select option:selected').attr('value'),faceValueAndWeight:str3},
		success : function(data){
		listInviteCodes2();
		$(".commitbox,.allbox").hide();
		$('.randomedit').hide();
		$('.random-list').show();
		},
	});
					
}
//第二种类型
function typetwo(){
	var str3= "";
	for(var i =0; i < $(".randomedit .moneyweight tr").length-1; i ++){
		var str3=str3+$('.randomedit .ran-money:eq('+i+')').val()+","+$('.randomedit .ran-ratio:eq('+i+')').val()+";";
	};
	var re=new RegExp("[\\-,\\:, ]","g");  //正则格式化字符，解释：re=new RegExp("l","g")中的第一个参数是你要替换的字符串，第二个参数指替换所有的。
	var startDate = $('.randomedit .qian').val().replace(re, "");
	var endDate = $('.randomedit .hou').val().replace(re, "");
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/invitecoderandom/updateRandomInviteCode',
		type : 'post',
		dataType : 'json',
		data: {codeId:$(".randomedit").attr("codeId"),productName:$('.randomedit .quan-name').val(),type:$('.randomedit .quan-pro option:selected').attr('value'),allowedTimes:$('.randomedit .quan-use-num').val(),limitPrice:$('.randomedit .quan-low-money').val(),isForever:$('.randomedit .on-select option:selected').attr('value'),effectiveType:$('.randomedit .quan-duan option:selected').attr('value'),startDate:startDate,endDate:endDate,faceValueAndWeight:str3},
		success : function(data){
			listInviteCodes2();
			$(".commitbox,.allbox").hide();
			$('.randomedit').hide();
			$('.random-list').show();	
		},
	});
}
//第三种类型
function typethree(){
	var str3= "";
	for(var i =0; i < $(".randomedit .moneyweight tr").length-1; i ++){
		var str3=str3+$('.randomedit .ran-money:eq('+i+')').val()+","+$('.randomedit .ran-ratio:eq('+i+')').val()+";";
	};
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/invitecoderandom/updateRandomInviteCode',
		type : 'post',
		dataType : 'json',
		data: {codeId:$(".randomedit").attr("codeId"),productName:$('.randomedit .quan-name').val(),type:$('.randomedit .quan-pro option:selected').attr('value'),allowedTimes:$('.randomedit .quan-use-num').val(),limitPrice:$('.randomedit .quan-low-money').val(),isForever:$('.randomedit .on-select option:selected').attr('value'),effectiveType:$('.randomedit .quan-duan option:selected').attr('value'),effectiveDate:$('.randomedit .quan-day').val(),faceValueAndWeight:str3},
		success : function(data){
			listInviteCodes2();
			$(".commitbox,.allbox").hide();
			$('.randomedit').hide();
			$('.random-list').show();
		},
	});
}
