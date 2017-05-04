
$(function () {
	//关闭顶部悬浮框
	$('.close').click(function(e) {
		$('.header').slideUp();
		$('.white-tiao').slideUp();
	});
	
    var x = 0;
    var pwidth = $('.gl-pic ul li').width();
    var likeWidth = $('.like-photo ul li').width();
    var btnWidth = $('.btn-close').width();
    $('.btn-close').css('height', '' + btnWidth + 'px');  //设置底部关闭按钮的高度
    $('.like-photo ul>li').css({'height': '' + likeWidth + 'px', 'line-height': '' + likeWidth + 'px'});  //设置喜欢图片的高度

    $('.gl-pic ul>li').css('height', '' + pwidth + 'px');       //设置猜你喜欢图片高度

    loadShai(0);//初始化晒单
	
//化妆师页面
	$('.box-hzs').click(function(e) {
        window.location.href="space.html?dresserId="+$('.banner').attr('dresserId')+'&v=<%= VERSION %>';
    });
	
//点击查看更多晒单
    var shainum = 0;
    $('.look-more-shai').click(function (e) {
        shainum += 1;
        loadShai(shainum);
    });

    //点击喜欢的图片展开对应的图片信息 -->
    $('.gl-pic>ul>li img').live("click", function (e) {
        window.location.href = "workDetails-share.html?workId=" + $(this).attr('workId')+'&v=<%= VERSION %>';
    });

    //显示所有化妆品种类 -->
    $('.zk-right').click(function (e) {
        if (x % 2 == 0) {
            $('.zk-arrdown').children('img').attr('src', 'images/arr-up.png');
            $('.zk-txt').html('收起');
            $('.pro-kinds>dl').slideDown();
            $('.pro-kinds dl dd>div').slideDown();
        } else {
            $('.zk-arrdown').children('img').attr('src', 'images/arr-down_03.png');
            $('.zk-txt').html('展开');
            $('.pro-kinds>dl:gt(2)').slideUp();
            $('.pro-kinds>dl:eq(0) div:eq(0)').slideDown().siblings().slideUp();
            $('.pro-kinds>dl:eq(1) div:eq(0)').slideDown().siblings().slideUp();
            $('.pro-kinds>dl:eq(2) div:eq(0)').slideDown().siblings().slideUp();
        }
        x++;
    });

    //tab栏切换 -->
    $('.double-btn>div:eq(0)').click(function (e) {
        $(this).addClass('db-on').siblings().removeClass('db-on');
        $('.double-box .left-box').show();
        $('.double-box .right-box').hide();
    });
    $('.double-btn>div:eq(1)').click(function (e) {
        $(this).addClass('db-on').siblings().removeClass('db-on');
        $('.double-box .left-box').hide();
        $('.double-box .right-box').show();
    });

    var zhuangshuType = '';
    var feiyong = '';
    var workId = ''
    //获取化妆师个人信息
    $.ajax({
        url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/getWorksDetail',
        type: 'get',
        data: requestData,
        dataType: 'json',
        success: function (data) {
            zhuangshuType = data.data.workType;
            feiyong = data.data.cost;
            workId = data.data.workId;
            $('.bh-left .bl-photo').attr('src', data.data.dresserProfile);
            $('.bh-name').html(data.data.dresserName);
            for (var x = 0; x < data.data.starLevel; x++) {
                $('.bh-start').append('<img src="images/start_03.jpg" alt="" /> ');
            }
            


            //判断是否加V
            if (data.data.isVDresser == 0) {
                $('.img-vip').hide();
            }
            if (data.data.isVDresser == 1) {
                $('.img-vip').show();
            }

            //判断化妆师性别
            if (data.data.isVDresser == 0) {
                $('.sex1').show();
                $('.sex0').hide();
            }
            if (data.data.isVDresser == 1) {
                $('.sex1').hide();
                $('.sex0').show();
            }
			
			//微信分享信息
            if(isInWeixin()){
            	var title = '【南瓜姑娘】上门美妆－作品详情';
                var desc = '化妆师你站住，快来让我也变成这样可以吗～';
                var link = window.location.href;
                var imgUrl = data.data.cover;
            	var from = getParam('apptype');
            	if(!strIsEmpty(from) && from == 'appb'){
            		desc = '南瓜粉丝已被我的作品美哭！联系我为你打造专属造型~';
            	}
                weixinConfig(title,desc,link,imgUrl);
            }
        }
    });

//点击“立即预约”按钮
    $('.f-center').click(function (e) {

        //检查是否可以预约,如果可以预约则跳到预约页面
        checkAccessTokenLogin(function(){
            $('.f-center').unbind('click');
            localStorage.setItem('workType', zhuangshuType);
            localStorage.setItem('cost', '¥' + feiyong);
            localStorage.setItem('time', $('.ot-data option:selected').html());
            localStorage.setItem('dresserId', $('.banner').attr('dresserId'));

            window.location.href = "wantOrder.html?price="+feiyong+"&dresserId="+$('.banner').attr('dresserId')+'&v=<%= VERSION %>';
        },'workDetails-share.html'+window.location.search);

    });


//点击“点赞”按钮
    $('.f-btn').click(function (e) {
		
		checkAccessTokenLogin(function(){
			var data = getFinalRequestObject({
				accessToken: getAccessToken()
			});
		
			// 授权令牌有效
			//点击“点赞”按钮后就不让他再次点击
			$(this).attr('disabled', 'true');
			$.ajax({
				url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/praiseWork',
				type: 'get',
				data: requestData,
				dataType: 'json',
				success: function (data) {
					$(this).attr('disabled', 'false');
					$('.f-btn').hide();//当前点击的点赞按钮隐藏
					$('.f-btn-cancle').show();//显示已点赞按钮
					//获取喜欢人的头像
					likePeoplePhotoFn();
					//获取喜欢人的总数
					likePeopleNumFn();
				}
			});
		},'workDetails-share.html'+window.location.search);
    });
//取消点赞
    $('.f-btn-cancle').click(function (e) {
		checkAccessTokenLogin(function(){
			 //点击“取消点赞”按钮后就不让他再次点击
			$(this).attr('disabled', 'true');
			$.ajax({
				url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/cancelPraiseWork',
				type: 'get',
				data: requestData,
				dataType: 'json',
				success: function (data) {
					$(this).attr('disabled', 'false');
					$('.f-btn-cancle').hide();//隐藏已点赞按钮
					$('.f-btn').show();//显示未点赞按钮
					//获取喜欢人的头像
					likePeoplePhotoFn();
					//获取喜欢人的总数
					likePeopleNumFn();
				}
			});
		},'workDetails-share.html'+window.location.search);
    });

//添加评价
		$('.comments-btn .send-btn').click(function(e) {
			checkAccessTokenLogin(function(){
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl/app/cli/dresser/evaluateWork',  
					type : 'post',
					data : getFinalRequestObject({accessToken:getAccessToken(),workId:requestWorkId,evaluateContent:$('.comments-txt').val()}),
					dataType : 'json',  
					success : function(data){
						if($('.comments-txt').val() == null || $('.comments-txt').val() == ''){
						    alert('小南瓜提示：请输入评价内容再提交哦！！');	
						}else{
							$('.comments-txt').val('');
							$('.review-message>ul').children('li').remove();
							$('.pingjia').hide();
							loadPing(0);
						}
					}
				});
			},'workDetails-share.html'+window.location.search);
		});
		
		
