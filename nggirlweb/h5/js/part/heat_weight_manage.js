// JavaScript Document
$(function(){
	$(".heat_weight_box .edit_weight_btn").die('click');
	$(".heat_weight_box .edit_weight_btn").live('click',function(){
		$(".heat_weight_box .editable").attr("contenteditable",true);
		$(this).val("完成").addClass("edit_over");
	});
	$(".heat_weight_box .edit_over").die('click');
	$(".heat_weight_box .edit_over").live('click',function(){
		$(".heat_weight_box .editable").attr("contenteditable",false);
		$(this).val("编辑").removeClass("edit_over");
	});
	$(".heat_weight_box .save_weight_btn").die('click');
	$(".heat_weight_box .save_weight_btn").live('click',function(){
		
		var b = true;
		$(".heat_weight_box .editable").each(function(index, element) {
            if($(this).text() == ""){
			    b = false;
			}
       });
	   if(b == true){
		  saveWeightChange();
		}else{
			alert("请补充完整权重比值");
		}
	});
	
});
function getWeightChange(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysconfig/getPostHeatAndUserHeatConfig/3.0.0',
		type : 'get',
		dataType : 'json',
		data: {},
		success : function(data){
			if(data.code == 0){
				$(".heat_weight_box .heat_weight_left .viewNum").text(data.data.postHeatConfig.viewNum);
				$(".heat_weight_box .heat_weight_left .praiseNum").text(data.data.postHeatConfig.praiseNum);
				$(".heat_weight_box .heat_weight_left .commentNum").text(data.data.postHeatConfig.commentNum);
				$(".heat_weight_box .heat_weight_right .fansNum").text(data.data.userHeatConfig.fansNum);
				$(".heat_weight_box .heat_weight_right .postNum").text(data.data.userHeatConfig.postNum);
			}else{
				alert(data.data.error);
			}
		},
	});
}
function saveWeightChange(){
	var data = new Object();
	var postHeatConfig=new Object();
	var userHeatConfig=new Object();
	postHeatConfig.commentNum = $(".heat_weight_box .heat_weight_left .commentNum").text();
	postHeatConfig.praiseNum = $(".heat_weight_box .heat_weight_left .praiseNum").text();
	postHeatConfig.viewNum = $(".heat_weight_box .heat_weight_left .viewNum").text();
	data.postHeatConfig = postHeatConfig;
	userHeatConfig.fansNum = $(".heat_weight_box .heat_weight_right .fansNum").text();
	userHeatConfig.postNum = $(".heat_weight_box .heat_weight_right .postNum").text();
	data.userHeatConfig = userHeatConfig;
	var datas = JSON.stringify(data);
	console.log(datas);
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysconfig/savePostHeatAndUserHeatConfig/3.0.0',
		type : 'post',
		dataType : 'json',
		data: {config:datas},
		success : function(data){
			if(data.code == 0){
			//创建分页
			    alert("保存成功！");
			}else{
				alert("1");
				//alert(data.data.error);
			}
		},
	});
}