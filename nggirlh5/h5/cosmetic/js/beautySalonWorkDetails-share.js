var pingnum = 0;
$(function(){
	$('.slider').height($(window).height());
	var peopleNum = 0;
	var unionProductId = getParam('unionProductId');
	var productType = getParam('productType');
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl/app/cli/salon/works/salonProductDetail/1.4.2',  
		type : 'get',
		data : getFinalRequestObject({unionProductId:unionProductId,productType:productType,accessToken:getAccessToken()}),
		dataType : 'json',  
		success : function(data){
			//轮播图片
			for (var x = 0; x < data.data.cover.length; x++) {
				$('.imgw').append("<li><div><img src=\"" + data.data.cover[x] + "\" /></div></li>");
				$('.banner>.clear').append("<li>" + x + "<li>");
			}
			
			//判断当前显示哪个按钮
			if(data.data.resUserCount < data.data.peopleHigh){
				if(data.data.isRegisterEnd == 1){//已结束
					$('.btn-cancle').show();
				}else{
					$('.btn-ok').show();	
				}
			}
			if(data.data.resUserCount >= data.data.peopleHigh){
				$('.btn-man').show();	
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
			$('title').html('美妆下午茶');
			
			//活动介绍
			$('.xwc-des').html(data.data.descr);
			
			//活动开始时间
			$('.xwc-time-txt').html(data.data.holdTime);
			
			//报名截止时间
			$('.xwc-end-time-txt').html(data.data.registEndTime);
			
			//举办地点
			$('.xwc-area-txt').html(data.data.holdPlace);
			
			//参团人的头像			
			for (var x = 0; x < 6 && x < data.data.resUsers.length; x++) {
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
			
			//预约须知
			//判断是否有预约须知
			if(data.data.resRules.length != 0){
				var str = '';
				for(var x = 0; x < data.data.resRules.length; x ++ ){
					str += data.data.resRules[x]+'<br />';
				}	
				$('.rp-content').html(str);
			}
			
			//活动介绍
			for(var x = 0; x <data.data.atDescription.length; x ++){
				//判断图片是否为空
				if(data.data.atDescription[x].picture == ''){
					$('.xwc-activity-txt').append('<li><div class="xwc-header">'+data.data.atDescription[x].title+'</div><div class="xwc-content-header">'+data.data.atDescription[x].paragraph+'</div><div class="xwc-img"></div></li>');
				}else{
					$('.xwc-activity-txt').append('<li><div class="xwc-header">'+data.data.atDescription[x].title+'</div><div class="xwc-content-header">'+data.data.atDescription[x].paragraph+'</div><div class="xwc-img"><img src="'+data.data.atDescription[x].picture+'" alt="" /></div></li>');
				}
			}
			
			//获取参团价格
			$('.bo-left .bl-cost').html(data.data.price);
			
			//化妆师介绍
			var str = '';
			$('.xwc-hzs-img').attr('src',data.data.dresserProfile);
			$('.xwc-hzs-txt').html(data.data.dresserName);
			for(var x = 0; x <data.data.dresserDescriptions.length; x ++){
				str += 	data.data.dresserDescriptions[x].title + '<br />'+ data.data.dresserDescriptions[x].desc+'<br /><br />'+'<img class="hzs-desc-img" src="'+data.data.dresserDescriptions[x].picture+'" />';
			}
			$('.xwc-hzs-desc').html(str);
			
			//喜欢的人的头像			
			for (var x = 0; x < 6 && x < data.data.lovers.length; x++) {
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
			
			//获取剩下的可预约人数
			peopleNum = data.data.peopleHigh - data.data.resUserCount;
			
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
			
			//微信分享信息
            if(isInWeixin()){
            	var title = '【南瓜姑娘】'+ data.data.title;
                var desc = '来南瓜姑娘美妆下午茶，试试有个化妆师闺蜜的感觉～';
                var link = window.location.href;
                var imgUrl = data.data.cover[0];
            	var from = getParam('apptype');
            	if(!strIsEmpty(from) && from == 'appb'){
            		desc = '南瓜粉丝已被我的作品美哭！联系我为你打造专属造型~';
            	}
            	
                weixinConfig(title,desc,link,imgUrl);
            }
		}
	});
	
	//获取产品评论
	loadPingFn(0);
	
	//获取用户晒单信息
	loadShaiFn(0);
	
	//点击查看更多评价
    $('.look-more-ping').click(function (e) {
        pingnum += 1;
        loadPingFn(pingnum);
    });

	//点击查看更多晒单
    var shainum = 0;
    $('.look-more-shai').click(function (e) {
        shainum += 1;
        loadShaiFn(shainum);
    });
	
	//点击发送评论按钮
    sendbtnFn();
    function sendbtnFn() {
		$('.comments-btn .send-btn').unbind('click');
        $('.comments-btn .send-btn').click(function (e) {
            if ($.trim($('.comments-txt').val())== '') {
                alert('小南瓜提示：请输入评价内容再提交哦！！');
            } else {
                $('.comments-btn .send-btn').unbind('click');
                checkAccessTokenLogin(function () {
                    $.ajax({
                        url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/salon/works/commentProduct/1.3',
                        type: 'post',
                        data: getFinalRequestObject({
                            accessToken: getAccessToken(),
                            unionProductId: getParam('unionProductId'),
                            productType: getParam('productType'),
                            content: $('.comments-txt').val()
                        }),
                        dataType: 'json',
                        success: function (data) {
							if(data.code == 0){
								$('.comments-btn .send-btn').bind('click', sendbtnFn);
								$('.comments-txt').val('');
								$('.review-message>ul').children('li').remove();
								$('.pingjia').hide();
								pingnum=0;
								loadPingFn(pingnum);
								sendbtnFn();
							};
							if(data.code == 1){
								alert(data.data.error);	
							};
                        }
                    });
                });
            }
        });
    }
	
	//点击晒单图片弹出大图
	$('.sr-bottom>img').live('click',function(e) {
        
    });
	
	// 点击”我要预约“按钮
	$('.btn-ok .bo-right').click(function(e) {
		checkAccessTokenLogin(function(){
			var redirectUrl;
			if(isInWeixin()){
				redirectUrl = getWeixinLinkUrl(getParam('unionProductId'),getParam('productType'),parseInt($('.xwc-peopleHigh').html()) - parseInt($('.xwc-resUserCount').html()));
				window.location.href=redirectUrl;
			}else{
				redirectUrl =  getZhifuBaoLinkUrl(getParam('unionProductId'),getParam('productType'),parseInt($('.xwc-peopleHigh').html()) - parseInt($('.xwc-resUserCount').html()));
				window.location.href=redirectUrl;
				//window.location.href="beautySalonWantOrder.html?unionProductId="+
				//getParam('unionProductId')+'&productType='+
				//getParam('productType')+'&peopleNum='+$('.xwc-peopleHigh').html();
			}
		});
    });
});

function getWeixinLinkUrl(unionProductId,productType,peopleNum){
	var redirectUri = encodeURIComponent(getZhifuBaoLinkUrl(unionProductId,productType,peopleNum));
	var scope = 'snsapi_base';
	var state = "weixinpay";
	var appid = getFwhAppId();//由param.js初始化
	return "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri="
		+redirectUri+"&response_type=code&scope="+scope+"&state="+state+"#wechat_redirect";
}

function getZhifuBaoLinkUrl(unionProductId,productType,peopleNum){
	var str = "<%= WEIXIN_BOUND_DOMAIN_URL %>/nggirl/h5/cosmetic/beautySalonWantOrder.html?unionProductId="
	+ unionProductId+'&productType='+productType+'&peopleNum='+peopleNum+'&v=<%= VERSION %>';
	if(window.location.protocol == 'https:'){
		return str;
	}else{
		return 'http:' + str.substring(6)
	}
}

//时间格式化
function getLocalTime(publishTime) {
    var d_minutes, d_hours, d_days, d_seconds;
    var timeNow = parseInt(new Date().getTime() / 1000);
    var d;
    d = timeNow - publishTime;
    d_days = parseInt(d / 86400);
    d_hours = parseInt(d / 3600);
    d_minutes = parseInt(d / 60);
	d_seconds = parseInt(d / 1000);
    if (d_days > 0 && d_days < 50) {
        return d_days + "天前";
    } else if (d_days <= 0 && d_hours > 0) {
        return d_hours + "小时前";
    } else if (d_hours <= 0 && d_minutes > 0) {
        return d_minutes + "分钟前";
    } else{
		return d_seconds +'小时前';	
	}
}

function loadPingFn(page){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl/app/cli/salon/works/listProEvaluation/1.3',  
		type : 'get',
		data : getFinalRequestObject({unionProductId:getParam('unionProductId'),productType:getParam('productType'),accessToken:getAccessToken(),page:page,num:2}),
		dataType : 'json',  
		success : function(data){
			if(data.data.evaluateList.length == 0){
				$('.pingjia').show();	
			};
			if(data.data.hasMore == 0){
				$('.look-more-ping').hide();
				for (var x = 0; x < 2 && x < data.data.evaluateList.length; x++) {
					$('.review-message>ul').append('<li><div class="phot-per"><div class="rm-left"><img src="'+data.data.evaluateList[x].evaluateProfile+'"/></div></div><div class="rm-right"><div class="rr-left"><p class="rl-name">'+data.data.evaluateList[x].evaluateName+'</p><p class="rl-review">'+data.data.evaluateList[x].content+'</p></div><div class="rr-right">'+getLocalTime(data.data.evaluateList[x].evaluateTime)+'</div></div></li>');
				}
			}else{
			//评论用户头像
				$('.look-more-ping').show();
				for (var x = 0; x < 2 && x < data.data.evaluateList.length; x++) {
					$('.review-message>ul').append('<li><div class="phot-per"><div class="rm-left"><img src="'+data.data.evaluateList[x].evaluateProfile+'"/></div></div><div class="rm-right"><div class="rr-left"><p class="rl-name">'+data.data.evaluateList[x].evaluateName+'</p><p class="rl-review">'+data.data.evaluateList[x].content+'</p></div><div class="rr-right">'+getLocalTime(data.data.evaluateList[x].evaluateTime)+'</div></div></li>');
				}
			}
		}
	});
}

