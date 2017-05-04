

$(function () {
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
        window.location.href = "workDetails.html?workId=" + $(this).attr('workId')+'&v=<%= VERSION %>';
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
        url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/getWorksDetail/1.2',
        type: 'get',
        data: requestData,
        dataType: 'json',
        success: function (data) {
            zhuangshuType = data.data.workType;
            feiyong = data.data.cost;
            workId = data.data.workId;
            $('.bh-left .bl-photo').attr('src', data.data.dresserProfile);
            $('.bh-name').html(data.data.dresserName);
			$('title').html('【南瓜姑娘】婚博会专场-'+data.data.workType);
            for (var x = 0; x < data.data.starLevel; x++) {
                $('.bh-start').append('<img src="images/start_03.jpg" alt="" /> ');
            }
			
			//折后价
			$('.discount').html('¥'+data.data.cost);
			
			//原价			
			//var cost = data.data.discount.cost;
			var cost = data.data.cost;
			$('.left-num').html(cost);

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
			var time = $('.ot-data').val();
           
			if(isInWeixin()){
				if(time == ''){
					window.location.href = getWeixinLinkUrl(getParam('workId'),$('.banner').attr('dresserId'),'请选择日期');
				}else{
					window.location.href = getWeixinLinkUrl(getParam('workId'),$('.banner').attr('dresserId'),$('.ot-data').val());
				}
			}else{
				if(time == ''){
					window.location.href = getZhifuBaoLinkUrl(getParam('workId'),$('.banner').attr('dresserId'),'请选择日期');
				}else{
					window.location.href = getZhifuBaoLinkUrl(getParam('workId'),$('.banner').attr('dresserId'),$('.ot-data').val());
				}
			}
        },'workDetails-nh.html'+window.location.search);
    });


  //点击“点赞”按钮
	fbtnFn();
	function fbtnFn(){
		$('.f-btn').click(function (e) {
 			checkAccessTokenLogin(function(){
				var data = getFinalRequestObject({
					accessToken: getAccessToken()
				});
			// 授权令牌有效
			//点击“点赞”按钮后就不让他再次点击
			 $('.f-btn').unbind('click');
			$.ajax({
				url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/praiseWork',
				type: 'get',
				data: requestData,
				dataType: 'json',
				success: function (data) {
					$('.f-btn').bind('click',fbtnFn);
					$('.f-btn').hide();//当前点击的点赞按钮隐藏
					$('.f-btn-cancle').show();//显示已点赞按钮
					//获取喜欢人的头像
					likePeoplePhotoFn();
				//获取喜欢人的总数
					likePeopleNumFn();
				}
			});
		},'workDetails-nh.html'+window.location.search);
	});
}
//取消点赞
fbtnCancleFn();
function fbtnCancleFn(){
	$('.f-btn-cancle').click(function (e) {
		checkAccessTokenLogin(function(){
			 //点击“取消点赞”按钮后就不让他再次点击
			$('.f-btn-cancle').unbind('click');
			$.ajax({
				url:'<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/cancelPraiseWork',
				type: 'get',
				data: requestData,
				dataType: 'json',
				success: function (data) {
					$('.f-btn-cancle').bind('click',fbtnCancleFn);
					$('.f-btn-cancle').hide();//隐藏已点赞按钮
					$('.f-btn').show();//显示未点赞按钮
					//获取喜欢人的头像
					likePeoplePhotoFn();
					//获取喜欢人的总数
					likePeopleNumFn();
				}
			});
		},'workDetails-nh.html'+window.location.search);
	});
}

//添加评价
	sendbtnFn();
	function sendbtnFn(){
		$('.comments-btn .send-btn').click(function(e) {
			if($('.comments-txt').val() == null || $('.comments-txt').val() == '' || $.trim($('.comments-txt').val()).length == 0){
				alert('小南瓜提示：请输入评价内容再提交哦！！');	
				$('.comments-txt').val('');
			}else{
				$('.comments-btn .send-btn').unbind('click');
				checkAccessTokenLogin(function(){
					$.ajax({
						url : '<%= CLI_HOST_API_URL %>/nggirl/app/cli/dresser/evaluateWork',  
						type : 'post',
						data : getFinalRequestObject({accessToken:getAccessToken(),workId:requestWorkId,evaluateContent:$('.comments-txt').val()}),
						dataType : 'json',  
						success : function(data){
							$('.comments-btn .send-btn').bind('click',sendbtnFn);
							$('.comments-txt').val('');
							$('.review-message>ul').children('li').remove();
							$('.pingjia').hide();
							loadPing(0);
						}
					});
				},'workDetails-nh.html'+window.location.search);
			}
		});
	}			
		
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

//耗时
        var timeUsed = data.data.timeUsed;
        $('.pr-minite').children('.blue').html(timeUsed);

//预约人数
        var reservationNum = data.data.reservationNum;
        $('.pr-yue').children('.blue').html(reservationNum);


//作品描述
        var descriptions = data.data.descriptions;
		descriptions = descriptions.replace(/\n/g,"<br/>");
        $('.p-content').html(descriptions);


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
	},'workDetails-nh.html'+window.location.search);	
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
	},'workDetails-nh.html'+window.location.search);
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
            for (var x = 0; x < data.data.length; x++) {
                //if(strIsEmpty(data.data[x].loverProfile)){
                $('.like-photo>ul').append("<li style=\"width:2.5rem; height:2.5rem;\"><img style=\"width:100%; height:100%;\" src=\"" + data.data[x].loverProfile + "\" /></li>");
                //}else{
//					$('.like-photo>ul').append("<li style=\"width:2.5rem; height:2.5rem;\"><img style=\"width:100%; height:100%;\" src=\"images/default-title-img.png\" /></li>");
//				}
            }
        }
    });
}

//获取喜欢人的总数
function likePeopleNumFn() {
    $.ajax({
        url:'<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/getLoverCount',
        type: 'get',
        data: requestData,
        dataType: 'json',
        success: function (data) {
            var loverCount = data.data.count;
            if (loverCount > 5) {
                $('.like-num').children('.num').html(loverCount);
                $('.add-circle').html(loverCount - 5 + '+');
            } else {
                $('.like-num').children('.num').html(loverCount);
                $('.add-circle').hide();
            }
        }
    });
}

function getWeixinLinkUrl(workId,dresserId,time){
    var redirectUri = encodeURIComponent(getZhifuBaoLinkUrl(workId,dresserId,time));
    var scope = 'snsapi_base';
    var state = "weixinpay";
    var appid = getFwhAppId();//由param.js初始化
    return "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri="
        +redirectUri+"&response_type=code&scope="+scope+"&state="+state+"#wechat_redirect";
}

function getZhifuBaoLinkUrl(workId,dresserId,time){
    var str = "<%= WEIXIN_BOUND_DOMAIN_URL %>/nggirl/h5/cosmetic/wantOrder-hbh.html?workId="
    + workId+ "&dresserId="+dresserId +"&time="+time+'&v=<%= VERSION %>';
    if(window.location.protocol == 'https:'){
        return str;
    }else{
        return 'http:' + str.substring(6)
    }
}


