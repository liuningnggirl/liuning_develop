define(function(require, exports, module){
    exports.initPage = function() {
		var openId='';
		$(".name").css("width",$(window).width()-122);
		$(".city").css("width",$(window).width()-156);
		$(".ageRadio span,.workRadio span").live('click',function(){
			$(this).addClass("on");
			$(this).siblings().removeClass("on");
		});
		$(".wayBox span").live('click',function(){
			if($(this).hasClass("on")){
				$(this).removeClass("on");
			}else{
				$(this).addClass("on");
			}
		});
		if(isInWeixin()){
			if(getParam('code') == ''){
				/*initFwhAppId();
				function getWeixinLinkUrl(reservationId){
					var redirectUri = encodeURIComponent(window.location.protocol+"//"+window.location.host+"/nggirl/h5/mobile/user_survey_report.html?v=<%= VERSION %>");
					var scope = 'snsapi_base';
					var state = "login";
					var appid = getFwhAppId();//由param.js初始化
					return "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri="
						+redirectUri+"&response_type=code&scope="+scope+"&state="+state+"#wechat_redirect";
				}
				 window.location.href=getWeixinLinkUrl();*/
				 $.ajax({
					type : 'GET',
					dataType : 'json',
					data : getFinalRequestObject({}),
					url : '<%= CLI_HOST_API_URL %>/nggirl/app/sys/getFwhId',
					success : function(data) {
						var redirectUri = encodeURIComponent(window.location.protocol+"//"+window.location.host+"/nggirl/h5/mobile/user_survey_report.html?v=<%= VERSION %>");
						var scope = 'snsapi_base';
						var state = "login";
						var appid = data.data.id;//微信服务号
						var href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri="
								+redirectUri+"&response_type=code&scope="+scope+"&state="+state+"#wechat_redirect";
						window.location.href=href;
					}				
       			 });
			}else{
			//获取openId
				$.ajax({
					type : 'get',
					dataType : 'json',
					data : getFinalRequestObject({accessToken:getAccessToken(),code:getParam('code')}),
					url : '<%= CLI_HOST_API_URL %>/nggirl/app/cli/register/weixin/getOpenId',
					success : function(data) {
						if(data.code == 0){
							openId=data.data.openid;
							//alert(openId);
						}else{
							//alert(data.data.error);
						}
					}				
        		});
			}
		}
		$(".button").live('click',function(){
			var attentionWay='';
			if(!$(".ageRadio span").hasClass("on")){
				alertFn("请选择年龄段！");
			}else if(!$(".workRadio span").hasClass("on")){
				alertFn("请选择您的职业！");
			}else if($.trim($(".city").val()) == ""){
				alertFn("请填写您所在的城市！");
			}else if(!$(".wayBox span").hasClass("on")){
				alertFn("请选择您是从哪种方式关注的南瓜姑娘！");
			}else{
				$(".wayBox span.on").each(function(index, element) {
                    attentionWay +=$(this).text()+',';
                });
			  	$.ajax({
					type : 'post',
					dataType : 'json',
					data : getFinalRequestObject({accessToken:getAccessToken(),openId:openId,realName:$(".name").val(),age:$(".ageRadio .on").text(),profession:$(".workRadio .on").text(),city:$(".city").val(),attentionWay:attentionWay,advice:$(".suggest textarea").val()}),
					url : '<%= CLI_HOST_API_URL %>/nggirl/app/cli/question/submitQuestionReport',
					success : function(data) {
							alertFn("提交成功！");
							setTimeout(function(){
								window.location.href=window.location.protocol+"//"+window.location.host+"/nggirl/h5/cosmetic/index.html?v=<%= VERSION %>";
							},1000);
							
					}				
        		});
			}
			
		});
		
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','phoneType=iOS','调研报告']);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','phoneType=and','调研报告']);
		};
		//微信分享
		if(isInWeixin()){
			var str = window.location.href;
			var title = '【南瓜姑娘】这里有封专给高颜值小仙女的问卷~';
			var desc = '你是不是高颜值小仙女？点开就知道啦！';
			var link = window.location.protocol+"//"+window.location.host+"/nggirl/h5/mobile/user_survey_report.html?v=<%= VERSION %>";
			var imgUrl = 'https://photosd.nggirl.com.cn/work/a5026957e3ec4fa49a17c0837085446d.jpg';
			var from = getParam('apptype');
			if(!strIsEmpty(from) && from == 'appb'){
				desc = '你是不是高颜值小仙女？点开就知道啦！';
			}
			weixinConfig(title,desc,link,imgUrl);
		}			
		//h5,app同步分享内容
		if(isInApp()){
			window.shareTitle = '这里有封专给高颜值小仙女的问卷~';
			window.shareContent = '你是不是高颜值小仙女？点开就知道啦！';
			window.sharePicture =  'https://photosd.nggirl.com.cn/work/a5026957e3ec4fa49a17c0837085446d.jpg';
			window.shareUrl = window.location.protocol+"//"+window.location.host+"/nggirl/h5/mobile/user_survey_report.html?v=<%= VERSION %>";
		};
		//给安卓传值
		if(typeof(window.ngjsInterface)!="undefined" && typeof(window.ngjsInterface.conFigShareInfo)!="undefined"){
			window.ngjsInterface.conFigShareInfo('这里有封专给高颜值小仙女的问卷~','你是不是高颜值小仙女？点开就知道啦！','https://photosd.nggirl.com.cn/work/a5026957e3ec4fa49a17c0837085446d.jpg',window.location.protocol+"//"+window.location.host+"/nggirl/h5/mobile/user_survey_report.html?v=<%= VERSION %>");
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