function loadShaiFn(page){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl/app/cli/salon/works/getProEvaluations/1.3',   
		type : 'get',
		data : getFinalRequestObject({unionProductId:getParam('unionProductId'),productType:getParam('productType'),accessToken:getAccessToken(),page:page,num:2}),
		dataType : 'json',  
		success : function(data){
			if(data.data.evaluations.length == 0){
				$('.shai').show();	
			};
			if(data.data.hasMore == 0){
				$('.look-more-shai').hide();
				for(var x = 0 ; x <2 && x <data.data.evaluations.length; x ++){
					$('.dan').append('<div class="shaidan"><div class="st-left"><img src="'+data.data.evaluations[x].profile+'" alt="" /></div><div class="st-right"><div class="sr-top"><div class="st-txt"><p class="st-name">'+data.data.evaluations[x].userName+'</p><p class="st-p">'+data.data.evaluations[x].content+'</p></div><div class="st-star">'+startFn(data.data.evaluations[x].starLevel)+'</div></div><div class="sr-bottom">'+evaluationFn(data.data.evaluations[x].photos)+'</div><p class="sr-date">'+getLocalTime(data.data.evaluations[x].dateTime)+'</p></div></div>');
				}
			}else{
				$('.look-more-shai').show();
				for(var x = 0 ; x <2 && x <data.data.evaluations.length; x ++){
					$('.dan').append('<div class="shaidan"><div class="st-left"><img src="'+data.data.evaluations[x].profile+'" alt="" /></div><div class="st-right"><div class="sr-top"><div class="st-txt"><p class="st-name">'+data.data.evaluations[x].userName+'</p><p class="st-p">'+data.data.evaluations[x].content+'</p></div><div class="st-star">'+startFn(data.data.evaluations[x].starLevel)+'</div></div><div class="sr-bottom">'+evaluationFn(data.data.evaluations[x].photos)+'</div><p class="sr-date">'+getLocalTime(data.data.evaluations[x].dateTime)+'</p></div></div>');
				}
			}
		}
	});
}

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
	
//微信分享
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