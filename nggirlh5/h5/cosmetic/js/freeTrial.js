// JavaScript Document
$(function(){
	getfreeTrial();
	getAllMessage();
	var pageSize = 20;
	$(".allmessage").width($(window).width()-16);
	$(".rules").on('click',function(event){
		$("body").addClass("tcstyle");
		$(".innercontent,.boxshadow").show();
		});
	$(".boxshadow").click(function(){
		$(".innercontent,.boxshadow").hide();
		$("body").removeClass("tcstyle");
		});
	$(".lookmore").live('click',function(){
		$(".part1").hide();
		$(".part2").show();
		getAllMessage1(0,20);
		})
	$(".mesbtn").live('click',function(){
		$(".part2").hide();
		$(".part1").show();
		$(".messagesall").remove(".messages");
		getDetailStatus();
		});
	//免费申请
	$(".fortrail").die('click');
	$(".fortrail").live('click',function(){
		_czc.push(['_trackEvent','mianfeishizhuang','click','shenqing','true','']);
		if(isInApp() && getAppVersion() >= 2.05){
			checkAccessToken(function(){
				$('.apply_for_details,.part1').hide();
				$('.apply_for_trial').show();
				getApplyHistory();
			},function(){
				window.location.href = 'nggirl://nggirl/login?backUrl='+window.location.protocol+'//'+window.location.host+'/nggirl/h5/cosmetic/freeTrial.html?cosmeticId_3d'+getParamHack('cosmeticId')+'&v=<%= VERSION %>';
			});
		}else{
			checkAccessTokenLogin(function () {
				$('.apply_for_details,.part1').hide();
				$('.apply_for_trial').show();
				getApplyHistory();
			},'freeTrial.html?cosmeticId_3d'+getParamHack('cosmeticId')+'&v=<%= VERSION %>');
		};
	});
	//已申请，查看申请状态
	$(".lookstatus").live('click',function(){
		$('.apply_for_trial,.part1').hide();
	   	$('.apply_for_details').show();
		getDetailStatus();
		});
	//立即登录，查看申请状态
	$(".gotologin").live('click',function(){
		if(isInApp() && getAppVersion() >= 2.05){
			checkAccessToken(function(){
			},function(){
				window.location.href = 'nggirl://nggirl/login?backUrl='+window.location.protocol+'//'+window.location.host+'/nggirl/h5/cosmetic/freeTrial.html?cosmeticId_3d'+getParamHack('cosmeticId')+'&v=<%= VERSION %>';
			});
			
		}else{
			checkAccessTokenLogin(function () {
				},'freeTrial.html?cosmeticId_3d'+getParamHack('cosmeticId')+'&v=<%= VERSION %>');
			}
		});
	//申请成功，查看申请状态
	$(".successtatus").live('click',function(){
		$('.apply_for_trial,.part1').hide();
	   	$('.apply_for_details').show();
		getDetailStatus();
		});
	//申请页失败，查看状态
	$(".failstatus").live('click',function(){
		$('.apply_for_trial,.part1').hide();
	   	$('.apply_for_details').show();
		getDetailStatus();
		});
	});
	$(window).on('load',function(){
		if(isInApp()){
		$(".guideTop").hide();
		}else{
			$(".guideTop").show();
			}
	});
	//关闭顶部图片
	$(".freetryclose").live('click',function(){
		$('.guideTop').hide();
		});
