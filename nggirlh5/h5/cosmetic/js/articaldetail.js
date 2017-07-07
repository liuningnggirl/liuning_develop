var pageSize = 20;
var ua = navigator.userAgent.toLowerCase();	
$(function(){
	var timer = null;
	//alert(getPackageManager());
	if(!isInApp()){
		$(".downLoad").show();
	}
	$(".downLoad .closeTip").click(function(){
		$(".downLoad").hide();
		$(".ad_tops").css("margin-top","7px");
	})
	$(".downLoad .gtload").click(function(){
		//APPCommon.openApp();
		if (navigator.userAgent.match(/android/i)) {
			if(isInWeixin()){
				$(".isWei").css("height",$(window).height());
				$(".isWei").show();
			}else{
				window.location.href='/nggirl/h5/mobile/loadVideo.html?postId='+getParam('postId')+'&postType=1&postTitle='+$(".ad_title").text()+'&v=<%= VERSION %>';
				return false;
			}
		}else{
				window.location.href='/nggirl/h5/mobile/loadVideo.html?postId='+getParam('postId')+'&postType=1&postTitle='+$(".ad_title").text()+'&v=<%= VERSION %>';
				return false;
			}
	})
	$('.forinput').scroll(function(e) {	
	 $("img.lazy").lazyload({effect : "show"});
    });
	
	if($(window).width() == '414'){
		$('.de_box').css('width','71%');
	}else{
		$('.de_box').css('width','70%');
	}
	$("#page_emotion div").delegate('dd','click',function(){
		$("#textarea").val( $("#textarea").val()).focus();
	});
	$("#page_emotion dd").click(function(){
		$("#textarea").val( $("#textarea").val()).focus();
	});
	
	$('.ping_icon').click(function(e) {
		//判断是否有open类
		if($(this).hasClass('open')){
			$(this).removeClass('open');
			$('#page_emotion').attr('style','display:none');
		}else{
			$(this).addClass('open');
			$('#page_emotion').show();
		}
    });
	
	var mnum = 0;
	getarticalmessage();
	//getLoverCount();
	getcommentmessage(0,20);	
	// localStorage.removeItem("showonce");
	if(localStorage.showonce == "" || localStorage.showonce == "null" || localStorage.showonce == undefined ){
		localStorage.showonce = 1;
		$('.gray').fadeIn();
		$('body').css('overflow','hidden').addClass('fixed');
		$('.integral_window').css('margin-top',($(window).height() - $('.integral_window').height())/2);
	}
	//点击活动规则里面的知道了
	$('.btn_ok,.gray').click(function(e) {
        $('.gray').fadeOut();
		$('body').css('overflow','auto').removeClass('fixed');
    });
	$(".de_box .form-control").click(function(){
		//$(".form-control").attr("contenteditable","true");
		//$(this).focus();
	});
	//点击商品跳转到商品详情页
	$(".productDetail").live('click',function(){
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_column_post_seedProduct_view','phoneType=iOS','商品浏览','seedProductId',$(this).attr("seedProductId")]);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_column_post_seedProduct_view','phoneType=and','商品浏览','seedProductId',$(this).attr("seedProductId")]);
		};
		if($(this).attr('isAllowBuy') == 0){
			window.location.href="productDetails.html?seedProductId=" +$(this).attr("seedProductId") +'&targetType='+1+'&targetId='+getParam("postId") +'&v=<%= VERSION %>';	
		}else{
			window.location.href="goodsShareCatenate.html?itemId=" +$(this).attr("seedProductId")+'&v=<%= VERSION %>';	
		}
	});
	//点击跳转到妆品详情页
	$(".workDetails").live('click',function(){
		window.location.href="workDetails.html?workId=" +$(this).attr("workId") +'&v=<%= VERSION %>';	
	});
	//超出两屏出现置顶图标
	$(".forinput").scroll(function(){
		if($(".forinput").scrollTop() > ($(window).height()*2)){
			$(".goToTop").show();
		}else{
			$(".goToTop").hide();
		}
	 });
	$('.goToTop').click(function(){
		$('html,body,.forinput').animate({scrollTop: '0px'}, 100);
		return false;
	});
	//查看更多评论
	$(".goToAllComment").live('click',function(){
		window.location.href="allCommentNew.html?postType=" +1 +'&postId=' +getParam("postId") +'&v=<%= VERSION %>';	
	});
	//跳转到全部评论页
	/*$(".pinglun").live('click',function(){
		 checkAccessTokenLogin(function () {
		   var data = getFinalRequestObject({
			   accessToken: getAccessToken()
		   });
		   window.location.href="allCommentNew.html?postType=" +1 +'&postId=' +getParam("postId") +'&v=<%= VERSION %>';
		},'allCommentNew.html?postType=' +1 +'&postId=' +getParam("postId")+'&v=<%= VERSION %>');
			
	});*/

	//跳转到用户页
	$(".loverCount ul li.lookLoverMessage").live('click',function(){
		window.location.href="myHomePage.html?userId="+ $(this).attr("loverUserId")+'&v=<%= VERSION %>';
	});
	$(".adf_img").live('click',function(){
		window.location.href="myHomePage.html?userId="+ $(this).parent().parent().attr("userId")+'&v=<%= VERSION %>';
	});
	$(".adf_nickname").live('click',function(){
		window.location.href="myHomePage.html?userId="+ $(this).parent().parent().parent().attr("userId")+'&v=<%= VERSION %>';
	});
	//评论人名字点击
	$(".replyUser").live('click',function(){
		window.location.href="myHomePage.html?userId="+ $(this).attr("replyuserid")+'&v=<%= VERSION %>';
		return false;
	});
	$(".replyToUser").live('click',function(){
		window.location.href="myHomePage.html?userId="+ $(this).attr("replyToUserId")+'&v=<%= VERSION %>';
		return false;
	});
	//跳转到标签页
	$(".ad_label .comLabel").live('click',function(){
		window.location.href="label.html?labelName="+ $(this).html()+'&v=<%= VERSION %>';
	});
	$(".ad_label .topicLabel").live('click',function(){
		window.location.href="hotTopicDetail.html?topicId="+ $(this).attr("topicId")+'&v=<%= VERSION %>';
	});
	//跳转到作者页
	$(".dressname .ad_user_name,.ad_imgbox").live('click',function(){
		window.location.href="myHomePage.html?userId="+ $(this).attr("createUserId")+'&v=<%= VERSION %>';
	});
	//设置显示框高度
	$(".forinput").height($(window).height()-51);
	$(".de_box .form-control").live('blur',function(){
		//$(".de_bot").hide(20);
//		$(".ad_btn").show(10);
		$(this).attr("placeholder",$(".form-tip").html());
		if($.trim($(this).val())== ""){
			$('#page_emotion').hide();
			$('.ping_icon').removeClass('open');
			//$(".de_bot").hide();
			//$(".ad_btn").show();
			$(".form-tip").html("请输入评论内容");
			//$(".replymessage").addClass("send_message").removeClass("replymessage");
			//$(".replyinmessage").addClass("send_message").removeClass("replyinmessage");
		};
		//localStorage["a"]= $(this).val();	
	});
	$(".de_box .form-control").focus(function(){
		$(this).attr("placeholder",$(".form-tip").html());
		if($(".de_bot").hasClass("isNoTalks")){
			$(".de_box .form-control").blur();
			$(".isNoTalk,.ad_flbot").show();
			$("body").css("overflow-y","hidden");
			$("body").bind("touchmove",function(event){
				event.preventDefault();
			});
		}
	});
    //点击查看放大图片
	$(".opbgbox").height($(window).height());
	$(".opbgbox").width($(window).width());
	$(".ad_img,.ad_bg").live('click',function(){
		var dels=$(this).attr("src");
		$(".opbginner img").attr("src",dels);
		$(".opbg,.opbginner,.opbginner img").show();
		$("body").height($(window).height())
		$("body").css("overflow","hidden");
		$("body").bind('touchmove',function(event){
			event.preventDefault();
			});
		var num1=$(this).width()/$(this).height();
		var num2=$(window).width()/$(window).height();
		if(num1>num2){
			$(".opbgbox img").css({"height":"auto","width":"100%"});
		}else{
			$(".opbgbox img").css({"height":"100%","width":"auto"});
		};
	})
	$(".opbg ,.opbginner").live('click',function(){
		$("body").unbind('touchmove');
		$(".opbg,.opbginner").hide();
		$(".opbginner img").removeAttr("src");
		$(".opbginner img").removeAttr("style");
		$("body").css("overflow","auto");
	});
	//举报
	
	$(".jubaoBtn").live('click',function(){
		$(".ad_flbot").show();
		$(".ad_flbtn2").show();
	})
	$(".ad_report2").live('click',function(){
		$(".ad_flbot").hide();
		$(".ad_flbtn2").hide();
		var del=$(this);
		checkAccessTokenLogin(function () {
			 var data = getFinalRequestObject({
				 accessToken: getAccessToken()
			 });
			$.ajax({//采用异步
				type: "post",
				url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/report/post/4.0.0',
				data:getFinalRequestObject({accessToken:getAccessToken(),postId:getParam('postId'),postType:1}),
				dataType:"json",
				success: function (data) {
					if(data.code == 0){
						$(".successtips").html("举报成功");
						$(".successtips").fadeIn(100).delay(1500).fadeOut(100);
					}else{
						$(".successtips").html(data.data.error);
						$(".successtips").fadeIn(100).delay(1500).fadeOut(100);
					}
				},
			});
		}, 'articledetail.html' + window.location.search);
		//window.location.href="report.html?postId=" +getParam("postId") +'&postType='+1+'&v=<%= VERSION %>';
	})
	//点击购买
	$('.goToBuy2').die('click');
	$('.goToBuy2').live('click',function(e) {
		var del = $(this);
		var delId = $(this).parent().attr("seedproductId");
		checkAccessTokenLogin(function () {
			if (/iphone|ipad|ipod/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_article_gobuy','phoneType=iOS','去买按钮','seedProductId',delId]);	
			} else if (/android/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_article_gobuy','phoneType=and','去买按钮','seedProductId',delId]);
			};
			//判断如果是在微信打开
			if(isInWeixin()){
				$('.isWei').show();	
			}else{
				$('.isWei').hide();	
				window.location.href = del.attr('urlstr')+'&v=<%= VERSION %>';
			}
		}, 'articledetail.html' + window.location.search);
    });
	
