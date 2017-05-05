$(function () {
	//获取灰色弹框高度
	$('.loading').height($(window).height());
	
	//评价
	$(".li_workDetails .pingj").click(function(e) {
        $('.box').hide();
		$('.box-ping').slideDown();
    });

	//订单状态
	//var status = getParam('status');    //获取订单信息
    $.ajax({
        url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/reservationDetails/1.0',
        type: 'post',
        data: getFinalRequestObject({accessToken: getAccessToken(), reservationId: getParam('reservationId')}),
        dataType: 'json',
        success: function (data) {
			//判断订单状态
			/*订单状态为0*/
			if(data.data.status == 0){
				$('.cancle-booking-0').show();	
				$('.booking-details-title').html(getStatusDesc(data.data.status,data.data.praised));
				$('.booking-details-title').css('background','#fa6e64');
			}
			/*状态0  点击取消预约按钮*/
			$('.cancle-booking-0').click(function(e) {
				window.location.href = "cancleorder.html?status1="+data.data.status+"&reservationId="+getParam('reservationId')+'&v=<%= VERSION %>';
				/*0317$(this).unbind('click');
                $('.alert-box-cancle-booking').fadeIn();*/
            });
			/*状态0  点击状态0灰色屏幕弹框消失*/
			$('.alert-box-cancle-booking .gray-box').click(function(e) {
                $('.alert-box-cancle-booking').fadeOut();
            });
			/*状态0  点击取消预约*/
		/*	$('.wdb-cancle').click(function (e) {
				$.ajax({
					url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/cancelReservation/1.3.2',
					type: 'POST',
					data: getFinalRequestObject({accessToken: getAccessToken(), reservationId: getParam('reservationId')}),
					dataType: 'json',
					success: function (data) {
						if (data.code == 0) {
							$('.alert-box-cancle-booking').fadeOut();
							window.location.href = "order.html?order=3+'&v=<%= VERSION %>'";
						}
						;
						if (data.code == 1) {
							$('.alert-box-cancle-booking').fadeOut();
							alert(data.data.error);
						}
						;
					}
				});
			});*/
				$('.wdb-cancle').click(function (e) {
					window.location.href = "cancleorder.html?status1="+data.data.status+"&reservationId="+getParam('reservationId')+'&v=<%= VERSION %>';
				});
			/*订单状态1,5*/
			if(data.data.status == 1 || data.data.status == 5){
				$('.booking-details-title').css('background','#8c96a0');	
				$('.booking-details-title').html(getStatusDesc(data.data.status,data.data.praised));
			}
			
			/*订单状态2,3*/
			if(data.data.status == 2 || data.data.status == 3){
				$('.booking-details-title').css('background','#8c96a0');	
				$('.booking-details-title').html(getStatusDesc(data.data.status,data.data.praised));
			}
			
			/*订单状态4*/
			statusPayFn();
			function statusPayFn(){
				if(data.data.status == 4){
					$('.cancle-booking').show();
					$('.pay-btn').show();
					//判断是否是在微信内打开时显示的图标
					if (isInWeixin()) {
						$('.box-zhifu.zhifu-zfb').hide();
						$('.box-zhifu.zhifu-weixin').show();
						$('.use-vouchers').show();
						$('.pay-btn').unbind('click');
						$('.pay-btn').click(function(){
							$('.loading').show();
							weixinPay();
						});
						weixinConfig();
					}else{
						$('.box-zhifu.zhifu-weixin').hide();
						$('.box-zhifu.zhifu-zfb').show();
						$('.box-zhifu').css('margin-bottom','0rem');
						$('.use-vouchers').show();
						$('.pay-btn').unbind('click');
						$('.pay-btn').click(function(){
							$('.loading').show();
							zhifubaoPay();	
						});
					}
 				}
 			}
			
			/*状态7,8  点击化妆完成按钮*/
			$('.cancle-booking-7, .cancle-booking-8').click(function(e) {
				$.ajax({
					url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/finishReservation',
					type: 'POST',
					data: getFinalRequestObject({accessToken: getAccessToken(), reservationId: getParam('reservationId')}),
					dataType: 'json',
					success: function (data) {
						if (data.code == 0) {
							window.location.reload();
						}else{
							alert(data.data.error);
						}

					}
				});
            });
			
			
			/*订单状态为6*/
			if(data.data.status == 6){
				$('.cancle-tuikuan').show();
				$('.booking-details-title').html(getStatusDesc(data.data.status,data.data.praised));
				$('.dresser-tel').show();
			}
			//0317
			$('.cancle-tuikuan').click(function(e) {
				$('.cancle-tuikuan').unbind('click');
				window.location.href = "refund.html?reservationId="+getParam('reservationId')+'&v=<%= VERSION %>';
			});
			/*状态6  点击退款按钮*/
			/*$('.cancle-tuikuan').click(function(e) {
				$('.cancle-tuikuan').unbind('click');
				$('.alert-box-tuikuan').fadeIn();
			});*/
			/*状态6  点击容我三思*/
			/*$('.tuikuan-ok').click(function(e) {
				$('.alert-box-tuikuan').fadeOut();
			});*/
			/*状态6  点击黑色屏幕任意地方关闭弹窗*/
			/*$('.alert-box-tuikuan .gray-box').click(function(e) {
				$('.alert-box-tuikuan').fadeOut();
			});*/
			/*状态6  点击弹框的确认退款按钮-->显示另一个弹框*/
			/*$('.tuikuan-cancle').click(function(e) {
                $('.ok-tuikuan').fadeIn();
            });*/
			/*状态6  点击退款按钮弹窗出来的--》确认退款按钮--》确认按钮*/
			/*$('.tuikuan-ok-btn-6').click(function(e) {
				$('.ok-tuikuan').fadeOut();
                $('.alert-box-tuikuan').fadeOut();
				//弹框消失发送请求
				$.ajax({
					url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/refundOperationNotify',
					type: 'post',
					data: getFinalRequestObject({accessToken: getAccessToken(), reservationId: getParam('reservationId')}),
					dataType: 'json',
					success: function (data) {
						//不做任何处理
					}
				});
            });*/
			
			/*订单状态为7*/
			if(data.data.status == 7){
				$('.cancle-booking-7').show();
				$('.booking-details-title').html(getStatusDesc(data.data.status,data.data.praised));
				$('.dresser-tel').show();
			}
			
			/*订单状态为8*/
			if(data.data.status == 8){
				$('.cancle-booking-8').show();
				$('.booking-details-title').html(getStatusDesc(data.data.status,data.data.praised));
				$('.dresser-tel').show();
			}

            /*=评价详情=*/
             /*=订单详情=*/
			 if(data.data.status == 9){
	                $('.booking-details-title').html(getStatusDesc(data.data.status,data.data.praised));
	                $('.box1').show();
	                
	                $('.li_workDetails').show();
	         }
			
             if(data.data.status == 10){
                $('.booking-details-title').html(getStatusDesc(data.data.status,data.data.praised));
                $('.box1').show();
                
                $('.li_workDetails').show();
             }
			
			/*订单状态为11*/
			if(data.data.status == 11){
				$('.booking-details-title').html(getStatusDesc(data.data.status,data.data.praised));
				$('.booking-details-title').css('background','#8c96a0');
			}
			
			
            //初始化页面
            $('.bh-name').html(data.data.name);
            $('.bl-photo').attr('src', data.data.profile);
			$('.comolain_title p img').attr('src', data.data.profile);
			
            // 是否给化妆师加V
            if (data.data.isVDresser == 0) {
                $('.img-vip').hide();
            }
            if (data.data.isVDresser == 1) {
                $('.img-vip').show();
            }

            // 星级评价
            for (var x = 0; x < data.data.starLevel; x++) {
                $('.bh-start').append('<img src="images/start_03.jpg" alt="" /> ');
            }

            //封面
            $('.hzs-img').attr('src', data.data.cover);
            //装束类型
            $('.work-type').html(data.data.workType);
            //价格
            $('.work-price .cost').html(data.data.cost);
            //标签
            for (var x = 0; x < data.data.tags.length && x < 3; x++) {
                $('.hr-bottom').append('<span>' + data.data.tags[x] + '</span>');
            }

            //订单编号
            $('.order-num').html(data.data.reservationId);
            //装束类型
            $('.order-lei').html(data.data.workType);
            //费用
            $('.order-price').html(data.data.cost);
            //时间
            $('.order-time').html(data.data.reservationTime);
            //地址
            $('.order-address').html(data.data.reservationAddress);
            
            //评价星级
            if(data.data.praised==1){
            	for (var x = 0; x < data.data.sumEvaluation; x++) {
                    $('.pingj').append('<img src="images/start_03.jpg" class="praisedStar" style="float:right;margin-top:18px;" alt="" /> ');
                }
            }          
        }
    });

    /*优惠券*/
    var reservationId = getParam('reservationId');
    $.ajax({
        url:'<%= CLI_HOST_API_URL %>/nggirl/app/cli/personalInfo/listCouponUse/1.3.2',
        type: 'get',
        data: getFinalRequestObject({accessToken: getAccessToken(), reservationId: reservationId}),
        dataType: 'json',
        success: function (data) {
            if (data.code == 0) {
				//判断优惠券张数
				if(data.data.length == 0){
					$('.no-vouchers').show();	
				}else{
					//生成优惠券
					for(var x = 0; x <data.data.length; x ++){
						//优惠券状态，0（未使用）
						if(data.data[x].useStatus == 0){																			
							$('.box-vouchers').append('<div money='+data.data[x].saleInfo+' couponId='+data.data[x].couponId+' class="voucher"><div class="voucher-top"><div class="vt-left"><p class="vl-top">'+(data.data[x].saleInfo).substring(0,data.data[x].saleInfo.length-1)+'</p><p class="vl-bottom">满'+data.data[x].lowPrice+'元可用</p></div><div class="vt-right"><p class="vr-top">'+data.data[x].fromChannel+'</p><p class="vr-bottom">'+data.data[x].fitProductName+'</p></div></div><div class="voucher-bottom"><p class="use-status">未使用</p><p class="use-date">'+data.data[x].deadLine+'</p></div></div>');
						}
					}
				}
            }
        }
    });

    /*点击优惠券返回价钱和优惠券ID*/
    $('.box-vouchers .voucher').live('click', function (e) {
		e.preventDefault();
        var couponId = $(this).attr('couponId');
        var money = $(this).attr('money')
        $('.box-vouchers').hide();
        $('.box').slideDown();
        $('.use-vouchers').attr('couponId', couponId);
        $('.uv-right').html('优惠' + money);
    });

    /*点击使用南瓜券 */
    $('.use-vouchers').live('touchstart',function (e) {
        $('.box').hide();
        $('.box-vouchers').slideDown();
    });

    /*点击容我三思 */
    $('.wdb-ok').click(function (e) {
        $('.alert-box-cancle-booking').fadeOut();
    });

    /*点击取消预约*/
    $('.cancle-booking').click(function (e) {
		window.location.href = "refund.html?reservationId="+getParam('reservationId')+'&v=<%= VERSION %>';
       /*0317 $('.alert-box-cancle-booking').fadeIn();*/
    });
});