//点击查看更多评价
		var pingnum = 0;
		$('.look-more-ping').click(function(e) {
			pingnum +=1;
			loadPing(pingnum);
        });
	});

		var requestWorkId = getParam('workId');
		localStorage.setItem('workId',getParam('workId'));
		var requestData = getFinalRequestObject({accessToken:getAccessToken(),workId:requestWorkId,num:10});
		$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/getWorksDetailAll',  
			type : 'get',
			data : requestData,
			dataType : 'json',  
			success : function(data){
//费用			
        var cost = data.data.cost;
        $('.left-num').html(cost);

//耗时
        var timeUsed = data.data.timeUsed;
        $('.pr-minite').children('.blue').html(timeUsed);

//预约人数
        var reservationNum = data.data.reservationNum;
        $('.pr-yue').children('.blue').html(reservationNum);


//作品描述
        var descriptions = data.data.descriptions;
        $('.p-content').html(descriptions);

//猜你喜欢
        for (var x = 0; x < 3; x++) {
			if(x == 2){
				//$('.gl-pic ul li:eq(2)').css('margin','.43rem 0 0 0');
			}
            $('.gl-pic>ul').append("<li><img src=\"" + data.data.recommends[x].cover + "\" " + "workId=" + data.data.recommends[x].workId + " /><div class=\"gp-circle-pink\">" + data.data.recommends[x].praiseNum + "</div></li>");
        }

//判断是否点赞			
        if (data.data.praiseStatus == 0) {
            $('.f-btn').show();
            $('.f-btn-cancle').hide();
        }
        if (data.data.praiseStatus == 1) {
            $('.f-btn').hide();
            $('.f-btn-cancle').show();
        }
//喜欢的人数			
        var loverCount = data.data.loverCount;
        if (loverCount > 5) {
            $('.like-num').children('.num').html(loverCount);
            $('.add-circle').html(loverCount - 5 + '+');
        } else {
            $('.like-num').children('.num').html(loverCount);
            $('.add-circle').hide();
        }

//评论数			
        var evaluationCount = data.data.evaluationCount;
        if (evaluationCount == 0) {
            $('.pingjia').show();
            $('.look-more-ping').hide();
        } else if (evaluationCount > 10) {
            $('.look-more-ping').show();
        } else {
            $('.look-more-ping').hide();
            $('.pingjia').hide();
        }

//作品标签列表
        var tags = data.data.tags;
        if (tags.length == 0 || tags == null) {
            $('.c-style').children('span').remove();
        } else {
            for (var x = 0; x < tags.length; x++) {
                $('.c-style').append("<span>" + tags[x] + "</span>");
            }
        }

//评论用户头像
        if (data.data.evaluations.length == 0) {
            $('.pingjia').show();
            $('.look-more-ping').hide();
        } else if (data.data.evaluations.length > 0 && data.data.evaluations.length < 10) {
            for (var x = 0; x < 10 && x < data.data.evaluations.length; x++) {
                $('.review-message>ul').append("<li><div class=\"phot-per\"><div class=\"rm-left\"><img src=\"" + data.data.evaluations[x].evaluateProfile + "\"/></div></div><div class=\"rm-right\"><div class=\"rr-left\"><p class=\"rl-name\">" + data.data.evaluations[x].evaluateName + "</p><p class=\"rl-review\">" + data.data.evaluations[x].evaluation + "</p></div><div class=\"rr-right\">" + getLocalTime(data.data.evaluations[x].evaluateTime) + "</div></div></li>");
                $('.pingjia').hide();
                $('.look-more-ping').hide();
            }
        } else {
            for (var x = 0; x < 10 && x < data.data.evaluations.length; x++) {
                $('.review-message>ul').append("<li><div class=\"phot-per\"><div class=\"rm-left\"><img src=\"" + data.data.evaluations[x].evaluateProfile + "\"/></div></div><div class=\"rm-right\"><div class=\"rr-left\"><p class=\"rl-name\">" + data.data.evaluations[x].evaluateName + "</p><p class=\"rl-review\">" + data.data.evaluations[x].evaluation + "</p></div><div class=\"rr-right\">" + getLocalTime(data.data.evaluations[x].evaluateTime) + "</div></div></li>");
            }
        }


//喜欢的人的头像			
        for (var x = 0; x < 5 && x < data.data.lovers.length; x++) {
            if (data.data.lovers[x].loverProfile == '' || data.data.lovers[x].loverProfile == null || data.data.lovers[x].loverProfile == undefined) {
                $('.like-photo>ul').append("<li style=\"width:2.5rem; height:2.5rem;\"><img style=\"width:100%; height:100%;\" src=\"images/default-title-img.png\" /></li>");
            } else {
                $('.like-photo>ul').append("<li style=\"width:2.5rem; height:2.5rem;\"><img style=\"width:100%; height:100%;\" src=\"" + data.data.lovers[x].loverProfile + "\" /></li>");
            }
        }


//轮播图片
        for (var x = 0; x < data.data.contentPhoto.length; x++) {
            $('.imgw').append("<li><div><img src=\"" + data.data.contentPhoto[x] + "\" /></div></li>");
            $('.banner>.clear').append("<li>" + x + "<li>");
        }
        $('.banner').attr('dresserId', data.data.dresserId);

//点击预约时间
        $.ajax({
            url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/getReservationTimes',
            type: 'get',
            data: getFinalRequestObject({
                accessToken: getAccessToken(),
                workId: requestWorkId,
                num: 10,
                dresserId: $('.banner').attr('dresserId')
            }),
            dataType: 'json',
            success: function (data) {
                for (var x = 0; x < data.data.length; x++) {
                    for (var timeIndex in data.data[x].reservationTimes) {
                        //判断预约状态
                        if (data.data[x].reservationTimes[timeIndex].status == 0) {
                            $('.ot-data').append('<option>' + data.data[x].reservationDate + '&nbsp;' +
                                data.data[x].reservationTimes[timeIndex].name + '</option>');
                        }
                    }
                }
            }
        });


//收藏状态
        if (data.data.collectStatus == 0) {
            $('.z-kinds').show();
            $('.zz-kinds').hide();
        }
        if (data.data.collectStatus == 1) {
            $('.z-kinds').hide();
            $('.zz-kinds').show();
        }

//banner切换
        TouchSlide({
            slideCell: "#slideBox",
            titCell: ".hd ul", //开启自动分页 autoPage:true ,此时设置 titCell 为导航元素包裹层
            mainCell: ".bd ul",
            effect: "left",
            autoPage: true, //自动分页
            autoPlay: true, //自动播放
            interTime: 3000
        });

//化妆品种类 
        function makeList(cosmetics) {
            for (var x = 0; x < cosmetics.length; x++) {
                $('.pro-kinds').append("<dl><dt>" + cosmetics[x].cosmeticsClass + "<dt><dd>" + getBrandList(cosmetics[x].cosmeticsBrand) + "</dd><dl>");
            }
        }

        function getBrandList(cosmeticsBrand) {
            var list = '';
            for (var i = 0; i < cosmeticsBrand.length; i++) {
                list += "<div>" + cosmeticsBrand[i] + "</div>";
            }
            return list;
        }

        makeList(data.data.cosmetics);

    },
});


