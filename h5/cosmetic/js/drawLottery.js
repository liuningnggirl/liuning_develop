// JavaScript Document
$(function(){
	//加载数据
	//checkAccessTokenLogin(loadBasicInfo,window.location.href);
	loadBasicInfo();
	
	$(".address input").width($(window).width()-100);
	$(".result").css('margin-top',-$(window).width()*1.09/2);
	
	//进入我的摇奖记录
	$('#userRecordImg').click(function(){
		if(isInApp() && getAppVersion() >= 2.05){
			checkAccessToken(function(){
				window.location.href = '/nggirl/h5/cosmetic/lottery_myAwards.html?v=<%= VERSION %>';
			},function(){
				window.location.href = 'nggirl://nggirl/login?backUrl='+window.location.protocol+'//'+window.location.host+'/nggirl/h5/cosmetic/drawLottery.html?activityId='+getParam('activityId')+'&v=<%= VERSION %>' ;
			});
		}else{
			checkAccessTokenLogin(function () {
				window.location.href = '/nggirl/h5/cosmetic/lottery_myAwards.html?v=<%= VERSION %>';
			},'/nggirl/h5/cosmetic/drawLottery.html?activityId='+getParam('activityId')+'&v=<%= VERSION %>');
		};
	});
	//活动规则
	$(".rulerBtn").css('top',$(window).width()/2+8);
	$(".rulerBtn").die('click');
	$(".rulerBtn").live('click',function(){
		$("body").addClass("tcstyle");
		$(".boxshadow,.innercontent").show();
	})
 	//点击查看放大图片
	$(".prizeflow img").live('click',function(obj){
		$("body").css("overflow","hidden");
		$("body").bind('touchmove',function(event){
			event.preventDefault();
		});
		$(".boxshadow,.imgbox").show();
		$(".imgbox ul").children().remove();
		
		var imgObj = obj.srcElement;
		var imgUrl = imgObj.src;
		var liObj = imgObj.parentNode;
		var prizeName = $(liObj).attr('data-name');
		var prizeNum = $(liObj).attr('data-num');
		var imgBoxTemplate = $('.imgbox-template').clone();
		imgBoxTemplate.children('.bigimg').attr('src', imgUrl);
		imgBoxTemplate.find('.desc .descName').html(prizeName);
		imgBoxTemplate.find('.desc .descNum').html(prizeNum);
		imgBoxTemplate.removeClass('imgbox-template');
		imgBoxTemplate.removeClass('hidden');
		$(".imgbox ul").append(imgBoxTemplate);
	})
	//弹出框，点击后消失事件
	$(".boxshadow,.imgbox").live('click',function(){
		$("body").unbind('touchmove');
		$("body").css("overflow","auto");
		$(".boxshadow,.imgbox,.innercontent,.result").hide();
		$("body").removeClass("tcstyle");	
		
		$(".drawResult").addClass('hidden');
		$(".drawResult .sorry,.drawResult .lack-of-score,.drawResult .goods,.drawResult .third-coupon,.drawResult .nggirl-coupon").addClass('hidden');
		animatePointer($('.drawZone .drawPan .pan'),0);
	});
	$(".drawResult,.result-inner").live('click',function(){
		$("body").unbind('touchmove');
		$(".boxshadow").hide();
		$("body").css("overflow","auto");
		$(".drawResult").addClass('hidden');
		$(".drawResult .sorry,.drawResult .lack-of-score,.drawResult .goods,.drawResult .third-coupon,.drawResult .nggirl-coupon").addClass('hidden');
		animatePointer($('.drawZone .drawPan .pan'),0);
	});
	//跳转到填地址页面
	$(".drawResult .goods .confirm-btn").live('click',function(){
		$("body").unbind('touchmove');
		$(".boxshadow").hide();
		$("body").css("overflow","auto");
		$(".drawResult").addClass('hidden');
		$(".drawResult .sorry,.drawResult .lack-of-score,.drawResult .goods,.drawResult .third-coupon,.drawResult .nggirl-coupon").addClass('hidden');
		$(".address").removeClass('hidden');
	});
	//跳转到优惠券详情页面
	$(".drawResult .third-coupon .confirm-btn").live('click',function(){
		window.location.href = "myLotteryAwardDetail.html?awardRecordId="+$(".drawResult .third-coupon,.drawResult .nggirl-coupon").attr("data-id")+'&v=<%= VERSION %>' ;//我的奖品详情页
	});
	//跳转到南瓜券详情页面
	$(".drawResult .nggirl-coupon .confirm-btn").live('click',function(){
		window.location.href = "myLotteryAwardDetail.html?awardRecordId="+$(".drawResult .nggirl-coupon,.drawResult .nggirl-coupon").attr("data-id")+'&v=<%= VERSION %>' ;//我的奖品详情页
	});

	//address判断按钮是否可点击了
	$(".message input").die('keyup');
	$(".message input").live('keyup',function(){
		if($(".message .box1 input").val() != "" && $(".message .box2 input").val() != "" && $(".message .box3 input").val() != ""){
			$(".mesbtn").removeClass('greyBtn');
		}else{
			$(".mesbtn").addClass('greyBtn');
		};
	});
	//address点击保存按钮
	$('.address .mesbtn').click(function(e) {
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
					awardRecordId: $('.drawResult .goods').attr('data-id'),
					realName:$.trim($('.message .box1 input').val()),
					phoneNum:$.trim($('.message .box2 input').val()),
					address:$.trim($('..message .box3 input').val()),
				};
				$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/lottery/fillLotteryAwardAddress/2.5.3',getFinalRequestObject(genData),function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						alert('地址提交成功！');
						$('.address').addClass('hidden');
						animatePointer($('.drawZone .drawPan .pan'),0);
					}else{
						alert(data.data.error);	
					}
				});
			}else{
				alertFn('哎呦，手机号写错啦~~！');	
			}
		}
    });
});

