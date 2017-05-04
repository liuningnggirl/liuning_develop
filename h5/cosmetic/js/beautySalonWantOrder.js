$(function () {
	//获取弹框高度
	$('.alert-box').height($(window).height());
	var price = 0;
	//获取灰色弹框高度
	$('.loading').height($(window).height());
	
	//选中规则
	$('.om-right').click(function(e) {
        if(typeof($(this).attr('seled')) != "undefined"){
			$(this).removeAttr('seled');
			$('.or-get').hide();	
		}else{
			$(this).attr('seled','seled');	
			$('.or-get').show();	
		}
    });
	
	//点击”预约须知“文字
	$('.om-left .ol-right').click(function(e) {
        $('.alert-box').fadeIn();
    });
	
	//点击弹框的“确定按钮“弹框消失
	$('.a-btn-ok').click(function(e) {
        $('.alert-box').fadeOut();
    });
	
	//点击“优惠券灰色背景”弹框消失
	$('.alert-box').click(function(e) {
        $(this).fadeOut();
    });
	
	//获取优惠券列表默认为1
	getVoucherFn(1);
	
	//获取预约信息
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/salon/works/prepareReservationInfo/1.3',getFinalRequestObject({accessToken: getAccessToken(),unionProductId: getParam('unionProductId'),productType: getParam('productType')}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			$('.hc-left .hzs-img').attr('src',data.data.cover);
			$('.hc-right .hr-top').html(data.data.title);
			$('.hr-bottom .hb-num').html(data.data.price);
			$('.bh-left .bl-photo').attr('src',data.data.profile);
			if(data.data.dresserName.length>7){
				var strn=data.data.dresserName;
				strn= strn.substring(0,7)+"..." ;
				$('.bh-name .br-name').html(strn); 
				}else{
				$('.bh-name .br-name').html(data.data.dresserName);
				}
			if(data.data.sex == 0){
				$('.br-sex').attr('src','images/boy.png');
			};
			if(data.data.sex == 1){
				$('.br-sex').attr('src','images/girl.png');
			};
			$('.bh-start').html(getStartFn(data.data.starLevel));
			$('.content .order-time').html(data.data.holdTime);
			$('.content .order-address').html(data.data.holdPlace);
			$('.content .order-cost').html(data.data.price+'元');
			$('.content .order-cost').attr('price',data.data.price);
			$('.bl-true-cost').html(data.data.price);
			$('.a-content').html(getOrderMessageFn(data.data.resRules));
			price = data.data.price;
		};
		if(data.code == 1){
			alert(data.data.error);
		};
	});
		
	//控制预约数量
	//减
	$('.on-jian').click(function(e) {
		$('.uv-right').html('');
		$('.box-vouchers').children('.voucher').remove();
		if(parseInt($('.on-num').html()) <= 1){
			getVoucherFn(1);
			$('.on-num').html(1);
		}else{
			$('.on-num').html(parseInt($('.on-num').html()) - 1);
			$('.content .order-cost').html((price * parseInt($('.on-num').html())).toFixed(1)+ '元');
			$('.bl-true-cost').html((price * parseInt($('.on-num').html())).toFixed(1));
			getVoucherFn($('.on-num').html());
		}
    });
	
	//加
	$('.on-plus').click(function(e) {
		$('.uv-right').html('');
		$('.box-vouchers').children('.voucher').remove();
		if($('.on-num').html() >= getParam('peopleNum')){
			getVoucherFn(1);
			alert('已经达到成团上限！！');	
		}else{
			$('.on-num').html(parseInt($('.on-num').html()) + 1);
			$('.content .order-cost').html((price * parseInt($('.on-num').html())).toFixed(1)+ '元');
			$('.bl-true-cost').html((price * parseInt($('.on-num').html())).toFixed(1));
			getVoucherFn($('.on-num').html());
		}
    });
	
    /*点击使用南瓜券 */
    $('.use-voucherss').click(function (e) {
		$('.btn').hide();
        $('.box').hide();
		$('.bl-true-cost').html($('.bl-true-cost').html());
        $('.box-vouchers').slideDown();
    });
	
    /*点击优惠券返回价钱和优惠券ID*/	
	$('.box-vouchers').delegate(".voucher","click",function(){ 
		var couponId = $(this).attr('couponId');
        var money = $(this).attr('money')
        var cutcost = $(this).attr('cutCost')
        $('.box-vouchers').hide();
        $('.box').slideDown();
		$('.btn').show();
        $('.use-voucherss').attr('couponId', couponId);
        $('.uv-right').html('优惠' + money);
		if(($('.order-cost').attr('price')-cutcost) < 0){
			$('.bl-true-cost').html(0);
		}else{
			$('.bl-true-cost').html($('.order-cost').attr('price')-cutcost);	
		}
	});
	
	//判断是否是在微信内打开时显示的图标
	if (isInWeixin()) {
		$('.box-zhifu.zhifu-zfb').hide();
		$('.box-zhifu.zhifu-weixin').show();
		$('.use-voucherss').show();
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
		$('.use-voucherss').show();
		$('.pay-btn').unbind('click');
		$('.pay-btn').click(function(){
			$('.loading').show();
			zhifubaoPay();	
		});
	}
	
	//点击”确认并支付“按钮
	$('.bo-right').click(function(e) {
        if($.trim($('.order-tel').val()) == ''){
			alert('请填写联系电话！！');	
		}else if(typeof($('.om-right').attr('seled')) == "undefined"){
			alert('哎呦，您还没接受预约须知哦~');
		}else if(isPhoneNum($.trim($('.order-tel').val())) == false){
			alert('请填写正确的手机号!!');
		}else{
			if (isInWeixin()) {
				$('.loading').show();
				weixinPay();
			}else{
				$('.loading').show();
				zhifubaoPay();	
			}
		}
    });
});