//收藏作品
$('.z-kinds').live('touchstart', function (e) {
	checkAccessTokenLogin(function(){
		$.ajax({
			url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/collectWork',
			type: 'post',
			data: getFinalRequestObject({accessToken: getAccessToken(), workId: requestWorkId}),
			dataType: 'json',
			success: function (data) {
				$('.z-kinds').hide();
				$('.zz-kinds').show();
			}
		});
	},'workDetails-share.html'+window.location.search);	
});


//取消收藏
$('.zz-kinds').live('touchstart', function (e) {
	checkAccessTokenLogin(function(){
		$.ajax({
			url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/cancelCollectWork',
			type: 'post',
			data: getFinalRequestObject({accessToken: getAccessToken(), workId: requestWorkId}),
			dataType: 'json',
			success: function (data) {
				$('.z-kinds').show();
				$('.zz-kinds').hide();
			}
		});
	},'workDetails-share.html'+window.location.search);
});


//获取用户评价星级
function startFn(s) {
    var start = '';
    for (var x = 0; x < s; x++) {
        start += '<img src="images/shaidan-star_03.png" alt="" />';
    }
    return start;
}

//获取用户评价图片
function evaluationFn(photos) {
    var imgs = '';
    for (var x = 0; x < photos.length; x++) {
        imgs += '<img src="' + photos[x] + '" alt="" />';
    }
    return imgs;
}


