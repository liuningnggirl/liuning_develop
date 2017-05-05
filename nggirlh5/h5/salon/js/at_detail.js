$(function(){
	
	//关闭顶部悬浮框
	$('.close').click(function(e) {
		$('.header').slideUp();
	});
	
	var unionProductId = getParam('unionProductId');
	var productType = getParam('productType');
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl/app/cli/salon/works/salonProductDetail/1.3',  
		type : 'get',
		data : getFinalRequestObject({unionProductId:unionProductId,productType:productType,accessToken:getAccessToken()}),
		dataType : 'json',  
		success : function(data){

			//设置微信分享,和2次分享
			var title = '【南瓜姑娘】美妆下午茶-'+data.data.title;
			var desc = '来南瓜姑娘美妆下午茶，试试有个化妆师闺蜜的感觉～';
			var link = window.location.href;
			var imgUrl = data.data.cover[0];
			weixinConfig(title,desc,link,imgUrl)

			//轮播图片
			for (var x = 0; x < data.data.cover.length; x++) {
				$('.imgw').append("<li><div><img src=\"" + data.data.cover[x] + "\" /></div></li>");
				$('.banner>.clear').append("<li>" + x + "<li>");
			}
			
			//banner切换
			TouchSlide({
				slideCell: "#slideBox",
				titCell: ".hd ul", //开启自动分页 autoPage:true ,此时设置 titCell 为导航元素包裹层
				mainCell: ".bd ul",
				effect: "left",
				autoPage: true, //自动分页
				autoPlay: true, //自动播放
				interTime: 3000
			});
			
			//标题
			$('.xwc-content-title').html(data.data.title);
			
			//网页标题
			$('title').html(data.data.title);
			
			//活动介绍
			$('.xwc-des').html(data.data.descr);
			
			//活动开始时间
			$('.xwc-time-txt').html(data.data.holdTime);
			
			//报名截止时间
			$('.xwc-end-time-txt').html(data.data.registEndTime);
			
			//举办地点
			$('.xwc-area-txt').html(data.data.holdPlace);
			
			//参团人的头像			
			for (var x = 0; x < 5 && x < data.data.resUsers.length; x++) {
				if(data.data.resUsers.length == 0){
					$('.tuan-photo ul').hide();
				}else if(data.data.resUsers[x].resProfile == '' || data.data.resUsers[x].resProfile == null || data.data.resUsers[x].resProfile == undefined) {
					$('.tuan-photo>ul').append("<li style=\"width:2.5rem; height:2.5rem;\"><img style=\"width:100%; height:100%;\" src=\"images/default-title-img.png\" /></li>");
				} else {
					$('.tuan-photo>ul').append("<li style=\"width:2.5rem; height:2.5rem;\"><img style=\"width:100%; height:100%;\" src=\"" + data.data.resUsers[x].resProfile + "\" /></li>");
				}
			}
			//判断参团的人数
			if(data.data.resUsers.length > 5){
				$('.tuan-photo ul').append('<li class="add-circle-tuan">. . .</li>');	
			};
			
			//成团人数下线
			$('.xwc-peopleLow').html(data.data.peopleLow);
			
			//成团人数上线
			$('.xwc-peopleHigh').html(data.data.peopleHigh);
			
			//已预约人数
			$('.xwc-resUserCount').html(data.data.resUserCount);
			
			//活动介绍
			for(var x = 0; x <data.data.atDescription.length; x ++){
				//判断图片是否为空
				if(data.data.atDescription[x].picture == ''){
					$('.xwc-activity-txt').append('<li><div class="xwc-header">'+data.data.atDescription[x].title+'</div><div class="xwc-content-header">'+data.data.atDescription[x].paragraph+'</div><div class="xwc-img"></div></li>');
				}else{
					$('.xwc-activity-txt').append('<li><div class="xwc-header">'+data.data.atDescription[x].title+'</div><div class="xwc-content-header">'+data.data.atDescription[x].paragraph+'</div><div class="xwc-img"><img src="'+data.data.atDescription[x].picture+'" alt="" /></div></li>');
				}
			}
			
			//化妆师介绍
			var str = '';
			$('.xwc-hzs-img').attr('src',data.data.dresserProfile);
			$('.xwc-hzs-txt').html(data.data.dresserName);
			for(var x = 0; x <data.data.dresserDescriptions.length; x ++){
				str += 	data.data.dresserDescriptions[x]+'<br />';
			}
			$('.xwc-hzs-desc').html(str);
			
			//喜欢的人的头像			
			for (var x = 0; x < 7 && x < data.data.lovers.length; x++) {
				if(data.data.lovers.length == 0){
					$('.like-photo').hide();
					$('.like-num').hide();	
				}else if(data.data.lovers[x].loverProfile == '' || data.data.lovers[x].loverProfile == null || data.data.lovers[x].loverProfile == undefined) {
					$('.like-photo>ul').append("<li style=\"width:2.5rem; height:2.5rem;\"><img style=\"width:100%; height:100%;\" src=\"images/default-title-img.png\" /></li>");
				} else {
					$('.like-photo>ul').append("<li style=\"width:2.5rem; height:2.5rem;\"><img style=\"width:100%; height:100%;\" src=\"" + data.data.lovers[x].loverProfile + "\" /></li>");
				}
			}
			
			//喜欢的人数
			$('.like-num .num').html(data.data.loverCount);
			
			//判断喜欢的人数
			if(data.data.loverCount < 7){
				$('.add-circle').hide();
			}else{
				$('.add-circle').show();
			}
			
			//tab栏切换 -->
			$('.double-btn>div:eq(0)').click(function (e) {
				$(this).addClass('db-on').siblings().removeClass('db-on');
				$('.double-box .left-box').show();
				$('.double-box .right-box').hide();
			});
			$('.double-btn>div:eq(1)').click(function (e) {
				$(this).addClass('db-on').siblings().removeClass('db-on');
				$('.double-box .left-box').hide();
				$('.double-box .right-box').show();
			});
		}
	});
	
	//获取产品评论
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl/app/cli/salon/works/listProEvaluation/1.3',  
		type : 'get',
		data : getFinalRequestObject({unionProductId:unionProductId,productType:productType,accessToken:getAccessToken()}),
		dataType : 'json',  
		success : function(data){
			if(data.data.length == 0){
				$('.pingjia').show();
			}else{
			//评论用户头像
				$('.pingjia').hide();
				for (var x = 0; x < 2 && x < data.data.evaluateList.length; x++) {
					$('.review-message>ul').append("<li><div class=\"phot-per\"><div class=\"rm-left\"><img src=\"" + data.data.evaluateList[x].evaluateProfile + "\"/></div></div><div class=\"rm-right\"><div class=\"rr-left\"><p class=\"rl-name\">" + data.data.evaluateList[x].evaluateName + "</p><p class=\"rl-review\">" + data.data.evaluateList[x].content + "</p></div><div class=\"rr-right\">" + getLocalTime(data.data.evaluateList[x].evaluateTime) + "</div></div></li>");
				}
			}
		}
	});
	
	//获取用户晒单信息
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl/app/cli/salon/works/getProEvaluations/1.3',   
		type : 'get',
		data : getFinalRequestObject({unionProductId:unionProductId,productType:productType,accessToken:getAccessToken()}),
		dataType : 'json',  
		success : function(data){
			if(data.data.evaluations.length == 0){
				$('.shai').show();	
			}else{
				for(var x = 0 ; x <2 && x<data.data.evaluations.length; x ++){
					$('.dan').append('<div class="shaidan"><div class="st-left"><img src="'+data.data.evaluations[x].profile+'" alt="" /></div><div class="st-right"><div class="sr-top"><div class="st-txt"><p class="st-name">'+data.data.evaluations[x].userName+'</p><p class="st-p">'+data.data.evaluations[x].content+'</p></div><div class="st-star">'+startFn(data.data.evaluations[x].starLevel)+'</div></div><div class="sr-bottom">'+evaluationFn(data.data.evaluations[x].photos)+'</div><p class="sr-date">'+getLocalTime(data.data.evaluations[x].dateTime)+'</p></div></div>');
				}
				$('.shai').hide();
			}
		}
		
	});
	
		
	//获取用户评价星级
	function startFn(s){
		var start = '';
		for(var x = 0; x <s; x ++){
			start += '<img src="images/shaidan-star_03.png" alt="" />';
		}
		return start;
	}
		
	//获取用户评价图片
	function evaluationFn(photos){
		var imgs = '';
		for(var x = 0; x <photos.length; x ++){
			imgs += '<img src="'+photos[x]+'" alt="" />';
		}
		return imgs;
	}	
	
	//点击关闭按钮关闭底部悬浮框 
	$('.btn-close').click(function(e) {
		$('.footer').slideUp();
	});
	
	//点击发送评论按钮时让用户下载app
	$('.send-btn').click(function(e) {
		alert('小南瓜提示您请先关注我们的APP下载后方可评论！！');
		window.location.href="<%= CLI_HOST_API_URL %>/nggirl/app/getapp";
    });
});


//时间格式化
function getLocalTime(publishTime) {
    var d_minutes, d_hours, d_days;
    var timeNow = parseInt(new Date().getTime() / 1000);
    var d;
    d = timeNow - publishTime;
    d_days = parseInt(d / 86400);
    d_hours = parseInt(d / 3600);
    d_minutes = parseInt(d / 60);
    if (d_days > 0 && d_days < 4) {
        return d_days + "天前";
    } else if (d_days <= 0 && d_hours > 0) {
        return d_hours + "小时前";
    } else if (d_hours <= 0 && d_minutes > 0) {
        return d_minutes + "分钟前";
    } else {
        var s = 0;
        s = new Date(publishTime);
        return (s.getFullYear() + "年" + parseInt(s.getMonth() + 1)) + "月" + parseInt(s.getDate()) + "日";
    }
}


function weixinConfig(title,desc,link,imgUrl) {

	wx.ready(function(){

		//获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
		wx.onMenuShareTimeline({
			title: title, // 分享标题
			link: link, // 分享链接
			imgUrl: imgUrl, // 分享图标
			success: function () {
				// 用户确认分享后执行的回调函数
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
