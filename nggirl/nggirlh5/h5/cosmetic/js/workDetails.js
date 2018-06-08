var requestData = getFinalRequestObject({accessToken: getAccessToken(), workId: getParam('workId'), num: 10});
$(function () {
	//灰色弹框
	$('.gray_box').height($(window).height());
    localStorage.setItem('workId', getParam('workId'));
    var x = 0;
    var pwidth = $('.gl-pic ul li').width();
    var likeWidth = $('.like-photo ul li').width();
    var btnWidth = $('.btn-close').width();
    $('.btn-close').css('height', '' + btnWidth + 'px');  //设置底部关闭按钮的高度
    $('.like-photo ul>li').css({'height': '' + likeWidth + 'px', 'line-height': '' + likeWidth + 'px'});  //设置喜欢图片的高度

    $('.gl-pic ul>li').css('height', '' + pwidth + 'px');       //设置猜你喜欢图片高度

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

    var zhuangshuType = '';
    var feiyong = '';
    var workId = ''
    //获取化妆师个人信息
    $.ajax({
        url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/getWorksDetailIos/1.5.0',
        type: 'get',
        data: requestData,
        dataType: 'json',
        success: function (data) {
            $('.left-num').html(data.data.cost);//费用
            $('.pr-minite').children('.blue').html(data.data.timeUsed);//耗时
            $('.pr-yue').children('.blue').html(data.data.reservationNum);//预约人数
            $('.p-content').html('【'+data.data.workName+'】'+data.data.descriptions);//作品描述
			$('.dresser-img .di-img').attr('src',data.data.dresserProfile+'@80Q');//化妆师头像 
			$('.banner').attr('bizArea',data.data.bizArea);
			//判断化妆师是否加V
			if(data.data.isVDresser == 1){
				$('.dresser-img .di-v').show();	
			}
			if(data.data.dresserName.length>7){
				var strn=data.data.dresserName;
				strn= strn.substring(0,7)+"..." ; 
				$('.dresser-name .dn-name').html(strn);//化妆师姓名
				}else{
				$('.dresser-name .dn-name').html(data.data.dresserName);//化妆师姓名
				}
			//判断化妆师性别
			if(data.data.sex == 1){
				$('.dresser-name .dn-sex').attr('src','images/girl.png');	
			}
			if(data.data.sex == 0){
				$('.dresser-name .dn-sex').attr('src','images/boy.png');	
			}
			$('.dresser-start').html(getStartNumFn(data.data.starLevel));//获取化妆师星星个数
			$('.dresser-tag').html(getSpecialsNumFn(data.data.specials));//获取特长
			$('.dresser-message .dm-year').html(data.data.serviceYear);//从业年限
			$('.dresser-message .dm-num').html(data.data.orderNum);//接单量
			//猜你喜欢
            for (var x = 0; x < 3; x++) {
				//判断是否包含收单五折
				if(data.data.recommends[x].hasDiscount == 1){
					$('.gl-pic>ul').append('<li><img class="img" src="'+data.data.recommends[x].cover+'@80Q'+'" + workId="'+data.data.recommends[x].workId+'" /><p class="gp-title">'+data.data.workName+'</p><p class="gp-price"><span class="gp-xian">¥'+data.data.recommends[x].discount.cost+'</span> <span class="gp-yuan">¥'+data.data.recommends[x].price+'</span></p><img src="'+data.data.recommends[x].discount.icon+'" class="gp-icon" /></li>');
				}else{
					$('.gl-pic>ul').append('<li><img class="img" src="'+data.data.recommends[x].cover+'" + workId="'+data.data.recommends[x].workId+'" /><p class="gp-title">'+data.data.recommends[x].workName+'</p><p class="gp-price"><span class="gp-xian">¥'+data.data.recommends[x].price+'</span></p></li>');
				}
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

			//喜欢的人的头像
            for (var x = 0; x < 5 && x < data.data.lovers.length; x++) {
                if (data.data.lovers[x].loverProfile == '' || data.data.lovers[x].loverProfile == null || data.data.lovers[x].loverProfile == undefined) {
                    $('.like-photo>ul').append("<li style=\"width:2.5rem; height:2.5rem;\"><img style=\"width:100%; height:100%;\" src=\"images/default-title-img.png\" /></li>");
                } else {
                    $('.like-photo>ul').append("<li style=\"width:2.5rem; height:2.5rem;\"><img style=\"width:100%; height:100%;\" src=\"" + data.data.lovers[x].loverProfile +"@80Q"+"\" /></li>");
                }
            }
	
			//轮播图片
            for (var x = 0; x < data.data.contentPhoto.length; x++) {
                $('.imgw').append("<li><div><img src=\"" + data.data.contentPhoto[x] +'@80Q' + "\" /></div></li>");
                $('.banner>.clear').append("<li>" + x + "<li>");
            }
			var lilength=data.data.contentPhoto.length;
			$(".bot ul").css("width",18.4*lilength);
            $('.banner').attr('dresserId', data.data.dresserId);

//点击预约时间
			$('.order-date').change(function(e) {
				$('.gray_box').show();
				var re=new RegExp("[\\-,\\:, ]","g");				
				$.ajax({
					url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/getReservationTimes/1.3.2',
					type: 'get',
					data: getFinalRequestObject({
						accessToken: getAccessToken(),
						workId: getParam('workId'),
						num: 10,
						dresserId: $('.banner').attr('dresserId')
					}),
					dataType: 'json',
					success: function (data) {
						if(data.code == 0){
							$('.ot-data option').remove();	
							$('.ot-data').append('<option>选择预约时间</option>');		
							for (var x = 0; x < data.data.length; x++) {
								//判断日期是哪天
								if(data.data[x].realDate == $('#USER_AGE').val().replace(re, "")){
									for (var timeIndex in data.data[x].reservationTimes) {
										//判断预约状态
										if (data.data[x].reservationTimes[timeIndex].status == 0) {
											$('.ot-data').append('<option>'+
												data.data[x].reservationTimes[timeIndex].name + '</option>');
										}
									}
								}								
							}
							$('.gray_box').hide();
						}
						
						if(data.code == 1){
							alert(data.data.error);	
						}
					}
				});
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
			
			//点赞状态
			if(data.data.praiseStatus == 0){
				$('.f-btn').show();
			}
			if(data.data.praiseStatus == 1){
				$('.f-btn-cancle').show();
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
			//获取品牌
            function getBrandList(cosmeticsBrand) {
                var list = '';
                for (var i = 0; i < cosmeticsBrand.length; i++) {
                    list += "<div>" + cosmeticsBrand[i] + "</div>";
                }
                return list;
            }

            makeList(data.data.cosmetics);
            zhuangshuType = data.data.workType;
            feiyong = data.data.cost;
            workId = data.data.workId;
            $('.bh-left .bl-photo').attr('src', data.data.dresserProfile+"@80Q");
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

            //判断是否为收单五折作品
            if (data.data.hasDiscount == 1) {
                //显示首单五折信息
                $('.half').show();
                //添加折扣icon
                $('.banner').append('<img src="' + data.data.discount.icon + '" style="top:0px; right:0px; position:absolute; width:28%;" />');
                //添加原价
                $('.pi-left').append('<span class="yuan">原价：</span><span class="yuan yuanjia">¥' + data.data.cost + '</span>');
                //折后价
                $('.left-num').html(data.data.discount.cost);
                //首单五折title
                $('.half-title').html(data.data.discount.name);
                //首单五折content
                $('.half-content').html(data.data.discount.desc);
            }else{
                $('.left-num').html(data.data.cost);
            }
			
			//微信分享
            if(isInWeixin()){
            	var title = '【南瓜姑娘】上门美妆－'+data.data.workName;
                var desc = '化妆师你站住，快来让我也变成这样可以吗～';
                var link = window.location.href;
                var imgUrl = data.data.cover;
            	var from = getParam('apptype');
            	if(!strIsEmpty(from) && from == 'appb'){
            		desc = '化妆师你站住，快来让我也变成这样可以吗～';
            	}
                weixinConfig(title,desc,link,imgUrl);
            }	
			
			//h5,app同步分享内容
			if(isInApp()){
				window.shareTitle = '上门美妆－'+data.data.workName;
				window.shareContent = '化妆师你站住，快来让我也变成这样可以吗～';
				window.sharePicture = data.data.cover;
				window.shareUrl = window.location.href;
			};
			//给安卓传值
			if(typeof(window.ngjsInterface)!="undefined" && typeof(window.ngjsInterface.conFigShareInfo)!="undefined"){
				window.ngjsInterface.conFigShareInfo('上门美妆－'+data.data.workName, '化妆师你站住，快来让我也变成这样可以吗～',data.data.cover,window.location.href);
			};
        }
    });
/*if (/iphone|ipad|ipod/.test(ua)) {
	_czc.push(['_trackEvent','nggirl_meMakeAnAppointment','phoneType=iOS','我要预约','true','']);	
} else if (/android/.test(ua)) {
	_czc.push(['_trackEvent','nggirl_meMakeAnAppointment','phoneType=and','我要预约','true','']);
};*/
//点击“立即预约”按钮
	$('.f_center').off();
    $('.f_center').on("click",function (e) {
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_meMakeAnAppointment','phoneType=iOS','我要预约','true','']);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_meMakeAnAppointment','phoneType=and','我要预约','true','']);
		};
		//检查是否可以预约,如果可以预约则跳到预约页面
		checkAccessTokenLogin(function () {
			/*$('.f_center').unbind('click');*/
			localStorage.setItem('dresserId',$('.banner').attr('dresserid'));
			//存放时间，日期，商圈
			localStorage.setItem('date', $('#USER_AGE').val());
			localStorage.setItem('time', $('.ot-data option:selected').html());
			localStorage.setItem('workDetails_bizarea',$('.banner').attr('bizarea'));
			
			window.location.href = "wantOrder.html?dresserId=" + $('.banner').attr('dresserId')+"&v=<%= VERSION %>";
		}, 'workDetails.html' + window.location.search);
    });

//点击“点赞”按钮
    fbtnFn();
    function fbtnFn() {
        $('.f-btn').click(function (e) {
            checkAccessTokenLogin(function () {
                var data = getFinalRequestObject({
                    accessToken: getAccessToken()
                });
                // 授权令牌有效
                //点击“点赞”按钮后就不让他再次点击
                $('.f-btn').unbind('click');
                $.ajax({
                    url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/praiseWork/2.5.3',
                    type: 'POST',
                    data: requestData,
                    dataType: 'json',
                    success: function (data) {
                        $('.f-btn').bind('click', fbtnFn);
                        $('.f-btn').hide();//当前点击的点赞按钮隐藏
                        $('.f-btn-cancle').show();//显示已点赞按钮
                        //获取喜欢人的头像
                        likePeoplePhotoFn();
                        //获取喜欢人的总数
                        likePeopleNumFn();
                        fbtnFn();
						if (/iphone|ipad|ipod/.test(ua)) {
							 _czc.push(['_trackEvent','nggirl_ThumbUp','phoneType=iOS','点赞','true','']);	
						} else if (/android/.test(ua)) {
							 _czc.push(['_trackEvent','nggirl_ThumbUp','phoneType=and','点赞','true','']);
						};
						if(data.data.addScore != "0" && data.data.addScore != undefined){
							  alertNewScore("积分 +"+data.data.addScore);
						  }
                    }
                });
            }, 'workDetails.html' + window.location.search);
        });
    }

//取消点赞
    fbtnCancleFn();
    function fbtnCancleFn() {
        $('.f-btn-cancle').click(function (e) {
            checkAccessTokenLogin(function () {
                //点击“取消点赞”按钮后就不让他再次点击
                $('.f-btn-cancle').unbind('click');
                $.ajax({
                    url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/cancelPraiseWork',
                    type: 'get',
                    data: requestData,
                    dataType: 'json',
                    success: function (data) {
                        $('.f-btn-cancle').bind('click', fbtnCancleFn);
                        $('.f-btn-cancle').hide();//隐藏已点赞按钮
                        $('.f-btn').show();//显示未点赞按钮
                        //获取喜欢人的头像
                        likePeoplePhotoFn();
                        //获取喜欢人的总数
                        likePeopleNumFn();
                        fbtnCancleFn();
                    }
                });
            }, 'workDetails.html' + window.location.search);
        });
    }

//收藏作品
    $('.z-kinds').live('touchstart', function (e) {
        checkAccessTokenLogin(function () {
            $.ajax({
                url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/collectWork/2.5.3',
                type: 'post',
                data: getFinalRequestObject({accessToken: getAccessToken(), workId: getParam('workId')}),
                dataType: 'json',
                success: function (data) {
                    $('.z-kinds').hide();
                    $('.zz-kinds').show();
					if (/iphone|ipad|ipod/.test(ua)) {
						_czc.push(['_trackEvent','nggril_clickCollection','phoneType=iOS','点击收藏','true','']);	
					} else if (/android/.test(ua)) {
						_czc.push(['_trackEvent','nggril_clickCollection','phoneType=and','点击收藏','true','']);
					};
					if(data.data.addScore != "0" && data.data.addScore != undefined){
						alertNewScore("积分 +"+data.data.addScore);
					}
                }
            });
        }, 'workDetails.html' + window.location.search);
    });

//取消收藏
    $('.zz-kinds').live('touchstart', function (e) {
        checkAccessTokenLogin(function () {
            $.ajax({
                url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/cancelCollectWork',
                type: 'post',
                data: getFinalRequestObject({accessToken: getAccessToken(), workId: getParam('workId')}),
                dataType: 'json',
                success: function (data) {
                    $('.z-kinds').show();
                    $('.zz-kinds').hide();
                }
            });
        }, 'workDetails.html' + window.location.search);
    });
	
//点击”关于我“
	$('.dresser-three-img .dti-about:eq(0)').click(function(e) {
        window.location.href = "aboutdresser.html?dresserId=" + $('.banner').attr('dresserid')+'&v=<%= VERSION %>';
    });
	
//点击”用户评价“
	$('.dresser-three-img .dti-about:eq(1)').click(function(e) {
        window.location.href = "userappraise.html?dresserId=" + $('.banner').attr('dresserid')+'&v=<%= VERSION %>';
    });
	
//点击”服务商圈“
	$('.dresser-three-img .dti-about:eq(2)').click(function(e) {
        window.location.href = "servicecircle.html?dresserId=" + $('.banner').attr('dresserid')+'&v=<%= VERSION %>';
    });
	
//点击化妆师头像，进入化妆师主页
	$('.di-img').click(function(e) {
        window.location.href = "space.html?dresserId=" + $('.banner').attr('dresserid')+"&v=<%= VERSION %>";
    });

});


//获取用户评价星级
function startFn(s) {
    var start = '';
    for (var x = 0; x < s; x++) {
        start += '<img src="images/shaidan-star_03.png" alt="" />';
    }
    return start;
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
			var loverNum = data.data.length >5 ?5:data.data.length;
            for (var x = 0; x < loverNum; x++) {
                $('.like-photo>ul').append("<li style=\"width:2.5rem; height:2.5rem;\"><img style=\"width:100%; height:100%;\" src=\"" + data.data[x].loverProfile+'@80Q' + "\" /></li>");
            }
        }
    });
}

