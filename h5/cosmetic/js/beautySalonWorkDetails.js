$(function(){
	var unionProductId = getParam('unionProductId');
	var productType = getParam('productType');
	//控制图片大小
	$('.xwc-dresser-img').height($('.xwc-dresser-img').width()*2/3);
	$.ajax({
		url :'<%= CLI_HOST_API_URL %>/nggirl/app/cli/salon/works/salonProductDetail/1.5.0',  
		type : 'get',
		data : getFinalRequestObject({unionProductId:unionProductId,productType:productType,accessToken:getAccessToken()}),
		dataType : 'json',  
		success : function(data){
			//轮播图片
			for (var x = 0; x < data.data.cover.length; x++) {
				$('.imgw').append("<li><div><img src=\"" + data.data.cover[x]+"@80Q" + "\" /></div></li>");
				$('.banner>.clear').append("<li>" + x + "<li>");
			}
			$(".imgw img").css("height",$('.imgw img').width()*2/3);
			var lilength=data.data.cover.length;
			$(".bot ul").css("width",18.4*lilength);
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
			for (var x = 0; x < 4 && x < data.data.resUsers.length; x++) {
				if(data.data.resUsers.length == 0){
					$('.tuan-photo ul').hide();
				}else if(data.data.resUsers[x].resProfile == '' || data.data.resUsers[x].resProfile == null || data.data.resUsers[x].resProfile == undefined) {
					$('.tuan-photo>ul').append("<li style=\"width:2.5rem; height:2.5rem;\"><img style=\"width:100%; height:100%;\" src=\"images/default-title-img.png\" /></li>");
				} else {
					$('.tuan-photo>ul').append("<li style=\"width:2.5rem; height:2.5rem;\"><img style=\"width:100%; height:100%;\" src=\"" + data.data.resUsers[x].resProfile+"@80Q" + "\" /></li>");
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
			$('.xwc-dresser-img').attr('src',data.data.portrait+"@80Q");//化妆师封面图
			$('.xl-dresser-img').attr('src',data.data.dresserProfile+"@80Q");//化妆师头像
			if(data.data.dresserName.length>7){
				var strn=data.data.dresserName;
				strn= strn.substring(0,7)+"..." ; 
				$('.xt-name').html(strn);//化妆师名称
				}else{
				$('.xt-name').html(data.data.dresserName);//化妆师名称
				}
			$('.xr-bottom').html(getStartLevFn(data.data.starLevel));//获取化妆师星级
			$('.xwc-content-txt').html(data.data.dresserDesc);//化妆师描述
			$('.xwc-content-experience .xce-bottom').html(getDresserExperienceFn(data.data.experience));//化妆师从业经历
			$('.xwc-content-cooperation .xce-bottom').html(data.data.coartist);//合作艺人
			//判断性别
			if(data.data.sex == 0){
				$('.xt-sex').attr('src','images/boy.png');
			}
			if(data.data.sex == 1){
				$('.xt-sex').attr('src','images/girl.png');
			}			
			//判断化妆师是否加V
			if(data.data.isVDresser == 1){
				$('.xd-left .v').show();	
			}
			//存储化妆师id
			$('.xwc-dresser').attr('dresserid',data.data.dresserId);
			
			//喜欢的人的头像			
			for (var x = 0; x < 6 && x < data.data.lovers.length; x++) {
				if(data.data.lovers.length == 0){
					$('.like-photo').hide();
					$('.like-num').hide();	
				}else if(data.data.lovers[x].loverProfile == '' || data.data.lovers[x].loverProfile == null || data.data.lovers[x].loverProfile == undefined) {
					$('.like-photo>ul').append("<li style=\"width:2.5rem; height:2.5rem;\"><img style=\"width:100%; height:100%;\" src=\"images/default-title-img.png\" /></li>");
				} else {
					$('.like-photo>ul').append("<li style=\"width:2.5rem; height:2.5rem;\"><img style=\"width:100%; height:100%;\" src=\"" + data.data.lovers[x].loverProfile+"@80Q" + "\" /></li>");
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
			
			//微信分享信息
            if(isInWeixin()){
            	var title = '【南瓜姑娘】'+ data.data.title;
                var desc = '来南瓜姑娘美妆下午茶，试试有个化妆师闺蜜的感觉～';
                var link = window.location.href;
                var imgUrl = data.data.cover[0];
            	var from = getParam('apptype');
            	if(!strIsEmpty(from) && from == 'appb'){
            		desc = '来南瓜姑娘美妆下午茶，试试有个化妆师闺蜜的感觉～';
            	}
                weixinConfig(title,desc,link,imgUrl);
            }
			
			//h5,app同步分享内容
			if(isInApp()){
				window.shareTitle = '【南瓜姑娘】'+ data.data.title;
				window.shareContent = '来南瓜姑娘美妆下午茶，试试有个化妆师闺蜜的感觉～';
				window.sharePicture = data.data.cover[0];
				window.shareUrl = window.location.href;
			};	
			//给安卓传值
			if(typeof(window.ngjsInterface)!="undefined" && typeof(window.ngjsInterface.conFigShareInfo)!="undefined"){
				window.ngjsInterface.conFigShareInfo('【南瓜姑娘】'+ data.data.title, '来南瓜姑娘美妆下午茶，试试有个化妆师闺蜜的感觉～',data.data.cover[0],window.location.href);
			};
		}
	});
	
	// 点击”我要预约“按钮
	$('.btn-ok .bo-right').click(function(e) {

		//var redirectUrl;
//		if(isInWeixin()){
//			redirectUrl = getWeixinLinkUrl(getParam('unionProductId'),getParam('productType'),parseInt($('.xwc-peopleHigh').html()) - parseInt($('.xwc-resUserCount	').html()));
//			//window.location.href=redirectUrl;
//		}else{
//			redirectUrl =  getZhifuBaoLinkUrl(getParam('unionProductId'),getParam('productType'),parseInt($('.xwc-peopleHigh').html()) - parseInt($('.xwc-resUserCount').html()));
//			//window.location.href=redirectUrl;
//		}
//		checkAccessTokenLogin(function () {
//			window.location.href = redirectUrl;     //里面的内容是说，在已经登陆的情况，直接就跳到那个地址
//			//window.location.href = "beautySalonWantOrder.html?unionProductId=" + getParam('unionProductId')+"&productType="+getParam('productType')+//"&v=3.0.2.1489125695085";
//			
//		}); 
		checkAccessTokenLogin(function(){
			var redirectUrl;
			if(isInWeixin()){
				redirectUrl = getWeixinLinkUrl(getParam('unionProductId'),getParam

('productType'),parseInt($('.xwc-peopleHigh').html()) - parseInt($('.xwc-resUserCount').html()));
				window.location.href=redirectUrl;
			}else{
				redirectUrl =  getZhifuBaoLinkUrl(getParam('unionProductId'),getParam

('productType'),parseInt($('.xwc-peopleHigh').html()) - parseInt($('.xwc-resUserCount').html()));
				window.location.href=redirectUrl;
			}
		},'beautySalonWorkDetails.html' + window.location.search);
    });
	
	//点击“用户评价”
	$('.xwc-content-ping').click(function(e) {
        window.location.href = "userappraise.html?dresserId=" + $('.xwc-dresser').attr('dresserid')+'&v=<%= VERSION %>';
    });
	
	//点击“化妆师右侧的箭头”、
	$('.xwc-dresser').click(function(e) {
        window.location.href = "space.html?dresserId=" + $('.xwc-dresser').attr('dresserid')+'&v=<%= VERSION %>';
    });
	
	//点击活动地址
	$('.xwc-area').click(function(e) {
        window.location.href = "beautySalonLocation.html?location=" + $(this).children('.xwc-area-txt').html()+'&v=<%= VERSION %>';
    });
});

//获取化妆师星级个数
function getStartLevFn(num){
	var str = '';
	for(var x = 0; x < num; x ++){
		str += '<img src="images/small-start.png" alt="" />';	
	}
	return str;
}

//获取化妆师从业经历
function getDresserExperienceFn(experience){
	var str = '';
	for(var x = 0; x < experience.length; x ++){
		str += '<div class="gra-p">'+experience[x]+'</div>';
	}
	return str;
}

//微信支付
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
				$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/personalInfo/shareSuccess/2.0.0',
				getFinalRequestObject({accessToken: getAccessToken(),
				shareType:1,
				contentType:'salon',
				contentInfo:getParam('unionProductId')
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
				$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/personalInfo/shareSuccess/2.0.0',
				getFinalRequestObject({accessToken: getAccessToken(),
				shareType:2,
				contentType:'salon',
				contentInfo:getParam('unionProductId')
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
	