function getStatusDesc(status,praised){
    var desc = '';
    if(status == 0){
        desc = '化妆师确认中，请小主耐心等待';
    }else if(status == 1 || status == 5){
        desc = '小主已取消订单，不再看看了么？';
    }else if(status == 2 || status == 3){
        desc = '化妆师未能接单，请小主重新挑选';
    }else if(status == 4){
        desc = '化妆师已接单，请小主付费打赏';
    }else if(status == 6){
        desc = '谢小主的赏金，请等待化妆师上门';
    }else if(status == 7){
        desc = '请小主安心享用美丽服务';
    }else if(status == 8){
        desc = '服务结束，请小主确认完成';
    }else if(status == 9){
        if(praised == 0)
            desc = '请美丽的小主为本次服务点评';
        else
            desc = '谢小主评价，期待与小主再次相遇';
    }else if(status == 10){
        if(praised == 0)
            desc = '请美丽的小主为本次服务点评';
        else
            desc = '谢小主评价，期待与小主再次相遇';
    }else if(status == 11){
        desc = '退款中，请小主耐心等待';
    }else if(status == 12){
        desc = '退款成功，南瓜姑娘会不断努力';
    }

    return desc;
}

function weixinConfig() {
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
                jsApiList: ["chooseWXPay"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        }
    });
}