//时间格式化
function getLocalTime(publishTime) {
    var d_minutes, d_hours, d_days;
    var timeNow = parseInt(new Date().getTime() / 1000);
    var d;
    d = timeNow - publishTime;
    d_days = parseInt(d / 86400);
    d_hours = parseInt(d / 3600);
    d_minutes = parseInt(d / 60);
    if (d_days > 0 && d_days < 4) {
        return d_days + "天前";
    } else if (d_days <= 0 && d_hours > 0) {
        return d_hours + "小时前";
    } else if (d_hours <= 0 && d_minutes > 0) {
        return d_minutes + "分钟前";
    } else {
        var s = 0;
        s = new Date(publishTime);
        return (s.getFullYear() + "年" + parseInt(s.getMonth() + 1)) + "月" + parseInt(s.getDate()) + "日";
    }
}

//获取用户晒单信息
function loadShai(shainum) {
    $.ajax({
        url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/getWorkEvaluateList',
        type: 'get',
        data: getFinalRequestObject({accessToken: getAccessToken(), workId: requestWorkId, num: 2, page: shainum}),
        dataType: 'json',
        success: function (data) {
            if (data.data.length < 2) {
                $('.look-more-shai').hide();
            } else {
                for (var x = 0; x < data.data.length; x++) {
                    $('.dan').append('<div class="shaidan"><div class="st-left"><img src="' + data.data[x].profile + '" alt="" /></div><div class="st-right"><div class="sr-top"><div class="st-txt"><p class="st-name">' + data.data[x].userName + '</p><p class="st-p">' + data.data[x].evaluation + '</p></div><div class="st-star">' + startFn(data.data[x].startLevel) + '</div></div><div class="sr-bottom">' + evaluationFn(data.data[x].photos) + '</div><p class="sr-date">' + getLocalTime(data.data[x].datetime) + '</p></div></div>');
                }
                $('.shai').hide();
            }

            if ($('.shaidan').length == 0) {
                $('.shai').show();
                $('.look-more-shai').hide();
            }
        }
    });
}

