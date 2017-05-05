define(function(require, exports, module){
    exports.initPage = function() {
		$('.tc_name').css('width',$('.tc_goods_name').width() - 90.13);
		$('.tgl_content').css('height',$('.tgl_content').width() * 67/64);
		
		//选择感恩化妆品
		$('.tgl_content>dl').click(function(e) {
            $(this).children('dd').addClass('blue').parent().siblings().children('dd').removeClass('blue');
			$(this).addClass('blue').siblings().removeClass('blue');
        });
		
		//选择感恩愿望
		$('.tc_tel_option ul li').click(function(e) {
			$(this).addClass('blue').siblings().removeClass('blue');
            $(this).children('img').attr('src','images/thanksgivingDayActivity/selecte_ok.png').next().addClass('blue').parent().siblings().children('img').attr('src','images/thanksgivingDayActivity/selecte_no.png').next().removeClass('blue')
        });
		
		//点击生成图片
		$('.btn').click(function(e) {
			checkAccessTokenLogin(function () {
				var cosmeticImg = '';
				var thanksWords= '';
				var cosmeticName = $.trim($('.tc_name').val());
				$('.tgl_content>dl').each(function(index, element) {
					if($(this).hasClass('blue')){
						cosmeticImg = $(this).children('dt').children('img').attr('src');
					};
				});
				$('.tc_tel_option ul li').each(function(index, element) {
					if($(this).hasClass('blue')){
						thanksWords = $(this).children('span').html();
					};
				});
				if($.trim($('.tc_name').val()) == ''){
					alertFn('请输入化妆品名称');
				}else if(cosmeticImg == ''){
					alertFn('请输选择感恩的化妆品');
				}else if(thanksWords == ''){
					alertFn('我想对它说？');
				}else{
					$.post('<%= CLI_HOST_API_URL %>/nggirl/app/activity/thanksGiving/createPicture',getFinalRequestObject({accessToken:getAccessToken(),cosmeticName:cosmeticName,cosmeticImg:cosmeticImg,thanksWords:thanksWords}),function(data){
						var data = $.parseJSON(data);
						if(data.code == 0){
							$('body').css("background","#fff").children().remove();
							$('<img>').attr('src',data.data).css("width","90%").css("display","block").css("margin","auto").appendTo('body');
							$('<img>').attr('src','images/thanksgivingDayActivity/bottom_01.jpg').css("width","100%").css("margin-top","-6px").appendTo('body');
						}else{
							alert(data.data.error);
						}
					});
				}
			},window.location.href);
        });
		
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','phoneType=iOS','感恩节活动']);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','phoneType=and','感恩节活动']);
		};

		//不在微信中,就验证其授权令牌
		if(!isInWeixin()){
			checkAccessTokenLogin(function () {},window.location.href);
		}

		//微信分享
		if(isInWeixin()){
			if(strIsEmpty(getParam('code'))){
				window.location.href = getWeixinLinkUrl();
			}else{
				$.ajax({
					type : 'get',
					dataType : 'json',
					data : getFinalRequestObject({code:getParam('code'),marketChannel:getParam('state')}),
					url : '<%= CLI_HOST_API_URL %>/nggirl/app/cli/register/weixin/getInfo/1.4.2',
					success : function(data) {
						if(data.code == 0){
							localStorage.accessToken = data.data.accessToken;
						}
						else if (data.code == 3 || (data.code == 1 && data.data.error == '连接微信获取用户信息出错')){
							if(isInWeixin()){
								window.location.href = getWeixinLinkUrl();
							}else{
								checkAccessTokenLogin(function () {},window.location.href);
							}
						}
						else{
							alert(data.data.error);
						}
					}               
				});	
				
				var str = window.location.href.replace(/thanksgivingDayActivity/,"thanksgivingDayActivityCode");
				var title = '【南瓜姑娘】抽支感恩签，每一点微小的善意和爱，都值得感恩';
				var desc = '那时我没来得及道谢，只留下了微笑，也不知道你有没有接收到';
				var link = str;
				var imgUrl = 'https://testphotosd.nggirl.com.cn/work/1ef095687cc64d38a4f4d1abf42d9153.png';
				var from = getParam('apptype');
				if(!strIsEmpty(from) && from == 'appb'){
					desc = '那时我没来得及道谢，只留下了微笑，也不知道你有没有接收到';
				}
				weixinConfig(title,desc,link,imgUrl);
			}
		};			
		//h5,app同步分享内容
		/*if(isInApp()){
			window.shareTitle = '【南瓜姑娘】抽支感恩签，每一点微小的善意和爱，都值得感恩';
			window.shareContent = '那时我没来得及道谢，只留下了微笑，也不知道你有没有接收到';
			window.sharePicture =  'https://testphotosd.nggirl.com.cn/work/1ef095687cc64d38a4f4d1abf42d9153.png';
			window.shareUrl = window.location.protocol+"//"+window.location.host+"/nggirl/h5/mobile/thanksgivingDayActivityCode.html?v=<%= VERSION %>";
		};
		//给安卓传值
		if(typeof(window.ngjsInterface)!="undefined" && typeof(window.ngjsInterface.conFigShareInfo)!="undefined"){
			window.ngjsInterface.conFigShareInfo('【南瓜姑娘】抽支感恩签，每一点微小的善意和爱，都值得感恩','那时我没来得及道谢，只留下了微笑，也不知道你有没有接收到','https://testphotosd.nggirl.com.cn/work/1ef095687cc64d38a4f4d1abf42d9153.png',window.location.protocol+"//"+window.location.host+"/nggirl/h5/mobile/thanksgivingDayActivityCode.html?v=<%= VERSION %>");
		};*/

		function getWeixinLinkUrl(){
			var redirectUri = encodeURIComponent("<%= WEIXIN_BOUND_DOMAIN_URL %>/nggirl/h5/mobile/thanksgivingDayActivity.html?v=<%= VERSION %>");
			var scope = 'snsapi_userinfo';
			var state = "login";
			var appid = getFwhAppId();//由param.js初始化
			return "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri="+redirectUri+"&response_type=code&scope="+scope+"&state="+state+"#wechat_redirect";
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
			//初始化配置信息
			$.ajax({
				url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/weixinjs/config',
				type: 'post',
				dataType: 'json',
				data: getFinalRequestObject({url: window.location.href, accessToken: getAccessToken()}),
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