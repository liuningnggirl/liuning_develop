var pageSize = 20;
$(function(){
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
	getcommentmessage(0,20);

	//跳转到用户页
	$(".adf_img").live('click',function(){
		window.location.href="myHomePage.html?userId="+ $(this).parent().parent().attr("userId")+'&v=3.0.2.1488356107880';
	});
	$(".adf_nickname").live('click',function(){
		window.location.href="myHomePage.html?userId="+ $(this).parent().parent().parent().attr("userId")+'&v=3.0.2.1488356107880';
	});
	//评论人名字点击
	$(".replyUser").live('click',function(){
		window.location.href="myHomePage.html?userId="+ $(this).attr("replyuserid")+'&v=3.0.2.1488356107880';
		return false;
	});
	$(".replyToUser").live('click',function(){
		window.location.href="myHomePage.html?userId="+ $(this).attr("replyToUserId")+'&v=3.0.2.1488356107880';
		return false;
	});
	$(".de_box .form-control").click(function(){
		//$(".form-control").attr("contenteditable","true");
		$(this).focus();
		 checkAccessTokenLogin(function () {
		   var data = getFinalRequestObject({
			   accessToken: getAccessToken()
		   });
		  
		},'allCommentNew.html?postType=' +getParam('postType') +'&postId='+getParam('postId')+'');
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
	$(".forinput").height($(window).height()-56);
	$(".de_box .form-control").blur(function(){
		//$('#.page_emotion').hide();
		//$('.ping_icon').removeClass('open');
		if($.trim($(this).val())== ""){
			$(this).attr("placeholder","请输入评论内容");
			$(".form-tip").html("请输入评论内容");
			//$(".replymessage").addClass("send_message").removeClass("replymessage");
			//$(".replyinmessage").addClass("send_message").removeClass("replyinmessage");
		};
		//localStorage["a"]= $(this).val();	
	});
	$(".de_box .form-control").focus(function(){
		 //if(localStorage["a"] != "" && typeof(localStorage["a"]) != "undefined"){
		 	// $(".form-control").val(localStorage["a"]);
		// };
		 $(".form-control").attr("placeholder", $(".form-tip").html());
		 checkAccessTokenLogin(function () {
		   var data = getFinalRequestObject({
			   accessToken: getAccessToken()
		   });
		   isNoTalk();
		},'allCommentNew.html?postType=' +getParam('postType') +'&postId='+getParam('postId')+'&v=3.0.2.1488356107880');
	});
	$("#send_message,.ad_gtcom,.form-control").live('click',function(){
		$('.form-control').focus();
		$('.page_emotion').hide();
		$('.ping_icon').removeClass('open');
	    checkAccessTokenLogin(function () {
		   var data = getFinalRequestObject({
			   accessToken: getAccessToken()
		   });
		   
		},'allCommentNew.html?postType=' +getParam('postType') +'&postId='+getParam('postId')+'&v=3.0.2.1488356107880');
	});

});	
//评论详情
function getcommentmessage(pageNum,pageSize){
$.ajax({//采用异步
	type: "get",
	url:'/nggirl/app/cli/post/getComments/2.4.2',
	data:getFinalRequestObject({accessToken:getAccessToken(),postId:getParam('postId'),postType:getParam('postType'),page:pageNum,num:pageSize,queryTime:$(".ad_comdet").attr("queryTime")}),
	timeout:15000,//10s
	dataType:"json",
	success: function (data) {
		if(data.code == 0){
			$("#pullUp").removeClass("pullup");
			$(".ad_comdet").attr("queryTime",data.data.queryTime);
		var str1 = "";
		for(var i = 0;i < data.data.comments.length;i++){
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
			str1 +='<div class="adf_comdetail" replyType="1">'+getImgUrl(data.data.comments[i].comment)+'</div>';
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
		}
		$(".ad_comdet").append(str1);
		if( data.data.comments.length >= pageSize ){
			var tur = true;	
			$(".forinput").scroll(function(){
				 var winH = $(".forinput").height(); //页面可视区域高度  
				var pageH = $(".forinputlength").height();  
				var scrollT = $(".forinput").scrollTop(); //滚动条top  
				var aa = (pageH - winH - scrollT) / winH;  
				if(tur && aa < 0.02){ 
					setTimeout(function(){
					  getMorecomment();
					  },200);
					  tur = false;
				   } 
		
		   });
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


function getMorecomment(){
		var pageNum = $('body').data('pageNum');
		if(pageNum == undefined || parseInt(pageNum) == NaN){
			pageNum = 0;
		}
		pageNum = pageNum + 1;
		$('body').data('pageNum',pageNum);
		getcommentmessage(pageNum,pageSize);
	}
	
	
//评论帖子
$(".send_message").live('click',function(){
	$('.page_emotion').hide();
	$('.ping_icon').removeClass('open');
	if($.trim($(".form-control").val()).length > 10){
		if(getParam('postType') == 2){
			if (/iphone|ipad|ipod/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_video_comment','phoneType=iOS','视频评论','postId',getParam('postId')]);	
			} else if (/android/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_video_comment','phoneType=and','视频评论','postId',getParam('postId')]);
			};
		}else{
			if (/iphone|ipad|ipod/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_article_comment','phoneType=iOS','文章评论','postId',getParam('postId')]);	
			} else if (/android/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_article_comment','phoneType=and','文章评论','postId',getParam('postId')]);
			};
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
	url: '/nggirl/app/cli/post/comment/2.5.3',
	data:getFinalRequestObject({accessToken:getAccessToken(),postId:getParam('postId'),postType:getParam('postType'),content:eraseStyleInCopyText($(".form-control").val())}),
	timeout:15000,//10s
	dataType:"json",
	beforeSend:function(){
		$(".send_message").off("click"); //解绑事件，用户在次点击在未返回数据时候，提交按钮不起作用
		$(".send_message").html("");//在请求发送之后，清空input，即使当时看不到结果，再次输入提交时，也是属于第二次评论了
	},
	success: function (data) {
		if(data.code == 0){
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
			str2 +='<span class="comleftz" status="1" commentId="'+data.data.commentId+'"><img src="images/cdianzan.png" class="co_dianzan">';
			str2 +='<b class="zq_count">0</b></span>';
			str2 +='<span class="comleft"><img src="images/commentgreen.png" class="ad_gtcom"></span>';
			str2 +='<span class="comright ad_morea"><img src="images/moregreen.png" class="ad_more "></span></div></div>';
			if(data.data.isIllegal=="0"){
			str2 +='<div class="adf_comdetail" replyType="1">'+getImgUrl(data.data.comment)+'</div>';
			}else{
				str2 +='<div class="adf_comdetail">!@#$%^&*()</div>';
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
			$(".send_message").bind("click",commentinfo);
		}
		}else{
				alert(data.data.error);	
		}
	},
	error: function (XMLHttpRequest, textStatus, errorThrown) {
		//console.log( XMLHttpRequest )
		//$(".main").html("尚未发布任何信息！");
		$(".send_message").bind("click",commentinfo);  //无论返回数据成功或者失败，都会给提交按钮添加绑定事件
	}
	});
}
//点击楼层评论内容
$(".adf_comdetail").live('click',function(){
	var del=$(this);
	$(this).parents(".ad_floor").addClass("oncom").siblings().removeClass("oncom");
	$(".form-tip").html("回复层主");
	$(".form-control").attr("placeholder","回复层主");
	$("#send_message").removeClass().addClass("replymessage");
	$(".oncom").attr("replyType",$(this).attr("replyType"));
	$(".form-control").focus();
	});
//点击按钮
$(".ad_gtcom").live('click',function(){
	var del=$(this);
	$(this).parents(".ad_floor").addClass("oncom").siblings().removeClass("oncom");
	$(".form-control").attr("placeholder","回复层主");
	$(".form-tip").html("回复层主");
	$("#send_message").removeClass().addClass("replymessage");
	$(".oncom").attr("replyType","1");
	$(".form-control").focus();
	});
//回复层主的消息按钮
$(".replymessage").live('click',function(){
	if($.trim($(".form-control").val()) !=""){
		if(getParam('postType') == 2){
			if (/iphone|ipad|ipod/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_video_comment','phoneType=iOS','视频评论','postId',getParam('postId')]);	
			} else if (/android/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_video_comment','phoneType=and','视频评论','postId',getParam('postId')]);
			};
		}else{
			if (/iphone|ipad|ipod/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_article_comment','phoneType=iOS','文章评论','postId',getParam('postId')]);	
			} else if (/android/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_article_comment','phoneType=and','文章评论','postId',getParam('postId')]);
			};
		};
		$(".form-control").blur();
		replycommentinfo();
		$("#send_message").removeClass("replymessage").addClass("send_message");
		$(".form-tip").html("请输入评论内容");
		//localStorage["a"]= "";
	};
});
//点击层中层
$(".adf_replys").live('click',function(e){
	$(".form-control").blur();
	$(".ad_flbot").show();
	$(".ad_flbtn1").show();
	var del=$(this);
	del.parent(".adf_reply").parents(".ad_floor").addClass("oncom").siblings().removeClass("oncom");
	del.addClass("incom").siblings().removeClass("incom");
	del.parent(".adf_reply").parent(".ad_floor").siblings().children().children().removeClass("incom");
	var str=del.children(".infloor").html();
	$(".form-tip").html("回复"+str);
	$(".oncom").attr("replyType",del.attr("replyType"));
	del.addClass("reportthis").parent(".adf_reply").parents(".ad_floor").removeClass("reportthis");
	del.siblings().removeClass("reportthis");
	del.parent(".adf_reply").parents(".ad_floor").siblings().removeClass("reportthis");
	del.parent(".adf_reply").parents(".ad_floor").siblings().children(".adf_reply").children().removeClass("reportthis");
	del.attr("targetType","2");
	del.attr("targetId",del.attr("replyid"));
});

//非本人点击层中层的回复
$(".ad_replay1").live('click',function(e){
	$(".ad_flbot,.ad_flbtn1").hide();
	$(".form-control").focus();
	$(".form-control").attr("placeholder",$(".form-tip").html());
	$("#send_message").removeClass().addClass("replyinmessage");	
});
//点击回复层中层的发送消息按钮
$(".replyinmessage").live('click',function(){
	if($.trim($(".form-control").val()) !=""){
		if(getParam('postType') == 2){
			if (/iphone|ipad|ipod/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_video_comment','phoneType=iOS','视频评论','postId',getParam('postId')]);	
			} else if (/android/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_video_comment','phoneType=and','视频评论','postId',getParam('postId')]);
			};
		}else{
			if (/iphone|ipad|ipod/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_article_comment','phoneType=iOS','文章评论','postId',getParam('postId')]);	
			} else if (/android/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_article_comment','phoneType=and','文章评论','postId',getParam('postId')]);
			};
		};
		$(".form-control").blur();
		replycommentinfo();
		$("#send_message").removeClass("replyinmessage").addClass("send_message");
		$(".form-tip").html("请输入评论内容");
		//localStorage["a"]= "";
	};
});
//回复层中层方法
function replycommentinfo(){
	$.ajax({//采用异步
	type: "post",
	url: '/nggirl/app/cli/post/reply/2.5.3',
	data:getFinalRequestObject({accessToken:getAccessToken(),replyType:$(".oncom").attr("replyType"),commentId:$(".oncom").attr("commentid"),replyId:$(".incom").attr("replyId"),content:eraseStyleInCopyText($(".form-control").val())}),
	timeout:15000,//10s
	dataType:"json",
	success: function (data) {
		if(data.code == 0){
			var str4="";
			if($(".oncom .adf_reply").children().length == 0){
				str4 +='<img src="images/Triangular.png" class="arr">';
				str4 +='<div replyId="'+ data.data.replyId+'" isMyReply="'+data.data.sMyReply+'" replyType="'+ data.data.replyType+'" class="adf_dis">';
				
			}else{
				str4 +='<div replyId="'+ data.data.replyId+'" isMyReply="1" replyType="'+ data.data.replyType+'" class="adf_dis">';
				}
			str4 +='<span replyUserId="'+data.data.replyUserId+'" class="replyUser infloor">'+data.data.replyUserNickName+'</span>:';
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
			$(".form-control").attr("placeholder","请输入评论内容");
			$(".ad_flbot").delay(500).fadeIn(100).fadeOut(1900);
			$(".successtips").html("评论成功");
			$(".form-control").val("").css("height","19px");
			//localStorage["a"] == "";
			if(data.data.addScore != "0"){
				alertNewScore("积分 +"+data.data.addScore);
			}
			$(".successtips").delay(500).fadeIn(100).fadeOut(1900);
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
	},'videoDeatil.html?postType=' +getParam('postType') +'&postId='+getParam('postId')+'&v=3.0.2.1488356107880');
	$(this).parent().parent().siblings().children().removeClass("reportthis");
	$(this).parent().parent().parent().addClass("reportthis").siblings().removeClass("reportthis");
	$(this).parent().parent().parent().siblings().children("adf_reply").children().removeClass("reportthis");
	$(this).parent().parent().parent().attr("targetType","1");
	$(this).parent().parent().parent().attr("targetId",$(this).parent().parent().parent().attr("commentid"))
})
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
	})
	
//点击自己评论的内容
$(".adf_dis").live('click',function(){
	$(".ad_flbot").show();
	$(".ad_flbtn").show();
	$(".ad_flbtn .ad_report").hide();
	$(".ad_flbtn .ad_aelbtn").hide();
	$(".adf_dis").removeClass("delthis");
	$(this).addClass("delthis");
	})
//点击删除楼层的按钮
$(".ad_aelbtn").live('click',function(){
	$(".ad_flbot").show();
	$(".ad_flbtn").hide();
	$(".ad_flbtn .ad_report").show();
	$(".ad_flbtn .ad_delinner").show();
	$(".ad_tcbox").show();
	})
//确认删除
$(".ad_suredel").live('click',function(){
	$.ajax({//采用异步
	type: "post",
	url: '/nggirl/app/cli/post/deleteComment/2.0.0',
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
		//myScroll.refresh(); 
		$(".successtips").html("删除成功");
		$(".successtips").fadeIn(100).fadeOut(1900);
		if($(".ad_comdet").children().length == 0){
			var str0 = "";
			str0 +='<div class="nonecom" ><img src="images/noappraise.png" /><p>暂无评论<br>等你来抢沙发~</p></div>';
			$(".ad_comdet").append(str0);
			}
		}else{
			alert(data.data.error);	
		}
	},
	error: function (XMLHttpRequest, textStatus, errorThrown) {
	}
	});
	})
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
	})
$(".adin_suredel").live('click',function(){
	$.ajax({//采用异步
	type: "post",
	url: '/nggirl/app/cli/post/deleteReply/2.0.0',
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
	})
//点击举报按钮
$(".ad_report,.ad_report1").live('click',function(){
	$(".form-tip").html("请输入评论内容");
	$(".ad_flbot").show();
	$(".ad_flbtn,.ad_flbtn1").hide();
	$(".ad_flbtn .ad_report").show();
	$(".ad_flbtn .ad_aelbtn").show();
	$(".ad_tcbox2").show();
	})
$(".ad_surereport").live('click',function(){
	$.ajax({//采用异步
	type: "post",
	url: '/nggirl/app/cli/post/report/2.0.0',
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
})
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
};
//为评论点赞与取消点赞
$(".adf_btn .comleftz").live('click',function(){
	var del=$(this);
    checkAccessTokenLogin(function () {
         var data = getFinalRequestObject({
             accessToken: getAccessToken()
         });
		$.ajax({//采用异步
			type: "post",
			url: '/nggirl/app/cli/post/praiseComment/2.5.3',
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
		}, 'allCommentNew.html' + window.location.search);
	
});
//判断是否禁言
function isNoTalk(){
	if(getParam('postType') == 1){
		$.ajax({//采用异步
			type: "get",
			url: '/nggirl/app/cli/post/getArticlePostDetail/2.2.0',
			data:getFinalRequestObject({accessToken:getAccessToken(),postId:getParam('postId'),postType:1}),
			timeout:15000,//10s
			dataType:"json",
			success: function (data) {
				if(data.code == 0){
					if(data.data.isNoTalk == 1){
						$(".de_box .form-control").blur();
						$(".talkTime").html(data.data.noTalkTime);
						$(".isNoTalk,.ad_flbot").show();
						$("body").css("overflow-y","hidden");
						$("body").bind("touchmove",function(event){
							event.preventDefault();
						});
					};
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
			}
		});
	}else{
		$.ajax({//采用异步
			type: "get",
			url: '/nggirl/app/cli/post/getVideoPostDetail/2.2.0',
			data:getFinalRequestObject({accessToken:getAccessToken(),postId:getParam('postId'),postType:2}),
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
				
			}
	});
}

};