//获取化妆师星星个数
function getStartNumFn(num){
	var str = '';
	for(var x = 0; x < num; x ++){
		str += '<img src="images/small-start.png" class="ds-start" alt="" />' ;	
	}
	return str;
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

//获取化妆师特长
function getSpecialsNumFn(strArr){
	var str = '';
	if(strArr.length != 0){
		strArr = strArr.split(',');
		for(var x = 0; x< strArr.length; x ++){
			str += '<span>'+strArr[x]+'</span>' +' ';	
		}
	}
	return str;
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
				$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/personalInfo/shareSuccess/2.0.0',
				getFinalRequestObject({accessToken: getAccessToken(),
				shareType:1,
				contentType:'wrok',
				contentInfo:getParam('workId')
				})
				,function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						if (/iphone|ipad|ipod/.test(ua)) {
							_czc.push(['_trackEvent','nggirl_clickShare','phoneType=iOS','点击分享','true','']);	
						} else if (/android/.test(ua)) {
							_czc.push(['_trackEvent','nggirl_clickShare','phoneType=and','点击分享','true','']);
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
				contentType:'wrok',
				contentInfo:getParam('workId')
				})
				,function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						if (/iphone|ipad|ipod/.test(ua)) {
							_czc.push(['_trackEvent','nggirl_clickShare','phoneType=iOS','点击分享','true','']);	
						} else if (/android/.test(ua)) {
							_czc.push(['_trackEvent','nggirl_clickShare','phoneType=and','点击分享','true','']);
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