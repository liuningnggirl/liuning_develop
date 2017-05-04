// JavaScript Document
$(function(){
	var nextLevel=($(window).width()-40)*0.0895;
	$(".nextLevel").css('line-height',nextLevel+'px');
	$(".history_detail .nonehistory").css('min-height',$(window).height()-$(".myrank").height()-57);
	getUserValueInfo();
	getUserRecordsInfo(0,20);
	$(".toGetPoints").live('click',function(){
		window.location.href ='<%= CLI_HOST_API_URL %>/nggirl/h5/cosmetic/index.html?v=<%= VERSION %>';
	});
	function getUserValueInfo(){
		$.ajax({//采用异步
			type: "get",
			url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/personalInfo/getUserValuePage/2.5.2',
			data:getFinalRequestObject({accessToken:getAccessToken()}),
			dataType:"json",
			success: function (data) {
				if(data.code == 0){
					if(data.data.hasNextLevel == 0){
						$(".oneTosix").hide();
						$(".seven").show();
					}else{
						$(".oneTosix").show();
						$(".seven").hide();
					}
					$(".profile").append('<img src="'+data.data.profile+'" class="touxiang"/>');
					$(".userValue").html(data.data.userValue);
					$(".needValue").html(data.data.needValue);
					$(".mylv").html('LV'+data.data.userLevel);
					$(".mylv7").html('LV'+data.data.userLevel);
					$(".nextLevel").html('LV'+data.data.nextLevel);
					$(".part1 span").html(data.data.jobs.checkin);
					$(".part2 span").html(data.data.jobs.love);
					$(".part3 span").html(data.data.jobs.praise);
					$(".part4 span").html(data.data.jobs.share);
					$(".part5 span").html(data.data.jobs.collect);
					$(".part6 span").html(data.data.jobs.comment);
					if(data.data.jobs.checkin != '0'){
						$(".part1 span").addClass("green");
					};
					if(data.data.jobs.love != '0'){
						$(".part2 span").addClass("green");
					};
					if(data.data.jobs.praise != '0'){
						$(".part3 span").addClass("green");
					};
					if(data.data.jobs.share != '0'){
						$(".part4 span").addClass("green");
					};
					if(data.data.jobs.collect != '0'){
						$(".part5 span").addClass("green");
					};
					if(data.data.jobs.comment != '0'){
						$(".part6 span").addClass("green");
					};
				}else{
					alert(data.data.error);
				}
			}
		});
	};
	function getUserRecordsInfo(page,num){
		$.ajax({//采用异步
			type: "get",
			url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/personalInfo/getUserValueRecords/2.5.2',
			data:getFinalRequestObject({accessToken:getAccessToken(),page:page,num:num}),
			dataType:"json",
			success: function (data) {
				if(data.code == 0){
					if(data.data.length==0 && page == 0){
						$(".nonehistory").show();
					}else{
						var str="";
						$.each(data.data,function(key,val){
							 str+='<li class="recordsDet"><div class="recordsleft">'+val.recordTime+'</div><div class="recordscenter">'+val.type+'</div><div class="recordsright"><span>';
							 if(val.sign == "1"){
								 str+='+';
							 }else{
								 str+='-';
							 }
							 str+=val.userValue+'</span>经验值</div></li>';
							
						});
					};
					var tur = true;	
					$('.history_detail').css('margin-bottom','0px');
					if(data.data.length == num){
						str+='<span class="pullUpIcon"></span>';
						$(window).scroll(function(){
								var winH = $(window).height(); //页面可视区域高度  
								var pageH = $(".history_detail").height();  
								var scrollT = $(window).scrollTop(); //滚动条top  
								var aa = (pageH - winH - scrollT) / winH;  
								if(tur && aa < 0.02){ 
									setTimeout(function(){
									  getMoreRecords();
									  $(".pullUpIcon").remove();
									  $('.history_detail').css('margin-bottom','40px');
									  },500);
									  tur = false;
								   } 
						   });
					}
					$('.history_detail').append(str);
				}else{
					alert(data.data.error);
				}
			}
		});
	};
	var num =20;
	function getMoreRecords(){
		$(".tempWrap").css("height","auto");
		var page = $('body').data('page');
		if(page == undefined || parseInt(page) == NaN){
			page = 0;
		}
		page = page + 1;
		$('body').data('page',page);
		getUserRecordsInfo(page,num);
	}	

	TouchSlide( { slideCell:"#tabBox1",
		endFun:function(i){ //高度自适应
			var bd = document.getElementById("tabBox1-bd");
			effect:"leftLoop";
			if(i == 0){
				$(".task_detail").show();
				$(".history_detail").hide();
				$('.history_detail').css('margin-bottom','0px');
			}else if(i == 1){
				$(".history_detail").show();
				$(".task_detail").hide();
			}
			if(i>0)bd.parentNode.style.transition="200ms";//添加动画效果
		}
	});
});