$(".guideTop .freeguideimg,.fortrailForLoad").live('click',function(){
	if (browser.versions.mobile) {//判断是否是移动设备打开。browser代码在下面
        var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
                //在微信中打开
				$(".guide").show();
				$(".part1").hide();
				return false;
        }
        if (ua.match(/WeiBo/i) == "weibo") {
                //在新浪微博客户端打开
				$(".guide").show();
				$(".part1").hide();
				return false;
        }
        if (ua.match(/QQ/i) == "QQ") {
                //在QQ空间打开
				$(".guide").show();
				$(".part1").hide();
				return false;
        }
        if (browser.versions.ios) {
			window.location.href="/nggirl/h5/mobile/loadFreeTrial.html?cosmeticId="+getParamHack('cosmeticId')+'&v=<%= VERSION %>';	
                //是否在IOS浏览器打开
        } 
        if(browser.versions.android){
			window.location.href="/nggirl/h5/mobile/loadFreeTrial.html?cosmeticId="+getParamHack('cosmeticId')+'&v=<%= VERSION %>';	
                //是否在安卓浏览器打开
        }
	} else {
		window.location.href="/nggirl/h5/mobile/loadFreeTrial.html?cosmeticId="+getParamHack('cosmeticId')+'&v=<%= VERSION %>';	
		//否则就是PC浏览器打开
	};
});
	var browser = {
		versions: function () {
			var u = navigator.userAgent, app = navigator.appVersion;
			return {         //移动终端浏览器版本信息
				trident: u.indexOf('Trident') > -1, //IE内核
				presto: u.indexOf('Presto') > -1, //opera内核
				webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
				gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
				mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
				android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
				iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
				iPad: u.indexOf('iPad') > -1, //是否iPad
				webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
			};
		}(),
		language: (navigator.browserLanguage || navigator.language).toLowerCase()
	};
	$(".guide").live('click',function(){
		$(".guide").hide();
		$(".part1").show();
	})
