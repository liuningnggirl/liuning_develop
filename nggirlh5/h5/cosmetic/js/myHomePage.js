// JavaScript Document
$(function(){
	getCustomMessage();
	var size=20;
	getUserPosts(0,size);
	getZanPosts(0,size);
	getCaoPosts(0,size);
	$('ul li').live('click',function(e) {
		//判断帖子类型
		if($(this).attr('postType') == 1){//文章
			window.location.href="articledetail.html?postType=" + $(this).attr('postType') +'&postId=' +$(this).attr('postId')+'&v=<%= VERSION %>';	
		}	
		if($(this).attr('postType') == 2){//视频
			window.location.href="videoDetail.html?postType=" + $(this).attr('postType') +'&postId=' +$(this).attr('postId')+'&v=<%= VERSION %>';	
		}	
    });
	
	//打开详情
	$('.con .tab_tie_cao').delegate("li .box_cao .seeProduct","click",function(){
		if($(this).attr('isAllowBuy') == 0){
			window.location.href = "goodsShareCatenate.html?itemId="+ $(this).attr('seedProductId')+'&targetType='+$(this).attr('targetType')+'&v=<%= VERSION %>';
		}else{
			window.location.href = "productDetails.html?seedProductId="+ $(this).attr('seedProductId')+'&targetType='+$(this).attr('targetType')+'&targetId='+$(this).attr('targetId')+'&v=<%= VERSION %>';	
		}
	});
	
//点击长草按钮
$(".zhongcao").live('click',function(){
	var del=$(this);
	var seedProductId=$(this).parent().parent().attr("seedProductId");
	checkAccessTokenLogin(function () {
		 var data = getFinalRequestObject({
			 accessToken: getAccessToken()
		 });
		if(del.hasClass("zhongcao2")){
			$.ajax({//采用异步取消长草
				type: "post",
				url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/seedproduct/deleteCollectProduct/2.3.0',
				data:getFinalRequestObject({accessToken:getAccessToken(),seedProductIds:seedProductId}),
				timeout:15000,//10s
				dataType:"json",
				success: function (data) {
					if(data.code == 0){
						del.addClass("zhongcao1").removeClass("zhongcao2");
						var delnum=del;
						delnum.text(parseInt(delnum.text())-1);
					}else{
						alert(data.data.error);
					}	
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					//console.log( XMLHttpRequest )
					//$(".main").html("尚未发布任何信息！");
				}
			});
		}else{
			$.ajax({//采用异步长草
				type: "post",
				url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/seedproduct/collectProduct/2.5.3',
				data:getFinalRequestObject({accessToken:getAccessToken(),seedProductId:seedProductId,targetType:del.parent().parent().attr("targetType"),targetId:del.parent().parent().attr("targetId")}),
				timeout:15000,//10s
				dataType:"json",
				success: function (data) {
					if(data.code == 0){
						if (/iphone|ipad|ipod/.test(ua)) {
							_czc.push(['_trackEvent','nggirl_column_post_seedProduct_collect','phoneType=iOS','商品收藏','seedProductId',$(this).parent().attr("seedProductId")]);	
						} else if (/android/.test(ua)) {
							_czc.push(['_trackEvent','nggirl_column_post_seedProduct_collect','phoneType=and','商品收藏','seedProductId',$(this).parent().attr("seedProductId")]);
						};
						del.addClass("zhongcao2").removeClass("zhongcao1");
						var delnum=del;
						delnum.text(parseInt(delnum.text())+1);
						if(data.data.addScore != "0"){
							alertNewScore("积分 +"+data.data.addScore);
						}
					}else{
						alert(data.data.error);
					}	
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					//console.log( XMLHttpRequest )
					//$(".main").html("尚未发布任何信息！");
				}
			});
		};
	}, 'myHomePage.html' + window.location.search);
		return false;
	});	
	
	//点击购买
	$('.goToBuy2').die('click');
	$('.goToBuy2').live('click',function(e) {
		var del = $(this);
		var delId = $(this).parent().parent().attr("seedproductId");
		checkAccessTokenLogin(function () {
			if (/iphone|ipad|ipod/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_relevant_product_gobuy','phoneType=iOS','去买按钮','seedProductId',delId]);	
			} else if (/android/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_relevant_product_gobuy','phoneType=and','去买按钮','seedProductId',delId]);
			};
			//alert(delId);
			//判断如果是在微信打开
			/*if(isInWeixin()){
				$('.isWei').show();	
			}else{
				$('.isWei').hide();	*/
				window.location.href = "goodsShareCatenate.html?itemId="+delId+'&v=<%= VERSION %>';
			/*}*/
		}, 'myHomePage.html' + window.location.search);
    });
	//点击购买
	$('.goToBuy1').die('click');
	$('.goToBuy1').live('click',function(e) {
		var del = $(this).parent().parent();
		checkAccessTokenLogin(function () {
			if (/iphone|ipad|ipod/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_relevant_product_gobuy','phoneType=iOS','去买按钮','seedProductId',del.attr('seedProductId')]);	
			} else if (/android/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_relevant_product_gobuy','phoneType=and','去买按钮','seedProductId',del.attr('seedProductId')]);
			};
			//alert(delId);
			//判断如果是在微信打开
			window.location.href = "productDetails.html?seedProductId="+del.attr('seedProductId')+"&targetType="+del.attr('targetType')+"&targetId="+del.attr('targetId')+'&v=<%= VERSION %>';
			
		}, 'myHomePage.html' + window.location.search);
    });	
})
//用户个人信息
function getCustomMessage(){
$.ajax({//采用异步
	type: "get",
	url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/user/getUserInfo/4.0.0',
	data:getFinalRequestObject({accessToken:getAccessToken(),userId:getParam("userId")}),
	timeout:15000,//10s
	dataType:"json",
	success: function (data) {
		if(data.code == 0){
			$("title").html(data.data.nickName+"的主页");
			if(data.data.isMyHome == "1"){
				$("title").html("我的主页");
				$(".attention_btn").hide();
				$(".nonetit span").html("您");
			}else if(data.data.isFollowed == "1"){
				$(".attention_btn").html("已关注");
				$(".attention_btn").addClass("atten1");	
			}else if(data.data.isFollowed == "0"){
				$(".attention_btn").html("关注");
				$(".attention_btn").addClass("atten2");	
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
			if(data.data.summary == ''){
				$('.desc_message').html('一句话描述自己');
			}else{
				$('.desc_message').html(data.data.summary);
			}
			$('.another_message .fen_num').html(data.data.fansNum+' 粉丝');
			$('.another_message .atten_num').html(data.data.followedNum+' 关注');
			
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
				$('.con .tab_tie_ok').height($(window).height()*0.6);
				$(".tab_shou_ok").hide();
				$(".tab_tie_ok").show();
			}
			for(var x = 0; x < data.data.length; x ++){
				$('.tab_tie_ok').append('<li postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'" class="page'+page+'"><img src="'+data.data[x].picture+'" class="tie_img" alt=""></li>');	
				$('.tab_tie_ok li').height($('.tab_tie_ok li').width());
			}
			if( data.data.length == size ){
				var tur = true;	
				$(window).scroll(function(){
					var winH = $(window).height(); //浏览器当前窗口可视区域高度  
					var pageH = $(document.body).height(); //浏览器当前窗口文档body的高度 
					var scrollT = $(window).scrollTop(); //滚动条top  
					var lastPersentH = (pageH - winH - scrollT) / winH;  
					if(tur && lastPersentH < 0.001){ 
					setTimeout(function(){
					PageNumTie();
					
					},500);
					tur = false;
				   } 
			   });
			}
		}else{
			alert(data.data.error);	
		}
	});	
}


//获取点赞帖子列表
function getZanPosts(page,size){
	//通过带过来的专栏编号来加载对应的专题数据
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/user/PraisePost/4.0.0',getFinalRequestObject({accessToken:getAccessToken(),userId:getParam('userId'),pageNum:page,pageSize:size}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.length > 0){
				$('.con .tab_tie_zan').height($(window).height()*0.6);
				$(".tab_zan_no").hide();
				$(".tab_tie_zan").show();
			}
			for(var x = 0; x < data.data.length; x ++){
				$('.con .tab_tie_zan').append('<li postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'" class="page'+page+'"><img class="detailImg" src="'+data.data[x].detailImg+'" alt=""></li>');
				$('.detailImg').height($('.detailImg').width());	
			}
			if( data.data.length == size ){
				var tur = true;	
				$(window).scroll(function(){
					var winH = $(window).height(); //浏览器当前窗口可视区域高度  
					var pageH = $(document.body).height(); //浏览器当前窗口文档body的高度 
					var scrollT = $(window).scrollTop(); //滚动条top  
					var lastPersentH = (pageH - winH - scrollT) / winH;  
					if(tur && lastPersentH < 0.001){ 
					setTimeout(function(){
					PageNumZan();
					
					},500);
					tur = false;
				   } 
			   });
			}
		}else{
			alert(data.data.error);	
		}
	});	
}