//加载基本信息
var prizeNum = 0;//奖品总数
var curBasicData;//本次获取到的数据
function loadBasicInfo(){
	$.ajax({
		type: "get",
		url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/lottery/getLotteryInfo/2.5.3',
		data:getFinalRequestObject({accessToken:getAccessToken(),activityId:getParam('activityId')}),
		timeout:15000,
		dataType:"json",
		success: function (data) {
			if(data.code != 0){
				alert(data.error);
				return;
			}
			
			data = data.data;
			curBasicData = data;
			$(document).attr("title",data.title);
			$('#headerImg').attr('src',data.headImg);
			if(data.remainFreeTimes > 0){
				$('.drawZone .timesLeft').html('今日免费次数<span>'+ data.remainFreeTimes +'</span>次');
			}else{
				$('.drawZone .timesLeft').html('<span>'+ data.costScore +'</span>积分/次');
			}
			$('.drawZone .userPoints span').html(data.userScore);
			$('.drawZone .drawPan .pan').attr('src',data.rotaryTableImg);
			//显示时间
			var leavetime=data.endTime-data.currentTime;
			if(data.startTime > data.currentTime){
				$("#headerCounter").show().html(formatDate(new Date(data.startTime),'yyyy-MM-dd hh:mm')+' 开始抽奖');
				$("#headerCounter").addClass('bgb3');
			}else{
				if(leavetime>0){
					$("#headerCounter").show().html('剩余时间：'+leftTimeFormat(leavetime));
				}else{
					$("#headerCounter").show().html("活动已结束").addClass('bgb3');;
				};
				$("#headerCounter").css('background','#50c8b4');
			}
			
			//判断指针颜色
			if(data.startTime > data.currentTime || data.endTime < data.currentTime){
				$('.drawZone .drawPan .pointer').attr('src','images/drawLottery/pointer.png');
			}else{
				$('.drawZone .drawPan .pointer').attr('src',data.pointerImg);
				$('.drawZone .drawPan .pointer').click(drawWithTokenCheck);
			}
			//设置规则中的时间
			var dateStart = new Date(data.startTime);
			var dateEnd = new Date(data.endTime);
			$('.rulerdetail2 .start').html(formatDate(dateStart,'yyyy年MM月dd日'));
			$('.rulerdetail2 .end').html(formatDate(dateEnd,'yyyy年MM月dd日'));
			$('.rulerdetail2 .times').html(data.dailyFreeTimes);
			$('.rulerdetail2 .costScore').html(data.costScore);
			//初始化微信分享信息
			if(isInWeixin()){
				weixinConfig(data.title,data.shareContent,window.location.href,data.shareImg);
			};
			//h5,app同步分享内容
			if(isInApp()){
				window.shareTitle = data.title;
				window.shareContent = data.shareContent;
				window.sharePicture = data.shareImg;
				window.shareUrl = window.location.href;
			};	
			//给安卓传值
			if(typeof(window.ngjsInterface)!="undefined" && typeof(window.ngjsInterface.conFigShareInfo)!="undefined"){
				window.ngjsInterface.conFigShareInfo(data.title, data.shareContent,data.shareImg,window.location.href);
			};
			//加载奖品信息
			loadPrizeInfo();
			//加载中奖名单
			loadPrizedList();
		}
	});
};