function getfreeTrial(){
$.ajax({//采用异步
	type: "get",
	url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/cosmetic/getCosmeticTrialDetail/2.4.2',
	data:getFinalRequestObject({accessToken:getAccessToken(),cosmeticId:getParamHack('cosmeticId')}),
	timeout:15000,//10s
	dataType:"json",
	success: function (data) {
		if(data.code == 0){
			$("title").html(data.data.title);
			$(".activeDetail").attr("cosmeticStatus",data.data.cosmeticStatus);
			$(".activeDetail").attr("applyStatus",data.data.applyStatus);
			$(".activeDetail").attr("applyResult",data.data.applyResult);
			var str = "";
			str += '<div class="banner"><img src="'+data.data.headImg+'">';
			if(data.data.leftTime == ""){
			str += '<p class="bgb3">申请时间已结束</p></div>';	
				}else{
			str += '<p>申请时间剩余'+data.data.leftTime+'</p></div>';
				}
			str += '<div class="trialDetail"><p class="dtop"><span>免费试用</span>'+data.data.name+'</p>';
			str += '<div class="applyDetail clearfix"><div class="aleft"><p>限量<span>'+data.data.limits+'</span>名幸运菇凉</p><p>目前<span>';
			if(data.data.applyNum>9999){
				str += '9999+</span>人申请</p></div>';
				}else{
					str += data.data.applyNum+'</span>人申请</p></div>';
				}
			str += '<div class="aright"><p class="arighttop">'+getLocalTime(data.data.startTime)+'-'+getLocalTime2(data.data.endTime)+'</p><p class="arightbot">限时申请</p></div></div>';
			$(".activeDetail").append(str);
			$(".banner").height($(window).width()/2);
			$(".freeflow").attr('cosmeticStatus',data.data.cosmeticStatus);
			if(data.data.cosmeticStatus == 0){
				if(data.data.applyStatus == 1){
					if(isInApp()){
					$("#applybtn").removeClass().html("已申请，查看申请状态");
					$("#applybtn").addClass("lookstatus");
					}else{
						$("#applybtn").hide();
					};
				}else if(data.data.applyStatus == 0){
					$("#applybtn").removeClass().html("免费试用");
					if(isInApp()){
						$("#applybtn").addClass("fortrail");
					}else{
						$("#applybtn").addClass("fortrailForLoad");
					}
				}
			}else if(data.data.cosmeticStatus == 1){
				$(".applytit").html("公布名单");
				$(".applylist").hide();
				$(".waitresult").show();
				if(isInApp()){
					$("#applybtn").html("等待公布名单中");
					$("#applybtn").addClass("grey");
				}else{
					 $("#applybtn").hide();
				}
			}else if(data.data.cosmeticStatus == 2){
				$(".applytit").html("公布名单"); 
				$(".applylist").show();
				$(".waitresult").hide();
				if(isInApp()){
					bottomDetail();
				}else{
					$("#applybtn").hide();
				}
			}else if(data.data.cosmeticStatus == 3){
				$(".applytit").html("公布名单"); 
				$(".applylist").show();
				$(".waitresult").hide();
				if(isInApp()){
					bottomDetail();
				}else{
					$("#applybtn").hide();
				}
			}
			var str2="";
			str2 += '<div class="introdes">';
			for(var i = 0;i <data.data.cosmeticDetail.length;i++){
				if(data.data.cosmeticDetail[i].type == 1){
					str2 += '<p class="introtitle">'+data.data.cosmeticDetail[i].content+'</p>';
				}else if(data.data.cosmeticDetail[i].type == 2){
					str2 += '<p class="intropro">'+data.data.cosmeticDetail[i].content+'</p>';
				}else if(data.data.cosmeticDetail[i].type == 3){
					str2 += '<img class="introimg" src='+data.data.cosmeticDetail[i].content+' alt=""/>';
				}else if(data.data.cosmeticDetail[i].type == 4){
					str2 += '<p class="introtip">'+data.data.cosmeticDetail[i].content+'</p>';
				}
			}
			$(".intro").append(str2);
		   getApplyList();
			
			//微信分享
			if(isInWeixin()){
				var title = data.data.title;
				var desc = data.data.shareContent;
				var link = window.location.href;
				var imgUrl = data.data.shareImg;
				var from = getParamHack('apptype');
				if(!strIsEmpty(from) && from == 'appb'){
					desc = data.data.shareContent;
				}
				weixinConfig(title,desc,link,imgUrl);
			}
				
			//h5,app同步分享内容
			//给ios
			if(isInApp()){
				window.shareTitle =data.data.title;
				window.shareContent = data.data.shareContent;
				window.sharePicture = data.data.shareImg;
				window.shareUrl = window.location.href;
			};
			//给安卓传值
			if(typeof(window.ngjsInterface)!="undefined" && typeof(window.ngjsInterface.conFigShareInfo)!="undefined"){
				window.ngjsInterface.conFigShareInfo(data.data.title, data.data.shareContent,data.data.shareImg,window.location.href);
			};
		}else{
			alert(data.data.error);
		}
	},
	error: function (XMLHttpRequest, textStatus, errorThrown) {
		//console.log( XMLHttpRequest )
		//$(".main").html("尚未发布任何信息！");
	}
});
}
//底部判定
function bottomDetail(){
	checkAccessToken(function(){
		var num1=$(".activeDetail").attr("cosmeticStatus");
		var num2=$(".activeDetail").attr("applyStatus");
		var num3=$(".activeDetail").attr("applyResult");
		if(num2 == 0){
			$("#applybtn").removeClass().html("未申请，下次期待您的参与~");
			$("#applybtn").addClass("grey");
		}else if(num3 == 0 && num2 == 1){
			$("#applybtn").removeClass().html("申请失败，查看申请状态");
			$("#applybtn").addClass("failstatus");
		}else if(num3 == 1){
			$("#applybtn").removeClass().html("申请成功，查看申请状态");
			$("#applybtn").addClass("successtatus");
		}
	},function(){
		$("#applybtn").removeClass().html("立即登录，查看申请状态");
		$("#applybtn").addClass("gotologin");
	});

	}
