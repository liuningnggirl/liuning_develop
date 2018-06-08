// JavaScript Document
$(function(){
	//判断输入数
	$('.thirdpart .contentcount').keyup(function(e) {
        $('.thirdpart .countnum').text($.trim($(this).val()).length);
		if($.trim($(this).val()).length > 30){
			var currentnum=$(this).val().substr(0,30);
			$(this).val(currentnum);
			$('.thirdpart .countnum').text("30");
		}
    });
	//选择类型更换数据
	$(".fivepart select").live('change',function(){
		var id = $(".fivepart select option:selected").attr("id");
		$(this).attr("id",id);
		$(this).attr("isForwardkeyRequired",$(".fivepart select option:selected").attr('isForwardkeyRequired'));
		$(".sixpart span,.eightpart span").hide();
		$(".sixpart span[id="+id+"]").show();
		$(".eightpart span[id="+id+"]").show();
		$(".sixpart span:first").removeClass("show");
		$(".eightpart span:first").removeClass("show");
		$('.sevenpart input').val("");
		if($(".fivepart select option:selected").attr('isForwardkeyRequired') == 0){
			$(".sevenpart").hide();
		}else{
			$(".sevenpart").show();
		}
		if(typeof(id)== "undefined"){
			$(".sixpart span:first").show();
			$(".eightpart span:first").show();
		}
		
	})
	//发送推送
	$(".sendMessageBtn").live('click',function(){
		if($(".thirdpart .countnum").text() == "0"){
			alert("推送内容不能为空！");
		}else if($(".fivepart select").val()== "请选择"){
			alert("推送类型不能为空！");
			
		}else if($(".fivepart select").attr("isForwardkeyRequired") == "1" && $(".sevenpart input").val() == ""){
			alert("forwardkey不能为空！");
		}else{
			$(".single_out_box,.single_box").show();
			$(".firstline span").text($(".firstpart select option:selected").text());
			$(".secondline span").text($(".secondpart select").val());
			$(".thirdline span").text($(".thirdpart .contentcount").val());
			$(".forthline span").text($(".fivepart select").val());
			if($(".sevenpart input").val() == ""){
				$(".fifthline span").text("无");
			}else{
				$(".fifthline span").text($(".sevenpart input").val());
			}
		}
	})
	//取消按钮清除信息
	$(".clearMessage").live('click',function(){
		$('.firstpart select option:eq(0)').attr('selected','selected');
		$('.secondpart select option:eq(0)').attr('selected','selected');
		$('.fivepart select option:eq(0)').attr('selected','selected');
		$('.thirdpart input').val("");
		$('.sevenpart input').val("");
		$('.thirdpart .countnum').text("0");
		$(".sixpart p").children().not("span:first").hide();
		$(".eightpart p").children().not("span:first").hide();
		$(".sixpart p span:first").show();
		$(".eightpart p span:first").show();
		$(".onepart input").val("");
	})
	//取消发送
	$(".notsend").live('click',function(){
		$(".single_out_box,.single_box").hide();
	})
	//确认发送
	$(".suresend").live('click',function(){
		$(".single_out_box,.single_box").hide();
		$("#sendMessageBtn").html("发送中...").removeClass();
		if($(".onepart input").val() == ""){
			sendMessageFn();
		}else{
			sendGetuiToSingleFn();
		}
	})
})
//获取可推送类型V2.1.0
function getSingleFn(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysmessage/getSysMessageTypes/2.1.0',
		type : 'get',
		dataType : 'json',
		data: {},
		success : function(data){
			if(data.code == 0){
				$(".fivepart select").children().not("option:first").remove();
				$(".sixpart p").children().not("span:first").remove();
				$(".eightpart p").children().not("span:first").remove();
				$(".sixpart p span:first").show();
				$(".eightpart p span:first").show();
				$('.sevenpart input').val("");
				for(var i = 0; i < data.data.length; i++){
					$(".fivepart select").append('<option type='+data.data[i].type+' id='+i+' isForwardkeyRequired='+data.data[i].isForwardkeyRequired+'>'+data.data[i].typeName+'</option>');
					$(".sixpart p").append('<span id='+i+'>'+data.data[i].typeDesc+'</span>');
					if(data.data[i].forwardkeyDesc=="为空"){
						$(".eightpart p").append('<span id='+i+'>当前类型推送的forwardkey不需要，为空</span>');
					}else{
						$(".eightpart p").append('<span id='+i+'>'+data.data[i].forwardkeyDesc+'</span>');
					}
				}
			}else{
				alert(data.data.error);
			}
			
		},
	});
}
//发送推送信息
function sendMessageFn(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysmessage/sendGetui/2.1.0',
		type : 'post',
		dataType : 'json',
		data: {platform:$('.firstpart select option:selected').attr('value'),cities:$(".secondpart select").val(),content:$('.thirdpart input').val(),sysMessageType:$(".fivepart select option:selected").attr('type'),forwardkey:$.trim($('.sevenpart input').val())},
		success : function(data){
			if(data.code == 0){
				alert(data.data.info);
				$("#sendMessageBtn").html("发送").addClass("sendMessageBtn");
			}else{
				alert(data.data.error);
			}
			
		},
	});
}
//发送推送信息给单个用户
function sendGetuiToSingleFn(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysmessage/sendGetuiToSingle/2.1.0',
		type : 'post',
		dataType : 'json',
		data: {userId:$(".onepart input").val(),platform:$('.firstpart select option:selected').attr('value'),cities:$(".secondpart select").val(),content:$('.thirdpart input').val(),sysMessageType:$(".fivepart select option:selected").attr('type'),forwardkey:$.trim($('.sevenpart input').val())},
		success : function(data){
			if(data.code == 0){
				alert(data.data.info);
				$("#sendMessageBtn").html("发送").addClass("sendMessageBtn");
			}else{
				alert(data.data.error);
				$("#sendMessageBtn").html("发送").addClass("sendMessageBtn");
			}
			
		},
	});
}