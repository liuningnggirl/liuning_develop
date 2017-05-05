$(function(){
	if (/iphone|ipad|ipod/.test(ua)) {
		_czc.push(['_trackEvent','phoneType=iOS','商品合辑页']);	
	} else if (/android/.test(ua)) {
		_czc.push(['_trackEvent','phoneType=and','商品合辑页']);
	};
	

	//微信分享
	if(isInWeixin()){
		
		var title = '【南瓜姑娘】【超值美妆袋】怎样才配做王大陆女朋友？';
		var desc = '超值美妆袋5种贴心组合爱自己也爱Ta';
		var link = window.location.href;
		var imgUrl = 'https://photosd.nggirl.com.cn/work/b9ed4036310e4fb8b21e2b83d8c5b275.jpg';
		var from = getParam('apptype');
		if(!strIsEmpty(from) && from == 'appb'){
			desc = data.data.reamTitle;
		}
		weixinConfig(title,desc,link,imgUrl);
	}
	//h5,app同步分享内容
		if(isInApp()){
			window.shareTitle = '【超值美妆袋】怎样才配做王大陆女朋友？';
			window.shareContent ='超值美妆袋5种贴心组合爱自己也爱Ta';
			window.sharePicture = 'https://photosd.nggirl.com.cn/work/b9ed4036310e4fb8b21e2b83d8c5b275.jpg';
			window.shareUrl = window.location.href;
		};
		//给安卓传值
		if(typeof(window.ngjsInterface)!="undefined" && typeof(window.ngjsInterface.conFigShareInfo)!="undefined"){
			window.ngjsInterface.conFigShareInfo('【超值美妆袋】怎样才配做王大陆女朋友？', '超值美妆袋5种贴心组合爱自己也爱Ta','https://photosd.nggirl.com.cn/work/b9ed4036310e4fb8b21e2b83d8c5b275.jpg',window.location.href);
		};
	$(".nextPage").live('click',function(){
		$(".second").show();
		$(".main").hide();	
		$("html,body,.second").animate({scrollTop: '0px'}, 100);
	})
	$(".back").live('click',function(){
		$(".second").hide();
		$(".main").show();	
		$("html,body,.main").animate({scrollTop: '0px'}, 100);
	})
	$('.goods').live('click',function(){
		if(isInApp()){
			if (/iphone|ipad|ipod/.test(ua)) { 
				window.location.href='nggirl://nggirl/itemDetail?type=1&itemId='+$(this).attr('itemId')+'&v=<%= VERSION %>';
				setTimeout(function(){
					$(".successtips").html("请更新最新版本(v3.1.2)才能购买哦～");
					$(".successtips").fadeIn(100).delay(1000).fadeOut(100);
				},300); 
			} else if (/android/.test(ua)) {
				if(getAppVersion() >= 3.01){
					window.location.href='nggirl://nggirl/itemDetail?type=1&itemId='+$(this).attr('itemId')+'&v=<%= VERSION %>';
				}else{
					$(".successtips").html("请更新最新版本(v3.1.2)才能购买哦～");
					$(".successtips").fadeIn(100).delay(2000).fadeOut(100);
				}
			}
		}else{
			window.location.href='/nggirl/h5/cosmetic/goodsShareCatenate.html?type=1&itemId='+$(this).attr('itemId')+'&v=<%= VERSION %>';
		}
	});
	/*$('.goods').live('click',function(){
		if(isInApp()){
			window.location.href='nggirl://nggirl/itemDetail?type=1&itemId='+$(this).attr('itemId')+'&v=<%= VERSION %>';
		    setTimeout(function(){
				$(".successtips").html("请更新最新版本(v3.1.2)才能购买哦～");
				$(".successtips").fadeIn(100).delay(1000).fadeOut(100);
			},300); 
		}else{
			window.location.href='/nggirl/h5/cosmetic/goodsShareCatenate.html?type=1&itemId='+$(this).attr('itemId')+'&v=<%= VERSION %>';
		}
	});*/
});

var openApp = function(){
			var itemId = getParam('itemId');
			var toAppUrl = 'nggirl://nggirl/itemDetail?'+'type=1'+'&itemId='+getParam('itemId')+'&v=<%= VERSION %>';
    		var loadAppButton = document.getElementById('loadAppButton');
    		loadAppButton.href = toAppUrl;
			loadAppButton.click();
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
    var currenturl =window.location.href;
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