//获取申请人员列表
function getApplyList(){
$.ajax({//采用异步
	type: "get",
	url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/cosmetic/getApplyUserList/2.1.0',
	data:getFinalRequestObject({cosmeticId:getParamHack('cosmeticId'),cosmeticStatus:$(".freeflow").attr('cosmeticStatus')}),
	timeout:15000,//10s
	dataType:"json",
	success: function (data) {
		if(data.code == 0){
			$(".applylist").children("li").remove();
			var str = "";
			if(data.data.length>0){
				$(".nomessage").remove();
				$(".applynum ul").show();
				for(var i = 0;i <data.data.length;i++){
					str += '<li class="applyphoto"><div><img src="'+data.data[i].profile+'"></div><p>'+htmlEscape(data.data[i].nickName)+'</p></li>';
				}
			}
			/*if($(".applytit").html() == "公布名单"){
				for(var i = 0;i <data.data.length;i++){
				str += '<li class="applyphoto"><div><img src="'+data.data[i].profile+'"></div><p>'+htmlEscape(data.data[i].nickName)+'</p></li>';
				}
				
			}else{
				if(data.data.length < 15){
					for(var i = 0;i <data.data.length;i++){
					str += '<li class="applyphoto"><div><img src="'+data.data[i].profile+'"></div><p>'+htmlEscape(data.data[i].nickName)+'</p></li>';
					}
				}else{
					for(var i = 0;i <14;i++){
					str += '<li class="applyphoto"><div><img src="'+data.data[i].profile+'"></div><p>'+htmlEscape(data.data[i].nickName)+'</p></li>';
					}
					str += '<li class="applyphoto"><img src="images/sangedian.png" class="sangedian"></li>';
				}
			}*/
			$(".applynum ul").append(str);
			if($(".applylist").height() == 282){
				$(".applylist").css('overflow','auto');
			}
		}else{
			alert(data.data.error);
			}
	},
	error: function (XMLHttpRequest, textStatus, errorThrown) {
		//console.log( XMLHttpRequest )
		//$(".main").html("尚未发布任何信息！");
	}
});
}
//获取申请留言
function getAllMessage(){
$.ajax({//采用异步
	type: "get",
	url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/cosmetic/getLeaveMessageList/2.1.0',
	data:getFinalRequestObject({cosmeticId:getParamHack('cosmeticId'),pageNum:0,pageSize:20}),
	timeout:15000,//10s
	dataType:"json",
	success: function (data) {
		if(data.code == 0){
			$(".message").children(".messages").remove();
			if(data.data.length>0){
				$(".nomessage").remove();
			}
			var str = "";
			for(var i = 0;i <data.data.length;i++){
				str += '<div class="messages clearfix">';
				str += '<div class="userphoto" id="'+data.data[i].userId+'"><img src="'+data.data[i].profile+'"></div>';
				str += '<div class="username"><p>'+ htmlEscape(data.data[i].nickName)+'</p><p>'+getLocalTime1(data.data[i].applyTime)+'</p></div>';
				str += '<p class="messagedetail">'+ htmlEscape(data.data[i].message)+'</p></div>';	
			}
			
			if( data.data.length >= 10){
				str += '<div class="messages lookmore">查看更多</div>';
			}
			$(".message").append(str);	
		}else{
			alert(data.data.error);
			}
	},
	error: function (XMLHttpRequest, textStatus, errorThrown) {
		//console.log( XMLHttpRequest )
		//$(".main").html("尚未发布任何信息！");
	}
});
}
//获取全部留言
function getAllMessage1(pageNum,pageSize){
$.ajax({//采用异步
	type: "get",
	url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/cosmetic/getLeaveMessageList/2.1.0',
	data:getFinalRequestObject({cosmeticId:getParamHack('cosmeticId'),pageNum:pageNum,pageSize:pageSize}),
	timeout:15000,//10s
	dataType:"json",
	success: function (data) {
		if(data.code == 0){
			var str = "";
			for(var i = 0;i <data.data.length;i++){
				str += '<div class="messages clearfix">';
				str += '<div class="userphoto" id="'+data.data[i].userId+'"><img src="'+data.data[i].profile+'"></div>';
				str += '<div class="username"><p>'+htmlEscape(data.data[i].nickName)+'</p><p>'+getLocalTime1(data.data[i].applyTime)+'</p></div>';
				str += '<p class="messagedetail">'+htmlEscape(data.data[i].message)+'</p></div>';	
			}
			$(".messagesall").append(str);	
			if( data.data.length == pageSize ){
				var tur = true;	
			   $(window).scroll(function(){
					 var winH = $(window).height(); //页面可视区域高度  
					 var pageH = $(".messagesall").height();  
					 var scrollT = $(window).scrollTop(); //滚动条top
					 var aa = (pageH - winH-scrollT) / winH;  
					 if(tur && aa <0.02){
						 setTimeout(function(){
							 getMoreMessage();
						 },500);
						 tur = false;
					 } 
			
			   });
			}
		}else{
			alert(data.data.error);
			}
	},
	error: function (XMLHttpRequest, textStatus, errorThrown) {
		//console.log( XMLHttpRequest )
		//$(".main").html("尚未发布任何信息！");
	}
});
}
function getMoreMessage(){
	var pageSize = 20;
	var pageNum = $('body').data('pageNum');
	if(pageNum == undefined || parseInt(pageNum) == NaN){
		pageNum = 0;
	}
	pageNum = pageNum + 1;
	$('body').data('pageNum',pageNum);
	getAllMessage1(pageNum,pageSize);
	}	