//验证手机号
function isPhoneNum(phoneNum){
	var reg = /^1(([3|8][0-9])|(5[^4|\D]))\d{8}$/;
	return reg.test(phoneNum);
}

//获取化妆师星级评价
function getStartFn(num){
	var str = '';
	for(var x = 0; x < num ; x ++){
		str += '<img src="images/start_03.jpg" alt="" /> ';	
	}
	return str;
}

//获取预约i信息
function getOrderMessageFn(rule){
	var str = '';
	for(var x = 0; x < rule.length; x ++){
		str += rule[x]+'<br />';	
	}
	return str;
}

//获取优惠券列表
function getVoucherFn(reservationNum){
	//获取优惠券
    $.ajax({
        url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/salon/works/listCouponUse/1.3.2',
        type: 'get',
        data: getFinalRequestObject({accessToken: getAccessToken(), unionProductId:getParam('unionProductId'),reservationNum:reservationNum}),
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
							$('.box-vouchers').append('<div money='+data.data[x].saleInfo+' cutCost='+data.data[x].cutCost+' couponId='+data.data[x].couponId+' class="voucher"><div class="voucher-top"><div class="vt-left"><p class="vl-top">'+(data.data[x].saleInfo).substring(0,data.data[x].saleInfo.length-1)+'</p><p class="vl-bottom">满'+data.data[x].lowPrice+'元可用</p></div><div class="vt-right"><p class="vr-top">'+data.data[x].fromChannel+'</p><p class="vr-bottom">'+data.data[x].fitProductName+'</p></div></div><div class="voucher-bottom"><p class="use-status">未使用</p><p class="use-date">'+data.data[x].deadLine+'</p></div></div>');
						}
					}
				}
            };
			if(data.code == 1){
				alert(data.data.error);
			};
        }
    });
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
var unionResId ='';
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
                    url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/salon/works/payProReservation/1.3',
                    type: 'post',
                    dataType: 'json',
                    data: getFinalRequestObject({
                        unionProductId: getParam('unionProductId'),//产品联合编号
                        payType: 1,
                        accessToken: getAccessToken(),
                        couponId:toString($('.use-voucherss').attr('couponId')),
						reservationNum:$('.on-r .on-num').html(),
						phoneNum:$('.right .order-tel').val(),
                        weixinPayType: 2,
                        weixinOpenId: data.data.openid
                    }),
                    success: function (data) {
						if(data.code == 0){
							unionResId = data.data.unionResId;
							var timestamp = data.data.weixin_timestamp;
							var nonceStr = data.data.weixin_noncestr;
							var package = data.data.weixin_package;
							var paySign = data.data.weixin_sign;
							var isComplete = data.data.isComplete;
							$('.loading').hide();
							//未支付完成
							if(data.data.order_status == 1){
								if (isWeixinLessThan5()) {
									alert('微信版本过低!请先升级');
								}else{
									weixinPayReservation(unionResId,getParam('productType'),timestamp,nonceStr,package,paySign,isComplete);	
								}
							}else{
								window.location.href= '<%= CLI_HOST_API_URL %>/nggirl/h5/cosmetic/beautySalonOrderInformation.html?unionResId='+ unionResId +'&resType='+getParam('productType')+'&v=<%= VERSION %>';
							};
						};
						if(data.code == 1){
							alert(data.data.error);
						};
                    }
                });
            }else{
                //获取openid出错
                refreshWeixinPage(unionResId,getParam('productType'),getParam('peopleNum'));
            }
        }
    });

}