//登录状态检查
function drawWithTokenCheck(){
	if(isInApp() && getAppVersion() >= 2.05){
		checkAccessToken(function(){
			draw();
		},function(){
			window.location.href = 'nggirl://nggirl/login?backUrl='+window.location.protocol+'//'+window.location.host+'/nggirl/h5/cosmetic/drawLottery.html?activityId='+getParam('activityId')+'&v=<%= VERSION %>' ;
		});
	}else{
		checkAccessTokenLogin(function () {
			draw();
		},'/nggirl/h5/cosmetic/drawLottery.html?activityId='+getParam('activityId')+'&v=<%= VERSION %>');
	};
}

//摇奖操作
function draw(){
	
	//检查登录状态
	
	
	_czc.push(['_trackEvent','nggirl_drawlottery_click','摇奖','click','true','']);
	if(curBasicData.remainFreeTimes ==0 && curBasicData.userScore < curBasicData.costScore){
		//积分不足
		$('.drawResult .lack-of-score .tips span').html(curBasicData.userScore);
		
		$("body").css("overflow","hidden");
		$("body").bind('touchmove',function(event){
			event.preventDefault();
		});
		$(".boxshadow").show();
		$('.drawResult').removeClass('hidden');
		$('.drawResult .lack-of-score').removeClass('hidden');
	}else{
		$('.drawZone .drawPan .pointer').unbind('click');
		//执行摇奖操作
		$.ajax({
			type: "post",
			url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/lottery/userDraw/2.5.3',
			data:getFinalRequestObject({accessToken:getAccessToken(),activityId:getParam('activityId')}),
			timeout:15000,
			dataType:"json",
			success: function (data) {
				if(data.code != 0){
					alert(data.data.error);
					return;
				}
				
				data = data.data;
				//更新积分和剩余次数信息
				if(data.userScore < curBasicData.userScore){
					curBasicData.userScore = data.userScore;
				}else{
					curBasicData.remainFreeTimes = data.remainFreeTimes;
				}
				if(data.remainFreeTimes > 0){
					$('.drawZone .timesLeft').html('今日免费次数<span>'+ data.remainFreeTimes +'</span>次');
				}else{
					$('.drawZone .timesLeft').html('<span>'+ curBasicData.costScore +'</span>积分/次');
				}
				//更新用户积分
				$('.drawZone .userPoints span').html(data.userScore);
				
				//测试数据区
/*				data.hintType = 2;
				data.awardName = '南瓜券';
				data.couponName='南瓜券';
				data.fitProduct='仅限上门美妆使用';
				data.limitPrice='199';
				data.price='30';
				data.awardRecordId = '2016092847104144';*/
				
				//积分不足的再次判断
				if(data.hintType == 4){
					$('.drawResult .lack-of-score .tips span').html(data.userScore);
					
					$("body").css("overflow","hidden");
					$("body").bind('touchmove',function(event){
						event.preventDefault();
					});
					$(".boxshadow").show();
					$('.drawResult').removeClass('hidden');
					$('.drawResult .lack-of-score').removeClass('hidden');
					
				}else{
					var baseAngle = (prizeNum - (data.awardSeq-1))/prizeNum*360;
					var randomAngle = 4*360 + baseAngle;
					animatePointer($('.drawZone .drawPan .pan'),randomAngle,function(){
						switch(data.hintType){
						case 0://未中奖
							$("body").css("overflow","hidden");
							$("body").bind('touchmove',function(event){
								event.preventDefault();
							});
							$(".boxshadow").show();
							$('.drawResult').removeClass('hidden');
							$('.drawResult .sorry').removeClass('hidden');
							break;
						case 1://商品
							$('.drawResult .goods .tips span').html(data.awardName);
							$('.drawResult .goods').attr('data-id',data.awardRecordId);
							$("body").css("overflow","hidden");
							$("body").bind('touchmove',function(event){
								event.preventDefault();
							});
							$(".boxshadow").show();
							$('.drawResult').removeClass('hidden');
							$('.drawResult .goods').removeClass('hidden');
							break;
						case 2://南瓜券
							$('.drawResult .nggirl-coupon .tips .awardName span').html(data.price);
							$('.drawResult .nggirl-coupon .mount').html(data.price);
							$('.drawResult .nggirl-coupon .detail li:nth-child(1)').html(data.couponName);
							$('.drawResult .nggirl-coupon .detail li:nth-child(2)').html(data.fitProduct);
							$('.drawResult .nggirl-coupon .detail li:nth-child(3) span').html(data.limitPrice);
							$('.drawResult .nggirl-coupon').attr('data-id',data.awardRecordId);
							$("body").css("overflow","hidden");
							$("body").bind('touchmove',function(event){
								event.preventDefault();
							});
							$(".boxshadow").show();
							$('.drawResult').removeClass('hidden');
							$('.drawResult .nggirl-coupon').removeClass('hidden');
							break;
						case 3://第三方优惠券
							$('.drawResult .third-coupon .tips span').html(data.awardName);
							$('.drawResult .third-coupon').attr('data-id',data.awardRecordId);
							$("body").css("overflow","hidden");
							$("body").bind('touchmove',function(event){
								event.preventDefault();
							});
							$(".boxshadow").show();
							$('.drawResult').removeClass('hidden');
							$('.drawResult .third-coupon').removeClass('hidden');
							break;
						case 4://积分不足
							$('.drawResult .lack-of-score .tips span').html(data.userScore);
							
							$("body").css("overflow","hidden");
							$("body").bind('touchmove',function(event){
								event.preventDefault();
							});
							$(".boxshadow").show();
							$('.drawResult').removeClass('hidden');
							$('.drawResult .lack-of-score').removeClass('hidden');
							break;
						default://其他
							break;
						}
						
						$('.drawZone .drawPan .pointer').attr('src',curBasicData.pointerImg);
						$('.drawZone .drawPan .pointer').click(draw);
					});
				}
			}
		});
	}
}
function animatePointer(target,angle,callback){
	target.stopRotate();
	target.rotate({
		angle: 0,
		duration: 4000, //旋转时间
		animateTo: angle, //旋转角度
		callback: callback//回调函数
	});
}
//加载奖品信息
function loadPrizeInfo(){
	$.ajax({
		type: "get",
		url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/lottery/getAwardList/2.5.3',
		data:getFinalRequestObject({activityId:getParam('activityId')}),
		timeout:15000,
		dataType:"json",
		success: function (data) {
			if(data.code != 0){
				alert(data.error);
				return;
			}
			
			data = data.data;
			prizeNum = data.length;
			for(var i=0; i<data.length; i++){
				if(data[i].awardType == '0'){
					continue;
				}
				
				var template = $('.prizeFlow-template').clone();
				template.removeClass('prizeFlow-template');
				template.removeClass('hidden');
				var prize = data[i];
				template.attr('data-name',prize.awardName);
				template.attr('data-num',prize.awardNum+'份');
				template.find('img').attr('src',prize.awardImg);
				template.find('p').html('<p>'+ prize.awardName +'<span>'+ prize.awardNum+'份</span>');
				
				$('.prizeflow').append(template);
			}
		}
	});
};
//加载获奖名单
var prizeLoaded = false;
function loadPrizedList(){
	//定时1分钟，重新加载一次最新的中奖名单（前100个）
	$.ajax({
		type: "get",
		url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/lottery/getAwardUserList/2.5.3',
		data:getFinalRequestObject({activityId:getParam('activityId')}),
		timeout:15000,
		dataType:"json",
		success: function (data) {
			if(data.code != 0){
				alert(data.error);
				return;
			}
			//未开始
			if(curBasicData.startTime > curBasicData.currentTime){
				var template = $('.listZone-nolist-template').clone();
				template.removeClass('hidden').removeClass('listZone-nolist-template');
				template.find('span').html('活动尚未开始，等你来抽奖~');
				$('.listZone .right ul').children().remove();
				$('.listZone .right ul').append(template);
				return;
			}
			
			data = data.data;
			if(data==null || data.length == 0){
				var template = $('.listZone-nolist-template').clone();
				template.removeClass('hidden').removeClass('listZone-nolist-template');
				template.find('span').html('暂无用户中奖，赶紧抽奖，好礼送送送~');
				$('.listZone .right ul').children().remove();
				$('.listZone .right ul').append(template);
			}else{
				$('.listZone .right ul').children().remove();
				for(var i=0; i< data.length; i++){
					var template = $('.listZone-template').clone();
					template.removeClass('hidden').removeClass('listZone-template');
					template.find('img').attr('src',data[i].profile);
					template.find('.drawHistory .userName').html(data[i].nickName);
					template.find('.drawHistory .userPrize').html(data[i].awardName);
					
					$('.listZone .right ul').append(template);
				}
				
				prizeLoaded = true;
			}
		}
	});
};