//加载评论
function loadPing(pingnum) {
    $.ajax({
        url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/listWorkEvaluation',
        type: 'get',
        data: getFinalRequestObject({accessToken: getAccessToken(), workId: requestWorkId, page: pingnum, num: 10}),
        dataType: 'json',
        success: function (data) {
            for (var x = 0; x < data.data.length; x++) {
                if (data.data[x].evaluateProfile == '' || data.data[x].evaluateProfile == null || data.data[x].evaluateProfile == undefined) {
                    $('.review-message>ul').append("<li><div class=\"phot-per\"><div class=\"rm-left\"><img src=\"images/default-title-img.png\"/></div></div><div class=\"rm-right\"><div class=\"rr-left\"><p class=\"rl-name\">" + data.data[x].evaluateName + "</p><p class=\"rl-review\">" + data.data[x].evaluation + "</p></div><div class=\"rr-right\">" + getLocalTime(data.data[x].evaluateTime) + "</div></div></li>");
                } else {
                    $('.review-message>ul').append("<li><div class=\"phot-per\"><div class=\"rm-left\"><img src=\"" + data.data[x].evaluateProfile + "\"/></div></div><div class=\"rm-right\"><div class=\"rr-left\"><p class=\"rl-name\">" + data.data[x].evaluateName + "</p><p class=\"rl-review\">" + data.data[x].evaluation + "</p></div><div class=\"rr-right\">" + getLocalTime(data.data[x].evaluateTime) + "</div></div></li>");
                }
            }
            $('.pingjia').hide();

            if ($('.review-message ul li').length == 0) {
                $('.pingjia').show();
                $('.look-more-ping').hide();
            }

            if (data.data.length < 10) {
                $('.look-more-ping').hide();
            } else {
                $('.look-more-ping').show();
            }
        }
    });
}

//获取喜欢人的头像
function likePeoplePhotoFn() {
    $.ajax({
        url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/listWorkLover',
        type: 'get',
        data: requestData,
        dataType: 'json',
        success: function (data) {
            $('.like-photo ul li:gt(0)').remove();
            $('.like-num').children('.num').html(data.data.count);
            for (var x = 0; x < 5; x++) {
                $('.like-photo>ul').append("<li style=\"width:2.5rem; height:2.5rem;\"><img style=\"width:100%; height:100%;\" src=\"" + data.data[x].loverProfile + "\" /></li>");
            }
        }
    });
}

//获取喜欢人的总数
function likePeopleNumFn() {
    $.ajax({
        url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/getLoverCount',
        type: 'get',
        data: requestData,
        dataType: 'json',
        success: function (data) {
            var loverCount = data.data.count;
            if (loverCount > 5) {
                $('.like-num').children('.num').html(loverCount);
                $('.add-circle').html(loverCount - 5 + '+');
				$('.add-circle').show();
            } else {
                $('.like-num').children('.num').html(loverCount);
                $('.add-circle').hide();
            }
        }
    });
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

    var currenturl = window.location.href;
    //初始化配置信息
    $.ajax({
        url:'<%= CLI_HOST_API_URL %>/nggirl/app/cli/weixinjs/config',
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