//js调起微信支付
function weixinPayReservation(unionProductId,productType,timestamp,nonceStr,package,paySign,isComplete) {
   wx.chooseWXPay({
		timestamp: timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
		nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
		package: package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
		signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
		paySign: paySign, // 支付签名
		success: function (res) {
			// 支付成功后的回调函数
			//alert('支付成功res=' + res.errMsg);
			//判断是否成团
			if(isComplete == 0){//未成团
				window.location.href= '<%= CLI_HOST_API_URL %>/nggirl/h5/cosmetic/beautySalonGroupFailure.html?unionResId='+ unionResId +'&resType='+productType+'&v=<%= VERSION %>';
			};
			if(isComplete == 1){//成团
				window.location.href= '<%= CLI_HOST_API_URL %>/nggirl/h5/cosmetic/beautySalonGroupSuccess.html?unionResId='+ unionResId +'&resType='+productType+'&v=<%= VERSION %>';
			};
		},
		fail: function (res) {
			//alert('支付失败res=' + res.errMsg);
			refreshWeixinPage(unionResId,productType,getParam('peopleNum'));
		},
		cancel: function (res) {
			//alert('支付取消res=' + res.errMsg);
			refreshWeixinPage(unionResId,productType,getParam('peopleNum'));
		}
	});
}


//发起支付宝支付
function zhifubaoPay() {
    checkAccessTokenLogin(function(){
		$.ajax({
			url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/salon/works/payProReservation/1.3',
			type: 'post',
			dataType: 'json',
			data: getFinalRequestObject({
				unionProductId: getParam('unionProductId'),//产品联合编号
				payType: 2,
				accessToken: getAccessToken(),
				couponId:toString($('.use-voucherss').attr('couponId')),
				reservationNum:$('.on-r .on-num').html(),
				phoneNum:$('.right .order-tel').val(),
			}),
			success: function (data) {
				if(data.code == 0){
					$('.loading').hide();
					unionResId = data.data.unionResId;
					var isComplete = data.data.isComplete;
					var order_status = data.data.order_status;
					//判断当前支付状态，如果为2，择不吊起支付
					if(order_status == 2){
						//判断当前成团状态
						if(isComplete == 0){//0：未成团
							window.location.href="beautySalonGroupFailure.html?unionResId="+unionResId+'&resType='+getParam('productType')+'&v=<%= VERSION %>';
						};
						if(isComplete == 1){//1：成团
							window.location.href="beautySalonGroupSuccess.html?unionResId="+unionResId+'&resType='+getParam('productType')+'&v=<%= VERSION %>';
						};
					}else{
						var payurl = '<%= CLI_HOST_API_URL %>/nggirl/app/charge/alipay/h5/paySalonReservation';
						var queryStringData = getFinalRequestObject({unionResId:unionResId,accessToken:getAccessToken()});
						var queryString = '';
						for(var prop in queryStringData){
							queryString += (prop + '=' + queryStringData[prop]+'&');
						}
						window.location.href = payurl + '?' +queryString+'&v=<%= VERSION %>';
					}
				};
				if(data.code == 1){
					$('.loading').hide();
					alert(data.data.error);
				};
			}
		});
    },'beautySalonWorkDetails.html'+window.location.search);
    return false;
}

function getWeixinLinkUrl(unionResId,productType,peopleNum){
    var redirectUri = encodeURIComponent(getZhifuBaoLinkUrl(unionResId,productType,peopleNum));
    var scope = 'snsapi_base';
    var state = "weixinpay";
    var appid = getFwhAppId();//由param.js初始化
    return "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri="
        +redirectUri+"&response_type=code&scope="+scope+"&state="+state+"#wechat_redirect";
}

function getZhifuBaoLinkUrl(unionResId,productType,peopleNum){
    var str = "<%= WEIXIN_BOUND_DOMAIN_URL %>/nggirl/h5/cosmetic/beautySalonWantOrder.html?unionResId="
        + unionResId+'&resType='+productType+'&unionProductId='+getParam('unionProductId')+'&productType='+getParam('productType')+'&v=<%= VERSION %>';
	if(window.location.protocol == 'https:'){
		return str;
	}else{
		return 'http:' + str.substring(6)
	}
}

function refreshWeixinPage(unionResId,productType,peopleNum){
    window.location.href = getWeixinLinkUrl(unionResId,productType,peopleNum);
}


