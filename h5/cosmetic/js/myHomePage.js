// JavaScript Document
$(function(){
	getCustomMessage();
	var size=10;
	getUserPosts(0,10);
	$('.box ul li').live('click',function(e) {
		//判断帖子类型
		if($(this).attr('postType') == 1){//文章
			window.location.href="articledetail.html?postType=" + $(this).attr('postType') +'&postId=' +$(this).attr('postId')+'&v=<%= VERSION %>';	
		}	
		if($(this).attr('postType') == 2){//视频
			window.location.href="videoDetail.html?postType=" + $(this).attr('postType') +'&postId=' +$(this).attr('postId')+'&v=<%= VERSION %>';	
		}	
    });
	$(window).scroll(function(){
		var distenttop=$(".myartical").offset().top-$("body").scrollTop();
		  if(distenttop <=0){
		      $(".myartical h3").css({'position':'fixed','top':'0','z-index':"100"})
		  }else{
			  $(".myartical h3").css({'position':'relative'})
			 }; 
	});
	var ua = navigator.userAgent.toLowerCase();	
	if (/iphone|ipad|ipod/.test(ua)) {
			$(".level").addClass("level1");		
	} else if (/android/.test(ua)) {
		    $(".level").addClass("level2");			
	}
})
//用户个人信息
function getCustomMessage(){
$.ajax({//采用异步
	type: "get",
	url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/user/getUserInfo/3.0.0',
	data:getFinalRequestObject({accessToken:getAccessToken(),userId:getParam("userId")}),
	timeout:15000,//10s
	dataType:"json",
	success: function (data) {//<img src="'+data.data.profile+'">
		if(data.code == 0){
			$("title").html(data.data.nickName+"的主页");
			if(data.data.isMyHome == "1"){
				$("title").html("我的主页");
				$(".head_attention").hide();
				$(".nonetit span").html("您");
			}else if(data.data.isFollowed == "1"){
				$(".head_attention").html("已关注");
				$(".head_attention").addClass("atten1");	
			}else if(data.data.isFollowed == "0"){
				$(".head_attention").html("关注");
				$(".head_attention").addClass("atten2");	
			}
			$(".head_img img").attr('src',data.data.profile);
			$(".username").html(data.data.nickName);
			if(data.data.userRole == ""){
				$(".userrole").hide();
			}else{
				$(".userrole").html(data.data.userRole);
			}
			
			if(data.data.sex == "0"){
				$(".usersex").attr('src','images/boy.png');
			}else{
				$(".usersex").attr('src','images/girl.png');
			};
			$(".usermessage .level").html('LV'+data.data.userLevel);
			
		//微信分享
            if(isInWeixin()){
            	var title = '【南瓜姑娘】'+data.data.nickName+'的个人主页';
                var desc = '从来到南瓜姑娘学化妆，追TA的男生越来越多了！不信就来看看TA的主页吧~';
                var link = window.location.href;
                var imgUrl = data.data.profile;
            	var from = getParam('apptype');
            	if(!strIsEmpty(from) && from == 'appb'){
            		desc = '从来到南瓜姑娘学化妆，追TA的男生越来越多了！不信就来看看TA的主页吧~';
            	}
            	weixinConfig(title,desc,link,imgUrl);
            }	
			
			//h5,app同步分享内容
			if(isInApp()){
				window.shareTitle ='【南瓜姑娘】'+data.data.nickName+'的个人主页';
				window.shareContent = '从来到南瓜姑娘学化妆，追TA的男生越来越多了！不信就来看看TA的主页吧~';
				window.sharePicture = data.data.profile;
				window.shareUrl = window.location.href;
			};	
			if(isInApp() && typeof(window.ngjsInterface) != "undefined" && typeof(window.ngjsInterface.conFigShareInfo) != "undefined"){
				window.ngjsInterface.conFigShareInfo('【南瓜姑娘】'+data.data.nickName+'的个人主页','从来到南瓜姑娘学化妆，追TA的男生越来越多了！不信就来看看TA的主页吧~',data.data.profile,window.location.href);
			};
		}else{
				alert(data.data.error);
			}		
	},
	error: function (XMLHttpRequest, textStatus, errorThrown) {
		//console.log( XMLHttpRequest )
		//$(".main").html("尚未发布任何信息！");
	}
});
}
//获取帖子列表
function getUserPosts(page,size){
	//通过带过来的专栏编号来加载对应的专题数据
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/user/getUserPosts/2.2.0',getFinalRequestObject({accessToken:getAccessToken(),userId:getParam('userId'),page:page,num:size}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.length > 0){
				$(".nonelist").hide();
				$(".conlumn_list").show();
				$("body").css("background","#e6eeec");
			}
			if( data.data.length == size ){
				var tur = true;	
				
				$(window).scroll(function(){
					imgaa();
					var winH = $(window).height(); //浏览器当前窗口可视区域高度  
					var pageH = $(document.body).height(); //浏览器当前窗口文档body的高度 
					var scrollT = $(window).scrollTop(); //滚动条top  
					var lastPersentH = (pageH - winH - scrollT) / winH;  
					if(tur && lastPersentH < 0.001){ 
					setTimeout(function(){
					PageNumPP();
					
					},500);
					tur = false;
				   } 
			   });
			}
			for(var x = 0; x < data.data.length; x ++){
				//判断帖子类型
				if(data.data[x].postType == 1){//文章
					$('.box ul').append('<li postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'" class="page'+page+'"><img data-original="'+data.data[x].picture+'" alt="" class="posts lazy" /></li>');	
				}
				if(data.data[x].postType == 2){//视频
					$('.box ul').append('<li postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'" class="page'+page+'"><img data-original="'+data.data[x].picture+'" alt="" class="posts lazy" /><img data-original="images/pause.png" alt="" class="pause lazy" /></li>');	
				}
			}
			$('.box  ul li').height($('.box ul li').width()*5/3);
			$(".page"+page+" img.lazy").lazyload({effect : "fadeIn",threshold : 200});
			$(".page"+page+" img.lazy").on("load",function(){
				setTimeout(imgaa(), 200 )
				
			});
		}else{
			alert(data.data.error);	
		}
	});	
}
//页数++
function PageNumPP(){
	var size=10;
	var page = $('body').data('page');//在body里面存储page
	if(page == undefined || parseInt(page) == NaN){
		page = 0;
	}
	page = page + 1;
	$('body').data('page',page);
	getUserPosts(page,size);
	imgaa();
}	
function imgaa(){
	$(".box ul li img.posts").each(function() {
		var del=$(this);
		var img_url =$(this).attr("data-original");
		// 创建对象
		var img = new Image();
		var imgwidth=img.width;
		var imgheight=img.height;
		// 改变图片的src
		img.src = img_url;
		var width1=$(".box ul li").width();
		var height1=$(".box ul li").height();
		if(img.width*5/3 > img.height ){
			del.css({"height":"100%","width":"auto"});
			var ht=(width1-height1*img.width/img.height)/2;
			del.css("margin-left",ht+"px");
			}else{
				del.css({"width":"100%","height":"auto"});
				var wl=(height1-width1*img.height/img.width)/2;
				del.css("margin-top",wl+"px");
				}
	 });
};
//关注按钮点击
$(".head_attention").live('click',function(){
	 checkAccessTokenLogin(function () {
         var data = getFinalRequestObject({
             accessToken: getAccessToken()
         });
		
		if($(".head_attention").hasClass("atten1")){
				cancelFollowUser();
				$(".head_attention").html("关注");
				$(".head_attention").removeClass("atten1").addClass("atten2");
			}else{
				FollowUser();
				$(".head_attention").html("已关注");
				$(".head_attention").removeClass("atten2").addClass("atten1");
				}
	}, 'myHomePage.html' + window.location.search);
});
//关注
function FollowUser(){
	$.ajax({//采用异步
		type: "post",
		url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/personal/addFollowUser/2.2.0',
		data:getFinalRequestObject({accessToken:getAccessToken(),followedUserId:getParam("userId")}),
		dataType:"json",
		success: function (data) {
			
		},
	
	});
}
//取消关注
function cancelFollowUser(){
	$.ajax({//采用异步
		type: "post",
		url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/personal/cancelFollowUser/2.2.0',
		data:getFinalRequestObject({accessToken:getAccessToken(),followedUserId:getParam("userId")}),
		dataType:"json",
		success: function (data) {
			
		},
	
	});
}
 //微信分享
function weixinConfig(title,desc,link,imgUrl){
    wx.ready(function(){

        //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
        wx.onMenuShareTimeline({
            title: title, // 分享标题
            link: link, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {
				_czc.push(['_trackEvent','nggirl_column_post_article_share','文章分享','postId',$(".ad_top").attr('postId'),'']);	
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
				_czc.push(['_trackEvent','nggirl_column_post_article_share','文章分享','postId',$(".ad_top").attr('postId'),'']);
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
};