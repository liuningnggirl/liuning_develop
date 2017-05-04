$(function(){
	$('.forinput').scroll(function(e) {
        $("img.lazy").lazyload({effect : "show"});
    });
	
	if($(window).width() == '414'){
		$('.de_box').css('width','71%');
	}else{
		$('.de_box').css('width','70%');
	}
	var say = '请输入评论内容';
	if ($("#textarea").val() === "") {
		$("#textarea").attr('placeholder',say);
	}
	$("#textarea").click(function(){
		if($("#textarea").val() == say){
			$("#textarea").val("");
		}
	});
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
	
	var pageSize = 20;
	getcommentmessage(0,20);	
	var h1=$("#video").height();
	$(".dresser_message").css("margin-top",h1);
	$(".forinput").height($(window).height()-56);
	$("body").height($(window).height());
	/*评论规则*/
	//localStorage.removeItem("showonce");
	if(localStorage.showonce == "" || localStorage.showonce == "null" || localStorage.showonce == undefined ){
		localStorage.showonce = 1;
		$('.gray').fadeIn();
		$('body').css('overflow','hidden').addClass('fixed');
		$('.integral_window').css('margin-top',($(window).height() - $('.integral_window').height())/2);
	};
	//点击活动规则里面的知道了
	$('.btn_ok,.gray').click(function(e) {
        $('.gray').fadeOut();
		$('body').css('overflow','auto').removeClass('fixed');
    });
//点击购买
	$('.goToBuy2').die('click');
	$('.goToBuy2').live('click',function(e) {
		var del = $(this);
		var delId = $(this).parent().attr("seedproductId");
		checkAccessTokenLogin(function () {
			if (/iphone|ipad|ipod/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_video_gobuy','phoneType=iOS','去买按钮','seedProductId',delId]);	
			} else if (/android/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_video_gobuy','phoneType=and','去买按钮','seedProductId',delId]);
			};
			//console.log(delId);
			//判断如果是在微信打开
			if(isInWeixin()){
				$('.isWei').show();	
			}else{
				$('.isWei').hide();	
				window.location.href = del.attr('urlStr')+'&v=<%= VERSION %>';
			}
		}, 'videoDetail.html' + window.location.search);
    });
	//查看全部商品
	$(".ad_btn .lookGoods").live('click',function(){
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_column_post_video_relevant_product','phoneType=iOS','点击往期商品按钮','true','']);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_column_post_video_relevant_product','phoneType=and','点击往期商品按钮','true','']);
		};
		window.location.href="goodsList.html?postId=" +getParam("postId") +'&postType='+2+'&v=<%= VERSION %>';	
	});
	//点击跳转到妆品详情页
	$(".workDetails").live('click',function(){
		window.location.href="workDetails.html?workId=" +$(this).attr("workId")+'&v=<%= VERSION %>';	
	});
	var mnum = 0;
	getLoverCount();
	$(".de_box .form-control").click(function(){
		$(".form-control").attr("contenteditable","true");
		$(this).focus();
	    checkAccessTokenLogin(function () {
		   var data = getFinalRequestObject({
			   accessToken: getAccessToken()
		   });
		},'videoDetail.html?postType=' +getParam('postType') +'&postId='+getParam('postId')+'&v=<%= VERSION %>');
	});
	//点击商品跳转到商品详情页
	$(".productDetail").live('click',function(){
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_column_post_seedProduct_view','phoneType=iOS','商品浏览','seedProductId',$(this).attr("seedProductId")]);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_column_post_seedProduct_view','phoneType=and','商品浏览','seedProductId',$(this).attr("seedProductId")]);
		};
		window.location.href="productDetails.html?seedProductId=" +$(this).attr("seedproductId") +'&targetType='+2+'&targetId='+getParam("postId")+'&v=<%= VERSION %>';		
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
		$('html,body,.forinput').animate({scrollTop: '0px'}, 100);return false;
	});
	//查看更多评论
	$(".goToAllComment").live('click',function(){
		window.location.href="allCommentNew.html?postType=" +2 +'&postId=' +getParam("postId")+'&v=<%= VERSION %>';	
	});
	//跳转到全部评论页
	$(".db_comment").live('click',function(){
		 checkAccessTokenLogin(function () {
		   var data = getFinalRequestObject({
			   accessToken: getAccessToken()
		   });
		   window.location.href="allCommentNew.html?postType=" +2 +'&postId=' +getParam("postId")+'&v=<%= VERSION %>';
		},'allCommentNew.html?postType=' + 2 +'&postId=' +getParam("postId")+'&v=<%= VERSION %>');
			
	});
	//跳转到用户页
	$('.user_name,.dl_header_img').live('click',function(){
		window.location.href="myHomePage.html?userId="+ $(this).attr("createUserId")+'&v=<%= VERSION %>';
	});
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
	$(".ad_label1 span").live('click',function(){
		window.location.href="label.html?labelName="+ $(this).html()+'&v=<%= VERSION %>';
	});
	//跳转到作者页
	$(".dressname,.ad_imgbox").live('click',function(){
		window.location.href="myHomePage.html?userId="+ $(this).attr("createUserId")+'&v=<%= VERSION %>';
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
	$(".de_box .form-control").blur(function(){
		//$(".de_bot").hide(100);
		//$(".ad_btn").show(10);
		if($.trim($(this).val())== ""){
			$('#page_emotion').hide();
			$('.ping_icon').removeClass('open');
			$(this).attr('placeholder',"请输入评论内容");
			$(".form-tip").html("请输入评论内容");
			//$(".replymessage").addClass("send_message").removeClass("replymessage");
			//$(".replyinmessage").addClass("send_message").removeClass("replyinmessage");
		};
		//localStorage["a"]= $(this).val();		
	});
	$(".de_box .form-control").focus(function(){
		 //if(localStorage["a"] != "" && typeof(localStorage["a"]) != "undefined"){
		 	 //$(".form-control").val(localStorage["a"]);
		 //};
		 checkAccessTokenLogin(function () {
		   var data = getFinalRequestObject({
			   accessToken: getAccessToken()
		   });
		   isNoTalk();
		},'videoDetail.html?postType=' +2 +'&postId='+getParam('postId')+'&v=<%= VERSION %>');
	});
	$("#send_message,.ad_gtcom").live('click',function(){
	    checkAccessTokenLogin(function () {
		   var data = getFinalRequestObject({
			   accessToken: getAccessToken()
		   });
		},'videoDetail.html?postType=' +2 +'&postId='+getParam('postId')+'&v=<%= VERSION %>');
	});
	//收藏或取消收藏
	$('.db_collect').click(function(e) {
		//判断收藏状态
		var del=$(this);
		checkAccessTokenLogin(function () {
		 var data = getFinalRequestObject({
			 accessToken: getAccessToken()
		 });
		if(del.attr('flag') == 0){//未收藏
			$.post('<%= UGC_HOST_API_URL %>/nggirl/app/cli/column/collectPost/2.5.3',getFinalRequestObject({accessToken: getAccessToken(),postId: getParam('postId'),postType: 2,flag:1}),function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					if (/iphone|ipad|ipod/.test(ua)) {
						_czc.push(['_trackEvent','nggirl_column_post_video_collect','phoneType=iOS','视频收藏','postId',$(".dm_top").attr('postid')]);	
					} else if (/android/.test(ua)) {
						_czc.push(['_trackEvent','nggirl_column_post_video_collect','phoneType=and','视频收藏','postId',$(".dm_top").attr('postid')]);
					};
					$('.db_collect').attr('flag',1);
					$('.db_collect img').attr('src','images/collect_hou.png');
					if(data.data.addScore != "0"){
						alertNewScore("积分 +"+data.data.addScore);
					}
				}else{
					alert(data.data.error);	
				}
			});
		}else{
			$.post('<%= UGC_HOST_API_URL %>/nggirl/app/cli/column/collectPost/2.5.3',getFinalRequestObject({accessToken: getAccessToken(),postId: getParam('postId'),postType: 2,flag:0}),function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.db_collect').attr('flag',0);
					$('.db_collect img').attr('src','images/collect_qian.png');
				}else{
					alert(data.data.error);	
				}
			});
		}
		}, 'videoDetail.html' + window.location.search);
    });
	//点赞或取消点赞
	$('.db_like').click(function(e) {
		var del=$(this);
		//判断点赞状态
		checkAccessTokenLogin(function () {
		 var data = getFinalRequestObject({
			 accessToken: getAccessToken()
		 });
		if(del.attr('flag') == 0){//未点赞
			$.post('<%= UGC_HOST_API_URL %>/nggirl/app/cli/column/praisePost/2.5.3',getFinalRequestObject({accessToken: getAccessToken(),postId: getParam('postId'),postType: 2,flag:1}),function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					if (/iphone|ipad|ipod/.test(ua)) {
						_czc.push(['_trackEvent','nggirl_column_post_video_praise','phoneType=iOS','视频点赞','postId',$(".dm_top").attr('postid')]);	
					} else if (/android/.test(ua)) {
						_czc.push(['_trackEvent','nggirl_column_post_video_praise','phoneType=and','视频点赞','postId',$(".dm_top").attr('postid')]);
					};
					$('.db_like').attr('flag',1);
					$('.db_like img').attr('src','images/zan_hou.png');
					getLoverCount();
					if(data.data.addScore != "0"){
						alertNewScore("积分 +"+data.data.addScore);
					}
				}else{
					alert(data.data.error);	
				}
			});
		}else{
			$.post('<%= UGC_HOST_API_URL %>/nggirl/app/cli/column/praisePost/2.5.3',getFinalRequestObject({accessToken: getAccessToken(),postId: getParam('postId'),postType: 2,flag:0}),function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.db_like').attr('flag',0);
					$('.db_like img').attr('src','images/zan_qian.png');
					getLoverCount();
				}else{
					alert(data.data.error);	
				}
			});
		}
		}, 'videoDetail.html' + window.location.search);
    });
