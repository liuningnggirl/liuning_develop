$(function(){
	loadHotTopic();
	loadTopicList();
	if (/iphone|ipad|ipod/.test(ua)) {
		$(".userBox .userLevel").css("padding","2px 0 2px");	
	} else if (/android/.test(ua)) {
		$(".userBox .userLevel").css("padding","3px 0 1px");
	};
	$(".topicListBox .topicList").die("click");
	$(".topicListBox .topicList").live("click",function(){
		if($(this).attr("postType") == "1"){
			window.location.href="articledetail.html?postType=" +1 +'&postId=' +$(this).attr("postId")+'&v=<%= VERSION %>';
		}else{
			window.location.href="videoDetail.html?postType=" +2 +'&postId=' +$(this).attr("postId")+'&v=<%= VERSION %>';
		}
	});
	$(".topicListBox .userBox .userImg").die("click");
	$(".topicListBox .userBox .userImg").live("click",function(){
		window.location.href="myHomePage.html?userId=" +$(this).attr("userId")+'&v=<%= VERSION %>';
		return false;
	});
	$(".topicListBox .articalPopBox .column").die("click");
	$(".topicListBox .articalPopBox .column").live("click",function(){
		window.location.href="indexLookMore.html?columnId=" +$(this).attr("columnId")+'&v=<%= VERSION %>';
		return false;
	});
	//关注与取消关注
	$('.guanzhu').live('click', function (e) {
		var del=$(this);
		checkAccessTokenLogin(function () {
			if(del.hasClass("folloed")){
				$.ajax({
					url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/personal/cancelFollowTopic/3.0.0',
					type: 'post',
					data: getFinalRequestObject({accessToken:getAccessToken(), topicId:getParam('topicId')}),
					dataType: 'json',
					success: function (data) {
						if(data.code == 0){
							del.removeClass("folloed");
							del.html("关注");
						}else{
							alert(data.data.error);
						}
							
					}
				});
			}else{
				$.ajax({
					url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/personal/addFollowTopic/3.0.0',
					type: 'post',
					data: getFinalRequestObject({accessToken:getAccessToken(),topicId:getParam('topicId')}),
					dataType: 'json',
					success: function (data) {
						if(data.code == 0){
							del.addClass("folloed");
							del.html("已关注");
						}else{
							alert(data.data.error);
						}	
					}
				});
			}
		}, 'hotTopicDetail.html' + window.location.search);
		return false;
	});
	function loadHotTopic(){
		$.ajax({
			type: "get",
			url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/community/getHotTopicDetail/3.0.0',
			data:getFinalRequestObject({accessToken:getAccessToken(),topicId:getParam('topicId')}),
			dataType:"json",
			async: false,
			success: function (data) {
				if(data.code == 0){
					$("title").html(data.data.topicName);
					var str='';
					if(data.data.isFollowed ==1){
						str += '<div class="guanzhu folloed">已关注</div>';
					}else{
						str += '<div class="guanzhu">关注</div>';
					}
					str += '<div class="topicImg"><img src="'+data.data.headImg+'@80Q" class="lazy" alt=""/></div>';
					str += '<div class="topicName">'+data.data.topicName+'</div>';
					str += '<div class="line"></div>';
					str += '<div class="topicDescrip">'+data.data.descrip+'</div>';
					str += '<div class="topicPopBox"><div class="topicPop clearfix"><p class="postNum">帖子：'+data.data.postNum+'</p><p class="followerNum">粉丝：'+data.data.fansNum+'</p></div></div>';
					
					$(".hotTopic").append(str);
					$(".topicImg img.lazy").lazyload({effect : "fadeIn",threshold : 200});
					//微信分享
					if(isInWeixin()){
						var title = '【南瓜姑娘】'+data.data.topicName;
						var desc = data.data.descrip;
						var link = window.location.href;
						var imgUrl = data.data.shareImg;
						var from = getParam('apptype');
						if(!strIsEmpty(from) && from == 'appb'){
							desc = data.data.descrip;
						}
						weixinConfig(title,desc,link,imgUrl);
					}
					//h5,app同步分享内容
					//给ios
					if(isInApp()){
						window.shareTitle = data.data.topicName;
						window.shareContent = data.data.descrip;
						window.sharePicture = data.data.shareImg;
						window.shareUrl = window.location.href;
					};
					//给安卓传值
					if(typeof(window.ngjsInterface)!="undefined" && typeof(window.ngjsInterface.conFigShareInfo)!="undefined"){
						window.ngjsInterface.conFigShareInfo(data.data.topicName,data.data.descrip,data.data.shareImg,window.location.href);
					};
				}else{
					alert(data.data.error);	
				}
			},
		});
	}
	function loadTopicList(){
		$.ajax({
			type: "get",
			url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/community/getHotTopicPostList/3.0.0',
			data:getFinalRequestObject({topicId:getParam('topicId')}),
			dataType:"json",
			async: false,
			success: function (data) {
				if(data.code == 0){
					var str='';
					for( var i=0; i<data.data.length; i++){
						str += '<div class="topicList topicList" postId="'+data.data[i].postId+'" postType="'+data.data[i].postType+'"><div class="articalImg" ><img data-original="'+data.data[i].detailImg+'@80Q" class="lazy imgw " alt=""/></div>';
						str += '<div class="userBox"><div class="userImg" userId="'+data.data[i].userId+'"><img data-original="'+data.data[i].profile+'@80Q" class="lazy imgw " /></div><div class="userName"><p class="usernamebox">'+data.data[i].nickName+'</p><div class="userLevel">LV'+data.data[i].userLevel+'</div></div></div>';
						str += '<div class="articalName">'+data.data[i].title+'</div>';
						if(data.data[i].descrip !=''){
							str += '<div class="articalDescrip">'+data.data[i].descrip+'</div>';
						}
						str += '<div class="articalPopBox"><div class="column" columnId="'+data.data[i].columnId+'">'+data.data[i].columnName+'</div><div class="articalPop clearfix"><p class="commentNum">'+data.data[i].commentNum+'</p><p class="viewNum">'+data.data[i].viewNum+'</p><p class="likeNum">'+data.data[i].likeNum+'</p></div></div></div>';
						
					}
					$(".topicListBox").append(str);
					$(".topicList img.lazy").lazyload({effect : "fadeIn",threshold : 200});
				}else{
					alert(data.data.error);	
				}
			},
		});
	}
});

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
				contentType:'h5',
				contentInfo:window.location.href
				})
				,function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						if (/iphone|ipad|ipod/.test(ua)) {
							_czc.push(['_trackEvent','hot_topic_detail','phoneType=iOS','热门话题','topicId',getParam('topicId')]);	
						} else if (/android/.test(ua)) {
							_czc.push(['_trackEvent','hot_topic_detail','phoneType=and','热门话题','topicId',getParam('topicId')]);
						};
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
				contentType:'h5',
				contentInfo:window.location.href
				})
				,function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						if (/iphone|ipad|ipod/.test(ua)) {
							_czc.push(['_trackEvent','hot_topic_detail','phoneType=iOS','热门话题','topicId',getParam('topicId')]);	
						} else if (/android/.test(ua)) {
							_czc.push(['_trackEvent','hot_topic_detail','phoneType=and','热门话题','topicId',getParam('topicId')]);
						};
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