//时间格式化
function getLocalTime(publishTime) {
        var s = 0;
        s = new Date(publishTime);
		var m=parseInt(s.getMonth() + 1);
		if(m<10){
			m="0"+m;
			}
		var day=parseInt(s.getDate());
		if(day<10){
			day="0"+day;
			}
		
        return ( m + "." +day)  ;
}
//时间格式化
function getLocalTime2(publishTime) {
        var s = 0;
        s = new Date(publishTime);
		var m=parseInt(s.getMonth() + 1);
		if(m<10){
			m="0"+m;
			}
		var day=parseInt(s.getDate());
		if(day<10){
			day="0"+day;
			}
		var hours=parseInt(s.getHours());
		if(hours<10){
			hours="0"+hours;
			}
		var minutes=parseInt(s.getMinutes());
		if(minutes<10){
			minutes="0"+minutes;
			}
        return ( m + "." +day+ " " +hours+ ":" +minutes)  ;
}
//留言时间格式化
function getLocalTime1(publishTime) {
    var d_minutes, d_hours, d_days;
    var timeNow = parseInt(new Date().getTime() / 1000);
    var d;
    d = timeNow - publishTime/1000;
    d_days = parseInt(d / 86400);
    d_hours = parseInt(d / 3600);
    d_minutes = parseInt(d / 60);
	var s = 0;
    s = new Date(publishTime);
    var sthours=parseInt(s.getHours());
	var nohours=parseInt(new Date().getHours());
	var m=parseInt(s.getMonth() + 1);
		if(m<10){
			m="0"+m;
			}
		var day=parseInt(s.getDate());
		if(day<10){
			day="0"+day;
			}
		 var hours=parseInt(s.getHours());
		if(hours<10){
			hours="0"+hours;
			}
		var minutes=parseInt(s.getMinutes());
		if(minutes<10){
			minutes="0"+minutes;
			}
    if (d_days <= 0 && d_hours >= 0 && nohours>=sthours) {
		if(nohours=sthours && d_hours>10){
			return (s.getFullYear() + "-" + m) + "-" +day ;
		}
		return (hours + ":" +  minutes) ;
    } else {
     return (s.getFullYear() + "-" + m) + "-" +day ;
    }
}

