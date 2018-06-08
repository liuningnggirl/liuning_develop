// JavaScript Document
$(function(){
	if (/iphone|ipad|ipod/.test(ua)) {
		_czc.push(['_trackEvent','nggirl_dresser_bizarea','phoneType=iOS','浏览化妆师商圈','true','']);	
	} else if (/android/.test(ua)) {
		_czc.push(['_trackEvent','nggirl_dresser_bizarea','phoneType=and','浏览化妆师商圈','true','']);
	};
	$("body>*").on('click',function(){});
	getapprInfo();
	function getParam(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r!=null) return unescape(r[2]); return null;
	}
	
	function strIsEmpty(str){
		if(str == undefined || str == null || $.trim(str).length == 0){
			return true;
		}
		return false;
	}	
	
	// 从地址栏和本地存储中获取accessToken，地址栏参数优先
	function getAccessToken(){
		var accessToken = '';
		var appAccessToken = localStorage.accessToken;
		var queryAccessToken = getParam("accessToken");
		if(!strIsEmpty(appAccessToken) || !strIsEmpty(queryAccessToken) ){
			accessToken = !strIsEmpty(queryAccessToken) ? queryAccessToken:appAccessToken;
		}
	
		// localStorage中始终存储最新的accessToken
		localStorage.accessToken = accessToken;
		return accessToken;
	}
	function getapprInfo(){
		$.ajax({//采用异步
			type: "get",
			url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/dresser/getDresserBizAreas/1.5.0',
			data:getFinalRequestObject({accessToken:getAccessToken(),dresserId:getParam("dresserId")}),
			dataType:"json",
			success: function (data) {
				$(".se_top .areas").attr("cityId",data.data.cityId);
				$(".se_top .areas").attr("cityName",data.data.cityName);
				var str2 = '';
				for(var i = 0;i < data.data.areas.length;i++){
					if(i == 0){
						$(".semain_left ul").append('<li id="'+i+'" areaId="'+data.data.areas[i].areaId+'" class="selected">'+ data.data.areas[i].areaName+'</li>');
						}else{
					$(".semain_left ul").append('<li id="'+i+'" areaId="'+data.data.areas[i].areaId+'">'+ data.data.areas[i].areaName+'</li>');
					}
				str2 +='<ul>';
					for(var j = 0;j < data.data.areas[i].bizAreas.length;j++){
						str2 += '<li>'+ data.data.areas[i].bizAreas[j]+'</li>';
					}
					if(data.data.areas[i].bizAreas.length == 0){
						str2 +='<li>无</li>';
						}
				str2 +='</ul>';
				}
				$(".semain_right").append(str2);
				
			}
		});
	}
	$(".semain_left ul,.semain_right").height(parseInt($(window).height())-65);
	$(".semain_left ul li").live('click',function(){
		$(this).addClass("selected").siblings("li").removeClass("selected");
		$(".semain_right ul:eq("+$(this).attr("id")+")").show().siblings().hide();
	})
	
})