//喜欢详情
function getLoverCount(){
$.ajax({//采用异步
	type: "get",
	url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/post/getVideoPostDetail/3.0.0',
	data:getFinalRequestObject({accessToken:getAccessToken(),postId:getParam('postId'),postType:2,isCountViewNum:0}),
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
					$(".loverCount ul").append('<li loverUserId='+data.data.lovers[i].loverUserId+' class="lookLoverMessage"><div class="loverbox" ><img src="'+data.data.lovers[i].loverProfile+'"></div></li>');
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
}
//评论详情
function getcommentmessage(pageNum,pageSize){
$.ajax({//采用异步
	type: "get",
	url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/post/getComments/2.4.2',
	data:getFinalRequestObject({accessToken:getAccessToken(),postId:getParam('postId'),postType:2,page:pageNum,num:pageSize,queryTime:$(".ad_comdet").attr("queryTime")}),
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
				str1 +='<span class="comleftz" status="1" commentId="'+data.data.comments[i].commentId+'"><img src="images/cdianzan.png" class="co_dianzan">';
				if(data.data.comments[i].praiseCount>999){
					str1 +='<b class="zq_count">999+</b></span>';
				}else{
					str1 +='<b class="zq_count">'+data.data.comments[i].praiseCount+'</b></span>';
				}
			}else{
				str1 +='<span class="comleftz" status="0"  commentId="'+data.data.comments[i].commentId+'"><img src="images/cdianzanhou.png" class="qx_dianzan">';
				if(data.data.comments[i].praiseCount>999){
					str1 +='<b class="zh_count">999+</b></span>';
				}else{
					str1 +='<b class="zh_count">'+data.data.comments[i].praiseCount+'</b></span>';
				}
			};
			str1 +='<span class="comleft"><img src="images/commentgreen.png" class="ad_gtcom"></span>';
			if(data.data.comments[i].isMyComment=="1"){
			str1 +='<span class="comright ad_morea"><img src="images/moregreen.png" class="ad_more "></span></div></div>';
			}else{
				str1 +='<span class="comright ad_moreb"><img src="images/moregreen.png" class="ad_more "></span></div></div>';
				}
			if(data.data.comments[i].isIllegal=="0"){
			str1 +='<div class="adf_comdetail" replyType="1">'+getImgUrl(htmlEscape(data.data.comments[i].comment))+'</div>';
			}else{
				str1 +='<div class="adf_comdetail" replyType="1">!@#$%^&*()</div>';
				}
			str1 +='<div class="adf_reply">';
			if(data.data.comments[i].replies.length>0){
				for(var j = 0;j < data.data.comments[i].replies.length;j++){
					if(j == 0){
						str1 +='<img src="images/Triangular.png" class="arr">';
					}
					if(data.data.comments[i].replies[j].isMyReply==1){
						str1 +='<div replyId="'+ data.data.comments[i].replies[j].replyId+'" isMyReply="'+data.data.comments[i].replies[j].isMyReply+'" replyType="2" class="adf_dis">';
					}else{
						str1 +='<div replyId="'+ data.data.comments[i].replies[j].replyId+'" isMyReply="'+data.data.comments[i].replies[j].isMyReply+'" replyType="2" class="adf_replys">';
					}
					str1 +='<span replyUserId="'+data.data.comments[i].replies[j].replyUserId+'" class="replyUser infloor">'+data.data.comments[i].replies[j].replyUserNickName+'</span>:';
					if(data.data.comments[i].replies[j].replyType=="1"){
						if(data.data.comments[i].replies[j].isIllegal=="0"){
							str1 += '<span class="replyDetail">'+getImgUrl(data.data.comments[i].replies[j].reply) +'</span>';
						}else{
							str1 += '!@#$%^&*()';
						}
					}else{
						str1 += '回复<span replyToUserId="'+data.data.comments[i].replies[j].replyToUserId+'" class="replyToUser">'+data.data.comments[i].replies[j].replyToUserNickName+'</span>:';
						if(data.data.comments[i].replies[j].isIllegal=="0"){
							str1 += '<span class="replyDetail">'+getImgUrl(data.data.comments[i].replies[j].reply) +'</span>';
						}else{
							str1 += '!@#$%^&*()';
						}
					}
					str1 += '<p class="adf_time">'+getLocalTime(data.data.comments[i].replies[j].replyTime)+'</p></div>';
				}
			}
			str1 +='</div>';
			str1 +='</div>';
			}
		if(data.data.comments.length== "0"  && pageNum == 0){
			str1 +='<div class="nonecom"><img src="images/noappraise.png" /><p>暂无评论<br>等你来抢沙发~</p></div>';
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
}
function getMorecomment(){
		var pageNum = $('body').data('pageNum');
		if(pageNum == undefined || parseInt(pageNum) == NaN){
			pageNum = 0;
		}
		pageNum = pageNum + 1;
		$('body').data('pageNum',pageNum);
		getcommentmessage(pageNum,pageSize);
	}
//回复评论
$(".adf_comdetail").live('click',function(){
	var del=$(this);
	$(this).parents(".ad_floor").addClass("oncom").siblings().removeClass("oncom");
	$(".form-tip").html("回复层主");
	$(".form-control").attr('placeholder',"回复层主");
	$("#send_message").removeClass().addClass("replymessage");
	$(".de_bot").show();
	$(".ad_btn").hide();
	$(".form-control").focus();
	$(".oncom").attr("replyType",$(this).attr("replyType"));
	})
$(".ad_gtcom").live('click',function(){
	var del=$(this);
	$(this).parents(".ad_floor").addClass("oncom").siblings().removeClass("oncom");
	$(".form-control").attr('placeholder',"回复层主");
	$(".form-tip").html("回复层主");
	$("#send_message").removeClass().addClass("replymessage");
	$(".de_bot").show();
	$(".ad_btn").hide();
	$(".form-control").focus();
	$(".oncom").attr("replyType","1");
	})
$(".replymessage").live('click',function(){
	$('#page_emotion').hide();
	$('.ping_icon').removeClass('open');
	if($.trim($(".form-control").val()) !=""){
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_column_post_video_comment','phoneType=iOS','视频评论','postId',$(".dm_top").attr('postid')]);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_column_post_video_comment','phoneType=and','视频评论','postId',$(".dm_top").attr('postid')]);
		};
		replycommentinfo();
		$(".form-control").blur();
		$(".de_bot").hide();
		$(".ad_btn").show();
		$("#send_message").removeClass("replymessage").addClass("send_message");
		$(".form-tip").html("请输入评论内容");
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
	})
//非本人点击层中层的回复
$(".ad_replay1").live('click',function(){
	$(".ad_flbot,.ad_flbtn1").hide();
	$(".form-control").attr('placeholder',$(".form-tip").html());
	$(".de_bot").show();
	$(".ad_btn").hide();
	$(".form-control").focus();
	$("#send_message").removeClass().addClass("replyinmessage");
})
$(".replyinmessage").live('click',function(){
	$('.page_emotion').hide();
	$('.ping_icon').removeClass('open');
	if($.trim($(".form-control").val()) !=""){
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_column_post_video_comment','phoneType=iOS','视频评论','postId',$(".dm_top").attr('postid')]);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_column_post_video_comment','phoneType=and','视频评论','postId',$(".dm_top").attr('postid')]);
		};
		$(".form-control").blur();
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
				var str4="";
				if($(".oncom .adf_reply").children().length == 0){
					str4 +='<img src="images/Triangular.png" class="arr">';
					str4 +='<div replyId="'+ data.data.replyId+'" isMyReply="'+data.data.isMyReply+'" replyType="'+ data.data.replyType+'" class="adf_dis">';
				}else{
					str4 +='<div replyId="'+ data.data.replyId+'" isMyReply="'+data.data.isMyReply+'" replyType="'+ data.data.replyType+'" class="adf_dis">';
				}
				str4 +='<span replyUserId="'+data.data.replyUserId+'" class="infloor replyUser">'+data.data.replyUserNickName+'</span>:';
				if(data.data.replyType=="1"){
					if(data.data.isIllegal=="0"){
						str4 +='<span class="replyDetail">'+getImgUrl(data.data.reply) +'</span>';
					}else{
						str4 += '!@#$%^&*()';
					}
				}else{
					str4 += '回复<span replyToUserId="'+data.data.replyToUserId+'" class="replyToUser">'+data.data.replyToUserNickName+'</span>:';
					if(data.data.isIllegal=="0"){
						str4 += '<span class="replyDetail">'+getImgUrl(data.data.reply) +'</span>';
					}else{
						str4 += '!@#$%^&*()';
						}
					}
				str4 += '<p class="adf_time">'+getLocalTime(data.data.replyTime)+'</p></div>';
				$(".oncom .adf_reply").append(str4);
				$(".form-control").attr('placeholder',"请输入评论内容");
				$(".ad_flbot").delay(500).fadeIn(100).fadeOut(1900);
				$(".successtips").html("评论成功");
				$(".successtips").delay(500).fadeIn(100).fadeOut(1900);
				//localStorage["a"]= "";
				$(".form-control").val("");
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
	}

