define(function(require, exports, module){
    exports.initPage = function() {
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','phoneType=iOS','达人征集海报']);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','phoneType=and','达人征集海报']);
		};
		
		//点击立即加入
		$('.join_btn').click(function(e) {
            window.location.href = "<%= CLI_HOST_API_URL %>/nggirl/app/getapp";
        });
		
		//微信分享
		if(isInWeixin()){
			var str = window.location.href;
			var title = '【南瓜姑娘】南瓜达人征集帖';
			var desc = '拒绝套路潜规则，在这里认真听你说';
			var link = window.location.href;
			var imgUrl = 'https://photosd.nggirl.com.cn/work/3aa3578752a64794879b468610144d61.jpg';
			var from = getParam('apptype');
			if(!strIsEmpty(from) && from == 'appb'){
				desc = '拒绝套路潜规则，在这里认真听你说';
			}
			weixinConfig(title,desc,link,imgUrl);
			$('.join_btn,.join_bottom').show();
		}
		//h5,app同步分享内容
		if(isInApp()){
			window.shareTitle = '南瓜达人征集帖';
			window.shareContent = '拒绝套路潜规则，在这里认真听你说';
			window.sharePicture = 'https://photosd.nggirl.com.cn/work/3aa3578752a64794879b468610144d61.jpg';
			window.shareUrl = window.location.href;
			$('.join_btn,.join_bottom').hide();
		};
		//给安卓传值
		if(typeof(window.ngjsInterface)!="undefined" && typeof(window.ngjsInterface.conFigShareInfo)!="undefined"){
			window.ngjsInterface.conFigShareInfo('南瓜达人征集帖', '拒绝套路潜规则，在这里认真听你说','https://photosd.nggirl.com.cn/work/3aa3578752a64794879b468610144d61.jpg',window.location.href);
		};
		
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
    }
});