//发起微信支付
function weixinPay() {

    //获取openid
    $.ajax({
        url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/register/weixin/getOpenId',
        type: 'get',
        dataType: 'json',
        data: getFinalRequestObject({accessToken:getAccessToken(),code: getParam('code')}),
        success: function (data) {
            if(data.code == 0){
                $.ajax({
                    url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/payReservation',
                    type: 'post',
                    dataType: 'json',
                    data: getFinalRequestObject({
                        reservationId: getParam('reservationId'),
                        payType: 1,
                        accessToken: getAccessToken(),
                        couponId:toString($('.use-vouchers').attr('couponId')),
                        weixinPayType: 2,
                        weixinOpenId: data.data.openid
                    }),
                    success: function (data) {
						$('.loading').hide();
                        //未支付完成
                        if(data.data.order_status == 1){
                            if (isWeixinLessThan5()) {
                                alert('微信版本过低!请先升级');
                            } else {
                                weixinPayReservation(getParam('reservationId'));
                            }
                        }else{
                            window.location.href= '/nggirl/h5/cosmetic/orderInformation.html?reservationId='+getParam('reservationId')+'&v=<%= VERSION %>';
                        }

                    }
                });
            }else{
                //获取openid出错
                refreshWeixinPage(getParam('reservationId'));
            }
        }
    });

}


