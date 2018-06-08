var page = 0;
$(function(){
	if (/iphone|ipad|ipod/.test(ua)) {
		_czc.push(['_trackEvent','phoneType=iOS','一粒红尘_ios']);	
	} else if (/android/.test(ua)) {
		_czc.push(['_trackEvent','phoneType=and','一粒红尘_and']);
	};
	$('.isWei').height($(window).height());
	
	if(isInApp()){
		$('.btn,.downLoad').addClass('hidden');
		$('.btn_enjoy').removeClass('hidden');
		$('.content').css('margin-top','0');
	}else{
		$('.btn,.downLoad').removeClass('hidden');
		$('.btn_enjoy').addClass('hidden');
		$('.content').css('margin-top','64');
	}
	
	//
	$('.isWei img').click(function(e) {
        $('.isWei').addClass('hidden');
		$('body,html').removeClass('gray_hidden');
		$("body").unbind('touchmove');
    });
	
	//关闭悬浮导航
	$('.closeTip').click(function(e) {
        $('.downLoad').addClass('hidden');
		$('.content').css('margin-top','0');
    });
	
	//上传图片0
	$('#file0').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('#img0').attr('src',data.result.data.url);
		}
	});
	$('#img0').click(function(e) {
		$('#file0').click();
	});
	
	//点击分享按钮
	$('.btn_enjoy').click(function(e) {
        $('.isWei').removeClass('hidden');
		$('body,html').addClass('gray_hidden');
		$("body").bind("touchmove",function(event){
			event.preventDefault();
		});
    });
	
	//打开按钮
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
	
	//上传图片1
	$('#file1').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('#img1').attr('src',data.result.data.url);
		}
	});
	$('#img1').click(function(e) {
		$('#file1').click();
	});
	

	$('.cu_bottom .img').live('click',function(e) {
		$('body,html').addClass('gray_hidden');
        $('.gray').show();
		$('.gray img').attr('src',$(this).attr('src')).css('top',($('.gray').height()-$('.gray img').height())/2);
			$("body").bind("touchmove",function(event){
				event.preventDefault();
			});
    });
	
	$('.gray').click(function(e) {
        $(this).hide();
		$('body,html').removeClass('gray_hidden');
		$("body").unbind('touchmove');
    });
		
	//点击我要参加活动
	$('.btn').click(function(e) {
		var btn = $(this);
		checkAccessTokenLogin(function () {
			var data = getFinalRequestObject({
				accessToken: getAccessToken()
			});
			
			if(btn.hasClass('a') && btn.attr('isStart') == 1){//参加过活动并且活动已结束
				alertFn('活动已经结束啦~');	
			}else if(btn.hasClass('a') && btn.attr('isStart') == 0){//参加过活动并且活动未结束
				alertFn('您已参加过活动啦~');	
			}else if(!btn.hasClass('a') && btn.attr('isStart') == 0){//未参加过活动并且互动未结束
				$('.content,.downLoad').addClass('hidden');
				$('.file_img_content').removeClass('hidden');
				$('.fic_img img').height($('.fic_img img').width());
			}else if(!btn.hasClass('a') && btn.attr('isStart') == 1){//未参加过活动并且活动已结束
				alertFn('活动已经结束啦~');	
			}	
		},'../mobile/makeupActivity.html' + window.location.search);
    });
	
		
	//点赞
	$('.cu_zan_num').live('touchstart',function(e) {
		 var btn = $(this);
		 checkAccessTokenLogin(function () {
			 var data = getFinalRequestObject({
				 accessToken: getAccessToken()
			 });
			//判断活动时间是否已结束
			if($('body').attr('isStart') == 1){//活动已结束
				alertFn('活动已经结束啦~');
			}else{
				if(btn.attr('isPraise') == 0){//点赞
					$.post('<%= UGC_HOST_API_URL %>/nggirl/app/cli/activity/faceMakeupGame/praise',getFinalRequestObject({accessToken:getAccessToken(),anmcId:btn.attr('anmcId')}),function(data){
						var data = $.parseJSON(data);
						if(data.code == 0){
							btn.children('img').attr('src','images/makeupActivity/zan_orange.png');
							btn.attr('isPraise',1);
							btn.children('span').html(parseInt(btn.children('span').html())+1);
						}else{
							alert(data.data.error);	
						}
					});
				}else{
					$.post('<%= UGC_HOST_API_URL %>/nggirl/app/cli/activity/faceMakeupGame/removePraise',getFinalRequestObject({accessToken:getAccessToken(),anmcId:btn.attr('anmcId')}),function(data){
						var data = $.parseJSON(data);
						if(data.code == 0){
							btn.children('img').attr('src','images/makeupActivity/zan_white.png');
							btn.attr('isPraise',0);
							btn.children('span').html(parseInt(btn.children('span').html())-1);
						}else{
							alert(data.data.error);	
						}
					});
				}
			}
		}, '../mobile/makeupActivity.html' + window.location.search);
    });
	
	//返回到列表页
	$('.ft_left').click(function(e) {
        $('.file_img_content').addClass('hidden');
		$('.content,.downLoad').removeClass('hidden');
    });
	
	//发表评论
	$('.ft_right').click(function(e) {
		var btn = $(this);
		if(!btn.hasClass('on')){
			btn.addClass('on');
			if($('#img0').attr('src').indexOf('../cosmetic/images/default-title-img.png')>= 0){
				btn.removeClass('on');
				alertFn('请上传第一张图片~');	
			}else if($('#img1').attr('src').indexOf('../cosmetic/images/default-title-img.png')>= 0){
				btn.removeClass('on');
				alertFn('请上传第二张图片~');	
			}else{
				$.post('<%= UGC_HOST_API_URL %>/nggirl/app/cli/activity/faceMakeupGame/publicComment',getFinalRequestObject({accessToken:getAccessToken(),commentInfo:$.trim($('.fic_content').val()),beforeUrl:$('#img0').attr('src'),afterUrl:$('#img1').attr('src')}),function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						btn.removeClass('on');
						$('.file_img_content').addClass('hidden');
						$('.content,.downLoad').removeClass('hidden');
						$('.content_ul').html('');
						$('.fic_content').val('');
						$('.fic_img').html('');
						page = 0;
						getNextPage(page);
					}else{
						alert(data.data.error);	
					}
				});
			}
		};
    });
	
	//列表
	getNextPage(page);
	
	//页数++
	function PageNumPP(){
		var pageNum = $('body').data('pageNum');//在body里面存储page
		if(page == undefined || parseInt(page) == NaN){
			page = 0;
		}
		page = page + 1;
		$('body').data('page',page);
		getNextPage(page);
	}
	
	//判断accesstoken是否有效
	function getNextPage(page){
		//获取评论列表
		$.get('<%= UGC_HOST_API_URL %>/nggirl/app/cli/activity/faceMakeupGame/getCommentList',getFinalRequestObject({accessToken:getAccessToken(),pageNum:page}),function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				if(data.data.isCommit == 1){//已评论
					$('.btn').addClass('a');
				};
				$('.btn,body').attr('isStart',data.data.isStart);
				//判断活动是否结束
				if(data.data.isStart == 1){
					$('.endPara').removeClass('hidden');
				}else{
					$('.endPara').addClass('hidden');
				}
				if(data.data.activityMakeupCommentViewList.length > 0){
					if( data.data.activityMakeupCommentViewList.length == 8 ){
						$(".pullUpIcon").show();
						var tur = true;	
						$(window).scroll(function(){
							var winH = $(window).height(); //浏览器当前窗口可视区域高度  
							var pageH = $(document.body).height(); //浏览器当前窗口文档body的高度 
							var scrollT = $(window).scrollTop(); //滚动条top  
							var lastPersentH = (pageH - winH - scrollT) / winH;  
							if(tur && lastPersentH < 1){ 
							tur = false;
							setTimeout(function(){
							  PageNumPP();
							  },500);
						   }
					   });
					}else{
						$(".pullUpIcon").hide();
					}
				}else{
					$(".pullUpIcon").hide();
				}
				var dataList = data.data.activityMakeupCommentViewList;
				for(var x = 0; x < dataList.length ; x ++){
					$('.content_ul').append('<div class="content_li"><div class="cu_top"><img userId='+dataList[x].userId+' src="'+dataList[x].userAvatar+'" alt="" class="user_img" />'+getPageImg(x,page,data.data.isStart)+'<div class="cu_name_time"><p class="name">'+dataList[x].userName+'</p><p class="time">'+dataList[x].seq+'楼 '+dataList[x].commentTime+'</p></div><div class="cu_zan_num" anmcId='+dataList[x].anmcId+' isPraise='+dataList[x].isPraise+'>'+getZanStatusFn(dataList[x].isPraise,dataList[x].commentPraiseNum)+'</div></div><div class="cu_bottom"><div class="before"><img class="img" src="'+dataList[x].beforeUrl+'" alt="" /><p class="white_title">before</p></div><div class="after"><img class="img" src="'+dataList[x].afterUrl+'" alt="" /><p class="white_title">after</p></div><p class="cb_desc">'+dataList[x].commentInfo+'</p></div></div>');	
				}
				$('.img').css('height',$('.img').width());
			}else{
				alert(data.data.error);	
			}
		});
	}
		
	//仅第一页显示皇冠
	function getPageImg(x,page,isStart){
		var str = '';
		if(page == 0){
			if(isStart == 0){
				str = '';
			}else{
				str = '<img src="images/makeupActivity/crown_'+x+'.png" alt="" class="crown_img" />';
			}
		};
		return str;
	}
	
	//获取点赞状态
	function getZanStatusFn(status,num){
		str = '';
		if(!strIsEmpty(getAccessToken())){
			var data = getFinalRequestObject({
			 accessToken: getAccessToken()
			});
			if(status == 0){
				str = '<img src="images/makeupActivity/zan_white.png" alt="" class="zan" /><span class="num">'+num+'</span>';
			}else{
				str = '<img src="images/makeupActivity/zan_orange.png" alt="" class="zan" /><span class="num">'+num+'</span>';
			}
		}else{
			str = '<img src="images/makeupActivity/zan_white.png" alt="" class="zan" /><span class="num">'+0+'</span>';
		}
		return str;	
	}
	
	//微信分享
	if(isInWeixin()){
		var str = window.location.href;
		var title = '一粒红尘×南瓜姑娘 最独特的素颜大赛';
		var desc = '与剧中主演比美，要不要试试？';
		var link = window.location.href;
		var imgUrl = 'https://photosd.nggirl.com.cn/work/28541c0a04fe4654b0f0d74cb4878aaf.jpg';
		var from = getParam('apptype');
		if(!strIsEmpty(from) && from == 'appb'){
			desc = '与剧中主演比美，要不要试试？';
		}
		weixinConfig(title,desc,link,imgUrl);
	}
	
	var href = window.location.href;
	//h5,app同步分享内容
	if(isInApp()){
		window.shareTitle = '一粒红尘×南瓜姑娘 最独特的素颜大赛';
		window.shareContent = '与剧中主演比美，要不要试试？';
		window.sharePicture = 'https://photosd.nggirl.com.cn/work/28541c0a04fe4654b0f0d74cb4878aaf.jpg';
		window.shareUrl = href;
	};	
	//给安卓传值
	if(typeof(window.ngjsInterface)!="undefined" && typeof(window.ngjsInterface.conFigShareInfo)!="undefined"){
		window.ngjsInterface.conFigShareInfo('一粒红尘×南瓜姑娘 最独特的素颜大赛', '与剧中主演比美，要不要试试？','https://photosd.nggirl.com.cn/work/28541c0a04fe4654b0f0d74cb4878aaf.jpg');
	};
})


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