//发布人点击...
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
});
//点击取消按钮
$(".ad_flbot,.ad_clobtn").live('click',function(){
	$(".ad_flbot").hide();
	$(".ad_flbtn,.ad_flbtn1").hide();
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
			}
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
			if($(".delthis").parent().children().length == 2){
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
	$(".form-tip").html("请输入评论内容");
	$(".ad_flbot").show();
	$(".ad_flbtn,.ad_flbtn1").hide();
	$(".ad_flbtn .ad_report").show();
	$(".ad_flbtn .ad_aelbtn").show();
	$(".ad_tcbox2").show();
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
							if(data.data.addScore != "0"){
								alertNewScore("积分 +"+data.data.addScore);
							}
						}else{
							alert(data.data.error);
						}	
					}
				});
			}
        }, 'videoDetail.html' + window.location.search);
		return false;
    });
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
//点击长草按钮
$(".zhongcao").die();
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
						del.text(parseInt(del.text())-1);
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
				data:getFinalRequestObject({accessToken:getAccessToken(),seedProductId:seedProductId,targetType:2,targetId:getParam('postId')}),
				timeout:15000,//10s
				dataType:"json",
				success: function (data) {
					if(data.code == 0){
						if (/iphone|ipad|ipod/.test(ua)) {
							_czc.push(['_trackEvent','nggirl_column_post_seedProduct_collect','phoneType=iOS','商品收藏','seedProductId',$(this).attr("seedProductId")]);	
						} else if (/android/.test(ua)) {
							_czc.push(['_trackEvent','nggirl_column_post_seedProduct_collect','phoneType=and','商品收藏','seedProductId',$(this).attr("seedProductId")]);
						};
						del.addClass("zhongcao2").removeClass("zhongcao1");
						del.text(parseInt(del.text())+1);
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
	}, 'videoDetail.html' + window.location.search);
	return false;
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
						del.children("img").attr('src','images/cdianzan.png');
						del.children("b").text(parseInt(del.children("b").text())-1);
						del.children("b").css('color','#9a9a9a');
					}else{
						del.attr("status","0");
						del.children("img").attr('src','images/cdianzanhou.png');
						del.children("b").text(parseInt(del.children("b").text())+1);
						del.children("b").css('color','#50c8b4');
						if(data.data.addScore != "0"){
							alertNewScore("积分 +"+data.data.addScore);
						}
					}
				}else{
					alert(data.data.error);	
				}
			},
		});
		}, 'videoDetail.html' + window.location.search);
	
});
//判断是否禁言
function isNoTalk(){
	$.ajax({//采用异步
	type: "get",
	url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/post/getVideoPostDetail/3.0.0',
	data:getFinalRequestObject({accessToken:getAccessToken(),postId:getParam('postId'),postType:2,isCountViewNum:0}),
	timeout:15000,//10s
	dataType:"json",
	success: function (data) {
		if(data.code == 0){
			if(data.data.isNoTalk == 1){
				$(".talkTime").html(data.data.noTalkTime);
				$(".isNoTalk,.ad_flbot").show();
				$(".de_box .form-control").blur();
				$("body").css("overflow-y","hidden");
				$("body").bind("touchmove",function(event){
					event.preventDefault();
				});
			};
		}
	},
	error: function (XMLHttpRequest, textStatus, errorThrown) {
		//console.log( XMLHttpRequest )
		//$(".main").html("尚未发布任何信息！");
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
				_czc.push(['_trackEvent','nggirl_column_post_video_relevant_product','phoneType=iOS','点击往期商品按钮','true','']);	
			} else if (/android/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_video_relevant_product','phoneType=and','点击往期商品按钮','true','']);
			};
			window.location.href="goodsList.html?postId=" +getParam("postId") +'&postType='+2+'&v=<%= VERSION %>';	
		}			
	 })
})