var scrollTopVal = 0;
function moveTop(){ 
	if(prizeLoaded == false){
		return;
	}
	
	var prizeListDom = $('.listZone .right');
	if($(prizeListDom).height()*($('.listZone .right ul').children().length-1) <= $(prizeListDom).scrollTop()){ 
		scrollTopVal = 0;
		$(prizeListDom).scrollTop(0);
	}else{ 
		scrollTopVal += 54; 
		$(prizeListDom).animate({scrollTop:scrollTopVal + 'px'},'normal');
	} 
} 
function updateLeftTime(){
	curBasicData.currentTime += 60000;
	//显示时间
	var leavetime=curBasicData.endTime-curBasicData.currentTime;
	if(leavetime>0){
		$("#headerCounter").show().html('剩余时间：'+leftTimeFormat(leavetime));
	}else{
		$("#headerCounter").show().html("活动已结束").addClass('bgb3');;
	};
}
//名单滚动动画（1秒）
setInterval("moveTop()",1000); 
//定时更新获奖名单（1分钟）
setInterval("loadPrizedList()", 60000);
//定时更新剩余时间
setInterval("updateLeftTime()", 60000);

//时间格式化
function leftTimeFormat(publishTime) {
        var nTime = 0;
        nTime = new Date(publishTime/1000);
		var day = Math.floor(nTime/86400);    
		var hour = Math.floor(nTime%86400/3600);    
		var minute = Math.floor(nTime%86400%3600/60);
        return ( day+ "天" +hour+ "时" +minute+ "分")  ;
};
//格式化时间
function formatDate(date, format) { //author: meizz   
	  var o = {   
	    "M+" : date.getMonth()+1,                 //月份   
	    "d+" : date.getDate(),                    //日   
	    "h+" : date.getHours(),                   //小时   
	    "m+" : date.getMinutes(),                 //分   
	    "s+" : date.getSeconds(),                 //秒   
	    "q+" : Math.floor((date.getMonth()+3)/3), //季度   
	    "S"  : date.getMilliseconds()             //毫秒   
	  };   
	  if(/(y+)/.test(format))   
		  format=format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
	  for(var k in o)   
	    if(new RegExp("("+ k +")").test(format))   
	    	format = format.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
	  return format;   
}  
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

	var currenturl = window.location.href ;
	//初始化配置信息
	$.ajax({
		url:'<%= CLI_HOST_API_URL %>/nggirl/app/cli/weixinjs/config',
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