//获取申请状态
function getDetailStatus(){
		$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/cosmetic/getCosmeticTrialDetail/2.1.0',getFinalRequestObject({cosmeticId:getParamHack('cosmeticId'),accessToken: getAccessToken(),}),function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				//申请时间
				$('.time').html(data.data.applyTime);
				//判断申请状态
				
				//试用妆品图
				$('.apply_for_details .cover').attr('src',data.data.cosmeticImg);
				$('.apply_for_details .cover').height($('.apply_for_details .cover').width() /2);
				
				//试用妆品名称
				$('.apply_for_details .bc_content').html(data.data.name);
				if(data.data.cosmeticStatus == 0 && data.data.applyStatus == 1){//申请中
					$('.bc_status').html('申请审核中，请耐心等待！');
					$('.apply_status').html('申请中');
					
					/*$(".flow li:eq(0) img").removeAttr("src").attr("src","images/shenqing2.png");
					$(".flow li:eq(0) p").css('color','#50c8b4');*/
					$("#applybtn").removeClass().html("已申请，查看申请状态");
					$("#applybtn").addClass("lookstatus");
				}
				if(data.data.cosmeticStatus == 1){//申请失败
					/*$(".flow li:eq(2) img").attr("src","images/mingdan2.png");
					$(".flow li:eq(2) p").css('color','#50c8b4');*/
					$(".applylist").hide();
					$(".waitresult").show();
					$("#applybtn").removeClass().html("等待公布名单中");
					$("#applybtn").addClass("grey");
				}
				if(data.data.cosmeticStatus == 2  && data.data.applyStatus == 1 && data.data.applyResult == 0){//申请失败
					$('.bc_status').html('好可惜哦，下次继续努力~');
					$('.apply_status').html('申请失败');
					$("#applybtn").removeClass().html("申请失败，查看申请状态");
					$("#applybtn").addClass("failstatus");
				}
				if(data.data.cosmeticStatus == 2 && data.data.applyStatus == 1 && data.data.applyResult == 1){//申请成功
					$('.bc_status').html('恭喜您，申请成功，可免费领取试用！');
					$('.apply_status').html('申请成功');
					$("#applybtn").removeClass().html("申请成功，查看申请状态");
					$("#applybtn").addClass("successtatus");
				}
				if(data.data.cosmeticStatus == 3  && data.data.applyStatus == 1 && data.data.applyResult == 0){//申请失败
					$('.bc_status').html('好可惜哦，下次继续努力~');
					$('.apply_status').html('申请失败');
					$("#applybtn").removeClass().html("申请失败，查看申请状态");
					$("#applybtn").addClass("failstatus");
				}
				if(data.data.cosmeticStatus == 3 && data.data.applyStatus == 1 && data.data.applyResult == 1){//申请成功
					$('.bc_status').html('恭喜您，申请成功，可免费领取试用！');
					$('.apply_status').html('申请成功');
					$("#applybtn").removeClass().html("申请成功，查看申请状态");
					$("#applybtn").addClass("successtatus");
				}
			}else{
				alert(data.data.error);	
			}
		});

}
	//初始化微信分享功能
	function weixinConfig(title,desc,link,imgUrl) {

		wx.ready(function(){

			//获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
			wx.onMenuShareTimeline({
				title: title, // 分享标题
				link: link, // 分享链接
				imgUrl: imgUrl, // 分享图标
				success: function () {
					// 用户确认分享后执行的回调函数
					_czc.push(['_trackEvent','mianfeishizhuangfenxiang','timeline','shenqing','true','']);		
					$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/personalInfo/shareSuccess/2.0.0',
					getFinalRequestObject({accessToken: getAccessToken(),
					shareType:1,
					contentType:'h5',
					contentInfo:window.location.href
					})
					,function(data){
						var data = $.parseJSON(data);
						if(data.code == 0){
							
						}else{
							alert(data.data.error);	
						}	
					})
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
				}
			});


			//获取“分享给朋友”按钮点击状态及自定义分享内容接口
			wx.onMenuShareAppMessage({
				title: title, // 分享标题
				desc: desc, // 分享描述
				link: link, // 分享链接
				imgUrl: imgUrl, // 分享图标
				type: 'link', // 分享类型,music、video或link，不填默认为link
				dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				success: function () {
					// 用户确认分享后执行的回调函数
					_czc.push(['_trackEvent','mianfeishizhuangfenxiang2','friend','shenqing','true','']);
					$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/personalInfo/shareSuccess/2.0.0',
					getFinalRequestObject({accessToken: getAccessToken(),
					shareType:2,
					contentType:'h5',
					contentInfo:window.location.href
					})
					,function(data){
						var data = $.parseJSON(data);
						if(data.code == 0){
							
						}else{
							alert(data.data.error);	
						}	
					})
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
				}
			});
		});

		var currenturl = window.location.href;
		//初始化配置信息
		$.ajax({
			url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/weixinjs/config',
			type: 'post',
			dataType: 'json',
			data: getFinalRequestObject({url: currenturl, accessToken: getAccessToken()}),
			success: function (data) {
				//初始化配置
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: data.data.appId, // 必填，公众号的唯一标识
					timestamp: data.data.timestamp, // 必填，生成签名的时间戳
					nonceStr: data.data.noncestr, // 必填，生成签名的随机串
					signature: data.data.signature,// 必填，签名，见附录1
					jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});
			}
		});
	}