//js调起微信支付
function weixinPayReservation(reservationId) {
    $.ajax({
        url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/weixinjs/getOrder',
        type: 'post',
        dataType: 'json',
        data: getFinalRequestObject({reservationId: reservationId, accessToken: getAccessToken()}),
        success: function (data) {
            if(data.code == 0){
                wx.chooseWXPay({
                    timestamp: data.data.weixin_timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: data.data.weixin_noncestr, // 支付签名随机串，不长于 32 位
                    package: data.data.weixin_package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: data.data.weixin_signtype, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: data.data.weixin_sign, // 支付签名
                    success: function (res) {
                        // 支付成功后的回调函数
                        //alert('支付成功res=' + res.errMsg);
                        window.location.href= '/nggirl/h5/cosmetic/orderInformation.html?reservationId='+reservationId+'&v=<%= VERSION %>';
                    },
                    fail: function (res) {
                        //alert('支付失败res=' + res.errMsg);
                        refreshWeixinPage(reservationId);
                    },
                    cancel: function (res) {
                        //alert('支付取消res=' + res.errMsg);
                        refreshWeixinPage(reservationId);
                    }
                });
            }else{
                //获取订单信息出错
                refreshWeixinPage(getParam('reservationId'));
            }

        }
    });
}


//发起支付宝支付
function zhifubaoPay() {
    checkAccessTokenLogin(function(){
        var resData = {
            reservationId:getParam('reservationId'),
            payType:2,
            couponId:toString($('.use-vouchers').attr('couponId')),
            accessToken:getAccessToken()
        };
        $.ajax({
            url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/payReservation',
            type:'post',
            dataType:'json',
            data:getFinalRequestObject(resData),
            success:function(data){
				$('.loading').hide();
                var payurl = '/nggirl/app/charge/alipay/h5/payReservation';
                var queryStringData = getFinalRequestObject({reservationId:getParam('reservationId'),accessToken:getAccessToken()});
                var queryString = '';
                for(var prop in queryStringData){
                    queryString += (prop + '=' + queryStringData[prop]+'&');
                }
                window.location.href = payurl + '?' +queryString+'&v=<%= VERSION %>';
            }
        });
    });

    return false;

}

function getWeixinLinkUrl(reservationId){
    var redirectUri = encodeURIComponent(getZhifuBaoLinkUrl(reservationId));
    var scope = 'snsapi_base';
    var state = "weixinpay";
    var appid = getFwhAppId();//由param.js初始化
    return "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri="
        +redirectUri+"&response_type=code&scope="+scope+"&state="+state+"#wechat_redirect";
}

function getZhifuBaoLinkUrl(reservationId){
    var str = "<%= WEIXIN_BOUND_DOMAIN_URL %>/nggirl/h5/cosmetic/orderInformation.html?reservationId="
        + reservationId+'&v=<%= VERSION %>';
    if(window.location.protocol == 'https:'){
        return str;
    }else{
        return 'http:' + str.substring(6)
    }
}

function refreshWeixinPage(reservationId){
    window.location.href = getWeixinLinkUrl(reservationId);
}