//获取长草帖子列表
function getCaoPosts(page,size){
	//通过带过来的专栏编号来加载对应的专题数据
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/user/ListCollectProduct/4.0.0',getFinalRequestObject({accessToken:getAccessToken(),userId:getParam('userId'),pageNum:page,pageSize:size}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.length > 0){
				$('.con .tab_tie_cao').height($(window).height()*0.6);
				$('.tab_cao_no').hide();
				$('.tab_tie_cao').show();	
			}
			for(var x = 0; x < data.data.length; x ++){
				//判断是否可购买
				if(data.data[x].isAllowBuy == 0){//未开售
					//是否已长草
					if(data.data[x].isSeed == 0){//未长草
						$('.tab_tie_cao').append('<li><div class="box_cao"><img seedProductId='+data.data[x].seedProductId+' targetId='+data.data[x].targetId+' targetType='+data.data[x].targetType+' isAllowBuy='+data.data[x].isAllowBuy+' class="seeProduct" src="'+data.data[x].picture+'"><p class="box_cao_title">'+data.data[x].name+'</p><p class="box_cao_price">参考价：<span>¥ '+data.data[x].price+'</span></p><p class="zhongcao zhongcao1">'+data.data[x].seedNum+'</p><p class="goToBuy goToBuy1">去买</p></div></li>');	
					}else{
						$('.tab_tie_cao').append('<li seedProductId='+data.data[x].seedProductId+' targetId='+data.data[x].targetId+' targetType='+data.data[x].targetType+' isAllowBuy='+data.data[x].isAllowBuy+'><div class="box_cao"><img seedProductId='+data.data[x].seedProductId+' targetId='+data.data[x].targetId+' targetType='+data.data[x].targetType+' isAllowBuy='+data.data[x].isAllowBuy+' class="seeProduct" src="'+data.data[x].picture+'"><p class="box_cao_title">'+data.data[x].name+'</p><p class="box_cao_price">参考价：<span>¥ '+data.data[x].price+'</span></p><p class="zhongcao zhongcao2">'+data.data[x].seedNum+'</p><p class="goToBuy goToBuy1">去买</p></div></li>');	
					}
				}else{
					//是否已长草
					if(data.data[x].isSeed == 0){//未长草
						$('.tab_tie_cao').append('<li seedProductId='+data.data[x].seedProductId+' targetId='+data.data[x].targetId+' targetType='+data.data[x].targetType+' isAllowBuy='+data.data[x].isAllowBuy+'><div class="box_cao"><img seedProductId='+data.data[x].seedProductId+' targetId='+data.data[x].targetId+' targetType='+data.data[x].targetType+' isAllowBuy='+data.data[x].isAllowBuy+' class="seeProduct" src="'+data.data[x].picture+'"><p class="box_cao_title">'+data.data[x].name+'</p><p class="box_cao_price">参考价：<span>¥ '+data.data[x].price+'</span></p><p class="zhongcao zhongcao1">'+data.data[x].seedNum+'</p><p class="goToBuy goToBuy2">去买</p></div></li>');	
					}else{
						$('.tab_tie_cao').append('<li seedProductId='+data.data[x].seedProductId+' targetId='+data.data[x].targetId+' targetType='+data.data[x].targetType+' isAllowBuy='+data.data[x].isAllowBuy+'><div class="box_cao"><img seedProductId='+data.data[x].seedProductId+' targetId='+data.data[x].targetId+' targetType='+data.data[x].targetType+' isAllowBuy='+data.data[x].isAllowBuy+' class="seeProduct" src="'+data.data[x].picture+'"><p class="box_cao_title">'+data.data[x].name+'</p><p class="box_cao_price">参考价：<span>¥ '+data.data[x].price+'</span></p><p class="zhongcao zhongcao2">'+data.data[x].seedNum+'</p><p class="goToBuy goToBuy2">去买</p></div></li>');	
					}
				}
				$('.seeProduct').height($('.seeProduct').width());
			}
			if( data.data.length == size ){
				var tur = true;	
				$(window).scroll(function(){
					var winH = $(window).height(); //浏览器当前窗口可视区域高度  
					var pageH = $(document.body).height(); //浏览器当前窗口文档body的高度 
					var scrollT = $(window).scrollTop(); //滚动条top  
					var lastPersentH = (pageH - winH - scrollT) / winH;  
					if(tur && lastPersentH < 0.001){ 
					setTimeout(function(){
					PageNumCao();
					
					},500);
					tur = false;
				   } 
			   });
			}
		}else{
			alert(data.data.error);	
		}
	});	
}



