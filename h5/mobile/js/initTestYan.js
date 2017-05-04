define(function(require, exports, module){
    exports.initPage = function() {
		//第1题
		$('.question_01 .bq_double_btn>.selected_btn').click(function(e) {
            selectAnswerFn($(this));
        });
		$('.question_01 .next_question').click(function(e) {
			selectAnswerCheckFn($(this));
        });
		
		//第2题
		$('.question_02 .bq_double_btn>.selected_btn').click(function(e) {
            selectAnswerFn($(this));
        });
		$('.question_02 .next_question').click(function(e) {
			selectAnswerCheckFn($(this));
        });
		$('.question_02 .prve_question').click(function(e) {
			selectAnswerPrveFn($(this));
        });
		
		
		//第3题
		$('.question_03 .bq_double_btn>.selected_btn').click(function(e) {
            selectAnswerFn($(this));
        });
		$('.question_03 .next_question').click(function(e) {
			selectAnswerCheckFn($(this));
        });
		$('.question_03 .prve_question').click(function(e) {
			selectAnswerPrveFn($(this));
        });
		
		//第4题
		$('.question_04 .bq_double_btn>.selected_btn').click(function(e) {
            selectAnswerFn($(this));
        });
		$('.question_04 .next_question').click(function(e) {
			selectAnswerCheckFn($(this));
        });
		$('.question_04 .prve_question').click(function(e) {
			selectAnswerPrveFn($(this));
        });
		
		//第5题
		$('.question_05 .bq_double_btn>.selected_btn').click(function(e) {
            selectAnswerFn($(this));
        });
		$('.question_05 .next_question').click(function(e) {
			selectAnswerCheckFn($(this));
        });
		$('.question_05 .prve_question').click(function(e) {
			selectAnswerPrveFn($(this));
        });
		
		//第6题
		$('.question_06 .bq_double_btn>.selected_btn').click(function(e) {
            selectAnswerFn($(this));
        });
		$('.question_06 .next_question').click(function(e) {
			selectAnswerCheckFn($(this));
        });
		$('.question_06 .prve_question').click(function(e) {
			selectAnswerPrveFn($(this));
        });
		
		//第7题
		$('.question_07 .bq_double_btn>.selected_btn').click(function(e) {
            selectAnswerFn($(this));
        });
		$('.question_07 .next_question').click(function(e) {
			selectAnswerCheckFn($(this));
        });
		$('.question_07 .prve_question').click(function(e) {
			selectAnswerPrveFn($(this));
        });
		
		//第8题
		$('.question_08 .bq_double_btn>.selected_btn').click(function(e) {
            selectAnswerFn($(this));
			var str = '';
			var selectStr = '';
			$('.selected_btn').each(function(index, element) {
                if($(this).hasClass('selected_btn_blue')){
					str += '"'+$(this).attr('opt')+'",';
					selectStr += $(this).attr('optTag')+',';
				};
            });
			str = '['+str.substring(0,str.length-1)+']';
			selectStr = '['+selectStr.substring(0,selectStr.length -1)+']';
			console.log(str);
			console.log(selectStr);
			if (/iphone|ipad|ipod/.test(ua)) {
				 _czc.push(['_trackEvent','nggirl_ThumbUp','phoneType=iOS','颜值测试提交'+selectStr,'true','']);	
			} else if (/android/.test(ua)) {
				 _czc.push(['_trackEvent','nggirl_ThumbUp','phoneType=and','颜值测试提交'+selectStr,'true','']);
			};
			
			if($('.question_08 .bq_double_btn>.selected_btn').hasClass('selected_btn_blue')){
				$('.opcity_box').show();
				$.post('<%= CLI_HOST_API_URL %>/nggirl/app/activity/testActivity/createPicture',getFinalRequestObject({accessToken:getAccessToken(),options:str}),function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						$('.opcity_box').hide();
						$('body').css("background","#ebecee").children().remove();
						$('<img>').attr('src',data.data.picture).css("width","100%").css("display","block").css("margin","auto").appendTo('body');
						$('body').append('<img src="images/save_img.png" class="prompt_message" alt="" />');

						var str = window.location.href.replace(/testYan/,"testYanCode");
						//微信分享
						if(isInWeixin()){
							var title = '【南瓜姑娘】我的2017年颜值指数：'+data.data.lookValue+'，打败了'+data.data.percentNum+'好友';
							var desc = '这个测试让你更了解自己，还能与好友PK。一起来玩~';
							var link = str;
							var imgUrl = 'https://testphotosd.nggirl.com.cn/work/1ef095687cc64d38a4f4d1abf42d9153.png';
							var from = getParam('apptype');
							if(!strIsEmpty(from) && from == 'appb'){
								desc = '这个测试让你更了解自己，还能与好友PK。一起来玩~';
							}
							weixinConfig(title,desc,link,imgUrl);
						}
						//h5,app同步分享内容
						if(isInApp()){
							window.ngjsInterface.getTitleFromSecondSee('我的2017年颜值指数：'+data.data.lookValue+'，打败了'+data.data.percentNum+'好友');
							window.shareTitle = '我的2017年颜值指数：'+data.data.lookValue+'，打败了'+data.data.percentNum+'好友';
							window.shareContent = '这个测试让你更了解自己，还能与好友PK。一起来玩~';
							window.sharePicture = 'https://testphotosd.nggirl.com.cn/work/1ef095687cc64d38a4f4d1abf42d9153.png';
							window.shareUrl = str;
						};
						//给安卓传值
						if(typeof(window.ngjsInterface)!="undefined" && typeof(window.ngjsInterface.conFigShareInfo)!="undefined"){
							window.ngjsInterface.conFigShareInfo('我的2017年颜值指数：'+data.data.lookValue+'，打败了'+data.data.percentNum+'好友','这个测试让你更了解自己，还能与好友PK。一起来玩~','https://testphotosd.nggirl.com.cn/work/1ef095687cc64d38a4f4d1abf42d9153.png',str);
						};
					}else{
						alert(data.data.error);	
					}
				});
			}else{
				alert('答完最后一题才能查看结果哦~');		
			}
        });
		$('.question_08 .prve_question').click(function(e) {
			selectAnswerPrveFn($(this));
        });
		
		//点击提交按钮
		$('.submit_question').click(function(e) {
        });
		
		//查看下一题
		function selectAnswerFn(btn){
			btn.addClass('selected_btn_blue').siblings().removeClass('selected_btn_blue');
			if(btn.parent().parent().hasClass('question_08')){
				
			}else{
				setTimeout(function(){
					btn.parent().parent().hide();
					btn.parent().parent().next().show();
				},100);
			}
		}
		
		//选择答案
		function selectAnswerCheckFn(btn){
			if(btn.parent().prev().children('.selected_btn').hasClass('selected_btn_blue')){
				btn.parent().parent().hide();
				btn.parent().parent().next().show();
			}else{
				alert('选择答案才能看到下一题哦~');	
			}
		}
		
		//查看上一题
		function selectAnswerPrveFn(btn){
			btn.parent().parent().hide();
			btn.parent().parent().prev().show();
		}
		
		
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','phoneType=iOS','测颜值活动页']);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','phoneType=and','测颜值活动页']);
		};

		//不在微信中,就验证其授权令牌
		if(!isInWeixin()){
			checkAccessTokenLogin(function () {},window.location.href);
			var str = window.location.href.replace(/testYan/,"testYanCode");
			//h5,app同步分享内容
			if(isInApp()){
				window.shareTitle = '2017年，你离靠脸吃饭的日子，还有多远？';
				window.shareContent = '这个测试让你更了解自己，还能与好友PK。一起来玩~';
				window.sharePicture = 'https://testphotosd.nggirl.com.cn/work/1ef095687cc64d38a4f4d1abf42d9153.png';
				window.shareUrl = str;
			};
			//给安卓传值
			if(typeof(window.ngjsInterface)!="undefined" && typeof(window.ngjsInterface.conFigShareInfo)!="undefined"){
				window.ngjsInterface.conFigShareInfo('2017年，你离靠脸吃饭的日子，还有多远？','这个测试让你更了解自己，还能与好友PK。一起来玩~','https://testphotosd.nggirl.com.cn/work/1ef095687cc64d38a4f4d1abf42d9153.png',str);
			};
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
				var str = window.location.href.replace(/testYan/,"testYanCode");
				var title = '【南瓜姑娘】2017年，你离靠脸吃饭的日子，还有多远？';
				var desc = '这个测试让你更了解自己，还能与好友PK。一起来玩~';
				var link = str;
				var imgUrl = 'https://testphotosd.nggirl.com.cn/work/1ef095687cc64d38a4f4d1abf42d9153.png';
				var from = getParam('apptype');
				if(!strIsEmpty(from) && from == 'appb'){
					desc = '这个测试让你更了解自己，还能与好友PK。一起来玩~';
				}
				weixinConfig(title,desc,link,imgUrl);
			}
		};			

		function getWeixinLinkUrl(){
			var redirectUri = encodeURIComponent("<%= WEIXIN_BOUND_DOMAIN_URL %>/nggirl/h5/mobile/testYan.html?v=<%= VERSION %>");
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
				url:'<%= CLI_HOST_API_URL %>/nggirl/app/cli/weixinjs/config',
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