function getParam(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r!=null) return unescape(r[2]); return null;
}
function strIsEmpty(str){
	if(str == undefined || str == null || $.trim(str).length == 0){
		return true;
	}
	return false;
}	
// 从地址栏和本地存储中获取accessToken，地址栏参数优先
function getAccessToken(){
	var accessToken = '';
	var appAccessToken = localStorage.accessToken;
	var queryAccessToken = getParam("accessToken");
	if(!strIsEmpty(appAccessToken) || !strIsEmpty(queryAccessToken) ){
		accessToken = !strIsEmpty(queryAccessToken) ? queryAccessToken:appAccessToken;
	}
	localStorage.accessToken = accessToken;
	return accessToken;
}
//文章详情
function getarticalmessage(){
$.ajax({//采用异步
	type: "get",
	url:'<%= UGC_HOST_API_URL %>/nggirl/app/cli/post/getArticlePostDetail/4.0.0',
	data:getFinalRequestObject({accessToken:getAccessToken(),postId:getParam('postId'),postType:1}),
	timeout:15000,//10s
	dataType:"json",
	success: function (data) {
		var shopNum=0;
		if(data.code == 0){
		var str = "";
		str +='<div class="ad_tops clearfix" postId="'+data.data.postId+'" postType="1">';
		
		str +='<div class="ad_imgbox" createUserId="'+data.data.createUserId+'"><img class="dressimg" src="'+data.data.userProfile+'"/></div><div class="dressname" createUserId="'+data.data.createUserId+'">';
		str +='<span class="ad_user_name" createUserId="'+data.data.createUserId+'">'+data.data.userName+'</span>';
		/*if(data.data.userRole == ''){
			str +='<span class="ad_userrole" style=" border:none;"></span>';
		}else{
			str +='<span class="ad_userrole">'+data.data.userRole+'</span>';
		}*/
		if(data.data.isAttention == 0 && data.data.isMyPost == 0){
			str +='<div class="head_attention atten2">关注</div>';
		}else if(data.data.isAttention == 1 && data.data.isMyPost == 0){
			str +='<div class="head_attention atten1">已关注</div>';
		}
		str +='</div>';

		str +='</div><div class="ad_detail">';
		str +='<div class="ad_det"><p class="ad_title">'+data.data.title+'</p>';
		for(var i = 0;i < data.data.article.length;i++){
			if(data.data.article[i].type== "1"){
				str +='<p class="ad_tit">'+data.data.article[i].content+'</p>';
			}else if(data.data.article[i].type=="2"){
				str +='<p class="ad_pro">'+ParagraphTransHelper(data.data.article[i].content)+'</p>';
			}else if(data.data.article[i].type=="3"){
				str +='<img data-original="'+data.data.article[i].content+'" extend="'+data.data.article[i].extend+'" class="ad_img lazy" />';
			}else if(data.data.article[i].type=="4"){
				str +='<p class="ad_note">'+data.data.article[i].content+'</p>';
			}else if(data.data.article[i].type=="5"){
				shopNum ++;
				var articleGoods=data.data.article[i];
				str +='<div isAllowBuy='+articleGoods.isAllowBuy+' seedProductId='+articleGoods.seedProductId+' class="postShop postShopa productDetail clearfix">';
				str +='<div class="shopLeft"><img src="'+articleGoods.picture+'"></div>';
				str +='<div class="shopCenter"><p>'+articleGoods.name+'</p><p class="productprize1"><span>¥ '+articleGoods.price+'</span></p>';

				str +='</div>';
				str +='<div class="goodsRight" seedProductId='+articleGoods.seedProductId+'>';
				if(articleGoods.isSeed == "0"){
					str +='<p class="zhongcao zhongcao1"></p>';
				}else{
					str +='<p class="zhongcao zhongcao2"></p>';
				}
				str +='</div></div>';
			}else if(data.data.article[i].type=="6"){
				var articleGoods=data.data.article[i];
				str +='<div isAllowBuy='+articleGoods.isAllowBuy+' workId='+articleGoods.workId+' class="postShop postShopa  workDetails clearfix">';
				str +='<div class="shopLeft"><img src="'+articleGoods.workPhoto+'"></div>';
				str +='<div class="shopCenter"><p class="workName">'+articleGoods.workName+'</p>';
				if(articleGoods.workPrice == "0"){
					str +='<p class="productprize"><span>¥ '+articleGoods.workCost+'</span></p></div>';
				}else{
					str +='<p class="productprize"><span>¥ '+articleGoods.workPrice+'</span><span class="oldCost">¥ '+articleGoods.workCost+'</span></p></div>';
				}
				str +='<div class="shopRight workRight">';
				str +='<span class="workDetail" workId='+articleGoods.workId+'><img src="images/order-arr-right_03.png"></span>';
				if(articleGoods.workIsCollected == "0"){
					str +='<p class="z-kinds zhongcao1">收藏</p>';
				}else{
					str +='<p class="z-kinds zhongcao2">已收藏</p>';
				}
				str +='<p class="zhongcaonum"><span>'+articleGoods.collectNum+'</span>人已收藏</p></div></div>';
			};		
		};
		str +='</div>';
		if(data.data.labels.length>0 && data.data.labels !=""){
			str +='<p class="ad_label">';
			for( var t=0;t<data.data.labels.length;t++){
				str +='<span class="comLabel">';
				str += data.data.labels[t];
				str +='</span>';
			}
			for( var n=0;n<data.data.topics.length;n++){
				str +='<span class="topicLabel" topicId="'+data.data.topics[n].topicId+'">';
				str += data.data.topics[n].name;
				str +='</span>';
			}
			str +='</p>';
		}
		str +='<div class="view_detail"><span class="sendtime">'+getLocalTime(data.data.createTime)+'</span><div class="flRight">';
		if(data.data.commentNum > 9999){//评论条数
			str +='<span class="commentnum">9999+</span>';
		}else{
			str +='<span class="commentnum">'+data.data.commentNum+'</span>';
		}
		if(data.data.viewNum > 9999){//浏览量
			str +='<span class="viewnum">9999+</span>';
		}else{
			str +='<span class="viewnum">'+data.data.viewNum+'</span>';
		}
		
		if(data.data.loverCount > 9999){//xihuan
			str +='<span class="lovenum">9999+</span>';
		}else{
			str +='<span class="lovenum">'+data.data.loverCount+'</span>';
		}
		str +='<span class="jubaoBtn"><img src="images/more.png"></span>';
		str +='</div></div>';
		$(".ad_btn").attr("postId",data.data.postId);
		if(data.data.isPraised==1){
			$(".Praised").addClass("Praised1");
			$(".Praised").attr('isPraised',0);
		}else{
			$(".Praised").attr('isPraised',1);
		}
		if(data.data.isCollected==1){
			$(".Collected").addClass("Collected1");
			$(".Collected").attr('isCollected',0);
		}else{
			$(".Collected").attr('isCollected',1);
		}
		str +='</div>';	
		$(".ad_content").append(str);
		$(".adbgbox").height($(".adbgbox").width()*2/3);
		if(data.data.isNoTalk == 1){
			$(".de_bot").addClass("isNoTalks");
			$(".talkTime").html(data.data.noTalkTime);
		}
		$(".lookGoods").text(shopNum);
		// myScroll.refresh();
		//微信分享
		if(isInWeixin()){
			var title = '【南瓜姑娘】'+data.data.columnName+'-'+data.data.title;
			var desc = data.data.shareContent;
			var link = window.location.href;
			var imgUrl = data.data.detailImg;
			var from = getParam('apptype');
			if(!strIsEmpty(from) && from == 'appb'){
				desc = data.data.shareContent;
			}
			weixinConfig(title,desc,link,imgUrl);
		}
			
		//h5,app同步分享内容
		if(isInApp()){
			window.shareTitle = '【南瓜姑娘】'+data.data.columnName+'-'+data.data.title;
			window.shareContent = data.data.shareContent;
			window.sharePicture = data.data.detailImg;
			window.shareUrl = window.location.href;
		};
		//给安卓传值
		if(typeof(window.ngjsInterface)!="undefined" && typeof(window.ngjsInterface.conFigShareInfo)!="undefined"){
			window.ngjsInterface.conFigShareInfo('【南瓜姑娘】'+data.data.columnName+'-'+data.data.title, data.data.shareContent,data.data.detailImg,window.location.href);
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
};
//喜欢详情
/*function getLoverCount(){
$.ajax({//采用异步
	type: "get",
	url:'<%= UGC_HOST_API_URL %>/nggirl/app/cli/post/getArticlePostDetail/4.0.0',
	data:getFinalRequestObject({accessToken:getAccessToken(),postId:getParam('postId'),postType:1,isCountViewNum:0}),
	timeout:15000,//10s
	dataType:"json",
	success: function (data) {
		if(data.code == 0){
			//喜欢
			$(".loverCount ul").children().remove();
			if(data.data.loverCount !="0"){
				$(".loverCount").show();
				$(".loverCount h3 span").html(data.data.loverCount);
				if(data.data.lovers.length>7){
					for(var i = 0;i < 6;i++){
						$(".loverCount ul").append('<li loverUserId='+data.data.lovers[i].loverUserId+' class="lookLoverMessage"><div class="loverbox"><img src="'+data.data.lovers[i].loverProfile+'"></div></li>');
					}
					$(".loverCount ul").append('<li><div><img src="images/lookmore.png" class="lookmore"></div></li>');
				}else{
					for(var i = 0;i < data.data.lovers.length;i++){
						$(".loverCount ul").append('<li loverUserId='+data.data.lovers[i].loverUserId+' class="lookLoverMessage"><div><img src="'+data.data.lovers[i].loverProfile+'"></div></li>');	
					}
				}
			}else{
				$(".loverCount").hide();
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
}*/
//评论详情
function getcommentmessage(pageNum,pageSize){
	$.ajax({//采用异步
		type: "get",
		url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/post/getComments/2.4.2',
		data:getFinalRequestObject({accessToken:getAccessToken(),postId:getParam('postId'),postType:1,page:pageNum,num:pageSize,queryTime:$(".ad_comdet").attr("queryTime")}),
		timeout:15000,//10s
		dataType:"json",
		success: function (data) {
			if(data.code == 0){
				$(".ad_comdet").attr("queryTime",data.data.queryTime);
			var str1 = "";
			var floors=data.data.comments.length>5?5:data.data.comments.length;
			for(var i = 0;i < floors;i++){
				str1 +='<div class="ad_floor" userId="'+data.data.comments[i].userId+'" commentId="'+data.data.comments[i].commentId+'" floor="'+data.data.comments[i].floorNum+'"  >';
				str1 +='<div class="adf_det clearfix">';
				str1 +='<div class="adf_img " ><img src="'+data.data.comments[i].profile+'"></div>';
				str1 +='<div class="adf_name"><span class="adf_nickname">'+data.data.comments[i].nickName+'</span><p class="ad_fnum"><span>'+data.data.comments[i].floorNum+'楼</span>'+getLocalTime(data.data.comments[i].commentTime)+'</p></div>';
				str1 +='<div class="adf_btn">';
				/*添加评乱点赞*/
				if(data.data.comments[i].isPraised=="0"){
					str1 +='<span class="comleftz" status="1" commentId="'+data.data.comments[i].commentId+'"><img src="images/zanqian.png" class="co_dianzan">';
					if(data.data.comments[i].praiseCount>999){
						str1 +='<b class="zq_count">999+</b></span>';
					}else{
						str1 +='<b class="zq_count">'+data.data.comments[i].praiseCount+'</b></span>';
					}
				}else{
					str1 +='<span class="comleftz" status="0"  commentId="'+data.data.comments[i].commentId+'"><img src="images/zanhou.png" class="qx_dianzan">';
					if(data.data.comments[i].praiseCount>999){
						str1 +='<b class="zh_count">999+</b></span>';
					}else{
						str1 +='<b class="zh_count">'+data.data.comments[i].praiseCount+'</b></span>';
					}
				}
				str1 +='<span class="comleft"><img src="images/commentnum.png" class="ad_gtcom"></span>';
				str1 +='</div></div>';
				/*if(data.data.comments[i].isMyComment=="1"){
					str1 +='<span class="comright ad_morea"><img src="images/moregreen.png" class="ad_more "></span></div></div>';
				}else{
					str1 +='<span class="comright ad_moreb"><img src="images/moregreen.png" class="ad_more "></span></div></div>';
					}*/
				if(data.data.comments[i].isMyComment=="1"){
					str1 +='<div class="adf_comdetail ad_morea" replyType="1">';
				}else{
					str1 +='<div class="adf_comdetail ad_moreb" replyType="1">';
				}
				if(data.data.comments[i].isIllegal=="0"){
					str1 +=getImgUrl(htmlEscape(data.data.comments[i].comment))+'</div>';
				}else{
					str1 +='!@#$%^&*()</div>';
					}
				str1 +='<div class="adf_reply">';
				if(data.data.comments[i].replies.length>0){
				
				for(var j = 0;j < data.data.comments[i].replies.length;j++){
					if(j == 0){
						str1 +='<img src="images/Triangular.png" class="arr"><div class="first"></div>';
					}
					if(j<2){
						if(data.data.comments[i].replies[j].isMyReply==1){
							str1 +='<div replyId="'+ data.data.comments[i].replies[j].replyId+'" isMyReply="'+data.data.comments[i].replies[j].isMyReply+'" replyType="2" class="adf_dis">';
						}else{
							str1 +='<div replyId="'+ data.data.comments[i].replies[j].replyId+'" isMyReply="'+data.data.comments[i].replies[j].isMyReply+'" replyType="2" class="adf_replys">';
						}
					}else{
						if(data.data.comments[i].replies[j].isMyReply==1){
							str1 +='<div replyId="'+ data.data.comments[i].replies[j].replyId+'" isMyReply="'+data.data.comments[i].replies[j].isMyReply+'" replyType="2" class="adf_dis hidden">';
						}else{
							str1 +='<div replyId="'+ data.data.comments[i].replies[j].replyId+'" isMyReply="'+data.data.comments[i].replies[j].isMyReply+'" replyType="2" class="adf_replys hidden">';
						}
					}
					
					str1 +='<span replyUserId="'+data.data.comments[i].replies[j].replyUserId+'" class="replyUser infloor">'+data.data.comments[i].replies[j].replyUserNickName+'</span>';
					if(data.data.comments[i].replies[j].replyType=="1"){
						if(data.data.comments[i].replies[j].isIllegal=="0"){
							str1 += ':<span class="replyDetail">'+getImgUrl(data.data.comments[i].replies[j].reply) +'</span>';
						}else{
							str1 += ':!@#$%^&*()';
						}
					}else{
						str1 += '回复<span replyToUserId="'+data.data.comments[i].replies[j].replyToUserId+'" class="replyToUser">'+data.data.comments[i].replies[j].replyToUserNickName+'</span>';
						if(data.data.comments[i].replies[j].isIllegal=="0"){
							str1 += ':<span class="replyDetail">'+getImgUrl(data.data.comments[i].replies[j].reply) +'</span>';
						}else{
							str1 += ':!@#$%^&*()';
						}
					}
					str1 += '</div>';//<p class="adf_time">'+getLocalTime(data.data.comments[i].replies[j].replyTime)+'</p>
					
				}
				if(data.data.comments[i].replies.length>2){
						str1 += '<div class="lookAllRep">共'+data.data.comments[i].replies.length+'条回复 ></div>';
					}
				}
				str1 +='</div>';
				str1 +='</div>';
				}
			if(data.data.comments.length== "0"  && pageNum == 0){
				str1 +='<div class="nonecom"><img src="images/pingjia.png" /><p>暂无评论<br>等你来抢沙发~</p></div>';
			}else{
				$(".ad_comment").append('<p class="postMore"><span class="goToAllComment">查看全部评论</span></p>');
			}
			$(".ad_comdet").append(str1);
			
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
function getMorecomment(){
	var pageNum = $('body').data('pageNum');
	if(pageNum == undefined || parseInt(pageNum) == NaN){
		pageNum = 0;
	}
	pageNum = pageNum + 1;
	$('body').data('pageNum',pageNum);
	getcommentmessage(pageNum,pageSize);
};
//展开全部子评论
$(".lookAllRep").live('click',function(){
	$(this).siblings(".hidden").removeClass("hidden");
	$(this).html("收起").removeClass("lookAllRep").addClass("stopRep");
	$(this).css("padding-bottom","7px");
});
//收起评论
$(".stopRep").live('click',function(){
	$(this).parent().children(":gt(3)").addClass("hidden");
	var i=$(this).parent().children().length-3;
	$(this).show().removeClass("stopRep").addClass("lookAllRep");
	$(this).html("共"+i+"条回复 >").css("padding-bottom","7px");
});
//点击评论按钮
$(".ad_btn .toCom").live('click',function(){
	checkAccessTokenLogin(function () {
		$(".ad_flbot").hide();
		$(".ad_flbtn").hide();
		var del=$(this);
		$(".form-tip").html("请输入评论内容");
		$(".form-control").attr("placeholder","请输入评论内容");
		$("#send_message").removeClass().addClass("send_message");
		$(".de_bot").show();
		$(".ad_btn").hide();
		$(".form-control").focus();
		}, 'articledetail.html' + window.location.search);
	
})
//评论帖子
$(".send_message").live('click',function(){
	$('.page_emotion').hide();
	$('.ping_icon').removeClass('open');
	if($.trim($(".form-control").val()).length > 10){
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_column_post_article_comment','phoneType=iOS','文章评论','postId',getParam('postId')]);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_column_post_article_comment','phoneType=and','文章评论','postId',getParam('postId')]);
		};
		$(".form-control").blur();
		commentinfo();
		
		//localStorage["a"]= "";
	}else{
		$(".ad_flbot").delay(500).fadeIn(100).fadeOut(1900);
		$(".successtips").html("亲亲要写10个汉字以上哟~");
		$(".successtips").delay(500).fadeIn(100).fadeOut(1900);
	};
});
//评论帖子
function commentinfo(){
	$.ajax({//采用异步
	type: "post",
	url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/post/comment/2.5.3',
	data:getFinalRequestObject({accessToken:getAccessToken(),postId:getParam('postId'),postType:getParam('postType'),content:eraseStyleInCopyText($(".form-control").val())}),
	timeout:15000,//10s
	dataType:"json",
	beforeSend:function(){
		$(".send_message").off("click"); //解绑事件，用户在次点击在未返回数据时候，提交按钮不起作用
		$(".send_message").removeClass("send_message");//在请求发送之后，清空input，即使当时看不到结果，再次输入提交时，也是属于第二次评论了
	},
	success: function (data) {
		if(data.code == 0){
			$("#send_message").addClass("send_message");
			var floors="";
			if($(".ad_comdet").children(".ad_floor").length == 0){
			    floors=1;
			}else{
				floors=parseInt($(".ad_comdet").children(".ad_floor:eq(0)").attr("floor"))+1;
				} 
			var str2 = "";
			str2 +='<div class="ad_floor" userId="'+data.data.userId+'" commentId="'+data.data.commentId+'" floor= "'+floors+'" >';
			str2 +='<div class="adf_det clearfix">';
			str2 +='<div class="adf_img " ><img src="'+data.data.profile+'"></div>';
			str2 +='<div class="adf_name"><p class="adf_nickname">'+data.data.nickName+'</p><p class="ad_fnum"><span>'+floors+'楼</span>'+getLocalTime(data.data.commentTime)+'</p></div>';
			str2 +='<div class="adf_btn">';
			str2 +='<span class="comleftz" status="1" commentId="'+data.data.commentId+'"><img src="images/zanqian.png" class="co_dianzan">';
			str2 +='<b class="zq_count">0</b></span>';
			str2 +='<span class="comleft"><img src="images/commentnum.png" class="ad_gtcom"></span>';
			str2 +='</div></div>';
			if(data.data.isIllegal=="0"){
			str2 +='<div class="adf_comdetail ad_morea" replyType="1">'+getImgUrl(data.data.comment)+'</div>';
			}else{
				str2 +='<div class="adf_comdetail ad_morea">!@#$%^&*()</div>';
				}
			str2 +='<div class="adf_reply"></div>';
			str2 +='</div>';
			
		$(".ad_comdet").prepend(str2);
		$(".form-control").attr("placeholder","请输入评论内容");
		$(".form-control").val("").css("height","19px");;
		$(".ad_flbot").delay(500).fadeIn(100).fadeOut(1900);
		$(".successtips").html("评论成功");
		$(".successtips").delay(500).fadeIn(100).fadeOut(1900);
		$(".nonecom").remove();
		//localStorage["a"] == "";
		if(data.data.addScore != "0"){
			alertNewScore("积分 +"+data.data.addScore);
			//$(".send_message").bind("click",commentinfo);
		}
		$(".de_bot").hide();
		$(".ad_btn").show();
		}else{
			alert(data.data.error);	
		}
	},
	error: function (XMLHttpRequest, textStatus, errorThrown) {
		//console.log( XMLHttpRequest )
		//$(".main").html("尚未发布任何信息！");
		//$(".send_message").bind("click",commentinfo);  //无论返回数据成功或者失败，都会给提交按钮添加绑定事件
	}
	});
}
//回复评论
$(".adf_comdetail").live('click',function(){
	var del=$(this);
	$(this).parents(".ad_floor").addClass("oncom").siblings().removeClass("oncom");	
	$(".oncom").attr("replyType",$(this).attr("replyType"));
	
});
/*//发布人点击...
$(".adf_btn .ad_morea").live('click',function(){
	$(".ad_flbot").show();
	$(".ad_flbtn").show();
	$(".ad_flbtn .ad_report").hide();
	$(".ad_flbtn .ad_delinner").hide();
	$(this).parent().parent().parent().addClass("readydelthis").siblings().removeClass("readydelthis");
})
//非发布人点击...
$(".adf_btn .ad_moreb").live('click',function(){
	checkAccessTokenLogin(function () {
		$(".ad_flbot").show();
		$(".ad_flbtn").show();
		$(".ad_flbtn .ad_aelbtn").hide();
		$(".ad_flbtn .ad_delinner").hide();
	},'videoDeatil.html?postType=' +getParam('postType') +'&postId='+getParam('postId')+'&v=<%= VERSION %>');
	$(this).parent().parent().siblings().children().removeClass("reportthis");
	$(this).parent().parent().parent().addClass("reportthis").siblings().removeClass("reportthis");
	$(this).parent().parent().parent().siblings().children("adf_reply").children().removeClass("reportthis");
	$(this).parent().parent().parent().attr("targetType","1");
	$(this).parent().parent().parent().attr("targetId",$(this).parent().parent().parent().attr("commentid"));
});*/
$(".clickReplay").live('click',function(){
	$(".ad_flbot").hide();
	$(".ad_flbtn").hide();
	var del=$(this);
	$(".form-tip").html("回复层主");
	$(".form-control").attr("placeholder","回复层主");
	$("#send_message").removeClass().addClass("replymessage");
	$(".de_bot").show();
	$(".ad_btn").hide();
	$(".form-control").focus();
});

$(".ad_gtcom").live('click',function(){
	checkAccessTokenLogin(function () {
		var del=$(this);
		$(this).parents(".ad_floor").addClass("oncom").siblings().removeClass("oncom");
		$(".form-tip").html("回复层主");
		$("#send_message").removeClass().addClass("replymessage");
		$(".de_bot").show();
		$(".ad_btn").hide();
		$(".form-control").focus();
		$(".oncom").attr("replyType","1");
		if($(".de_bot").hasClass("isNoTalks")){
			$(".isNoTalk,.ad_flbot").show();
		};
	}, 'articledetail.html' + window.location.search);
});
$(".replymessage").live('click',function(){
	$('#page_emotion').hide();
	$('.ping_icon').removeClass('open');
	if($.trim($(".form-control").val()) !=""){
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_column_post_article_comment','phoneType=iOS','文章评论','postId',$(".ad_tops").attr('postId')]);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_column_post_article_comment','phoneType=and','文章评论','postId',$(".ad_tops").attr('postId')]);
		};
		replycommentinfo();
		$(".de_bot").hide();
		$(".ad_btn").show();
		$("#send_message").removeClass("replymessage").addClass("send_message");
		//localStorage["a"]= "";
	};
});
//回复层中层
$(".adf_replys").live('click',function(){
	$(".ad_flbot").show();
	$(".ad_flbtn1").show();
	var del=$(this);
	del.parent(".adf_reply").parents(".ad_floor").addClass("oncom").siblings().removeClass("oncom");
	del.addClass("incom").siblings().removeClass("incom");
	del.parent(".adf_reply").parent(".ad_floor").siblings().children().children().removeClass("incom");
	var str=del.children(".infloor").html();
	$(".form-tip").html("回复"+str)
	$(".oncom").attr("replyType",del.attr("replyType"));
	del.addClass("reportthis").parent(".adf_reply").parents(".ad_floor").removeClass("reportthis");
	del.siblings().removeClass("reportthis");
	del.parent(".adf_reply").parents(".ad_floor").siblings().removeClass("reportthis");
	del.parent(".adf_reply").parents(".ad_floor").siblings().children(".adf_reply").children().removeClass("reportthis");
	del.attr("targetType","2");
	del.attr("targetId",del.attr("replyid"));
});
//非本人点击层中层的回复
$(".ad_replay1").live('click',function(){
	checkAccessTokenLogin(function () {
		$(".ad_flbot,.ad_flbtn1").hide();
		$(".form-control").attr("placeholder",$(".form-tip").html());
		$(".de_bot").show();
		$(".ad_btn").hide();
		$(".form-control").focus().val(localStorage["a"]);
		$("#send_message").removeClass().addClass("replyinmessage");
		}, 'articledetail.html' + window.location.search);
});
$(".replyinmessage").live('click',function(){
	$('.page_emotion').hide();
	$('.ping_icon').removeClass('open');
	if($.trim($(".form-control").val()) !=""){
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_column_post_article_comment','phoneType=iOS','文章评论','postId',$(".ad_tops").attr('postId')]);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_column_post_article_comment','phoneType=and','文章评论','postId',$(".ad_tops").attr('postId')]);
		};
		replycommentinfo();
		$(".de_bot").hide();
		$(".ad_btn").show();
		$("#send_message").removeClass("replyinmessage").addClass("send_message");
		$(".form-tip").html("请输入评论内容");
		//localStorage["a"]= "";
	};
});
function replycommentinfo(){
	$.ajax({//采用异步
	type: "post",
	url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/post/reply/2.5.3',
	data:getFinalRequestObject({accessToken:getAccessToken(),replyType:$(".oncom").attr("replyType"),commentId:$(".oncom").attr("commentid"),replyId:$(".incom").attr("replyId"),content:eraseStyleInCopyText($(".form-control").val())}),
	timeout:15000,//10s
	dataType:"json",
	success: function (data) {
		if(data.code == 0){
				$(".oncom").children(".adf_reply").children(".hidden").removeClass("hidden");
				$(".oncom").children(".adf_reply").children(".lookAllRep").remove();
				$(".oncom").children(".adf_reply").children(".stopRep").remove();
				var str4="";
				if($(".oncom .adf_reply").children().length == 0){
					str4 +='<img src="images/Triangular.png" class="arr"><div class="first"></div>';
					str4 +='<div replyId="'+ data.data.replyId+'" isMyReply="'+data.data.sMyReply+'" replyType="'+ data.data.replyType+'" class="adf_dis ">';
				}else{
					str4 +='<div replyId="'+ data.data.replyId+'" isMyReply="1" replyType="'+ data.data.replyType+'" class="adf_dis">';
				}
				str4 +='<span replyUserId="'+data.data.replyUserId+'" class="replyUser infloor">'+data.data.replyUserNickName+'</span>';
				if(data.data.replyType=="1"){
					if(data.data.isIllegal=="0"){
						str4 +=':<span class="replyDetail">'+getImgUrl(data.data.reply) +'</span>';
					}else{
						str4 += ':!@#$%^&*()';
					}
				}else{
					str4 += '回复<span replyToUserId="'+data.data.replyToUserId+'" class="replyToUser">'+data.data.replyToUserNickName+':</span>';
					if(data.data.isIllegal=="0"){
						str4 += '<span class="replyDetail">'+getImgUrl(data.data.reply) +'</span>';
					}else{
						str4 += '!@#$%^&*()';
					}
				}
				str4 += '</div>';//<p class="adf_time">'+getLocalTime(data.data.replyTime)+'</p>
				if($(".oncom .adf_reply").children().length>3){
					str4 +='<div class="stopRep">收起</div>';
				}
				$(".oncom .adf_reply").append(str4);
				$(".form-control").val("");
				$(".form-control").blur();
				$(".form-control").attr("placeholder","请输入评论内容");
				$(".ad_flbot").delay(500).fadeIn(100).fadeOut(1900);
				$(".successtips").html("评论成功");
				$(".successtips").delay(500).fadeIn(100).fadeOut(1900);
				//localStorage["a"]= "";
				if(data.data.addScore != "0" && data.data.addScore != undefined){
					alertNewScore("积分 +"+data.data.addScore);
				}
				$(".oncom .adf_reply div:last-child").css("padding-bottom","7px");
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
//为文章点赞与取消点赞
$(".ad_btn .Praised").live('click',function(){
	var del=$(this);
    checkAccessTokenLogin(function () {
         var data = getFinalRequestObject({
             accessToken: getAccessToken()
         });
		$.ajax({//采用异步
			type: "post",
			url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/column/praisePost/2.5.3',
			data:getFinalRequestObject({accessToken:getAccessToken(),postId:del.parent().parent().attr("postid"),postType:1,flag:del.attr("isPraised")}),
			dataType:"json",
			success: function (data) {
				if(data.code == 0){
					if(del.attr("isPraised")== "0"){
						del.attr("isPraised","1");
						del.removeClass("Praised1");
						//getLoverCount();
					}else{
						del.addClass("Praised1");
						del.attr("isPraised","0");
						//getLoverCount();
						if (/iphone|ipad|ipod/.test(ua)) {
							_czc.push(['_trackEvent','nggirl_column_post_article_praise','phoneType=iOS','文章点赞','postId',$(".ad_tops").attr('postId')]);	
						} else if (/android/.test(ua)) {
							_czc.push(['_trackEvent','nggirl_column_post_article_praise','phoneType=and','文章点赞','postId',$(".ad_tops").attr('postId')]);
						};
						if(data.data.addScore != "0" && data.data.addScore != undefined){
							alertNewScore("积分 +"+data.data.addScore);
						}
					}
				}else{
					alert(data.data.error);	
				}
			},
		});
		}, 'articledetail.html' + window.location.search);
})
//文章--收藏、取消收藏
$(".ad_btn .Collected").live('click',function(){
	var del=$(this);
	checkAccessTokenLogin(function () {
		 var data = getFinalRequestObject({
			 accessToken: getAccessToken()
		 });
		$.ajax({//采用异步
		type: "post",
		url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/column/collectPost/2.5.3',
		data:getFinalRequestObject({accessToken:getAccessToken(),postId:del.parent().parent().attr("postid"),postType:1,flag:del.attr("isCollected")}),
		dataType:"json",
		success: function (data) {
			if(data.code == 0){
				if(del.attr("isCollected")== "0"){
					del.attr("isCollected","1");
					del.removeClass("Collected1");
				}else{
					del.addClass("Collected1");
					del.attr("isCollected","0");
					if (/iphone|ipad|ipod/.test(ua)) {
						_czc.push(['_trackEvent','nggirl_column_post_article_collect','phoneType=iOS','文章收藏','postId',$(".ad_tops").attr('postId')]);	
					} else if (/android/.test(ua)) {
						_czc.push(['_trackEvent','nggirl_column_post_article_collect','phoneType=and','文章收藏','postId',$(".ad_tops").attr('postId')]);
					};
					if(data.data.addScore != "0" && data.data.addScore != undefined){
						alertNewScore("积分 +"+data.data.addScore);
					}
				}
			}else{
				alert(data.data.error);	
			}
		},
	});
	}, 'articledetail.html' + window.location.search);
});
//查看全部商品
$(".ad_btn .lookGoods").live('click',function(){
	if (/iphone|ipad|ipod/.test(ua)) {
		_czc.push(['_trackEvent','nggirl_column_post_article_relevant_product','phoneType=iOS','点击往期商品按钮','true','']);	
	} else if (/android/.test(ua)) {
		_czc.push(['_trackEvent','nggirl_column_post_article_relevant_product','phoneType=and','点击往期商品按钮','true','']);
	};
	window.location.href="goodsList.html?postId=" +getParam("postId") +'&postType='+1+'&v=<%= VERSION %>';	
});
//为评论点赞与取消点赞
$(".adf_btn .comleftz").live('click',function(){
	var del=$(this);
    checkAccessTokenLogin(function () {
         var data = getFinalRequestObject({
             accessToken: getAccessToken()
         });
		$.ajax({//采用异步
			type: "post",
			url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/post/praiseComment/2.5.3',
			data:getFinalRequestObject({accessToken:getAccessToken(),commentId:del.attr("commentid"),status:del.attr("status")}),
			dataType:"json",
			success: function (data) {
				if(data.code == 0){
					if(del.attr("status") == "0"){
						del.attr("status","1");
						del.children("img").attr('src','images/zanqian.png');
						del.children("b").text(parseInt(del.children("b").text())-1);
						del.children("b").css('color','#9a9a9a');
					}else{
						del.attr("status","0");
						del.children("img").attr('src','images/zanhou.png');
						del.children("b").text(parseInt(del.children("b").text())+1);
						del.children("b").css('color','#ee750c');
						if(data.data.addScore != "0" && data.data.addScore != undefined){
							alertNewScore("积分 +"+data.data.addScore);
						}
					}
				}else{
					alert(data.data.error);	
				}
			},
		});
		}, 'articledetail.html' + window.location.search);
	
});
//发布人点击...
$(".ad_floor .ad_morea").live('click',function(){
	$(".ad_flbot").show();
	$(".ad_flbtn").show();
	$(".ad_flbtn .clickReplay").show();
	$(".ad_flbtn .ad_report").hide();
	$(".ad_flbtn .ad_delinner").hide();
	$(".ad_flbtn .ad_aelbtn").show();
	
	$(this).parent().addClass("readydelthis").siblings().removeClass("readydelthis");
});
//非发布人点击...
$(".ad_floor .ad_moreb").live('click',function(){
	checkAccessTokenLogin(function () {
		$(".ad_flbot").show();
		$(".ad_flbtn").show();
		$(".ad_flbtn .clickReplay").show();
		$(".ad_flbtn .ad_report").show();
		$(".ad_flbtn .ad_aelbtn").hide();
		$(".ad_flbtn .ad_delinner").hide();
	},'articledetail.html?postType=' +getParam('postType') +'&postId='+getParam('postId')+'&v=<%= VERSION %>');
	$(".reportthis").removeClass("reportthis");
	//$(this).parent().siblings().children().removeClass("reportthis");
	$(this).parent().addClass("reportthis")//.siblings().removeClass("reportthis");
	//$(this).parent().siblings().children("adf_reply").children().removeClass("reportthis");
	$(this).parent().attr("targetType","1");
	$(this).parent().attr("targetId",$(this).parent().attr("commentid"))
});
//点击取消按钮
$(".ad_flbot,.ad_clobtn").live('click',function(){
	$(".ad_flbot").hide();
	$(".ad_flbtn,.ad_flbtn1,.ad_flbtn2").hide();
	$(".ad_flbtn .ad_report").show();
	$(".ad_flbtn .ad_aelbtn").show();
	$(".ad_flbtn .ad_delinner").show();
	$(".ad_sure").hide();
	$(".isNoTalk").hide();
	$(".form-tip").html("请输入评论内容");
	$("body").css("overflow-y","visible");
	$("body").unbind("touchmove");
});	
//点击自己评论的内容
$(".adf_dis").live('click',function(){
	$(".ad_flbot").show();
	$(".ad_flbtn").show();
	$(".ad_flbtn .ad_delinner").show();
	$(".ad_flbtn .clickReplay").hide();
	$(".ad_flbtn .ad_report").hide();
	$(".ad_flbtn .ad_aelbtn").hide();
	
	$(".adf_dis").removeClass("delthis");
	$(this).addClass("delthis");
});
//点击删除楼层的按钮
$(".ad_aelbtn ").live('click',function(){
	$(".ad_flbot").show();
	$(".ad_flbtn").hide();
	$(".ad_flbtn .ad_report").show();
	$(".ad_flbtn .ad_delinner").show();
	$(".ad_tcbox").show();
});
$(".ad_suredel").live('click',function(){
	$.ajax({//采用异步
	type: "post",
	url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/post/deleteComment/2.0.0',
	data:getFinalRequestObject({accessToken:getAccessToken(),commentId:$(".readydelthis").attr("commentId")}),
	timeout:15000,//10s
	dataType:"json",
	success: function (data) {
		if(data.code == 0){
		$(".ad_flbot").fadeOut(2000);
		$(".ad_flbtn .ad_report").show();
		$(".ad_flbtn .ad_aelbtn").show();
		$(".ad_flbtn .ad_delinner").show();
		$(".ad_tcbox").hide();
		$(".readydelthis").remove();
		$(".successtips").html("删除成功");
		$(".successtips").fadeIn(100).fadeOut(1900);
		if($(".ad_comdet").children().length == 0){
			var str0 = "";
			str0 +='<div class="nonecom" ><img src="images/noappraise.png" /><p>暂无评论<br>等你来抢沙发~</p></div>';
			$(".ad_comdet").append(str0);
			$(".postMore").remove();
			};
		}else{
			alert(data.data.error);	
		}
	},
	error: function (XMLHttpRequest, textStatus, errorThrown) {
	}
	});
});
//点击弹窗里的取消按钮
$(".ad_notsure").live('click',function(){
	$(".ad_flbot").hide();
	$(".ad_flbtn").hide();
	$(".ad_flbtn .ad_report").show();
	$(".ad_flbtn .ad_aelbtn").show();
	$(".ad_sure").hide();
});
//删除回复按钮
$(".ad_delinner").live('click',function(){
	$(".ad_flbot").show();
	$(".ad_flbtn").hide();
	$(".ad_flbtn .ad_report").show();
	$(".ad_flbtn .ad_aelbtn").show();
	$(".ad_tcbox1").show();
});
$(".adin_suredel").live('click',function(){
	$.ajax({//采用异步
	type: "post",
	url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/post/deleteReply/2.0.0',
	data:getFinalRequestObject({accessToken:getAccessToken(),replyId:$(".delthis").attr("replyId")}),
	timeout:15000,//10s
	dataType:"json",
	success: function (data) {
		if(data.code == 0){
			$(".ad_flbot").fadeOut(2000);
			$(".ad_flbtn .ad_report").show();
			$(".ad_flbtn .ad_aelbtn").show();
			$(".ad_flbtn .ad_delinner").show();
			$(".ad_sure").hide();
			if($(".delthis").parent().children().length == 3){
				$(".delthis").parent().empty();
			}else{
				$(".delthis").remove();
			}
			$(".successtips").html("删除成功");
			$(".successtips").fadeIn(100).fadeOut(1900);
		}else{
			alert(data.data.error);	
		}
	},
	error: function (XMLHttpRequest, textStatus, errorThrown) {
	}
	});
});
//点击举报按钮
$(".ad_report,.ad_report1").live('click',function(){
	checkAccessTokenLogin(function () {
	$(".form-tip").html("请输入评论内容");
	$(".ad_flbot").show();
	$(".ad_flbtn,.ad_flbtn1").hide();
	$(".ad_flbtn .ad_report").show();
	$(".ad_flbtn .ad_aelbtn").show();
	$(".ad_tcbox2").show();
	}, 'articledetail.html' + window.location.search);
});
$(".ad_surereport").live('click',function(){
	$.ajax({//采用异步
	type: "post",
	url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/post/report/2.0.0',
	data:getFinalRequestObject({accessToken:getAccessToken(),targetType:$(".reportthis").attr("targetType"),targetId:$(".reportthis").attr("targetId")}),
	timeout:15000,//10s
	dataType:"json",
	success: function (data) {
		if(data.code == 0){
			$(".ad_flbot").fadeOut(2000);
			$(".ad_flbtn .ad_report").show();
			$(".ad_flbtn .ad_aelbtn").show();
			$(".ad_flbtn .ad_delinner").show();
			$(".ad_sure").hide();
			$(".delthis").remove();
			$(".successtips").html("举报成功");
			$(".successtips").fadeIn(100).fadeOut(1900);
		}else if(data.data.error=="您已经举报过了"){
				$(".ad_flbot").fadeOut(2000);
				$(".ad_flbtn .ad_report").show();
				$(".ad_flbtn .ad_aelbtn").show();
				$(".ad_flbtn .ad_delinner").show();
				$(".ad_sure").hide();
				$(".delthis").remove();
				$(".successtips").html("您已经举报过了");
				$(".successtips").fadeIn(100).fadeOut(1900);
		}else{
			alert(data.data.error);
		}	
	},
	error: function (XMLHttpRequest, textStatus, errorThrown) {
	}
	});
});
//点击知道了
$(".talkBtn").live('click',function(){
	$(".isNoTalk,.ad_flbot").hide();
	$("body").css("overflow-y","visible");
	$("body").unbind("touchmove");
});
//点击长草按钮
$(".zhongcao").live('click',function(){
	var del=$(this);
	var seedProductId=$(this).parent().attr("seedProductId");
	checkAccessTokenLogin(function () {
		 var data = getFinalRequestObject({
			 accessToken: getAccessToken()
		 });
		if(del.hasClass("zhongcao2")){
			$.ajax({//采用异步取消长草
				type: "post",
				url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/seedproduct/deleteCollectProduct/2.3.0',
				data:getFinalRequestObject({accessToken:getAccessToken(),seedProductIds:seedProductId}),
				timeout:15000,//10s
				dataType:"json",
				success: function (data) {
					if(data.code == 0){
						del.addClass("zhongcao1").removeClass("zhongcao2");
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
				url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/seedproduct/collectProduct/2.5.3',
				data:getFinalRequestObject({accessToken:getAccessToken(),seedProductId:seedProductId,targetType:1,targetId:getParam('postId')}),
				timeout:15000,//10s
				dataType:"json",
				success: function (data) {
					if(data.code == 0){
						if (/iphone|ipad|ipod/.test(ua)) {
							_czc.push(['_trackEvent','nggirl_column_post_seedProduct_collect','phoneType=iOS','商品收藏','seedProductId',del.attr("seedProductId")]);	
						} else if (/android/.test(ua)) {
							_czc.push(['_trackEvent','nggirl_column_post_seedProduct_collect','phoneType=and','商品收藏','seedProductId',del.attr("seedProductId")]);
						};
						del.addClass("zhongcao2").removeClass("zhongcao1");
						if(data.data.addScore != "0" && data.data.addScore != undefined){
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
	}, 'articledetail.html' + window.location.search);
	return false;
});
//收藏作品
$('.z-kinds').live('click', function (e) {
	var del=$(this);
	var workId=$(this).parent().parent().attr("workId");
	var delnum=del.siblings(".zhongcaonum").children("span");
	checkAccessTokenLogin(function () {
		if(del.hasClass("zhongcao2")){
			$.ajax({
				url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/cancelCollectWork',
				type: 'post',
				data: getFinalRequestObject({accessToken:getAccessToken(), workId:workId}),
				dataType: 'json',
				success: function (data) {
					if(data.code == 0){
						del.addClass("zhongcao1").removeClass("zhongcao2");
						del.html("收藏");
						delnum.html(parseInt(delnum.html())-1);
					}else{
						alert(data.data.error);
					}
						
				}
			});
		}else{
			$.ajax({
				url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/collectWork/2.5.3',
				type: 'post',
				data: getFinalRequestObject({accessToken:getAccessToken(), workId: workId}),
				dataType: 'json',
				success: function (data) {
					if(data.code == 0){
						del.addClass("zhongcao2").removeClass("zhongcao1");
						del.html("已收藏");
						delnum.html(parseInt(delnum.html())+1);
						if(data.data.addScore != "0" && data.data.addScore != undefined){
							alertNewScore("积分 +"+data.data.addScore);
						}
					}else{
						alert(data.data.error);
					}	
				}
			});
		}
	}, 'articledetail.html' + window.location.search);
	return false;
});
//关注按钮点击
$(".head_attention").live('click',function(){
	 checkAccessTokenLogin(function () {
         var data = getFinalRequestObject({
             accessToken: getAccessToken()
         });
		
		if($(".head_attention").hasClass("atten1")){
				cancelFollowUser();
				
			}else{
				FollowUser();
				
				}
	}, 'articledatil.html' + window.location.search);
});
//关注
function FollowUser(del){
	$.ajax({//采用异步
		type: "post",
		url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/personal/addFollowUser/2.2.0',
		data:getFinalRequestObject({accessToken:getAccessToken(),followedUserId:$(".dressname").attr("createUserId")}),
		dataType:"json",
		success: function (data) {
			if(data.code == 0){
				$(".head_attention").html("已关注");
				$(".head_attention").removeClass("atten2").addClass("atten1");
				
			}else{
				alert(data.data.error)
			}
		},
	
	});
}
//取消关注
function cancelFollowUser(){
	$.ajax({//采用异步
		type: "post",
		url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/personal/cancelFollowUser/2.2.0',
		data:getFinalRequestObject({accessToken:getAccessToken(),followedUserId:$(".dressname").attr("createUserId")}),
		dataType:"json",
		success: function (data) {
			if(data.code == 0){
				$(".head_attention").html("关注");
				$(".head_attention").removeClass("atten1").addClass("atten2");
			}else{
				alert(data.data.error)
			}
		},
	
	});
}
//留言时间格式化
function getLocalTime(publishTime) {
    var d_minutes, d_hours, d_days;
    var timeNow = parseInt(new Date().getTime() / 1000);
    var d;
    d = timeNow - publishTime/1000;
    d_days = parseInt(d / 86400);
    d_hours = parseInt(d / 3600);
    d_minutes = parseInt(d / 60);
	var s = 0;
    s = new Date(publishTime);
    var sthours=parseInt(s.getHours());
	var nohours=parseInt(new Date().getHours());
	var m=parseInt(s.getMonth() + 1);
		if(m<10){
			m="0"+m;
			}
		var day=parseInt(s.getDate());
		if(day<10){
			day="0"+day;
			}
		 var hours=parseInt(s.getHours());
		if(hours<10){
			hours="0"+hours;
			}
		var minutes=parseInt(s.getMinutes());
		if(minutes<10){
			minutes="0"+minutes;
			}
    if (d_days <= 0 && d_hours >= 0 && nohours>=sthours) {
		if(nohours=sthours && d_hours>10){
			return (s.getFullYear() + "-" + m) + "-" +day ;
		}
		return (hours + ":" +  minutes) ;
    } else {
     return (s.getFullYear() + "-" + m) + "-" +day ;
    }
}
});
 //微信分享
function weixinConfig(title,desc,link,imgUrl){
    wx.ready(function(){

        //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
        wx.onMenuShareTimeline({
            title: title, // 分享标题
            link: link, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {
				if (/iphone|ipad|ipod/.test(ua)) {
					_czc.push(['_trackEvent','nggirl_column_post_article_share','phoneType=iOS','文章分享','postId',$(".ad_tops").attr('postId')]);	
				} else if (/android/.test(ua)) {
					_czc.push(['_trackEvent','nggirl_column_post_article_share','phoneType=and','文章分享','postId',$(".ad_tops").attr('postId')]);
				};
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
				if (/iphone|ipad|ipod/.test(ua)) {
					_czc.push(['_trackEvent','nggirl_column_post_article_share','phoneType=iOS','文章分享','postId',$(".ad_tops").attr('postId')]);	
				} else if (/android/.test(ua)) {
					_czc.push(['_trackEvent','nggirl_column_post_article_share','phoneType=and','文章分享','postId',$(".ad_tops").attr('postId')]);
				};
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
    });
    var currenturl = window.location.href  ;
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

//文章添加链接
function ParagraphTransHelper(s){
	var reg = new RegExp("\\[[^\\[]*\\]\\([^\\(]*\\)");
	var matcher1 = s;
    var matcher = s.match(reg);
	var d= s.split("](").length-1;
	for( var i = 0;i < d ;i++){
		var indexLeftBracket = matcher.input.indexOf("[");
		var indexRightBracket = matcher.input.indexOf("]");
		var indexLeftParentesis = matcher.input.indexOf("(");
		var indexRightParentesis = matcher.input.indexOf(")");
		var redirectString = matcher.input.substring(indexLeftParentesis+1, indexRightParentesis);
		var showString ='<a href="'+getRightLink(redirectString)+'">'+ matcher.input.substring(indexLeftBracket+1, indexRightBracket)+'</a>';
		var matcher1=matcher.input.replace(matcher[0],showString);
		var matcher=matcher1.match(reg);
	};
	//console.log(matcher1);
	return matcher1;
}
function getRightLink(data){
	var e = data.indexOf("?");
	var d = data.length;
	var first=data.substring(e+1, d);
	var x=data.indexOf("postType");
	var y=data.substring(x+9, x+10);
	//跳转到webview打开页面
	if(data.indexOf('webview?url=') == 0){
		data=data.replace("webview?url=","")+'';
	};
	//美妆专题
	if(data.indexOf('special') == 0){
		data=data.replace(data,window.location.protocol+"//"+window.location.host+'/nggirl/h5/cosmetic/cosmeticSpecial-share.html?'+first+'&v=<%= VERSION %>');
	};
	//跳转到化妆师个人页面
	if(data.indexOf('dresser') == 0){
		data=data.replace(data,window.location.protocol+"//"+window.location.host+'/nggirl/h5/cosmetic/space.html?'+first+'&v=<%= VERSION %>');
	};
	//跳转到下午茶页面
	if(data.indexOf('afternoontea') == 0){
		data=data.replace(data,window.location.protocol+"//"+window.location.host+'/nggirl/h5/cosmetic/beautySalonWorkDetails.html?'+first.replace("type","productType").replace("atId","unionProductId")+'&v=<%= VERSION %>');
	};
	//跳转到上门美妆订单列表
	if(data.indexOf('cosmOrder') == 0){
		data=data.replace(data,window.location.protocol+"//"+window.location.host+'/nggirl/h5/cosmetic/orderList.html?v=<%= VERSION %>');
	};
	//跳转到下午茶订单列表
	if(data.indexOf('atorder') == 0){
		data=data.replace(data,window.location.protocol+"//"+window.location.host+'/nggirl/h5/cosmetic/beautySalonOrderList.html?v=<%= VERSION %>');
	};
	//跳转到南瓜券页面
	if(data.indexOf('coupon') == 0){
		data=data.replace(data,window.location.protocol+"//"+window.location.host+'/nggirl/h5/cosmetic/vouchers.html?v=<%= VERSION %>');
	};
	//帖子专栏页面
	if(data.indexOf('column') == 0){
		data=data.replace(data,window.location.protocol+"//"+window.location.host+'/nggirl/h5/cosmetic/indexLookMore.html?'+first+'&v=<%= VERSION %>');
	};
	//帖子详情页面
	if(data.indexOf('post') == 0){
		var x=data.indexOf("postType");
		var y=data.substring(x+9, x+10);
		if(y == 1){
			data=data.replace(data,window.location.protocol+"//"+window.location.host+'/nggirl/h5/cosmetic/articledetail.html?'+first+'&v=<%= VERSION %>');
		}else if(y == 2){
			data=data.replace(data,window.location.protocol+"//"+window.location.host+'/nggirl/h5/cosmetic/videoDetail.html?'+first+'&v=<%= VERSION %>');

		}
	};
	//上门美妆妆容作品列表页面
	if(data.indexOf('workType') == 0){
		data=data.replace(data,window.location.protocol+"//"+window.location.host+'/nggirl/h5/cosmetic/more.html?'+first.replace("typeName","workType")+'&v=<%= VERSION %>');
	};
	//上门美妆作品详情页
	if(data.indexOf('work') == 0){
		data=data.replace(data,window.location.protocol+"//"+window.location.host+'/nggirl/h5/cosmetic/workDetails.html?'+first+'&v=<%= VERSION %>');
	};
	//我的评论消息页面
	if(data.indexOf('postMsg') == 0){
		data="javascript:;";
	};
	//日签页面
	if(data.indexOf('checkin') == 0){
		data="javascript:;";
	};
	//用户主页
	if(data.indexOf('userHome') == 0){
		data=data.replace(data,window.location.protocol+"//"+window.location.host+'/nggirl/h5/cosmetic/myHomePage.html?'+first+'&v=<%= VERSION %>');
	};
	//试用活动页面
	if(data.indexOf('cosmeticTrial') == 0){
		data=data.replace(data,window.location.protocol+"//"+window.location.host+'/nggirl/h5/cosmetic/freeTrial.html?'+first+'&v=<%= VERSION %>');
	};
	//热门话题页面
	if(data.indexOf('hotTopic') == 0){
		data=data.replace(data,window.location.protocol+"//"+window.location.host+'/nggirl/h5/cosmetic/hotTopicDetail.html?'+first+'&v=<%= VERSION %>');
	};
	return data;
}
//滑动
window.addEventListener('load',function(){
	var initX;
	var moveX;
	var X = 0;
	var objX = 0;
	var Y = 0;
	var objY = 0;
	window.addEventListener('touchstart',function(event){
		var obj = event.target.parentNode;
		initX = event.targetTouches[0].pageX;
		objX =(document.getElementById("cube").style.webkitTransform.replace(/translateX\(/g,"").replace(/px\)/g,""))*1;
		//console.log(objX);
		initY = event.targetTouches[0].pageY;
		if( objX == 0){
			window.addEventListener('touchmove',function(event) {
					moveX = event.targetTouches[0].pageX;
					X = moveX - initX;
					moveY = event.targetTouches[0].pageY;
					
					Y = moveY - initY;
					var l = Math.abs(X);
					var M = Math.abs(Y);
					//console.log(M);
					if( l>M){
						if (X > 0) {
							document.getElementById("cube").style.webkitTransform = "translateX(" + 0 + "px)";
						}else if (X < 0 ) {
							if(l>0){
							document.getElementById("cube").style.webkitTransform = "translateX(" + -l + "px)";
							$(".hiddenright").width(l);
							
							}
							if(l>180 ){
								l=180;
								document.getElementById("cube").style.webkitTransform = "translateX(" + -l + "px)";
								$(".hiddenright").width(l);
							}
							
						}
					}
				
			});
		}
	})
	window.addEventListener('touchend',function(event){		
		var obj = event.target.parentNode;
		objX =(document.getElementById("cube").style.webkitTransform.replace(/translateX\(/g,"").replace(/px\)/g,""))*1;
		if(objX>-90){
			document.getElementById("cube").style.webkitTransform = "translateX(" + 0 + "px)";
		}else{
			document.getElementById("cube").style.webkitTransform = "translateX(" + -180 + "px)";
			if (/iphone|ipad|ipod/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_article_relevant_product','phoneType=iOS','点击往期商品按钮','true','']);	
			} else if (/android/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_article_relevant_product','phoneType=and','点击往期商品按钮','true','']);
			};
			window.location.href="goodsList.html?postId=" +getParam("postId") +'&postType='+1 +'&v=<%= VERSION %>';			
		}			
	 })
})
/*var APPCommon = {
    iphoneSchema: 'nggirl://nggirl/post?postId='+getParam('postId')+'&postType='+getParam('postType')+'&postTitle='+$(".ad_title").text()+'&v=<%= VERSION %>',
    iphoneDownUrl: 'https://itunes.apple.com/cn/app/nan-gua-gu-niang-yi-jian-xia/id1014850829?l=en&mt=8',
    androidSchema: 'nggirl://nggirl/post?postId='+getParam('postId')+'&postType='+getParam('postType')+'&postTitle='+$(".ad_title").text()+'&v=<%= VERSION %>',
    androidDownUrl: '<%= CLI_HOST_API_URL %>/nggirl/app/getapp/downloadAndroidApk/byChannel?channel=yingyongbao',
    openApp: function(){
        var this_  =  this;
            if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {	
				if(this_.isWeixin()){
					 window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=cn.com.nggirl.nguser";
		 
				}else{
                var loadDateTime = new Date();
                window.setTimeout(function() {
                    var timeOutDateTime = new Date();
                    if (timeOutDateTime - loadDateTime < 5000) {
                        window.location = this_.iphoneDownUrl;//ios下载地址
						console.log(1)
                    } else {
                        window.close();
                    }
                },1500);
				window.location = this.iphoneSchema;
				}
                
            }else if (navigator.userAgent.match(/android/i)) {
				if(this_.isWeixin()){
					$(".isWei").css("height",$(window).height());
					$(".isWei").show();
					
				}else{
					try {
						window.location = this_.androidSchema;
						timer=setTimeout(function(){
							window.location=this_.androidDownUrl; //android下载地址
	 
						},1500);
					} catch(e) {}
				}
            }
 
    },
    isWeixin: function(){ //判断是否是微信
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }
 
};
$(document).on('visibilitychange webkitvisibilitychange', function() {
    var tag = document.hidden || document.webkitHidden;
    if (tag) {
        clearTimeout(timer);
    }
})

$(window).on('pagehide', function() {
    clearTimeout(timer);
})*/