//页数++
function PageNumTie(){
	var size=10;
	var page_tie = $('body').data('page_tie');//在body里面存储page
	if(page_tie == undefined || parseInt(page_tie) == NaN){
		page_tie = 0;
	}
	page_tie = page_tie + 1;
	$('body').data('page_tie',page_tie);
	getUserPosts(page_tie,size);
}	
//页数++
function PageNumZan(){
	var size=10;
	var page = $('body').data('page');//在body里面存储page
	if(page == undefined || parseInt(page) == NaN){
		page = 0;
	}
	page = page + 1;
	$('body').data('page',page);
	getZanPosts(page,size);
}	
//页数++
function PageNumCao(){
	var size=10;
	var page = $('body').data('page');//在body里面存储page
	if(page == undefined || parseInt(page) == NaN){
		page = 0;
	}
	page = page + 1;
	$('body').data('page',page);
	getCaoPosts(page,size);
}	

//关注按钮点击
$(".attention_btn").live('click',function(){
	 checkAccessTokenLogin(function () {
         var data = getFinalRequestObject({
             accessToken: getAccessToken()
         });
		
		if($(".attention_btn").hasClass("atten1")){
				cancelFollowUser();
				$(".attention_btn").html("关注");
				$(".attention_btn").removeClass("atten1").addClass("atten2");
			}else{
				FollowUser();
				$(".attention_btn").html("已关注");
				$(".attention_btn").removeClass("atten2").addClass("atten1");
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
			getCustomMessage();
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
			getCustomMessage();
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