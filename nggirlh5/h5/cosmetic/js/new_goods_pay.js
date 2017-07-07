$(function(){
	$('.loading').height($(window).height());
	if (isInWeixin()) {
		$(".type1").show();
		weixinConfig();
	}else{
		$(".type2").show();
	}
	$(".top").live("click",function(){
		window.location.href="new_goods_address.html";
	});
	$(".chooseType .type").live("click",function(){
		$(this).addClass("on");
		$(this).siblings().removeClass("on");
	})
	var orderId='';
	$(".btn_box .btn .pay").live("click",function(){
		$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/item/cart/makeOrder/4.0.6',getFinalRequestObject({accessToken:getAccessToken(),items:items,addressId:$(".right").attr("addressId"),transCompanyCode:$(".right").attr("transCompanyCode"),buyerMessage:$(".leveMessage").val(),source:localStorage.getItem("source")}),function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				orderId=data.data.orderId;
				if (isInWeixin()) {
					$('.loading').show();
					weixinPay();	
				}else{
					$('.loading').show();
					zhifubaoPay();	
				}
			}else{
				alert(data.data.error);
			}
		});
	})
	var items=localStorage.getItem("items");
	getAccount();
	function getAccount(){
		var addressId='';
		if(getParam("addressId") != "" || getParam("addressId") == "null" || getParam("addressId")== undefined){
			addressId=getParam("addressId");
		}
		$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/item/cart/account/4.0.6',getFinalRequestObject({accessToken:getAccessToken(),items:items,addressId:getParam("addressId")}),function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				var str='';
				str+='<div class="right" addressId="'+data.data.addressId+'" transCompanyCode="'+data.data.transCompanyCode+'">';
				if(data.data.hasAddress == 0){
					str+='<p class="noaddress">请选择一个地址</p></div>';
				}else{
					str+='<p class="message"><span class="consignee">收件人：'+data.data.consignee+'</span><span class="phone">'+data.data.contact+'</span></p><p class="address">'+data.data.address+'</p></div>';
				}
				$(".top").append(str);
				var way=data.data.transCompanyName+' '+splitNum(data.data.transAmount);
				$(".delivery .way").html(way);
				var str1='';
				str1+='<div class="goods">';
				$.each(data.data.items, function(key,val){
					str1+='<div class="box"><img src="'+val.imgUrl+'">';
					str1+='<div class="goodsRight"><p class="goodsName">'+val.reamTitle+'</p><p class="skuName">'+val.skuName+'</p><p class="salePrice"> '+splitNum(val.salePrice)+'<span class="quantity">X '+val.quantity+'</span></p></div>';
					str1+='</div>';
				});
				str1+='</div>';
				str1+='<div class="monDet"><p>商品总计: '+splitNum(data.data.goodsAmount)+'</p>';
				if(data.data.isTransFree == 1){
					str1+='<p>邮递运费: '+splitNum(0)+'</p></div>';
				}else{
					str1+='<p>邮递运费：'+splitNum(data.data.transAmount)+'</p></div>';
				}
				$(".goodsDet").append(str1);
				$(".btn_box .btn .money").html(splitNum(data.data.orderAmount));
				$('.loading').hide();
			}else{	
				alert(data.data.error);	
			}
		});
	}
	//拆分小数点
	function splitNum(num){
		var str = num.toString();
		var arr = [];
		var endStr = '';
		if(str.indexOf('.')>=0){
			arr=str.split('.');
			endStr = '<span class="mon">¥'+arr[0]+'</span><span class="dian">.'+arr[1]+'</span>'
		}else{
			endStr = '<span class="mon">¥'+str+'</span><span class="dian">.00</span>'	
		}
		return endStr;
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
	var orderCode ='';
	var orderAmount='';
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
						url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/item/order/payOrder/3.1.0',
						type: 'post',
						dataType: 'json',
						data: getFinalRequestObject({
							accessToken: getAccessToken(),
							orderId: orderId,//产品联合编号
							payType: 1,
							weixinPayType: 2,
							weixinOpenId: data.data.openid
						}),
						success: function (data) {
							if(data.code == 0){
								orderCode = data.data.orderCode;
								var timestamp = data.data.weixin.timestamp;
								var nonceStr = data.data.weixin.nonceStr;
								var package = data.data.weixin.packag;
								var paySign = data.data.weixin.sign;
								orderAmount = data.data.orderAmount;
								$('.loading').hide();
								//未支付完成
								if(data.data.payStatus == 1){
									if (isWeixinLessThan5()) {
										alert('微信版本过低!请先升级');
									}else{
										weixinPayReservation(orderCode,timestamp,nonceStr,package,paySign,orderAmount);	
									}
								}else{
									window.location.href= '<%= CLI_HOST_API_URL %>/nggirl/h5/cosmetic/new_goods_pay_success.html?orderCode='+ orderCode +'&orderAmount='+orderAmount+'&v=<%= VERSION %>';
								};
							};
							if(data.code == 1){
								alert(data.data.error);
							};
						}
					});
				}else{
					//获取openid出错
					refreshWeixinPage();
				}
			}
		});
	
	}
	
	//js调起微信支付
	function weixinPayReservation(orderCode,timestamp,nonceStr,package,paySign,orderAmount) {
	   wx.chooseWXPay({
			timestamp: timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
			nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
			package: package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
			signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
			paySign: paySign, // 支付签名
			success: function (res) {
				// 支付成功后的回调函数
				window.location.href= '<%= CLI_HOST_API_URL %>/nggirl/h5/cosmetic/new_goods_pay_success.html?orderCode='+ orderCode +'&orderAmount='+orderAmount+'&v=<%= VERSION %>';
			},
			fail: function (res) {
				//alert('支付失败res=' + res.errMsg);
				var redirectUrl;
				if(isInWeixin()){
					redirectUrl = getWeixinFailLinkUrl();
					window.location.href=redirectUrl;
				}else{
					redirectUrl =  getZhifuBaoFailLinkUrl();
					window.location.href=redirectUrl;
				}
				//window.location.href= '<%= CLI_HOST_API_URL %>/nggirl/h5/cosmetic/new_goods_pay_fail.html?orderCode='+ orderCode +'&orderAmount='+orderAmount+'&v=<%= VERSION %>';
			},
			cancel: function (res) {
				//alert('支付取消res=' + res.errMsg);
				var redirectUrl;
				if(isInWeixin()){
					redirectUrl = getWeixinFailLinkUrl();
					window.location.href=redirectUrl;
				}else{
					redirectUrl =  getZhifuBaoFailLinkUrl();
					window.location.href=redirectUrl;
				}
				//window.location.href= '<%= CLI_HOST_API_URL %>/nggirl/h5/cosmetic/new_goods_pay_fail.html?orderCode='+ orderCode +'&orderAmount='+orderAmount+'&v=<%= VERSION %>';
				//refreshWeixinPage();
			}
		});
	}	
	//发起支付宝支付
	function zhifubaoPay() {
		checkAccessTokenLogin(function(){
			$.ajax({
				url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/item/order/payOrder/3.1.0',
				type: 'post',
				dataType: 'json',
				data: getFinalRequestObject({
					accessToken: getAccessToken(),
					orderId: orderId,//产品联合编号
					payType: 2
				}),
				success: function (data) {
					if(data.code == 0){
						$('.loading').hide();
						orderCode = data.data.orderCode;
						var orderAmount = data.data.orderAmount;
						//判断当前支付状态，如果为2，择不吊起支付
						if(data.data.payStatus == 2){
							window.location.href= '<%= CLI_HOST_API_URL %>/nggirl/h5/cosmetic/new_goods_pay_success.html?orderCode='+ orderCode +'&orderAmount='+orderAmount+'&v=<%= VERSION %>';	
						}else{
							var payurl = '<%= CLI_HOST_API_URL %>/nggirl/app/cli/item/order/payOrderAlipayH5/4.0.6';
							var queryStringData = getFinalRequestObject({orderId:orderId,accessToken:getAccessToken()});
							var queryString = '';
							for(var prop in queryStringData){
								queryString += (prop + '=' + queryStringData[prop]+'&');
							}
							window.location.href = payurl + '?' +queryString+'v=<%= VERSION %>';
						}
					};
					if(data.code == 1){
						$('.loading').hide();
						alert(data.data.error);
					};
				}
			});
		},'new_goods_pay.html'+window.location.search);
		return false;
	}
	
	function getWeixinLinkUrl(){
		var redirectUri = encodeURIComponent(getZhifuBaoLinkUrl());
		var scope = 'snsapi_base';
		var state = "weixinpay";
		var appid = getFwhAppId();//由param.js初始化
		return "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri="
			+redirectUri+"&response_type=code&scope="+scope+"&state="+state+"#wechat_redirect";
	}
	function getZhifuBaoLinkUrl(){
		var str = "<%= WEIXIN_BOUND_DOMAIN_URL %>/nggirl/h5/cosmetic/new_goods_pay.html?v=<%= VERSION %>";
		if(window.location.protocol == 'https:'){
			return str;
		}else{
			return 'http:' + str.substring(6)
		}
	}
	function refreshWeixinPage(){
		window.location.href = getWeixinLinkUrl();
	}
	function getWeixinFailLinkUrl(){
		var redirectUri = encodeURIComponent(getZhifuBaoFailLinkUrl());
		var scope = 'snsapi_base';
		var state = "weixinpay";
		var appid = getFwhAppId();//由param.js初始化
		return "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri="
			+redirectUri+"&response_type=code&scope="+scope+"&state="+state+"#wechat_redirect";
	}
	function getZhifuBaoFailLinkUrl(){
		var str = "<%= WEIXIN_BOUND_DOMAIN_URL %>/nggirl/h5/cosmetic/new_goods_pay_fail.html?orderCode="+orderCode+'&orderAmount='+orderAmount+'&orderId='+orderId+'&v=<%= VERSION %>';
		if(window.location.protocol == 'https:'){
			return str;
		}else{
			return 'http:' + str.substring(6)
		}
	}
})