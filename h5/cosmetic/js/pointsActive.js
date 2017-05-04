// JavaScript Document
$(function(){
	getPointsActive();
	$(".part2 input").width($(window).width()-100);
	$(".result").css('margin-top',-$(window).width()*1.09/2);
	$(".prizeflow li p").css("margin-top",$(window).width()*0.0302);
	$(".prizeflow li p").css("margin-bottom",$(window).width()*0.0417);
	//微信分享
	var title = '【南瓜姑娘】南瓜姑娘赚积分冲榜赢“乖萌玩偶”';
	var desc = '在南瓜姑娘签到赚积分，萌萌哒玩偶等认领，你不来一个？';
	var link = window.location.protocol+"//"+window.location.host+'/nggirl/h5/cosmetic/pointsActive.html?v=<%= VERSION %>';
	var imgUrl = window.location.protocol+"//"+window.location.host+'/nggirl/h5/cosmetic/images/points/share.jpg';
	weixinConfig(title,desc,link,imgUrl);
	//h5,app同步分享内容
	if(isInApp()){
		window.shareTitle =title;
		window.shareContent = desc;
		window.sharePicture = imgUrl;
		window.shareUrl = link;
	};	
	//给安卓传值
	if(typeof(window.ngjsInterface)!="undefined" && typeof(window.ngjsInterface.conFigShareInfo)!="undefined"){
		window.ngjsInterface.conFigShareInfo(title, desc,imgUrl,link);
	};
	//活动规则
	$(".rulerBtn").css('top',$(window).width()/2+8);
	$(".rulerBtn").die('click');
	$(".rulerBtn").live('click',function(){
		$("body").addClass("tcstyle");
		$(".boxshadow,.innercontent").show();
	})
 	//点击查看放大图片
	$(".prizeflow img").live('click',function(){
		$("body").css("overflow","hidden");
		$("body").bind('touchmove',function(event){
			event.preventDefault();
		});
		$(".boxshadow,.imgbox").show();
		$(".imgbox li").children().remove();
	})
	$(".prizeflow img:eq(0)").live('click',function(){
		$(".imgbox li").append('<img src="images/points/bpoints1.png" class="bigimg"><img src="images/points/pointsCloseBtn.png" class="close"><p>南瓜玩偶</p>');
	});
	$(".prizeflow img:eq(2)").live('click',function(){
		$(".imgbox li").append('<img src="images/points/bpoints2.jpg" class="bigimg"><img src="images/points/pointsCloseBtn.png" class="close"><p>南瓜周边礼包</p>');
	});
	$(".prizeflow img:eq(1)").live('click',function(){
		$(".imgbox li").append('<img src="images/points/bpoints3.jpg" class="bigimg"><img src="images/points/pointsCloseBtn.png" class="close"><p>Primera面膜</p>');
	});
	$(".boxshadow,.imgbox").live('click',function(){
		$("body").unbind('touchmove');
		$("body").css("overflow","auto");
		$(".boxshadow,.imgbox,.innercontent,.result").hide();
		$("body").removeClass("tcstyle");	
	});
	//去赚积分
	$(".gotoindex").die('click');
	$(".gotoindex").live('click',function(){
		_czc.push(['_trackEvent','pointsActive','click','shenqing','true','']);
		checkAccessToken(function(){
			window.location.href = window.location.protocol+'//'+window.location.host+'/nggirl/h5/cosmetic/index.html?v=<%= VERSION %>';
		},function(){
			window.location.href = 'nggirl://nggirl/login?backUrl='+window.location.protocol+'//'+window.location.host+'/nggirl/h5/cosmetic/pointsActive.html?v=<%= VERSION %>';
		});
	});
	//填写地址
	$(".addAddress,.addAddress1").die('click');
	$(".addAddress,.addAddress1").live('click',function(){
		$(".part1,.boxshadow,.result").hide();
		$(".part2").show();
	});
	//part2判断按钮是否可点击了
	$(".message input").die('keyup');
	$(".message input").live('keyup',function(){
		if($(".message .box1 input").val() != "" && $(".message .box2 input").val() != "" &&　$(".message .box3 input").val() != ""){
			$(".mesbtn").removeClass('greyBtn');
		}else{
			$(".mesbtn").addClass('greyBtn');
		};
	});
	//part2点击保存按钮
	$('.part2 .mesbtn').click(function(e) {
		if($.trim($('.message .box1 input').val()) == ''){
			alertFn('小南瓜还不知道你叫啥类~');	
		}else if($.trim($('.message .box2 input').val()) == ''){
			alertFn('能告诉小南瓜你的电话吗^_^');
		}else if($.trim($('.message .box3 input').val()) == ''){
			alertFn('小南瓜有小礼物寄给你要告诉我地址哦~');
		}else{			
			//验证手机号
			if(isPhoneNum($.trim($('.message .box2 input').val()))){
				var genData = {
					accessToken: getAccessToken(),
					userName:$.trim($('.message .box1 input').val()),
					userPhone:$.trim($('.message .box2 input').val()),
					userAddress:$.trim($('..message .box3 input').val()),
				};
				$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/activity/pointsRanking/addAddress',getFinalRequestObject(genData),function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						$('.part2').hide();
						$('.part1').show();
						$("#pointsBtn").html("恭喜您已中奖，坐等收货礼品~").removeClass().addClass('greyBtn');
					}else{
						alert(data.data.error);	
					}
				});
			}else{
				alertFn('哎呦，手机号写错啦~~！');	
			}
			
		}
    });
	//结果提示关闭按钮
	$(".pointsCloseBtn,.close").die('click');
	$(".pointsCloseBtn,.close").live('click',function(){
		$(".boxshadow,.result").hide();
	});
	//立即登录，查看申请状态
	$(".gotologin").live('click',function(){
		checkAccessToken(function(){
			},function(){
				window.location.href = 'nggirl://nggirl/login?backUrl='+window.location.protocol+'//'+window.location.host+'/nggirl/h5/cosmetic/pointsActive.html?v=<%= VERSION %>';
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
	$(".guideTop .freeguideimg,.pointsForLoad").live('click',function(){
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
        if (ua.match(/QQ/i) == "qq") {
                //在QQ空间打开
				$(".guide").show();
				$(".part1").hide();
				return false;
        }
        if (browser.versions.ios) {
			window.location.href="/nggirl/h5/mobile/loadPointsActive.html?v=<%= VERSION %>";	
                //是否在IOS浏览器打开
        } 
        if(browser.versions.android){
			window.location.href="/nggirl/h5/mobile/loadPointsActive.html?v=<%= VERSION %>";	
                //是否在安卓浏览器打开
        }
	} else {
		window.location.href="/nggirl/h5/mobile/loadPointsActive.html?v=<%= VERSION %>";	
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
	});

function getPointsActive(){
	$.ajax({//采用异步
		type: "get",
		url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/activity/pointsRanking/getRank',
		data:getFinalRequestObject({accessToken:getAccessToken()}),
		timeout:15000,//10s
		dataType:"json",
		success: function (data) {
			if(data.code == 0){
				var leavetime=data.data.endTime-data.data.systemTime;
				//var leavetime=1473782400000-1475078400000;
				var i=1;
				var rank = data.data.rank;
				if(leavetime>0){
					$(".banner p").show().html('剩余时间：'+getLocalTime(leavetime));
				}else{
					$(".banner p").show().html("活动已结束").addClass('bgb3');;
				};
				$(".myRanking .left .newPoints").html(data.data.newScore);
				if(data.data.newScore != "0"){
					$(".myRanking .right .ranking").html(rank);
				}else{
					$(".myRanking .right .ranking").html("暂无排名").addClass("blackColor");
				};
				if(data.data.rankList.length == "0"){
					$(".rankingList .nonePeo").show();
				}else{
					$(".rankingList .nonePeo").hide();
					$(".rankingList .havePeo").show();
				};
				//刷新接口时，删除数据
				$('.rankingList .havePeo').children().remove();
				$.each(data.data.rankList,function(key,val){
					$('.rankingList .havePeo').append('<div userId='+val.userId+' class="rankDet"><div class="rankleft"><i>NO.'+i+'</i><div class="img"><img src="'+val.userAvatar+'" /></div></div><div class="rankcenter">'+val.userName+'</div><div class="rankright">'+val.userScore+'积分</div></div>');
					i++;
				});
				$(".rankingList .havePeo .rankDet:eq(0) .img").append('<img src="images/points/firstRanking.png" class="crown">');
				$(".rankingList .havePeo .rankDet:eq(1) .img").append('<img src="images/points/secondRanking.png" class="crown">');
				$(".rankingList .havePeo .rankDet:eq(2) .img").append('<img src="images/points/thirdRanking.png" class="crown">');
				//地址信息
				$(".message .box1 input").val(data.data.userName);
				$(".message .box2 input").val(data.data.userPhone);
				$(".message .box3 input").val(data.data.address);
				if(isInApp() && leavetime<0){
					if(data.data.userId == null){
						$("#pointsBtn").show().html("登录，查看中奖详情>>").removeClass().addClass("gotologin");
					}else{
						if(rank<51 && rank > 0){
							if(data.data.hasAddress == 0){
								var str="";
								if(rank<6 && rank > 0){
									str="南瓜玩偶+南瓜周边礼包+Primera面膜／2片（随机）";
								}else if(rank<11 && rank > 5){
									str="南瓜玩偶+南瓜周边礼包";
								}else if(rank<31 && rank > 10){
									str="南瓜玩偶＋随机南瓜周边";
								}else if(rank<51 && rank > 30){
									str="南瓜玩偶";
								}
								$(".boxshadow,.result,#pointsBtn").show();
								$(".result").append('<img src="images/points/congratulate.png" class="resultbg"/><img src="images/points/pointsCloseBtn.png" class="pointsCloseBtn"/>');
								$("#pointsBtn").html("恭喜您已中奖，赶快去填写收货地址吧>>").removeClass().addClass('addAddress');
								$(".result .getPrize").append('<p>恭喜您荣获第<i>'+rank+'</i>名<br/>获得<i>'+str+'</i>奖品</p><p class="tip">赶快去填写地址吧~</p><span class="addAddress1">去填写</span>');
							}else{
								$("#pointsBtn").show().html("恭喜您已中奖，坐等收货礼品~").removeClass().addClass('greyBtn');
							}	
						}else if(rank>50 || rank == 0){
							$(".boxshadow,.result").show();
							$(".result").append('<img src="images/points/congratulate.png" class="resultbg"/><img src="images/points/pointsCloseBtn.png" class="pointsCloseBtn"/>');
							$("#pointsBtn").show().html("未获得奖品，下次努力~").removeClass().addClass('greyBtn');
							$(".result .getPrize").append('<p>很遗憾哦，<br/>新增积分排名您只排到第<i>'+rank+'</i>名，<br/>超出了50名，未获得奖品</p><p class="tip">不要放弃下次努力~</p><span class="close">知道了</span>');
						}
					}
				}else if(leavetime > 0){
					if(isInApp()){
						$("#pointsBtn").show().html("赚取积分去>>").removeClass().addClass("gotoindex");
					}else{
						$("#pointsBtn").show().html("赚取积分去>>").removeClass().addClass("pointsForLoad");
					}
				}
				//微信分享												  
				/*if(isInWeixin()){
					var title = '南瓜姑娘赚积分冲榜赢“乖萌玩偶”';
					var desc = '在南瓜姑娘签到赚积分，萌萌哒玩偶等认领，你不来一个？';
					var link = window.location.protocol+"//"+window.location.host+'/nggirl/h5/cosmetic/pointsActive.html?v=<%= VERSION %>';
					var imgUrl = window.location.protocol+"//"+window.location.host+'/nggirl/h5/cosmetic/images/share.jpg';
					var from = getParamHack('apptype');
					if(!strIsEmpty(from) && from == 'appb'){
						desc ='在南瓜姑娘签到赚积分，萌萌哒玩偶等认领，你不来一个？';
					}
					weixinConfig(title,desc,link,imgUrl);
				}*/
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
});
//时间格式化
function getLocalTime(publishTime) {
        var nTime = 0;
        nTime = new Date(publishTime/1000);
		var day = Math.floor(nTime/86400);    
		var hour = Math.floor(nTime%86400/3600);    
		var minute = Math.floor(nTime%86400%3600/60);
        return ( day+ "天" +hour+ "时" +minute+ "分")  ;
};
//验证手机号
function isPhoneNum(phoneNum){
	var reg = /^1[3|8|7|5|4]\d{9}$/;
	return reg.test(phoneNum);		
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
				_czc.push(['_trackEvent','pointsactivefenxiang','friend','shenqing','true','']);
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
				_czc.push(['_trackEvent','pointsactivefenxiang','friend','shenqing','true','']);
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